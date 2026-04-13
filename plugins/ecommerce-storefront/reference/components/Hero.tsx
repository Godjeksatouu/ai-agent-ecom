// components/sections/Hero.tsx
"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "../ui/Button"
import { variants } from "@/animations/variants"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-neutral-50 px-4 py-20 lg:px-8 lg:py-32">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Content */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={variants.staggerContainer}
          className="flex flex-col items-start gap-8"
        >
          <motion.span 
            variants={variants.fadeIn}
            className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500 shadow-sm ring-1 ring-neutral-200"
          >
            Spring Collection 2026
          </motion.span>
          
          <motion.h1 
            variants={variants.slideInUp}
            className="text-5xl font-bold leading-[1.1] tracking-tight text-neutral-900 md:text-7xl"
          >
            Redefine Your <br />
            <span className="text-neutral-400 italic">Everyday Style.</span>
          </motion.h1>
          
          <motion.p 
            variants={variants.slideInUp}
            className="max-w-md text-lg leading-relaxed text-neutral-600"
          >
            Experience the perfect blend of luxury and comfort with our sustainably sourced essentials. Designed for the modern life.
          </motion.p>
          
          <motion.div 
            variants={variants.slideInUp}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button variant="primary" size="lg">
              Shop Collection
            </Button>
            <Button variant="outline" size="lg">
              View Lookbook
            </Button>
          </motion.div>
          
          {/* Social Proof / Trust Signals */}
          <motion.div 
            variants={variants.fadeIn}
            className="flex items-center gap-6 pt-8 border-t border-neutral-200"
          >
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80"
              ].map((src, i) => (
                <img 
                  key={i} 
                  src={src} 
                  alt={`Customer ${i + 1}`}
                  className="h-10 w-10 rounded-full border-2 border-white object-cover" 
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=64&h=64&q=80"; }}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-neutral-500">
              <span className="font-bold text-neutral-900">5k+</span> Happy Customers
            </p>
          </motion.div>
        </motion.div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-neutral-200 shadow-2xl"
        >
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80"
            alt="Spring Collection 2026"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          
          {/* Floating Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-10 left-10 rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-xl md:-left-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Limited Edition</p>
            <p className="mt-1 text-xl font-bold text-neutral-900">Merino Wool Coat</p>
            <p className="mt-2 text-lg font-medium text-neutral-500">$299.00</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
