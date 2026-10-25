"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Layers,
  Search,
  Menu,
  Shield,
  PanelRight,
  Filter,
  Grid,
  Image as ImageIcon,
  Wallpaper,
  Code2,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

interface ZToken {
  token: string;
  elevation: number;
  name: string;
  count: number;
  role: string;
  primaryFile: string;
  sourceFiles: string[];
  icon: React.ComponentType<{ className?: string }>;
  tagBg: string;
  tagText: string;
  accentBorder: string;
}

const STOREFRONT_Z_TOKENS: ZToken[] = [
  {
    token: "z-[150]",
    elevation: 150,
    name: "Fullscreen Search Takeover",
    count: 1,
    role: "Full-viewport search takeover modal covering all page elements and browser toolbars",
    primaryFile: "ProductSearch.tsx:243",
    sourceFiles: ["src/components/features/ProductSearch.tsx:243"],
    icon: Search,
    tagBg: "bg-[#111111]",
    tagText: "text-[#FCD017]",
    accentBorder: "border-l-[#111111]",
  },
  {
    token: "z-[100]",
    elevation: 100,
    name: "Mobile Navigation Drawers",
    count: 2,
    role: "Mobile navigation slide-over menu and section filter drawers on handheld screens",
    primaryFile: "Navbar.tsx:497",
    sourceFiles: [
      "src/components/layout/Navbar.tsx:497",
      "src/app/section/[slug]/page.tsx:222",
    ],
    icon: Menu,
    tagBg: "bg-neutral-900",
    tagText: "text-white",
    accentBorder: "border-l-neutral-900",
  },
  {
    token: "z-[70]",
    elevation: 70,
    name: "Account Modal Toast Wrapper",
    count: 1,
    role: "In-modal alert toast wrapper floating above login & profile authentication forms",
    primaryFile: "AccountModal.tsx:390",
    sourceFiles: ["src/components/features/AccountModal.tsx:390"],
    icon: Shield,
    tagBg: "bg-neutral-800",
    tagText: "text-white",
    accentBorder: "border-l-neutral-800",
  },
  {
    token: "z-50",
    elevation: 50,
    name: "Modals, Drawers & Sticky Header",
    count: 22,
    role: "Sticky desktop Navbar, CartDrawer slide-over, WishlistDrawer & global Toast notifications",
    primaryFile: "Navbar.tsx:252 • CartDrawer.tsx:527",
    sourceFiles: [
      "src/components/layout/Navbar.tsx:252",
      "src/components/features/CartDrawer.tsx:527",
      "src/components/ui/Toast.tsx:71",
      "src/components/features/WishlistDrawer.tsx:182",
    ],
    icon: PanelRight,
    tagBg: "bg-neutral-900",
    tagText: "text-white",
    accentBorder: "border-l-neutral-900",
  },
  {
    token: "z-40",
    elevation: 40,
    name: "Announcement Bar & Checkout Header",
    count: 7,
    role: "Top yellow ticker announcement bar, sticky checkout navigation & order status headers",
    primaryFile: "AnnouncementBar.tsx:23 • checkout/page.tsx:968",
    sourceFiles: [
      "src/components/layout/AnnouncementBar.tsx:23",
      "src/app/checkout/page.tsx:968",
      "src/app/orders/[id]/page.tsx:239",
    ],
    icon: Sparkles,
    tagBg: "bg-[#FCD017]",
    tagText: "text-[#111111]",
    accentBorder: "border-l-[#FCD017]",
  },
  {
    token: "z-30",
    elevation: 30,
    name: "Catalog Sticky Filter Bars & Subnav",
    count: 11,
    role: "In-page sticky sub-nav category filter bars on Footwear & Watches catalog pages",
    primaryFile: "FootwearCatalog.tsx:428 • WatchesCatalog.tsx:581",
    sourceFiles: [
      "src/components/features/FootwearCatalog.tsx:428",
      "src/components/features/WatchesCatalog.tsx:581",
      "src/components/features/CartDrawer.tsx:584",
    ],
    icon: Filter,
    tagBg: "bg-neutral-700",
    tagText: "text-white",
    accentBorder: "border-l-neutral-700",
  },
  {
    token: "z-20",
    elevation: 20,
    name: "Interactive Buttons, Badges & Overlays",
    count: 25,
    role: "Product gallery zoom pills, category carousel arrows, QR checkout optical sweep",
    primaryFile: "ProductGallery.tsx:164 • checkout/page.tsx:2349",
    sourceFiles: [
      "src/components/features/ProductGallery.tsx:164",
      "src/app/checkout/page.tsx:2349",
      "src/components/features/BrandPillarsSection.tsx:192",
    ],
    icon: SlidersHorizontal,
    tagBg: "bg-neutral-600",
    tagText: "text-white",
    accentBorder: "border-l-neutral-600",
  },
  {
    token: "z-10",
    elevation: 10,
    name: "Standard Catalog & Content Cards",
    count: 99,
    role: "Product cards, editorial banners, footwear grids, hero slides & interactive tiles",
    primaryFile: "ProductCard.tsx:87 • FootwearSection.tsx",
    sourceFiles: [
      "src/components/features/ProductCard.tsx:87",
      "src/app/section/[slug]/page.tsx:80",
      "src/components/features/HeroPanel.tsx:141",
    ],
    icon: Grid,
    tagBg: "bg-neutral-500",
    tagText: "text-white",
    accentBorder: "border-l-neutral-500",
  },
  {
    token: "z-1",
    elevation: 1,
    name: "Image Readability Scrims",
    count: 9,
    role: "Dark linear & radial gradient underlays ensuring white text contrast over photos",
    primaryFile: "FootwearCatalog.tsx:393, 610",
    sourceFiles: [
      "src/components/features/FootwearCatalog.tsx:393",
      "src/components/features/FootwearCatalog.tsx:610",
      "src/components/features/AccountModal.tsx:427",
    ],
    icon: ImageIcon,
    tagBg: "bg-neutral-400",
    tagText: "text-neutral-900",
    accentBorder: "border-l-neutral-400",
  },
  {
    token: "z-0",
    elevation: 0,
    name: "Canvas Backgrounds & Track Rails",
    count: 8,
    role: "Background canvas fills, progress timeline tracks, watermark grids & aura layers",
    primaryFile: "orders/[id]/return/page.tsx:259 • CollectionsCatalog.tsx",
    sourceFiles: [
      "src/app/orders/[id]/return/page.tsx:259",
      "src/components/features/CollectionsCatalog.tsx:340",
      "src/components/features/WatchesCatalog.tsx:531",
    ],
    icon: Wallpaper,
    tagBg: "bg-neutral-300",
    tagText: "text-neutral-800",
    accentBorder: "border-l-neutral-300",
  },
];

export default function ZIndexSpecimen() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeToken, setActiveToken] = useState<string>("z-50");

  const handleCopy = (token: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 1800);
    }
  };

  const selectedTier = STOREFRONT_Z_TOKENS.find((t) => t.token === activeToken) || STOREFRONT_Z_TOKENS[3];

  return (
    <div className="space-y-8">
      {/* ============================================================== */}
      {/* 1. SECTION SUMMARY HEADER                                       */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FAFAF8] rounded-xl border border-[#E8E8E5]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#111111] text-[#FCD017] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
              Active Storefront Stacking Stack
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                100% Real Codebase
              </span>
            </h4>
            <p className="text-xs text-neutral-600">
              185 total z-index occurrences across 10 active tokens in the storefront
            </p>
          </div>
        </div>
        <div className="text-xs font-mono text-neutral-600 flex items-center gap-2">
          <span className="font-bold text-neutral-900">Highest: z-[150]</span>
          <span>•</span>
          <span className="font-bold text-neutral-900">Lowest: z-0</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN TWO-COLUMN VIEW: CARDS LIST + LIVE COMPONENT PREVIEW    */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 10 Real Stacking Tiers */}
        <div className="lg:col-span-7 border border-[#E8E8E5] rounded-2xl bg-white shadow-2xs overflow-hidden divide-y divide-neutral-100">
          {STOREFRONT_Z_TOKENS.map((item) => {
            const isSelected = activeToken === item.token;
            const isCopied = copiedToken === item.token;
            const Icon = item.icon;

            return (
              <div
                key={item.token}
                onClick={() => setActiveToken(item.token)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setActiveToken(item.token);
                  }
                }}
                role="button"
                tabIndex={0}
                className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer transition-colors border-l-4 ${
                  isSelected
                    ? `${item.accentBorder} bg-[#FAF9F6]`
                    : "border-l-transparent hover:bg-[#FBFBFA]"
                }`}
              >
                {/* Left token info */}
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg ${item.tagBg} ${item.tagText} shadow-2xs min-w-[62px] text-center shrink-0`}
                  >
                    {item.token}
                  </span>

                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Icon className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <h5 className="text-xs sm:text-sm font-bold text-neutral-950 truncate">
                        {item.name}
                      </h5>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 font-semibold">
                        {item.count} {item.count === 1 ? "use" : "uses"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-1">
                      {item.role}
                    </p>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(item.token);
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

        {/* Right Column: Active Token Inspector & Code Sources */}
        <div className="lg:col-span-5 border border-[#E8E8E5] rounded-2xl p-5 bg-[#FAFAF8] shadow-2xs space-y-4 sticky top-28">
          <div className="space-y-1 pb-3 border-b border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider">
                Storefront Stacking Layer
              </span>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${selectedTier.tagBg} ${selectedTier.tagText}`}>
                {selectedTier.token}
              </span>
            </div>
            <h5 className="text-sm font-bold text-neutral-950">
              {selectedTier.name}
            </h5>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {selectedTier.role}
            </p>
          </div>

          {/* Visual Layered UI Simulation */}
          <div className="relative h-72 bg-white rounded-xl border border-neutral-200 p-3 overflow-hidden flex flex-col justify-between">
            {/* Layer 0: Canvas & Ambient Background */}
            <div
              className={`absolute inset-0 bg-[#F4F4F1] transition-opacity duration-300 ${
                activeToken === "z-0" ? "opacity-100 ring-2 ring-neutral-900 bg-[#EFEFEA]" : "opacity-35"
              }`}
            >
              {/* Subtle canvas grid pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#d1d1cc_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />
            </div>

            {/* Layer 1: Scrim */}
            <div
              className={`absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#111111]/90 via-[#111111]/60 to-transparent p-2.5 z-1 transition-all duration-300 ${
                activeToken === "z-1" ? "opacity-100 ring-2 ring-[#FCD017]" : "opacity-35"
              }`}
            >
              <span className="text-[9px] font-mono text-white font-bold bg-[#111111]/80 px-2 py-0.5 rounded">
                z-1: Footwear Image Dark Readability Scrim (FootwearCatalog.tsx:393)
              </span>
            </div>

            {/* Layer 40: Announcement Bar */}
            <div
              className={`relative z-40 flex items-center justify-between p-1.5 bg-[#FCD017] text-[#111111] rounded text-[8.5px] font-mono transition-all duration-300 ${
                activeToken === "z-40"
                  ? "ring-2 ring-neutral-950 shadow-md font-bold"
                  : "opacity-75"
              }`}
            >
              <span className="font-bold flex items-center gap-1">
                <span>⚡</span> z-40: AnnouncementBar.tsx:23 (15% OFF DROPS)
              </span>
              <span className="text-[8px] opacity-75">checkout/page.tsx:968</span>
            </div>

            {/* Layer 50: Sticky Navbar Header */}
            <div
              className={`relative z-50 flex items-center justify-between p-2 bg-[#111111] text-white rounded text-[9px] font-mono transition-all duration-300 ${
                activeToken === "z-50"
                  ? "ring-2 ring-[#FCD017] shadow-lg"
                  : "opacity-75"
              }`}
            >
              <span className="font-bold text-[#FCD017]">z-50: Navbar.tsx:252</span>
              <div className="flex items-center gap-2 text-[8px]">
                <span className="bg-neutral-800 px-1.5 py-0.5 rounded">Bag (2)</span>
                <span>Account</span>
              </div>
            </div>

            {/* Layer 30: Sticky Filter Subnav Bar */}
            <div
              className={`relative z-30 flex items-center justify-between p-1.5 bg-neutral-100 rounded text-[8.5px] font-mono border border-neutral-200 transition-all duration-300 ${
                activeToken === "z-30"
                  ? "ring-2 ring-neutral-900 bg-neutral-200 font-bold text-neutral-950"
                  : "opacity-60 text-neutral-600"
              }`}
            >
              <span>z-30: Sticky Filter Subnav (FootwearCatalog.tsx:428)</span>
              <span>All / Retro / Low</span>
            </div>

            {/* Layer 10 & 20: Content Grid & Interactive Badges */}
            <div className="relative z-10 grid grid-cols-2 gap-2 mt-auto p-2 bg-white/95 rounded-lg border border-neutral-200 shadow-2xs">
              {/* Product Card 1 with z-20 Floating Action Pill */}
              <div
                className={`relative h-16 bg-neutral-50 rounded p-1.5 border border-neutral-200 flex flex-col justify-between transition-all duration-300 ${
                  activeToken === "z-10" ? "ring-2 ring-neutral-900 bg-white" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-neutral-500">ProductCard:87 (z-10)</span>
                  {/* Floating Action Pill z-20 */}
                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.5 rounded transition-all duration-300 ${
                      activeToken === "z-20"
                        ? "bg-[#111111] text-[#FCD017] font-bold ring-2 ring-[#FCD017] shadow-sm"
                        : "bg-white text-neutral-700 border border-neutral-300"
                    }`}
                  >
                    z-20: Pill
                  </span>
                </div>
                <span className="text-[8px] font-mono text-neutral-400">Sneaker SKU</span>
              </div>

              {/* Product Card 2 with z-20 Zoom Button */}
              <div
                className={`relative h-16 bg-neutral-50 rounded p-1.5 border border-neutral-200 flex flex-col justify-between transition-all duration-300 ${
                  activeToken === "z-10" ? "ring-2 ring-neutral-900 bg-white" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-neutral-500">FootwearCard (z-10)</span>
                  {/* Floating Action Pill z-20 */}
                  <span
                    className={`text-[8px] font-mono px-1.5 py-0.5 rounded transition-all duration-300 ${
                      activeToken === "z-20"
                        ? "bg-[#111111] text-[#FCD017] font-bold ring-2 ring-[#FCD017] shadow-sm"
                        : "bg-white text-neutral-700 border border-neutral-300"
                    }`}
                  >
                    z-20: Zoom
                  </span>
                </div>
                <span className="text-[8px] font-mono text-neutral-400">ProductGallery:164</span>
              </div>
            </div>

            {/* Layer 50: CartDrawer Slide-over */}
            <div
              className={`absolute top-0 right-0 w-36 h-full bg-white border-l-2 border-neutral-300 shadow-xl p-3 z-50 flex flex-col justify-between transition-all duration-300 ${
                activeToken === "z-50"
                  ? "translate-x-0 ring-2 ring-neutral-900 opacity-100"
                  : "translate-x-full opacity-0 pointer-events-none"
              }`}
            >
              <div className="space-y-1">
                <span className="text-[9px] font-mono font-bold text-neutral-900 block">
                  CartDrawer.tsx:527 (z-50)
                </span>
                <div className="h-2 bg-neutral-200 rounded w-full" />
                <div className="h-2 bg-neutral-100 rounded w-3/4" />
              </div>
              <div className="h-6 bg-[#111111] text-[#FCD017] rounded text-[8px] font-mono flex items-center justify-center font-bold">
                Checkout (z-50)
              </div>
            </div>

            {/* Layer 70: Account Modal Dialog + Top Toast Wrapper */}
            <div
              className={`absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 transition-all duration-300 ${
                activeToken === "z-[70]"
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {/* Floating Toast Notification on top of modal */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[70] bg-[#111111] text-white px-3 py-1 rounded-full shadow-2xl border border-[#FCD017] flex items-center gap-1.5 text-[8.5px] font-mono ring-2 ring-[#FCD017]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FCD017]" />
                <span className="font-bold text-[#FCD017]">z-[70]:</span>
                <span>Toast Alert (Floating Above Modal)</span>
              </div>

              {/* AccountModal Dialog Container */}
              <div className="w-52 bg-[#0c0c0e] border border-white/20 rounded-xl p-3 text-white shadow-2xl space-y-2 mt-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-1">
                  <span className="text-[9px] font-mono font-bold text-neutral-300">AccountModal.tsx (z-50)</span>
                  <span className="text-[7.5px] font-mono text-neutral-500">Member Portal</span>
                </div>
                <div className="space-y-1">
                  <div className="h-4 bg-white/5 rounded border border-white/10 px-2 flex items-center text-[7.5px] font-mono text-neutral-400">
                    user@veyro.com
                  </div>
                  <div className="h-4 bg-white/5 rounded border border-white/10 px-2 flex items-center text-[7.5px] font-mono text-neutral-400">
                    ••••••••
                  </div>
                </div>
                <div className="h-5 bg-[#FCD017] text-[#111111] rounded text-[8px] font-mono font-bold flex items-center justify-center">
                  Sign In (z-50 Dialog)
                </div>
              </div>
            </div>

            {/* Layer 100: Mobile Navigation Drawer */}
            <div
              className={`absolute top-0 left-0 w-40 h-full bg-white border-r-2 border-neutral-300 shadow-2xl p-3 z-[100] flex flex-col justify-between transition-all duration-300 ${
                activeToken === "z-[100]"
                  ? "translate-x-0 ring-2 ring-neutral-900 opacity-100"
                  : "-translate-x-full opacity-0 pointer-events-none"
              }`}
            >
              <div className="space-y-2">
                <span className="text-[9px] font-mono font-bold text-neutral-900 block border-b pb-1">
                  Navbar.tsx:497 (z-[100])
                </span>
                <div className="space-y-1 text-[8px] font-mono text-neutral-600">
                  <div className="p-1 bg-neutral-100 rounded">Footwear</div>
                  <div className="p-1 bg-neutral-100 rounded">Apparel</div>
                  <div className="p-1 bg-neutral-100 rounded">Timepieces</div>
                </div>
              </div>
              <span className="text-[8px] font-mono text-neutral-400">Mobile Menu Drawer</span>
            </div>

            {/* Layer 150: Fullscreen Search Takeover */}
            <div
              className={`absolute inset-0 bg-white z-[150] p-4 flex flex-col justify-between border-2 border-neutral-950 transition-all duration-300 ${
                activeToken === "z-[150]"
                  ? "opacity-100 scale-100"
                  : "opacity-0 pointer-events-none scale-95"
              }`}
            >
              <div className="flex items-center gap-2 border-b pb-2">
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-[10px] font-mono font-bold text-neutral-900">
                  ProductSearch.tsx:243 (z-[150])
                </span>
              </div>
              <span className="text-[9px] font-mono text-neutral-500">
                Full-screen search takeover overlay active
              </span>
            </div>
          </div>

          {/* Actual Source Files */}
          <div className="space-y-2 pt-2 border-t border-neutral-200/80">
            <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider block">
              Verified Codebase Locations
            </span>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {selectedTier.sourceFiles.map((file) => (
                <div
                  key={file}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-700 bg-white px-2 py-1 rounded border border-neutral-200"
                >
                  <Code2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{file}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
