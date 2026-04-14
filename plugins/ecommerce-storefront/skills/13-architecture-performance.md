# Production App Standards: Data, Performance, & Architecture

All output must adhere to the following rigorous standards to ensure production-grade performance, structure, and reliability.

## Data Rules
- **Local JSON Only**: Do not fetch from external APIs unless explicitly instructed. Provide or consume mock data using local JSON structures to maintain a zero-backend development pattern.
- **Simulate Real Behavior**: Implement realistic UX logic such as pagination, skeleton loaders, and functional filtering/sorting for list views. 

## Performance Rules
- **Image Optimization**: Always utilize `next/image` with explicit width/height or `fill`/`sizes` constraints to optimize imagery. Avoid standard `<img>` tags.
- **Lazy Loading**: Use dynamic imports (`next/dynamic` or `React.lazy`) for heavy, non-critical components below the fold.
- **Performant Animations**: Restrict all CSS animations/transitions to hardware-accelerated properties: `transform` and `opacity`. DO NOT animate properties that trigger paint or layout reflows (e.g., width, padding).
- **Zero CLS (Cumulative Layout Shift)**: Pre-allocate space for dynamic content, images, and fonts to ensure absolute layout stability.

## Strict Architecture Rules
- **Enforced Sub-Structures**: 
  - The `ProductCard` component must use a strict `aspect-[4/5]` ratio.
  - The `Hero` section must default to a 2-column layout (content vs. media).
  - Use the native TailwindCSS grid system for structural layouts. Do not invent custom CSS grid structures manually.
  - **Do NOT allow random structures**: You must stick to the strict preset guidelines.

## Auto-Fix Fail-Safe
- If generating code and you notice missing required elements (such as `next/image` fallback, unpopulated data objects, or missing UI interaction states), **do not output broken code**. Auto-fix and self-correct the code structure to include these missing components prior to delivering the payload.
