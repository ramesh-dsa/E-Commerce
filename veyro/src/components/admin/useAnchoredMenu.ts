"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface AnchoredPosition {
  top: number;
  left: number;
  minWidth?: number;
  maxHeight?: number;
  placement: "bottom" | "top";
}

export interface UseAnchoredMenuOptions {
  offset?: number;
  viewportMargin?: number;
  isOpen: boolean;
  onClose: () => void;
  align?: "left" | "right";
  matchWidth?: boolean;
  closeOnScroll?: boolean;
}

export function useAnchoredMenu({
  offset = 6,
  viewportMargin = 8,
  isOpen,
  onClose,
  align = "right",
  matchWidth = false,
  closeOnScroll = false,
}: UseAnchoredMenuOptions) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<AnchoredPosition | null>(null);
  const rafRef = useRef<number | null>(null);
  const wasOpenRef = useRef(false);
  const pathname = usePathname();

  // Position calculation before paint to prevent flicker
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuEl = menuRef.current;
    const menuHeight = menuEl && menuEl.offsetHeight > 0 ? menuEl.offsetHeight : 248;
    const menuWidth = menuEl && menuEl.offsetWidth > 0 ? menuEl.offsetWidth : 208; // w-52 is 208px

    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    let placement: "bottom" | "top" = "bottom";
    let top = 0;
    let maxHeight: number | undefined = undefined;

    // 1. Open DOWN if spaceBelow >= menuHeight + 8
    if (spaceBelow >= menuHeight + 8) {
      placement = "bottom";
      top = triggerRect.bottom + offset;
    } else if (spaceAbove > spaceBelow) {
      // 2. Open UP if spaceAbove is bigger
      placement = "top";
      if (spaceAbove >= menuHeight + 8) {
        top = triggerRect.top - offset - menuHeight;
      } else {
        maxHeight = Math.max(80, spaceAbove - offset - 8);
        top = Math.max(viewportMargin, triggerRect.top - offset - maxHeight);
      }
    } else {
      // 3. Open on side with more space (downward) with constrained maxHeight
      placement = "bottom";
      top = triggerRect.bottom + offset;
      maxHeight = Math.max(80, spaceBelow - offset - 8);
    }

    const minWidth = matchWidth ? Math.round(triggerRect.width) : undefined;
    const effectiveMenuWidth = Math.max(menuWidth, minWidth ?? 0);

    let left = align === "left" ? triggerRect.left : triggerRect.right - effectiveMenuWidth;
    if (left + effectiveMenuWidth > window.innerWidth - viewportMargin) {
      left = Math.max(viewportMargin, window.innerWidth - viewportMargin - effectiveMenuWidth);
    }
    if (left < viewportMargin) {
      left = viewportMargin;
    }

    setPosition({
      top: Math.round(top),
      left: Math.round(left),
      minWidth,
      maxHeight: maxHeight ? Math.round(maxHeight) : undefined,
      placement,
    });
  }, [offset, viewportMargin, align, matchWidth]);

  // Synchronous layout calculation before paint
  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    } else {
      setPosition(null);
    }
  }, [isOpen, updatePosition]);

  // Focus restoration & initial menu item focus
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      requestAnimationFrame(() => {
        if (menuRef.current) {
          const selectedOption = menuRef.current.querySelector<HTMLElement>(
            '[role="option"][aria-selected="true"]:not([aria-disabled="true"]):not([disabled])'
          );
          const firstItem = menuRef.current.querySelector<HTMLElement>(
            '[role="menuitem"]:not([disabled]), [role="option"]:not([aria-disabled="true"]):not([disabled])'
          );
          const targetItem = selectedOption || firstItem;
          if (targetItem) {
            targetItem.focus();
            targetItem.scrollIntoView({ block: "nearest", behavior: "auto" });
          }
        }
      });
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listeners: close on outside click, Escape, window resize, and ANY scroll container
  useEffect(() => {
    if (!isOpen) return;

    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        onClose();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        onClose();
        return;
      }

      // Arrow navigation between menu items
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!menuRef.current) return;
        const items = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            '[role="menuitem"]:not([disabled]), [role="option"]:not([aria-disabled="true"]):not([disabled])'
          )
        );
        if (items.length === 0) return;

        const activeIndex = items.findIndex((item) => item === document.activeElement);
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextIndex = activeIndex === -1 ? 0 : (activeIndex + 1) % items.length;
          const nextItem = items[nextIndex];
          nextItem?.focus();
          nextItem?.scrollIntoView({ block: "nearest", behavior: "auto" });
        } else {
          e.preventDefault();
          const prevIndex = activeIndex === -1 ? items.length - 1 : (activeIndex - 1 + items.length) % items.length;
          const prevItem = items[prevIndex];
          prevItem?.focus();
          prevItem?.scrollIntoView({ block: "nearest", behavior: "auto" });
        }
      }

      if (e.key === "Home") {
        if (!menuRef.current) return;
        const items = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            '[role="menuitem"]:not([disabled]), [role="option"]:not([aria-disabled="true"]):not([disabled])'
          )
        );
        if (items.length === 0) return;
        e.preventDefault();
        items[0]?.focus();
        items[0]?.scrollIntoView({ block: "nearest", behavior: "auto" });
      }

      if (e.key === "End") {
        if (!menuRef.current) return;
        const items = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            '[role="menuitem"]:not([disabled]), [role="option"]:not([aria-disabled="true"]):not([disabled])'
          )
        );
        if (items.length === 0) return;
        e.preventDefault();
        const lastItem = items[items.length - 1];
        lastItem?.focus();
        lastItem?.scrollIntoView({ block: "nearest", behavior: "auto" });
      }
    }

    function handleScroll(e: Event) {
      const target = e.target as Node | null;

      // 1. If scroll occurs INSIDE the menu itself (e.g. scrolling the options listbox), NEVER CLOSE!
      if (menuRef.current && target && (menuRef.current === target || menuRef.current.contains(target))) {
        return;
      }

      // 2. If scroll occurs outside the menu (page scroll, modal body scroll, table scroll):
      if (!triggerRef.current) {
        onClose();
        return;
      }

      // Check if trigger is still visible in the viewport
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const isHiddenOrDetached = triggerRect.width === 0 && triggerRect.height === 0;
      const isOutOfViewport = triggerRect.bottom < 0 || triggerRect.top > window.innerHeight;

      if (isHiddenOrDetached || isOutOfViewport) {
        onClose();
        return;
      }

      // If closeOnScroll option is true (for menus that explicitly want to dismiss when parent scrolls), close
      if (closeOnScroll) {
        onClose();
        return;
      }

      // Otherwise, smoothly update the anchored position via rAF throttle
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updatePosition();
      });
    }

    function handleResize() {
      if (!triggerRef.current) {
        onClose();
        return;
      }
      const triggerRect = triggerRef.current.getBoundingClientRect();
      if (triggerRect.bottom < 0 || triggerRect.top > window.innerHeight) {
        onClose();
        return;
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updatePosition();
      });
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onClose, closeOnScroll, updatePosition]);

  return {
    triggerRef,
    menuRef,
    position,
  };
}
