# Registry Namespaces

## Overview

The PowerTranz registry uses a simple namespace structure for organizing and referencing payment integration resources.

## Registry Configuration

Add the PowerTranz registry to your `components.json`:

```json
{
  "registries": {
    "@powertranz": "https://registry.example.com/r/{name}.json"
  }
}
```

## Installing from the Registry

Install the payment hooks using the namespace:

```bash
npx shadcn@latest add @powertranz/payment-hooks
```

Or install directly from URL:

```bash
npx shadcn@latest add https://your-registry-url/r/payment-hooks.json
```

## Namespace Syntax

The registry supports the following patterns:

| Pattern | Example | Description |
|---------|---------|-------------|
| `@namespace/item-name` | `@powertranz/payment-hooks` | Namespaced item |
| `item-name` | `payment-hooks` | Direct reference (if default registry configured) |
| `https://url/to/item.json` | Full URL reference |

## Registry URL Patterns

The `{name}` placeholder is replaced with the item name:

```json
{
  "registries": {
    "@powertranz": "https://registry.example.com/{name}.json"
  }
}
```

When installing `@powertranz/payment-hooks`, the CLI resolves to:
```
https://registry.example.com/payment-hooks.json
```

## Local Registry Development

For local development, point to your local server:

```json
{
  "registries": {
    "@powertranz": "http://localhost:3000/r/{name}.json"
  }
}
```

Start your Next.js dev server and run:
```bash
npx shadcn@latest add @powertranz/payment-hooks
```

## Multiple Registries

You can configure multiple registries:

```json
{
  "registries": {
    "@powertranz": "https://powertranz-registry.com/r/{name}.json",
    "@acme": "https://acme-registry.com/r/{name}.json"
  }
}
```

Install from specific registries:
```bash
npx shadcn@latest add @powertranz/payment-hooks @acme/utils
```

## Publishing Your Registry

To make your registry publicly available:

1. Deploy your Next.js project (Vercel, Netlify, etc.)
2. Ensure the `/public/r/` directory is served
3. Users can now install with:
   ```bash
   npx shadcn@latest add @powertranz/payment-hooks
   ```

## Security Considerations

- Use HTTPS for production registries
- Don't commit API keys or tokens to the registry
- Validate all inputs in your API routes
- Use environment variables for sensitive configuration
