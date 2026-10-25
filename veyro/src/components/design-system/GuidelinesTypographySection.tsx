import React from "react";
import { Type, Sparkles, BookOpen } from "lucide-react";

export function GuidelinesTypographySection() {
  const TYPE_LADDER = [
    {
      step: "text-6xl",
      remPx: "3.75rem (60px)",
      weightLeading: "font-black leading-[0.95] tracking-tight uppercase",
      role: "Hero campaign headlines, storefront display banners",
      sample: "ARCHITECTURAL UNIFORM",
      classes: "text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] text-neutral-950",
    },
    {
      step: "text-4xl",
      remPx: "2.25rem (36px)",
      weightLeading: "font-extrabold leading-tight tracking-tight uppercase",
      role: "Primary section headers, showcase collection titles",
      sample: "THE SIGNATURE VAULT",
      classes: "text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-950",
    },
    {
      step: "text-2xl",
      remPx: "1.5rem (24px)",
      weightLeading: "font-bold leading-snug tracking-tight uppercase",
      role: "Modal titles, major card headings, cart drawer title",
      sample: "SHOPPING BAG (3 ITEMS)",
      classes: "text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-950",
    },
    {
      step: "text-xl",
      remPx: "1.25rem (20px)",
      weightLeading: "font-bold leading-normal",
      role: "Product detail price display, order summary subtotal",
      sample: "₹2,499.00 INCL. TAX",
      classes: "text-lg sm:text-xl font-bold text-neutral-950 font-mono",
    },
    {
      step: "text-base",
      remPx: "1.0rem (16px)",
      weightLeading: "font-medium leading-relaxed",
      role: "Primary editorial body prose, catalog product titles",
      sample: "Engineered with 240+ GSM long-staple Indian combed cotton jersey.",
      classes: "text-base font-normal text-neutral-700 leading-relaxed",
    },
    {
      step: "text-sm",
      remPx: "0.875rem (14px)",
      weightLeading: "font-semibold uppercase tracking-wider",
      role: "Primary action buttons, form inputs, accordion triggers",
      sample: "ADD TO BAG • QUICK CHECKOUT",
      classes: "text-sm font-semibold uppercase tracking-wider text-neutral-900",
    },
    {
      step: "text-xs",
      remPx: "0.75rem (12px)",
      weightLeading: "font-medium uppercase tracking-wider",
      role: "Category filter tags, table headers, badge pills, footer links",
      sample: "HEAVYWEIGHT COTTON • SIZE 42 • IN STOCK",
      classes: "text-xs font-medium uppercase tracking-wider text-neutral-600",
    },
    {
      step: "text-2xs",
      remPx: "0.625rem (10px)",
      weightLeading: "font-mono font-bold uppercase tracking-widest",
      role: "Precision metadata, bracketed indices ([ 01 ]), timestamps, coupon codes",
      sample: "[ REF: VEYRO-2026-ARCHIVE ] • COUPON: VEYRO10",
      classes: "text-2xs font-mono font-bold uppercase tracking-widest text-neutral-500",
    },
  ];

  return (
    <section id="section-4" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 04 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            TYPOGRAPHIC SYSTEM
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          4. Fluid Typography Ladder
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          VEYRO standardizes on Next.js Google Fonts loaded in <code className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-xs text-neutral-900">src/app/layout.tsx</code> to power a disciplined geometric, monospace, and luxury cursive editorial hierarchy.
        </p>
      </div>

      {/* ── Typeface Declarations ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Geist Sans */}
        <div className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-900 font-bold uppercase tracking-widest">
              PRIMARY SANS
            </span>
            <span className="font-mono text-2xs text-neutral-500">font-sans</span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-black tracking-tight text-neutral-950">
              Geist Sans
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Geometric, neutral, and razor-sharp. Default typeface for all body copy, navigation, buttons, and headings across all 64 routes.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100 font-mono text-2xs text-neutral-500">
            Weights: 400 (Regular), 600 (Semibold), 800 (Extrabold), 900 (Black)
          </div>
        </div>

        {/* Geist Mono */}
        <div className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xs px-2.5 py-1 rounded-full bg-neutral-900 text-white font-bold uppercase tracking-widest">
              PRECISION MONO
            </span>
            <span className="font-mono text-2xs text-neutral-500">font-mono</span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-bold font-mono tracking-tight text-neutral-950">
              Geist Mono
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Architectural monospace for technical specifications, bracketed section tags (<code className="text-neutral-900 font-bold">[ 01 ]</code>), fabric weights, and promo codes.
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100 font-mono text-2xs text-neutral-500">
            Weights: 500 (Medium), 700 (Bold)
          </div>
        </div>

        {/* Dancing Script */}
        <div className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-2xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold uppercase tracking-widest">
              EDITORIAL SCRIPT
            </span>
            <span className="font-mono text-2xs text-neutral-500">font-script</span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl font-normal italic font-serif tracking-normal text-neutral-950">
              Dancing Script
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Reserved strictly for single-line lowercase cursive editorial accents positioned above brutalist headlines (e.g. &ldquo;clean slate&rdquo;, &ldquo;breeze easy&rdquo;).
            </p>
          </div>

          <div className="pt-3 border-t border-neutral-100 font-mono text-2xs text-neutral-500">
            Use Case: Editorial Kicker Accents Only
          </div>
        </div>
      </div>

      {/* ── Fluid Typography Specimen Ladder ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <Type size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              The Canonical Typography Ladder
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-500">
            Responsive Scale &bull; 8 Strict Tiers
          </span>
        </div>

        <div className="space-y-6 divide-y divide-neutral-100">
          {TYPE_LADDER.map((item) => (
            <div key={item.step} className="pt-6 first:pt-0 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-2xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-white font-bold">
                    {item.step}
                  </span>
                  <span className="text-neutral-900 font-semibold">{item.remPx}</span>
                </div>
                <span className="text-neutral-500">{item.role}</span>
              </div>

              <div className="py-2 overflow-x-auto">
                <div className={item.classes}>{item.sample}</div>
              </div>

              <div className="font-mono text-3xs text-neutral-400">
                Rule: {item.weightLeading}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
