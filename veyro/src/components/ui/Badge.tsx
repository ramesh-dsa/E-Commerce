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
    "inline-flex items-center justify-center uppercase font-bold select-none leading-none rounded-full backdrop-blur-md shadow-2xs border border-white/20";

  const variantStyles = {
    default: "bg-white/95 text-neutral-900 border-black/5",
    dark: "bg-neutral-950/90 text-white border-white/15",
    sale: "bg-veyro-accent text-white border-white/20",
    outline: "border border-neutral-900 text-neutral-900 bg-white/80",
  };

  const sizeStyles = {
    sm: "text-[9.5px] px-2.5 py-1 tracking-wider",
    md: "text-[10.5px] px-3 py-1.5 tracking-widest",
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
