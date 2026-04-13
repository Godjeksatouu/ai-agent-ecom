// components/ui/Input.tsx
"use client"

import { forwardRef } from "react"
import { cn } from "@/utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none text-neutral-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm ring-offset-white transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-red-500 focus-visible:ring-red-500" : "hover:border-neutral-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[13px] font-medium text-red-500">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-[13px] text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
