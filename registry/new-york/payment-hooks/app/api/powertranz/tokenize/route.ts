import axios from "axios";
import { NextResponse } from "next/server";
import { TokenizeCardProps } from "@/components/hooks/use-powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as TokenizeCardProps;
  const {
    cardNumber,
    cvv,
    expirationYear,
    expirationMonth,
    cardholderName,
    currencyCode = "780", // TTD code
  } = data;
  console.log({
    cardNumber,
    cvv,
    expirationYear,
    expirationMonth,
    cardholderName,
    currencyCode,
  });

  // Generate a UUID for the transaction identifier and orderId
  const transactionIdentifier = crypto.randomUUID();
  const orderId = crypto.randomUUID();

  // Format the expiration date, the /tokenize endpoint expects YYMM
  const expiration = `${expirationYear}${expirationMonth}`;

  // build tokenize request
  const tokenizeRequest = {
    AddressMatch: false,
    CurrencyCode: currencyCode,
    TransactionIdentifier: transactionIdentifier,
    TotalAmount: Number(0),
    Tokenize: true,
    ThreeDSecure: false,
    OrderIdentifier: orderId,
    Source: {
      CardPan: cardNumber,
      CardCvv: cvv,
      CardExpiration: expiration,
      CardholderName: cardholderName,
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
