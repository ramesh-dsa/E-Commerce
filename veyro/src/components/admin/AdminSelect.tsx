"use client";

import React, { useState, useRef, useEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useAnchoredMenu } from "./useAnchoredMenu";

export interface AdminSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AdminSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: AdminSelectOption[];
  placeholder?: string;
  prefix?: string;
  prefixLabel?: string;
  disabled?: boolean;
  "aria-label"?: string;
  name?: string;
  className?: string;
  triggerClassName?: string;
  id?: string;
}

function AdminPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}

export function AdminSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  prefix,
  prefixLabel,
  disabled = false,
  "aria-label": ariaLabel,
  name,
  className = "",
  triggerClassName = "",
  id,
}: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;

  const { triggerRef, menuRef, position } = useAnchoredMenu({
    offset: 6,
    viewportMargin: 8,
    isOpen: open,
    onClose: () => setOpen(false),
    align: "left",
    matchWidth: true,
  });

  const selectedOption = options.find((opt) => opt.value === value);
  const prefixText = prefix || prefixLabel;

  // Type-to-search buffer
  const searchBufferRef = useRef("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTypeToSearch = useCallback(
    (char: string) => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchBufferRef.current += char.toLowerCase();
      searchTimeoutRef.current = setTimeout(() => {
        searchBufferRef.current = "";
      }, 500);

      const match = options.find(
        (opt) => !opt.disabled && opt.label.toLowerCase().startsWith(searchBufferRef.current)
      );
      if (match && menuRef.current) {
        const itemEl = menuRef.current.querySelector<HTMLElement>(
          `[data-value="${CSS.escape(match.value)}"]`
        );
        if (itemEl) {
          itemEl.focus();
          itemEl.scrollIntoView({ block: "nearest", behavior: "auto" });
        }
      }
    },
    [options, menuRef]
  );

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (!open) {
        setOpen(true);
      }
      handleTypeToSearch(e.key);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" || e.key === " ") && document.activeElement?.getAttribute("role") === "option") {
      e.preventDefault();
      (document.activeElement as HTMLElement)?.click();
      return;
    }
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      handleTypeToSearch(e.key);
    }
  };

  const handleSelect = (val: string, isOptDisabled?: boolean) => {
    if (isOptDisabled) return;
    onValueChange(val);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const placement = position?.placement ?? "bottom";
  const initialY = shouldReduceMotion ? 0 : placement === "top" ? 4 : -4;

  return (
    <div className={`relative inline-block ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={triggerRef}
        type="button"
        id={selectId}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-label={ariaLabel || (prefixText ? `${prefixText} ${selectedOption?.label || placeholder}` : undefined)}
        className={`w-full ${triggerClassName || "h-9"} rounded-[14px] bg-[var(--admin-surface-2)] border border-white/10 hover:border-white/20 focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--admin-primary)] focus-visible:border-[var(--admin-primary)] px-3 text-xs font-semibold text-white flex items-center justify-between gap-2 transition-colors cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`}
      >
        <div className="flex items-center min-w-0 truncate text-left">
          {prefixText && (
            <span className="text-[var(--admin-text-muted)] font-normal shrink-0 mr-1">
              {prefixText}
            </span>
          )}
          <span
            className={`truncate ${
              selectedOption ? "text-white" : "text-[var(--admin-text-muted)] font-normal"
            }`}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={`text-[var(--admin-text-muted)] shrink-0 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <AdminPortal>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              id={listboxId}
              role="listbox"
              aria-label={ariaLabel || prefixText || placeholder}
              tabIndex={-1}
              onKeyDown={handleMenuKeyDown}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: initialY }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: initialY }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "fixed",
                top: position ? `${position.top}px` : "-9999px",
                left: position ? `${position.left}px` : "-9999px",
                minWidth: position?.minWidth ? `${position.minWidth}px` : undefined,
                maxHeight: position?.maxHeight ? `${Math.min(240, position.maxHeight)}px` : "240px",
                visibility: position ? "visible" : "hidden",
                zIndex: 100020,
              }}
              className="bg-[var(--admin-surface)] border border-white/10 rounded-[14px] p-1.5 shadow-2xl shadow-black/60 overflow-y-auto admin-scroll overscroll-contain space-y-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    id={`${selectId}-opt-${opt.value}`}
                    data-value={opt.value}
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value, opt.disabled)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSelect(opt.value, opt.disabled);
                      }
                    }}
                    className={`w-full h-8 px-2.5 rounded-[var(--admin-radius-item,10px)] text-xs text-white flex items-center justify-between gap-2 transition-colors cursor-pointer text-left select-none focus:outline-none focus-visible:bg-white/[0.08] ${
                      isSelected ? "bg-white/10 font-bold" : "hover:bg-white/[0.06] font-medium"
                    } ${opt.disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}`}
                  >
                    <span className="truncate flex-1">{opt.label}</span>
                    {isSelected && (
                      <Check size={13} className="text-[var(--admin-primary)] shrink-0" />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </AdminPortal>
    </div>
  );
}

export default AdminSelect;
