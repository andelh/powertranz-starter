"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { postMessageSafely, detectIframe } from "@/lib/utils";
import { Loader2 } from "lucide-react";

function CheckoutResponseContent() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams?.get("isSuccess");
  const order_id = searchParams?.get("order_id");
  const id = searchParams?.get("id");
  const responseMessage = searchParams?.get("responseMessage");
  const transactionIdentifier = searchParams?.get("transactionIdentifier");
  const total = searchParams?.get("total");
  const errors = searchParams?.get("errors");

  const [processed, setProcessed] = useState(false);
  const isInIframe = detectIframe();

  useEffect(() => {
    if (processed) return;

    const isSuccessful = isSuccess === "1";

    if (isSuccessful) {
      const successData = {
        url: window.location.href,
        orderId: order_id,
        id: id,
        transactionIdentifier: transactionIdentifier,
        total: total,
        responseMessage: responseMessage,
        timestamp: Date.now(),
      };

      // Post success message to immediate parent (3DS listener)
      if (window.parent && window.parent !== window) {
        postMessageSafely(window.parent, {
          type: "3ds-complete",
          status: "success",
          ...successData,
        });
      }

      // Also post to top-level parent (embed script listener) if we're embedded
      // if (window.top && window.top !== window && window.top !== window.parent) {
      //   const messageType = requestType === "rsvp" ? "CHECKOUT_COMPLETE" : "CHECKOUT_COMPLETE";
      //   postMessageSafely(window.top, {
      //     type: messageType,
      //     status: "success",
      //     ...successData,
      //   });
      // }

      console.log(
        `Checkout completed successfully, messages sent to parent windows`
      );
    } else {
      const errorData = {
        url: window.location.href,
        orderId: order_id,
        id: id,
        responseMessage: responseMessage,
        errors: errors,
        timestamp: Date.now(),
      };

      // Post error to immediate parent (3DS listener)
      if (window.parent && window.parent !== window) {
        postMessageSafely(window.parent, {
          type: "3ds-error",
          status: "error",
          ...errorData,
        });
      }

      // Also post error to top-level parent (embed script listener)
      if (window.top && window.top !== window && window.top !== window.parent) {
        postMessageSafely(window.top, {
          type: "CHECKOUT_ERROR",
          status: "error",
          ...errorData,
        });
      }

      console.log(`Checkout failed, error messages sent to parent windows`);
    }

    setProcessed(true);

    // Auto-redirect after a short delay if not in iframe
    if (!isInIframe) {
      setTimeout(() => {
        const targetPath = `/checkout/complete?${searchParams?.toString()}`;
        window.location.href = targetPath;
      }, 1000);
    }
  }, [
    isSuccess,
    order_id,
    id,
    transactionIdentifier,
    total,
    responseMessage,
    errors,
    processed,
    searchParams,
  ]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white px-5 text-center">
      <div className="flex h-20 w-full items-center justify-center">
        <div className="flex flex-row items-center gap-2">
          <Loader2 className="w-h-10 h-10 animate-spin text-primary" />
          <p>Processing...</p>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white px-5 text-center">
      <div className="flex h-20 w-full items-center justify-center">
        <div className="flex flex-row items-center gap-2">
          <Loader2 className="w-h-10 h-10 animate-spin text-primary" />
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutResponsePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutResponseContent />
    </Suspense>
  );
}
