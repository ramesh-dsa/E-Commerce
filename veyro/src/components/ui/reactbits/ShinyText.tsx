"use client";

import React from "react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: "gold" | "silver";
}

/**
 * Official React Bits ShinyText component.
 * Sweeps a continuous metallic light reflection across text,
 * creating an ultra-premium luxury sheen with rock-solid cross-browser rendering.
 */
export function ShinyText({
  text,
  disabled = false,
  speed = 3.5,
  className = "",
  color = "gold",
}: ShinyTextProps) {
  if (disabled) {
    return <span className={`inline-block ${className}`}>{text}</span>;
  }

  const gradient =
    color === "gold"
      ? "linear-gradient(115deg, #fcd017 15%, #fff 50%, #fcd017 85%)"
      : "linear-gradient(115deg, #a1a1aa 15%, #fff 50%, #a1a1aa 85%)";

  return (
    <span
      className={`inline-block select-none font-semibold ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: "220% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        animation: `shiny-text-sweep ${speed}s linear infinite`,
      }}
    >
      {text}
      <style jsx>{`
        @keyframes shiny-text-sweep {
          0% {
            background-position: 220% center;
          }
          100% {
            background-position: -220% center;
          }
        }
      `}</style>
    </span>
  );
}
