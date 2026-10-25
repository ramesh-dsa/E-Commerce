"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ColorItem {
  name: string;
  hex: string;
  token: string;
  role: string;
  rule?: string;
  contrast?: string;
  bgClass?: string;
  borderClass?: string;
  textColor?: string;
}

const BRAND_HERO_COLORS: ColorItem[] = [
  {
    name: "Veyro Ink",
    hex: "#111111",
    token: "--color-veyro-black",
    role: "Universal text, headings, dark buttons, and brand marks.",
    rule: "Use for all text on light surfaces. Never use pure #000000.",
    contrast: "18.88:1 AAA on White",
    bgClass: "bg-[#111111]",
    textColor: "text-white",
  },
  {
    name: "Volt Gold",
    hex: "#FCD017",
    token: "--color-veyro-yellow",
    role: "Primary CTAs, active highlights, and notification badges.",
    rule: "Background only with Ink text. Never use Gold text on light surfaces.",
    contrast: "12.7:1 with Ink",
    bgClass: "bg-[#FCD017]",
    textColor: "text-[#111111]",
  },
];

const SURFACE_SWATCHES: ColorItem[] = [
  {
    name: "Page Canvas",
    hex: "#FFFFFF",
    token: "--background",
    role: "Universal application page background.",
    bgClass: "bg-white",
    borderClass: "border-neutral-200",
  },
  {
    name: "Section Surface",
    hex: "#F8F8F6",
    token: "--color-veyro-surface",
    role: "Alternating section rows and quiet zones.",
    bgClass: "bg-[#F8F8F6]",
    borderClass: "border-[#E8E8E5]",
  },
  {
    name: "Alternate Surface",
    hex: "#F3F3F0",
    token: "--color-veyro-surface-alt",
    role: "Card bodies, dropdown panels, and table headers.",
    bgClass: "bg-[#F3F3F0]",
    borderClass: "border-[#E8E8E5]",
  },
  {
    name: "Border",
    hex: "#E8E8E5",
    token: "--color-veyro-border",
    role: "Canonical 1px card outlines and divider lines.",
    bgClass: "bg-[#E8E8E5]",
    borderClass: "border-neutral-300",
  },
];

const NEUTRAL_SCALE = [
  {
    step: "900",
    hex: "#171717",
    role: "Headings & Primary Text",
    token: "text-neutral-900",
    bg: "bg-neutral-900",
    textOnBg: "text-white",
  },
  {
    step: "700",
    hex: "#404040",
    role: "Body Copy & Subtitles",
    token: "text-neutral-700",
    bg: "bg-neutral-700",
    textOnBg: "text-white",
  },
  {
    step: "500",
    hex: "#737373",
    role: "Captions & Metadata",
    token: "text-neutral-500",
    bg: "bg-neutral-500",
    textOnBg: "text-white",
  },
  {
    step: "400",
    hex: "#A3A3A3",
    role: "Placeholders & Dividers",
    token: "text-neutral-400",
    bg: "bg-neutral-400",
    textOnBg: "text-neutral-900",
  },
];

const STATUS_PILLS = [
  {
    name: "Success",
    hex: "#059669",
    sampleText: "In Stock",
    role: "Completed orders, successful validation, active inventory.",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  {
    name: "Warning",
    hex: "#D97706",
    sampleText: "Low Stock (2 Left)",
    role: "Urgency nudges, pending payment, delayed shipping.",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    name: "Error",
    hex: "#DC2626",
    sampleText: "Out of Stock",
    role: "Form field errors, payment failure, depleted stock.",
    badgeClass: "bg-red-50 text-red-800 border-red-200",
  },
];

export default function ColorPaletteSpecimen() {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1800);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Core Brand Colors (Hero Swatches) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Brand Identity Colors
          </h4>
          <span className="text-xs text-neutral-500 font-medium">Click any swatch to copy HEX</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BRAND_HERO_COLORS.map((color) => {
            const isCopied = copiedHex === color.hex;
            return (
              <div
                key={color.name}
                className="border border-[#E8E8E5] rounded-xl overflow-hidden bg-white shadow-2xs hover:shadow-xs transition-shadow"
              >
                {/* Visual Swatch Block */}
                <div
                  className={`p-6 ${color.bgClass} ${color.textColor} flex flex-col justify-between h-36 relative cursor-pointer group`}
                  onClick={() => handleCopy(color.hex)}
                  title="Click to copy HEX code"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCopy(color.hex);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs uppercase tracking-widest font-bold opacity-80 block">
                        {color.token}
                      </span>
                      <h5 className="text-2xl font-bold tracking-tight">{color.name}</h5>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-black/10 backdrop-blur-xs flex items-center gap-1.5 border border-current/20">
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                          {color.hex}
                        </>
                      )}
                    </span>
                  </div>

                  <div className="text-xs font-semibold tracking-wide opacity-90">
                    Contrast: {color.contrast}
                  </div>
                </div>

                {/* Short, Powerful Message — No Bla Bla */}
                <div className="p-4 space-y-2 bg-white text-sm">
                  <p className="text-neutral-700 leading-snug font-normal">
                    <strong className="text-neutral-950 font-bold block mb-0.5">Role:</strong>
                    {color.role}
                  </p>
                  <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/80 text-xs text-neutral-800 leading-relaxed font-medium">
                    <strong className="text-neutral-950 font-bold">Rule: </strong>
                    {color.rule}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* 3. Surface & Structural Swatches */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
          Surfaces &amp; Structural Dividers
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SURFACE_SWATCHES.map((swatch) => {
            const isCopied = copiedHex === swatch.hex;
            return (
              <div
                key={swatch.name}
                className="border border-[#E8E8E5] rounded-xl p-3 bg-white space-y-2.5 shadow-2xs hover:border-neutral-400 transition-colors cursor-pointer group"
                onClick={() => handleCopy(swatch.hex)}
                title="Click to copy HEX code"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCopy(swatch.hex);
                  }
                }}
              >
                {/* Visual Swatch Box */}
                <div
                  className={`w-full h-16 rounded-lg ${swatch.bgClass} ${swatch.borderClass ? `border ${swatch.borderClass}` : "border border-neutral-200"} flex items-center justify-center relative`}
                >
                  <span className="text-[11px] font-mono font-bold text-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-2 py-0.5 rounded shadow-2xs">
                    {isCopied ? "Copied!" : "Copy HEX"}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-950 block">{swatch.name}</span>
                    <span className="text-[11px] font-mono font-semibold text-neutral-700">
                      {isCopied ? "✓" : swatch.hex}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono block">
                    {swatch.token}
                  </span>
                  <p className="text-[11.5px] text-neutral-700 leading-snug pt-1">
                    {swatch.role}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Neutral Scale Ramp */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Tailwind Neutral Typography Ramp
          </h4>
          <span className="text-xs font-bold text-neutral-800 bg-neutral-100 px-2.5 py-0.5 rounded">
            Only Tailwind neutral-50 → 950 permitted (No zinc / slate)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {NEUTRAL_SCALE.map((item) => {
            const isCopied = copiedHex === item.hex;
            return (
              <div
                key={item.step}
                className="border border-[#E8E8E5] rounded-xl p-3 bg-white space-y-2 shadow-2xs hover:border-neutral-400 transition-colors cursor-pointer group"
                onClick={() => handleCopy(item.hex)}
                title="Click to copy HEX code"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCopy(item.hex);
                  }
                }}
              >
                <div
                  className={`w-full h-12 rounded-lg ${item.bg} ${item.textOnBg} flex items-center justify-between px-3 text-xs font-mono font-bold`}
                >
                  <span>neutral-{item.step}</span>
                  <span>{isCopied ? "Copied!" : item.hex}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-neutral-950 block">{item.role}</span>
                  <span className="text-[11px] font-mono text-neutral-600 block">{item.token}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Semantic Status Accents */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
          Semantic Status Accents
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STATUS_PILLS.map((pill) => (
            <div
              key={pill.name}
              className="border border-[#E8E8E5] rounded-xl p-4 bg-white space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-950 uppercase tracking-wider">
                  {pill.name}
                </span>
                <span className="text-[11px] font-mono text-neutral-600 font-semibold">
                  {pill.hex}
                </span>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${pill.badgeClass}`}
                >
                  {pill.sampleText}
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-snug">{pill.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Compact Metric Pill Bar */}
      <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-neutral-950">System Rules:</span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium">
            Strict Light Canvas (0 Dark Islands)
          </span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium">
            Tokens &amp; Neutral Ramp Only
          </span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium">
            Zero Arbitrary Hex in Markup
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
