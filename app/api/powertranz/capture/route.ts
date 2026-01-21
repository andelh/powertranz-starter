import { NextResponse } from "next/server";
import { createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = await request.json();
  const { transactionIdentifier, amount } = data;

  console.log("Capture request (sanitized):", sanitizeForLogging({ transactionIdentifier, amount }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/capture", {
      TransactionIdentifier: transactionIdentifier,
      TotalAmount: Number(amount),
    });

    console.log("Capture response:", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz capture error:", error);
    return NextResponse.json(
      { error: "Capture failed", message: "Failed to capture authorization" },
      { status: 500 }
    );
  }
}
