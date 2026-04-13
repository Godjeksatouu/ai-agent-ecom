// components/sections/Banner.tsx
"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/Button"

interface BannerProps {
  title: string
  description: string
  ctaText: string
  ctaHref: string
  image?: string
  variant?: "promo" | "newsletter"
}

export function Banner({ 
  title, 
  description, 
  ctaText, 
  ctaHref, 
  image, 
  variant = "promo" 
}: BannerProps) {
  return (
    <section className="px-4 py-12 lg:px-8">
      <div className="container mx-auto overflow-hidden rounded-[2.5rem] bg-neutral-900 text-white shadow-2xl">
        <div className="grid grid-cols-1 items-center lg:grid-cols-2">
          {/* Text Content */}
          <div className="flex flex-col items-start gap-6 p-12 lg:p-20">
            {variant === "promo" && (
              <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-neutral-300 ring-1 ring-white/20">
                Limited Time Offer
              </span>
            )}
            <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
              {title}
            </h2>
            <p className="max-w-md text-lg text-neutral-400">
              {description}
            </p>
            <div className="pt-4">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-black hover:bg-neutral-200"
                onClick={() => window.location.href = ctaHref}
              >
                {ctaText}
              </Button>
            </div>
          </div>
          
          {/* Image Content */}
          <div className="relative hidden h-full min-h-[400px] lg:block overflow-hidden bg-neutral-800">
             <div className="flex h-full w-full items-center justify-center">
                <span className="text-neutral-600 font-bold text-lg">PROMO VISUAL</span>
             </div>
             {image && (
               <img 
                 src={image} 
                 alt={title} 
                 className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-1000 hover:scale-110" 
               />
             )}
             <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
