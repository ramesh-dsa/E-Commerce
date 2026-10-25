"use client";

import React from "react";

interface VeyroGuidanceItem {
  num: string;
  title: string;
  fileTag: string;
  description: string;
}

const VEYRO_GUIDANCE_ITEMS: VeyroGuidanceItem[] = [
  {
    num: "01",
    title: "Brand design token consolidation",
    fileTag: "src/app/globals.css",
    description:
      "Legacy hex literals (#111111 dark ink, #fcd017 brand gold, #f8f8f6 surface) migrate to Tailwind v4 @theme tokens (veyro-black, veyro-yellow, veyro-surface, veyro-border). Global shell components (Navbar, Footer, CartDrawer) are already 100% unified.",
  },
  {
    num: "02",
    title: "Shared action & badge primitives",
    fileTag: "src/components/ui/Button.tsx",
    description:
      "Divergent raw <button> tags across product catalog pages consolidate onto ui/Button.tsx (Primary Gold CTA, Secondary Ink, Ghost/Outline) and ui/Badge.tsx, ensuring universal keyboard focus rings and active states.",
  },
  {
    num: "03",
    title: "Product card & bento surface standard",
    fileTag: "src/components/features/ProductCard.tsx",
    description:
      "Clothing, footwear, and watch catalog cards strictly adhere to rounded-2xl geometry, bg-veyro-surface image viewports, liquid wishlist spring animations, and standardized INR currency formatting.",
  },
  {
    num: "04",
    title: "10-Tier Z-Index ladder governance",
    fileTag: "src/app/design-guidelines/ZIndexSpecimen.tsx",
    description:
      "All 185 stacking contexts across the storefront align to the verified 10-tier scale — from z-0 canvas, z-40 Navbar, z-50 CartDrawer, z-[70] Toasts, up to z-[150] Fullscreen Lightbox — preventing stacking leaks.",
  },
  {
    num: "05",
    title: "Hardware-accelerated GPU motion",
    fileTag: "src/components/ui/SpotlightBentoCard.tsx",
    description:
      "Continuous interactive motion is restricted strictly to transform and opacity with motion/react and transform-gpu. Geometry-animating transitions (width, height, top) are replaced to guarantee smooth 60fps renders on mobile.",
  },
  {
    num: "06",
    title: "Storefront typography ramp alignment",
    fileTag: "src/app/layout.tsx",
    description:
      "Arbitrary text-[11px] and text-[13px] pixel overrides consolidate onto canonical Tailwind scale tokens (text-xs through text-6xl), harmonized across the verified storefront fonts: Geist Sans, Montserrat, and Outfit.",
  },
];

export default function TransitionGuidanceSpecimen() {
  return (
    <div className="flex flex-col gap-3.5 sm:gap-4">
      {VEYRO_GUIDANCE_ITEMS.map((item) => (
        <div
          key={item.num}
          className="group border border-neutral-200/90 rounded-2xl bg-white p-5 sm:p-6 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all duration-200 flex items-start gap-4 sm:gap-6"
        >
          {/* VEYRO Mono Number */}
          <span className="text-2xl sm:text-3xl font-mono font-black text-neutral-300 group-hover:text-veyro-black transition-colors shrink-0 select-none tracking-tight pt-0.5">
            {item.num}
          </span>

          {/* Card Body */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                {item.title}
              </h4>
              <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500 bg-neutral-100/90 px-2.5 py-0.5 rounded-full border border-neutral-200/60 shrink-0">
                {item.fileTag}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
