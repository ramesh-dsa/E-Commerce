"use client";

import React, { useState } from "react";
import { Archivo, Inter } from "next/font/google";
import { Type, Sparkles, Copy, Check } from "lucide-react";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const TYPE_SCALE_ITEMS = [
  {
    tier: "Display / Hero",
    token: "text-4xl sm:text-5xl",
    size: "40px / 48px",
    font: "Archivo Bold (700)",
    tracking: "tracking-tight uppercase",
    style: { fontFamily: archivo.style.fontFamily },
    sampleText: "OVERSIZED ARCHITECTURAL SILHOUETTE",
    usage: "Collection banners, hero statements, and lookbook headlines",
  },
  {
    tier: "H1 Page Title",
    token: "text-3xl",
    size: "30px / 36px",
    font: "Archivo Bold (700)",
    tracking: "tracking-tight uppercase",
    style: { fontFamily: archivo.style.fontFamily },
    sampleText: "BRAND & DESIGN GUIDELINES",
    usage: "Primary page title (strictly exactly one <h1> per page)",
  },
  {
    tier: "H2 Section Title",
    token: "text-2xl",
    size: "24px / 32px",
    font: "Archivo Bold (700)",
    tracking: "tracking-tight uppercase",
    style: { fontFamily: archivo.style.fontFamily },
    sampleText: "FOUNDATIONS & CORE SYSTEM",
    usage: "Section breaks, major chapter titles, and group boundaries",
  },
  {
    tier: "H3 Card Title",
    token: "text-lg sm:text-xl",
    size: "20px / 28px",
    font: "Archivo SemiBold (600)",
    tracking: "tracking-tight uppercase",
    style: { fontFamily: archivo.style.fontFamily },
    sampleText: "HEAVYWEIGHT 280 GSM COTTON TEE",
    usage: "Product catalog titles, bento grid headings, modal headers",
  },
  {
    tier: "Lead Subtitle",
    token: "text-base",
    size: "16px / 24px",
    font: "Inter Regular (400)",
    tracking: "tracking-normal",
    style: { fontFamily: inter.style.fontFamily },
    sampleText: "Engineered with high-density Indian combed cotton for a sharp, structural fall.",
    usage: "Lead introductory paragraphs, section subtitles, editorial quotes",
  },
  {
    tier: "Standard Body",
    token: "text-sm",
    size: "14px / 20px",
    font: "Inter Regular (400)",
    tracking: "tracking-normal",
    style: { fontFamily: inter.style.fontFamily },
    sampleText: "Universal readable body copy across all product cards, specifications, and UI descriptions.",
    usage: "Default storefront text, table cells, review descriptions (replaces 12px)",
  },
  {
    tier: "Caption & Meta",
    token: "text-xs",
    size: "12px / 16px",
    font: "Inter Medium (500)",
    tracking: "tracking-wider uppercase",
    style: { fontFamily: inter.style.fontFamily },
    sampleText: "SKU: VEYRO-CORE-001 • PRE-SHRUNK • MADE IN TIRUPPUR",
    usage: "Product metadata, timestamps, price comparison tags, pills",
  },
  {
    tier: "Micro Eyebrow",
    token: "text-[11px]",
    size: "11px / 14px",
    font: "Inter Bold (700)",
    tracking: "tracking-widest uppercase",
    style: { fontFamily: inter.style.fontFamily },
    sampleText: "FREE EXPRESS DELIVERY ON ORDERS OVER ₹999",
    usage: "Top ticker announcements, active step tags, category badges",
  },
];

const WEIGHTS_SCALE = [
  {
    weight: "Bold 700",
    role: "Section headers, page titles, and prominent button CTAs",
    sample: "ARCHITECTURAL DRAPE 700",
    fontClass: "font-bold",
  },
  {
    weight: "SemiBold 600",
    role: "Card titles, active tab indicators, and modal headers",
    sample: "Heavyweight Cotton 600",
    fontClass: "font-semibold",
  },
  {
    weight: "Medium 500",
    role: "Subtitles, navigation links, and table column headers",
    sample: "Storefront Navigation 500",
    fontClass: "font-medium",
  },
  {
    weight: "Regular 400",
    role: "Long-form descriptions, specifications, and standard body text",
    sample: "Indian Combed Cotton 400",
    fontClass: "font-normal",
  },
];

const TRACKING_RULES = [
  {
    token: "tracking-tight",
    value: "-0.025em",
    usage: "All Archivo uppercase display headlines (h1, h2, h3)",
    sample: "HIGH-DENSITY KNIT",
  },
  {
    token: "tracking-normal",
    value: "0em",
    usage: "Standard Inter body paragraphs & product descriptions",
    sample: "Natural drop shoulder silhouette.",
  },
  {
    token: "tracking-wider",
    value: "+0.05em",
    usage: "Small uppercase category badges, price tags, and SKU labels",
    sample: "LIMITED ARCHIVE RELEASE",
  },
  {
    token: "tracking-widest",
    value: "+0.1em",
    usage: "Section counters (GROUP I), table column labels, and top announcements",
    sample: "CONTENTS / SECTION 04",
  },
];

export default function TypographySpecimen() {
  const [customText, setCustomText] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = (token: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 1800);
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. Core Font Family Hero Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Canonical Two-Font Standard
          </h4>
          <span className="text-xs text-neutral-500 font-medium">Click token to copy</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Card 1: Archivo */}
          <div className="border border-[#E8E8E5] rounded-2xl p-6 bg-white shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#111111] text-[#FCD017] font-mono text-xs font-bold">
                    HEADINGS
                  </span>
                  <h5 className="text-base font-bold text-neutral-950">Archivo</h5>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("font-heading")}
                  className="font-mono text-xs text-neutral-600 hover:text-neutral-950 bg-neutral-100 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors"
                  title="Copy font class"
                >
                  {copiedToken === "font-heading" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> font-heading
                    </>
                  )}
                </button>
              </div>

              {/* Live Headline Specimen */}
              <div className="p-5 bg-[#F8F8F6] rounded-xl border border-[#E8E8E5] space-y-2">
                <p
                  className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                  style={{ fontFamily: archivo.style.fontFamily }}
                >
                  BUILT FOR THE ARCHIVE
                </p>
                <p
                  className="text-xs font-mono text-neutral-500 tracking-wider"
                  style={{ fontFamily: archivo.style.fontFamily }}
                >
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ • 0123456789
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-700 leading-relaxed">
                <p>
                  <strong className="text-neutral-950 font-bold">Role: </strong>
                  Architectural headlines, hero statements, product titles, and uppercase section dividers.
                </p>
                <p>
                  <strong className="text-neutral-950 font-bold">Weights: </strong>
                  SemiBold (600) and Bold (700) • Strictly paired with <code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">tracking-tight</code>.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>Google Font: Archivo</span>
              <span className="font-mono font-semibold text-neutral-700">Display / Hero</span>
            </div>
          </div>

          {/* Card 2: Inter */}
          <div className="border border-[#E8E8E5] rounded-2xl p-6 bg-white shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#111111] text-white font-mono text-xs font-bold">
                    BODY &amp; UI
                  </span>
                  <h5 className="text-base font-bold text-neutral-950">Inter</h5>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("font-sans")}
                  className="font-mono text-xs text-neutral-600 hover:text-neutral-950 bg-neutral-100 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors"
                  title="Copy font class"
                >
                  {copiedToken === "font-sans" ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> font-sans
                    </>
                  )}
                </button>
              </div>

              {/* Live Body Specimen */}
              <div className="p-5 bg-[#F8F8F6] rounded-xl border border-[#E8E8E5] space-y-2">
                <p
                  className="text-sm sm:text-base font-normal leading-relaxed text-neutral-900"
                  style={{ fontFamily: inter.style.fontFamily }}
                >
                  100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash.
                </p>
                <p
                  className="text-xs font-mono text-neutral-500 tracking-normal"
                  style={{ fontFamily: inter.style.fontFamily }}
                >
                  Aa Bb Cc Dd Ee Ff Gg Hh 0123456789 • ₹ &amp; %
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-700 leading-relaxed">
                <p>
                  <strong className="text-neutral-950 font-bold">Role: </strong>
                  Universal storefront copy, navigation links, buttons, table data, and descriptions.
                </p>
                <p>
                  <strong className="text-neutral-950 font-bold">Weights: </strong>
                  Regular (400), Medium (500), SemiBold (600) • High legibility at small sizes.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>Google Font: Inter</span>
              <span className="font-mono font-semibold text-neutral-700">Body &amp; Micro</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Live Testing Sandbox */}
      <div className="border border-[#E8E8E5] rounded-2xl p-5 sm:p-6 bg-[#FAFAF8] space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-200/80">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FCD017] fill-[#FCD017]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              Interactive Typography Sandbox
            </h4>
          </div>
          <span className="text-xs text-neutral-500 font-medium">Type anything to preview live</span>
        </div>

        <input
          type="text"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Type custom preview text (e.g. CORE HEAVYWEIGHT OVERSIZED TEE)..."
          className="w-full px-4 py-2.5 bg-white border border-[#E8E8E5] rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 transition-colors shadow-2xs"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="p-4 bg-white rounded-xl border border-[#E8E8E5] space-y-1">
            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
              Archivo Display (Heading)
            </span>
            <p
              className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111] truncate"
              style={{ fontFamily: archivo.style.fontFamily }}
            >
              {customText.trim() || "CORE HEAVYWEIGHT TEE"}
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-[#E8E8E5] space-y-1">
            <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-wider block">
              Inter Body (Reading Copy)
            </span>
            <p
              className="text-sm sm:text-base text-neutral-800 leading-relaxed font-normal truncate"
              style={{ fontFamily: inter.style.fontFamily }}
            >
              {customText.trim() || "Engineered with 280 GSM cotton for a sharp architectural drape."}
            </p>
          </div>
        </div>
      </div>

      {/* 3. The Type Scale Hierarchy Ladder */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Storefront Type Scale Ladder
          </h4>
          <span className="text-xs text-neutral-500 font-medium">
            Standard scale: text-4xl down to text-[11px]
          </span>
        </div>

        <div className="border border-[#E8E8E5] rounded-2xl overflow-hidden bg-white shadow-2xs divide-y divide-[#E8E8E5]">
          {TYPE_SCALE_ITEMS.map((item) => (
            <div
              key={item.tier}
              className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
            >
              {/* Left Details */}
              <div className="w-full lg:w-64 shrink-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
                    {item.tier}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                    {item.token}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 font-mono">
                  {item.size} • {item.font}
                </div>
              </div>

              {/* Center Live Specimen */}
              <div className="grow overflow-hidden">
                <p
                  className={`${item.token} ${item.tracking} text-[#111111] truncate`}
                  style={item.style}
                >
                  {item.sampleText}
                </p>
              </div>

              {/* Right Usage */}
              <div className="w-full lg:w-72 shrink-0 text-xs text-neutral-600 leading-relaxed lg:text-right">
                {item.usage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Font Weights & Tracking Matrices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weights Matrix */}
        <div className="border border-[#E8E8E5] rounded-2xl p-5 bg-white space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Type className="w-4 h-4 text-neutral-600" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              Font Weights In Use
            </h5>
          </div>

          <div className="space-y-2.5">
            {WEIGHTS_SCALE.map((w) => (
              <div
                key={w.weight}
                className="p-3 bg-[#F8F8F6] rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <span className={`text-neutral-950 ${w.fontClass} block text-sm`}>
                    {w.weight}
                  </span>
                  <span className="text-neutral-600">{w.role}</span>
                </div>
                <span className={`text-neutral-900 ${w.fontClass} text-xs font-mono shrink-0`}>
                  Sample
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking Matrix */}
        <div className="border border-[#E8E8E5] rounded-2xl p-5 bg-white space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Sparkles className="w-4 h-4 text-neutral-600" />
            <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-950">
              Tracking (Letter Spacing) Rules
            </h5>
          </div>

          <div className="space-y-2.5">
            {TRACKING_RULES.map((t) => (
              <div
                key={t.token}
                className="p-3 bg-[#F8F8F6] rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-neutral-950">{t.token}</span>
                    <span className="text-[11px] font-mono text-neutral-500">({t.value})</span>
                  </div>
                  <span className="text-neutral-600">{t.usage}</span>
                </div>
                <span className={`text-neutral-900 font-bold ${t.token} text-xs shrink-0`}>
                  {t.sample}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Minimal System Rules Banner */}
      <div className="p-4 bg-neutral-50 rounded-xl border border-[#E8E8E5] flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-neutral-950">Typography Rules:</span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium shadow-2xs">
            2-Font Standard: Archivo + Inter Only
          </span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium shadow-2xs">
            Minimum Body Size: 14px (text-sm)
          </span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium shadow-2xs">
            Exactly One &lt;h1&gt; per Page
          </span>
        </div>
        <a
          href="#transition-guidance"
          className="text-neutral-900 hover:text-black font-bold underline underline-offset-2 ml-auto"
        >
          View Section 12 Audit →
        </a>
      </div>
    </div>
  );
}
