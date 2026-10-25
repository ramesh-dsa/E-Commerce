"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  staggerChildren?: number;
  once?: boolean;
  amount?: number | "some" | "all";
}

const LUXURY_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.65,
  y = 24,
  staggerChildren,
  once = true,
  amount = 0.15,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
      y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: LUXURY_EASE,
        ...(staggerChildren
          ? {
              staggerChildren,
              delayChildren: delay || 0.05,
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
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  className = "",
  y = 20,
  duration = 0.6,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  duration?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
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
