import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    // PowerTranz sends form-encoded data, not JSON
    const formData = await request.formData();
    const responseData = formData.get("Response") as string;

    console.log("fac response (raw):", responseData);

    const authResponse = JSON.parse(responseData);
    console.log("auth response: ", authResponse);

    let error = null;

    // We will allow transactions with IsoResponseCode 3D0 and 3D1 to pass through.
    // 3D1 means that the cardholder's payment method does not support 3DSecure Authentication
    if (
      authResponse.IsoResponseCode === "3D0" ||
      authResponse.IsoResponseCode === "3D1"
    ) {
      let config: {
        method: string;
        url: string;
        headers: any;
        data: string | Object;
      } = {
        method: "post",
        url: `${process.env.NEXT_PUBLIC_FAC_PTRANZ_BASE_URL}/spi/payment`,
        headers: {
          "PowerTranz-PowerTranzId": process.env.FAC_MERCHANT_ID,
          "PowerTranz-PowerTranzPassword": process.env.FAC_PROCESSING_PASS,
          "Content-Type": "application/json; charset=utf-8",
        },
        data: JSON.stringify(authResponse.SpiToken),
      };

      const paymentResult = await axios(config);
      const paymentResponse = paymentResult.data;
      console.log("payment response:", paymentResponse);

      if (paymentResponse.IsoResponseCode === "00") {
        const urlParams = new URLSearchParams({
          isSuccess: "1",
          order_id: authResponse.OrderIdentifier,
          amount: paymentResponse.TotalAmount,
          txn_type: "capture",
          responseCode: paymentResponse.IsoResponseCode,
          responseMessage: paymentResponse.ResponseMessage || "",
          referenceNumber: paymentResponse.RRN || "",
          transactionIdentifier: paymentResponse.TransactionIdentifier || "",
        });
        const paymentCompleteUrl = `/response?${urlParams.toString()}`;
        console.log("Redirecting to success URL:", paymentCompleteUrl);

        // Get the origin from the request
        const origin = new URL(request.url).origin;
        const fullRedirectUrl = `${origin}${paymentCompleteUrl}`;
        console.log("Full redirect URL:", fullRedirectUrl);

        return NextResponse.redirect(fullRedirectUrl, {
          status: 302,
          headers,
        });
      } else {
        error = {
          txnType: "payment",
          code: paymentResponse.IsoResponseCode,
          message: paymentResponse.ResponseMessage,
          additionalErrors: paymentResponse.Errors || null,
        };
      }
    } else {
      error = {
        txnType: "auth",
        code: authResponse.IsoResponseCode,
        message: authResponse.ResponseMessage,
        additionalErrors: authResponse.Errors || null,
      };
    }

    const errorParams = new URLSearchParams({
      isSuccess: "0",
      order_id: authResponse.OrderIdentifier || "",
      txn_type: error?.txnType || "",
      responseCode: error?.code || "",
      responseMessage: error?.message || "",
      type: "Online Credit/Debit Card",
    });

    if (error?.additionalErrors) {
      errorParams.append("errors", JSON.stringify(error.additionalErrors));
    }

    const paymentCompleteUrl = `/response?${errorParams.toString()}`;
    console.log("Redirecting to error URL:", paymentCompleteUrl);

    const origin = new URL(request.url).origin;
    const fullRedirectUrl = `${origin}${paymentCompleteUrl}`;
    console.log("Full error redirect URL:", fullRedirectUrl);

    return NextResponse.redirect(fullRedirectUrl, {
      status: 302,
      headers,
    });
  } catch (error: any) {
    console.log(`FAC Get HPP Result ERROR: ${error}`);
    const catchErrorParams = new URLSearchParams({
      isSuccess: "2",
      errors: error.message || "Unknown error occurred",
      type: "Online Credit/Debit Card",
    });
    const paymentCompleteUrl = `/response?${catchErrorParams.toString()}`;
    console.log("Redirecting to catch error URL:", paymentCompleteUrl);

    const origin = new URL(request.url).origin;
    const fullRedirectUrl = `${origin}${paymentCompleteUrl}`;
    console.log("Full catch error redirect URL:", fullRedirectUrl);

    return NextResponse.redirect(fullRedirectUrl, {
      status: 302,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}
