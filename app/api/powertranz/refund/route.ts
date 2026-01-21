import { NextResponse } from "next/server";
import { createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const data = await request.json();
  const { transactionIdentifier, amount } = data;

  console.log("Refund request (sanitized):", sanitizeForLogging({ transactionIdentifier, amount }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/refund", {
      Refund: true,
      TransactionIdentifier: transactionIdentifier,
      TotalAmount: Number(amount),
      CurrencyCode: "780",
    });

    console.log("Refund response:", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz refund error:", error);
    return NextResponse.json(
      { error: "Refund failed", message: "Failed to process refund" },
      { status: 500 }
    );
  }
}
