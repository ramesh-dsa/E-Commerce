"use client";

import React, { useState } from "react";
import {
  Smartphone,
  Tablet,
  Monitor,
  Copy,
  Check,
  Sliders,
  MoveHorizontal,
  MoveVertical,
  ShoppingBag,
} from "lucide-react";

interface ContainerTier {
  id: string;
  title: string;
  widthPx: number;
  widthLabel: string;
  propToken: string;
  cssClass: string;
  padding: string;
  usage: string;
  layoutType: "showcase" | "catalog" | "checkout" | "reading";
}

const CONTAINER_TIERS: ContainerTier[] = [
  {
    id: "wide",
    title: "Wide Showcase",
    widthPx: 1600,
    widthLabel: "1600px",
    propToken: 'maxWidth="wide"',
    cssClass: "max-w-[1600px]",
    padding: "px-4 sm:px-8 xl:px-10",
    usage: "Full-bleed hero carousels, immersive lookbooks, and high-impact marquee banners.",
    layoutType: "showcase",
  },
  {
    id: "default",
    title: "Default Storefront",
    widthPx: 1540,
    widthLabel: "1540px",
    propToken: 'maxWidth="default"',
    cssClass: "max-w-[1540px]",
    padding: "px-4 sm:px-8 xl:px-10",
    usage: "Canonical storefront grid, product card listings, search results, and brand footer.",
    layoutType: "catalog",
  },
  {
    id: "narrow",
    title: "Narrow Focused",
    widthPx: 1200,
    widthLabel: "1200px",
    propToken: 'maxWidth="narrow"',
    cssClass: "max-w-[1200px]",
    padding: "px-4 sm:px-6",
    usage: "Checkout funnel, shopping cart summary, order status tracking, and account portal.",
    layoutType: "checkout",
  },
  {
    id: "reading",
    title: "Reading & Dialog",
    widthPx: 768,
    widthLabel: "768px / 448px",
    propToken: 'max-w-3xl / max-w-md',
    cssClass: "max-w-3xl",
    padding: "px-4 sm:px-6",
    usage: "Terms of service, FAQ accordions, authentication modals, and login dialogs.",
    layoutType: "reading",
  },
];

const SPACING_SCALE = [
  { token: "p-1 (4px)", size: 4, tw: "w-1 h-1", role: "Micro tags, icon offsets & badge insets" },
  { token: "p-2 (8px)", size: 8, tw: "w-2 h-2", role: "Button icon gap, chip pill padding & compact gaps" },
  { token: "p-3 (12px)", size: 12, tw: "w-3 h-3", role: "Form field padding, dropdown items & mobile gutters" },
  { token: "p-4 (16px)", size: 16, tw: "w-4 h-4", role: "Base mobile screen margin & card internal padding" },
  { token: "p-6 (24px)", size: 24, tw: "w-6 h-6", role: "Desktop grid gutters & bento card internal insets" },
  { token: "p-8 (32px)", size: 32, tw: "w-8 h-8", role: "Component grouping gap & medium section separators" },
  { token: "p-12 (48px)", size: 48, tw: "w-12 h-12", role: "Major module separation & modal vertical margins" },
  { token: "py-24 (96px)", size: 96, tw: "w-24 h-24", role: "Standard section vertical breathing room across pages" },
];

const SECTION_VERTICAL_SPACING = [
  {
    name: "Hero & Brand Pillars",
    token: "py-24 sm:py-40",
    desktopPx: "160px",
    mobilePx: "96px",
    role: "High-impact storytelling, flagship hero intros & brand pillars",
    barPercent: 100,
  },
  {
    name: "Standard Section",
    token: "py-16 sm:py-24",
    desktopPx: "96px",
    mobilePx: "64px",
    role: "New arrivals, category showcases, reviews & footer navigation",
    barPercent: 65,
  },
  {
    name: "Compact Catalog / Filters",
    token: "py-8 sm:py-12",
    desktopPx: "48px",
    mobilePx: "32px",
    role: "Product filters, breadcrumbs, search bars & notification bars",
    barPercent: 35,
  },
];

export default function LayoutSpacingSpecimen() {
  const [activeDevice, setActiveDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [selectedSpacing, setSelectedSpacing] = useState<number>(16);

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
      {/* 1. CONTAINER ARCHITECTURE: 4 CANONICAL TIERS                   */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <MoveHorizontal className="w-4 h-4 text-[#111111]" />
              Container Width Architecture
            </h4>
            <p className="text-xs text-neutral-500 font-normal">
              Unified <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-[11px] font-mono text-neutral-800">&lt;Container maxWidth=&quot;...&quot; /&gt;</code> component scale
            </p>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">Click card to copy container token</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {CONTAINER_TIERS.map((tier) => {
            const isCopied = copiedToken === tier.propToken;

            return (
              <div
                key={tier.id}
                onClick={() => handleCopy(tier.propToken)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCopy(tier.propToken);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group border border-[#E8E8E5] rounded-2xl p-4 bg-white shadow-2xs hover:shadow-md hover:border-neutral-900 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                {/* Visual Proportional Mockup */}
                <div className="w-full h-28 rounded-xl bg-[#F8F8F6] border border-[#E8E8E5] p-3 flex flex-col justify-between group-hover:bg-[#F3F3EF] transition-colors relative overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[11px] font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded shadow-2xs border border-neutral-200">
                      {tier.widthLabel}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 bg-white/80 px-1.5 py-0.5 rounded">
                      {tier.padding.split(" ")[0]}
                    </span>
                  </div>

                  {/* Wireframe Page Simulation */}
                  <div className="w-full bg-white rounded-lg border border-neutral-200/90 p-2 shadow-2xs space-y-1.5 z-10">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-1">
                      <div className="h-1.5 w-8 bg-[#111111] rounded-full" />
                      <div className="flex gap-1">
                        <div className="h-1.5 w-3 bg-neutral-200 rounded-full" />
                        <div className="h-1.5 w-3 bg-neutral-200 rounded-full" />
                      </div>
                    </div>
                    {tier.layoutType === "showcase" && (
                      <div className="h-6 w-full bg-[#111111] rounded flex items-center justify-center text-[9px] font-mono text-[#FCD017] font-bold">
                        1600px Full Showcase
                      </div>
                    )}
                    {tier.layoutType === "catalog" && (
                      <div className="grid grid-cols-4 gap-1">
                        <div className="h-6 bg-[#FCD017]/30 border border-[#FCD017] rounded flex items-center justify-center text-[8px] font-mono font-bold text-neutral-800">1</div>
                        <div className="h-6 bg-neutral-100 rounded" />
                        <div className="h-6 bg-neutral-100 rounded" />
                        <div className="h-6 bg-neutral-100 rounded" />
                      </div>
                    )}
                    {tier.layoutType === "checkout" && (
                      <div className="grid grid-cols-3 gap-1">
                        <div className="col-span-2 h-6 bg-neutral-100 rounded p-1">
                          <div className="h-1.5 w-10 bg-neutral-300 rounded mb-1" />
                          <div className="h-1.5 w-6 bg-neutral-200 rounded" />
                        </div>
                        <div className="h-6 bg-[#111111] rounded flex items-center justify-center text-[8px] font-mono text-white font-bold">Pay</div>
                      </div>
                    )}
                    {tier.layoutType === "reading" && (
                      <div className="max-w-[75%] mx-auto space-y-1 py-1">
                        <div className="h-1.5 w-full bg-neutral-300 rounded" />
                        <div className="h-1.5 w-4/5 bg-neutral-200 rounded" />
                        <div className="h-1.5 w-3/5 bg-neutral-200 rounded" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-neutral-950 tracking-tight">
                      {tier.title}
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
                          {tier.propToken}
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                    {tier.usage}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500 border-t border-neutral-100">
                    <span>Gutter: <strong className="text-neutral-800">{tier.padding}</strong></span>
                    <span>{tier.cssClass}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. INTERACTIVE RESPONSIVE BREAKPOINT & PRODUCT GRID SIMULATOR   */}
      {/* ============================================================== */}
      <div className="border border-[#E8E8E5] rounded-2xl bg-white shadow-2xs overflow-hidden">
        {/* Header Toolbar */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAFAF8]">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#111111]" />
              Responsive Breakpoints &amp; Product Grid Simulator
            </h4>
            <p className="text-xs text-neutral-500">
              Select viewport to preview how footwear catalog cards adapt to screen size
            </p>
          </div>

          {/* Viewport Segmented Control */}
          <div className="flex items-center bg-neutral-200/70 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveDevice("mobile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeDevice === "mobile"
                  ? "bg-[#111111] text-white shadow-xs"
                  : "text-neutral-700 hover:text-neutral-950"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (2-Col)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDevice("tablet")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeDevice === "tablet"
                  ? "bg-[#111111] text-white shadow-xs"
                  : "text-neutral-700 hover:text-neutral-950"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet (3-Col)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDevice("desktop")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeDevice === "desktop"
                  ? "bg-[#111111] text-white shadow-xs"
                  : "text-neutral-700 hover:text-neutral-950"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (4-Col)</span>
            </button>
          </div>
        </div>

        {/* Device Frame Viewport */}
        <div className="p-4 sm:p-8 bg-[#F4F4F1] flex flex-col items-center justify-center min-h-[380px] overflow-hidden">
          {/* Active Blueprint Specs Banner */}
          <div className="mb-4 w-full max-w-4xl flex items-center justify-between text-xs font-mono bg-white px-4 py-2 rounded-xl border border-neutral-200 text-neutral-700 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-neutral-950">Active Viewport:</span>
              <span>
                {activeDevice === "mobile" && "Mobile • < 640px • 2 Columns"}
                {activeDevice === "tablet" && "Tablet • 640px – 1024px • 3 Columns"}
                {activeDevice === "desktop" && "Desktop • > 1024px • 4 Columns"}
              </span>
            </div>
            <span className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded font-bold text-neutral-900">
              {activeDevice === "mobile" && "grid-cols-2 gap-3 px-4"}
              {activeDevice === "tablet" && "sm:grid-cols-3 gap-4 sm:px-8"}
              {activeDevice === "desktop" && "xl:grid-cols-4 gap-6 xl:px-10"}
            </span>
          </div>

          {/* Scaled Interactive Window Mockup */}
          <div
            className={`bg-white rounded-2xl border-2 border-neutral-300 shadow-lg p-4 sm:p-6 transition-all duration-300 ease-out w-full ${
              activeDevice === "mobile"
                ? "max-w-[380px]"
                : activeDevice === "tablet"
                ? "max-w-[680px]"
                : "max-w-4xl"
            }`}
          >
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111111]" />
                <span className="font-bold text-xs tracking-wider uppercase text-neutral-900 font-mono">
                  VEYRO STOREFRONT
                </span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {activeDevice === "mobile" ? "375px" : activeDevice === "tablet" ? "768px" : "1540px"}
              </span>
            </div>

            {/* Dynamic Product Grid */}
            <div
              className={`grid transition-all duration-300 ${
                activeDevice === "mobile"
                  ? "grid-cols-2 gap-3"
                  : activeDevice === "tablet"
                  ? "grid-cols-3 gap-4"
                  : "grid-cols-4 gap-4"
              }`}
            >
              {[
                { name: "Apex Stealth Runner", price: "₹4,999", tag: "BESTSELLER", bg: "bg-[#111111]" },
                { name: "Velocity Low-Top", price: "₹3,799", tag: "NEW", bg: "bg-neutral-800" },
                { name: "Volt Nitro Trainer", price: "₹5,499", tag: "LIMITED", bg: "bg-neutral-900" },
                { name: "Aero Glide Minimal", price: "₹4,299", tag: "TRENDING", bg: "bg-neutral-700" },
              ]
                .slice(0, activeDevice === "tablet" ? 3 : 4)
                .map((product, idx) => (
                  <div
                    key={idx}
                    className="border border-[#E8E8E5] rounded-xl p-3 bg-[#FAFAF8] space-y-2.5 hover:border-neutral-900 transition-all group"
                  >
                    {/* Footwear Visual Swatch */}
                    <div className="w-full h-24 rounded-lg bg-neutral-200/80 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute top-1.5 left-1.5 bg-[#FCD017] text-[#111111] text-[9px] font-bold font-mono px-1.5 py-0.5 rounded shadow-2xs">
                        {product.tag}
                      </div>
                      <div className="text-neutral-400 font-mono text-[11px] font-bold">
                        SNEAKER {idx + 1}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-0.5">
                      <h6 className="text-xs font-bold text-neutral-900 truncate">
                        {product.name}
                      </h6>
                      <p className="text-[11px] font-mono font-bold text-neutral-600">
                        {product.price}
                      </p>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      className="w-full bg-[#111111] hover:bg-black text-white text-[10px] font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#FCD017]" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. SECTION VERTICAL BREATHING ROOM (PADDING CALIPERS)          */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <MoveVertical className="w-4 h-4 text-[#111111]" />
            Section Vertical Spacing (The Vertical Rhythm)
          </h4>
          <p className="text-xs text-neutral-500 font-normal">
            Standard vertical padding tokens controlling breathing room between landing page blocks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SECTION_VERTICAL_SPACING.map((spacing) => (
            <div
              key={spacing.name}
              className="border border-[#E8E8E5] rounded-2xl p-4 sm:p-5 bg-white shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    {spacing.name}
                  </span>
                  <span className="font-mono text-xs font-bold bg-[#111111] text-[#FCD017] px-2 py-0.5 rounded">
                    {spacing.token}
                  </span>
                </div>

                {/* Caliper Visual Representation */}
                <div className="h-20 bg-[#F8F8F6] rounded-xl border border-neutral-200/80 p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>Desktop: <strong className="text-neutral-900">{spacing.desktopPx}</strong></span>
                    <span>Mobile: <strong className="text-neutral-900">{spacing.mobilePx}</strong></span>
                  </div>

                  {/* Visual Caliper Bar */}
                  <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#111111] h-full rounded-full transition-all duration-500"
                      style={{ width: `${spacing.barPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
                    <span>top padding</span>
                    <span>content block</span>
                    <span>bottom padding</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                {spacing.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. THE 8PT SPACING RHYTHM SCALE RAMP                           */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FCD017] border border-neutral-900" />
              The 8pt Spacing Rhythm Ramp
            </h4>
            <p className="text-xs text-neutral-500 font-normal">
              Fixed dimensional scale based on 8px increments with 4px half-step for micro insets
            </p>
          </div>
          <span className="text-[11px] text-neutral-500 font-medium">Click any row to test live box dimension</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Spacing List Table */}
          <div className="lg:col-span-8 border border-[#E8E8E5] rounded-2xl bg-white shadow-2xs overflow-hidden">
            <div className="divide-y divide-neutral-100">
              {SPACING_SCALE.map((step) => {
                const isSelected = selectedSpacing === step.size;

                return (
                  <div
                    key={step.token}
                    onClick={() => setSelectedSpacing(step.size)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedSpacing(step.size);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`p-3 sm:px-4 sm:py-3 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[#FFFDEB] border-l-4 border-l-[#FCD017]"
                        : "hover:bg-[#F9F9F8]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex items-center justify-center">
                        <div
                          className="bg-[#111111] rounded-xs"
                          style={{
                            width: Math.min(step.size, 24),
                            height: Math.min(step.size, 24),
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-neutral-900">
                        {step.token}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 hidden sm:block truncate max-w-xs">
                      {step.role}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(step.token.split(" ")[0]);
                      }}
                      className="font-mono text-[11px] text-neutral-600 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded transition-colors flex items-center gap-1"
                    >
                      {copiedToken === step.token.split(" ")[0] ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 opacity-60" />
                          <span>{step.token.split(" ")[0]}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Dimension Sandbox */}
          <div className="lg:col-span-4 border border-[#E8E8E5] rounded-2xl p-5 bg-[#FAFAF8] shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase font-bold text-neutral-500">
                Interactive Dimension Tester
              </span>
              <h5 className="text-sm font-bold text-neutral-900">
                Active Step: {selectedSpacing}px
              </h5>
              <p className="text-xs text-neutral-600">
                Outer padding and margin set to exactly <code className="font-mono font-bold">{selectedSpacing}px</code>.
              </p>
            </div>

            {/* Interactive Box Viewport */}
            <div className="w-full h-44 bg-white rounded-xl border border-neutral-200 flex items-center justify-center p-3 relative overflow-hidden">
              <div
                className="bg-[#111111] rounded-lg transition-all duration-200 flex items-center justify-center shadow-md relative"
                style={{
                  padding: `${Math.min(selectedSpacing, 48)}px`,
                }}
              >
                <div className="bg-[#FCD017] text-[#111111] font-mono text-xs font-bold px-3 py-1.5 rounded shadow-2xs whitespace-nowrap">
                  Box Content
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-2 border-t border-neutral-200/80">
              <span>Padding: {selectedSpacing}px</span>
              <button
                type="button"
                onClick={() => setSelectedSpacing(16)}
                className="text-[11px] text-neutral-700 hover:text-black font-bold underline underline-offset-2"
              >
                Reset to 16px
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
