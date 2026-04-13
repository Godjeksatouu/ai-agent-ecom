// components/ecommerce/ProductGrid.tsx
"use client"

import React, { useMemo } from "react"
import { ProductCard } from "./ProductCard"
import productsData from "../data/products.json"

interface ProductGridProps {
  category?: string
  limit?: number
}

export function ProductGrid({ category, limit }: ProductGridProps) {
  // Directly consume JSON data
  const products = useMemo(() => {
    let filtered = [...productsData]
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }
    if (limit) {
      filtered = filtered.slice(0, limit)
    }
    return filtered
  }, [category, limit])

  if (products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-100 bg-neutral-50">
        <p className="text-neutral-500 font-medium">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
