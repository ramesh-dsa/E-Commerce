"use client";

import React, { useEffect, useState } from "react";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
}

/**
 * Official React Bits BlurText component.
 * Staggered animation that reveals words or letters with a luxury lens-focus blur dissipation.
 */
export function BlurText({
  text,
  delay = 50,
  className = "",
  animateBy = "words",
  direction = "top",
}: BlurTextProps) {
  const [elements, setElements] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (animateBy === "words") {
      setElements(text.split(" "));
    } else {
      setElements(text.split(""));
    }
    const timer = setTimeout(() => setIsReady(true), 80);
    return () => clearTimeout(timer);
  }, [text, animateBy]);

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}>
      {elements.map((el, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-700 ease-out will-change-transform"
          style={{
            opacity: isReady ? 1 : 0,
            filter: isReady ? "blur(0px)" : "blur(10px)",
            transform: isReady
              ? "translate3d(0, 0, 0)"
              : direction === "top"
              ? "translate3d(0, -18px, 0)"
              : "translate3d(0, 18px, 0)",
            transitionDelay: `${i * delay}ms`,
          }}
        >
          {el}
          {animateBy === "letters" && el === " " ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
