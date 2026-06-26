import * as React from "react";

export type MMHBButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghost"
  | "danger";

interface MMHBButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MMHBButtonVariant;
  size?: "sm" | "md" | "lg";
}

export function MMHBButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: MMHBButtonProps) {

  const variantClasses: Record<
    MMHBButtonVariant,
    string
  > = {
    primary:
      "bg-[#2F5D5D] text-[#FAF9F7] hover:bg-[#274F4F] shadow-sm shadow-[#2F5D5D]/20",

    secondary:
      "bg-[#F4C7C3]/55 text-[#3A3A3A] hover:bg-[#F4C7C3]/75 border border-[#F4C7C3]/80 shadow-sm",

    tertiary:
      "bg-[#FAF9F7]/80 border border-[#8FBF9F]/60 text-[#2F5D5D] hover:bg-[#8FBF9F]/18 shadow-sm",

    ghost:
      "bg-transparent text-[#2F5D5D] hover:bg-[#8FBF9F]/16",

    danger:
      "bg-[#7F1D1D] text-[#FAF9F7] hover:bg-[#991B1B] shadow-sm",
  };

  const sizeClasses: Record<
    NonNullable<MMHBButtonProps["size"]>,
    string
  > = {
    sm: "px-3 py-2 text-sm min-h-[40px]",
    md: "px-5 py-2.5 text-sm sm:text-base min-h-[44px]",
    lg: "px-6 py-3 text-base sm:text-lg min-h-[48px]",
  };

  return (
    <button
      className={`
        rounded-full
        transition-colors
        duration-200
        font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default MMHBButton;