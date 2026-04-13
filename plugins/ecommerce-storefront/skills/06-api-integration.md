# Skill: API Integration

## Role
You implement robust, type-safe API integration layers for Next.js eCommerce storefronts. The API layer abstracts backend communication and handles errors consistently.

---

## API Client Architecture

```
Storefront → lib/api/ → Backend API (Medusa / Custom)
                ↓
         Type-safe functions
         Error handling
         Auth headers
         Cache control
```

---

## Base API Client

```ts
// lib/api/client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9000"

interface RequestOptions extends RequestInit {
  tags?: string[]
  revalidate?: number | false
}

export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message)
    this.name = "APIError"
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { tags, revalidate, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)
  headers.set("Content-Type", "application/json")

  // Add auth cookie passthrough for server components
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers")
    const cookieStore = cookies()
    const token = cookieStore.get("_session_token")?.value
    if (token) headers.set("Authorization", `Bearer ${token}`)
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
    next: {
      ...(tags && { tags }),
      ...(revalidate !== undefined && { revalidate }),
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new APIError(res.status, body.message ?? res.statusText, body.code)
  }

  return res.json() as Promise<T>
}
```

---

## Products API

```ts
// lib/api/products.ts
import { cache } from "react"
import { apiRequest } from "./client"
import type { Product } from "@/types/product"

interface ProductListParams {
  limit?: number
  offset?: number
  collection_id?: string[]
  tags?: string[]
  sort?: string
  q?: string
}

interface ProductListResponse {
  products: Product[]
  count: number
  offset: number
  limit: number
}

export const getProducts = cache(async (params: ProductListParams = {}): Promise<Product[]> => {
  const query = new URLSearchParams()
  if (params.limit) query.set("limit", String(params.limit))
  if (params.offset) query.set("offset", String(params.offset))
  if (params.q) query.set("q", params.q)
  if (params.sort) query.set("order", params.sort)
  if (params.collection_id?.length) {
    params.collection_id.forEach(id => query.append("collection_id[]", id))
  }

  const { products } = await apiRequest<ProductListResponse>(
    `/store/products?${query.toString()}`,
    { tags: ["products"], revalidate: 60 }
  )
  return products
})

export const getProduct = cache(async (handle: string): Promise<Product | null> => {
  try {
    const { product } = await apiRequest<{ product: Product }>(
      `/store/products?handle=${handle}`,
      { tags: [`product-${handle}`, "products"], revalidate: 60 }
    ).then(res => ({ product: (res as { products: Product[] }).products[0] ?? null }))
    return product
  } catch {
    return null
  }
})
```

---

## Cart API

```ts
// lib/api/cart.ts
import { apiRequest } from "./client"
import type { Cart } from "@/types/cart"

export async function createCart(): Promise<Cart> {
  const { cart } = await apiRequest<{ cart: Cart }>("/store/carts", {
    method: "POST",
    body: JSON.stringify({}),
  })
  return cart
}

export async function getCart(cartId: string): Promise<Cart | null> {
  try {
    const { cart } = await apiRequest<{ cart: Cart }>(`/store/carts/${cartId}`, {
      cache: "no-store", // Always fresh
    })
    return cart
  } catch {
    return null
  }
}

export async function addLineItem(
  cartId: string,
  params: { variantId: string; quantity: number }
): Promise<Cart> {
  const { cart } = await apiRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items`,
    {
      method: "POST",
      body: JSON.stringify({
        variant_id: params.variantId,
        quantity: params.quantity,
      }),
    }
  )
  return cart
}

export async function removeLineItem(cartId: string, lineItemId: string): Promise<Cart> {
  const { cart } = await apiRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    { method: "DELETE" }
  )
  return cart
}

export async function updateLineItem(
  cartId: string,
  lineItemId: string,
  params: { quantity: number }
): Promise<Cart> {
  const { cart } = await apiRequest<{ cart: Cart }>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  )
  return cart
}
```

---

## Data Fetching Patterns

### Pattern 1: Parallel Fetching (Best for Pages)
```ts
// Always fetch in parallel — never sequentially
const [product, recommendations, inventory] = await Promise.all([
  getProduct(handle),
  getRelatedProducts(handle, { limit: 4 }),
  getInventoryStatus(handle),
])
```

### Pattern 2: Error-First Design
```ts
// lib/api/safe-fetch.ts
export async function safeFetch<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn()
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[API Error]", err)
    }
    return fallback
  }
}

// Usage:
const products = await safeFetch(() => getProducts({ limit: 8 }), [])
```

### Pattern 3: SWR for Client-Side Mutations
```ts
// For real-time data that needs to stay fresh on the client
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useWishlist() {
  const { data, mutate, isLoading } = useSWR("/api/wishlist", fetcher)

  const addToWishlist = async (productId: string) => {
    await mutate(
      fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }).then(r => r.json()),
      { optimisticData: [...(data ?? []), { productId }] }
    )
  }

  return { items: data ?? [], addToWishlist, isLoading }
}
```

---

## Price Utility

```ts
// lib/utils/price.ts
import type { Money } from "@/types/product"

const formatters = new Map<string, Intl.NumberFormat>()

export function formatPrice(money: Money | undefined | null): string {
  if (!money) return ""

  const key = money.currency_code
  if (!formatters.has(key)) {
    formatters.set(
      key,
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: money.currency_code,
        minimumFractionDigits: 2,
      })
    )
  }

  // Prices stored as integers in smallest unit (cents)
  return formatters.get(key)!.format(money.amount / 100)
}

export function calculateDiscount(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100)
}
```

---

## Anti-Patterns

❌ Never fetch in `useEffect` for initial page data — use RSC  
❌ Never expose API keys or secret tokens to the client  
❌ Never swallow errors silently — always log and handle  
❌ Never fetch sequentially when parallel is possible  
❌ Never hardcode prices or currency in UI strings  
