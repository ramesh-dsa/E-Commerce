import React from "react";
import { Languages, Eye, Keyboard, Volume2, Smartphone, CheckCircle, ShieldCheck } from "lucide-react";

export function GuidelinesA11ySection() {
  const LANGUAGE_RULES = [
    {
      rule: "Rule 01: Wordmark Casing",
      badge: "STRICT BRAND LAW",
      doText: "Always write the brand name in full capital letters as VEYRO.",
      avoidText: "Never write 'Veyro' or 'veyro' in prose, button labels, or metadata tags.",
    },
    {
      rule: "Rule 02: Uppercase Navigation & Actions",
      badge: "TYPOGRAPHIC RHYTHM",
      doText: "Render all navigation links, buttons, status tags, and metadata badges in UPPERCASE with tracking-wider.",
      avoidText: "Do not use mixed sentence case for buttons or header category tags.",
    },
    {
      rule: "Rule 03: Editorial Cursive Constraint",
      badge: "LUXURY ACCENT ONLY",
      doText: "Use Dancing Script (.font-script) strictly for lowercase single-line cursive accents above architectural titles.",
      avoidText: "Never set entire paragraphs, buttons, or navigation items in cursive script.",
    },
    {
      rule: "Rule 04: Indian Rupee Price Format",
      badge: "CURRENCY STANDARD",
      doText: "Always precede prices with the official rupee glyph '₹' followed by comma separation (e.g. ₹2,499.00).",
      avoidText: "Never write 'Rs.', 'INR', or unformatted numbers without the currency glyph.",
    },
  ];

  const A11Y_CONTRACTS = [
    {
      contract: "Contract 01",
      title: "Keyboard Focus Rings",
      icon: Keyboard,
      desc: "Every interactive element (button, link, modal close, form input) must declare high-visibility focus indicators via focus-visible:ring-2 focus-visible:ring-neutral-950. Never suppress focus outlines without a replacement.",
      badge: "WCAG 2.4.7 (Focus Visible)",
    },
    {
      contract: "Contract 02",
      title: "Screen Reader Live Regions",
      icon: Volume2,
      desc: "Dynamic cart adjustments, toast notifications, and search count updates must declare role=\"status\" and aria-live=\"polite\" to announce changes to screen readers without stealing user focus.",
      badge: "WCAG 4.1.3 (Status Messages)",
    },
    {
      contract: "Contract 03",
      title: "44px Minimum Tap Targets",
      icon: Smartphone,
      desc: "All interactive controls on mobile viewports must meet or exceed a 44x44px touch envelope. Micro icon buttons must declare p-2.5 padding to prevent mis-taps on handheld touchscreens.",
      badge: "WCAG 2.5.5 (Target Size)",
    },
    {
      contract: "Contract 04",
      title: "100% WCAG Contrast Ratio",
      icon: Eye,
      desc: "All storefront copy meets or exceeds WCAG 2.1 Level AA contrast. VEYRO standard body copy on white achieves 18.88:1 (exceeding Level AAA requirement of 7.0:1). Secondary copy (#555555) achieves 7.46:1.",
      badge: "WCAG 1.4.3 (Contrast Minimum)",
    },
  ];

  return (
    <section id="section-11" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 11 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            GOVERNANCE &amp; ACCESSIBILITY
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          11. Language, Tone &amp; A11y Contracts
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          Accessibility is not optional at VEYRO. Every interactive control, modal, and dynamic state complies with WCAG 2.1 Level AA and adheres to strict editorial language discipline.
        </p>
      </div>

      {/* ── Editorial Language & Tone Rules ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Languages size={16} className="text-neutral-900" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
            Editorial Copy &amp; Typographic Conventions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LANGUAGE_RULES.map((r) => (
            <div
              key={r.rule}
              className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wide text-neutral-950">
                  {r.rule}
                </span>
                <span className="font-mono text-3xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-bold">
                  {r.badge}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-950">
                  <strong className="text-emerald-800">DO:</strong> {r.doText}
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200 text-rose-950">
                  <strong className="text-rose-800">AVOID:</strong> {r.avoidText}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── The 4 A11y Accessibility Contracts ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-neutral-900" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
            The Four Cardinal A11y Contracts
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {A11Y_CONTRACTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.contract}
                className="p-6 rounded-3xl border border-neutral-200 bg-neutral-50/50 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-900 text-white uppercase tracking-widest">
                      {item.contract}
                    </span>
                    <span className="font-mono text-3xs text-neutral-500 font-semibold">
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Icon size={18} className="text-neutral-950 shrink-0" />
                    <h4 className="font-bold text-sm uppercase tracking-tight text-neutral-950">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Interactive Focus Demo on Contract 01 */}
                {item.contract === "Contract 01" && (
                  <div className="pt-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:outline-none transition-colors"
                    >
                      Tab here to test keyboard focus ring
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Pre-Flight PR Checklist ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
          <CheckCircle size={16} className="text-emerald-700" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
            Accessibility Pre-Flight Quality Gate (Every PR Must Pass)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="font-bold text-neutral-950 block">1. Keyboard Nav</span>
            <p className="text-neutral-500 text-3xs">
              Every interactive element is reachable via Tab and activatable via Enter/Space.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="font-bold text-neutral-950 block">2. Screen Readers</span>
            <p className="text-neutral-500 text-3xs">
              All Next.js Image components have descriptive alt text; icon buttons have aria-label.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="font-bold text-neutral-950 block">3. Motion Redux</span>
            <p className="text-neutral-500 text-3xs">
              Continuous marquee tickers and 3D transforms respect prefers-reduced-motion.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
            <span className="font-bold text-neutral-950 block">4. Tap Targets</span>
            <p className="text-neutral-500 text-3xs">
              Mobile touch controls provide minimum 44x44px touch envelopes with p-2.5 padding.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
