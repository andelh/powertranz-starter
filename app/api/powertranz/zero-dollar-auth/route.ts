import axios from "axios";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const data = await request.json();

  const requiredFields = ["siteRoot", "cardNumber", "amount", "orderId", "transactionIdentifier"];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(", ")}` },
      { status: 400 }
    );
  }

  const { siteRoot, cardNumber, amount, cvv, expiration, cardholderName, orderId, transactionIdentifier } = data;

  const Source: Record<string, string> = {
    CardPan: cardNumber,
  };

  if (cvv !== undefined) {
    Source.CardCvv = cvv;
  }

  if (expiration !== undefined) {
    Source.CardExpiration = expiration;
  }

  if (cardholderName !== undefined) {
    Source.CardholderName = cardholderName;
  }

  const authWithTokenizeRequest = {
    TransactionIdentifier: transactionIdentifier,
    TotalAmount: Number(amount),
    CurrencyCode: "780",
    ThreeDSecure: true,
    FraudCheck: true,
    OrderIdentifier: orderId,
    Source,
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
    return NextResponse.json(
      { error: "PowerTranz authorization failed" },
      { status: 500 }
    );
  }
}
