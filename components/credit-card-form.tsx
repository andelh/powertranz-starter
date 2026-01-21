"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TokenizeForm } from "@/components/tokenize-form";
import { AuthCaptureForm } from "@/components/auth-capture-form";
import { PaymentForm } from "@/components/payment-form";

export function CreditCardForm() {
  return (
    <Tabs defaultValue="tokenize" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tokenize">Tokenize</TabsTrigger>
        <TabsTrigger value="capture">Auth & Capture</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
      </TabsList>

      <TabsContent value="tokenize" className="mt-6">
        <TokenizeForm />
      </TabsContent>

      <TabsContent value="capture" className="mt-6">
        <AuthCaptureForm />
      </TabsContent>

      <TabsContent value="payment" className="mt-6">
        <PaymentForm />
      </TabsContent>
    </Tabs>
  );
}
