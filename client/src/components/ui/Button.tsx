/**
 * @deprecated DUPLICATE COMPONENT
 * 
 * Canonical Button: import { Button } from '@/components/ui'
 * (resolves to Button.jsx which has 4 variants and 3 sizes)
 * 
 * This .tsx version exists for TypeScript compatibility.
 * 
 * Last audit: 2026-01-23
 */
import { forwardRef, ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-[var(--glp-sage-deep)] text-[var(--glp-paper)] hover:bg-[var(--glp-teal-600)] shadow-[var(--glp-shadow-sm)]",
      destructive: "bg-[var(--glp-error)] text-white hover:bg-[var(--glp-error-dark)]",
      outline: "border-2 border-[var(--glp-sage-300)] bg-transparent text-[var(--glp-teal-600)] hover:bg-[var(--glp-sage-100)] dark:border-[var(--glp-teal-700)] dark:hover:bg-[var(--glp-teal-800)]",
      secondary: "bg-[var(--glp-sage-100)] text-[var(--glp-teal-700)] hover:bg-[var(--glp-sage-200)] dark:bg-[var(--glp-teal-800)] dark:text-[var(--glp-paper)]",
      ghost: "text-[var(--glp-teal-600)] hover:bg-[var(--glp-sage-100)] dark:hover:bg-[var(--glp-teal-800)]",
      link: "text-[var(--glp-sage-deep)] underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
