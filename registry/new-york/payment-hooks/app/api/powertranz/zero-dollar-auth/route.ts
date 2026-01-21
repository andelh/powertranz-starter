import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to force-static

export async function POST(request: Request) {
  const data = await request.json();
  const {
    siteRoot,
    cardNumber,
    amount,
    cvv = "123",
    expiration = "2505",
    cardholderName = "John Baker",
    orderId,
    transactionIdentifier,
  } = data;
  console.log({
    amount,
    cardNumber,
    cvv,
    expiration,
    cardholderName,
    orderId,
    transactionIdentifier,
  });

  // build authorization request
  const authWithTokenizeRequest = {
    TransactionIdentifier: transactionIdentifier,
    TotalAmount: Number(amount),
    CurrencyCode: "780", //TTD code
    ThreeDSecure: true,
    FraudCheck: true,
    OrderIdentifier: orderId,
    Source: {
      CardPan: cardNumber,
      CardCvv: cvv,
      CardExpiration: expiration,
      CardholderName: cardholderName,
    },
    ExtendedData: {
      ThreeDSecure: {
        ChallengeWindowSize: 4,
        ChallengeIndicator: "01",
      },
      MerchantResponseUrl: `${siteRoot}/api/powertranz/hpp-result`,
    },
  };

  const config = {
    method: "post",
    url: `${process.env.NEXT_PUBLIC_FAC_PTRANZ_BASE_URL}/spi/auth`,
    headers: {
      "PowerTranz-PowerTranzId": process.env.FAC_MERCHANT_ID,
      "PowerTranz-PowerTranzPassword": process.env.FAC_PROCESSING_PASS,
      "Content-Type": "application/json; charset=utf-8",
    },
    data: authWithTokenizeRequest,
  };

  try {
    const authWithTokenResponse = await axios(config);
    console.log("authWithTokenResponse response: ", authWithTokenResponse.data);
    return NextResponse.json(authWithTokenResponse.data);
  } catch (error) {
    console.log(`PowerTranz ERROR: ${error}`);
    // Return a new error response
    return NextResponse.error();
  }
}
