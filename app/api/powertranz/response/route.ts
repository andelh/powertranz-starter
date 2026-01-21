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

    console.log("Response callback (raw):", responseData);

    const authResponse = JSON.parse(responseData);
    console.log("Response callback (sanitized):", sanitizeForLogging(authResponse));

    if (authResponse.IsoResponseCode === "3D0" || authResponse.IsoResponseCode === "3D1") {
      const client = createPowertranzClient();

      const paymentResult = await client.post("/spi/payment", JSON.stringify(authResponse.SpiToken), {
        headers: { "Content-Type": "text/plain" },
      });
      const paymentResponse = paymentResult.data;
      console.log("Payment response (sanitized):", sanitizeForLogging(paymentResponse));

      if (paymentResponse.IsoResponseCode === "00") {
        const captureResult = await client.post("/capture", {
          TransactionIdentifier: paymentResponse.TransactionIdentifier,
          TotalAmount: paymentResponse.TotalAmount,
        });
        const captureResponse = captureResult.data;
        console.log("Capture response (sanitized):", sanitizeForLogging(captureResponse));

        if (captureResponse.IsoResponseCode === "00") {
          const urlParams = new URLSearchParams({
            isSuccess: "1",
            order_id: authResponse.OrderIdentifier,
            txn_type: "capture",
            responseCode: captureResponse.IsoResponseCode,
            responseMessage: captureResponse.ResponseMessage || "",
            referenceNumber: captureResponse.RRN || "",
            transactionIdentifier: paymentResponse.TransactionIdentifier || "",
          });

          const origin = new URL(request.url).origin;
          return NextResponse.redirect(`${origin}/response?${urlParams.toString()}`, { status: 302, headers });
        } else {
          const errorParams = new URLSearchParams({
            isSuccess: "0",
            order_id: authResponse.OrderIdentifier || "",
            txn_type: "capture",
            responseCode: captureResponse.IsoResponseCode,
            responseMessage: captureResponse.ResponseMessage || "",
            type: "Online Credit/Debit Card",
          });

          const origin = new URL(request.url).origin;
          return NextResponse.redirect(`${origin}/response?${errorParams.toString()}`, { status: 302, headers });
        }
      } else {
        const errorParams = new URLSearchParams({
          isSuccess: "0",
          order_id: authResponse.OrderIdentifier || "",
          txn_type: "payment",
          responseCode: paymentResponse.IsoResponseCode,
          responseMessage: paymentResponse.ResponseMessage || "",
          type: "Online Credit/Debit Card",
        });

        const origin = new URL(request.url).origin;
        return NextResponse.redirect(`${origin}/response?${errorParams.toString()}`, { status: 302, headers });
      }
    } else {
      const errorParams = new URLSearchParams({
        isSuccess: "0",
        order_id: authResponse.OrderIdentifier || "",
        txn_type: "auth",
        responseCode: authResponse.IsoResponseCode,
        responseMessage: authResponse.ResponseMessage || "",
        type: "Online Credit/Debit Card",
      });

      const origin = new URL(request.url).origin;
      return NextResponse.redirect(`${origin}/response?${errorParams.toString()}`, { status: 302, headers });
    }
  } catch (error) {
    console.error("Response callback error:", error);
    const errorParams = new URLSearchParams({
      isSuccess: "2",
      errors: error instanceof Error ? error.message : "Unknown error occurred",
      type: "Online Credit/Debit Card",
    });

    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/response?${errorParams.toString()}`, {
      status: 302,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
