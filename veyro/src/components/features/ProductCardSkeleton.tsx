import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

interface ProductCardSkeletonProps {
  isFeatured?: boolean;
  className?: string;
  theme?: "light" | "dark";
  aspectRatio?: string;
}

export function ProductCardSkeleton({
  isFeatured = false,
  className = "",
  theme = "light",
  aspectRatio = "aspect-[3/4]",
}: ProductCardSkeletonProps) {
  const isDark = theme === "dark";

  return (
    <article
      aria-hidden="true"
      className={`flex flex-col rounded-2xl ${isFeatured ? "col-span-2 md:row-span-2" : ""} ${className}`}
    >
      {/* Product Image Container */}
      <div
        className={`relative w-full overflow-hidden rounded-2xl ${
          isDark
            ? "bg-neutral-800 border border-white/[0.08]"
            : "bg-neutral-200/90 border border-neutral-300/40"
        } ${
          isFeatured
            ? "aspect-[3/4] lg:h-full lg:aspect-auto"
            : aspectRatio
        }`}
      >
        <div
          className={`w-full h-full relative overflow-hidden ${
            isDark ? "bg-neutral-900" : "bg-neutral-200/90"
          }`}
        >
          <div
            className={`absolute inset-0 animate-skeleton-shimmer ${
              isDark ? "skeleton-shimmer-sweep-dark" : "skeleton-shimmer-sweep"
            } motion-reduce:animate-none pointer-events-none`}
          />
        </div>
      </div>

      {/* Product Details Lines */}
      <div className="pt-2.5 pb-1 flex flex-col flex-1">
        {/* Category tag */}
        <div className="flex items-center justify-between">
          <div
            className={`w-16 h-2.5 rounded-full ${
              isDark ? "bg-white/10" : "bg-neutral-300/80"
            } relative overflow-hidden`}
          >
            <div
              className={`absolute inset-0 animate-skeleton-shimmer ${
                isDark ? "skeleton-shimmer-sweep-dark" : "skeleton-shimmer-sweep"
              } motion-reduce:animate-none pointer-events-none`}
            />
          </div>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isDark ? "bg-white/10" : "bg-neutral-300/80"
            }`}
          />
        </div>

        {/* Product Name */}
        <div
          className={`w-3/4 h-3.5 rounded-full mt-2 ${
            isDark ? "bg-white/15" : "bg-neutral-300/90"
          } relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 animate-skeleton-shimmer ${
              isDark ? "skeleton-shimmer-sweep-dark" : "skeleton-shimmer-sweep"
            } motion-reduce:animate-none pointer-events-none`}
          />
        </div>

        {/* Price Row */}
        <div
          className={`w-20 h-3 rounded-full mt-2 ${
            isDark ? "bg-white/10" : "bg-neutral-300/70"
          } relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 animate-skeleton-shimmer ${
              isDark ? "skeleton-shimmer-sweep-dark" : "skeleton-shimmer-sweep"
            } motion-reduce:animate-none pointer-events-none`}
          />
        </div>
      </div>
    </article>
  );
}
