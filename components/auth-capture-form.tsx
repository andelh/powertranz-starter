"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import usePowertranz, {
  CapturePaymentResponse,
} from "@/components/hooks/use-powertranz";
import { generateUUID } from "@/lib/utils";
import ThreeDSLoadingPrompt from "./3ds-loading-prompt";

type AuthResponse = {
  IsSuccess: boolean;
  TransactionIdentifier: string;
  ResponseMessage: string;
  TotalAmount: number;
  OrderIdentifier: string;
};

export type ThreeDSCompleteData = {
  type: string;
  status: string;
  url: string;
  orderId: string;
  id: string;
  transactionIdentifier: string;
  total: number;
  responseMessage: string;
  timestamp: number;
};

export function AuthCaptureForm() {
  const { loadPowertranzAuthAndCaptureFlow, loading, capturePayment } =
    usePowertranz();
  const [captureLoading, setCaptureLoading] = useState(false);
  const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null);
  const [captureResponse, setCaptureResponse] =
    useState<CapturePaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    token: "",
    amount: "",
    email: "test@example.com",
  });
  const [iframeHtml, setIframeHtml] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthResponse(null);
    setCaptureResponse(null);

    // UUID
    const transactionIdentifier = generateUUID();
    const orderId = generateUUID();

    try {
      const response = await loadPowertranzAuthAndCaptureFlow({
        token: formData.token,
        amount: Number(formData.amount),
        email: formData.email,
        orderId,
        transactionIdentifier,
        siteRoot: window.location.origin,
        authOnly: true,
      });

      if (response) {
        setIframeHtml(response);
      } else {
        setError("Authorization failed");
      }
    } catch (error) {
      setError("An error occurred during authorization");
      console.error("Auth error:", error);
    }
  };

  const handleCapture = async () => {
    if (!authResponse?.TransactionIdentifier) {
      setCaptureError("No transaction to capture");
      return;
    }

    setCaptureLoading(true);
    setCaptureError(null);
    setCaptureResponse(null);

    try {
      const response = await capturePayment({
        transactionIdentifier: authResponse.TransactionIdentifier,
        amount: Number(formData.amount),
      });

      setCaptureResponse(response);

      if (!response.Approved) {
        setCaptureError(response.ResponseMessage || "Capture failed");
      }
    } catch (error) {
      setCaptureError("An error occurred during capture");
      console.error("Capture error:", error);
    } finally {
      setCaptureLoading(false);
    }
  };

  const resetForm = () => {
    setAuthResponse(null);
    setCaptureResponse(null);
    setError(null);
    setCaptureError(null);
    setFormData({
      token: "",
      amount: "",
      email: "test@example.com",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Auth & Capture Flow</CardTitle>
        <CardDescription>
          Step 1: Authorize a payment with a token. Step 2: Capture the
          authorized amount.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {iframeHtml && (
          <ThreeDSLoadingPrompt
            iframeHtml={iframeHtml}
            onComplete={(data) => {
              console.log("Auth complete:", data);
              setIframeHtml(null);
              setAuthResponse({
                IsSuccess: true,
                TransactionIdentifier: data.data?.transactionIdentifier || "",
                ResponseMessage: data.data?.responseMessage || "",
                TotalAmount: Number(formData.amount),
                OrderIdentifier: data.data?.orderId || "",
              });
            }}
          />
        )}
        {/* Step 1: Authorization */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-sm font-medium">
              1
            </div>
            <h3 className="font-medium">Authorization</h3>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Payment Token</Label>
              <Input
                id="token"
                name="token"
                type="text"
                placeholder="Enter payment token from tokenize step"
                value={formData.token}
                onChange={handleInputChange}
                required
                disabled={!!authResponse}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="10.00"
                value={formData.amount}
                onChange={handleInputChange}
                required
                disabled={!!authResponse}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={!!authResponse}
              />
            </div>

            {!authResponse && (
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Authorizing..." : "Authorize Payment"}
              </Button>
            )}
          </form>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          {authResponse && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <div className="font-medium mb-1">
                ✅ Authorization Successful!
              </div>
              <div className="text-xs space-y-1">
                <div>
                  Transaction ID:{" "}
                  <span className="font-mono">
                    {authResponse.TransactionIdentifier}
                  </span>
                </div>
                <div>Amount: ${authResponse.TotalAmount}</div>
                <div>
                  Order ID:{" "}
                  <span className="font-mono">
                    {authResponse.OrderIdentifier}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {authResponse && (
          <>
            <Separator />

            {/* Step 2: Capture */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <h3 className="font-medium">Capture Payment</h3>
              </div>

              <div className="p-3 bg-muted rounded-md text-sm">
                <div>
                  Ready to capture:{" "}
                  <span className="font-medium">${formData.amount}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Transaction: {authResponse.TransactionIdentifier}
                </div>
              </div>

              {!captureResponse && (
                <Button
                  onClick={handleCapture}
                  className="w-full"
                  disabled={captureLoading}
                  variant="default"
                >
                  {captureLoading ? "Capturing..." : "Capture Payment"}
                </Button>
              )}

              {captureError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                  {captureError}
                </div>
              )}

              {captureResponse && (
                <div
                  className={`p-3 text-sm border rounded-md ${
                    captureResponse.Approved
                      ? "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                      : "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                  }`}
                >
                  <div className="font-medium mb-1">
                    {captureResponse.Approved
                      ? "✅ Capture Successful!"
                      : "❌ Capture Failed"}
                  </div>
                  <div className="text-xs">
                    {captureResponse.ResponseMessage}
                    {captureResponse.TransactionIdentifier && (
                      <div className="mt-1">
                        Transaction ID:{" "}
                        <span className="font-mono">
                          {captureResponse.TransactionIdentifier}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(captureResponse || captureError) && (
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="w-full"
                >
                  Start New Transaction
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
