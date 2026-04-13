# Skill: Cart & Checkout

## Role
You implement production-grade cart and checkout systems for Next.js storefronts. The cart is managed client-side with Zustand + server-side persistence via the API. Checkout uses a step-based flow with server-side session management.

---

## Cart Architecture

```
Cart State Flow:
Browser (Zustand) ←→ API (Backend) ←→ Database
      ↓
  localStorage (cart_id only — not items)
```

**Rules:**
- Store only `cart_id` in localStorage — never full cart data
- Always sync with backend on mount via `useCart` hook
- Optimistic updates: update UI instantly, revert on API failure
- Cart is server-side authoritative (price, inventory checked server-side)

---

## Zustand Cart Store

```ts
// lib/store/cart.store.ts
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { getCart, createCart, addLineItem, removeLineItem, updateLineItem } from "@/lib/api/cart"
import type { Cart, LineItem } from "@/types/cart"

interface CartStore {
  cart: Cart | null
  cartId: string | null
  isOpen: boolean
  isLoading: boolean

  // Actions
  initCart: () => Promise<void>
  addItem: (params: { variantId: string; quantity: number }) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: null,
      cartId: null,
      isOpen: false,
      isLoading: false,

      initCart: async () => {
        const { cartId } = get()
        set({ isLoading: true })
        try {
          if (cartId) {
            const cart = await getCart(cartId)
            if (cart) {
              set({ cart, isLoading: false })
              return
            }
          }
          // Create new cart if none exists or existing is expired
          const newCart = await createCart()
          set({ cart: newCart, cartId: newCart.id, isLoading: false })
        } catch (err) {
          console.error("Failed to initialize cart:", err)
          set({ isLoading: false })
        }
      },

      addItem: async ({ variantId, quantity }) => {
        const { cartId, initCart } = get()
        if (!cartId) await initCart()

        const currentCartId = get().cartId!
        set({ isLoading: true })

        // Optimistic update
        const previousCart = get().cart

        try {
          const updatedCart = await addLineItem(currentCartId, { variantId, quantity })
          set({ cart: updatedCart, isOpen: true, isLoading: false })
        } catch (err) {
          // Revert optimistic update
          set({ cart: previousCart, isLoading: false })
          throw err
        }
      },

      removeItem: async (lineItemId) => {
        const { cartId } = get()
        if (!cartId) return
        set({ isLoading: true })
        try {
          const updatedCart = await removeLineItem(cartId, lineItemId)
          set({ cart: updatedCart, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      updateItem: async (lineItemId, quantity) => {
        const { cartId } = get()
        if (!cartId) return
        set({ isLoading: true })
        try {
          const updatedCart = await updateLineItem(cartId, lineItemId, { quantity })
          set({ cart: updatedCart, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      clearCart: () => set({ cart: null, cartId: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartId: state.cartId }), // Only persist cartId
    }
  )
)
```

---

## useCart Hook (Public API)

```ts
// lib/hooks/useCart.ts
import { useEffect } from "react"
import { useCartStore } from "@/lib/store/cart.store"

export function useCart() {
  const store = useCartStore()

  useEffect(() => {
    store.initCart()
  }, [])

  return {
    cart: store.cart,
    cartId: store.cartId,
    isOpen: store.isOpen,
    isLoading: store.isLoading,
    itemCount: store.cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    total: store.cart?.total ?? 0,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateItem: store.updateItem,
    openCart: store.openCart,
    closeCart: store.closeCart,
  }
}
```

---

## Cart Drawer Component

```tsx
// components/cart/CartDrawer.tsx
"use client"
import { useCart } from "@/lib/hooks/useCart"
import { CartLineItem } from "./CartLineItem"
import { Button } from "@/components/ui/Button"
import { formatPrice } from "@/lib/utils/price"
import { useRouter } from "next/navigation"

export function CartDrawer() {
  const { cart, isOpen, closeCart, itemCount, isLoading } = useCart()
  const router = useRouter()

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="cart-drawer__backdrop"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside
        className={`cart-drawer ${isOpen ? "cart-drawer--open" : ""}`}
        aria-label="Shopping cart"
        aria-modal="true"
        role="dialog"
      >
        <header className="cart-drawer__header">
          <h2>Cart ({itemCount})</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="cart-drawer__close"
          >
            ×
          </button>
        </header>

        {isLoading ? (
          <div className="cart-drawer__loading" aria-live="polite">Loading…</div>
        ) : cart?.items.length === 0 || !cart ? (
          <div className="cart-drawer__empty">
            <p>Your cart is empty.</p>
            <Button variant="outline" onClick={closeCart}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__items" aria-label="Cart items">
              {cart.items.map(item => (
                <li key={item.id}>
                  <CartLineItem item={item} />
                </li>
              ))}
            </ul>

            <footer className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <span>{formatPrice({ amount: cart.subtotal, currency_code: cart.currency_code })}</span>
              </div>
              <p className="cart-drawer__shipping-note">Shipping & taxes calculated at checkout</p>
              <Button
                className="cart-drawer__checkout-btn"
                onClick={() => {
                  closeCart()
                  router.push("/checkout")
                }}
              >
                Proceed to Checkout
              </Button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}
```

---

## Checkout Flow Architecture

```
/checkout
  ├── /information   → Shipping address
  ├── /delivery      → Shipping method selection
  ├── /payment       → Payment method + card
  └── /confirmation  → Order confirmed
```

**Key Rules:**
- Each step validates before proceeding
- State lives in server session (cookie) — not URL
- Payment is processed server-side via API route
- Never expose payment keys to the client

```tsx
// app/(store)/checkout/[step]/page.tsx
import { redirect } from "next/navigation"
import { getCheckoutSession } from "@/lib/api/checkout"
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress"
import { InformationStep } from "@/components/checkout/InformationStep"
import { DeliveryStep } from "@/components/checkout/DeliveryStep"
import { PaymentStep } from "@/components/checkout/PaymentStep"

const STEPS = ["information", "delivery", "payment", "confirmation"] as const
type CheckoutStep = typeof STEPS[number]

export default async function CheckoutStepPage({ params }: { params: { step: CheckoutStep } }) {
  const session = await getCheckoutSession()
  if (!session?.cartId) redirect("/cart")

  const stepComponents: Record<CheckoutStep, React.ReactNode> = {
    information: <InformationStep cart={session.cart} />,
    delivery: <DeliveryStep cart={session.cart} />,
    payment: <PaymentStep cart={session.cart} />,
    confirmation: <div>Order confirmed!</div>,
  }

  return (
    <div className="checkout">
      <CheckoutProgress currentStep={params.step} steps={STEPS} />
      <div className="checkout__content">
        {stepComponents[params.step] ?? redirect("/checkout/information")}
      </div>
    </div>
  )
}
```

---

## Payment Integration (Server-Side)

```ts
// app/api/checkout/payment/route.ts
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" })

export async function POST(req: NextRequest) {
  const { cartId } = await req.json()

  try {
    // Get cart from backend
    const cart = await fetchCart(cartId) // your backend call

    // Create Stripe PaymentIntent server-side
    const paymentIntent = await stripe.paymentIntents.create({
      amount: cart.total,
      currency: cart.currency_code,
      automatic_payment_methods: { enabled: true },
      metadata: { cart_id: cartId },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 })
  }
}
```

---

## Anti-Patterns

❌ Don't store cart items in localStorage — only the ID  
❌ Don't process payments client-side — always via API route  
❌ Don't trust client-side prices — validate totals server-side  
❌ Don't skip loading states — always show feedback during async ops  
❌ Don't handle payment errors silently — surface them to the user  
