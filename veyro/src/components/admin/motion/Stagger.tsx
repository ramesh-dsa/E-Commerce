"use client";

import React from "react";
import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import { EASE, DUR_ENTRY, DUR_FAST, STAGGER, DIST } from "./motion-tokens";

const groupVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: DIST },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DUR_ENTRY,
      ease: EASE,
    },
  },
};

export interface StaggerGroupProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
}

export function StaggerGroup({ children, className = "", ...props }: StaggerGroupProps) {
  return (
    <motion.div
      variants={groupVariants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  withHover?: boolean;
}

export function StaggerItem({
  children,
  className = "",
  withHover = false,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={
        withHover
          ? {
              y: -2,
              transition: { duration: DUR_FAST, ease: EASE },
            }
          : undefined
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
