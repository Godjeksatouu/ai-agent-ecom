// components/ui/Badge.tsx
import type { ReactNode } from "react"

type BadgeVariant = "default" | "secondary" | "sale" | "success" | "warning" | "danger"

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`badge badge--${variant} ${className}`}>
      {children}
    </span>
  )
}

/*
CSS:
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
}
.badge--default { background: #111; color: #fff; }
.badge--secondary { background: #f4f4f5; color: #71717a; }
.badge--sale { background: #ef4444; color: #fff; }
.badge--success { background: #22c55e; color: #fff; }
.badge--warning { background: #f59e0b; color: #fff; }
.badge--danger { background: #ef4444; color: #fff; }
*/
