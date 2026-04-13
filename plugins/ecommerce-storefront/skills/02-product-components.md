# Skill: Product Components

## Role
You generate production-grade product UI components for Next.js eCommerce storefronts. Always implement TypeScript, accessibility (WCAG AA), and optimal image handling.

---

## Product Card Component

The product card is the atomic unit of the storefront. It must be:
- **Fast**: use `next/image` with proper `sizes`
- **Accessible**: semantic HTML, alt text, keyboard navigable
- **Flexible**: support grid and list layouts via props

```tsx
// components/product/ProductCard.tsx
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils/price"
import { Badge } from "@/components/ui/Badge"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  layout?: "grid" | "list"
  priority?: boolean  // Set true for above-the-fold cards
}

export function ProductCard({ product, layout = "grid", priority = false }: ProductCardProps) {
  const primaryVariant = product.variants[0]
  const isOnSale = primaryVariant?.compare_at_price != null &&
    primaryVariant.compare_at_price > primaryVariant.price.amount
  const isOutOfStock = product.variants.every(v => v.inventory_quantity === 0)

  return (
    <article
      className={`product-card product-card--${layout}`}
      aria-label={product.title}
    >
      <Link href={`/products/${product.handle}`} className="product-card__image-link">
        <div className="product-card__image-wrapper">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="product-card__image"
              priority={priority}
            />
          ) : (
            <div className="product-card__image-placeholder" aria-hidden="true" />
          )}

          {isOutOfStock && (
            <Badge variant="secondary" className="product-card__badge">
              Out of Stock
            </Badge>
          )}
          {isOnSale && !isOutOfStock && (
            <Badge variant="sale" className="product-card__badge">
              Sale
            </Badge>
          )}
        </div>
      </Link>

      <div className="product-card__info">
        <Link href={`/products/${product.handle}`} className="product-card__title-link">
          <h3 className="product-card__title">{product.title}</h3>
        </Link>

        {product.collection && (
          <p className="product-card__collection">{product.collection.title}</p>
        )}

        <div className="product-card__pricing">
          <span className="product-card__price">
            {formatPrice(primaryVariant?.price)}
          </span>
          {isOnSale && (
            <span className="product-card__compare-price" aria-label="Original price">
              {formatPrice({ amount: primaryVariant.compare_at_price!, currency_code: primaryVariant.price.currency_code })}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
```

---

## Product Grid

```tsx
// components/product/ProductGrid.tsx
import { ProductCard } from "./ProductCard"
import type { Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
  columns?: 2 | 3 | 4
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="product-grid__empty" role="status">
        <p>No products found.</p>
      </div>
    )
  }

  return (
    <div
      className={`product-grid product-grid--${columns}col`}
      role="list"
      aria-label="Products"
    >
      {products.map((product, index) => (
        <div key={product.id} role="listitem">
          <ProductCard
            product={product}
            priority={index < 4}  // Prioritize LCP candidates
          />
        </div>
      ))}
    </div>
  )
}
```

---

## Product Detail Page (PDP)

```tsx
// app/(store)/products/[handle]/page.tsx
import { notFound } from "next/navigation"
import { getProduct, getProducts } from "@/lib/api/products"
import { ProductGallery } from "@/components/product/ProductGallery"
import { ProductInfo } from "@/components/product/ProductInfo"
import { RelatedProducts } from "@/components/product/RelatedProducts"
import { Suspense } from "react"

interface Props {
  params: { handle: string }
}

// ISR: revalidate every 60s, invalidate on-demand via API route
export const revalidate = 60

export async function generateStaticParams() {
  const products = await getProducts({ limit: 100 })
  return products.map(p => ({ handle: p.handle }))
}

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.handle)
  if (!product) return {}
  return {
    title: `${product.title} | My Store`,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.title,
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    }
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.handle)
  if (!product) notFound()

  return (
    <main className="pdp">
      <div className="pdp__layout">
        {/* Gallery: left column */}
        <ProductGallery images={product.images} title={product.title} />

        {/* Info: right column */}
        <ProductInfo product={product} />
      </div>

      {/* Related products */}
      <Suspense fallback={<div className="skeleton-row" />}>
        <RelatedProducts
          collectionId={product.collection?.id}
          excludeId={product.id}
        />
      </Suspense>
    </main>
  )
}
```

---

## ProductInfo — Variant Selection + Add to Cart

```tsx
// components/product/ProductInfo.tsx
"use client"
import { useState, useMemo } from "react"
import { useCart } from "@/lib/hooks/useCart"
import { formatPrice } from "@/lib/utils/price"
import { Button } from "@/components/ui/Button"
import type { Product, ProductVariant } from "@/types/product"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  // Derive selected variant from options
  const selectedVariant = useMemo<ProductVariant | undefined>(() => {
    return product.variants.find(variant =>
      variant.options.every(
        opt => selectedOptions[opt.option_id] === opt.value
      )
    )
  }, [product.variants, selectedOptions])

  const isAvailable = selectedVariant
    ? selectedVariant.inventory_quantity > 0
    : false

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    setIsAdding(true)
    try {
      await addItem({ variantId: selectedVariant.id, quantity: 1 })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <section className="product-info" aria-label="Product details">
      <h1 className="product-info__title">{product.title}</h1>

      <div className="product-info__price">
        {formatPrice(selectedVariant?.price ?? product.variants[0]?.price)}
      </div>

      {/* Option selectors */}
      {product.options?.map(option => (
        <div key={option.id} className="product-info__option">
          <label className="product-info__option-label">
            {option.title}
          </label>
          <div className="product-info__option-values" role="group" aria-label={option.title}>
            {option.values.map(value => (
              <button
                key={value.id}
                className={`option-btn ${selectedOptions[option.id] === value.value ? "option-btn--selected" : ""}`}
                onClick={() => setSelectedOptions(prev => ({ ...prev, [option.id]: value.value }))}
                aria-pressed={selectedOptions[option.id] === value.value}
              >
                {value.value}
              </button>
            ))}
          </div>
        </div>
      ))}

      <Button
        className="product-info__add-to-cart"
        onClick={handleAddToCart}
        disabled={!isAvailable || isAdding}
        aria-label={isAdding ? "Adding to cart…" : "Add to cart"}
      >
        {isAdding ? "Adding…" : isAvailable ? "Add to Cart" : "Out of Stock"}
      </Button>

      {product.description && (
        <div
          className="product-info__description"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}
    </section>
  )
}
```

---

## Product Gallery

```tsx
// components/product/ProductGallery.tsx
"use client"
import { useState } from "react"
import Image from "next/image"

interface GalleryImage { url: string; alt?: string }

export function ProductGallery({ images, title }: { images: GalleryImage[], title: string }) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = images[selectedIndex]

  return (
    <div className="product-gallery">
      <div className="product-gallery__main" aria-live="polite">
        {selected && (
          <Image
            src={selected.url}
            alt={selected.alt ?? title}
            fill
            className="product-gallery__main-img"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="product-gallery__thumbnails" role="tablist" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`View image ${i + 1}`}
              className={`product-gallery__thumb ${i === selectedIndex ? "product-gallery__thumb--active" : ""}`}
              onClick={() => setSelectedIndex(i)}
            >
              <Image src={img.url} alt="" fill sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Anti-Patterns to Avoid

❌ **Never use `<img>` directly** — always `next/image` for optimization  
❌ **Never fetch data inside client components** — use RSC or SWR/React Query  
❌ **Never hardcode currency** — use `Intl.NumberFormat` or `formatPrice()` util  
❌ **Never skip `alt` text** — all images need meaningful alt or `alt=""`  
❌ **Never use `any` types** — use proper type definitions  
