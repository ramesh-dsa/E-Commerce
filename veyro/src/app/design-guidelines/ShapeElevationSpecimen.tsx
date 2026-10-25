"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Layers,
  Sparkles,
  Sliders,
  Code2,
  Box,
  ShoppingBag,
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
  const [activeRadius, setActiveRadius] = useState<string>("rounded-2xl");
  const [activeShadow, setActiveShadow] = useState<string>("shadow-md");

  const handleCopy = (token: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 1800);
    }
  };

  return (
    <div className="space-y-12">
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

      {/* ============================================================== */}
      {/* 3. INTERACTIVE SHAPE & ELEVATION LAB                           */}
      {/* ============================================================== */}
      <div className="border border-[#E8E8E5] rounded-2xl bg-white shadow-2xs overflow-hidden">
        {/* Lab Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAFAF8]">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#111111]" />
              Interactive Shape &amp; Elevation Playground
            </h4>
            <p className="text-xs text-neutral-500">
              Test how live corner radii and shadow levels combine on a Veyro product card
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600">
            <span className="bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
              {activeRadius}
            </span>
            <span>+</span>
            <span className="bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
              {activeShadow}
            </span>
          </div>
        </div>

        {/* Playground Grid: Controls on left, Live Card on right */}
        <div className="p-5 sm:p-8 bg-[#F4F4F1] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Panel */}
          <div className="lg:col-span-6 space-y-6 bg-white p-5 sm:p-6 rounded-2xl border border-neutral-200 shadow-2xs">
            {/* Radius Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center justify-between">
                <span>Select Corner Radius</span>
                <span className="text-[11px] font-mono text-neutral-500">{activeRadius}</span>
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { token: "rounded-md", label: "md (6px)" },
                  { token: "rounded-lg", label: "lg (8px)" },
                  { token: "rounded-xl", label: "xl (12px)" },
                  { token: "rounded-2xl", label: "2xl (16px)" },
                  { token: "rounded-full", label: "full" },
                ].map((item) => (
                  <button
                    key={item.token}
                    type="button"
                    onClick={() => setActiveRadius(item.token)}
                    className={`px-2 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                      activeRadius === item.token
                        ? "bg-[#111111] text-[#FCD017] border-[#111111] shadow-xs"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center justify-between">
                <span>Select Elevation Shadow</span>
                <span className="text-[11px] font-mono text-neutral-500">{activeShadow}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { token: "shadow-none", label: "Flat (none)" },
                  { token: "shadow-xs", label: "Resting (xs)" },
                  { token: "shadow-md", label: "Floating (md)" },
                  { token: "shadow-2xl", label: "Elevated (2xl)" },
                ].map((item) => (
                  <button
                    key={item.token}
                    type="button"
                    onClick={() => setActiveShadow(item.token)}
                    className={`px-2 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                      activeShadow === item.token
                        ? "bg-[#111111] text-[#FCD017] border-[#111111] shadow-xs"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>Standard Default: <strong className="text-neutral-800">rounded-2xl + shadow-xs</strong></span>
              <button
                type="button"
                onClick={() => {
                  setActiveRadius("rounded-2xl");
                  setActiveShadow("shadow-xs");
                }}
                className="text-neutral-700 hover:text-black font-bold underline underline-offset-2"
              >
                Reset Default
              </button>
            </div>
          </div>

          {/* Live Card Viewport */}
          <div className="lg:col-span-6 flex items-center justify-center p-4">
            <div
              className={`w-full max-w-sm bg-white p-4 sm:p-5 border border-neutral-200/90 transition-all duration-300 ease-out space-y-3 ${activeRadius} ${activeShadow}`}
            >
              {/* Product Visual */}
              <div
                className={`w-full h-44 bg-[#EFEFED] relative overflow-hidden flex items-center justify-center p-3 transition-all duration-300 ${activeRadius}`}
              >
                <div className="absolute top-2 left-2 bg-[#FCD017] text-[#111111] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shadow-2xs z-10 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>BESTSELLER</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/products/shoes/veyro-shoe-01-primary.webp"
                  alt="Blanc Court Sneaker"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h6 className="text-sm font-bold text-neutral-900">
                    Blanc Court Sneaker
                  </h6>
                  <span className="font-mono text-xs font-bold text-neutral-900">
                    ₹2,699
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-normal">
                  Triple White • Premium Synthetic Leather
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className={`w-full bg-[#111111] hover:bg-black text-white text-xs font-bold py-2.5 flex items-center justify-center gap-1.5 transition-all shadow-xs ${activeRadius}`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#FCD017]" />
                <span>Add to Bag</span>
              </button>

              {/* Live Token pill */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span>Active CSS:</span>
                <span className="text-neutral-700 font-bold bg-neutral-100 px-2 py-0.5 rounded">
                  {activeRadius} {activeShadow}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
