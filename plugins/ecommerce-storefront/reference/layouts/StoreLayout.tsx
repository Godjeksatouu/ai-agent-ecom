// layouts/StoreLayout.tsx
"use client"

import React from "react"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

interface StoreLayoutProps {
  children: React.ReactNode
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Optional: Global Accessibility / SEO elements */}
      <div id="portal-root" />
    </div>
  )
}
