import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  shimmer?: boolean;
}

export function Skeleton({
  className = "",
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-veyro-surface rounded-sm ${className}`}
      {...props}
    >
      {shimmer && (
        <div
          className="absolute inset-0 -translate-x-full animate-skeleton-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent motion-reduce:animate-none pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
