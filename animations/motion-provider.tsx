/**
 * animations/motion-provider.tsx
 *
 * Optimized Framer Motion provider for Next.js.
 * Uses LazyMotion to reduce initial bundle size by ~100kb.
 */

"use client"

import React from "react"
import { LazyMotion, domMax, AnimatePresence } from "framer-motion"

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <AnimatePresence mode="wait" initial={false}>
        {children}
      </AnimatePresence>
    </LazyMotion>
  )
}

/**
 * Hook for checking if user prefers reduced motion
 * to ensure accessibility (A11y).
 */
export { useReducedMotion } from "framer-motion"
