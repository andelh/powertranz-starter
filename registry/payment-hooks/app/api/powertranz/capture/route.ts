import { NextResponse } from "next/server";
import { CapturePaymentProps, createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as CapturePaymentProps;

  console.log("Capture request (sanitized):", sanitizeForLogging({
    transactionIdentifier: data.transactionIdentifier,
    amount: data.amount,
  }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/capture", {
      TransactionIdentifier: data.transactionIdentifier,
      TotalAmount: Number(data.amount),
    });

    console.log("Capture response (sanitized):", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz capture error:", error);
    return NextResponse.json(
      { error: "Capture failed", message: "Failed to capture authorization" },
      { status: 500 }
    );
  }
}
