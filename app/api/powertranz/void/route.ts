import { NextResponse } from "next/server";
import { VoidProps, createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as VoidProps;

  console.log("Void request (sanitized):", sanitizeForLogging({
    transactionIdentifier: data.transactionIdentifier,
  }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/void", {
      Void: true,
      TransactionIdentifier: data.transactionIdentifier,
      CurrencyCode: "780",
    });

    console.log("Void response (sanitized):", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz void error:", error);
    return NextResponse.json(
      { error: "Void failed", message: "Failed to void authorization" },
      { status: 500 }
    );
  }
}
