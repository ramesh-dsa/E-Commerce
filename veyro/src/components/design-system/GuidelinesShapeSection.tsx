import React from "react";
import { Box, Layers, ShieldCheck } from "lucide-react";

export function GuidelinesShapeSection() {
  const RADII_LADDER = [
    {
      token: "rounded-none",
      px: "0px",
      use: "Brutalist divider lines, announcement marquee border, full-bleed hero edges",
      classSample: "rounded-none",
    },
    {
      token: "rounded-sm",
      px: "4px (0.25rem)",
      use: "Micro skeleton loaders, inline code blocks, star rating counter pills",
      classSample: "rounded-sm",
    },
    {
      token: "rounded-md",
      px: "6px (0.375rem)",
      use: "Form inputs, table cells, coupon input wrappers, secondary controls",
      classSample: "rounded-md",
    },
    {
      token: "rounded-lg",
      px: "8px (0.5rem)",
      use: "Canonical primary action buttons (AddToCart, Checkout CTA, dialog buttons)",
      classSample: "rounded-lg",
    },
    {
      token: "rounded-xl",
      px: "12px (0.75rem)",
      use: "Product cards in catalog grids, drawer content modules, address card containers",
      classSample: "rounded-xl",
    },
    {
      token: "rounded-2xl",
      px: "16px (1.0rem)",
      use: "Feature highlight cards, order tracking timeline sheets, search drawer",
      classSample: "rounded-2xl",
    },
    {
      token: "rounded-3xl",
      px: "24px (1.5rem)",
      use: "Signature showcase dark cards (The Living Source, AccountModal)",
      classSample: "rounded-3xl",
    },
    {
      token: "rounded-full",
      px: "9999px",
      use: "Stadium action pills, status badges, circular icon buttons, floating counter tags",
      classSample: "rounded-full",
    },
  ];

  const SHADOW_TIERS = [
    {
      tier: "Micro Lift",
      token: "shadow-xs",
      use: "Subtle product card elevation on light backgrounds, small tags",
      shadowClass: "shadow-xs",
    },
    {
      tier: "Low Elevation",
      token: "shadow-sm",
      use: "Dropdown popovers, size selectors, address selection radio boxes",
      shadowClass: "shadow-sm",
    },
    {
      tier: "Medium Elevation",
      token: "shadow-md",
      use: "Hovered action buttons, floating catalog filter bar, active wishlist items",
      shadowClass: "shadow-md",
    },
    {
      tier: "High Elevation",
      token: "shadow-xl",
      use: "Cart slide-over drawer, mobile navigation tray, quick search modal",
      shadowClass: "shadow-xl",
    },
    {
      tier: "Hero Depth",
      token: "shadow-2xl",
      use: "The Living Source signature dark card, member login architectural dialog",
      shadowClass: "shadow-2xl",
    },
  ];

  return (
    <section id="section-6" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 06 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            GEOMETRY &amp; ELEVATION
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          6. Shape, Radii &amp; Elevation
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          All interactive components, cards, and micro-controls conform to the canonical 8-tier border radius ladder. Arbitrary bracket radii (<code className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-xs text-neutral-900">rounded-[...px]</code>) have been migrated to official Tailwind scales.
        </p>
      </div>

      {/* ── Canonical Border Radii Ladder ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <Box size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              The Canonical Border Radii Ladder
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-500">
            8 Official Tiers &bull; Standard Scale
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RADII_LADDER.map((r) => (
            <div
              key={r.token}
              className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between"
            >
              {/* Visual Shape Box */}
              <div className="h-20 w-full bg-white border-2 border-neutral-900 flex items-center justify-center p-2 shadow-2xs">
                <div
                  className={`w-full h-full bg-neutral-900 flex items-center justify-center text-veyro-yellow font-mono text-3xs font-bold ${r.classSample}`}
                >
                  {r.px}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-neutral-950">
                    {r.token}
                  </span>
                  <span className="font-mono text-3xs text-neutral-500">
                    {r.px}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {r.use}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Shadow & Elevation Tier Showcase ── */}
      <div className="rounded-3xl border border-neutral-200 bg-neutral-50/70 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              Elevation &amp; Shadow Depth Tiers
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-500">
            Hardware Accelerated Layers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SHADOW_TIERS.map((s) => (
            <div
              key={s.token}
              className={`p-5 rounded-2xl bg-white border border-neutral-200/80 ${s.shadowClass} flex flex-col justify-between gap-3`}
            >
              <div>
                <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                  {s.tier}
                </span>
                <span className="font-mono text-xs font-bold text-neutral-950 block">
                  {s.token}
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {s.use}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
