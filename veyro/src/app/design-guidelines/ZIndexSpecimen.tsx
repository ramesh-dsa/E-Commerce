"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Layers,
  Code2,
  Bell,
  PanelRight,
  Menu,
  ChevronDown,
  Filter,
  Grid,
  Wallpaper,
} from "lucide-react";

interface ZTier {
  token: string;
  level: number;
  name: string;
  role: string;
  sourceFile: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgHighlight: string;
}

const Z_TIERS: ZTier[] = [
  {
    token: "z-60",
    level: 60,
    name: "Toasts & Critical Alerts",
    role: "Global notification toasts, order status banners, network error bars & floating snackbars",
    sourceFile: "Toast.tsx:71 • CartDrawer.tsx",
    icon: Bell,
    accentColor: "bg-[#FCD017] text-[#111111]",
    bgHighlight: "border-l-[#FCD017]",
  },
  {
    token: "z-50",
    level: 50,
    name: "Modal Sheets & Drawers",
    role: "CartDrawer slide-over, AccountModal dialog, full-screen search overlay & backdrop scrims",
    sourceFile: "CartDrawer.tsx:527 • AccountModal.tsx:412",
    icon: PanelRight,
    accentColor: "bg-[#111111] text-white",
    bgHighlight: "border-l-neutral-900",
  },
  {
    token: "z-40",
    level: 40,
    name: "Sticky Navigation Header",
    role: "Sticky top navigation navbar, announcement ticker bar & desktop category dropdown root",
    sourceFile: "Navbar.tsx:252 • Header.tsx",
    icon: Menu,
    accentColor: "bg-neutral-800 text-white",
    bgHighlight: "border-l-neutral-700",
  },
  {
    token: "z-30",
    level: 30,
    name: "Dropdowns & Popovers",
    role: "SortDropdown menu, autocomplete search results list, size guide popovers & tooltips",
    sourceFile: "SortDropdown.tsx:84 • ProductSearch.tsx",
    icon: ChevronDown,
    accentColor: "bg-neutral-700 text-white",
    bgHighlight: "border-l-neutral-600",
  },
  {
    token: "z-20",
    level: 20,
    name: "Sticky Subnav & Filter Bars",
    role: "Catalog sticky filter headers, category tab pills bar & in-page section jump nav",
    sourceFile: "ActiveFilterChips.tsx:30 • FootwearCatalog.tsx",
    icon: Filter,
    accentColor: "bg-neutral-600 text-white",
    bgHighlight: "border-l-neutral-500",
  },
  {
    token: "z-10",
    level: 10,
    name: "Standard Page Content",
    role: "Product catalog grid cards, typography headers, footwear imagery & interactive buttons",
    sourceFile: "ProductCard.tsx:45 • FootwearCatalog.tsx",
    icon: Grid,
    accentColor: "bg-neutral-500 text-white",
    bgHighlight: "border-l-neutral-400",
  },
  {
    token: "z-0",
    level: 0,
    name: "Canvas & Ambient Aura",
    role: "Deep background canvas, grid line textures, radial luxury gradient aura & watermark logos",
    sourceFile: "Footer.tsx:168 • BrandPillarsSection.tsx",
    icon: Wallpaper,
    accentColor: "bg-neutral-400 text-white",
    bgHighlight: "border-l-neutral-300",
  },
];

export default function ZIndexSpecimen() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<number>(50);

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
      {/* 1. SECTION HEADER                                              */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#111111]" />
            Canonical 7-Tier Stacking Context Ladder
          </h4>
          <p className="text-xs text-neutral-500 font-normal">
            Deterministic z-index tiers preventing overlay conflicts and accidental element overlaps
          </p>
        </div>
        <span className="text-[11px] text-neutral-400 font-medium">Click layer row to highlight on stack</span>
      </div>

      {/* ============================================================== */}
      {/* 2. TWO-COLUMN LAYOUT: STACK LADDER + VISUAL 3D CHOREOGRAPHY   */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ladder Rows */}
        <div className="lg:col-span-7 border border-[#E8E8E5] rounded-2xl bg-white shadow-2xs overflow-hidden divide-y divide-neutral-100">
          {Z_TIERS.map((tier) => {
            const isSelected = activeTier === tier.level;
            const isCopied = copiedToken === tier.token;
            const Icon = tier.icon;

            return (
              <div
                key={tier.token}
                onClick={() => setActiveTier(tier.level)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveTier(tier.level);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-4 cursor-pointer transition-colors border-l-4 ${
                  isSelected
                    ? `${tier.bgHighlight} bg-[#FAF9F6]`
                    : "border-l-transparent hover:bg-[#FBFBFA]"
                }`}
              >
                {/* Left info */}
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${tier.accentColor} shadow-2xs min-w-[54px] text-center`}
                  >
                    {tier.token}
                  </span>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-neutral-500" />
                      <h5 className="text-xs sm:text-sm font-bold text-neutral-950">
                        {tier.name}
                      </h5>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-1 max-w-sm">
                      {tier.role}
                    </p>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                    Layer {tier.level}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(tier.token);
                    }}
                    className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-2 py-1 rounded transition-colors flex items-center gap-1"
                    title="Click to copy token"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 opacity-60" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Visual Stacking Wireframe Simulation */}
        <div className="lg:col-span-5 border border-[#E8E8E5] rounded-2xl p-5 bg-[#FAFAF8] shadow-2xs space-y-4 sticky top-28">
          <div className="space-y-1 pb-3 border-b border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider">
                Live Stacking Isolation
              </span>
              <span className="text-xs font-mono font-bold bg-[#111111] text-[#FCD017] px-2 py-0.5 rounded">
                z-{activeTier}
              </span>
            </div>
            <h5 className="text-sm font-bold text-neutral-900">
              {Z_TIERS.find((t) => t.level === activeTier)?.name}
            </h5>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {Z_TIERS.find((t) => t.level === activeTier)?.role}
            </p>
          </div>

          {/* Visual Layered UI Simulation */}
          <div className="relative h-64 bg-white rounded-xl border border-neutral-200 p-4 overflow-hidden flex flex-col justify-between">
            {/* Layer 0: Background Canvas */}
            <div
              className={`absolute inset-0 bg-[#F4F4F1] p-3 transition-opacity duration-300 ${
                activeTier === 0 ? "opacity-100 ring-2 ring-neutral-900" : "opacity-30"
              }`}
            >
              <span className="text-[9px] font-mono text-neutral-500 font-bold">
                z-0: Ambient Canvas &amp; Aura
              </span>
            </div>

            {/* Layer 10: Content Grid */}
            <div
              className={`relative z-10 grid grid-cols-2 gap-2 mt-auto p-2 bg-white rounded-lg border border-neutral-200 shadow-2xs transition-all duration-300 ${
                activeTier === 10
                  ? "ring-2 ring-neutral-900 bg-white"
                  : activeTier < 10
                  ? "opacity-20"
                  : "opacity-60"
              }`}
            >
              <div className="h-8 bg-neutral-100 rounded text-[9px] font-mono flex items-center justify-center text-neutral-500">
                Product Card
              </div>
              <div className="h-8 bg-neutral-100 rounded text-[9px] font-mono flex items-center justify-center text-neutral-500">
                Product Card
              </div>
            </div>

            {/* Layer 20: Subnav Filter */}
            <div
              className={`relative z-20 flex items-center justify-between p-2 bg-neutral-100 rounded-lg border border-neutral-200 text-[9px] font-mono transition-all duration-300 ${
                activeTier === 20
                  ? "ring-2 ring-neutral-900 bg-neutral-200 text-neutral-950 font-bold"
                  : activeTier < 20
                  ? "opacity-20"
                  : "opacity-60"
              }`}
            >
              <span>z-20: Filter Chips Bar</span>
              <span>All / Footwear / Tees</span>
            </div>

            {/* Layer 40: Navbar */}
            <div
              className={`relative z-40 flex items-center justify-between p-2.5 bg-[#111111] text-white rounded-lg text-[9px] font-mono transition-all duration-300 ${
                activeTier === 40
                  ? "ring-2 ring-[#FCD017] shadow-md"
                  : activeTier < 40
                  ? "opacity-20"
                  : "opacity-80"
              }`}
            >
              <span className="font-bold text-[#FCD017]">z-40: VEYRO NAVBAR</span>
              <span>Cart (2)</span>
            </div>

            {/* Layer 50: Drawer / Modal */}
            <div
              className={`absolute top-0 right-0 w-36 h-full bg-white border-l-2 border-neutral-300 shadow-xl p-3 z-50 flex flex-col justify-between transition-all duration-300 ${
                activeTier === 50
                  ? "translate-x-0 ring-2 ring-neutral-900"
                  : activeTier < 50
                  ? "translate-x-full opacity-0"
                  : "translate-x-0 opacity-70"
              }`}
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-neutral-900 block">
                  z-50: CartDrawer
                </span>
                <div className="h-2 bg-neutral-200 rounded w-full" />
                <div className="h-2 bg-neutral-100 rounded w-3/4" />
              </div>
              <div className="h-6 bg-[#111111] text-[#FCD017] rounded text-[8px] font-mono flex items-center justify-center font-bold">
                Checkout
              </div>
            </div>

            {/* Layer 60: Toast Notification */}
            <div
              className={`absolute top-2 left-1/2 -translate-x-1/2 z-60 bg-[#111111] text-white px-3 py-1 rounded-full shadow-lg border border-neutral-700 flex items-center gap-1.5 text-[9px] font-mono transition-all duration-300 ${
                activeTier === 60
                  ? "scale-100 opacity-100 ring-2 ring-[#FCD017]"
                  : "scale-90 opacity-0 pointer-events-none"
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#FCD017]" />
              <span>z-60: Added to bag!</span>
            </div>
          </div>

          {/* Active Source File Reference */}
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-200/80">
            <span className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-neutral-400" />
              <span>{Z_TIERS.find((t) => t.level === activeTier)?.sourceFile}</span>
            </span>
            <span className="text-neutral-400">Strict Layer Order</span>
          </div>
        </div>
      </div>
    </div>
  );
}
