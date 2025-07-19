import { api } from "@/convex/_generated/api";
import axios from "axios";
import { fetchMutation } from "convex/nextjs";
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
    siteRoot,
    pendingPurchaseId,
  } = data;
  console.log({
    cardNumber,
    cvv,
    expiration,
    cardholderName,
    orderId,
    transactionIdentifier,
    email,
    siteRoot,
  });

  // build tokenize request
  const tokenizeRequest = {
    TransactionIdentifier: transactionIdentifier,
    TotalAmount: Number(0),
    CurrencyCode: "780", //TTD code
    Tokenize: true,
    ThreeDSecure: true,
    OrderIdentifier: orderId,
    ExtendedData: {
      ThreeDSecure: {
        ChallengeIndicator: "04",
        ChallengeWindowSize: 4,
        AuthenticationIndicator: "04", //(MessageCategory will default to 02 if TotalAmount is 0 or not sent)
        MessageCategory: "02",
        // MessageCategory with value 02 is used for a NPA transaction NPA= non payment authentication)
        //This is not considered a payment transaction. It will only validate the status of the card.
      },
      MerchantResponseUrl: `${siteRoot}/3ds/tokenize/complete?returnTo=/checkout/${orderId}?step=review-order`,
    },
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

  console.log("tokenize request: ", tokenizeRequest);

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
    if (tokenizeResponse?.data?.RiskManagement?.ThreeDSecure?.RedirectData) {
      await fetchMutation(api.tokenization.createTokenization, {
        pendingPurchaseId,
        redirectData:
          tokenizeResponse?.data?.RiskManagement?.ThreeDSecure?.RedirectData,
      });
    }
    return NextResponse.json(tokenizeResponse.data);
  } catch (error) {
    console.log(`PowerTranz ERROR: ${error}`);
    // Return a new error response
    return NextResponse.error();
  }
}
