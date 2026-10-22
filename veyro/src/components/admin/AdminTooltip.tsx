"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

interface AdminTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  enabled?: boolean;
  className?: string;
}

export function AdminTooltip({
  content,
  children,
  enabled = true,
  className = "w-full",
}: AdminTooltipProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // When disabled or route changes, immediately hide tooltip so it never flashes during expand animations or navigation
  useEffect(() => {
    if (!enabled && visible) {
      setVisible(false);
    }
  }, [enabled, visible]);

  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return;
    const target = (triggerRef.current.firstElementChild as HTMLElement) ?? triggerRef.current;
    const rect = target.getBoundingClientRect();
    setCoords({
      top: rect.top + rect.height / 2,
      left: rect.right + 10,
    });
  }, []);

  const showTooltip = () => {
    if (!enabled || !triggerRef.current) return;
    updateCoords();
    setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  // Recalculate position on window resize and on scroll of the nav list while visible
  useEffect(() => {
    if (!visible || !enabled) return;

    const handleScrollOrResize = () => {
      updateCoords();
    };

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
    };
  }, [visible, enabled, updateCoords]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onClick={hideTooltip}
        className={className}
      >
        {children}
      </div>
      {enabled &&
        visible &&
        mounted &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: "translateY(-50%)",
              zIndex: 99999,
            }}
            className="px-3 py-1.5 bg-[var(--admin-elevated)] text-white text-xs font-semibold rounded-[14px] border border-white/10 whitespace-nowrap pointer-events-none animate-in fade-in duration-100 flex items-center gap-1.5"
          >
            {content}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--admin-elevated)] border-l border-b border-white/10 rotate-45" />
          </div>,
          document.body
        )}
    </>
  );
}
