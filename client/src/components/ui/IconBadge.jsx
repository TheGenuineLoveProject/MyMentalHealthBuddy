import { clsx } from "clsx";

const VARIANTS = {
  sage: "icon-gradient-sage",
  teal: "icon-gradient-teal",
  gold: "icon-gradient-gold",
  soft: "bg-[var(--surface-2)] text-[var(--glp-primary)]",
};

const SIZES = {
  sm: "w-10 h-10 rounded-lg",
  md: "w-12 h-12 rounded-xl",
  lg: "w-16 h-16 rounded-2xl",
  xl: "w-20 h-20 rounded-2xl",
};

export default function IconBadge({
  children,
  variant = "teal",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center shrink-0 shadow-md",
        SIZES[size] || SIZES.md,
        VARIANTS[variant] || VARIANTS.teal,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
