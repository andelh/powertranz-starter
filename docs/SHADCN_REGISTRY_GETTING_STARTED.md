# Getting Started with the PowerTranz Registry

This guide walks you through installing and using the PowerTranz payment integration from the registry.

## Prerequisites

1. A Next.js project with shadcn/ui initialized
2. PowerTranz merchant account credentials
3. Node.js 18+

## Step 1: Install the Registry Item

Add the payment hooks to your project:

```bash
npx shadcn@latest add @powertranz/payment-hooks
```

This will install:

- `components/hooks/use-powertranz.ts` - Main React hook
- `components/powertranz-iframe.tsx` - Iframe component for hosted payments
- `lib/powertranz/` - Core library with types and client
- `app/api/powertranz/*` - API routes for all payment operations

## Step 2: Configure Environment Variables

Add these to your `.env.local`:

```env
POWERTRANZ_BASE_URL=https://api.powertranz.io
POWERTRANZ_MERCHANT_ID=your_merchant_id
POWERTRANZ_PROCESSING_PASSWORD=your_password
POWERTRANZ_DEFAULT_CURRENCY=780  # Optional, defaults to 780 (NZD)
```

## Step 3: Use the Hook

```tsx
import usePowertranz from "@/components/hooks/use-powertranz";

function CheckoutForm() {
  const { tokenizeCard, loading, error } = usePowertranz();

  const handleSubmit = async (cardData: TokenizeCardProps) => {
    const result = await tokenizeCard(cardData);
    if (result.ok) {
      // Card tokenized successfully
      console.log(result.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

## Available Hook Methods

| Method | Description |
|--------|-------------|
| `tokenizeCard()` | Tokenize a credit card |
| `startAuth()` | Start authorization flow (3D Secure) |
| `capture()` | Capture an authorization |
| `directSale()` | Direct sale (auth + capture) |
| `refund()` | Process a refund |
| `voidAuthorization()` | Void an authorization |
| `startHostedPageSession()` | Hosted Payment Page flow |
| `setupManagedRecurring()` | Set up recurring payment |
| `cancelManagedRecurring()` | Cancel recurring payment |
| `zeroDollarAuth()` | Zero-dollar authorization for card validation |

## Required shadcn Components

The registry depends on these shadcn/ui components:

```bash
npx shadcn@latest add button input label card
```

## Next Steps

- [API Keys Configuration](../APIKeys.md)
- [Test Cards for Development](../TestCards.md)
- [Recurring Transactions](../RecurringTransactions.md)
