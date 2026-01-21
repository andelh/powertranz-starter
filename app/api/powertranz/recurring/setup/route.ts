import { NextResponse } from "next/server";
import { RecurringSetupProps, createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as RecurringSetupProps;

  console.log("Recurring setup request (sanitized):", sanitizeForLogging({
    amount: data.amount,
    orderId: data.orderId,
    transactionIdentifier: data.transactionIdentifier,
    startDate: data.startDate,
    expiryDate: data.expiryDate,
    frequency: data.frequency,
  }));

  const client = createPowertranzClient();

  const today = new Date();
  const startDate = new Date(data.startDate);
  const isToday = startDate.toDateString() === today.toDateString();

  const extendedData: Record<string, unknown> = {
    Recurring: {
      Managed: true,
      StartDate: data.startDate.replace(/-/g, ""),
      ExpiryDate: data.expiryDate.replace(/-/g, ""),
      Frequency: data.frequency,
    },
  };

  if (isToday && data.threeDSecure) {
    extendedData.ThreeDSecure = {
      ChallengeWindowSize: 4,
      ChallengeIndicator: "01",
    };
  }

  const requestBody: Record<string, unknown> = {
    TransactionIdentifier: data.transactionIdentifier,
    TotalAmount: Number(data.amount),
    CurrencyCode: data.currencyCode || "780",
    ThreeDSecure: data.threeDSecure ?? true,
    RecurringInitial: true,
    OrderIdentifier: data.orderId,
    ExtendedData: extendedData,
  };

  if (data.cardToken) {
    requestBody.Source = { Token: data.cardToken };
  } else if (data.cardPan) {
    if (!data.cardCvv || !data.cardExpiration || !data.cardholderName) {
      return NextResponse.json(
        { error: "Validation failed", message: "When providing cardPan, cardCvv, cardExpiration, and cardholderName are all required" },
        { status: 400 }
      );
    }
    requestBody.Source = {
      CardPan: data.cardPan,
      CardCvv: data.cardCvv,
      CardExpiration: data.cardExpiration,
      CardholderName: data.cardholderName,
    };
  }

  if (data.email) {
    requestBody.BillingAddress = { EmailAddress: data.email };
  }

  const endpoint = isToday ? "/spi/sale" : "/spi/auth";

  try {
    const response = await client.post(endpoint, requestBody);

    console.log("Recurring setup response (sanitized):", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz recurring setup error:", error);
    return NextResponse.json(
      { error: "Recurring setup failed", message: "Failed to setup recurring transaction" },
      { status: 500 }
    );
  }
}
