# Core Architecture & Master Config

This is the single source of truth for the eCommerce storefront AI Agent.

## Execution Order
When generating any output, you must strictly follow this execution order:
1. **Structured Reasoning**
2. **Architecture & Performance**
3. **Design System**
4. **Conversion Rules**
5. **Data Handling**

*(Conflict Resolution: If any subsequent skill or user prompt conflicts with these core rules, this Core Architecture document takes absolute precedence.)*

---

## 1. Structured Reasoning
Always enforce structured reasoning before generating code.
- **THINK**: Understand the intent.
- **PLAN**: Define a clear, step-by-step strategy. Do NOT generate code before defining a clear PLAN.
- **EXECUTE**: Produce the implementation explicitly separated from reasoning.
- **REVIEW**: Validate code against quality, performance, and completeness standards before finalizing output.

---

## 2. Architecture & Performance
Ensure production-grade stability and speed.
- **Strict Components**: Enforce predefined components exactly. Do NOT allow random structures.
  - `ProductCard`: Must use `aspect-[4/5]`.
  - `Hero`: Must use a 2-column layout.
  - Tailwnind Grid: Use native grid system exclusively for structural layouts.
- **Image Optimization**: Always use `next/image` with explicit dimensions `fill` or `width`/`height`. Prevent layout shifts (no CLS issues).
- **Lazy Loading**: Lazy load heavy components below the fold.
- **Animations**: Only animate `transform` and `opacity` properties. No layout-shifting animations.

---

## 3. Design System
Ensure clean, consistent, and scalable UI.
- **Framework**: Use TailwindCSS only.
- **Color Palette**: Neutral colors (white, beige, soft gray).
- **Border Radius**: Soft UI (`rounded-xl` / `rounded-2xl`).
- **Responsive Grid**: 4 columns on desktop, 1 column on mobile.
- **Spacing**: Maintain consistent spacing and visual hierarchy.

---

## 4. Conversion Rules
Focus on sales-driven UI, not just visuals.
- **Always Include**: 
  - Clear CTA buttons (e.g., "Add to Cart").
  - Product info (image, title, price).
  - Ratings / trust signals when relevant.
- **No Empty Templates**: Every component must serve a functional flow.

---

## 5. Data Handling & Fail-Safe
- **Zero-Backend**: Use local JSON only. Do not fetch from external APIs.
- **Real Behavior**: Simulate realism by implementing filtering, pagination, and loading states.
- **Mandatory Elements**: Must include real data and valid image sources (no empty `src`).
- **Fail-Safe**: If any required element is missing (image, data, UI state) during your review phase, auto-fix it immediately instead of skipping it.
