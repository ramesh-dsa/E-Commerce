"use client";

import React from "react";

interface GuidanceItem {
  num: string;
  title: string;
  description: string;
}

const GUIDANCE_ITEMS: GuidanceItem[] = [
  {
    num: "01",
    title: "Color consolidation",
    description:
      "Hardcoded brand hexes migrate to @theme tokens (--color-veyro-*), competing gray families collapse into neutral, and one-off hex literals are retired across components. The largest share of inconsistency at the lowest risk.",
  },
  {
    num: "02",
    title: "A shared Button primitive",
    description:
      "Action recipes are extracted and unified into ui/Button.tsx with variant props (primary gold, secondary ink, outline), protecting every future rebrand tweak and standardizing hover and loading states.",
  },
  {
    num: "03",
    title: "Section rhythm and containers",
    description:
      "Arbitrary padding stacks and competing max-widths converge onto the canonical container tiers (Wide 1440px, Standard 7xl, Reading 3xl, Form md) with predictable py-16 / py-20 vertical section rhythm.",
  },
  {
    num: "04",
    title: "Scale leaks",
    description:
      "Legacy radii, arbitrary font sizes (e.g. text-[11px]), blanket transition-all, and off-ladder z-index values migrate to the defined system vocabularies (rounded-2xl cards, standard text scale, and 7-tier z-index).",
  },
  {
    num: "05",
    title: "GPU motion & surface parity",
    description:
      "Layout-reflow transitions (height, width) migrate to hardware-accelerated transform and opacity. Storefront product cards and bento surfaces standardize on rounded-2xl geometry with subtle border definitions.",
  },
  {
    num: "06",
    title: "Accessible focus & motion safety",
    description:
      "Universal 2px focus rings (focus-visible:ring-veyro-yellow) are enforced across all interactive targets, paired with strict motion-reduce fallbacks for all continuous springs and transitions.",
  },
];

export default function TransitionGuidanceSpecimen() {
  return (
    <div className="flex flex-col gap-3.5 sm:gap-4">
      {GUIDANCE_ITEMS.map((item) => (
        <div
          key={item.num}
          className="group border border-neutral-200/90 rounded-2xl bg-white p-5 sm:p-6 shadow-2xs hover:border-neutral-300 hover:shadow-xs transition-all duration-200 flex items-start gap-5 sm:gap-6"
        >
          {/* Soft Pastel Number */}
          <span className="text-2xl sm:text-3xl font-bold font-mono text-[#d8b4e2] shrink-0 select-none tracking-tight pt-0.5">
            {item.num}
          </span>

          {/* Content */}
          <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
              {item.title}
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
