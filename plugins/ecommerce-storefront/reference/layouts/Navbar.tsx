// components/layout/Navbar.tsx
"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, Search, User, Menu, X } from "lucide-react"
import { cn } from "@/utils/cn"

const NAV_LINKS = [
  { name: "New Arrivals", href: "/new-arrivals" },
  { name: "Collections", href: "/collections" },
  { name: "Best Sellers", href: "/best-sellers" },
  { name: "About", href: "/about" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg border-b border-neutral-100 py-3 shadow-sm" 
          : "bg-transparent py-5"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-lg shadow-neutral-200">
            <motion.div
              animate={{ rotate: [0, 15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShoppingCart size={20} strokeWidth={2.5} />
            </motion.div>
          </div>
          <span>AGENCY</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-black"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="hidden p-2 text-neutral-600 hover:text-black md:block">
            <Search size={20} />
            <span className="sr-only">Search</span>
          </button>
          <Link href="/account" className="hidden p-2 text-neutral-600 hover:text-black md:block">
            <User size={20} />
            <span className="sr-only">Account</span>
          </Link>
          <button className="relative p-2 text-neutral-600 hover:text-black">
            <ShoppingCart size={20} />
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
              0
            </span>
            <span className="sr-only">Cart</span>
          </button>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="p-2 text-neutral-600 hover:text-black md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-neutral-100 bg-white md:hidden"
          >
            <div className="flex flex-col space-y-4 px-4 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-neutral-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-neutral-100" />
              <div className="flex gap-4 pt-2">
                <Link href="/account" className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                  <User size={18} /> Account
                </Link>
                <Link href="/search" className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                  <Search size={18} /> Search
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
