# Registry Item Examples

## Complete Payment Flow Example

```tsx
import { useState } from "react";
import usePowertranz, { TokenizeCardProps, AuthFlowProps } from "@/components/hooks/use-powertranz";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PaymentForm() {
  const { tokenizeCard, startAuth, capture, loading } = usePowertranz();
  const [token, setToken] = useState<string | null>(null);
  const [amount] = useState(99.99);

  const handleTokenize = async (e: React.FormEvent) => {
    e.preventDefault();
    const cardData: TokenizeCardProps = {
      cardNumber: "4111111111111111",
      expirationMonth: "12",
      expirationYear: "2025",
      cvv: "123",
      cardholderName: "John Doe",
    };

    const result = await tokenizeCard(cardData);
    if (result.ok && result.data?.PanToken) {
      setToken(result.data.PanToken);
    }
  };

  const handleAuth = async () => {
    if (!token) return;

    const authProps: AuthFlowProps = {
      orderId: `ORD-${Date.now()}`,
      amount,
      siteRoot: window.location.origin,
      transactionIdentifier: crypto.randomUUID(),
      token,
      email: "customer@example.com",
    };

    const result = await startAuth(authProps);
    if (result.ok && result.data) {
      // Redirect to 3D Secure page
      console.log("RedirectData:", result.data.redirectData);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTokenize} className="space-y-4">
          <div className="space-y-2">
            <Label>Card Number</Label>
            <Input placeholder="4111 1111 1111 1111" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiry</Label>
              <Input placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label>CVV</Label>
              <Input placeholder="123" />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processing..." : "Pay $99.99"}
          </Button>
        </form>
        {token && (
          <Button onClick={handleAuth} className="w-full mt-4">
            Authorize Payment
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

## Hosted Payment Page Example

```tsx
import usePowertranz from "@/components/hooks/use-powertranz";
import { PowertranzIframe } from "@/components/powertranz-iframe";

export function HppCheckout() {
  const { startHostedPageSession, loading } = usePowertranz();
  const [redirectData, setRedirectData] = useState<string | null>(null);

  const handleStartHpp = async () => {
    const result = await startHostedPageSession({
      orderId: `ORD-${Date.now()}`,
      amount: 99.99,
      transactionIdentifier: crypto.randomUUID(),
      pageSet: "PowerTranz",
      pageName: "PaymentPage",
      siteRoot: window.location.origin,
    });

    if (result.ok && result.data?.RedirectData) {
      setRedirectData(result.data.RedirectData);
    }
  };

  const handleComplete = (data: unknown) => {
    console.log("Payment complete:", data);
  };

  const handleError = (error: Error) => {
    console.error("Payment error:", error);
  };

  return (
    <div className="p-4">
      {!redirectData ? (
        <Button onClick={handleStartHpp} disabled={loading}>
          {loading ? "Starting..." : "Pay with Hosted Page"}
        </Button>
      ) : (
        <PowertranzIframe
          redirectData={redirectData}
          onComplete={handleComplete}
          onError={handleError}
        />
      )}
    </div>
  );
}
```

## Environment Configuration Example

```json
{
  "registry": {
    "powertranz": {
      "url": "https://your-registry.com/r/{name}.json",
      "params": {
        "version": "1.0.0"
      }
    }
  }
}
```

## Dependency Reference

When using the PowerTranz registry item, the following are automatically included:

**npm dependencies:**
- `axios` - HTTP client for API requests

**shadcn components:**
- `button` - Submit buttons
- `input` - Card number, CVV inputs
- `label` - Form labels
- `card` - Payment form container
