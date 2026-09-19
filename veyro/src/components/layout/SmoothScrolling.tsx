"use client";

import { ReactLenis } from "lenis/react";

interface SmoothScrollingProps {
  children: React.ReactNode;
}

export function SmoothScrolling({ children }: SmoothScrollingProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
