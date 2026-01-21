import { NextRequest, NextResponse } from "next/server";
import { createPowertranzClient, sanitizeForLogging } from "@/lib/powertranz";

export async function POST(request: NextRequest) {
  try {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    const formData = await request.formData();
    const responseData = formData.get("Response") as string;

    console.log("HPP response callback (raw):", responseData);

    const hppResponse = JSON.parse(responseData);
    console.log("HPP response callback (sanitized):", sanitizeForLogging(hppResponse));

    if (hppResponse.IsoResponseCode === "HP0") {
      const client = createPowertranzClient();

      const paymentResult = await client.post("/spi/payment", JSON.stringify(hppResponse.SpiToken), {
        headers: { "Content-Type": "text/plain" },
      });
      const paymentResponse = paymentResult.data;
      console.log("Payment response (sanitized):", sanitizeForLogging(paymentResponse));

      if (paymentResponse.IsoResponseCode === "00") {
        const urlParams = new URLSearchParams({
          isSuccess: "1",
          order_id: hppResponse.OrderIdentifier,
          txn_type: "hpp-payment",
          responseCode: paymentResponse.IsoResponseCode,
          responseMessage: paymentResponse.ResponseMessage || "",
          referenceNumber: paymentResponse.RRN || "",
          transactionIdentifier: paymentResponse.TransactionIdentifier || "",
        });

        const origin = new URL(request.url).origin;
        return NextResponse.redirect(`${origin}/response?${urlParams.toString()}`, { status: 302, headers });
      } else {
        const errorParams = new URLSearchParams({
          isSuccess: "0",
          order_id: hppResponse.OrderIdentifier || "",
          txn_type: "hpp-payment",
          responseCode: paymentResponse.IsoResponseCode,
          responseMessage: paymentResponse.ResponseMessage || "",
          type: "Hosted Payment Page",
        });

        const origin = new URL(request.url).origin;
        return NextResponse.redirect(`${origin}/response?${errorParams.toString()}`, { status: 302, headers });
      }
    } else {
      const errorParams = new URLSearchParams({
        isSuccess: "0",
        order_id: hppResponse.OrderIdentifier || "",
        txn_type: "hpp-auth",
        responseCode: hppResponse.IsoResponseCode,
        responseMessage: hppResponse.ResponseMessage || "",
        type: "Hosted Payment Page",
      });

      const origin = new URL(request.url).origin;
      return NextResponse.redirect(`${origin}/response?${errorParams.toString()}`, { status: 302, headers });
    }
  } catch (error) {
    console.error("HPP response callback error:", error);
    const errorParams = new URLSearchParams({
      isSuccess: "2",
      errors: error instanceof Error ? error.message : "Unknown error occurred",
      type: "Hosted Payment Page",
    });

    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/response?${errorParams.toString()}`, {
      status: 302,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
