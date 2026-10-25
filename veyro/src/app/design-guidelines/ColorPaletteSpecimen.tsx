"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface SwatchCardProps {
  title: string;
  hex: string;
  description: string;
  token?: string;
  isLight?: boolean;
  copiedHex: string | null;
  onCopy: (hex: string) => void;
}

function SwatchCard({
  title,
  hex,
  description,
  token,
  isLight = false,
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
        {/* Hex Pill Badge at Bottom-Left (matching screenshot reference) */}
        <span
          className={`font-mono text-xs font-bold px-2.5 py-1 rounded-full w-fit flex items-center gap-1.5 transition-all shadow-xs ${
            isLight
              ? "bg-white/90 text-neutral-900 border border-neutral-200/70"
              : "bg-black/35 text-white border border-white/15 backdrop-blur-xs"
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

      {/* Bottom Content: Title, Token & Short Powerful Role */}
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

const BRAND_IDENTITY_COLORS = [
  {
    title: "Veyro Ink",
    hex: "#111111",
    token: "veyro-black",
    description: "Primary headings, deep contrast text, and brand mark",
    isLight: false,
  },
  {
    title: "Volt Gold",
    hex: "#FCD017",
    token: "veyro-yellow",
    description: "Primary CTAs, active highlights, and notification accents",
    isLight: true,
  },
];

const NEUTRAL_RAMP = [
  {
    title: "neutral-900",
    hex: "#171717",
    token: "text-900",
    description: "Primary body text, card titles, and high-emphasis labels",
    isLight: false,
  },
  {
    title: "neutral-700",
    hex: "#404040",
    token: "text-700",
    description: "Secondary body text, descriptions, and list items",
    isLight: false,
  },
  {
    title: "neutral-600",
    hex: "#525252",
    token: "text-600",
    description: "Supporting descriptions and table column headers",
    isLight: false,
  },
  {
    title: "neutral-500",
    hex: "#737373",
    token: "text-500",
    description: "Muted meta text, timestamps, and SKU numbers",
    isLight: false,
  },
  {
    title: "neutral-400",
    hex: "#A3A3A3",
    token: "text-400",
    description: "Decorative icons, form placeholders, and disabled states",
    isLight: true,
  },
  {
    title: "neutral-200",
    hex: "#E5E5E5",
    token: "border-200",
    description: "Hairlines, container borders, and quiet table dividers",
    isLight: true,
  },
  {
    title: "neutral-100",
    hex: "#F5F5F5",
    token: "surface-100",
    description: "Subtle card backgrounds, chip pills, and hover states",
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

const SURFACES_AND_STRUCTURE = [
  {
    title: "Page Canvas",
    hex: "#FFFFFF",
    token: "--background",
    description: "Universal clean white background canvas",
    isLight: true,
  },
  {
    title: "Section Surface",
    hex: "#F8F8F6",
    token: "surface",
    description: "Default alternating section background rows",
    isLight: true,
  },
  {
    title: "Alternate Surface",
    hex: "#F3F3F0",
    token: "surface-alt",
    description: "Modal panels, dropdown cards, and table headers",
    isLight: true,
  },
  {
    title: "Border Default",
    hex: "#E8E8E5",
    token: "border",
    description: "Standard 1px structural outlines and card frames",
    isLight: true,
  },
];

const STATUS_ACCENTS = [
  {
    title: "Success (Emerald)",
    hex: "#059669",
    token: "emerald-600",
    description: "Order completed badges, positive stock status",
    isLight: false,
  },
  {
    title: "Warning (Amber)",
    hex: "#D97706",
    token: "amber-600",
    description: "Low stock alert notifications and pending verification",
    isLight: false,
  },
  {
    title: "Error (Red)",
    hex: "#DC2626",
    token: "red-600",
    description: "Sold out notices and critical form validation errors",
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
      {/* 1. Core Brand Identity Colors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Brand Identity Colors
          </h4>
          <span className="text-xs text-neutral-500 font-medium">Click any card to copy HEX</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      {/* 2. Canonical Neutral Scale (Tailwind Neutral Ramp) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Canonical Neutral Scale (Tailwind Ramp)
          </h4>
          <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-0.5 rounded">
            Only Tailwind neutral-50 → 950 permitted
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

      {/* 3. Surfaces & Structural Borders */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
          Application Surfaces &amp; Dividers
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

      {/* 4. Semantic Status Accents */}
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

    </div>
  );
}
