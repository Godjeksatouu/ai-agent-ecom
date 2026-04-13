/**
 * AnimatedProductCard.tsx
 *
 * Example of a high-performance, conversion-optimized product card.
 * Features:
 *  - Entrance staggering (via slideInUp)
 *  - Hover lift and shadow depth (via cardHover)
 *  - Image scale on hover
 */

"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { variants } from "@/animations/variants"

interface ProductCardProps {
  product: {
    id: string
    handle: string
    title: string
    price: string
    image: string
  }
}

export function AnimatedProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      variants={variants.slideInUp}
      whileHover="hover"
      animate="animate"
      initial="initial"
      className="group relative overflow-hidden rounded-xl bg-white p-4"
      custom={variants.cardHover} // Use variant logic
    >
      <Link href={`/products/${product.handle}`} className="block overflow-hidden rounded-lg">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative aspect-square"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
      </Link>

      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900">{product.title}</h3>
        <p className="mt-1 text-sm text-gray-500">{product.price}</p>
      </div>

      <motion.button
        variants={variants.fadeIn}
        className="mt-4 w-full rounded-md bg-black py-2 text-sm font-medium text-white opacity-0 group-hover:opacity-100"
      >
        Quick Add
      </motion.button>
    </motion.article>
  )
}
