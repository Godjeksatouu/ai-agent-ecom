# Skill: UI Animations & Motion Design

## Role
You are an expert UI Animation Engineer. Use the centralized `/animations` system to add high-performance, GPU-accelerated motion to eCommerce components.

---

## Animation Core Principles

### 1. Performance First (GPU Only)
- Only animate `opacity` and `transform` (scale, rotate, translate).
- Never animate `width`, `height`, `top`, `left`, or `margin` (these cause layout reflow).
- Use `will-change` sparingly on complex animated elements.

### 2. UX Consistency
- Entrance: Elements should slide in with `0.3s` duration and `gentle` ease.
- Exit: Transitions should be faster (`0.15s`) to keep the UI responsive.
- Stagger: Lists and grids should use staggered entrance animations to guide the user's eye.

---

## Usage Examples

### 1. Simple Fade In
```tsx
import { motion } from "framer-motion"
import { variants } from "@/animations/variants"

export function ProductCard({ product }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants.fadeIn}
    >
      {/* card content */}
    </motion.div>
  )
}
```

### 2. Staggered Grid
```tsx
import { motion } from "framer-motion"
import { variants } from "@/animations/variants"

export function ProductGrid({ products }) {
  return (
    <motion.div
      className="grid"
      initial="initial"
      animate="animate"
      variants={variants.staggerContainer}
    >
      {products.map(p => (
        <motion.div key={p.id} variants={variants.slideInUp}>
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### 3. Interactive Buttons
```tsx
import { motion } from "framer-motion"
import { variants } from "@/animations/variants"

export function AddToCartButton() {
  return (
    <motion.button
      whileHover="hover"
      whileTap="tap"
      variants={variants.scaleIn}
      className="btn"
    >
      Add to Cart
    </motion.button>
  )
}
```

---

## eCommerce Compliance Checklist

Run this review before finalizing animated UI:

```
[ ] GPU ONLY: check that no layout-inducing properties are being animated.
[ ] NO DELAY: verify that animations don't feel slow or block user action.
[ ] ACCESSIBLE: respect 'prefers-reduced-motion'.
[ ] STAGGERED: check that grids/lists have staggered entrance.
[ ] SMOOTH: ensure ease is 'gentle' for entrance and 'linear' for exit.
```

## Anti-Patterns Reference
See `skill:anti-patterns` for the full catalog and THINK→PLAN→EXECUTE→REVIEW→IMPROVE protocol.

❌ Never animate height/width — causes jank  
❌ Never use long durations (>0.5s) for UI feedback  
❌ Never animate every element on a page at once — use staggering  
❌ Never skip exit animations for drawers/modals  
