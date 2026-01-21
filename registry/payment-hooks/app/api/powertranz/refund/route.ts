import { NextResponse } from "next/server";
import { RefundProps, createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as RefundProps;

  console.log("Refund request (sanitized):", sanitizeForLogging({
    transactionIdentifier: data.transactionIdentifier,
    amount: data.amount,
  }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/refund", {
      Refund: true,
      TransactionIdentifier: data.transactionIdentifier,
      TotalAmount: Number(data.amount),
      CurrencyCode: data.currencyCode || "780",
    });

    console.log("Refund response (sanitized):", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz refund error:", error);
    return NextResponse.json(
      { error: "Refund failed", message: "Failed to process refund" },
      { status: 500 }
    );
  }
}
