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
  codeSnippet: string;
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
    codeSnippet: `<div className="fixed inset-0 z-[150] bg-white flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-contain animate-in fade-in duration-200">`,
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
    codeSnippet: `<div className="lg:hidden fixed inset-0 z-[100] flex">
  <div className="relative flex w-4/5 max-w-sm h-[100dvh] flex-col justify-between bg-white px-5 py-4 ...">`,
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
    codeSnippet: `<Toast
  message={toast.message}
  variant={toast.variant}
  position="top"
  className="z-[70]"
/>`,
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
    codeSnippet: `<header className="sticky top-0 z-50 w-full bg-white">
<div className="fixed inset-0 z-50 flex justify-end select-none">
<div className="fixed z-50 mx-auto w-auto max-w-md ...">`,
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
    codeSnippet: `<div className="relative z-40 w-full bg-[#fcd017] text-[#111111] select-none flex items-center ...">
<div className="bg-white border-b border-neutral-200/80 sticky top-0 z-40 shadow ...">`,
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
    codeSnippet: `<section className="w-full bg-white border-b border-[#f0f0ed] py-3.5 px-5 sticky top-[74px] z-30">`,
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
    codeSnippet: `<button className="absolute top-4 right-4 z-20 bg-white/90 text-veyro-black border ...">
<div className="absolute inset-x-3 top-3 pointer-events-none z-20 animate-qr-optical-sweep ...">`,
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
    codeSnippet: `<div className="absolute top-2.5 left-2.5 pointer-events-none z-10">
  <Badge variant="trending">Trending</Badge>
</div>`,
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
    codeSnippet: `<div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent z-1" />
<div className="absolute inset-0 bg-radial from-transparent via-[#09090b]/40 to-[#09090b]/80 z-1" />`,
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
    codeSnippet: `<div className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#fcd017] z-0 rounded-full" />
<div className="absolute inset-0 z-0 overflow-hidden">`,
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

  const handleCopy = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedToken(text);
      setTimeout(() => setCopiedToken(null), 1800);
    }
  };

  const selectedTier =
    STOREFRONT_Z_TOKENS.find((t) => t.token === activeToken) ||
    STOREFRONT_Z_TOKENS[3];

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
      {/* 2. TWO-COLUMN LAYOUT: 10 REAL TOKENS + DEDICATED PREVIEW        */}
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

        {/* Right Column: Dedicated Component Preview & Real Code Snippet */}
        <div className="lg:col-span-5 border border-[#E8E8E5] rounded-2xl p-5 bg-[#FAFAF8] shadow-2xs space-y-4 sticky top-28">
          {/* Header */}
          <div className="space-y-1 pb-3 border-b border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider">
                Active Storefront Component
              </span>
              <span
                className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${selectedTier.tagBg} ${selectedTier.tagText}`}
              >
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

          {/* DEDICATED CLEAN COMPONENT PREVIEW (No overlapping layers!) */}
          <div className="min-h-[180px] bg-white rounded-xl border border-neutral-200 p-4 flex flex-col justify-center overflow-hidden">
            {/* 1. Fullscreen Search */}
            {selectedTier.token === "z-[150]" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs font-mono text-neutral-900 font-bold">
                    Search catalog, footwear, watches...
                  </span>
                  <span className="ml-auto text-[10px] font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-500">
                    ESC
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                    Trending Searches
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono bg-[#FAFAF8] border border-neutral-200 px-2 py-0.5 rounded">
                      Blanc Court
                    </span>
                    <span className="text-[10px] font-mono bg-[#FAFAF8] border border-neutral-200 px-2 py-0.5 rounded">
                      Retro High
                    </span>
                    <span className="text-[10px] font-mono bg-[#FAFAF8] border border-neutral-200 px-2 py-0.5 rounded">
                      Chronograph
                    </span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-neutral-500 pt-1">
                  Covers full viewport at <strong className="text-neutral-900">z-[150]</strong>
                </div>
              </div>
            )}

            {/* 2. Mobile Drawer */}
            {selectedTier.token === "z-[100]" && (
              <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50 space-y-2">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <span className="text-xs font-bold font-mono text-neutral-900 tracking-wider">
                    VEYRO MOBILE MENU
                  </span>
                  <span className="text-[9px] font-mono bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                    z-[100]
                  </span>
                </div>
                <div className="space-y-1 font-mono text-xs">
                  <div className="p-1.5 bg-white rounded border border-neutral-100 flex items-center justify-between">
                    <span>Footwear Catalog</span>
                    <span className="text-neutral-400">→</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-neutral-100 flex items-center justify-between">
                    <span>Apparel &amp; Tees</span>
                    <span className="text-neutral-400">→</span>
                  </div>
                  <div className="p-1.5 bg-white rounded border border-neutral-100 flex items-center justify-between">
                    <span>Luxury Timepieces</span>
                    <span className="text-neutral-400">→</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Account Modal Toast Wrapper */}
            {selectedTier.token === "z-[70]" && (
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-950 text-white space-y-3 text-center">
                <div className="inline-flex items-center gap-2 bg-[#111111] text-[#FCD017] border border-neutral-700 px-3 py-1.5 rounded-full text-xs font-mono shadow-xl mx-auto ring-2 ring-[#FCD017]/30">
                  <div className="w-2 h-2 rounded-full bg-[#FCD017] animate-pulse" />
                  <span>z-[70]: Toast.tsx floating inside AccountModal</span>
                </div>
                <p className="text-[11px] font-mono text-neutral-400">
                  Authentication feedback toast floating directly above modal forms
                </p>
              </div>
            )}

            {/* 4. Modals, Drawers & Header (z-50) */}
            {selectedTier.token === "z-50" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-[#111111] text-white rounded-lg text-xs font-mono">
                  <span className="font-bold text-[#FCD017]">Navbar.tsx:252</span>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="bg-neutral-800 px-2 py-0.5 rounded">CartDrawer:527</span>
                    <span>Toast:71</span>
                  </div>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-700">Slide-over Cart Sheet (z-50)</span>
                  <span className="font-bold text-neutral-900">₹4,299 Checkout</span>
                </div>
              </div>
            )}

            {/* 5. Announcement Bar (z-40) */}
            {selectedTier.token === "z-40" && (
              <div className="space-y-3">
                <div className="p-3 bg-[#FCD017] text-[#111111] rounded-lg font-mono text-xs font-bold flex items-center justify-between shadow-xs">
                  <span>⚡ 15% OFF YOUR FIRST ORDER | USE: VEYRO15</span>
                  <span className="text-[10px] bg-black text-[#FCD017] px-2 py-0.5 rounded">
                    z-40
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-600">
                  AnnouncementBar.tsx:23 sits at <strong className="text-neutral-950">z-40</strong>, immediately under the sticky header.
                </p>
              </div>
            )}

            {/* 6. Sticky Filter Subnav (z-30) */}
            {selectedTier.token === "z-30" && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-2.5 bg-neutral-100 rounded-lg border border-neutral-200 text-xs font-mono">
                  <span className="font-bold text-neutral-900">Filter Subnav Bar</span>
                  <div className="flex gap-1 text-[10px]">
                    <span className="bg-white border px-2 py-0.5 rounded font-bold">All</span>
                    <span className="bg-white border px-2 py-0.5 rounded text-neutral-500">Retro</span>
                    <span className="bg-white border px-2 py-0.5 rounded text-neutral-500">Low</span>
                  </div>
                </div>
                <p className="text-[11px] font-mono text-neutral-600">
                  FootwearCatalog.tsx:428 sticky subnav pins at <strong className="text-neutral-950">z-30</strong> during page scroll.
                </p>
              </div>
            )}

            {/* 7. Interactive Buttons & Overlays (z-20) */}
            {selectedTier.token === "z-20" && (
              <div className="space-y-2">
                <div className="relative h-28 bg-[#F4F4F1] rounded-lg border border-neutral-200 p-3 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
                    <span className="bg-white/95 text-neutral-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs border border-neutral-200">
                      z-20: Zoom
                    </span>
                    <span className="bg-white/95 text-neutral-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs border border-neutral-200">
                      z-20: Quick View
                    </span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">Product Image Container</span>
                </div>
                <p className="text-[11px] font-mono text-neutral-600">
                  ProductGallery.tsx:164 zoom &amp; action pills overlay sneaker media at <strong className="text-neutral-950">z-20</strong>.
                </p>
              </div>
            )}

            {/* 8. Content Cards (z-10) */}
            {selectedTier.token === "z-10" && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-lg border border-neutral-200 shadow-2xs flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-neutral-900 block font-mono">
                      Blanc Court Sneaker (ProductCard:87)
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      ₹4,299 • 24 In Stock
                    </span>
                  </div>
                  <span className="text-xs font-mono bg-neutral-100 text-neutral-800 px-2 py-1 rounded font-bold">
                    z-10 Content
                  </span>
                </div>
                <p className="text-[11px] font-mono text-neutral-600">
                  99 primary occurrences across 31 catalog files sit at base content elevation <strong className="text-neutral-950">z-10</strong>.
                </p>
              </div>
            )}

            {/* 9. Image Readability Scrims (z-1) */}
            {selectedTier.token === "z-1" && (
              <div className="space-y-2">
                <div className="relative h-24 bg-neutral-800 rounded-lg overflow-hidden p-3 flex flex-col justify-end">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-1" />
                  <div className="relative z-10 text-white space-y-0.5">
                    <span className="text-xs font-bold font-mono block">
                      FootwearCatalog.tsx:393 Scrim Layer
                    </span>
                    <span className="text-[10px] text-neutral-300 font-mono">
                      z-1 ensures white text contrast over bright footwear photography
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 10. Canvas & Rails (z-0) */}
            {selectedTier.token === "z-0" && (
              <div className="space-y-2.5">
                <div className="p-3 bg-[#FAF9F6] rounded-lg border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-700">
                    <span>Return Step 2 of 4</span>
                    <span className="font-bold text-neutral-900">z-0 Track Rail</span>
                  </div>
                  <div className="relative h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-1/2 bg-[#FCD017] rounded-full z-0" />
                  </div>
                </div>
                <p className="text-[11px] font-mono text-neutral-600">
                  orders/[id]/return/page.tsx:259 progress track and background canvases sit at <strong className="text-neutral-950">z-0</strong>.
                </p>
              </div>
            )}
          </div>

          {/* EXACT VERIFIED CODE SNIPPET (From the file!) */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-neutral-400" />
                Live Code Snippet ({selectedTier.primaryFile})
              </span>
              <button
                type="button"
                onClick={() => handleCopy(selectedTier.codeSnippet)}
                className="text-[10px] font-mono text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-semibold"
                title="Copy snippet"
              >
                {copiedToken === selectedTier.codeSnippet ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 opacity-60" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-[#111111] text-[#FCD017] text-[10.5px] font-mono rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed border border-neutral-800 shadow-inner">
              {selectedTier.codeSnippet}
            </pre>
          </div>

          {/* Verified Codebase Locations */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-200/80">
            <span className="text-[10px] font-mono uppercase font-bold text-neutral-500 tracking-wider block">
              Verified Codebase Locations ({selectedTier.count} {selectedTier.count === 1 ? "File" : "Files"})
            </span>
            <div className="space-y-1 max-h-32 overflow-y-auto">
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
