// components/ui/Button.tsx
"use client"

import { forwardRef } from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { variants } from "@/animations/variants"
import { cn } from "@/utils/cn" // Assuming a utility exists or matches the pattern

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends HTMLMotionProps<"button"> {
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
  const variantsStyles = {
    primary: "bg-black text-white hover:bg-neutral-800 shadow-sm",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border-transparent",
    outline: "bg-transparent border-neutral-200 text-neutral-900 hover:bg-neutral-50",
    ghost: "bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border-transparent",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-4 text-base",
  }

  return (
    <motion.button
      ref={ref}
      disabled={disabled || isLoading}
      variants={variants.buttonPress}
      whileHover="hover"
      whileTap="tap"
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-full border",
        variantsStyles[variant],
        sizes[size],
        fullWidth ? "w-full" : "",
        className
      )}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      ) : null}
      <span className={isLoading ? "invisible" : "visible"}>
        {children}
      </span>
    </motion.button>
  )
})

Button.displayName = "Button"
