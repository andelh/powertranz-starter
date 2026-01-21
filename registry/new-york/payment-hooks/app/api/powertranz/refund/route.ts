import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to force-static
export async function POST(request: Request, response: Response) {
  const data = await request.json();
  const { transactionIdentifier, amount } = data;
  console.log({
    amount,
    transactionIdentifier,
  });

  // build refund request
  const refundRequest = {
    Refund: true,
    TransactionIdentifier: transactionIdentifier, // transaction id that needed to refund
    TotalAmount: Number(amount), //Amount to be refunded
    CurrencyCode: "780", //TTD code
  };

  const config = {
    method: "post",
    url: `${process.env.NEXT_PUBLIC_FAC_PTRANZ_BASE_URL}/refund`,
    headers: {
      "PowerTranz-PowerTranzId": process.env.FAC_MERCHANT_ID,
      "PowerTranz-PowerTranzPassword": process.env.FAC_PROCESSING_PASS,
      "Content-Type": "application/json; charset=utf-8",
    },
    data: refundRequest,
  };

  try {
    const refundResponse = await axios(config);
    console.log("refund response: ", refundResponse.data);
    return NextResponse.json(refundResponse.data);
  } catch (error) {
    console.log(`PowerTranz ERROR: ${error}`);
    // Return a new error response
    return NextResponse.error();
  }
}
