import { clsx } from "clsx";

const VARIANTS = {
  teal: "icon-teal-gradient",
  "teal-soft": "icon-teal-soft",
  sage: "icon-sage-gradient",
  "sage-soft": "icon-sage-soft",
  gold: "icon-gold-gradient",
  "gold-soft": "icon-gold-soft",
  blush: "icon-blush-gradient",
  "blush-soft": "icon-blush-soft",
  soft: "bg-[var(--surface-2)] text-[var(--glp-primary)]",
  outline: "icon-outline border-2 border-current",
};

const SIZES = {
  xs: "icon-premium-xs",
  sm: "icon-premium-sm",
  md: "icon-premium-md",
  lg: "icon-premium-lg",
  xl: "icon-premium-xl",
  "2xl": "icon-premium-2xl",
};

const GLOW = {
  teal: "icon-glow-teal",
  gold: "icon-glow-gold",
  sage: "icon-glow",
  none: "",
};

export default function IconBadge({
  children,
  variant = "teal",
  size = "md",
  glow = "none",
  hover = false,
  className = "",
  ...props
}) {
  return (
    <div
      className={clsx(
        "icon-premium flex items-center justify-center shrink-0",
        SIZES[size] || SIZES.md,
        VARIANTS[variant] || VARIANTS.teal,
        GLOW[glow] || "",
        hover && "icon-hover-lift",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
