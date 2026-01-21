import { NextResponse } from "next/server";
import { TokenizeCardProps, createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as TokenizeCardProps;
  const {
    cardNumber,
    cvv,
    expirationYear,
    expirationMonth,
    cardholderName,
    currencyCode,
  } = data;

  console.log("Tokenize request (sanitized):", sanitizeForLogging({
    cardNumber,
    cvv,
    expirationYear,
    expirationMonth,
    cardholderName,
    currencyCode,
  }));

  const transactionIdentifier = crypto.randomUUID();
  const orderId = crypto.randomUUID();

  const client = createPowertranzClient();

  try {
    const response = await client.post("/riskmgmt", {
      AddressMatch: false,
      CurrencyCode: currencyCode || "780",
      TransactionIdentifier: transactionIdentifier,
      TotalAmount: 0,
      Tokenize: true,
      ThreeDSecure: false,
      OrderIdentifier: orderId,
      Source: {
        CardPan: cardNumber,
        CardCvv: cvv,
        CardExpiration: `${expirationYear}${expirationMonth}`,
        CardholderName: cardholderName,
      },
    });

    console.log("Tokenize response:", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz tokenize error:", error);
    return NextResponse.json(
      { error: "Tokenization failed", message: "Failed to tokenize card" },
      { status: 500 }
    );
  }
}
