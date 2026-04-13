// components/ui/Button.tsx
import { forwardRef } from "react"
import type { ButtonHTMLAttributes } from "react"

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={[
        "btn",
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth ? "btn--full" : "",
        isLoading ? "btn--loading" : "",
        className
      ].filter(Boolean).join(" ")}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && <span className="btn__spinner" aria-hidden="true" />}
      <span className={isLoading ? "btn__label btn__label--hidden" : "btn__label"}>
        {children}
      </span>
    </button>
  )
})
Button.displayName = "Button"

/*
CSS (add to your global styles):

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--primary { background: #111; color: #fff; }
.btn--primary:hover:not(:disabled) { background: #333; }
.btn--secondary { background: #f4f4f5; color: #111; }
.btn--outline { border-color: #e4e4e7; background: transparent; color: #111; }
.btn--ghost { background: transparent; color: #111; }
.btn--ghost:hover:not(:disabled) { background: #f4f4f5; }
.btn--sm { padding: 0.375rem 0.875rem; font-size: 0.875rem; }
.btn--md { padding: 0.625rem 1.25rem; font-size: 0.9375rem; }
.btn--lg { padding: 0.875rem 1.75rem; font-size: 1rem; }
.btn--full { width: 100%; }
.btn__spinner { width: 1em; height: 1em; border: 2px solid currentColor; 
  border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; }
.btn__label--hidden { visibility: hidden; position: absolute; }
@keyframes spin { to { transform: rotate(360deg); } }
*/
