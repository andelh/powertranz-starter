# PowerTranz Registry

This project includes a shadcn-style code registry for distributing PowerTranz payment integration components.

## What is the Registry?

The registry allows you to distribute reusable code (components, hooks, API routes, utilities) that can be installed into other projects using the shadcn CLI.

## Available Items

### payment-hooks

A complete PowerTranz payment integration with:

- **React Hook**: `usePowertranz` - Client-side hook for payment operations
- **API Routes**: Full set of Next.js API routes for payment flows
- **Type Definitions**: TypeScript interfaces for all payment operations
- **Request Builders**: Helper functions for building PowerTranz API requests

## Installation

Install the payment hooks into your project:

```bash
npx shadcn@latest add https://your-registry-url/r/payment-hooks.json
```

Or for local development:

```bash
npx shadcn@latest add ./public/r/payment-hooks.json
```

## Requirements

After installation, you'll need:

1. PowerTranz API credentials
2. Environment variables configured
3. shadcn/ui components (button, input, label, card)

## Registry Structure

```
registry/
  payment-hooks/
    lib/powertranz/        # Core library (types, client, builders)
    components/            # React components and hooks
    app/api/powertranz/    # Next.js API routes
```

## Related Documentation

- [Getting Started](SHADCN_REGISTRY_GETTING_STARTED.md)
- [Registry Configuration](SHADCN_REGISTRY_NAMESPACES.md)
- [API Reference](../APIKeys.md)
- [Testing Guide](../TestCards.md)
