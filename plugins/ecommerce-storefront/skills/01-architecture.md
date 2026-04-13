# Skill: eCommerce Storefront Architecture

## Role
You are an expert Next.js eCommerce architect. When generating storefront code, always follow these patterns precisely.

---

## Project Structure (App Router — Next.js 14+)

```
storefront/
├── app/
│   ├── (store)/                    # Route group: storefront pages
│   │   ├── layout.tsx              # Store shell: header, footer, cart drawer
│   │   ├── page.tsx                # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx            # Product listing
│   │   │   └── [handle]/
│   │   │       └── page.tsx        # Product detail (PDP)
│   │   ├── collections/
│   │   │   └── [handle]/
│   │   │       └── page.tsx        # Collection page
│   │   ├── cart/
│   │   │   └── page.tsx            # Cart page
│   │   └── checkout/
│   │       ├── page.tsx            # Checkout start
│   │       └── [step]/
│   │           └── page.tsx        # Multi-step checkout
│   ├── (account)/                  # Route group: customer account
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── account/
│   │       ├── page.tsx            # Account dashboard
│   │       └── orders/[id]/page.tsx
│   └── api/                        # API routes (BFF layer)
│       ├── cart/route.ts
│       └── checkout/route.ts
├── components/
│   ├── ui/                         # Primitive UI (Button, Input, Badge...)
│   ├── product/                    # Product-domain components
│   ├── cart/                       # Cart-domain components
│   ├── checkout/                   # Checkout-domain components
│   ├── layout/                     # Header, Footer, Nav
│   └── common/                     # Breadcrumbs, Toasts, Modals
├── lib/
│   ├── api/                        # API client functions
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   └── customer.ts
│   ├── hooks/                      # Custom React hooks
│   ├── store/                      # Zustand global store
│   └── utils/                      # Formatters, helpers
├── types/                          # TypeScript type definitions
├── styles/                         # Global CSS + design tokens
└── public/                         # Static assets
```

---

## Core Architecture Principles

### 1. Server Components First (RSC)
- Default to **React Server Components** for all pages and data-fetching components
- Only use `"use client"` for:
  - Interactive UI (cart drawer, modals, forms)
  - Browser-only APIs (localStorage, window)
  - State that must persist across navigation

```tsx
// ✅ CORRECT: Server Component (default)
// app/(store)/products/page.tsx
import { getProducts } from "@/lib/api/products"
import { ProductGrid } from "@/components/product/ProductGrid"

export default async function ProductsPage() {
  const products = await getProducts({ limit: 24 })
  return <ProductGrid products={products} />
}

// ✅ CORRECT: Client Component (only when needed)
// components/cart/AddToCartButton.tsx
"use client"
import { useCart } from "@/lib/hooks/useCart"

export function AddToCartButton({ variantId }: { variantId: string }) {
  const { addItem } = useCart()
  return <button onClick={() => addItem(variantId)}>Add to Cart</button>
}
```

### 2. Data Fetching Pattern
- Fetch data in **Server Components** at the page level
- Pass data down as props — avoid prop drilling deeper than 2 levels (use composition)
- Use **React cache()** to deduplicate identical fetches within a request

```ts
// lib/api/products.ts
import { cache } from "react"

export const getProduct = cache(async (handle: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${handle}`, {
    next: { tags: [`product-${handle}`] } // ISR cache tag
  })
  if (!res.ok) return null
  return res.json() as Promise<Product>
})
```

### 3. URL-Driven State
- Filters, sort, pagination → **URL search params** (not component state)
- Cart, user session → **Server-side cookies + Zustand hydration**
- Use `nuqs` library for type-safe URL state management

```tsx
// ✅ URL-driven filters
import { useQueryState } from "nuqs"

export function SortSelector() {
  const [sort, setSort] = useQueryState("sort", { defaultValue: "relevance" })
  return <select value={sort} onChange={e => setSort(e.target.value)} />
}
```

### 4. Error Boundaries & Suspense
- Wrap every async page section in `<Suspense>` with a skeleton
- Use `error.tsx` for per-route error boundaries

```tsx
// app/(store)/products/page.tsx
import { Suspense } from "react"
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton"

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsContent />
    </Suspense>
  )
}
```

### 5. Type Safety Contract
- Define all API response types in `/types/`
- Never use `any` — use `unknown` + type guards

```ts
// types/product.ts
export interface Product {
  id: string
  handle: string
  title: string
  description: string
  thumbnail: string | null
  variants: ProductVariant[]
  collection: Collection | null
  tags: string[]
  metadata: Record<string, unknown>
}

export interface ProductVariant {
  id: string
  title: string
  sku: string
  price: Money
  inventory_quantity: number
  options: VariantOption[]
}

export interface Money {
  amount: number
  currency_code: string
}
```

---

## Routing Conventions

| Route | Purpose | Data Source |
|-------|---------|-------------|
| `/` | Homepage (hero, featured, categories) | Static ISR + API |
| `/products` | Product listing with filters | Dynamic SSR |
| `/products/[handle]` | Product detail page | ISR (on-demand revalidation) |
| `/collections/[handle]` | Collection/category page | ISR |
| `/cart` | Cart review | Client-side (Zustand) |
| `/checkout` | Multi-step checkout | Server-side session |
| `/account` | Customer dashboard | SSR (auth-gated) |

---

## Environment Variables Pattern

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:9000   # Backend API base URL
NEXT_PUBLIC_STORE_ID=default               # Store identifier
API_SECRET_KEY=your_secret_key             # Server-only: backend auth
NEXT_PUBLIC_STRIPE_KEY=pk_test_...         # Payment processor
```

**Rule**: Any variable used in Server Components only → no `NEXT_PUBLIC_` prefix (stays server-side).

---

## Anti-Patterns Reference
> See `skill:anti-patterns` for the complete anti-pattern catalog and THINK→PLAN→EXECUTE→REVIEW→IMPROVE protocol.

❌ Don't put page-level logic in layout files  
❌ Don't share route group layouts between `(store)` and `(account)`  
❌ Don't create catch-all routes without a proper `not-found.tsx`  
❌ Don't skip `error.tsx` boundaries on data-heavy routes  
