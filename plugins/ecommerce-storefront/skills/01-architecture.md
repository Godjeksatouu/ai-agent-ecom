# Skill: eCommerce Storefront Architecture (v2.2)

## Role
You are an expert Next.js eCommerce architect. You build **high-conversion, premium storefronts** using a minimal design system, TailwindCSS, and a modular component architecture.

---

## Design System Principles

1.  **Neutral Palette**: Primary colors are White, Beige, and Soft Gray (#F5F5F5, #FAFAFA, #111111).
2.  **Soft UI**: Use `rounded-2xl` (1rem) or `rounded-[2rem]` for a premium, modern feel.
3.  **Strong Whitespace**: Large `py-20` or `py-32` sections to reduce cognitive load.
4.  **Grid Layout**: Use CSS Grid for all major sections (Hero, Cards, Footer).
5.  **Motion Hierarchy**: Staggered entrance for grids, smooth scale on hover for images.

---

## Layout Hierarchy (Page Structure)

Every store page should follow this structural pattern for maximum conversion:

### A. Navbar (Global)
- **Left**: Brand Logo (Vector/Minimal).
- **Center**: Primary Navigation (Flexbox, centered/left).
- **Right**: Search, User, Cart (Icons + badges).
- **Style**: Sticky with `backdrop-blur-lg` on scroll.

### B. Hero Section (Home Only)
- **Layout**: 2-column CSS Grid.
- **Left**: Headline (H1), Description, Primary & Secondary CTAs.
- **Right**: High-quality lifestyle visual or interactive product.
- **Trust Elements**: Small status cards (e.g., "5k+ Happy Customers").

### C. Collections Grid
- **Layout**: 3-column grid or Horizontal scroll (`flex overflow-x-auto`).
- **Component**: `CategoryCard` (Aspect-ratio driven).

### D. Product Main Grid
- **Layout**: 
  - Desktop: 4 columns.
  - Mobile: 1-2 columns.
- **Component**: `ProductCard` (Lazy-loaded images).

### E. Promo / Newsletter Banner
- **Layout**: Full-width or boxed split layout.
- **Focus**: Single strong CTA (Discount/Offer).

### F. Footer (Global)
- **Layout**: 4-12 column CSS grid.
- **Groups**: Shop, Help, Company, Newsletter.

---

## Component Organization

```
components/
├── ui/                 # Atomic: Button, Input, Badge
├── ecommerce/          # Domain: ProductCard, CategoryCard, CartItem
├── sections/           # Large: Hero, Banner, FeaturedRow
└── layout/             # Global: Navbar, Footer, StoreLayout
```

---

## Technical Performance Rules

- **Zero CLS**: Images must have predefined aspect ratios (e.g., `aspect-[4/5]`).
- **WebP/AVIF Support**: Use Next.js `Image` component.
- **Lazy Loading**: All components below the fold must use `loading="lazy"`.
- **Server Components**: 90% of the UI should be RSC. Only interactive elements are Client Components.

---

## Example Composition

```tsx
// app/(store)/page.tsx
import { Hero } from "@/components/sections/Hero"
import { ProductGrid } from "@/components/ecommerce/ProductGrid"
import { Banner } from "@/components/sections/Banner"

export default async function HomePage() {
  const products = await getFeaturedProducts()
  
  return (
    <div className="space-y-20 lg:space-y-32">
      <Hero />
      <section className="container mx-auto px-4">
        <h2 className="mb-12 text-3xl font-bold tracking-tight">Best Sellers</h2>
        <ProductGrid products={products} />
      </section>
      <Banner 
        title="Experience the Collection" 
        description="Get 15% off your first order."
        ctaText="Join Now"
        ctaHref="/register"
      />
    </div>
  )
}
```
