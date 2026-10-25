"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { OrderRecord } from "@/types";

export const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price",
  "Changed my mind",
  "Delivery too slow",
  "Incorrect item or size selected",
  "Other",
] as const;

export function isOrderCancellable(status: string): boolean {
  return status === "Confirmed" || status === "Packed";
}

interface CancelOrderModalProps {
  order: OrderRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderId: string, reason?: string) => void;
}

export function CancelOrderModal({
  order,
  isOpen,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [reason, setReason] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      window.addEventListener("mousedown", handleOutsideClick);
    }
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [isDropdownOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!order) return null;

  const handleConfirm = () => {
    onConfirm(order.id, reason || undefined);
  };

  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on Delivery"
      : order.paymentMethod === "card"
      ? "Original Card / Net Banking"
      : "Original UPI / Payment Account";

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-modal-title"
        >
          {/* Subtle blurred backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 bg-black/45 backdrop-blur-[3px]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.16)] border border-neutral-200 p-6 sm:p-7 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top-Right Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-veyro-black hover:bg-neutral-50 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={17} strokeWidth={2} />
            </button>

            {/* Subtle Refined Warning Icon (Apple / Aesop style) */}
            <div className="flex justify-center mb-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <svg
                  className="w-5 h-5 text-amber-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8v4" />
                  <circle cx="12" cy="16" r="0.8" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-5">
              <h2
                id="cancel-modal-title"
                className="text-[19px] font-semibold text-veyro-black tracking-[-0.015em] mb-1.5"
              >
                Cancel this order?
              </h2>
              <p className="text-[13.5px] leading-relaxed text-neutral-600 max-w-xs mx-auto">
                This action cannot be undone. Refund will be processed within 5–7 business days.
              </p>
              <div className="mt-2 inline-block font-mono text-[12.5px] font-bold text-neutral-900 bg-neutral-50 border border-neutral-200 px-2.5 py-0.5 rounded-md">
                #{order.id}
              </div>
            </div>

            {/* Section 1: Reason Dropdown (Custom) */}
            <div className="mb-4">
              <label
                id="cancel-reason-label"
                className="block text-xs font-medium text-neutral-800 mb-1.5"
              >
                Reason for cancellation
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                  aria-labelledby="cancel-reason-label"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full h-11 px-3.5 pr-10 text-[13.5px] text-left rounded-xl border transition-colors flex items-center justify-between
                    ${
                      isDropdownOpen
                        ? "border-veyro-black ring-1 ring-veyro-black bg-white text-veyro-black"
                        : "border-neutral-200 bg-white hover:border-veyro-black text-neutral-900"
                    }
                  `}
                >
                  <span className={!reason ? "text-veyro-muted" : ""}>
                    {reason || "Select a reason..."}
                  </span>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-600">
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <ChevronDown size={16} strokeWidth={2} />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute z-50 w-full mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden"
                      role="listbox"
                      aria-labelledby="cancel-reason-label"
                    >
                      <div className="max-h-[220px] overflow-y-auto py-1">
                        {CANCEL_REASONS.map((r) => {
                          const isSelected = r === reason;
                          return (
                            <button
                              key={r}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setReason(r);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 text-[13.5px] transition-colors flex items-center justify-between ${
                                isSelected
                                  ? "bg-neutral-50 text-veyro-black font-medium"
                                  : "text-neutral-800 hover:bg-neutral-50 hover:text-veyro-black"
                              }`}
                            >
                              <span>{r}</span>
                              {isSelected && (
                                <Check size={14} strokeWidth={2.5} className="text-veyro-black" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Section 2: Refund Info Box (Subtle, warm pale yellow) */}
            <div className="mb-6 p-3.5 bg-amber-50/50 border border-amber-200/80 rounded-xl">
              <p className="text-[12.5px] leading-relaxed text-amber-900">
                Refund of <strong className="font-semibold text-neutral-950">{formatPrice(order.total)}</strong> will be credited to {paymentLabel} within 5–7 business days.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 px-4 text-[13.5px] font-medium text-neutral-900 bg-white border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 rounded-xl transition-colors cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 h-11 px-4 text-[13.5px] font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-colors cursor-pointer shadow-[0_1px_3px_rgba(229,57,53,0.3)]"
              >
                Cancel Order
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
