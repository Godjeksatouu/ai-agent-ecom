# ecommerce-storefront Plugin

**Version:** 1.0.0  
**Category:** Storefront  
**Stack:** Next.js 14+, TypeScript, React, Zustand

---

## What This Plugin Does

This plugin gives your AI assistant expert knowledge for building **production-grade Next.js eCommerce storefronts**. It covers:

| Area | What You Get |
|------|-------------|
| **Architecture** | App Router structure, RSC patterns, route groups |
| **Products** | Product cards, grids, PDP, gallery, variant selection |
| **Cart** | Zustand store, cart drawer, optimistic updates |
| **Checkout** | Multi-step flow, payment integration, session management |
| **Auth** | HTTP-only cookies, middleware, customer accounts |
| **API** | Type-safe API client, caching, error handling |
| **Performance** | Core Web Vitals, image optimization, ISR |
| **SEO** | Metadata API, JSON-LD, sitemap, robots.txt |

---

## Skills

| File | Topic |
|------|-------|
| `01-architecture.md` | Project structure, routing, RSC patterns, env vars |
| `02-product-components.md` | ProductCard, ProductGrid, PDP, ProductGallery, ProductInfo |
| `03-cart-checkout.md` | Cart store, CartDrawer, checkout steps, payment API |
| `04-performance-seo.md` | Images, ISR, metadata, JSON-LD, sitemap, fonts |
| `05-auth-accounts.md` | Login, middleware, session, account dashboard |
| `06-api-integration.md` | API client, data fetching, price utils, SWR |

---

## Reference

| Path | Contents |
|------|----------|
| `reference/components/` | Button, Input, Badge components |
| `reference/layouts/` | StoreLayout, Header, Footer |
| `reference/features/` | ProductFilters, CartDrawer, CheckoutProgress |

---

## Example Prompts

Once the plugin is loaded, use these prompts in Cursor or VS Code:

```
"Create a product listing page for /products with server-side filtering and URL-based state"
```

```
"Build the cart drawer with add/remove/quantity controls and real-time totals"
```

```
"Add Stripe checkout with server-side PaymentIntent creation"
```

```
"Create a customer login page with redirect-after-login and HTTP-only cookie auth"
```

```
"Optimize the product detail page for Core Web Vitals and add JSON-LD structured data"
```

```
"Generate a complete sitemap.ts for all products and collections"
```

```
"Create the checkout multi-step flow: information → delivery → payment → confirmation"
```

---

## Loading This Plugin

```bash
# Using the CLI loader
node core/loader.js --plugin ecommerce-storefront

# Or sync all active plugins at once
node core/loader.js --sync
```

This will generate:
- `.cursor/rules/ecommerce-storefront.mdc` — Cursor Project Rule
- `.vscode/instructions/ecommerce-storefront.md` — VS Code Copilot instruction

---

## Manual Integration (No CLI)

### Cursor
Copy `.cursor/rules/ecommerce-storefront.mdc` into your project's `.cursor/rules/` directory.  
Or paste skill content directly into **Cursor → Project Rules**.

### VS Code
Copy `.vscode/instructions/ecommerce-storefront.md` to your project's `.vscode/instructions/`.  
In VS Code settings, add it as a custom Copilot instruction file.
