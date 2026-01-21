import { NextRequest, NextResponse } from "next/server";
import { sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("Recurring webhook received (sanitized):", sanitizeForLogging(data));

    const responseCode = data.ResponseCode || data.IsoResponseCode;

    const validResponseCodes = ["R0", "R1", "R4", "R5", "RD0", "RD1", "RD2", "RD3", "RE"];
    if (responseCode && !validResponseCodes.includes(responseCode)) {
      console.warn("Unknown recurring response code:", responseCode);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Recurring webhook error:", error);
    return new NextResponse(null, { status: 200 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
