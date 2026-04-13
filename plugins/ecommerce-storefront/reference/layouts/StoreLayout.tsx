// layouts/StoreLayout.tsx — Main storefront shell
// app/(store)/layout.tsx

import { CartDrawer } from "@/components/cart/CartDrawer"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import type { ReactNode } from "react"

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <CartDrawer />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────
// components/layout/Header.tsx
"use client"
import Link from "next/link"
import { useCart } from "@/lib/hooks/useCart"
import { useCustomer } from "@/lib/hooks/useCustomer"
import { CartIcon } from "@/components/icons/CartIcon"

export function Header() {
  const { itemCount, openCart } = useCart()
  const { customer, isAuthenticated } = useCustomer()

  return (
    <header className="header">
      <div className="header__inner container">
        {/* Logo */}
        <Link href="/" className="header__logo" aria-label="Home">
          <span className="header__logo-text">MyStore</span>
        </Link>

        {/* Nav */}
        <nav className="header__nav" aria-label="Main navigation">
          <Link href="/products" className="header__nav-link">Shop</Link>
          <Link href="/collections" className="header__nav-link">Collections</Link>
          <Link href="/about" className="header__nav-link">About</Link>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          {isAuthenticated ? (
            <Link href="/account" className="header__account-link">
              {customer?.first_name}
            </Link>
          ) : (
            <Link href="/login" className="header__account-link">Sign in</Link>
          )}

          <button
            className="header__cart-btn"
            onClick={openCart}
            aria-label={`Open cart (${itemCount} items)`}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className="header__cart-count" aria-hidden="true">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

/*
CSS:
.header {
  position: sticky; top: 0; z-index: 50;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #f4f4f5;
}
.header__inner {
  display: flex; align-items: center;
  justify-content: space-between;
  height: 64px;
}
.container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; width: 100%; }
.header__logo-text { font-size: 1.25rem; font-weight: 700; color: #111; }
.header__nav { display: flex; gap: 2rem; }
.header__nav-link { font-size: 0.9375rem; color: #374151; transition: color 0.15s; }
.header__nav-link:hover { color: #111; }
.header__actions { display: flex; align-items: center; gap: 1rem; }
.header__cart-btn { position: relative; padding: 0.5rem; }
.header__cart-count {
  position: absolute; top: 0; right: 0;
  background: #111; color: #fff;
  font-size: 0.625rem; font-weight: 700;
  width: 1.125rem; height: 1.125rem;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
*/
