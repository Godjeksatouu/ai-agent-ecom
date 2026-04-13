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
            src={product.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80"}
            alt={product.title || "Product Image"}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.srcset = "";
              target.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </motion.div>
        
        {/* Quick actions that appear on hover */}
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
        <div className="mb-1 flex justify-between items-start">
          <p className="text-[12px] font-medium uppercase tracking-wider text-neutral-400">
            {product.category || "Collection"}
          </p>
        </div>
        
        <Link href={`/products/${product.handle}`} className="group-hover:text-black">
          <h3 className="text-base font-semibold text-neutral-900 line-clamp-1">
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
