import { NextResponse } from "next/server";
import { DirectSaleProps, createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as DirectSaleProps;

  console.log("Direct sale request (sanitized):", sanitizeForLogging({
    amount: data.amount,
    orderId: data.orderId,
    transactionIdentifier: data.transactionIdentifier,
  }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/sale", {
      TransactionIdentifier: data.transactionIdentifier,
      TotalAmount: Number(data.amount),
      CurrencyCode: data.currencyCode || "780",
      ThreeDSecure: false,
      OrderIdentifier: data.orderId,
      Source: {
        CardPan: data.cardNumber,
        CardCvv: data.cardCvv,
        CardExpiration: data.cardExpiration,
        CardholderName: data.cardholderName,
      },
    });

    console.log("Direct sale response (sanitized):", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz sale error:", error);
    return NextResponse.json(
      { error: "Sale failed", message: "Failed to process direct sale" },
      { status: 500 }
    );
  }
}
