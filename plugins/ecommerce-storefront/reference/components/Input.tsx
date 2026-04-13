// components/ui/Input.tsx
import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}, ref) => {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

  return (
    <div className={`input-field ${error ? "input-field--error" : ""} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-field__label">
          {label}
          {props.required && <span aria-hidden="true" className="input-field__required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className="input-field__input"
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="input-field__error" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${inputId}-helper`} className="input-field__helper">
          {helperText}
        </p>
      )}
    </div>
  )
})
Input.displayName = "Input"

/*
CSS:
.input-field { display: flex; flex-direction: column; gap: 0.375rem; }
.input-field__label { font-size: 0.875rem; font-weight: 500; color: #374151; }
.input-field__required { color: #ef4444; margin-left: 0.125rem; }
.input-field__input {
  padding: 0.625rem 0.875rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.375rem;
  font-size: 0.9375rem;
  transition: border-color 0.15s, box-shadow 0.15s;
  background: #fff;
  width: 100%;
}
.input-field__input:focus {
  outline: none;
  border-color: #111;
  box-shadow: 0 0 0 3px rgba(17,17,17,0.1);
}
.input-field--error .input-field__input { border-color: #ef4444; }
.input-field--error .input-field__input:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.15); }
.input-field__error { font-size: 0.8125rem; color: #ef4444; }
.input-field__helper { font-size: 0.8125rem; color: #6b7280; }
*/
