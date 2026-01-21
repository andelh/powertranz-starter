import { NextResponse } from "next/server";
import { HostedPageProps, createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: Request) {
  const data = (await request.json()) as HostedPageProps;

  console.log("HPP start request (sanitized):", sanitizeForLogging({
    amount: data.amount,
    orderId: data.orderId,
    transactionIdentifier: data.transactionIdentifier,
    pageSet: data.pageSet,
    pageName: data.pageName,
  }));

  const client = createPowertranzClient();

  try {
    const response = await client.post("/spi/auth", {
      TransactionIdentifier: data.transactionIdentifier,
      TotalAmount: Number(data.amount),
      CurrencyCode: "780",
      ThreeDSecure: data.threeDSecure ?? false,
      OrderIdentifier: data.orderId,
      AddressMatch: false,
      ExtendedData: {
        HostedPage: {
          PageSet: data.pageSet,
          PageName: data.pageName,
        },
        MerchantResponseUrl: `${data.siteRoot}/api/powertranz/hpp/response`,
      },
    });

    console.log("HPP start response (sanitized):", sanitizeForLogging(response.data));

    if (response.data.IsoResponseCode !== "SP4") {
      return NextResponse.json(
        { error: "HPP start failed", message: response.data.ResponseMessage },
        { status: 400 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("PowerTranz HPP start error:", error);
    return NextResponse.json(
      { error: "HPP start failed", message: "Failed to initiate hosted page session" },
      { status: 500 }
    );
  }
}
