import React from "react";
import { BadgeProps } from "@/types";

export function Badge({
  variant = "default",
  size = "sm",
  children,
  className = "",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center justify-center uppercase font-semibold select-none leading-none";

  const variantStyles = {
    default: "bg-veyro-surface-alt text-veyro-black",
    dark: "bg-veyro-black text-white",
    sale: "bg-veyro-accent text-white",
    outline: "border border-veyro-black text-veyro-black bg-transparent",
  };

  const sizeStyles = {
    sm: "text-[10px] px-2 py-1 tracking-wider",
    md: "text-[11px] px-2.5 py-1.5 tracking-widest",
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
