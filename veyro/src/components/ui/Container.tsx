import React from "react";
import { ContainerProps } from "@/types";

/**
 * Reusable page container layout system for VEYRO:
 * - Mobile: 16px horizontal padding (px-4)
 * - Tablet: 24-32px horizontal padding (sm:px-8)
 * - Desktop: 1540px grid max-width matching reference (max-w-[1540px] px-4 sm:px-8 xl:px-10)
 */
export function Container({
  maxWidth = "default",
  children,
  className = "",
  ...props
}: ContainerProps) {
  const maxWidthMap = {
    default: "max-w-screen-2xl",
    wide: "max-w-[1600px]",
    narrow: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`mx-auto w-full overflow-x-clip px-4 sm:px-8 xl:px-10 ${maxWidthMap[maxWidth]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
