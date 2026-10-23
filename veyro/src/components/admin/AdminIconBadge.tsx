import React from "react";
import type { LucideIcon } from "lucide-react";

export type AdminIconBadgeVariant = "kpi" | "section";

export interface AdminIconBadgeProps {
  icon?: LucideIcon;
  children?: React.ReactNode;
  variant?: AdminIconBadgeVariant;
  className?: string;
  iconClassName?: string;
  "aria-hidden"?: boolean;
}

/**
 * Shared Admin Icon Container Badge
 * - kpi: w-9 h-9 rounded-full, bg elevated token, border white/10, icon 18px, muted token color
 * - section: w-9 h-9 rounded-[14px], bg surface-2 token, border white/5, icon 16px, muted token color
 */
export function AdminIconBadge({
  icon: Icon,
  children,
  variant = "kpi",
  className = "",
  iconClassName = "",
  "aria-hidden": ariaHidden = true,
}: AdminIconBadgeProps) {
  const isKpi = variant === "kpi";
  const size = isKpi ? 18 : 16;
  const baseClasses = isKpi
    ? "w-9 h-9 rounded-full bg-[var(--admin-elevated)] border border-white/10 text-[var(--admin-text-muted)]"
    : "w-9 h-9 rounded-[14px] bg-[var(--admin-surface-2)] border border-white/5 text-[var(--admin-text-muted)]";

  return (
    <div
      className={`${baseClasses} flex items-center justify-center shrink-0 ${className}`}
      aria-hidden={ariaHidden}
    >
      {Icon ? <Icon size={size} strokeWidth={2} className={iconClassName} /> : children}
    </div>
  );
}
