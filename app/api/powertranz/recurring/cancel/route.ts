import { NextResponse } from "next/server";
import { RecurringCancelProps, createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as RecurringCancelProps;

  console.log("Recurring cancel request (sanitized):", sanitizeForLogging({
    recurringIdentifier: data.recurringIdentifier,
  }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/admin/recurring/cancel", {
      RecurringIdentifier: data.recurringIdentifier,
    });

    console.log("Recurring cancel response (sanitized):", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz recurring cancel error:", error);
    return NextResponse.json(
      { error: "Recurring cancel failed", message: "Failed to cancel recurring transaction" },
      { status: 500 }
    );
  }
}
