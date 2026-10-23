import React from "react";
import type { LucideIcon } from "lucide-react";
import { RotateCcw } from "lucide-react";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = RotateCcw,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`py-16 px-4 text-center flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[var(--admin-surface-2)] border border-white/5 flex items-center justify-center text-[var(--admin-text-muted)] mb-1">
        <Icon size={22} strokeWidth={1.75} />
      </div>
      <h3 className="text-sm font-bold text-white font-heading">{title}</h3>
      {description && (
        <p className="text-xs text-[var(--admin-text-muted)] max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 px-4 py-2 rounded-full bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/10 text-white text-xs font-semibold transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
