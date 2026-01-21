"use client";

import { useEffect, useState } from "react";

export interface PowertranzIframeProps {
  redirectData: string;
  onComplete?: (data: unknown) => void;
  onError?: (error: Error) => void;
  className?: string;
  height?: string;
  width?: string;
}

export function PowertranzIframe({
  redirectData,
  onComplete,
  onError,
  className = "",
  height = "500px",
  width = "100%",
}: PowertranzIframeProps) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (
          typeof data !== "object" ||
          data === null ||
          typeof data.type !== "string"
        ) {
          return;
        }

        if (data.type === "powertranz-complete") {
          onComplete?.(data.payload);
        } else if (data.type === "powertranz-error") {
          const err = new Error(data.message || "Payment flow error");
          setError(data.message);
          onError?.(err);
        }
      } catch (e) {
        console.error("Failed to parse PowerTranz message:", e);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplete, onError]);

  if (error) {
    return (
      <div className={`p-4 border border-red-200 rounded bg-red-50 text-red-700 ${className}`}>
        <p className="font-medium">Payment Error</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <iframe
      srcDoc={redirectData}
      title="PowerTranz Payment"
      height={height}
      width={width}
      className={`border-0 rounded-lg ${className}`}
      style={{ borderStyle: "solid", borderWidth: "0px", paddingLeft: "5%" }}
    />
  );
}
