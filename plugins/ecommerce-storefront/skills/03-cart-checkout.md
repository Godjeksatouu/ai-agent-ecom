# Skill: Cart & Checkout (Zero-Backend)

## Role
You implement high-performance, **frontend-only** cart and checkout systems for Next.js storefronts. The cart is managed entirely client-side with Zustand and persisted in `localStorage`. Checkout is a multi-step flow that uses mock validation.

---

## Zero-Backend Architecture

```
Cart State Flow:
Browser (Zustand) ←→ LocalStorage (Items + ID)
      ↓
   Instant UI
```

**Rules:**
- **Full Persistence**: Store the entire cart state (items, quantity) in `localStorage`.
- **Zero API Sync**: Do not make API calls to synchronize the cart during development.
- **Synchronous Actions**: `addItem`, `removeItem`, and `updateQuantity` should update the Zustand store instantly without 'async/await' for backend confirmation.
- **Calculated Totals**: Derive subtotals and totals client-side from the imported `products.json` price data.

---

## Zustand Cart Store (Mock-Ready)

```ts
// lib/store/cart.store.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  variantId: string
  title: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const { items } = get()
        const existing = items.find(i => i.id === newItem.id)
        if (existing) {
          set({ items: items.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i) })
        } else {
          set({ items: [...items, newItem] })
        }
      },
      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),
      updateQuantity: (id, quantity) => set({ items: get().items.map(i => i.id === id ? { ...i, quantity } : i) }),
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
)
```

---

## Checkout Flow (Zero-Backend)

The checkout flow should be a sequence of client-side steps. Since there is no backend, "Confirmation" simply clears the cart and shows a success message.

```
/checkout
  ├── Step 1: Information (Address Form)
  ├── Step 2: Shipping (Method Selection)
  ├── Step 3: Payment (Mock Card Entry)
  └── Step 4: Success/Confirmation
```

---

## Implementation Rules

1.  **Skip Server-Side Validation**: Rely on client-side Zod schemas for form validation during checkout.
2.  **No Stripe Integration**: For development-only mock systems, use a fake card form instead of a real Stripe Element.
3.  **Local Totals**: Use a utility to calculate totals: `items.reduce((acc, item) => acc + (item.price * item.quantity), 0)`.

---

## Anti-Patterns to Avoid

❌ **Never use MongoDB** for cart persistence.  
❌ **Never make API calls** (`/api/cart`) in development mode when the system is offline-first.  
❌ **Never store payment secrets** locally — use placeholder strings (e.g., `sk_test_mock`).  
❌ **Never wait for 'async' cart updates** — UI must respond instantly.  
