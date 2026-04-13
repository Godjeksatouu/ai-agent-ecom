# Skill: Mock API Integration (Offline-First)

## Role
You implement a **frontend-only, zero-backend** API integration layer for Next.js eCommerce storefronts. This approach uses local JSON files as the single source of truth, removing all dependencies on MongoDB or external APIs during development.

---

## Zero-Backend Architecture

```
Storefront → lib/api/ → Local JSON Data (/data/*.json)
                 ↓
          Synchronous / Mock-Async functions
          No API Errors (offline reliable)
          Instant rendering
```

---

## Mock API Strategy

### 1. Unified Mock Client
Instead of making `fetch` calls, import JSON data directly into your API functions.

```ts
// lib/api/client.ts
// In mock mode, the 'client' just provides a standard interface
export async function mockDelay(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### 2. Products API (JSON-Backed)

```ts
// lib/api/products.ts
import productsData from "@/data/products.json"
import type { Product } from "@/types/product"

export async function getProducts() {
  // Simulate network delay for realistic UI behavior
  await new Promise(r => setTimeout(r, 200))
  return productsData as Product[]
}

export async function getProduct(handle: string) {
  const products = await getProducts()
  return products.find(p => p.handle === handle) ?? null
}

export async function getFeaturedProducts() {
  const products = await getProducts()
  return products.slice(0, 4)
}
```

### 3. Cart API (Local Management)

```ts
// lib/api/cart.ts
// In a zero-backend system, the cart is usually handled 
// purely by the Zustand store (see useCart store reference).
```

---

## Data Structure (/data Folder)

The `/data` folder contains the project's state. AI should generate these files during scaffolding.

### products.json
```json
[
  {
    "id": "1",
    "handle": "clean-code",
    "title": "Clean Code",
    "price": 2999,
    "image": "/images/clean-code.jpg",
    "category": "Programming"
  }
]
```

### users.json
```json
[
  {
    "id": "u1",
    "name": "Test User",
    "email": "test@example.com"
  }
]
```

---

## Benefits of JSON-Only Development

1.  **Instant Start**: Developers only need `npm install` and `npm run dev`. No database setup required.
2.  **Offline Compatibility**: Works without internet or local server instances.
3.  **Deterministic UI**: No random API failures during development/testing.
4.  **Simpler Scaffolding**: Agent doesn't need to write complex Prisma/Mongoose schemas.

---

## Transitioning to Real API (Optional)
When the user is ready for a real backend, only the `lib/api/` and `lib/store/` files need to be swapped for real `fetch` calls. The UI components remain unchanged as they consume the same TypeScript interfaces.

---

## Anti-Patterns to Avoid

❌ **Never use MongoDB/Mongoose** unless specifically asked for a production backend.  
❌ **Never write complex API routes** for basic CRUD if JSON mocking suffices.  
❌ **Never skip Type Safety** even when using JSON — always cast with `as Product[]`.  
❌ **Never hardcode data** directly in `.tsx` files — always centralize in `/data/*.json`.  
