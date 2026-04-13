/**
 * CartDrawer.tsx
 *
 * Slide-out cart experience. Uses AnimatePresence for smooth entry/exit.
 * Optimized for mobile touch performance.
 */

"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { variants } from "@/animations/variants"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function CartDrawer({ isOpen, onClose, children }: CartDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Content */}
          <motion.aside
            key="drawer"
            variants={variants.slideInRight}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-md bg-white p-6 shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b pb-4">
                <h2 className="text-xl font-semibold">Your Cart</h2>
                <button 
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pt-6">
                {children}
              </div>

              <div className="border-t pt-6">
                <button className="w-full rounded-full bg-black py-4 text-center font-bold text-white transition-opacity hover:opacity-90">
                  Checkout
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
