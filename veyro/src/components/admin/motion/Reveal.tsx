"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { EASE, DUR_ENTRY, DIST } from "./motion-tokens";

export interface RevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  delay?: number;
  dist?: number;
  duration?: number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  dist = DIST,
  duration = DUR_ENTRY,
  className = "",
  ...props
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: dist }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: EASE,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
