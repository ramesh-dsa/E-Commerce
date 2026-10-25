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
      className={`relative overflow-hidden bg-neutral-200/85 dark:bg-neutral-800 rounded-md ${className}`}
      {...props}
    >
      {shimmer && (
        <div
          className="absolute inset-0 -translate-x-full animate-skeleton-shimmer skeleton-shimmer-sweep dark:skeleton-shimmer-sweep-dark motion-reduce:animate-none pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
