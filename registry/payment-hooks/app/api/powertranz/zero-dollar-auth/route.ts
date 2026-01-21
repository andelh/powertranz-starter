import { NextResponse } from "next/server";
import { ZeroDollarAuthProps, createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as ZeroDollarAuthProps;

  console.log("Zero dollar auth request (sanitized):", sanitizeForLogging({
    amount: data.amount,
    orderId: data.orderId,
    transactionIdentifier: data.transactionIdentifier,
    cardNumber: data.cardNumber,
    cardholderName: data.cardholderName,
  }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/spi/auth", {
      TransactionIdentifier: data.transactionIdentifier,
      TotalAmount: Number(data.amount),
      CurrencyCode: "780",
      ThreeDSecure: true,
      FraudCheck: true,
      OrderIdentifier: data.orderId,
      Source: {
        CardPan: data.cardNumber,
        CardCvv: data.cardCvv || "123",
        CardExpiration: data.cardExpiration || "2505",
        CardholderName: data.cardholderName || "John Baker",
      },
      ExtendedData: {
        ThreeDSecure: {
          ChallengeWindowSize: 4,
          ChallengeIndicator: "01",
        },
        MerchantResponseUrl: `${data.siteRoot}/api/powertranz/auth-response`,
      },
    });

    console.log("Zero dollar auth response (sanitized):", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz zero dollar auth error:", error);
    return NextResponse.json(
      { error: "Zero dollar auth failed", message: "Failed to process zero dollar authorization" },
      { status: 500 }
    );
  }
}
