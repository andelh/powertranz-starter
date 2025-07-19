import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to force-static
export async function POST(request: Request, response: Response) {
  const data = await request.json();
  const {
    cardNumber,
    cvv,
    expiration,
    cardholderName,
    orderId,
    transactionIdentifier,
    email,
  } = data;
  console.log({
    cardNumber,
    cvv,
    expiration,
    cardholderName,
    orderId,
    transactionIdentifier,
    email,
  });

  // build tokenize request
  const tokenizeRequest = {
    TransactionIdentifier: transactionIdentifier,
    TotalAmount: Number(0),
    CurrencyCode: "780", //TTD code
    Tokenize: true,
    ThreeDSecure: false,
    OrderIdentifier: orderId,
    Source: {
      CardPan: cardNumber,
      CardCvv: cvv,
      CardExpiration: expiration,
      CardholderName: cardholderName,
    },
    BillingAddress: {
      EmailAddress: email,
    },
  };

  const config = {
    method: "post",
    url: `${process.env.NEXT_PUBLIC_FAC_PTRANZ_BASE_URL}/riskmgmt`,
    headers: {
      "PowerTranz-PowerTranzId": process.env.FAC_MERCHANT_ID,
      "PowerTranz-PowerTranzPassword": process.env.FAC_PROCESSING_PASS,
      "Content-Type": "application/json; charset=utf-8",
    },
    data: tokenizeRequest,
  };

  try {
    const tokenizeResponse = await axios(config);
    console.log("tokenize response: ", tokenizeResponse.data);
    return NextResponse.json(tokenizeResponse.data);
  } catch (error) {
    console.log(`PowerTranz ERROR: ${error}`);
    // Return a new error response
    return NextResponse.error();
  }
}
