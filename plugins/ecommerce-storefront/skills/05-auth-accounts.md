# Skill: Mock Authentication & Accounts (Zero-Backend)

## Role
You implement a **frontend-only authentication system** that uses local JSON data. This allows developers to build and test account-related UI (dashboards, orders, profile) without a real database or session management server.

---

## Zero-Backend Auth Flow

```
1. Client-side form submits (email/password)
2. Logic checks against data/users.json
3. If match: Set a mock 'session' cookie or update Zustand store
4. Redirect to /account
```

---

## Mock Auth Logic

### 1. Unified Customer Client (JSON-backed)

```ts
// lib/api/customer.ts
import usersData from "@/data/users.json"

export async function login(email, password) {
  // Simulate delay
  await new Promise(r => setTimeout(r, 500))
  
  const user = usersData.find(u => u.email === email)
  if (!user) throw new Error("User not found")
  
  // In mock mode, we just return the user
  return user
}

export async function getMockSessionUser() {
  // Always return the test user for development
  return usersData[0]
}
```

### 2. Protected Route Pattern (Client-Side)

```tsx
// components/account/AuthGuard.tsx
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCustomer } from "@/lib/hooks/useCustomer"

export function AuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useCustomer()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) return <Skeleton />
  return <>{children}</>
}
```

---

## Implementation Rules

1.  **Direct JSON consumption**: Always import from `@/data/users.json` for validation mock-ups.
2.  **No Middleware Complexity**: Avoid complex `middleware.ts` logic that requires a real session database. Use client-side guards or simple cookie checks.
3.  **Instant States**: Password hashing is skipped in dev-mode JSON mocks for simplicity.

---

## Benefits of Mock Auth

- **Zero Setup**: No need to configure Auth.js, Clerk, or Kinde.
- **Fast Iteration**: Instantly switch between 'Admin' and 'Customer' by changing the mock import.
- **Offline Working**: No dependency on external identity providers.

---

## Anti-Patterns to Avoid

❌ **Never use MongoDB** for storing user sessions in development.  
❌ **Never skip Type Safety** — ensure mock users match the `Customer` interface.  
❌ **Never generate real API routes** (`app/api/auth/*`) unless explicitly building a production-ready backend.  
