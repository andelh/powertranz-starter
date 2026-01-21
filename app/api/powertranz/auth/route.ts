import { NextResponse } from "next/server";
import { AuthFlowProps, createPowertranzClient, powertranzConfig, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as AuthFlowProps;
  const {
    siteRoot,
    token,
    amount,
    orderId,
    transactionIdentifier,
    email,
    authOnly,
  } = data;

  console.log("Auth request (sanitized):", sanitizeForLogging({ amount, token, orderId, transactionIdentifier, email, authOnly }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/spi/auth", {
      TransactionIdentifier: transactionIdentifier,
      TotalAmount: Number(amount),
      CurrencyCode: powertranzConfig.defaultCurrency,
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
        MerchantResponseUrl: `${siteRoot}/api/powertranz/${authOnly ? "auth-response" : "response"}`,
      },
    });

    console.log("Auth response:", sanitizeForLogging(response.data));
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz auth error:", error);
    return NextResponse.json(
      { error: "Authorization failed", message: "Failed to initiate authorization" },
      { status: 500 }
    );
  }
}
