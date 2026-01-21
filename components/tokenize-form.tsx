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
import usePowertranz from "@/components/hooks/use-powertranz";

export function TokenizeForm() {
  const { tokenizeCard, loading } = usePowertranz();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiration: "",
    cvv: "",
    cardholderName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiration = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return digits.substring(0, 2) + "/" + digits.substring(2, 4);
    }
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cardNumber: formatted,
    }));
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiration(e.target.value);
    setFormData((prev) => ({
      ...prev,
      expiration: formatted,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setToken(null);

    const response = await tokenizeCard({
      cardNumber: formData.cardNumber.replace(/\s/g, ""),
      expirationYear: formData.expiration.split("/")[1] || "",
      expirationMonth: formData.expiration.split("/")[0] || "",
      cvv: formData.cvv,
      cardholderName: formData.cardholderName,
      currencyCode: "780",
    });

    if (response.ok && response.data) {
      console.log("Tokenize response:", response.data);
      if (response.data.PanToken) {
        setToken(response.data.PanToken);
      } else {
        setError(response.data.ResponseMessage || "Tokenization failed");
      }
    } else if (!response.ok) {
      setError(response.error?.message || "Tokenization failed");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Try it out: Get Card Token</CardTitle>
        <CardDescription>
          Enter a test card details to receive a secure token. Find a list of
          test cards{" "}
          <a
            className="text-blue-500 hover:underline"
            href="https://developer.powertranz.com/docs/test-cards-and-cases"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiration">Expiry Date</Label>
              <Input
                id="expiration"
                name="expiration"
                type="text"
                placeholder="MM/YY"
                value={formData.expiration}
                onChange={handleExpirationChange}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={handleInputChange}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              name="cardholderName"
              type="text"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={handleInputChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Get Token"}
          </Button>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          {token && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <div className="font-medium mb-1">
                Token Generated Successfully!
              </div>
              <div className="break-all font-mono text-xs">{token}</div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
