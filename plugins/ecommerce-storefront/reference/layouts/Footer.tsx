// components/layout/Footer.tsx
"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Instagram, Twitter, Facebook, ArrowUpRight } from "lucide-react"

const FOOTER_LINKS = [
  {
    title: "Shop",
    links: [
      { name: "New Arrivals", href: "/new-arrivals" },
      { name: "Best Sellers", href: "/best-sellers" },
      { name: "Accessories", href: "/accessories" },
      { name: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "Shipping & Returns", href: "/shipping" },
      { name: "Order Tracking", href: "/tracking" },
      { name: "Contact Us", href: "/contact" },
      { name: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "Our Story", href: "/story" },
      { name: "Journal", href: "/journal" },
      { name: "Careers", href: "/careers" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-neutral-50 px-4 pt-20 pb-12 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Logo & About */}
          <div className="lg:col-span-4">
            <Link href="/" className="text-2xl font-bold tracking-tight text-neutral-900">
              AGENCY
            </Link>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-neutral-500">
              Sustainable, thoughtful designs for the modern wardrobe. Built with care and craft.
            </p>
            <div className="mt-8 flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, idx) => (
                <Link 
                  key={idx} 
                  href="#" 
                  className="group flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm transition-all hover:bg-black hover:text-white"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Groups */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
                  {group.title}
                </h4>
                <ul className="mt-6 space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className="group flex items-center text-neutral-500 transition-colors hover:text-black"
                      >
                        {link.name}
                        <ArrowUpRight size={14} className="ml-1 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 flex flex-col items-center justify-between border-t border-neutral-200 pt-8 sm:flex-row">
          <p className="text-sm text-neutral-400">
            © 2026 Agency eCommerce. All rights reserved.
          </p>
          <div className="mt-4 flex gap-8 sm:mt-0">
            <Link href="/privacy" className="text-sm text-neutral-400 hover:text-neutral-900">Privacy Policy</Link>
            <Link href="/cookies" className="text-sm text-neutral-400 hover:text-neutral-900">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
