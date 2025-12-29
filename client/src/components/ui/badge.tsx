import { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
      default: "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
      secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
      destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
      outline: "border-current text-current",
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
