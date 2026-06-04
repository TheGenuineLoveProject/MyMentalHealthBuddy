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
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "bg-gray-200 text-black hover:bg-gray-300",

    tertiary:
      "bg-transparent border border-gray-400 text-gray-800 hover:bg-gray-100",

    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100",

    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeClasses: Record<
    NonNullable<MMHBButtonProps["size"]>,
    string
  > = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`
        rounded-md
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