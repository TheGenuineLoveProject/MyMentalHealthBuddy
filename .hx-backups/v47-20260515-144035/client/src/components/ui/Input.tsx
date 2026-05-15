import { forwardRef, InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex h-10 w-full rounded-xl border-2 border-[var(--glp-border)] bg-[var(--glp-surface)] px-4 py-2 text-sm text-[var(--glp-text)] placeholder:text-[var(--glp-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--glp-gold)] focus:border-[var(--glp-sage)] transition-all disabled:cursor-not-allowed disabled:opacity-50 dark:border-[var(--glp-teal-700)] dark:bg-[var(--glp-teal-900)] dark:text-[var(--glp-paper)] dark:placeholder:text-[var(--glp-teal-400)] ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
