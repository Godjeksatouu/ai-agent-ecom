# Skill: Performance & SEO

## Role
You optimize Next.js eCommerce storefronts for Core Web Vitals, search engine indexing, and rich search results. These patterns are non-negotiable for production eCommerce.

---

## Core Web Vitals Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Priority images, fast TTF |
| **FID/INP** (Interaction to Next Paint) | < 200ms | Minimal JS, code splitting |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Reserve image space, no layout shifts |
| **TTFB** (Time to First Byte) | < 800ms | Edge caching, ISR |

---

## Image Optimization

```tsx
// ✅ CORRECT: Above-the-fold hero image
<Image
  src={heroImage.url}
  alt={heroImage.alt}
  fill
  priority          // Preload LCP candidate
  fetchPriority="high"
  sizes="100vw"
  quality={85}      // Balanced quality/size
/>

// ✅ CORRECT: Product grid images (below fold)
<Image
  src={product.thumbnail}
  alt={product.title}
  fill
  loading="lazy"    // Default, explicit for clarity
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  quality={80}
/>

// ❌ WRONG: No sizes attribute
<Image src={img} alt="..." fill />

// ❌ WRONG: Using <img> tag
<img src={img} alt="..." />
```

**Image Rules:**
- Use `sizes` on every `fill` image to prevent oversized downloads
- Set `priority` only on the 1-3 images above the fold (usually hero + first product card)
- Never use `quality={100}` — 80-85 is visually identical in products

---

## Caching Strategy

```ts
// Static pages: generated at build, revalidated periodically
export const revalidate = 3600 // 1 hour ISR

// Dynamic pages: always fresh
export const dynamic = "force-dynamic"

// Fetch with cache tags (for on-demand purge)
const product = await fetch(`${API}/products/${handle}`, {
  next: {
    revalidate: 60,
    tags: [`product-${handle}`, "products"]
  }
})

// On-demand revalidation (webhook from CMS/backend)
// app/api/revalidate/route.ts
import { revalidateTag } from "next/cache"

export async function POST(req: NextRequest) {
  const { tag, secret } = await req.json()
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  revalidateTag(tag)
  return NextResponse.json({ revalidated: true })
}
```

---

## SEO: Metadata API

```ts
// app/(store)/products/[handle]/page.tsx
import type { Metadata } from "next"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.handle)
  if (!product) return { title: "Product Not Found" }

  const description = product.description?.replace(/<[^>]+>/g, "").slice(0, 160) ?? ""

  return {
    title: {
      absolute: `${product.title} | My Store`  // Overrides template
    },
    description,
    keywords: product.tags?.join(", "),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.handle}`
    },
    openGraph: {
      type: "website",
      title: product.title,
      description,
      images: product.images?.map(img => ({
        url: img.url,
        width: 1200,
        height: 630,
        alt: product.title
      })) ?? []
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: [product.thumbnail ?? ""],
    }
  }
}
```

---

## Structured Data (JSON-LD)

Add rich snippets for better search appearance (product ratings, price, availability).

```tsx
// components/product/ProductStructuredData.tsx
import type { Product } from "@/types/product"

export function ProductStructuredData({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description?.replace(/<[^>]+>/g, ""),
    image: product.images?.map(img => img.url) ?? [],
    sku: product.variants[0]?.sku,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.variants[0]?.price.currency_code,
      lowPrice: Math.min(...product.variants.map(v => v.price.amount)) / 100,
      highPrice: Math.max(...product.variants.map(v => v.price.amount)) / 100,
      availability: product.variants.some(v => v.inventory_quantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "My Store"
      }
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Usage in PDP:
// <ProductStructuredData product={product} />
```

---

## Sitemap

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/api/products"
import { getCollections } from "@/lib/api/collections"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!
  const [products, collections] = await Promise.all([
    getProducts({ limit: 1000 }),
    getCollections({ limit: 100 })
  ])

  const productUrls = products.map(p => ({
    url: `${baseUrl}/products/${p.handle}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const collectionUrls = collections.map(c => ({
    url: `${baseUrl}/collections/${c.handle}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    { url: baseUrl, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/products`, changeFrequency: "daily", priority: 0.9 },
    ...productUrls,
    ...collectionUrls,
  ]
}
```

---

## Performance: Code Splitting

```ts
// ✅ Dynamic imports for heavy components
import dynamic from "next/dynamic"

// Heavy: only load when needed
const FullPageSearch = dynamic(() => import("@/components/search/FullPageSearch"), {
  ssr: false,  // Client-only (uses browser APIs)
  loading: () => <SearchSkeleton />,
})

// Conditional: only load if user opens it
const ReviewModal = dynamic(() => import("@/components/product/ReviewModal"), {
  loading: () => null,
})

// Map/ Third-party: large libraries
const MapPicker = dynamic(() => import("@/components/MapPicker"), { ssr: false })
```

---

## Robots.txt

```ts
// app/robots.ts
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account/", "/checkout/", "/api/"],
      }
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

---

## Font Optimization

```tsx
// app/layout.tsx
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",        // CLS prevention
  preload: true,
  variable: "--font-sans"
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

---

## Anti-Patterns Reference
> See `skill:anti-patterns` for the full catalog and REVIEW checklist.

❌ Never use `<img>` — always `next/image` with `sizes`  
❌ Never set `priority` on below-fold images — causes wasted preloads  
❌ Never `quality={100}` on product images — use 80–85  
❌ Never skip `revalidate` or cache tags on product/collection fetches  
❌ Never block full page render — use `<Suspense>` for each async section  
