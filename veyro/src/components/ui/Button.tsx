import React, { forwardRef } from "react";
import { ButtonProps } from "@/types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Minimal border radius, confident font weight, clear focus & hover states
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-200 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veyro-black focus-visible:ring-offset-2 rounded-[2px]";

    const variantStyles = {
      primary:
        "bg-veyro-black text-white hover:bg-veyro-charcoal active:bg-black",
      secondary:
        "bg-veyro-surface-alt text-veyro-black hover:bg-veyro-border active:bg-[#e0e0dc]",
      outline:
        "border border-veyro-black text-veyro-black bg-transparent hover:bg-veyro-black hover:text-white active:bg-veyro-charcoal",
      text: "bg-transparent text-veyro-black hover:text-veyro-muted underline-offset-4 hover:underline p-0 h-auto font-normal rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 min-h-[32px] tracking-wide",
      md: "text-sm px-5 py-2.5 min-h-[42px] tracking-wide",
      lg: "text-base px-7 py-3 min-h-[48px] tracking-wide font-semibold",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${
          variant !== "text" ? sizeStyles[size] : ""
        } ${widthStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
