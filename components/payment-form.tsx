"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PaymentForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Direct Payment</CardTitle>
        <CardDescription>
          Process a payment directly without tokenization (coming soon)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-8 text-center text-muted-foreground">
          <div className="mb-4 text-4xl">🚧</div>
          <p>This feature is under development</p>
          <p className="text-sm mt-2">
            Direct payment processing will be available soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
