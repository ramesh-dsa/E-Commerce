"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Layers,
  Code2,
  Box,
} from "lucide-react";

interface RadiusSpec {
  token: string;
  px: string;
  name: string;
  role: string;
  sourceFile: string;
  previewClass: string;
}

interface ShadowSpec {
  token: string;
  name: string;
  elevation: string;
  role: string;
  sourceFile: string;
  shadowClass: string;
}

const RADII_SPECS: RadiusSpec[] = [
  {
    token: "rounded-full",
    px: "9999px",
    name: "Full Pill",
    role: "Action buttons, category filter pills, stock status badges & circular controls",
    sourceFile: "ProductBuyBox.tsx:362 • Header.tsx",
    previewClass: "rounded-full",
  },
  {
    token: "rounded-2xl",
    px: "16px",
    name: "Storefront Card Standard",
    role: "Product cards, clothing catalog grids, review blocks & modal dialogs",
    sourceFile: "ProductCard.tsx:45 • FootwearCatalog.tsx:647",
    previewClass: "rounded-2xl",
  },
  {
    token: "rounded-xl",
    px: "12px",
    name: "Component Sub-containers",
    role: "Spotlight bento cards, product thumbnails, toast alerts & drawer modules",
    sourceFile: "SpotlightBentoCard.tsx:79 • Toast.tsx:77",
    previewClass: "rounded-xl",
  },
  {
    token: "rounded-lg",
    px: "8px",
    name: "Controls & Inputs",
    role: "Form inputs, size selection buttons, quantity pickers & table headers",
    sourceFile: "ProductBuyBox.tsx:715 • ProductSearch.tsx",
    previewClass: "rounded-lg",
  },
  {
    token: "rounded-md",
    px: "6px",
    name: "Micro Insets",
    role: "Tag chips, active color swatch indicators, tooltip popovers & toggles",
    sourceFile: "ProductReviewsSection.tsx • SortDropdown.tsx",
    previewClass: "rounded-md",
  },
];

const SHADOW_SPECS: ShadowSpec[] = [
  {
    token: "shadow-2xs / shadow-xs",
    name: "Resting Surface",
    elevation: "1px offset",
    role: "Default catalog cards, subtle section dividers & resting state borders",
    sourceFile: "ProductCard.tsx:45 • ClothingCatalog.tsx",
    shadowClass: "shadow-2xs",
  },
  {
    token: "shadow-sm / shadow-md",
    name: "Interactive Lift",
    elevation: "3px - 6px offset",
    role: "Card hover states, floating 'Add to Bag' buttons & sticky navigation",
    sourceFile: "ProductBuyBox.tsx:526 • ProductReviewsSection.tsx",
    shadowClass: "shadow-md",
  },
  {
    token: "shadow-xl / shadow-2xl",
    name: "Floating Overlays",
    elevation: "12px - 25px offset",
    role: "Search autocomplete overlay, CartDrawer, AccountModal & modal sheets",
    sourceFile: "ProductSearch.tsx:559 • AccountModal.tsx:412",
    shadowClass: "shadow-2xl",
  },
];

export default function ShapeElevationSpecimen() {
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
      {/* ============================================================== */}
      {/* 1. CORNER RADII ARCHITECTURE CARDS                             */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Box className="w-4 h-4 text-[#111111]" />
              Corner Radii Architecture
            </h4>
            <p className="text-xs text-neutral-500 font-normal">
              Active border radius tokens defining component silhouettes across the storefront
            </p>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">Click card to copy radius token</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {RADII_SPECS.map((spec) => {
            const isCopied = copiedToken === spec.token;

            return (
              <div
                key={spec.token}
                onClick={() => handleCopy(spec.token)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCopy(spec.token);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group border border-[#E8E8E5] rounded-2xl p-4 bg-white shadow-2xs hover:shadow-md hover:border-neutral-900 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                {/* Visual Silhouette Preview */}
                <div className="w-full h-28 rounded-xl bg-[#F8F8F6] border border-[#E8E8E5] p-3 flex flex-col justify-between group-hover:bg-[#F3F3EF] transition-colors relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-800 bg-white px-2 py-0.5 rounded shadow-2xs border border-neutral-200">
                      {spec.px}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Tailwind
                    </span>
                  </div>

                  {/* Proportional Geometric Silhouette Box */}
                  <div className="flex items-center justify-center py-1">
                    <div
                      className={`w-16 h-12 bg-[#111111] text-white flex items-center justify-center shadow-xs transition-all duration-300 ${spec.previewClass} border-2 border-[#FCD017]/40`}
                    >
                      <span className="text-[10px] font-mono font-bold text-[#FCD017]">
                        {spec.px}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-neutral-950 tracking-tight">
                      {spec.name}
                    </h5>
                    <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded flex items-center gap-1">
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                          {spec.token}
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 font-normal leading-relaxed line-clamp-2">
                    {spec.role}
                  </p>

                  <div className="pt-2 flex items-center gap-1 text-[10px] font-mono text-neutral-400 border-t border-neutral-100">
                    <Code2 className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                    <span className="truncate">{spec.sourceFile}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ELEVATION & SHADOW SYSTEM CARDS                             */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#111111]" />
              Elevation &amp; Shadow Depth System
            </h4>
            <p className="text-xs text-neutral-500 font-normal">
              Layering hierarchy creating depth and focus between canvas, cards, and modal sheets
            </p>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">Click card to copy shadow token</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SHADOW_SPECS.map((shadow) => {
            const isCopied = copiedToken === shadow.token;

            return (
              <div
                key={shadow.token}
                onClick={() => handleCopy(shadow.token.split(" ")[0])}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCopy(shadow.token.split(" ")[0]);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group border border-[#E8E8E5] rounded-2xl p-4 sm:p-5 bg-white shadow-2xs hover:shadow-md hover:border-neutral-900 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                {/* Visual Elevation Preview Frame */}
                <div className="w-full h-32 rounded-xl bg-[#F4F4F1] border border-[#E8E8E5] p-3 flex flex-col justify-between group-hover:bg-[#EEEEEC] transition-colors relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-neutral-800 bg-white px-2 py-0.5 rounded shadow-2xs border border-neutral-200">
                      {shadow.elevation}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      {shadow.token.split(" ")[0]}
                    </span>
                  </div>

                  {/* Elevated Box Mockup */}
                  <div className="flex items-center justify-center py-2">
                    <div
                      className={`w-4/5 py-2.5 px-4 bg-white rounded-xl border border-neutral-200/90 text-center text-xs font-mono font-bold text-neutral-900 transition-all ${shadow.shadowClass}`}
                    >
                      {shadow.name}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-neutral-950 tracking-tight">
                      {shadow.name}
                    </h5>
                    <span className="font-mono text-xs font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded flex items-center gap-1">
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
                          {shadow.token.split(" ")[0]}
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                    {shadow.role}
                  </p>

                  <div className="pt-2 flex items-center gap-1 text-[10px] font-mono text-neutral-400 border-t border-neutral-100">
                    <Code2 className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                    <span className="truncate">{shadow.sourceFile}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
