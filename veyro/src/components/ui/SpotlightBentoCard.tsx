"use client";

import React, { useRef, useEffect } from "react";

interface SpotlightBentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  enableTilt?: boolean;
}

/**
 * Ultra-performant, accessible Spotlight Card inspired by React Bits & luxury streetwear lookbooks.
 * Uses direct DOM manipulation to drive CSS variables for 60fps+ rendering
 * without triggering React re-renders. Enhanced 3D tilt and true perspective depth.
 */
export function SpotlightBentoCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.04)",
  enableTilt = true,
  ...props
}: SpotlightBentoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      isReducedMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Set CSS variables for spotlight position
    card.style.setProperty("--spotlight-x", `${x}px`);
    card.style.setProperty("--spotlight-y", `${y}px`);
    card.style.setProperty("--spotlight-opacity", "1");

    // Subtle, elegant 3D tilt (refined micro-depth without excessive distortion)
    if (enableTilt && !isReducedMotion.current) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2.2;
      const rotateY = ((x - centerX) / centerX) * 2.2;

      card.style.transition = "transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)";
      card.style.transform = `perspective(1400px) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.008, 1.008, 1.008)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--spotlight-opacity", "0");
    if (enableTilt && !isReducedMotion.current) {
      card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      card.style.transform =
        "perspective(1400px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-[#0d0d10] text-white select-none ${className}`}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      {...props}
    >
      {/* 1. Ultra-Subtle Focused Cursor Gleam (Whisper-soft, zero foggy haze) */}
      <div
        className="pointer-events-none absolute -inset-px z-20 transition-opacity duration-300"
        style={{
          opacity: "var(--spotlight-opacity, 0)",
          background: `radial-gradient(380px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), ${spotlightColor}, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* 2. Delicate Silver Border Accent */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-xl sm:rounded-2xl transition-opacity duration-300"
        style={{
          opacity: "var(--spotlight-opacity, 0)",
          boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.14)",
        }}
        aria-hidden="true"
      />

      {/* Card Content Stage */}
      {children}
    </div>
  );
}
