# Skill: Product Components

## Role
You generate production-grade, conversion-optimized product UI components for Next.js eCommerce storefronts. Always implement TailwindCSS, Framer Motion for premium feel, TypeScript, and optimal image handling.

---

## Conversion-Optimized Product Card

The product card is the most critical unit for conversion. It must balance aesthetics with speed.
- **Premium Feel**: 2xl rounded corners, soft shadows, subtle micro-animations.
- **Micro-Interaction**: Hover-to-reveal CTA (Quick Add).
- **Performance**: `next/image` with `sizes`, `loading="lazy"`.

```tsx
// components/ecommerce/ProductCard.tsx
"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { variants } from "@/animations/variants"
import { Button } from "../ui/Button"

interface ProductCardProps {
  product: {
    id: string
    handle: string
    title: string
    price: string
    image: string
    category?: string
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      variants={variants.slideInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/50"
    >
      <Link 
        href={`/products/${product.handle}`} 
        className="relative aspect-[4/5] overflow-hidden bg-neutral-100"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
          />
        </motion.div>
        
        {/* Quick Add overlay */}
        <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button 
            variant="primary" 
            fullWidth 
            size="sm"
            className="shadow-lg backdrop-blur-md bg-white/90 text-black border-none hover:bg-white"
          >
            Quick Add
          </Button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-400">
          {product.category || "General"}
        </p>
        
        <Link href={`/products/${product.handle}`}>
          <h3 className="text-base font-semibold text-neutral-900 group-hover:text-black">
            {product.title}
          </h3>
        </Link>
        
        <p className="mt-2 text-lg font-bold text-neutral-900">
          {product.price}
        </p>
      </div>
    </motion.article>
  )
}
```

---

## Responsive Product Grid

Layout hierarchy for maximum conversion:
- **Desktop**: 4 columns (grid-cols-4)
- **Tablet**: 2 columns (md:grid-cols-2)
- **Mobile**: 1 column (grid-cols-1)

```tsx
// components/ecommerce/ProductGrid.tsx
import { ProductCard } from "./ProductCard"

export function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product, idx) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

---

## Category / Collection Cards

Use for browsing high-level groups. Supports horizontal scroll on mobile.

```tsx
// components/ecommerce/CategoryCard.tsx
export function CategoryCard({ category }) {
  return (
    <Link 
      href={`/collections/${category.handle}`}
      className="group relative block aspect-[3/4] overflow-hidden rounded-[2rem] bg-neutral-100"
    >
      <Image
        src={category.image}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute inset-x-8 bottom-8 text-white">
        <h3 className="text-2xl font-bold">{category.name}</h3>
        <p className="mt-1 text-sm opacity-80">{category.itemCount} items</p>
      </div>
    </Link>
  )
}
```

---

## Anti-Patterns to Avoid

❌ **Visual Clutter**: Avoid too many borders or bright primary colors. Use neutral whitespace.  
❌ **Layout Shift (CLS)**: Always use fixed aspect ratios for image containers (e.g., `aspect-[4/5]`).  
❌ **Weak CTA**: Add to cart buttons should be clear but integrated into the card aesthetic.  
❌ **Generic Skeletons**: Use exact-sized skeleton loaders that match the card's aspect ratio.  
