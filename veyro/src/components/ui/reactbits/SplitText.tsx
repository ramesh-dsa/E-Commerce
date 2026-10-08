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
            className={`inline-block will-change-transform transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              enableHoverSpring
                ? "hover:-translate-y-2 hover:scale-[1.14] hover:text-[#fcd017] cursor-pointer"
                : ""
            } ${charClassName}`}
            style={{
              opacity: mounted ? 1 : 0,
              filter: mounted ? "blur(0px)" : "blur(12px)",
              transform: mounted
                ? "perspective(800px) rotateX(0deg) translate3d(0, 0, 0)"
                : "perspective(800px) rotateX(-55deg) translate3d(0, 32px, -40px)",
              transitionDelay: `${index * delay}ms`,
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
