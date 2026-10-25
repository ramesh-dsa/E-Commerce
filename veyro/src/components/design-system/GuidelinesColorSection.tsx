"use client";

import React, { useState } from "react";
import { Check, Copy, Palette, Sparkles, ShieldCheck } from "lucide-react";

export function GuidelinesColorSection() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const BRAND_TOKENS = [
    {
      name: "veyro-black",
      hex: "#111111",
      oklab: "oklab(0.18 0 0)",
      role: "Primary architectural ink, high-contrast headings, dark stages, button actions.",
      contrastOnWhite: "18.88:1",
      ratingOnWhite: "AAA",
      bgClass: "bg-veyro-black text-white",
      isDark: true,
    },
    {
      name: "veyro-yellow",
      hex: "#FCD017",
      oklab: "oklab(0.85 0.02 0.16)",
      role: "Signature volt gold accent, announcement marquee, 3px navbar line, star ratings.",
      contrastOnBlack: "12.74:1",
      ratingOnBlack: "AAA",
      bgClass: "bg-veyro-yellow text-veyro-black",
      isDark: false,
    },
    {
      name: "veyro-white",
      hex: "#FFFFFF",
      oklab: "oklab(1.0 0 0)",
      role: "Pure white canvas, default body surface, product catalog container background.",
      contrastOnBlack: "18.88:1",
      ratingOnBlack: "AAA",
      bgClass: "bg-white text-neutral-900 border border-neutral-200",
      isDark: false,
    },
  ];

  const NEUTRAL_RAMP = [
    { token: "neutral-50", hex: "#FAFAFA", usage: "Utility workflow canvas (/cart, /checkout, /orders)" },
    { token: "neutral-100", hex: "#F5F5F5", usage: "Pill button hover backgrounds, subtle chips" },
    { token: "neutral-200", hex: "#E5E5E5", usage: "Canonical hairline dividers & subtle card borders" },
    { token: "neutral-300", hex: "#D4D4D4", usage: "Hover borders, secondary divider lines" },
    { token: "neutral-400", hex: "#A3A3A3", usage: "Placeholder text, inactive icons" },
    { token: "neutral-500", hex: "#737373", usage: "Tertiary captions, timestamps, section subtitles" },
    { token: "neutral-600", hex: "#525252", usage: "Secondary body text, editorial subheadings" },
    { token: "neutral-700", hex: "#404040", usage: "Prominent secondary copy on light canvas" },
    { token: "neutral-800", hex: "#262626", usage: "Hover states for primary black buttons" },
    { token: "neutral-900", hex: "#171717", usage: "Deep gray headings, elevated dark cards" },
    { token: "neutral-950", hex: "#0A0A0A", usage: "Global footer canvas, The Living Source card" },
  ];

  const SEMANTIC_TOKENS = [
    {
      role: "Success",
      token: "emerald-600",
      hex: "#059669",
      whiteContrast: "4.52:1 (AA)",
      use: "Free delivery unlocked, completed order timeline.",
      bg: "bg-emerald-600",
    },
    {
      role: "Warning",
      token: "amber-500",
      hex: "#F59E0B",
      whiteContrast: "2.15:1 (Fail - use with dark text)",
      use: "Low inventory alerts ('Only 2 items left in archive').",
      bg: "bg-amber-500",
    },
    {
      role: "Error",
      token: "rose-600",
      hex: "#E11D48",
      whiteContrast: "4.61:1 (AA)",
      use: "Checkout form validation failures, out of stock notices.",
      bg: "bg-rose-600",
    },
    {
      role: "Accent (Terracotta)",
      token: "veyro-accent",
      hex: "#D9532F",
      whiteContrast: "4.58:1 (AA)",
      use: "Sale promo countdown tags, limited archive flags.",
      bg: "bg-[#D9532F]",
    },
  ];

  return (
    <section id="section-3" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 03 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            CHROMATIC FOUNDATION
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          3. Color &amp; OKLAB Ramp
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          The VEYRO palette is built upon high-contrast brutalist neutrals, pure white canvas, dark architectural stages, and a signature volt gold accent. Calculated and audited strictly according to WCAG 2.1 contrast ratios and perceptual OKLAB lightness.
        </p>
      </div>

      {/* ── 3 Signature Brand Tokens ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
            Signature Brand Tokens
          </h3>
          <span className="font-mono text-2xs text-neutral-500">
            Click any card to copy HEX
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BRAND_TOKENS.map((token) => (
            <div
              key={token.name}
              onClick={() => copyToClipboard(token.hex)}
              className="rounded-3xl border border-neutral-200 bg-white shadow-2xs hover:shadow-md transition-shadow cursor-pointer overflow-hidden group flex flex-col justify-between"
            >
              {/* Color Block */}
              <div
                className={`h-36 p-6 flex flex-col justify-between ${token.bgClass} relative overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-wider">
                    {token.hex}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-3xs font-bold px-2 py-0.5 rounded-full ${
                      token.isDark ? "bg-white/20 text-white" : "bg-black/10 text-neutral-900"
                    }`}
                  >
                    {copiedHex === token.hex ? (
                      <>
                        <Check size={10} /> COPIED!
                      </>
                    ) : (
                      <>
                        <Copy size={10} /> COPY
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-end justify-between">
                  <span className="font-extrabold text-lg uppercase tracking-tight">
                    {token.name}
                  </span>
                  <span className="font-mono text-2xs opacity-80">
                    {token.oklab}
                  </span>
                </div>
              </div>

              {/* Spec Details */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {token.role}
                </p>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between font-mono text-2xs">
                  <span className="text-neutral-500">
                    Contrast: {token.contrastOnWhite ? `${token.contrastOnWhite} on White` : `${token.contrastOnBlack} on Black`}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                    WCAG AAA
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Neutral Ramp Strip (50 → 950) ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              The Standard Neutral Ramp (50 → 950)
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-500">
            Tailwind v4 Canonical Scale
          </span>
        </div>

        {/* Continuous Horizontal Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-11 gap-2">
          {NEUTRAL_RAMP.map((step) => (
            <button
              key={step.token}
              type="button"
              onClick={() => copyToClipboard(step.hex)}
              className="group text-left p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-900 transition-colors flex flex-col justify-between gap-2 bg-neutral-50/50"
            >
              <div
                className="w-full h-12 rounded-lg border border-black/5 shadow-inner"
                style={{ backgroundColor: step.hex }}
              />
              <div>
                <span className="font-mono text-3xs font-bold text-neutral-900 block truncate">
                  {step.token}
                </span>
                <span className="font-mono text-3xs text-neutral-500 block">
                  {step.hex}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed pt-2">
          Use neutral tokens for structured borders (<code className="font-mono text-neutral-900">neutral-200</code>), subtle table stripes (<code className="font-mono text-neutral-900">neutral-50</code>), secondary body copy (<code className="font-mono text-neutral-900">neutral-600</code>), and dark surfaces (<code className="font-mono text-neutral-900">neutral-950</code>).
        </p>
      </div>

      {/* ── Semantic & Status Accents ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
          Semantic &amp; Status Accents
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SEMANTIC_TOKENS.map((item) => (
            <div
              key={item.role}
              onClick={() => copyToClipboard(item.hex)}
              className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-2xs hover:border-neutral-400 transition-colors cursor-pointer space-y-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-lg ${item.bg} shadow-inner shrink-0`}
                />
                <div>
                  <span className="font-bold text-xs uppercase tracking-wide text-neutral-950 block">
                    {item.role}
                  </span>
                  <span className="font-mono text-2xs text-neutral-500">
                    {item.token} • {item.hex}
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {item.use}
              </p>
              <div className="pt-2 border-t border-neutral-100 font-mono text-3xs text-neutral-500">
                Contrast on White: {item.whiteContrast}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
