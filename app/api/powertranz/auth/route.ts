import { AuthAndCaptureFlowProps } from "@/components/hooks/use-powertranz";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = (await request.json()) as AuthAndCaptureFlowProps;
  const {
    siteRoot,
    token,
    amount,
    orderId,
    transactionIdentifier,
    email,
    authOnly,
  } = data;
  console.log({
    amount,
    token,
    orderId,
    transactionIdentifier,
    email,
    authOnly,
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
      Token: token,
    },
    BillingAddress: {
      EmailAddress: email,
    },
    ExtendedData: {
      ThreeDSecure: {
        ChallengeWindowSize: 4,
        ChallengeIndicator: "01",
      },
      MerchantResponseUrl: `${siteRoot}/api/powertranz/${
        authOnly ? "auth-response" : "response"
      }`,
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
