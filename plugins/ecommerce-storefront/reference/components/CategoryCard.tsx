// components/ecommerce/CategoryCard.tsx
"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    handle: string
    image: string
    itemCount?: number
  }
}

export function CategoryCard({ category }: CategoryCardProps) {
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
        loading="lazy"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent transition-opacity duration-300 group-hover:opacity-80" />
      
      {/* Content */}
      <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
        <div className="text-white">
          {category.itemCount !== undefined && (
            <p className="text-sm font-medium opacity-80">{category.itemCount} items</p>
          )}
          <h3 className="mt-2 text-2xl font-bold tracking-tight">{category.name}</h3>
        </div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-4">
          <ArrowUpRight size={24} />
        </div>
      </div>
    </Link>
  )
}
