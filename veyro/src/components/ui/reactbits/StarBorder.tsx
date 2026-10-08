"use client";

import React from "react";

interface StarBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  className?: string;
  color?: string;
  speed?: string;
  children: React.ReactNode;
}

/**
 * Official React Bits StarBorder component.
 * Orbits a radiant laser-sharp light beam around the perimeter of an element,
 * providing a high-tech illuminated border.
 */
export function StarBorder({
  as: Component = "div",
  className = "",
  color = "#fcd017",
  speed = "5s",
  children,
  ...props
}: StarBorderProps) {
  return (
    <Component
      className={`relative inline-block overflow-hidden rounded-3xl p-[1px] ${className}`}
      {...props}
    >
      {/* 360-degree Orbiting light beam */}
      <div
        className="absolute -inset-[150%] animate-star-border-spin pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 310deg, ${color} 345deg, transparent 360deg)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      {/* Inner content container */}
      <div className="relative z-10 w-full h-full rounded-[inherit] overflow-hidden">
        {children}
      </div>

      <style jsx>{`
        @keyframes star-border-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-star-border-spin {
          animation: star-border-spin linear infinite;
        }
      `}</style>
    </Component>
  );
}
