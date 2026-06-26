import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export function Button({
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-gold,#D4AF37)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60";

  const variantStyles = {
    default:
      "bg-[var(--glp-deep-teal,#2F5D5D)] text-[var(--glp-ivory,#FAF9F7)] shadow-sm hover:brightness-110 hover:shadow-md active:scale-[0.99]",
    outline:
      "border border-[rgba(47,93,93,0.28)] bg-[rgba(250,249,247,0.82)] text-[var(--glp-deep-teal,#2F5D5D)] shadow-sm backdrop-blur hover:bg-[rgba(143,191,159,0.16)] hover:border-[var(--glp-sage,#8FBF9F)] active:scale-[0.99]",
    ghost:
      "bg-transparent text-[var(--glp-deep-teal,#2F5D5D)] hover:bg-[rgba(143,191,159,0.14)] active:scale-[0.99]"
  };

  return (
    <button
      className={`${base} ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}
