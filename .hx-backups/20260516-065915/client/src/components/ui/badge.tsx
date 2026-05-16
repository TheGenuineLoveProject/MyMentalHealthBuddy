import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "sage" | "gold" | "premium";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--glp-gold)] focus:ring-offset-2";
    
    const variants = {
      default: "border-transparent bg-[var(--glp-sage-deep)] text-[var(--glp-paper)] hover:bg-[var(--glp-teal-600)]",
      secondary: "border-transparent bg-[var(--glp-sage-100)] text-[var(--glp-teal-700)] hover:bg-[var(--glp-sage-200)] dark:bg-[var(--glp-teal-800)] dark:text-[var(--glp-paper)] dark:hover:bg-[var(--glp-teal-700)]",
      destructive: "border-transparent bg-[var(--glp-error)] text-white hover:bg-[var(--glp-error-dark)]",
      outline: "border-[var(--glp-border)] text-[var(--glp-text)] bg-transparent",
      sage: "border-[var(--glp-sage-300)] bg-[var(--glp-sage-100)] text-[var(--glp-sage-700)]",
      gold: "border-[var(--glp-gold-300)] bg-[var(--glp-gold-100)] text-[var(--glp-gold-700)]",
      premium: "border-transparent bg-gradient-to-r from-[var(--glp-gold-400)] to-[var(--glp-gold-500)] text-white shadow-[var(--glp-shadow-sm)]",
    };

    return (
      <span
        className={`${baseStyles} ${variants[variant]} ${className}`}
        ref={ref}
        role="status"
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
