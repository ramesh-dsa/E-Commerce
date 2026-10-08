"use client";

import React, { useEffect, useState, useRef } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

/**
 * Official React Bits CountUp component.
 * Numbers count up with fluid cubic easing, ideal for live dashboard telemetry
 * and financial/inventory metrics.
 */
export function CountUp({
  to,
  from = 0,
  duration = 1.8,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: CountUpProps) {
  const [current, setCurrent] = useState(from);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = from + (to - from) * easeOut;

      setCurrent(value);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCurrent(to);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [to, from, duration]);

  const formatted = current.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`inline-block font-mono ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
