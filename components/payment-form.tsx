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
import { generateUUID } from "@/lib/utils";

export function PaymentForm() {
  const { directSale, loading } = usePowertranz();
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiration: "",
    cvv: "",
    cardholderName: "",
    amount: "10.00",
  });

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
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const handleExpirationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiration(e.target.value);
    setFormData((prev) => ({ ...prev, expiration: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const transactionIdentifier = generateUUID();
    const orderId = generateUUID();
    const [expMonth, expYear] = formData.expiration.split("/");

    const response = await directSale({
      orderId,
      amount: Number(formData.amount),
      transactionIdentifier,
      cardNumber: formData.cardNumber.replace(/\s/g, ""),
      cardCvv: formData.cvv,
      cardExpiration: `${expYear}${expMonth}`,
      cardholderName: formData.cardholderName,
    });

    if (response.ok) {
      setResult(response.data);
    } else {
      setError(response.error.message);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Direct Payment</CardTitle>
        <CardDescription>
          Process a payment directly without tokenization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
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
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => setFormData((prev) => ({ ...prev, cvv: e.target.value }))}
                maxLength={4}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              type="text"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={(e) => setFormData((prev) => ({ ...prev, cardholderName: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : `Pay $${formData.amount}`}
          </Button>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          {result !== null && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              <div className="font-medium">Payment Successful!</div>
              <pre className="mt-2 text-xs overflow-auto text-green-700">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
