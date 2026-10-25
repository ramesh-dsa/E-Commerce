import React from "react";
import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="pt-4 pb-20" aria-hidden="true">
      <Container>
        {/* Back Navigation Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6 py-2">
          <Skeleton className="w-32 h-3.5 rounded-full" />
        </div>

        {/* Main Product Showcase Grid: Left Gallery (7 cols), Right Buy-Box (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            {/* Desktop Vertical Thumbnail Rail */}
            <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-20 h-26 rounded-lg bg-veyro-surface-alt border border-veyro-border/60 shrink-0"
                />
              ))}
            </div>

            {/* Main Studio Frame Stage */}
            <div className="flex-1 flex flex-col gap-3">
              <Skeleton className="w-full aspect-[3/4] rounded-lg bg-veyro-surface-alt border border-veyro-border" />

              {/* Mobile Thumbnail Strip */}
              <div className="flex md:hidden gap-2 overflow-hidden pt-1">
                {[...Array(4)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-16 h-20 rounded-md shrink-0 bg-veyro-surface-alt border border-veyro-border/60"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Buy-Box */}
          <div className="lg:col-span-5 flex flex-col">
            {/* 1. Category Subheading Tag */}
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="w-24 h-3.5 rounded-full" />
            </div>

            {/* 2. Architectural Title */}
            <Skeleton className="w-5/6 h-9 sm:h-11 rounded-lg mb-2.5" />

            {/* 2b. Rating Bar */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="w-24 h-3.5 rounded-full" />
              <div className="w-1 h-1 rounded-full bg-neutral-300" />
              <Skeleton className="w-28 h-3.5 rounded-full" />
            </div>

            {/* 3. Price Hierarchy */}
            <div className="flex items-baseline gap-3.5 mb-2">
              <Skeleton className="w-20 h-5 rounded-full" />
              <Skeleton className="w-32 h-9 rounded-lg" />
              <Skeleton className="w-16 h-5 rounded-xs" />
            </div>
            <Skeleton className="w-64 h-3 rounded-full mb-6" />

            {/* 4. Bundle Pass Banner placeholder */}
            <Skeleton className="w-full h-14 rounded-2xl mb-6 bg-gradient-to-r from-amber-100/60 to-yellow-100/60" />

            {/* 5. Size Selection Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <Skeleton className="w-20 h-3.5 rounded-full" />
                <Skeleton className="w-28 h-3.5 rounded-full" />
              </div>

              {/* Pill Size Grid */}
              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {[...Array(5)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-16 sm:w-18 h-11 rounded-full border border-neutral-200"
                  />
                ))}
              </div>

              {/* Editorial Fit Description */}
              <Skeleton className="w-3/4 h-3 rounded-full mt-3.5" />
            </div>

            {/* 6. Purchase Action Bar */}
            <div className="flex gap-2.5 items-center mb-6">
              {/* Stepper */}
              <Skeleton className="w-24 h-12 rounded-full shrink-0" />
              {/* Primary Add to Bag CTA */}
              <Skeleton className="flex-1 h-12 rounded-2xl" />
              {/* Wishlist Circle Button */}
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            </div>

            {/* 7. Value Pillars & Assurances */}
            <div className="pt-6 border-t border-neutral-100 space-y-3">
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                <Skeleton className="w-3/4 h-3.5 rounded-full" />
              </div>
              <div className="flex items-center gap-2.5">
                <Skeleton className="w-4 h-4 rounded-full shrink-0" />
                <Skeleton className="w-2/3 h-3.5 rounded-full" />
              </div>
            </div>

            {/* 8. Editorial Accordion Mock */}
            <div className="mt-8 pt-6 border-t border-neutral-100 space-y-4">
              <div className="flex justify-between items-center py-2">
                <Skeleton className="w-36 h-4 rounded-full" />
                <Skeleton className="w-4 h-4 rounded-full" />
              </div>
              <Skeleton className="w-full h-3 rounded-full" />
              <Skeleton className="w-4/5 h-3 rounded-full" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
