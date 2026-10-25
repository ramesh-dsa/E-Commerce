"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface SwatchCardProps {
  title: string;
  hex: string;
  description: string;
  token?: string;
  isLight?: boolean;
  pillDark?: boolean;
  copiedHex: string | null;
  onCopy: (hex: string) => void;
}

function SwatchCard({
  title,
  hex,
  description,
  token,
  isLight = false,
  pillDark = false,
  copiedHex,
  onCopy,
}: SwatchCardProps) {
  const isCopied = copiedHex === hex;

  return (
    <div
      onClick={() => onCopy(hex)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onCopy(hex);
        }
      }}
      role="button"
      tabIndex={0}
      title="Click to copy HEX code"
      className="border border-[#E8E8E5] rounded-2xl p-3 bg-white shadow-2xs hover:shadow-sm hover:border-neutral-400 transition-all cursor-pointer group flex flex-col justify-between"
    >
      {/* Top Color Swatch Preview Block */}
      <div
        style={{ backgroundColor: hex }}
        className={`w-full h-28 sm:h-32 rounded-xl p-3 flex flex-col justify-end relative transition-transform duration-200 group-hover:scale-[1.01] ${
          isLight ? "border border-neutral-200/80" : ""
        }`}
      >
        {/* Hex Pill Badge at Bottom-Left */}
        <span
          className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full w-fit flex items-center gap-1.5 transition-all shadow-xs ${
            pillDark
              ? "bg-[#111111] text-white border border-black/20"
              : isLight
              ? "bg-white/95 text-neutral-900 border border-neutral-300/80"
              : "bg-black/40 text-white border border-white/20 backdrop-blur-xs"
          }`}
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              {hex}
            </>
          )}
        </span>
      </div>

      {/* Bottom Content: Title, Token & Short Role */}
      <div className="pt-3 pb-1 px-1 space-y-1">
        <div className="flex items-baseline justify-between gap-1">
          <h5 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight">
            {title}
          </h5>
          {token && (
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider hidden sm:inline">
              {token}
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-600 font-normal leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

// 1. Core Brand Identity & Interaction States
const BRAND_IDENTITY_COLORS = [
  {
    title: "Veyro Ink",
    hex: "#111111",
    token: "veyro-black",
    description: "Primary headings, deep contrast text, logos, and high-contrast buttons",
    isLight: false,
  },
  {
    title: "Volt Gold",
    hex: "#FCD017",
    token: "veyro-yellow",
    description: "Primary CTAs, active highlights, and notification accents",
    isLight: true,
    pillDark: true,
  },
  {
    title: "Gold Hover",
    hex: "#E5BC05",
    token: "veyro-yellow-dark",
    description: "Hover and active pressed state for Volt Gold buttons and pills",
    isLight: true,
    pillDark: true,
  },
  {
    title: "Gold Surface Tint",
    hex: "#FFF8E7",
    token: "veyro-yellow-tint",
    description: "Subtle background container for active highlight badges and banners",
    isLight: true,
  },
];

// 2. Promotional & Sale Accent (E-Commerce Essential)
const PROMO_ACCENTS = [
  {
    title: "Sale & Discount Rust",
    hex: "#C44D25",
    token: "veyro-accent",
    description: "Percentage off badges (e.g. 20% OFF), deal ribbons, and price drops",
    isLight: false,
  },
  {
    title: "Sale Accent Hover",
    hex: "#A33C1A",
    token: "veyro-accent-hover",
    description: "Hover state for promotional interactive tags and sale links",
    isLight: false,
  },
  {
    title: "Sale Tint Surface",
    hex: "#FDF3EF",
    token: "veyro-accent-light",
    description: "Soft warm background container for discount chips and sale alerts",
    isLight: true,
  },
  {
    title: "Charcoal Ink",
    hex: "#1F1F1F",
    token: "veyro-charcoal",
    description: "Subtle dark tag containers (e.g. checkout badges and secondary tags)",
    isLight: false,
  },
];

// 3. Complete Canonical Neutral Ramp (11 Steps)
const NEUTRAL_RAMP = [
  {
    title: "neutral-950",
    hex: "#0A0A0A",
    token: "text-950",
    description: "Deepest black titles, high-contrast badges, and primary accents",
    isLight: false,
  },
  {
    title: "neutral-900",
    hex: "#171717",
    token: "text-900",
    description: "Primary body text, card titles, and high-emphasis labels",
    isLight: false,
  },
  {
    title: "neutral-800",
    hex: "#262626",
    token: "text-800",
    description: "Strong secondary headings, emphasized copy, and dark icons",
    isLight: false,
  },
  {
    title: "neutral-700",
    hex: "#404040",
    token: "text-700",
    description: "Secondary body text, descriptions, and feature lists",
    isLight: false,
  },
  {
    title: "neutral-600",
    hex: "#525252",
    token: "text-600",
    description: "Supporting descriptions, form helper text, and column headers",
    isLight: false,
  },
  {
    title: "neutral-500",
    hex: "#737373",
    token: "text-500",
    description: "Muted meta text, timestamps, and product SKU numbers",
    isLight: false,
  },
  {
    title: "neutral-400",
    hex: "#A3A3A3",
    token: "text-400",
    description: "Decorative icons, form placeholders, and disabled input states",
    isLight: false,
  },
  {
    title: "neutral-300",
    hex: "#D4D4D4",
    token: "border-300",
    description: "Quiet card dividers, toggle track bars, and subtle borders",
    isLight: true,
  },
  {
    title: "neutral-200",
    hex: "#E5E5E5",
    token: "border-200",
    description: "Hairlines, container outlines, and standard card borders",
    isLight: true,
  },
  {
    title: "neutral-100",
    hex: "#F5F5F5",
    token: "surface-100",
    description: "Subtle card backgrounds, chip pills, and hover surface states",
    isLight: true,
  },
  {
    title: "neutral-50",
    hex: "#FAFAFA",
    token: "surface-50",
    description: "Alternating section rows and quiet surface canvas",
    isLight: true,
  },
];

// 4. Application Surfaces & Dividers
const SURFACES_AND_STRUCTURE = [
  {
    title: "Page Canvas",
    hex: "#FFFFFF",
    token: "--background",
    description: "Universal clean white background canvas for all storefront pages",
    isLight: true,
  },
  {
    title: "Section Surface",
    hex: "#F8F8F6",
    token: "surface",
    description: "Default alternating section background rows and quiet zones",
    isLight: true,
  },
  {
    title: "Alternate Surface",
    hex: "#F3F3F0",
    token: "surface-alt",
    description: "Modal panels, dropdown card bodies, and table headers",
    isLight: true,
  },
  {
    title: "Border Default",
    hex: "#E8E8E5",
    token: "border",
    description: "Standard 1px structural outlines and card frame dividers",
    isLight: true,
  },
  {
    title: "Border Light",
    hex: "#F0F0ED",
    token: "border-light",
    description: "Subtle nested dividers, inner card lines, and table separators",
    isLight: true,
  },
];

// 5. Semantic Status Accents
const STATUS_ACCENTS = [
  {
    title: "Success (Emerald)",
    hex: "#059669",
    token: "emerald-600",
    description: "Order completed badges, positive validation, and in-stock pills",
    isLight: false,
  },
  {
    title: "Warning (Amber)",
    hex: "#D97706",
    token: "amber-600",
    description: "Low stock alert notifications, urgency nudges, and pending reviews",
    isLight: false,
  },
  {
    title: "Error (Red)",
    hex: "#DC2626",
    token: "red-600",
    description: "Sold out notices, payment failures, and form validation errors",
    isLight: false,
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
    <div className="space-y-10">
      {/* 1. Core Brand Identity & States */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Brand Identity &amp; Interaction States
          </h4>
          <span className="text-xs text-neutral-500 font-medium">Click any card to copy HEX</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BRAND_IDENTITY_COLORS.map((item) => (
            <SwatchCard
              key={item.title}
              {...item}
              copiedHex={copiedHex}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>

      {/* 2. Promotional & Sale Accent */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Promotional &amp; Sale Accents
          </h4>
          <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded">
            E-Commerce discount badges &amp; deal highlights
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROMO_ACCENTS.map((item) => (
            <SwatchCard
              key={item.title}
              {...item}
              copiedHex={copiedHex}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>

      {/* 3. Canonical Neutral Scale (Full 11-step Ramp) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Canonical Neutral Scale (Tailwind Ramp)
          </h4>
          <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded">
            Full 11-step scale • Only Tailwind neutral-50 → 950 permitted
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {NEUTRAL_RAMP.map((item) => (
            <SwatchCard
              key={item.title}
              {...item}
              copiedHex={copiedHex}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>

      {/* 4. Surfaces & Structural Borders */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
          Application Surfaces &amp; Dividers
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {SURFACES_AND_STRUCTURE.map((item) => (
            <SwatchCard
              key={item.title}
              {...item}
              copiedHex={copiedHex}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>

      {/* 5. Semantic Status Accents */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
          Semantic Status Accents
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STATUS_ACCENTS.map((item) => (
            <SwatchCard
              key={item.title}
              {...item}
              copiedHex={copiedHex}
              onCopy={handleCopy}
            />
          ))}
        </div>
      </div>

      {/* 6. Minimal System Rule Banner */}
      <div className="p-4 bg-neutral-50 rounded-xl border border-[#E8E8E5] flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-neutral-950">System Rules:</span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium shadow-2xs">
            Pure Light Mode (0 Dark Islands)
          </span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium shadow-2xs">
            Tailwind Neutral Ramp Only (No zinc / slate)
          </span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium shadow-2xs">
            Gold Background Only with Ink Text
          </span>
          <span className="bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-medium shadow-2xs">
            Rust Accent Reserved for Discounts &amp; Sales
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
