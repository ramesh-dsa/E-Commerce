import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Inter } from "next/font/google";
import { Logo, VeyroMark } from "@/components/ui/Logo";
import GuidelinesTreeSidebar from "./GuidelinesTreeSidebar";
import {
  Download,
  Check,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Code2,
  Info,
} from "lucide-react";

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

export const metadata: Metadata = {
  title: "VEYRO Brand & Design Guidelines",
  description: "Official brand and design guidelines for the VEYRO digital storefront.",
  robots: {
    index: false,
    follow: false,
  },
};

const COLOR_SWATCHES = [
  {
    name: "Ink",
    hex: "#111111",
    token: "--color-veyro-black",
    class: "text-neutral-900",
    role: "Primary text, deep solid contrast elements, logos, and authoritative accents",
    contrast: "18.88:1",
    rating: "AAA",
    isLightText: true,
  },
  {
    name: "Gold",
    hex: "#FCD017",
    token: "--color-veyro-yellow",
    class: "bg-veyro-yellow",
    role: "Primary CTAs, notification accents, active indicators. Never text on light surfaces.",
    contrast: "1.48:1",
    rating: "Fail on White (Background only)",
    isLightText: false,
  },
  {
    name: "Gold Hover",
    hex: "#E5BC05",
    token: "--color-veyro-yellow-dark",
    class: "bg-veyro-yellow-dark",
    role: "Hover and active state for Gold buttons and badges",
    contrast: "1.82:1",
    rating: "Fail on White (Background only)",
    isLightText: false,
  },
  {
    name: "Gold Tint",
    hex: "#FFF8E7",
    token: "--color-veyro-yellow-tint",
    class: "bg-[#FFF8E7]",
    role: "Subtle background tint for active accent badges and high-priority tags",
    contrast: "1.05:1",
    rating: "Surface Tint",
    isLightText: false,
  },
  {
    name: "Page White",
    hex: "#FFFFFF",
    token: "--background",
    class: "bg-white",
    role: "Universal application page canvas background",
    contrast: "1.00:1",
    rating: "Base Canvas",
    isLightText: false,
  },
  {
    name: "Section Surface",
    hex: "#F8F8F6",
    token: "--color-veyro-surface",
    class: "bg-[#F8F8F6]",
    role: "Default alternating section background",
    contrast: "1.05:1",
    rating: "Surface",
    isLightText: false,
  },
  {
    name: "Alternate Surface",
    hex: "#F3F3F0",
    token: "--color-veyro-surface-alt",
    class: "bg-[#F3F3F0]",
    role: "Card backgrounds, table headers, and secondary surfaces",
    contrast: "1.10:1",
    rating: "Surface",
    isLightText: false,
  },
  {
    name: "Border",
    hex: "#E8E8E5",
    token: "--color-veyro-border",
    class: "border-[#E8E8E5]",
    role: "Standard card borders, container outlines, and dividers",
    contrast: "1.18:1",
    rating: "Divider",
    isLightText: false,
  },
  {
    name: "Light Border",
    hex: "#F0F0ED",
    token: "--color-veyro-border-light",
    class: "border-[#F0F0ED]",
    role: "Subtle dividers, nested list borders, and quiet dividers",
    contrast: "1.12:1",
    rating: "Divider",
    isLightText: false,
  },
];

const NEUTRAL_RAMP = [
  {
    name: "Primary Text (neutral-900)",
    hex: "#171717",
    token: "text-neutral-900",
    role: "Headings, titles, primary body copy",
    contrast: "17.93:1",
    rating: "AAA",
  },
  {
    name: "Secondary Text (neutral-600)",
    hex: "#525252",
    token: "text-neutral-600",
    role: "Subtitles, descriptions, supporting copy, table headers",
    contrast: "7.81:1",
    rating: "AAA",
  },
  {
    name: "Muted Text (neutral-500)",
    hex: "#737373",
    token: "text-neutral-500",
    role: "Metadata, timestamps, SKU identifiers, eyebrows",
    contrast: "4.74:1",
    rating: "AA",
  },
  {
    name: "Placeholder (neutral-400)",
    hex: "#A3A3A3",
    token: "text-neutral-400",
    role: "Form input placeholders, disabled states, decorative icons only",
    contrast: "2.52:1",
    rating: "Fail (Non-text only)",
  },
];

const STATUS_COLORS = [
  {
    name: "Success",
    color: "Emerald",
    hex: "#059669",
    textClass: "text-emerald-700",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-200",
    contrast: "3.77:1",
    rating: "AA Large",
    usage: "Order completed, in-stock badges, positive validation",
  },
  {
    name: "Error",
    color: "Red",
    hex: "#DC2626",
    textClass: "text-red-700",
    bgClass: "bg-red-50",
    borderClass: "border-red-200",
    contrast: "4.83:1",
    rating: "AA",
    usage: "Form errors, payment failure, out of stock notices",
  },
  {
    name: "Warning",
    color: "Amber",
    hex: "#D97706",
    textClass: "text-amber-800",
    bgClass: "bg-amber-50",
    borderClass: "border-amber-200",
    contrast: "3.19:1",
    rating: "AA Large",
    usage: "Low stock alert, pending review, delivery delays",
  },
  {
    name: "Info",
    color: "Blue",
    hex: "#2563EB",
    textClass: "text-blue-700",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200",
    contrast: "5.17:1",
    rating: "AA",
    usage: "Informational banners, release notices, order tracking",
  },
];

const TYPE_SCALE = [
  { token: "text-2xs", size: "11px", lh: "16px", usage: "Micro badges, status indicators, fine metadata" },
  { token: "text-xs", size: "12px", lh: "16px", usage: "Eyebrows, uppercase tags, compact labels" },
  { token: "text-sm", size: "14px", lh: "20px", usage: "Secondary copy, form input text, table cells" },
  { token: "text-base", size: "16px", lh: "24px", usage: "Default body copy, standard buttons" },
  { token: "text-lg", size: "18px", lh: "28px", usage: "Sub-headings, emphasized copy, pricing callouts" },
  { token: "text-xl", size: "20px", lh: "28px", usage: "Card titles, compact section headings" },
  { token: "text-2xl", size: "24px", lh: "32px", usage: "Modal titles, sub-section headers" },
  { token: "text-3xl", size: "30px", lh: "36px", usage: "Major section titles, category headings" },
  { token: "text-4xl", size: "36px", lh: "40px", usage: "High-level page headers" },
  { token: "text-5xl", size: "48px", lh: "48px", usage: "Display titles" },
  { token: "text-6xl", size: "60px", lh: "60px", usage: "Hero display headings only" },
];

const Z_INDEX_LADDER = [
  { token: "z-60", val: 60, name: "z-toast", role: "Global notification toasts, critical alerts, sticky banners" },
  { token: "z-50", val: 50, name: "z-overlay", role: "Drawers, cart sheet, modal dialogs, backdrop scrims" },
  { token: "z-40", val: 40, name: "z-header", role: "Announcement bar, primary navigation navbar" },
  { token: "z-30", val: 30, name: "z-popover", role: "Dropdown menus, autocomplete lists, tooltips" },
  { token: "z-20", val: 20, name: "z-subnav", role: "In-section sticky filter bars, sub-nav tabs" },
  { token: "z-10", val: 10, name: "z-content", role: "Standard page content, text, media, card grids" },
  { token: "z-0", val: 0, name: "z-canvas", role: "Deep background canvas, grid lines, ambient patterns" },
];

const TRANSITION_ITEMS = [
  {
    num: "1",
    area: "Colour Consolidation",
    measurement: "553 hardcoded #111111 occurrences across 38 files; 170 hardcoded #fcd017 occurrences across 29 files; 13 prohibited grey tokens (8 zinc, 5 slate); non-standard hexes (#666666, #888888, #E8E8E5, #555555).",
    standard: "Consolidate onto @theme tokens (text-veyro-black, bg-veyro-black, bg-veyro-yellow) and canonical Tailwind neutral ramp (neutral-900 to neutral-400). Eliminate all raw hex literals.",
    effort: "Medium",
  },
  {
    num: "2",
    area: "Typography (Fonts & Arbitrary Sizes)",
    measurement: "5 font families loaded in layout.tsx (Geist Sans, Geist Mono, Dancing Script, Montserrat, Outfit); 796 arbitrary text sizes (text-[0-9.]+px) across 39 distinct sizes (led by text-[11px]: 312, text-[10px]: 178, text-[13px]: 54).",
    standard: "Consolidate onto 2 fonts: Archivo for headings and Inter for body/UI. Replace all arbitrary sizes with standard Tailwind scale tokens (text-2xs through text-6xl).",
    effort: "Medium",
  },
  {
    num: "3",
    area: "Shared Button Primitive & UI Primitives",
    measurement: "ui/Button.tsx imported in index but rendered 0 times across the storefront; 312 raw <button> tags across 44 files with divergent styles; lack of shared Input, Card, and Modal primitives.",
    standard: "Adopt ui/Button universally across all interactive actions (Primary Gold, Secondary Ink, Ghost/Outline with rounded-full). Build shared Input (rounded-lg), Card (rounded-xl), and Modal (rounded-xl).",
    effort: "High",
  },
  {
    num: "4",
    area: "Section Rhythm & Containers",
    measurement: "Container.tsx defines non-standard max-w-[1540px] with arbitrary padding px-4 sm:px-8 xl:px-10; irregular section paddings across pages.",
    standard: "Adopt the 4 standard container recipes (Wide 1440px, Standard 7xl, Reading 3xl, Form md) with universal padding px-4 sm:px-6 lg:px-8 and standardized section rhythm (py-16 sm:py-20 lg:py-24).",
    effort: "Medium",
  },
  {
    num: "5",
    area: "Scale Leaks: Radius, Shadows, Z-Index, Motion",
    measurement: "277 non-standard radii (110 arbitrary rounded-[...], 84 rounded-2xl, 52 plain rounded, 14 rounded-xs, 14 rounded-3xl, 3 rounded-sm); 49 distinct shadow definitions (118 shadow-xs, 55 shadow-md, 47 shadow-2xs); arbitrary z-indices (z-[70], z-[100], z-[150], z-1); 223 occurrences of transition-all; 2 animation libraries (35 files with motion/react vs 7 files with framer-motion).",
    standard: "Restrict to 4 radii (rounded-full, rounded-xl, rounded-lg, rounded-md), 3 shadows (shadow-sm, shadow-lg, shadow-2xl), and the canonical 7-tier z-index ladder. Eliminate transition-all in favor of specific transitions. Consolidate exclusively on motion/react.",
    effort: "Medium",
  },
  {
    num: "6",
    area: "Theme Consistency & Accessibility",
    measurement: "Dark islands in storefront: AccountModal (modal shell bg-[#0c0c0e] on line 412, inner panel bg-[#101013] on line 472), BrandPillarsSection (bg-[#0a0a0a] on line 150), Footer (bg-[#050505] on line 164); only 16 buttons (5.1%) have explicit focus styling, while 296 buttons (94.9%) lack focus rings.",
    standard: "Enforce light theme across all storefront views and modals (\"Light Everywhere, No Dark Islands\"). Apply universal 2px focus ring to all 312 interactive buttons.",
    effort: "Medium",
  },
];

const QUICK_REFERENCE = [
  {
    category: "1. Primary Text",
    follow: "text-neutral-900 or text-veyro-black",
    avoid: "Inline #111111, #000000, or deep navy #101828",
  },
  {
    category: "2. Primary Action / CTA",
    follow: "bg-veyro-yellow text-neutral-900 hover:bg-veyro-yellow-dark",
    avoid: "bg-black, bg-[#111111], or terracotta literals",
  },
  {
    category: "3. Gold Accent Usage",
    follow: "Gold as background (bg-[#FCD017]) or accent bar with Ink text",
    avoid: "Gold text on white surfaces (text-[#FCD017] fails at 1.48:1)",
  },
  {
    category: "4. Neutral Greys",
    follow: "Tailwind neutral scale (neutral-50 through neutral-950)",
    avoid: "zinc, slate, gray, stone, or hardcoded grey hexes",
  },
  {
    category: "5. Heading Typography",
    follow: "Archivo (font-heading, font-bold uppercase tracking-tight)",
    avoid: "Geist Sans headings, Montserrat, Dancing Script, serif fonts",
  },
  {
    category: "6. Font Sizes",
    follow: "Standard Tailwind scale (text-2xs through text-6xl)",
    avoid: "Arbitrary pixel sizes (text-[11px], text-[10px], text-[13px])",
  },
  {
    category: "7. Corner Radii",
    follow: "Canonical 4 tokens: rounded-full, rounded-xl, rounded-lg, rounded-md",
    avoid: "rounded-2xl, rounded-3xl, rounded-none, rounded-[2px]",
  },
  {
    category: "8. Elevation & Shadows",
    follow: "Canonical 3 tokens: shadow-sm, shadow-lg, shadow-2xl",
    avoid: "shadow-xs, shadow-md, shadow-xl, custom shadow-[...]",
  },
  {
    category: "9. Transitions",
    follow: "Specific transitions (transition-transform, transition-opacity, duration-200/300)",
    avoid: "transition-all, animating width, height, top, left",
  },
  {
    category: "10. Motion Library",
    follow: 'import { motion } from "motion/react"',
    avoid: 'import { motion } from "framer-motion"',
  },
  {
    category: "11. Z-Index Ladder",
    follow: "Canonical 7 tiers: z-0, z-10, z-20, z-30, z-40, z-50, z-60",
    avoid: "Arbitrary numbers: z-[70], z-[100], z-[150], z-[9999], z-1",
  },
  {
    category: "12. Components",
    follow: 'Shared primitives: <Button variant="primary" /> (rounded-full), <Input /> (rounded-lg)',
    avoid: "Raw <button> or <input> elements without shared styling or focus rings",
  },
];

export default function DesignGuidelinesPage() {
  return (
    <div
      className={`${inter.className} bg-white text-[#111111] min-h-screen selection:bg-[#FCD017] selection:text-[#111111]`}
      style={{
        fontFamily: inter.style.fontFamily,
      }}
    >
      {/* Top Banner Header */}
      <header className="border-b border-[#E8E8E5] bg-[#F8F8F6] pt-12 pb-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  VEYRO Design System
                </span>
                <span className="text-neutral-300">/</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                  Specification
                </span>
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111111] uppercase"
                style={{ fontFamily: archivo.style.fontFamily }}
              >
                Brand & Design Guidelines
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl leading-relaxed">
                The prescriptive brand, geometric, and visual system standard for the VEYRO digital storefront.
                The guidelines state the standard; where existing code disagrees, the rule wins and the code is scheduled for migration.
              </p>

              {/* Status Banner */}
              <div className="border-l-4 border-[#FCD017] bg-white p-4 rounded-r-lg shadow-2xs border-y border-r border-[#E8E8E5] max-w-3xl">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                  <p className="text-xs text-neutral-700 leading-relaxed font-medium">
                    This document defines the standard VEYRO is moving to. The live website on this branch does not follow it everywhere yet. Each section shows what the code uses today and what the standard requires. Section 12 lists the migration order.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-neutral-500">
                <span className="px-2.5 py-1 bg-white border border-[#E8E8E5] rounded-full text-neutral-900 font-semibold">
                  Version 1.0
                </span>
                <span>•</span>
                <span>Updated October 2026</span>
                <span>•</span>
                <span>Standard Specification &amp; Code Audit</span>
              </div>
            </div>

            <div className="shrink-0">
              <a
                href="/DESIGN.md"
                download="DESIGN.md"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FCD017] hover:bg-[#E5BC05] text-[#111111] font-semibold text-sm rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
              >
                <Download className="w-4 h-4 text-[#111111]" />
                <span>Download DESIGN.md</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-[16rem_minmax(0,1fr)] gap-12">
          {/* Navigation Rail */}
          <GuidelinesTreeSidebar />

          {/* Main Content Editorial Body */}
          <main className="min-w-0 space-y-16">
            {/* GROUP: FOUNDATIONS */}
            <div className="space-y-16">
              <div className="border-b border-[#111111] pb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Group I
                </span>
                <h2
                  className="text-2xl font-bold uppercase tracking-tight text-[#111111]"
                  style={{ fontFamily: archivo.style.fontFamily }}
                >
                  Foundations
                </h2>
              </div>

              {/* SECTION 01: BRAND ESSENCE */}
              <section id="brand-essence" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      01
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Brand Essence
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    The five architectural pillars and studio voice governing the VEYRO aesthetic.
                  </p>
                </div>

                {/* 5 Core Principles Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <span className="text-xs font-mono font-bold text-neutral-400">01</span>
                    <h4 className="text-sm font-bold uppercase text-neutral-900">One Brand Colour Story</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Unified contrast centered on Ink (<code className="text-xs font-mono">#111111</code>), disciplined Gold (<code className="text-xs font-mono">#FCD017</code>) accents, and clean off-white surfaces.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <span className="text-xs font-mono font-bold text-neutral-400">02</span>
                    <h4 className="text-sm font-bold uppercase text-neutral-900">One Neutral Family</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Exclusively use the Tailwind <code className="text-xs font-mono">neutral</code> ramp (<code className="text-xs font-mono">neutral-50</code> through <code className="text-xs font-mono">neutral-950</code>). Mixing grey families is forbidden.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <span className="text-xs font-mono font-bold text-neutral-400">03</span>
                    <h4 className="text-sm font-bold uppercase text-neutral-900">Tokens Before Literals</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      No hardcoded hex values or arbitrary CSS classes. Every colour, spacing, and typography value must reference defined tokens.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <span className="text-xs font-mono font-bold text-neutral-400">04</span>
                    <h4 className="text-sm font-bold uppercase text-neutral-900">Motion is Intentional</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Frequent animations must animate only <code className="text-xs font-mono">transform</code> and <code className="text-xs font-mono">opacity</code> to preserve 60fps performance and avoid layout reflows.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2 md:col-span-2 lg:col-span-1">
                    <span className="text-xs font-mono font-bold text-neutral-400">05</span>
                    <h4 className="text-sm font-bold uppercase text-neutral-900">Shared Components First</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      All UI elements must utilize centralized primitives (<code className="text-xs font-mono">ui/Button</code>, <code className="text-xs font-mono">ui/Input</code>, <code className="text-xs font-mono">ui/Card</code>, <code className="text-xs font-mono">ui/Modal</code>).
                    </p>
                  </div>
                </div>

                {/* Precedence Callout */}
                <div className="border-l-4 border-[#111111] bg-[#F8F8F6] p-4 rounded-r-lg">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
                    Rule Precedence
                  </p>
                  <p className="text-sm text-neutral-900 font-medium">
                    When a rule and existing code disagree, the rule wins and the code is scheduled for migration.
                  </p>
                </div>

                {/* The Studio Voice */}
                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      The Studio Voice
                    </span>
                    <p className="text-sm text-neutral-700 leading-relaxed italic">
                      The studio voice is architectural, brutalist, and declarative: &quot;Built For The Archive. We reject seasonal trends. Every piece is engineered with obsessive attention to fabric weight, structural drape, and minimalist utility.&quot;
                    </p>
                    <p className="text-xs text-neutral-500">
                      Source: <code className="font-mono text-neutral-800">src/components/features/BrandPillarsSection.tsx:163</code> and <code className="font-mono text-neutral-800">src/components/layout/Footer.tsx:181</code>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E8E8E5]">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block mb-3">
                      The Three Value Pillars (src/components/features/BrandPillarsSection.tsx)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#F8F8F6] p-4 rounded-lg space-y-1.5 border border-[#E8E8E5]">
                        <span className="text-xs font-mono font-bold text-neutral-400">01</span>
                        <h5 className="text-xs font-bold uppercase text-neutral-900">240+ GSM HEAVYWEIGHT</h5>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash. Engineered to feel substantial on the body.
                        </p>
                      </div>

                      <div className="bg-[#F8F8F6] p-4 rounded-lg space-y-1.5 border border-[#E8E8E5]">
                        <span className="text-xs font-mono font-bold text-neutral-400">02</span>
                        <h5 className="text-xs font-bold uppercase text-neutral-900">CRAFTED IN TIRUPUR</h5>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          Direct partnerships with India&apos;s most respected artisanal garment mills. Every stitch is placed with precision by master craftsmen.
                        </p>
                      </div>

                      <div className="bg-[#F8F8F6] p-4 rounded-lg space-y-1.5 border border-[#E8E8E5]">
                        <span className="text-xs font-mono font-bold text-neutral-400">03</span>
                        <h5 className="text-xs font-bold uppercase text-neutral-900">ZERO MIDDLEMEN</h5>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          Pure direct-to-consumer model. We bypass traditional retail markups to bring you premium luxury-grade fabrics at honest, accessible prices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 02: LOGO */}
              <section id="logo" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      02
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Logo
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Vector identity defined in <code className="text-xs font-mono text-neutral-800">src/components/ui/Logo.tsx</code>.
                  </p>
                </div>

                {/* Live Logo Renderings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* On Pure White Canvas */}
                  <div className="border border-[#E8E8E5] rounded-xl p-8 bg-white flex flex-col items-center justify-center space-y-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      On Pure White Canvas (variant=&quot;black&quot;)
                    </span>
                    <div className="py-6 flex items-center justify-center">
                      <Logo height={32} variant="black" />
                    </div>
                    <span className="text-[11px] font-mono text-neutral-500">
                      fill=&quot;#0B0B0B&quot; • viewBox=&quot;160 55 658 140&quot;
                    </span>
                  </div>

                  {/* On Ink Canvas */}
                  <div className="border border-neutral-800 rounded-xl p-8 bg-[#111111] flex flex-col items-center justify-center space-y-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      On Ink Canvas (variant=&quot;white&quot;)
                    </span>
                    <div className="py-6 flex items-center justify-center">
                      <Logo height={32} variant="white" />
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">
                      fill=&quot;#FFFFFF&quot; • viewBox=&quot;160 55 658 140&quot;
                    </span>
                  </div>
                </div>

                {/* Glyph Mark & Accent Variant */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-[#E8E8E5] rounded-xl p-6 bg-[#F8F8F6] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-neutral-900">Glyph Mark (VeyroMark)</h4>
                      <p className="text-xs text-neutral-600 mt-1">Standalone &quot;V&quot; vector glyph with fill-current.</p>
                      <span className="text-[10px] font-mono text-neutral-500 mt-2 block">viewBox=&quot;170 65 115 121&quot;</span>
                    </div>
                    <div className="p-4 bg-white border border-[#E8E8E5] rounded-lg">
                      <VeyroMark className="w-8 h-8 text-[#111111]" />
                    </div>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-6 bg-[#F8F8F6] flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-neutral-900">Accent Variant</h4>
                      <p className="text-xs text-neutral-600 mt-1">Wordmark featuring the 5px gold top accent bar.</p>
                      <span className="text-[10px] font-mono text-neutral-500 mt-2 block">variant=&quot;accent&quot;</span>
                    </div>
                    <div className="p-4 bg-white border border-[#E8E8E5] rounded-lg">
                      <Logo height={26} variant="accent" />
                    </div>
                  </div>
                </div>

                {/* Logo Specifications Table */}
                <div className="border border-[#E8E8E5] rounded-xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F8F6] border-b border-[#E8E8E5] text-neutral-900 uppercase font-semibold">
                        <tr>
                          <th className="py-3 px-4">Property</th>
                          <th className="py-3 px-4">Wordmark (Logo)</th>
                          <th className="py-3 px-4">Glyph (VeyroMark)</th>
                          <th className="py-3 px-4">Active Locations in Code</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E8E5] text-neutral-600">
                        <tr>
                          <td className="py-3 px-4 font-semibold text-neutral-900">Default Height</td>
                          <td className="py-3 px-4 font-mono">28px</td>
                          <td className="py-3 px-4 font-mono">20px (w-5 h-5)</td>
                          <td className="py-3 px-4 font-mono">Navbar (desktop 29-33px)</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-neutral-900">Minimum Height</td>
                          <td className="py-3 px-4 font-mono">26px</td>
                          <td className="py-3 px-4 font-mono">16px (w-4 h-4)</td>
                          <td className="py-3 px-4 font-mono">Navbar (mobile 26px), AccountModal</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-neutral-900">Clear Space</td>
                          <td className="py-3 px-4">50% glyph height on all 4 sides</td>
                          <td className="py-3 px-4">8px minimum clear margin</td>
                          <td className="py-3 px-4">Universal layout boundary</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-semibold text-neutral-900">Footer Scale</td>
                          <td className="py-3 px-4 font-mono">32px (variant=&quot;white&quot;)</td>
                          <td className="py-3 px-4">—</td>
                          <td className="py-3 px-4 font-mono">src/components/layout/Footer.tsx</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Do and Don't for Logo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-5 space-y-2">
                    <span className="text-xs font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" /> Logo Do
                    </span>
                    <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                      <li>Maintain at least 50% glyph height clear space on all four sides.</li>
                      <li>Use variant=&quot;black&quot; on white storefront surfaces.</li>
                      <li>Use variant=&quot;white&quot; on dark surfaces and modals.</li>
                    </ul>
                  </div>

                  <div className="border border-red-200 bg-red-50/50 rounded-xl p-5 space-y-2">
                    <span className="text-xs font-bold uppercase text-red-800 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-red-600" /> Logo Don&apos;t
                    </span>
                    <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                      <li>Never compress, stretch, tilt, or alter the vector aspect ratio.</li>
                      <li>Never render the wordmark smaller than 26px in height.</li>
                      <li>Never apply gradients, drop shadows, or outlines to the letterforms.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* SECTION 03: COLOR */}
              <section id="color" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      03
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Color
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Side-by-side comparison of active colour tokens versus canonical system standards.
                  </p>
                </div>

                {/* Side-by-Side: Current vs Standard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Current in code */}
                  <div className="border border-neutral-300 rounded-xl p-6 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                          CURRENT
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Current in code (main)
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Declared @theme tokens in globals.css (14 tokens):</span>
                          <p className="text-[11px] font-mono text-neutral-600 leading-relaxed bg-white p-2.5 rounded border border-neutral-200">
                            --color-veyro-yellow (#fcd017), --color-veyro-black (#111111), --color-veyro-charcoal (#1f1f1f), --color-veyro-muted (#999999), --color-veyro-subtle (#8e8e8e), --color-veyro-border (#e8e8e5), --color-veyro-surface (#f8f8f6), --color-veyro-surface-alt (#f3f3f0), --color-veyro-accent (#c44d25)...
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Top Hex Literals Used in Code:</span>
                          <ul className="grid grid-cols-2 gap-1.5 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li><span className="font-bold">#111111:</span> 553 occurrences</li>
                            <li><span className="font-bold">#FCD017:</span> 170 occurrences</li>
                            <li><span className="font-bold">#666666:</span> 39 occurrences</li>
                            <li><span className="font-bold">#101828:</span> 34 occurrences (FAQ)</li>
                            <li><span className="font-bold">#888888:</span> 34 occurrences</li>
                            <li><span className="font-bold">#E8E8E5:</span> 27 occurrences</li>
                            <li><span className="font-bold">#555555:</span> 23 occurrences</li>
                            <li><span className="font-bold">#FAFAFA:</span> 21 occurrences</li>
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Grey Families in Code:</span>
                          <p className="text-[11px] leading-relaxed">
                            <strong className="text-neutral-900">neutral:</strong> 2,104 tokens (dominant). Prohibited grey families: <strong className="text-red-700">zinc:</strong> 8, <strong className="text-red-700">slate:</strong> 5 (13 prohibited total).
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Active Dark Surfaces (Line Citations):</span>
                          <ul className="space-y-1 text-[11px] font-mono bg-white p-2.5 rounded border border-neutral-200">
                            <li>• AccountModal.tsx (line 412 shell: <code className="text-red-700">bg-[#0c0c0e]</code>; line 472 panel: <code className="text-red-700">bg-[#101013]</code>)</li>
                            <li>• BrandPillarsSection.tsx (line 150: <code className="text-red-700">bg-[#0a0a0a]</code>)</li>
                            <li>• Footer.tsx (line 164: <code className="text-red-700">bg-[#050505]</code>)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-neutral-900">Standard adoption: 2,104 of 2,117 (99.4% neutral ramp)</span>
                      <a href="#transition-guidance" className="text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
                        See Section 12 Transition Guidance →
                      </a>
                    </div>
                  </div>

                  {/* Right: Standard */}
                  <div className="border border-[#FCD017]/40 rounded-xl p-6 bg-white flex flex-col justify-between space-y-4 shadow-2xs">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#FCD017] text-[#111111]">
                          STANDARD
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Standard Specification
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2.5 rounded border border-[#E8E8E5] bg-[#F8F8F6]">
                            <span className="font-bold block text-neutral-900">Ink (#111111)</span>
                            <span className="text-[11px] text-neutral-500">18.88:1 AAA contrast on white</span>
                          </div>
                          <div className="p-2.5 rounded border border-[#FCD017]/40 bg-[#FFF8E7]">
                            <span className="font-bold block text-neutral-900">Gold (#FCD017)</span>
                            <span className="text-[11px] text-neutral-600">Primary CTA &amp; accents only</span>
                          </div>
                        </div>

                        <p className="text-xs text-neutral-600 leading-relaxed">
                          Pure light mode everywhere. Zero dark islands. No arbitrary hex literals in markup—all colours reference tokens or the Tailwind neutral scale.
                        </p>

                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900">
                          <strong>Gold Rule:</strong> Gold (<code className="font-mono">#FCD017</code>) has a failing 1.48:1 contrast on white and is restricted strictly to backgrounds with Ink text. Never use Gold text on light surfaces.
                        </div>

                        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs text-neutral-800">
                          <strong>Greys Rule:</strong> Sole permitted neutral family is Tailwind <code className="font-mono">neutral-50</code> to <code className="font-mono">neutral-950</code>. All <code className="font-mono">zinc</code> and <code className="font-mono">slate</code> are forbidden.
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                      Standard Token Set: Ink, Gold, Gold Hover, Gold Tint, Page White, Section Surface, Surface Alt, Border, Light Border.
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 04: TYPOGRAPHY */}
              <section id="typography" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      04
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Typography
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Side-by-side comparison of active storefront font families and sizes versus the two-font standard.
                  </p>
                </div>

                {/* Side-by-Side: Current vs Standard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Current in code */}
                  <div className="border border-neutral-300 rounded-xl p-6 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                          CURRENT
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Current in code (main)
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">5 Font Families Loaded in layout.tsx:</span>
                          <ul className="space-y-1.5 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• <strong className="text-neutral-900 font-sans">Geist Sans:</strong> Default base font across all 178 files (23 explicit font-sans).</li>
                            <li>• <strong className="text-neutral-900 font-mono">Geist Mono:</strong> 157 uses (font-mono) for SKUs, vouchers, and metadata tags.</li>
                            <li>• <strong className="text-neutral-900 font-sans">Dancing Script:</strong> 19 uses (.font-script) for cursive headlines.</li>
                            <li>• <strong className="text-neutral-900 font-sans">Montserrat:</strong> 17 uses (.font-luxury) for luxury banner accents.</li>
                            <li>• <strong className="text-neutral-900 font-sans">Outfit:</strong> 12 uses (--font-outfit) for subheadings.</li>
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Standard Tailwind Text Sizes (1,083 uses):</span>
                          <p className="text-[11px] font-mono bg-white p-2.5 rounded border border-neutral-200 leading-relaxed">
                            text-xs (578), text-sm (219), text-3xl (67), text-2xl (65), text-4xl (37), text-base (32), text-xl (31), text-lg (27), text-5xl (14), text-6xl (8), text-7xl (5).
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Top 8 Arbitrary Sizes (796 uses across 39 sizes):</span>
                          <ul className="grid grid-cols-2 gap-1.5 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• text-[11px]: 312</li>
                            <li>• text-[10px]: 178</li>
                            <li>• text-[13px]: 54</li>
                            <li>• text-[14px]: 45</li>
                            <li>• text-[9px]: 37</li>
                            <li>• text-[12px]: 20</li>
                            <li>• text-[15px]: 18</li>
                            <li>• text-[10.5px]: 17</li>
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-white p-2 rounded border border-neutral-200">
                            <span className="font-bold block text-neutral-900 mb-1">Weights:</span>
                            bold (587), semibold (295), medium (215), black (141), normal (55), extrabold (31), light (18).
                          </div>
                          <div className="bg-white p-2 rounded border border-neutral-200">
                            <span className="font-bold block text-neutral-900 mb-1">Tracking:</span>
                            tracking-wider (241), tracking-tight (107), tracking-widest (59), tracking-wide (44), bracketed (65).
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-neutral-900">Standard adoption: 1,083 of 1,879 (57.6% standard sizes)</span>
                      <a href="#transition-guidance" className="text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
                        See Section 12 Transition Guidance →
                      </a>
                    </div>
                  </div>

                  {/* Right: Standard */}
                  <div className="border border-[#FCD017]/40 rounded-xl p-6 bg-white flex flex-col justify-between space-y-4 shadow-2xs">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#FCD017] text-[#111111]">
                          STANDARD
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Standard Specification
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        {/* Archivo Live Specimen */}
                        <div className="border border-[#E8E8E5] p-3 rounded-lg bg-[#F8F8F6]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                            Heading Font: Archivo (font-heading)
                          </span>
                          <p className="text-xl font-bold uppercase tracking-tight text-[#111111]" style={{ fontFamily: archivo.style.fontFamily }}>
                            BUILT FOR THE ARCHIVE
                          </p>
                          <span className="text-[10px] text-neutral-500 mt-1 block">Weights: 500 (Medium), 600 (SemiBold), 700 (Bold).</span>
                        </div>

                        {/* Inter Live Specimen */}
                        <div className="border border-[#E8E8E5] p-3 rounded-lg bg-[#F8F8F6]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                            Body &amp; UI Font: Inter (font-body)
                          </span>
                          <p className="text-xs text-neutral-900 leading-relaxed" style={{ fontFamily: inter.style.fontFamily }}>
                            100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash.
                          </p>
                          <span className="text-[10px] text-neutral-500 mt-1 block">Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold).</span>
                        </div>

                        <div className="border-l-2 border-[#111111] pl-3 py-1 text-xs text-neutral-700">
                          <strong>Standard Rule:</strong> Only Archivo and Inter are permitted. Geist, Geist Mono, Dancing Script, Montserrat, and Outfit are outside the system and scheduled for migration.
                        </div>

                        <div className="p-2.5 bg-[#FFF8E7] rounded border border-[#FCD017]/30 text-xs text-neutral-900">
                          <strong>Scale Rule:</strong> All arbitrary sizes (e.g. <code className="font-mono">text-[11px]</code>) must map to canonical scale tokens (<code className="font-mono">text-2xs</code> through <code className="font-mono">text-6xl</code>).
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                      Standard Type Scale: text-2xs (11px) to text-6xl (60px).
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* GROUP: SYSTEM */}
            <div className="space-y-16">
              <div className="border-b border-[#111111] pb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Group II
                </span>
                <h2
                  className="text-2xl font-bold uppercase tracking-tight text-[#111111]"
                  style={{ fontFamily: archivo.style.fontFamily }}
                >
                  System
                </h2>
              </div>

              {/* SECTION 05: LAYOUT AND SPACING */}
              <section id="layout-spacing" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      05
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Layout and Spacing
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Side-by-side comparison of active container definitions versus the 4 canonical recipes.
                  </p>
                </div>

                {/* Side-by-Side: Current vs Standard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Current in code */}
                  <div className="border border-neutral-300 rounded-xl p-6 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                          CURRENT
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Current in code (main)
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Container.tsx Current Scale:</span>
                          <p className="text-[11px] font-mono bg-white p-2.5 rounded border border-neutral-200">
                            default: max-w-[1540px], wide: max-w-[1600px], narrow: max-w-[1200px], full: max-w-full. Padding: px-4 sm:px-8 xl:px-10.
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Active Max-Width Classes:</span>
                          <p className="text-[11px] font-mono bg-white p-2.5 rounded border border-neutral-200 leading-relaxed">
                            max-w-md (19), max-w-full (15), max-w-2xl (13), max-w-sm (11), max-w-xl (10), max-w-xs (10), max-w-6xl (8), max-w-lg (6), max-w-7xl (2), max-w-[1300px] (3), max-w-[1536px] (2).
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Active Section Paddings:</span>
                          <ul className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• BrandPillarsSection.tsx:153: py-24 sm:py-40</li>
                            <li>• Footer.tsx:164: py-16 sm:py-24</li>
                            <li>• Footer.tsx:372: py-14</li>
                            <li>• Storefront catalogs: py-8 sm:py-12</li>
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Product Grid Breakpoints:</span>
                          <p className="text-[11px] font-mono bg-white p-2.5 rounded border border-neutral-200">
                            grid-cols-2 (mobile) → sm:grid-cols-3 (tablet) → xl:grid-cols-4 (desktop).
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-neutral-900">Status: Non-standard 1540px container across codebase</span>
                      <a href="#transition-guidance" className="text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
                        See Section 12 Transition Guidance →
                      </a>
                    </div>
                  </div>

                  {/* Right: Standard */}
                  <div className="border border-[#FCD017]/40 rounded-xl p-6 bg-white flex flex-col justify-between space-y-4 shadow-2xs">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#FCD017] text-[#111111]">
                          STANDARD
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Standard Specification
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        {/* 4 Container Bars */}
                        <div className="space-y-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <strong className="text-neutral-900">Wide (max-w-[1440px])</strong>
                              <span className="text-neutral-500">Hero showcases, home grids</span>
                            </div>
                            <div className="w-full bg-[#F8F8F6] p-1 rounded border border-[#E8E8E5]">
                              <div className="w-full bg-neutral-900 text-white text-[9px] font-mono py-1 rounded text-center">1440px</div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <strong className="text-neutral-900">Standard (max-w-7xl)</strong>
                              <span className="text-neutral-500">Cart, checkout, account</span>
                            </div>
                            <div className="w-full bg-[#F8F8F6] p-1 rounded border border-[#E8E8E5]">
                              <div className="w-[88%] bg-neutral-800 text-white text-[9px] font-mono py-1 rounded text-center">1280px</div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <strong className="text-neutral-900">Reading (max-w-3xl)</strong>
                              <span className="text-neutral-500">Policies, FAQs</span>
                            </div>
                            <div className="w-full bg-[#F8F8F6] p-1 rounded border border-[#E8E8E5]">
                              <div className="w-[53%] bg-neutral-700 text-white text-[9px] font-mono py-1 rounded text-center">768px</div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <strong className="text-neutral-900">Form (max-w-md)</strong>
                              <span className="text-neutral-500">Login, dialogs</span>
                            </div>
                            <div className="w-full bg-[#F8F8F6] p-1 rounded border border-[#E8E8E5]">
                              <div className="w-[31%] bg-neutral-600 text-white text-[9px] font-mono py-1 rounded text-center">448px</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 bg-[#F8F8F6] rounded border border-[#E8E8E5] text-xs">
                          <strong>Universal Gutter:</strong> <code className="font-mono">px-4 sm:px-6 lg:px-8</code>. Standard section spacing: <code className="font-mono">py-16 sm:py-20 lg:py-24</code>.
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                      Standard containers consolidate 12 divergent max-widths into 4 clean recipes.
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 06: SHAPE AND ELEVATION */}
              <section id="shape-elevation" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      06
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Shape and Elevation
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Side-by-side comparison of active corner radii and shadows versus the 4-radius / 3-shadow standard.
                  </p>
                </div>

                {/* Side-by-Side: Current vs Standard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Current in code */}
                  <div className="border border-neutral-300 rounded-xl p-6 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                          CURRENT
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Current in code (main)
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Radii Uses in Code (1,010 total):</span>
                          <ul className="grid grid-cols-2 gap-1.5 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• rounded-full: 395</li>
                            <li>• rounded-lg: 187</li>
                            <li>• rounded-xl: 135</li>
                            <li className="text-red-700">• rounded-2xl: 84</li>
                            <li className="text-red-700">• plain rounded: 52</li>
                            <li className="text-red-700">• rounded-xs: 14</li>
                            <li>• rounded-md: 14</li>
                            <li className="text-red-700">• rounded-3xl: 14</li>
                            <li className="text-red-700">• rounded-sm: 3</li>
                            <li>• rounded-none: 2</li>
                            <li className="text-red-700 col-span-2">• arbitrary rounded-[...]: 110</li>
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Active Shadows in Code (421 uses across 49 values):</span>
                          <p className="text-[11px] font-mono bg-white p-2.5 rounded border border-neutral-200 leading-relaxed">
                            shadow-xs (118), shadow-sm (75), shadow-md (55), shadow-2xs (47), shadow-lg (21), shadow-2xl (19), shadow-xl (11), shadow-inner (7), arbitrary shadow-[...] (39).
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Most-Used Radii per Element Type:</span>
                          <ul className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• Cards: split between rounded-xl (111) and rounded-2xl (74)</li>
                            <li>• Buttons: raw tags have no radius (218), rounded-full (33), rounded-lg (40)</li>
                            <li>• Inputs: rounded-lg in catalogs; rounded-xl in AccountModal</li>
                            <li>• Modals: AccountModal uses rounded-2xl sm:rounded-3xl</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-neutral-900">Standard adoption: 733 of 1,010 (72.6% allowed radii)</span>
                      <a href="#transition-guidance" className="text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
                        See Section 12 Transition Guidance →
                      </a>
                    </div>
                  </div>

                  {/* Right: Standard */}
                  <div className="border border-[#FCD017]/40 rounded-xl p-6 bg-white flex flex-col justify-between space-y-4 shadow-2xs">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#FCD017] text-[#111111]">
                          STANDARD
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Standard Specification
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 border border-[#E8E8E5] rounded-xl text-center bg-[#F8F8F6]">
                            <div className="w-10 h-10 bg-[#FCD017] rounded-full mx-auto mb-1.5 flex items-center justify-center text-[10px] font-bold">Full</div>
                            <strong className="text-neutral-900 block">rounded-full</strong>
                            <span className="text-[10px] text-neutral-500">Buttons, chips, badges</span>
                          </div>

                          <div className="p-3 border border-[#E8E8E5] rounded-xl text-center bg-[#F8F8F6]">
                            <div className="w-10 h-10 bg-[#111111] text-white rounded-xl mx-auto mb-1.5 flex items-center justify-center text-[10px] font-bold">12px</div>
                            <strong className="text-neutral-900 block">rounded-xl</strong>
                            <span className="text-[10px] text-neutral-500">Cards, modal dialogs</span>
                          </div>

                          <div className="p-3 border border-[#E8E8E5] rounded-xl text-center bg-[#F8F8F6]">
                            <div className="w-10 h-10 bg-white border border-[#E8E8E5] rounded-lg mx-auto mb-1.5 flex items-center justify-center text-[10px] font-bold">8px</div>
                            <strong className="text-neutral-900 block">rounded-lg</strong>
                            <span className="text-[10px] text-neutral-500">Form inputs, frames</span>
                          </div>

                          <div className="p-3 border border-[#E8E8E5] rounded-xl text-center bg-[#F8F8F6]">
                            <div className="w-10 h-10 bg-white border border-[#E8E8E5] rounded-md mx-auto mb-1.5 flex items-center justify-center text-[10px] font-bold">6px</div>
                            <strong className="text-neutral-900 block">rounded-md</strong>
                            <span className="text-[10px] text-neutral-500">Toggles, micro switches</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-900">
                          <strong>Prohibited:</strong> <code className="font-mono">rounded-2xl</code>, <code className="font-mono">rounded-3xl</code>, plain <code className="font-mono">rounded</code>, <code className="font-mono">rounded-sm</code>, <code className="font-mono">rounded-xs</code>, and arbitrary pixel radii.
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                          <div className="p-2 border border-[#E8E8E5] rounded-lg shadow-sm">shadow-sm</div>
                          <div className="p-2 border border-[#E8E8E5] rounded-lg shadow-lg">shadow-lg</div>
                          <div className="p-2 border border-[#E8E8E5] rounded-lg shadow-2xl">shadow-2xl</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                      Standard Scale: Exactly 4 corner radii and 3 elevation shadow levels.
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 07: MOTION */}
              <section id="motion" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      07
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Motion
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Side-by-side comparison of active transition patterns versus transform-only standards.
                  </p>
                </div>

                {/* Side-by-Side: Current vs Standard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Current in code */}
                  <div className="border border-neutral-300 rounded-xl p-6 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                          CURRENT
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Current in code (main)
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Durations and Easings in Code:</span>
                          <ul className="grid grid-cols-2 gap-1.5 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• duration-200: 131</li>
                            <li>• duration-300: 113</li>
                            <li>• duration-150: 41</li>
                            <li>• duration-500: 21</li>
                            <li>• duration-700: 19</li>
                            <li>• duration-1000: 2</li>
                            <li>• ease-out: 105</li>
                            <li>• ease-in: 18</li>
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Transition-All Occurrences:</span>
                          <p className="text-[11px] font-mono bg-white p-2.5 rounded border border-neutral-200 text-red-700 font-bold">
                            transition-all: 223 occurrences across storefront
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Animation Libraries:</span>
                          <p className="text-[11px] font-mono bg-white p-2.5 rounded border border-neutral-200">
                            motion/react: 35 files • framer-motion: 7 files (dual library fragmentation)
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Files Animating Geometry (Height/Width/Offsets):</span>
                          <ul className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• src/app/faq/page.tsx (accordion height)</li>
                            <li>• src/components/features/CartDrawer.tsx (drawer slide offsets)</li>
                            <li>• src/app/orders/[id]/page.tsx &amp; return/page.tsx</li>
                            <li>• src/components/charts/chart-reveal-clip.tsx</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-neutral-900">Standard adoption: 108 of 331 (32.6% specific transitions, 223 transition-all)</span>
                      <a href="#transition-guidance" className="text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
                        See Section 12 Transition Guidance →
                      </a>
                    </div>
                  </div>

                  {/* Right: Standard */}
                  <div className="border border-[#FCD017]/40 rounded-xl p-6 bg-white flex flex-col justify-between space-y-4 shadow-2xs">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#FCD017] text-[#111111]">
                          STANDARD
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Standard Specification
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div className="p-3 bg-[#F8F8F6] rounded-lg border border-[#E8E8E5] space-y-1">
                          <strong className="text-neutral-900 block">Performance-First Rule:</strong>
                          <p className="text-xs text-neutral-600">
                            Animate <strong>only transform and opacity</strong> properties. Never animate geometry properties (<code className="font-mono">top</code>, <code className="font-mono">left</code>, <code className="font-mono">width</code>, <code className="font-mono">height</code>, <code className="font-mono">margin</code>).
                          </p>
                        </div>

                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 space-y-1">
                          <strong>Transition Rule:</strong>
                          <p>
                            Never use <code className="font-mono">transition-all</code>. Explicitly declare <code className="font-mono">transition-colors</code>, <code className="font-mono">transition-transform</code>, or <code className="font-mono">transition-opacity</code>.
                          </p>
                        </div>

                        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs space-y-1 text-neutral-800">
                          <strong>Library Standard:</strong>
                          <p>
                            Consolidate on <code className="font-mono">import &#123; motion &#125; from &quot;motion/react&quot;</code>. Deprecate <code className="font-mono">framer-motion</code>. Respect <code className="font-mono">prefers-reduced-motion</code> universally.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                      Standard Durations: duration-200 (micro), duration-300 (cards), duration-500 (modals).
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 08: Z-INDEX LADDER */}
              <section id="z-index-ladder" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      08
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Z-Index Ladder
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Side-by-side comparison of active stacking contexts versus the canonical 7-tier ladder.
                  </p>
                </div>

                {/* Side-by-Side: Current vs Standard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Current in code */}
                  <div className="border border-neutral-300 rounded-xl p-6 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                          CURRENT
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Current in code (main)
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Z-Index Values in Code (185 uses across 10 values):</span>
                          <ul className="space-y-1.5 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• <strong className="text-neutral-900">z-10:</strong> 99 uses (standard content in 31 files)</li>
                            <li>• <strong className="text-neutral-900">z-20:</strong> 25 uses (sub-nav filter bars in 15 files)</li>
                            <li>• <strong className="text-neutral-900">z-50:</strong> 22 uses (modals, drawers, dropdowns in 19 files)</li>
                            <li>• <strong className="text-neutral-900">z-30:</strong> 11 uses (dropdown menus in 10 files)</li>
                            <li className="text-red-700">• <strong className="text-red-700">z-1:</strong> 9 uses (scrims &amp; underlays in 4 files)</li>
                            <li>• <strong className="text-neutral-900">z-0:</strong> 8 uses (canvas backgrounds in 4 files)</li>
                            <li>• <strong className="text-neutral-900">z-40:</strong> 7 uses (headers and sticky bars in 6 files)</li>
                            <li className="text-red-700">• <strong className="text-red-700">z-[100]:</strong> 2 uses (Navbar mobile menu, section drawer)</li>
                            <li className="text-red-700">• <strong className="text-red-700">z-[70]:</strong> 1 use (AccountModal backdrop wrapper)</li>
                            <li className="text-red-700">• <strong className="text-red-700">z-[150]:</strong> 1 use (ProductSearch fullscreen modal)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-neutral-900">Standard adoption: 172 of 185 (93.0% canonical z-index tokens)</span>
                      <a href="#transition-guidance" className="text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
                        See Section 12 Transition Guidance →
                      </a>
                    </div>
                  </div>

                  {/* Right: Standard */}
                  <div className="border border-[#FCD017]/40 rounded-xl p-6 bg-white flex flex-col justify-between space-y-4 shadow-2xs">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#FCD017] text-[#111111]">
                          STANDARD
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Standard Specification
                        </h4>
                      </div>

                      <div className="space-y-2 text-xs text-neutral-700">
                        {Z_INDEX_LADDER.map((z, idx) => (
                          <div
                            key={z.token}
                            className="flex items-center justify-between p-2 rounded border border-[#E8E8E5]"
                            style={{ backgroundColor: idx === 0 ? "#FFF8E7" : idx === 1 ? "#F8F8F6" : "#FFFFFF" }}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono font-bold text-[10px] px-2 py-0.5 bg-neutral-900 text-white rounded">
                                {z.token}
                              </span>
                              <span className="text-xs font-bold text-neutral-900 uppercase">{z.name}</span>
                            </div>
                            <span className="text-[10px] text-neutral-500 font-mono">Layer {z.val}</span>
                          </div>
                        ))}

                        <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-900 mt-2">
                          <strong>Ladder Rule:</strong> Arbitrary z-indexes (<code className="font-mono">z-[70]</code>, <code className="font-mono">z-[100]</code>, <code className="font-mono">z-[150]</code>, <code className="font-mono">z-1</code>) are prohibited. All stacking contexts must fit into layers 0 to 60.
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                      Standard Ladder: z-0 (Canvas) to z-60 (Toasts &amp; Critical Alerts).
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* GROUP: APPLICATION */}
            <div className="space-y-16">
              <div className="border-b border-[#111111] pb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Group III
                </span>
                <h2
                  className="text-2xl font-bold uppercase tracking-tight text-[#111111]"
                  style={{ fontFamily: archivo.style.fontFamily }}
                >
                  Application
                </h2>
              </div>

              {/* SECTION 09: COMPONENTS */}
              <section id="components" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      09
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Components
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Side-by-side comparison of active inline elements versus shared design system primitives.
                  </p>
                </div>

                {/* Side-by-Side: Current vs Standard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Current in code */}
                  <div className="border border-neutral-300 rounded-xl p-6 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                          CURRENT
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Current in code (main)
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Raw Button Elements vs Shared ui/Button:</span>
                          <ul className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• <strong className="text-red-700">Raw &lt;button&gt; tags:</strong> 312 across 44 files</li>
                            <li>• <strong className="text-neutral-900">ui/Button renders:</strong> 0 renders in JSX</li>
                            <li>• <strong className="text-neutral-900">Button focus styling:</strong> 16 with focus ring vs 296 without</li>
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Primary Button Style Combinations:</span>
                          <ul className="grid grid-cols-2 gap-1.5 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• bg-neutral-900 + rounded-lg: 6</li>
                            <li>• dark-bg + no-radius: 6</li>
                            <li>• dark-bg + rounded-full: 5</li>
                            <li>• dark-bg + rounded-lg: 4</li>
                            <li>• bg-neutral-900 + rounded-xl: 3</li>
                            <li>• bg-black + no-radius: 2</li>
                          </ul>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Active Inputs and Cards:</span>
                          <p className="text-[11px] leading-relaxed bg-white p-2.5 rounded border border-neutral-200">
                            No shared <code className="font-mono">ui/Input</code> or <code className="font-mono">ui/Card</code> primitives. Cards use inline divs split between <code className="font-mono">rounded-xl</code> (111) and <code className="font-mono">rounded-2xl</code> (74). Inputs use inline tags with mixed radii.
                          </p>
                        </div>

                        <div>
                          <span className="font-bold text-neutral-900 block mb-1">Active Modals &amp; Drawers in Code:</span>
                          <ul className="space-y-1 font-mono text-[11px] bg-white p-2.5 rounded border border-neutral-200">
                            <li>• AccountModal.tsx: bg-[#0c0c0e], z-[70], rounded-2xl sm:rounded-3xl</li>
                            <li>• CartDrawer.tsx: bg-white, z-50, right full-height slide-over</li>
                            <li>• ProductSearch.tsx: bg-white, z-[150], fullscreen overlay</li>
                            <li>• WatchFilterSidebar.tsx: bg-white, z-50, filter drawer</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-neutral-900">Standard adoption: 0 of 312 action buttons using shared ui/Button (0.0%)</span>
                      <a href="#transition-guidance" className="text-neutral-500 hover:text-neutral-900 underline underline-offset-2">
                        See Section 12 Transition Guidance →
                      </a>
                    </div>
                  </div>

                  {/* Right: Standard */}
                  <div className="border border-[#FCD017]/40 rounded-xl p-6 bg-white flex flex-col justify-between space-y-4 shadow-2xs">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                        <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-[#FCD017] text-[#111111]">
                          STANDARD
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Standard Specification
                        </h4>
                      </div>

                      <div className="space-y-3 text-xs text-neutral-700">
                        {/* Live Button Specimens */}
                        <div className="space-y-2">
                          <span className="font-bold text-neutral-900 block text-xs">Standard ui/Button Primitives:</span>
                          <div className="flex flex-wrap gap-2.5">
                            <button
                              type="button"
                              className="px-5 py-2 bg-[#FCD017] hover:bg-[#E5BC05] text-[#111111] font-semibold text-xs rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                            >
                              Primary Gold
                            </button>
                            <button
                              type="button"
                              className="px-5 py-2 bg-[#111111] hover:bg-neutral-800 text-white font-semibold text-xs rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                            >
                              Secondary Ink
                            </button>
                            <button
                              type="button"
                              className="px-5 py-2 bg-transparent border border-neutral-300 hover:border-neutral-900 text-[#111111] font-semibold text-xs rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                            >
                              Outline Ghost
                            </button>
                          </div>
                        </div>

                        {/* Standard Input Specimen */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-700 block">
                            Standard Input (ui/Input)
                          </label>
                          <input
                            type="text"
                            readOnly
                            value="Standard input with rounded-lg and 2px focus ring"
                            className="w-full px-3 py-2 text-xs bg-white border border-[#E8E8E5] rounded-lg text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                          />
                        </div>

                        {/* Standard Card Specimen */}
                        <div className="p-3 border border-[#E8E8E5] rounded-xl bg-white shadow-sm space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">[ 001 ] STANDARD CARD</span>
                          <h6 className="text-xs font-bold text-neutral-900">Architectural Heavyweight Tee</h6>
                          <p className="text-[11px] text-neutral-600">rounded-xl • border #E8E8E5 • shadow-sm hover:shadow-lg</p>
                        </div>

                        <div className="p-2.5 bg-[#FFF8E7] rounded border border-[#FCD017]/30 text-xs text-neutral-900">
                          <strong>Standard Overlay Rule:</strong> Centered modals (<code className="font-mono">ui/Modal</code>) use <code className="font-mono">rounded-xl</code> with <code className="font-mono">shadow-2xl</code> on white canvas. Drawers use <code className="font-mono">z-50</code>.
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                      Standard Component Architecture: Centralized primitives for all actions and inputs.
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 10: ARCHITECTURE */}
              <section id="architecture" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      10
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Architecture
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Repository structure, naming conventions, Client Component rules, and utility helpers.
                  </p>
                </div>

                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Repository Directory Structure
                  </h4>
                  <pre className="p-4 bg-[#F8F8F6] rounded-lg font-mono text-xs text-neutral-800 leading-relaxed overflow-x-auto">
{`veyro/src/
├── app/                  # Next.js App Router routes, storefront pages, API handlers
├── components/
│   ├── layout/           # Global shell components (Navbar, Footer, SmoothScrolling)
│   ├── features/         # Feature modules (Catalog, Cart, ProductDetail, BrandPillars)
│   ├── ui/               # Shared design system primitives (Logo, Button, Container, Badge)
│   └── charts/           # Admin visualization charts (excluded from storefront)
├── context/              # React Context state providers (Cart, Wishlist, User, Reviews)
├── lib/                  # Utilities, formatters, and class merging (utils.ts)
├── types/                # TypeScript shared interfaces and types
└── data/                 # Static catalog fixtures and mock data`}
                  </pre>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <h5 className="text-xs font-bold uppercase text-neutral-900">Naming Conventions</h5>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      PascalCase for React components (<code className="font-mono">ProductCard.tsx</code>); camelCase for hooks and utilities (<code className="font-mono">useCart.ts</code>, <code className="font-mono">formatPrice.ts</code>).
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <h5 className="text-xs font-bold uppercase text-neutral-900">Client Component Rules</h5>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Mark files with <code className="font-mono">&quot;use client&quot;</code> only when using React hooks, browser events, or window APIs. Push client component boundaries down to leaf nodes.
                    </p>
                  </div>
                </div>

                <div className="border border-[#E8E8E5] rounded-xl p-5 bg-[#F8F8F6] space-y-2">
                  <h5 className="text-xs font-bold uppercase text-neutral-900">Class Name Utility (cn)</h5>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Use <code className="font-mono text-neutral-900">cn()</code> from <code className="font-mono text-neutral-800">src/lib/utils.ts</code> (combining <code className="font-mono">clsx</code> and <code className="font-mono">tailwind-merge</code>) whenever combining dynamic and conditional classes.
                  </p>
                </div>
              </section>

              {/* SECTION 11: ACCESSIBILITY */}
              <section id="accessibility" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      11
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Accessibility
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Mandatory standards for focus visibility, touch targets, contrast, and reduced motion.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <h4 className="text-xs font-bold uppercase text-neutral-900">Focus-Visible Ring</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Every interactive element must display a visible 2px outline with 2px offset: <code className="font-mono text-neutral-800">focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]</code>.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <h4 className="text-xs font-bold uppercase text-neutral-900">Icon-Only Buttons</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Every button lacking visible label text must have an explicit, descriptive <code className="font-mono text-neutral-800">aria-label</code> attribute.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <h4 className="text-xs font-bold uppercase text-neutral-900">Touch Target Dimensions</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      All mobile interactive elements must measure at least 44px by 44px to satisfy touch accessibility requirements.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <h4 className="text-xs font-bold uppercase text-neutral-900">Heading Order</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Exactly one <code className="font-mono text-neutral-800">&lt;h1&gt;</code> per page; heading hierarchy must proceed sequentially (<code className="font-mono text-neutral-800">h2 &gt; h3 &gt; h4</code>) without skipping levels.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* GROUP: GOVERNANCE */}
            <div className="space-y-16">
              <div className="border-b border-[#111111] pb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Group IV
                </span>
                <h2
                  className="text-2xl font-bold uppercase tracking-tight text-[#111111]"
                  style={{ fontFamily: archivo.style.fontFamily }}
                >
                  Governance
                </h2>
              </div>

              {/* SECTION 12: TRANSITION GUIDANCE */}
              <section id="transition-guidance" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      12
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Transition Guidance
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    An honest audit of gaps between the standard and the current branch code, in order of impact.
                  </p>
                </div>

                {/* Transition Guidance Table */}
                <div className="border border-[#E8E8E5] rounded-xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F8F6] border-b border-[#E8E8E5] text-neutral-900 uppercase font-semibold">
                        <tr>
                          <th className="py-3 px-4 w-12">#</th>
                          <th className="py-3 px-4 w-48">Area</th>
                          <th className="py-3 px-4">Current Code Measurements</th>
                          <th className="py-3 px-4">Standard to Adopt</th>
                          <th className="py-3 px-4 w-24">Effort</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E8E5] text-neutral-600">
                        {TRANSITION_ITEMS.map((item) => (
                          <tr key={item.num}>
                            <td className="py-3 px-4 font-mono font-bold text-neutral-900">{item.num}</td>
                            <td className="py-3 px-4 font-semibold text-neutral-900">{item.area}</td>
                            <td className="py-3 px-4 leading-relaxed">{item.measurement}</td>
                            <td className="py-3 px-4 leading-relaxed font-medium text-neutral-800">{item.standard}</td>
                            <td className="py-3 px-4 font-semibold">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] uppercase ${
                                  item.effort === "High"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {item.effort}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Measurement Methodology Note */}
                <div className="border border-[#E8E8E5] rounded-xl p-5 bg-[#F8F8F6] space-y-3 text-xs text-neutral-600 leading-relaxed">
                  <span className="font-bold uppercase tracking-wider text-neutral-900 block">
                    How Counts Were Measured
                  </span>
                  <p>
                    All storefront counts were measured across the exactly 178 storefront source files in <code className="font-mono text-neutral-800">veyro/src/</code> (including globals.css, storefront layouts, pages, feature components, and UI primitives). Excluded: <code className="font-mono text-neutral-800">src/app/admin/**</code>, <code className="font-mono text-neutral-800">src/components/admin/**</code>, and the documentation page <code className="font-mono text-neutral-800">src/app/design-guidelines/**</code>. Static AST extraction and regex pattern analysis were executed directly across the codebase on this branch:
                  </p>
                  <ul className="space-y-1.5 list-disc list-inside font-mono text-[11px] text-neutral-700">
                    <li><strong>Colors &amp; Greys:</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;#[0-9a-fA-F]{'{3,8}'}&quot; src/app src/components src/context src/lib</code> (#111111: 553 in 38 files, #fcd017: 170 in 29 files); <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;(text|bg|border)-(neutral|zinc|slate)-[0-9]+&quot;</code> (neutral: 2,104, zinc: 8, slate: 5)</li>
                    <li><strong>Arbitrary text sizes (796 occurrences, 39 distinct sizes):</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;text-\[[0-9.]+px\]&quot; src/app src/components src/context src/lib | wc -l</code> (Top 3: text-[11px]: 312, text-[10px]: 178, text-[13px]: 54)</li>
                    <li><strong>Standard text sizes (1,083 occurrences):</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b&quot; src/app src/components src/context src/lib | wc -l</code></li>
                    <li><strong>Font weights &amp; tracking:</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;\bfont-(light|normal|medium|semibold|bold|extrabold|black)\b&quot;</code> (1,342); <code className="text-neutral-900">grep -roE &quot;\btracking-(tight|normal|wide|wider|widest)\b&quot;</code> (451)</li>
                    <li><strong>Layout widths &amp; paddings:</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;\bmax-w-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full|\[[^]]+\])\b&quot;</code>; <code className="text-neutral-900">grep -roE &quot;\bpx-(4|6|8|10|12|\[[^]]+\])\b&quot;</code></li>
                    <li><strong>Allowed radii (733 occurrences):</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;\brounded-(full|xl|lg|md|none)\b&quot; src/app src/components src/context src/lib | wc -l</code></li>
                    <li><strong>Non-standard radii (277 total outside canonical scale):</strong> rounded-2xl (84: <code className="text-neutral-900">\brounded-2xl\b</code>), rounded-3xl (14: <code className="text-neutral-900">\brounded-3xl\b</code>), plain rounded (52: <code className="text-neutral-900">(^|[^a-zA-Z0-9_-])rounded([^a-zA-Z0-9_-]|$)</code>), rounded-sm (3: <code className="text-neutral-900">\brounded-sm\b</code>), rounded-xs (14: <code className="text-neutral-900">\brounded-xs\b</code>), arbitrary rounded-[...] (110: <code className="text-neutral-900">rounded-\[[^]]+\]</code>)</li>
                    <li><strong>Shadows (115 standard vs 282 non-standard):</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;\bshadow-(2xs|xs|sm|md|lg|xl|2xl|inner|none|\[[^]]+\])\b&quot; src/app src/components src/context src/lib</code></li>
                    <li><strong>Motion &amp; transitions:</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;\btransition-all\b&quot;</code> (223); <code className="text-neutral-900">motion/react</code> (35 files); <code className="text-neutral-900">framer-motion</code> (7 files); 5 files animating geometry (height, width, left, top, margin)</li>
                    <li><strong>Z-index ladder:</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;\bz-(0|10|20|30|40|50)\b&quot;</code> (172); arbitrary: z-[100] (2), z-[70] (1), z-[150] (1), z-1 (9)</li>
                    <li><strong>Components:</strong> <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;&lt;button\b&quot; src/app src/components src/context src/lib | wc -l</code> (312 raw buttons across 44 files); <code className="text-neutral-900">&lt;Button\b</code> renders: 0</li>
                    <li><strong>Dark islands identified in code:</strong> AccountModal.tsx line 412 (bg-[#0c0c0e]) &amp; line 472 (bg-[#101013]); BrandPillarsSection.tsx line 150 (bg-[#0a0a0a]); Footer.tsx line 164 (bg-[#050505])</li>
                  </ul>
                  <p className="font-medium text-neutral-900 pt-1">
                    A prototype of these migrations exists on the design-system branch.
                  </p>
                </div>
              </section>

              {/* SECTION 13: QUICK REFERENCE */}
              <section id="quick-reference" className="scroll-mt-28 space-y-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#FCD017] bg-[#111111] px-2 py-0.5 rounded">
                      13
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]"
                      style={{ fontFamily: archivo.style.fontFamily }}
                    >
                      Quick Reference
                    </h3>
                  </div>
                  <p className="text-sm text-neutral-600">
                    A 12-row summary of canonical rules versus code anti-patterns using real class names.
                  </p>
                </div>

                {/* Follow vs Avoid Table */}
                <div className="border border-[#E8E8E5] rounded-xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F8F8F6] border-b border-[#E8E8E5] text-neutral-900 uppercase font-semibold">
                        <tr>
                          <th className="py-3 px-4 w-48">Category</th>
                          <th className="py-3 px-4 text-emerald-800">Follow (The Standard)</th>
                          <th className="py-3 px-4 text-red-800">Avoid (Anti-Pattern)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E8E5] text-neutral-600">
                        {QUICK_REFERENCE.map((row) => (
                          <tr key={row.category}>
                            <td className="py-3 px-4 font-semibold text-neutral-900">{row.category}</td>
                            <td className="py-3 px-4 font-mono text-neutral-900 font-medium">
                              <span className="text-emerald-700 font-bold mr-1.5">✓</span>
                              {row.follow}
                            </td>
                            <td className="py-3 px-4 font-mono text-neutral-500">
                              <span className="text-red-600 font-bold mr-1.5">✕</span>
                              {row.avoid}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>

            {/* Living Source Footer Block */}
            <div className="pt-8 border-t border-[#E8E8E5] bg-[#F8F8F6] p-8 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  The Living Source
                </h4>
                <p className="text-xs text-neutral-600">
                  These guidelines are maintained as <code className="font-mono text-neutral-800">DESIGN.md</code> in the repository and rendered here.
                </p>
              </div>

              <div>
                <a
                  href="/DESIGN.md"
                  download="DESIGN.md"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FCD017] hover:bg-[#E5BC05] text-[#111111] font-semibold text-xs rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                >
                  <Download className="w-3.5 h-3.5 text-[#111111]" />
                  <span>Download DESIGN.md</span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
