"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";

export type ToastVariant = "success" | "danger" | "info";
export type ToastPosition = "top" | "bottom";

export interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message?: React.ReactNode;
  children?: React.ReactNode;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function Toast({
  isOpen,
  onClose,
  message,
  children,
  variant = "success",
  position = "top",
  duration = 4000,
  action,
  className = "",
}: ToastProps) {
  useEffect(() => {
    if (!isOpen || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  const isTop = position === "top";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{
            opacity: 0,
            y: isTop ? -20 : 20,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: isTop ? -16 : 16,
            scale: 0.98,
          }}
          transition={{
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`fixed z-50 mx-auto w-auto max-w-[calc(100vw-2rem)] sm:max-w-md ${
            isTop
              ? "top-20 sm:top-24 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto"
              : "bottom-6 sm:bottom-8 inset-x-4 sm:inset-x-auto sm:right-6 sm:left-auto"
          } ${className}`}
        >
          <div className="bg-[#0c0d0e]/95 backdrop-blur-md border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.5)] text-neutral-100 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-4.5 sm:py-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
            {/* Left: Icon & Message */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {variant === "danger" && (
                <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <AlertCircle size={14} className="text-rose-400 stroke-[2.2]" />
                </div>
              )}
              {variant === "success" && (
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check size={14} className="text-emerald-400 stroke-[2.5]" />
                </div>
              )}
              {variant === "info" && (
                <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                  <Info size={14} className="text-neutral-300 stroke-[2.2]" />
                </div>
              )}

              <div className="text-neutral-200 text-xs sm:text-sm font-medium leading-snug">
                {message || children}
              </div>
            </div>

            {/* Right: Optional Action & Close Button */}
            <div className="flex items-center gap-2 shrink-0">
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  className="text-xs font-semibold text-white underline underline-offset-4 hover:text-neutral-300 transition-colors cursor-pointer px-1 py-0.5"
                >
                  {action.label}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Dismiss notification"
                className="p-1 -mr-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
