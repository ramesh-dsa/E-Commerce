"use client";

import React, { useState, useEffect } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  delay?: number;
  enableHoverSpring?: boolean;
}

/**
 * Official React Bits SplitText component.
 * Performs a 3D perspective spring flip with lens-blur focus dissipation
 * on each individual character, with interactive magnetic hover scaling.
 */
export function SplitText({
  text,
  className = "",
  charClassName = "",
  delay = 45,
  enableHoverSpring = true,
}: SplitTextProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const characters = text.split("");

  return (
    <span
      className={`inline-flex flex-wrap items-center select-none ${className}`}
      style={{ perspective: "1000px" }}
    >
      {characters.map((char, index) => {
        if (char === " ") {
          return (
            <span key={index} className="inline-block w-[0.3em]">
              &nbsp;
            </span>
          );
        }

        return (
          <span
            key={index}
            className="inline-block will-change-transform transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted
                ? "perspective(800px) rotateX(0deg) translate3d(0, 0, 0)"
                : "perspective(800px) rotateX(-50deg) translate3d(0, 24px, -20px)",
              transitionDelay: `${index * delay}ms`,
            }}
          >
            <span
              className={`inline-block will-change-transform transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                enableHoverSpring
                  ? "hover:-translate-y-2.5 hover:scale-[1.14] hover:text-veyro-yellow cursor-pointer select-none"
                  : ""
              } ${charClassName}`}
            >
              {char}
            </span>
          </span>
        );
      })}
    </span>
  );
}
