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
      className={`flex flex-col rounded-lg ${isFeatured ? "col-span-2 md:row-span-2" : ""} ${className}`}
    >
      {/* Product Image Container */}
      <div
        className={`relative w-full overflow-hidden rounded-lg ${
          isDark
            ? "bg-[#121212] border border-white/[0.08]"
            : "bg-[#f4f2ee]"
        } ${
          isFeatured
            ? "aspect-[3/4] lg:h-full lg:aspect-auto"
            : aspectRatio
        }`}
      >
        <div
          className={`w-full h-full relative overflow-hidden ${
            isDark ? "bg-[#1a1a1a]" : "bg-veyro-surface"
          }`}
        >
          <div
            className={`absolute inset-0 -translate-x-full animate-skeleton-shimmer ${
              isDark
                ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                : "bg-gradient-to-r from-transparent via-white/60 to-transparent"
            } motion-reduce:animate-none`}
          />
        </div>
      </div>

      {/* Product Details Lines */}
      <div className="pt-2.5 pb-1 flex flex-col flex-1">
        {/* Category tag */}
        <div className="flex items-center justify-between">
          <div
            className={`w-16 h-2.5 rounded-full ${
              isDark ? "bg-white/10" : "bg-veyro-border"
            } relative overflow-hidden`}
          >
            <div
              className={`absolute inset-0 -translate-x-full animate-skeleton-shimmer ${
                isDark
                  ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  : "bg-gradient-to-r from-transparent via-white/60 to-transparent"
              } motion-reduce:animate-none`}
            />
          </div>
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isDark ? "bg-white/10" : "bg-veyro-border"
            }`}
          />
        </div>

        {/* Product Name */}
        <div
          className={`w-3/4 h-3.5 rounded-full mt-2 ${
            isDark ? "bg-white/15" : "bg-veyro-border"
          } relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 -translate-x-full animate-skeleton-shimmer ${
              isDark
                ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                : "bg-gradient-to-r from-transparent via-white/60 to-transparent"
            } motion-reduce:animate-none`}
          />
        </div>

        {/* Price Row */}
        <div
          className={`w-20 h-3 rounded-full mt-2 ${
            isDark ? "bg-white/10" : "bg-veyro-border"
          } relative overflow-hidden`}
        >
          <div
            className={`absolute inset-0 -translate-x-full animate-skeleton-shimmer ${
              isDark
                ? "bg-gradient-to-r from-transparent via-white/10 to-transparent"
                : "bg-gradient-to-r from-transparent via-white/60 to-transparent"
            } motion-reduce:animate-none`}
          />
        </div>
      </div>
    </article>
  );
}
