# Skill: Authentication & Customer Accounts

## Role
You implement secure, production-grade customer authentication and account management for Next.js eCommerce storefronts. Auth is session-based (HTTP-only cookies) — never JWT in localStorage.

---

## Auth Architecture

```
Auth Flow:
1. Customer submits login form (client-side)
2. POST to Next.js API route (/api/auth/login)
3. API route calls backend, gets session token
4. API route sets HTTP-only cookie
5. All subsequent requests include cookie automatically
6. Middleware protects /account/* routes
```

**Security Rules:**
- Store auth tokens in **HTTP-only cookies only** — never localStorage or sessionStorage
- Use **Secure** and **SameSite=Strict** cookie flags in production
- Validate sessions server-side on every protected page
- Rate-limit auth endpoints

---

## Next.js Auth Middleware

```ts
// middleware.ts
import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PATHS = ["/account", "/account/orders", "/account/profile"]
const AUTH_PATHS = ["/login", "/register"]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionToken = req.cookies.get("_session_token")?.value

  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  const isAuthPage = AUTH_PATHS.some(p => pathname.startsWith(p))

  // Redirect unauthenticated users to login
  if (isProtected && !sessionToken) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL("/account", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/account/:path*", "/login", "/register"]
}
```

---

## Login API Route

```ts
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = loginSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  try {
    // Call backend auth
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    })

    if (!backendRes.ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const { customer, token } = await backendRes.json()

    const response = NextResponse.json({ customer })
    response.cookies.set({
      name: "_session_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
```

---

## Customer Session Hook

```ts
// lib/hooks/useCustomer.ts
import { useEffect, useState } from "react"

interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
}

interface UseCustomerReturn {
  customer: Customer | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
}

export function useCustomer(): UseCustomerReturn {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setCustomer(data?.customer ?? null)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setCustomer(null)
    window.location.href = "/"
  }

  return {
    customer,
    isLoading,
    isAuthenticated: !!customer,
    logout,
  }
}
```

---

## Login Form Component

```tsx
// components/account/LoginForm.tsx
"use client"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") ?? "/account"
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Login failed. Please try again.")
        return
      }

      router.push(redirect)
      router.refresh()
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <h1 className="auth-form__title">Sign In</h1>

      {error && (
        <div className="auth-form__error" role="alert">
          {error}
        </div>
      )}

      <div className="auth-form__fields">
        <Input
          type="email"
          name="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <Input
          type="password"
          name="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" disabled={isLoading} className="auth-form__submit">
        {isLoading ? "Signing in…" : "Sign In"}
      </Button>

      <p className="auth-form__footer">
        Don't have an account?{" "}
        <a href="/register">Create one</a>
      </p>
    </form>
  )
}
```

---

## Account Dashboard Page

```tsx
// app/(account)/account/page.tsx
import { redirect } from "next/navigation"
import { getCustomerFromSession } from "@/lib/api/customer"
import { getCustomerOrders } from "@/lib/api/orders"

export default async function AccountPage() {
  const customer = await getCustomerFromSession()
  if (!customer) redirect("/login")

  const orders = await getCustomerOrders(customer.id)

  return (
    <main className="account-dashboard">
      <h1>Welcome, {customer.first_name}</h1>

      <section className="account-section">
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet. <a href="/products">Start shopping</a></p>
        ) : (
          <ul className="order-list">
            {orders.slice(0, 5).map(order => (
              <li key={order.id} className="order-list__item">
                <a href={`/account/orders/${order.id}`}>
                  <span>#{order.display_id}</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span>{order.status}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
```

---

## Anti-Patterns

❌ Never store JWT in localStorage — XSS vulnerable  
❌ Never skip rate limiting on auth routes  
❌ Never expose backend tokens in client responses  
❌ Never use `dangerouslySetInnerHTML` with user content  
❌ Never redirect with sensitive data in query params  
