import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Set CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
  const data = await request.json();
  const { transactionIdentifier, amount } = data;
  console.log({
    transactionIdentifier,
    amount,
  });

  const config: {
    method: string;
    url: string;
    headers: any;
    data: string | Object;
  } = {
    method: "post",
    url: `${process.env.NEXT_PUBLIC_FAC_PTRANZ_BASE_URL}/capture`,
    headers: {
      "PowerTranz-PowerTranzId": process.env.FAC_MERCHANT_ID,
      "PowerTranz-PowerTranzPassword": process.env.FAC_PROCESSING_PASS,
      "Content-Type": "application/json; charset=utf-8",
    },
    data: {
      TransactionIdentifier: transactionIdentifier,
      TotalAmount: Number(amount),
    },
  };

  try {
    const captureResult = await axios(config);
    const captureResponse = captureResult.data;
    console.log("capture response:", captureResponse);

    return NextResponse.json(captureResponse);
  } catch (error) {
    console.log(`PowerTranz ERROR: ${error}`);
    // Return a new error response
    return NextResponse.error();
  }
}
