# Skill: Anti-Pattern Detection & Self-Critique

## Role
Before generating any production eCommerce code, run this mental checklist. This skill defines what NOT to do and the self-critique protocol to catch mistakes before they leave the agent.

---

## Reasoning Protocol (THINK → PLAN → EXECUTE → REVIEW → IMPROVE)

### THINK
Ask yourself:
- What is the developer actually asking for?
- Is this a UI component, a page, an API route, or a utility?
- Which skills are most relevant? (architecture, products, cart, auth, performance?)
- What's the complexity level? (new feature vs. fix vs. refactor)

### PLAN
- Identify which patterns from skills apply
- Note the RSC/client boundary — where does interactivity occur?
- Identify the data source — server fetch, Zustand, SWR?
- List the types needed

### EXECUTE
- Write code following skills exactly
- One concern per component
- TypeScript everywhere

### REVIEW (Self-Critique Checklist)
Run through every output before finalizing:

```
[ ] No <img> tags — only next/image with sizes attribute
[ ] No any TypeScript type — proper interfaces exist
[ ] No fetch() inside useEffect for initial data — RSC or SWR
[ ] No auth token in localStorage — HTTP-only cookies only
[ ] No client-side payment processing — API route exists
[ ] No hardcoded currency or price values
[ ] No sequential awaits when parallel is possible
[ ] No missing loading/error states
[ ] No logic inside presentational components
[ ] No missing accessibility attributes (alt, aria-label, role)
[ ] No "use client" on components that don't need it
[ ] No missing key props in lists
```

### IMPROVE
If any checklist item fails → rewrite that section before outputting.

---

## Anti-Pattern Catalog

### 🔴 Critical — Never Do These

#### AP-01: Raw `<img>` Instead of `next/image`
```tsx
// ❌ WRONG — causes CLS, no optimization
<img src={product.thumbnail} alt={product.title} />

// ✅ CORRECT
<Image
  src={product.thumbnail}
  alt={product.title}
  fill
  sizes="(max-width: 640px) 50vw, 25vw"
/>
```

#### AP-02: Auth Token in localStorage
```ts
// ❌ WRONG — XSS vulnerable
localStorage.setItem("token", authToken)

// ✅ CORRECT — HTTP-only cookie via API route
response.cookies.set({ name: "_session_token", value: token, httpOnly: true })
```

#### AP-03: Client-Side Payment Processing
```ts
// ❌ WRONG — exposes secret key, untrustworthy amount
const paymentIntent = await stripe.paymentIntents.create({ amount: cart.total })

// ✅ CORRECT — always in an API route (server-side)
// POST /api/checkout/payment → creates PaymentIntent, returns clientSecret only
```

#### AP-04: `any` TypeScript
```ts
// ❌ WRONG
const product: any = await getProduct(handle)

// ✅ CORRECT
const product: Product | null = await getProduct(handle)
```

#### AP-05: Data Fetching in useEffect for Initial Data
```ts
// ❌ WRONG — waterfall, no SSR, no caching
useEffect(() => {
  fetch("/api/products").then(r => r.json()).then(setProducts)
}, [])

// ✅ CORRECT — Server Component
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}
```

---

### 🟡 Warning — Avoid These

#### AP-06: Sequential Awaits
```ts
// ❌ SLOW — 3 requests serially = 3x latency
const product = await getProduct(handle)
const related = await getRelatedProducts(handle)
const reviews = await getReviews(handle)

// ✅ FAST — parallel
const [product, related, reviews] = await Promise.all([
  getProduct(handle),
  getRelatedProducts(handle),
  getReviews(handle),
])
```

#### AP-07: Missing `sizes` on fill Images
```tsx
// ❌ Browser downloads full-size image for all viewports
<Image src={img} alt="..." fill />

// ✅ Browser downloads correct size per viewport
<Image src={img} alt="..." fill sizes="(max-width: 640px) 50vw, 25vw" />
```

#### AP-08: Business Logic in UI Components
```tsx
// ❌ ProductCard shouldn't calculate discounts
function ProductCard({ product }) {
  const discount = ((product.compare_at_price - product.price) / product.compare_at_price) * 100
  const isEligible = discount > 10 && product.stock > 0 && ...
  ...
}

// ✅ Pure presentation — compute in parent or utility
const discount = calculateDiscount(variant)
return <ProductCard product={product} discount={discount} />
```

#### AP-09: Hardcoded Currency / Price
```tsx
// ❌ WRONG
<span>${(product.price / 100).toFixed(2)}</span>

// ✅ CORRECT
<span>{formatPrice(variant.price)}</span>
// formatPrice uses Intl.NumberFormat with correct currency
```

#### AP-10: Missing Suspense Boundaries
```tsx
// ❌ Entire page blocks on slow fetches
export default async function Page() {
  const data = await slowFetch() // blocks full page render
  return <ExpensiveComponent data={data} />
}

// ✅ Streaming with granular Suspense
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ExpensiveComponent />  {/* fetches inside, streams independently */}
    </Suspense>
  )
}
```

#### AP-11: "use client" Overuse
```tsx
// ❌ Page-level client component — loses RSC benefits
"use client"
export default function ProductsPage() { ... }

// ✅ Only leaf interactive components get "use client"
// The page is a RSC, only AddToCartButton is a client component
```

#### AP-12: Cart Items in localStorage
```ts
// ❌ Cart items can be tampered, prices manipulated
localStorage.setItem("cart", JSON.stringify(cartItems))

// ✅ Only cart ID persisted — items pulled from server
partialize: (state) => ({ cartId: state.cartId })
```

---

### 🟢 Architecture Quality Rules

#### AQ-01: Single Responsibility
Every component does ONE thing:
- `ProductCard` → displays a product card
- `AddToCartButton` → handles add-to-cart interaction
- `CartLineItem` → displays and manages one cart line

Never merge these into one component.

#### AQ-02: Co-locate Types
Types live alongside or near their usage:
- `types/product.ts` → Product, ProductVariant, Money
- `types/cart.ts` → Cart, LineItem
- Never inline complex type definitions in component props

#### AQ-03: API Layer Separation
```
UI Component → hooks → lib/api → backend
                          ↑
            Never cross this boundary from UI directly
```

#### AQ-04: Error-First Design
Every async operation has:
1. Loading state
2. Error state
3. Empty state
4. Success state

Missing any of these = incomplete implementation.

---

## eCommerce Compliance Checks

Before marking any feature "done", verify:

### Cart Compliance
- [ ] Cart initialized from server on mount
- [ ] Only `cartId` persisted locally
- [ ] Prices validated server-side (never trust client price)
- [ ] Inventory checked server-side on checkout

### Checkout Compliance
- [ ] Phone/email validated before proceeding
- [ ] Shipping method selected before payment step
- [ ] Payment processed via API route (server-only)
- [ ] Order confirmation sent to customer

### Product Compliance
- [ ] All variants explicitly listed (not implied)
- [ ] Out-of-stock state shown clearly
- [ ] Price includes all applicable taxes/fees disclosure
- [ ] Images have descriptive alt text

### Auth Compliance
- [ ] Passwords never logged or stored in plaintext
- [ ] Auth routes rate-limited
- [ ] Redirect-after-login preserves original destination
- [ ] Session invalidated on logout (server-side)
