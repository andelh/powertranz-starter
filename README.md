# PowerTranz for Next.js

Add PowerTranz payment processing to your Next.js app with type-safe request builders, React hooks, and full PCI compliance.

```bash
npx shadcn@latest add @powertranz/payment-hooks
```

## What You Get

- **Type-safe API** — All request/response types, no more `any`
- **React hook** — `usePowertranz()` with built-in loading/error states
- **PCI-safe logging** — Card numbers and CVVs auto-masked in logs
- **Request builders** — Pure functions for building PowerTranz payloads
- **Complete payment flows** — Tokenize, Auth+Capture, Direct Sale, Refund, Hosted Page, Recurring

## Quick Start

### 1. Add to Your Project

```bash
npx shadcn@latest add @powertranz/payment-hooks
```

This installs:
- `components/hooks/use-powertranz.ts`
- `components/powertranz-iframe.tsx`
- `lib/powertranz/*`
- `app/api/powertranz/*`

You also need these shadcn components:

```bash
npx shadcn@latest add button input label card
```

### 2. Configure Environment Variables

```bash
# .env.local
POWERTRANZ_BASE_URL=https://ptranz.com/api
POWERTRANZ_MERCHANT_ID=your_merchant_id
POWERTRANZ_PROCESSING_PASSWORD=your_password
```

### 3. Use the Hook

```tsx
import { useState } from "react";
import usePowertranz, { TokenizeCardProps } from "@/components/hooks/use-powertranz";

export function CheckoutForm() {
  const { tokenizeCard, loading } = usePowertranz();
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await tokenizeCard({
      cardNumber: "4111111111111111",
      expirationMonth: "12",
      expirationYear: "2025",
      cvv: "123",
      cardholderName: "John Doe",
    });

    if (result.ok && result.data?.PanToken) {
      setToken(result.data.PanToken);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={loading}>
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
```

## Payment Flows

### Tokenize (Store a Card)

```tsx
const { tokenizeCard } = usePowertranz();

const result = await tokenizeCard({
  cardNumber: "4111111111111111",
  expirationMonth: "12",
  expirationYear: "2025",
  cvv: "123",
  cardholderName: "John Doe",
});

if (result.ok) {
  // Store result.data.PanToken securely
  console.log(result.data.PanToken);
}
```

### Auth + Capture (3D Secure)

```tsx
const { startAuth, capture } = usePowertranz();

// Step 1: Start authorization
const authResult = await startAuth({
  orderId: `ORD-${Date.now()}`,
  amount: 99.99,
  siteRoot: window.location.origin,
  transactionIdentifier: crypto.randomUUID(),
  token: cardToken,
  email: "customer@example.com",
});

if (authResult.ok) {
  // Render iframe with authResult.data.redirectData
  // Listen for 3DS completion, then capture:
  await capture({
    transactionIdentifier: authResult.data.transactionIdentifier,
    amount: 99.99,
  });
}
```

### Direct Sale (No Tokenization)

```tsx
const { directSale } = usePowertranz();

const result = await directSale({
  orderId: `ORD-${Date.now()}`,
  amount: 99.99,
  transactionIdentifier: crypto.randomUUID(),
  cardNumber: "4111111111111111",
  cardCvv: "123",
  cardExpiration: "1225",
  cardholderName: "John Doe",
});
```

### Refund

```tsx
const { refund } = usePowertranz();

const result = await refund({
  transactionIdentifier: originalTransactionId,
  amount: 99.99,
});
```

### Hosted Payment Page (HPP)

```tsx
const { startHostedPageSession } = usePowertranz();

const result = await startHostedPageSession({
  orderId: `ORD-${Date.now()}`,
  amount: 99.99,
  transactionIdentifier: crypto.randomUUID(),
  pageSet: "PowerTranz",
  pageName: "PaymentPage",
  siteRoot: window.location.origin,
});

if (result.ok) {
  // Render iframe with result.data.redirectData
}
```

### Recurring Payments

```tsx
const { setupManagedRecurring, cancelManagedRecurring } = usePowertranz();

// Set up recurring
const result = await setupManagedRecurring({
  orderId: `ORD-${Date.now()}`,
  amount: 29.99,
  transactionIdentifier: crypto.randomUUID(),
  cardToken: storedToken,
  startDate: "2025-02-01",
  expiryDate: "2026-02-01",
  frequency: "M", // Monthly
});

// Cancel recurring
await cancelManagedRecurring({
  recurringIdentifier: result.data.RecurringIdentifier,
});
```

## Types Reference

```tsx
import type {
  Result,                    // { ok: true, data: T } | { ok: false, error: {...} }
  TokenizeCardProps,
  TokenizeCardResponse,
  AuthFlowProps,
  CapturePaymentProps,
  DirectSaleProps,
  RefundProps,
  HostedPageProps,
  RecurringSetupProps,
  RecurringCancelProps,
  VoidProps,
  ZeroDollarAuthProps,
} from "@/lib/powertranz";
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `POWERTRANZ_BASE_URL` | Yes | API base URL (staging: `https://staging.ptranz.com/api`, prod: `https://ptranz.com/api`) |
| `POWERTRANZ_MERCHANT_ID` | Yes | Your merchant ID |
| `POWERTRANZ_PROCESSING_PASSWORD` | Yes | Your processing password |
| `POWERTRANZ_DEFAULT_CURRENCY` | No | Default currency (default: `780` TTD) |
| `POWERTRANZ_ADMIN_BASE_URL` | No | Admin API URL if different |

## Running Locally for Development

This template is also the registry source. To develop against it:

```bash
git clone https://github.com/yourusername/powertranz-starter-template
cd powertranz-starter-template
cp .env.example .env.local
# Fill in your PowerTranz credentials
yarn dev
```

Then add to your project:

```bash
npx shadcn@latest add @powertranz/payment-hooks
```

## Resources

- [API Keys Configuration](/docs/APIKeys.md)
- [Test Cards for Development](/docs/TestCards.md)
- [Recurring Transactions](/docs/RecurringTransactions.md)
- [Registry Documentation](/docs/SHADCN_REGISTRY_INTRO.md)

## License

MIT
