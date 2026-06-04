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
  const variantStyles = {
    default: "bg-black text-white",
    outline: "border border-gray-300 bg-white",
    ghost: "bg-transparent"
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
}