"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: number;
  staggerChildren?: number;
  once?: boolean;
  amount?: number | "some" | "all";
}

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ScrollReveal({
  children,
  className = "",
  style,
  delay = 0,
  duration = 0.5,
  y = 16,
  scale,
  staggerChildren,
  once = true,
  amount = 0.05,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className} style={style}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y,
      ...(scale !== undefined ? { scale } : {}),
    },
    visible: {
      opacity: 1,
      y: 0,
      ...(scale !== undefined ? { scale: 1 } : {}),
      transition: {
        duration,
        delay,
        ease: LUXURY_EASE,
        ...(staggerChildren
          ? {
              staggerChildren,
              delayChildren: delay || 0.03,
            }
          : {}),
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={containerVariants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  className = "",
  y = 16,
  scale,
  duration = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  scale?: number;
  duration?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y,
      ...(scale !== undefined ? { scale } : {}),
    },
    visible: {
      opacity: 1,
      y: 0,
      ...(scale !== undefined ? { scale: 1 } : {}),
      transition: {
        duration,
        ease: LUXURY_EASE,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
