import React from "react";
import { LayoutGrid, Maximize, Smartphone, Monitor } from "lucide-react";

export function GuidelinesLayoutSection() {
  const CONTAINERS = [
    {
      tier: "Tier 1",
      token: "max-w-screen-2xl",
      px: "1536px",
      widthPercent: "100%",
      use: "Primary catalog product grids, hero sliding panels, full-width showcase workflows.",
      sampleFiles: "ClothingCatalog.tsx, ShoesCatalog.tsx, Hero.tsx",
    },
    {
      tier: "Tier 2",
      token: "max-w-7xl",
      px: "1280px",
      widthPercent: "83%",
      use: "Canonical content container: promotional flip banners, checkout workflows, global footer.",
      sampleFiles: "TshirtPromoBanner.tsx, checkout/page.tsx, Footer.tsx",
    },
    {
      tier: "Tier 3",
      token: "max-w-3xl",
      px: "768px",
      widthPercent: "50%",
      use: "Optimal ergonomic reading column (65–75 chars/line): FAQs, return policies, order receipts.",
      sampleFiles: "faq/page.tsx, orders/[id]/page.tsx",
    },
    {
      tier: "Tier 4",
      token: "max-w-md",
      px: "448px",
      widthPercent: "30%",
      use: "Centered dialog overlays, auth modals, toast notifications, order cancellation sheets.",
      sampleFiles: "AccountModal.tsx, CancelOrderModal.tsx, Toast.tsx",
    },
    {
      tier: "Tier 5",
      token: "max-w-xs",
      px: "320px",
      widthPercent: "20%",
      use: "Micro popovers, account dropdowns, filter menus, size selector trays.",
      sampleFiles: "ProductSearch.tsx, Navbar.tsx",
    },
  ];

  const SPACING_SCALE = [
    { token: "gap-1 / p-1", px: "4px (0.25rem)", barWidth: "w-2", use: "Tight icon and counter pairings, micro badges" },
    { token: "gap-2 / p-2", px: "8px (0.5rem)", barWidth: "w-4", use: "Button internal icon gaps, chip clusters, table cells" },
    { token: "gap-3 / p-3", px: "12px (0.75rem)", barWidth: "w-6", use: "Form field pairings, small card padding" },
    { token: "gap-4 / p-4", px: "16px (1.0rem)", barWidth: "w-8", use: "Mobile grid gutters, card padding, standard gutters" },
    { token: "gap-6 / p-6", px: "24px (1.5rem)", barWidth: "w-12", use: "Tablet grid gutters, desktop card padding, dialogs" },
    { token: "gap-8 / p-8", px: "32px (2.0rem)", barWidth: "w-16", use: "Desktop catalog product grid gaps, section margins" },
  ];

  return (
    <section id="section-5" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 05 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            LAYOUT &amp; METRICS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          5. Layout &amp; Spacing Architecture
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          VEYRO standardizes on an architectural 5-tier container hierarchy and an 8px spatial grid rhythm. Arbitrary bracket widths (<code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded text-xs">max-w-[...px]</code>) are eliminated in favor of canonical Tailwind scale constraints.
        </p>
      </div>

      {/* ── The 5-Tier Container System ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <LayoutGrid size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              The 5-Tier Container System
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-500">
            Zero Ad-Hoc Bracketed Widths
          </span>
        </div>

        {/* Visual Nested Bars */}
        <div className="space-y-4">
          {CONTAINERS.map((c) => (
            <div key={c.token} className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between text-2xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-950">{c.tier}:</span>
                  <code className="bg-neutral-900 text-white px-2 py-0.5 rounded text-3xs font-bold">
                    {c.token}
                  </code>
                  <span className="text-neutral-500">({c.px})</span>
                </div>
                <span className="text-neutral-400 text-3xs">{c.sampleFiles}</span>
              </div>

              {/* Proportional Bar */}
              <div className="w-full bg-neutral-100 rounded-lg h-3 overflow-hidden">
                <div
                  className="bg-neutral-900 h-full rounded-lg transition-all"
                  style={{ width: c.widthPercent }}
                />
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed pt-0.5">
                {c.use}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4px/8px Spacing Rhythm Visualizer ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <Maximize size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              8px Spatial Rhythm &amp; Gap Tokens
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-500">
            Standard Base Unit: 4px / 8px
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPACING_SCALE.map((s) => (
            <div
              key={s.token}
              className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-neutral-950">
                  {s.token}
                </span>
                <span className="font-mono text-2xs text-neutral-500">
                  {s.px}
                </span>
              </div>

              {/* Visual Gap Indicator */}
              <div className="h-6 bg-white border border-neutral-200 rounded-lg flex items-center px-2">
                <div className={`h-3 bg-veyro-yellow rounded-sm ${s.barWidth}`} />
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {s.use}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Responsive Breakpoints ── */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
          Standard Tailwind Breakpoint System
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-2xs">
          {[
            { bp: "sm", min: "640px", note: "Large mobile / tablet" },
            { bp: "md", min: "768px", note: "Tablet portrait" },
            { bp: "lg", min: "1024px", note: "Desktop default" },
            { bp: "xl", min: "1280px", note: "Wide desktop" },
            { bp: "2xl", min: "1536px", note: "Max canvas workspace" },
          ].map((item) => (
            <div
              key={item.bp}
              className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-1"
            >
              <span className="block text-sm font-bold text-neutral-950 uppercase">
                {item.bp}
              </span>
              <span className="block text-neutral-500 font-semibold">
                min-width: {item.min}
              </span>
              <span className="block text-3xs text-neutral-400">
                {item.note}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
