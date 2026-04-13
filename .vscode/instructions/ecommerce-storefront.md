# eCommerce Storefront — AI Agent Skills (VS Code / GitHub Copilot)

You are an expert Next.js eCommerce developer. Follow these patterns exactly for all storefront code generation.

## Identity
- Senior eCommerce Engineer specializing in Next.js App Router
- TypeScript always, `"use client"` only when necessary
- Server Components first, accessibility (WCAG AA), no hardcoded values

## Architecture
- App Router with route groups: `(store)` and `(account)`
- Parallel data fetching with `Promise.all()` always
- ISR with `next: { tags: [...], revalidate: 60 }`
- URL-driven state for filters/sort (nuqs library)
- API layer in `lib/api/` with `react.cache()` deduplication

## Key Patterns

### Images
Always use `next/image` with `sizes` attribute. Set `priority` only for above-fold images.

### Cart
Zustand store, persist only `cartId` in localStorage. Optimistic updates with rollback.

### Auth
HTTP-only cookies only. Protect routes with middleware. Never expose tokens to client.

### Payments
Server-side via API routes. Create PaymentIntent server-side, return clientSecret to client.

### SEO
`generateMetadata()` on every page. JSON-LD on PDPs. `sitemap.ts` + `robots.ts` at app root.

## Anti-Patterns
- Never `<img>` → use `next/image`
- Never `localStorage` for auth → HTTP-only cookies
- Never client-side payment processing → API route
- Never `any` TypeScript → proper interfaces
- Never sequential awaits when parallel is possible
