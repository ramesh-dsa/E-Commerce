import React from "react";

export type StatusBadgeVariant =
  | "neutral"
  | "warning"
  | "success"
  | "danger"
  | "info"
  | "primary";

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusBadgeVariant;
  dot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<StatusBadgeVariant, { pill: string; dot: string }> = {
  neutral: {
    pill: "bg-[var(--admin-surface-2)] text-[var(--admin-text-muted)] border-white/10",
    dot: "bg-[var(--admin-text-muted)]",
  },
  warning: {
    pill: "bg-[var(--admin-warning)]/15 text-[var(--admin-warning)] border-[var(--admin-warning)]/20",
    dot: "bg-[var(--admin-warning)]",
  },
  success: {
    pill: "bg-[var(--admin-success)]/15 text-[var(--admin-success)] border-[var(--admin-success)]/20",
    dot: "bg-[var(--admin-success)]",
  },
  danger: {
    pill: "bg-[var(--admin-danger)]/15 text-[var(--admin-danger)] border-[var(--admin-danger)]/20",
    dot: "bg-[var(--admin-danger)]",
  },
  info: {
    pill: "bg-[var(--admin-info)]/15 text-[var(--admin-info)] border-[var(--admin-info)]/20",
    dot: "bg-[var(--admin-info)]",
  },
  primary: {
    pill: "bg-[var(--admin-primary)]/15 text-[var(--admin-primary)] border-[var(--admin-primary)]/20",
    dot: "bg-[var(--admin-primary)]",
  },
};

export function StatusBadge({
  variant = "neutral",
  dot = false,
  icon,
  children,
  className = "",
  ...rest
}: StatusBadgeProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${styles.pill} ${className}`}
      {...rest}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      {children}
    </span>
  );
}
