"use client";

import React, { useState, useEffect, useRef } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover";
}

/**
 * Official React Bits DecryptedText component.
 * High-tech cypher decoding animation that scrambles characters rapidly
 * before settling sequentially into the final text.
 */
export function DecryptedText({
  text,
  speed = 40,
  maxIterations = 12,
  sequential = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//<>[]!@#$%",
  className = "",
  parentClassName = "",
  animateOn = "hover",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isReducedMotion = useRef(false);

  const scramble = () => {
    if (isScrambling || isReducedMotion.current) return;
    setIsScrambling(true);

    let iteration = 0;
    const totalLength = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (sequential) {
              if (index < iteration) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            } else {
              if (iteration >= maxIterations) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            }
          })
          .join("")
      );

      iteration += 1;

      if (sequential ? iteration > totalLength + 2 : iteration > maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      isReducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }

    if (!isReducedMotion.current) {
      // Trigger initial reveal on load
      const timer = setTimeout(() => {
        scramble();
      }, 150);
      return () => {
        clearTimeout(timer);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [text]);

  const handleMouseEnter = () => {
    if (animateOn === "hover" && !isScrambling) {
      scramble();
    }
  };

  return (
    <span
      className={`inline-block select-none ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
    >
      <span className={className}>{displayText}</span>
    </span>
  );
}
