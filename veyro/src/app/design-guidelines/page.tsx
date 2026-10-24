import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, Inter } from "next/font/google";
import { Logo, VeyroMark } from "@/components/ui/Logo";
import {
  Download,
  Check,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Code2,
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

const SECTIONS = [
  {
    group: "Foundations",
    items: [
      { id: "brand-essence", num: "01", title: "Brand Essence" },
      { id: "logo", num: "02", title: "Logo" },
      { id: "color", num: "03", title: "Color" },
      { id: "typography", num: "04", title: "Typography" },
    ],
  },
  {
    group: "System",
    items: [
      { id: "layout-spacing", num: "05", title: "Layout and Spacing" },
      { id: "shape-elevation", num: "06", title: "Shape and Elevation" },
      { id: "motion", num: "07", title: "Motion" },
      { id: "z-index-ladder", num: "08", title: "Z-Index Ladder" },
    ],
  },
  {
    group: "Application",
    items: [
      { id: "components", num: "09", title: "Components" },
      { id: "architecture", num: "10", title: "Architecture" },
      { id: "accessibility", num: "11", title: "Accessibility" },
    ],
  },
  {
    group: "Governance",
    items: [
      { id: "transition-guidance", num: "12", title: "Transition Guidance" },
      { id: "quick-reference", num: "13", title: "Quick Reference" },
    ],
  },
];

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
        // Define local font families for real specimens
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
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-neutral-500">
                <span className="px-2.5 py-1 bg-white border border-[#E8E8E5] rounded-full text-neutral-900 font-semibold">
                  Version 1.0
                </span>
                <span>•</span>
                <span>Updated October 2026</span>
                <span>•</span>
                <span>Standard Specification</span>
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
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sticky Desktop Navigation Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-8 space-y-6">
              <div className="border border-[#E8E8E5] rounded-xl p-5 bg-[#F8F8F6]">
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4 pb-2 border-b border-[#E8E8E5]">
                  Table of Contents
                </h2>
                <nav className="space-y-4">
                  {SECTIONS.map((group) => (
                    <div key={group.group} className="space-y-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block px-2">
                        {group.group}
                      </span>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              className="group flex items-center justify-between text-xs px-2 py-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-white transition-colors"
                            >
                              <span className="truncate">{item.title}</span>
                              <span className="text-[10px] text-neutral-400 group-hover:text-neutral-900 font-mono">
                                {item.num}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </nav>
              </div>

              <div className="hidden lg:block border border-[#E8E8E5] rounded-xl p-4 bg-white text-xs text-neutral-500 space-y-2">
                <p className="font-semibold text-neutral-900">Living Source</p>
                <p>
                  Maintained in version control at the repository root as <code className="text-[#111111] font-mono">DESIGN.md</code>.
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content Editorial Body */}
          <main className="flex-1 min-w-0 space-y-16">
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
              <section id="brand-essence" className="scroll-mt-12 space-y-6">
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
              <section id="logo" className="scroll-mt-12 space-y-6">
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
              <section id="color" className="scroll-mt-12 space-y-6">
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
                    Tokens, calculated WCAG contrast ratios, and strict palette constraints.
                  </p>
                </div>

                {/* Core Brand Swatches Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Core Brand Palette & Surfaces
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {COLOR_SWATCHES.map((s) => (
                      <div
                        key={s.name}
                        className="border border-[#E8E8E5] rounded-xl overflow-hidden bg-white flex flex-col"
                      >
                        <div
                          className="h-20 w-full border-b border-[#E8E8E5] flex items-end justify-between p-3"
                          style={{ backgroundColor: s.hex }}
                        >
                          <span
                            className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                              s.isLightText ? "text-white bg-black/40" : "text-[#111111] bg-white/70"
                            }`}
                          >
                            {s.hex}
                          </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <div className="flex items-center justify-between">
                              <h5 className="text-sm font-bold text-neutral-900">{s.name}</h5>
                              <span className="text-[10px] font-mono text-neutral-500">{s.token}</span>
                            </div>
                            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{s.role}</p>
                          </div>
                          <div className="pt-2 border-t border-[#E8E8E5] flex items-center justify-between text-[11px]">
                            <span className="text-neutral-500">Contrast on White:</span>
                            <span className="font-mono font-semibold text-neutral-900">
                              {s.contrast} ({s.rating})
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Text Greys Neutral Ramp */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Text Hierarchy (Tailwind Neutral Ramp)
                  </h4>
                  <div className="border border-[#E8E8E5] rounded-xl overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F8F6] border-b border-[#E8E8E5] text-neutral-900 uppercase font-semibold">
                          <tr>
                            <th className="py-3 px-4">Token & Class</th>
                            <th className="py-3 px-4">Hex</th>
                            <th className="py-3 px-4">Role & Usage</th>
                            <th className="py-3 px-4">Contrast on White</th>
                            <th className="py-3 px-4">WCAG 2.1 Rating</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E8E5] text-neutral-600">
                          {NEUTRAL_RAMP.map((r) => (
                            <tr key={r.name}>
                              <td className="py-3 px-4 font-semibold text-neutral-900 flex items-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block" style={{ backgroundColor: r.hex }} />
                                <code>{r.token}</code>
                              </td>
                              <td className="py-3 px-4 font-mono">{r.hex}</td>
                              <td className="py-3 px-4">{r.role}</td>
                              <td className="py-3 px-4 font-mono font-medium">{r.contrast}</td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    r.rating.includes("AAA")
                                      ? "bg-emerald-100 text-emerald-800"
                                      : r.rating.includes("AA")
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {r.rating}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Functional Status Colors */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Status Colours (Strict Functional Set Only)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {STATUS_COLORS.map((st) => (
                      <div
                        key={st.name}
                        className={`p-4 rounded-xl border ${st.borderClass} ${st.bgClass} space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold uppercase ${st.textClass}`}>{st.name}</span>
                          <span className="text-[10px] font-mono text-neutral-500">{st.hex}</span>
                        </div>
                        <p className="text-xs text-neutral-700 leading-relaxed">{st.usage}</p>
                        <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-neutral-600 font-mono">
                          <span>Contrast: {st.contrast}</span>
                          <span>{st.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gold Usage & Prohibited Colours Rules */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#FCD017] bg-[#FFF8E7] rounded-xl p-5 space-y-2">
                    <h5 className="text-xs font-bold uppercase text-neutral-900">Gold Usage Rule</h5>
                    <p className="text-xs text-neutral-800 leading-relaxed">
                      Gold (<code className="font-mono">#FCD017</code>) is strictly a background or accent colour, never text on light surfaces. On white backgrounds, Gold text yields a failing 1.48:1 contrast ratio. When using Gold backgrounds, pair with Ink (<code className="font-mono">#111111</code>) text for an authoritative 12.74:1 contrast ratio.
                    </p>
                  </div>

                  <div className="border border-red-200 bg-red-50/50 rounded-xl p-5 space-y-2">
                    <h5 className="text-xs font-bold uppercase text-red-900">Prohibited Colour Families</h5>
                    <p className="text-xs text-red-800 leading-relaxed">
                      The colour families <code className="font-mono">gray</code>, <code className="font-mono">zinc</code>, <code className="font-mono">stone</code>, <code className="font-mono">slate</code>, and one-off hex literals are forbidden. All grey values must map to the defined Tailwind neutral ramp.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 04: TYPOGRAPHY */}
              <section id="typography" className="scroll-mt-12 space-y-6">
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
                    Dual font system: Archivo for architectural headings and Inter for body and interface elements.
                  </p>
                </div>

                {/* Live Font Specimens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Archivo Specimen */}
                  <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E5]">
                      <span className="text-xs font-bold uppercase text-neutral-900">Heading Font: Archivo</span>
                      <span className="text-[10px] font-mono text-neutral-500">var(--font-archivo)</span>
                    </div>
                    <div className="space-y-3" style={{ fontFamily: archivo.style.fontFamily }}>
                      <p className="text-3xl font-bold uppercase tracking-tight text-[#111111]">
                        BUILT FOR THE ARCHIVE
                      </p>
                      <p className="text-xl font-semibold uppercase tracking-tight text-neutral-800">
                        240+ GSM HEAVYWEIGHT COTTON
                      </p>
                      <p className="text-sm font-medium uppercase tracking-wide text-neutral-600">
                        VULCANIZED RETRO FOOTWEAR • HOROLOGY
                      </p>
                    </div>
                    <p className="text-xs text-neutral-500 pt-3 border-t border-[#E8E8E5]">
                      Used for h1 through h6, display hero headers, section titles, and product names.
                    </p>
                  </div>

                  {/* Inter Specimen */}
                  <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E5]">
                      <span className="text-xs font-bold uppercase text-neutral-900">Body & UI Font: Inter</span>
                      <span className="text-[10px] font-mono text-neutral-500">var(--font-inter)</span>
                    </div>
                    <div className="space-y-3" style={{ fontFamily: inter.style.fontFamily }}>
                      <p className="text-base text-neutral-900 leading-relaxed">
                        Every piece is engineered with obsessive attention to fabric weight, structural drape, and minimalist utility. Direct partnerships with artisanal mills in Tirupur.
                      </p>
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        [ 001 ] EYEBROW STYLE • ALL CAPS • WIDE TRACKING
                      </p>
                    </div>
                    <p className="text-xs text-neutral-500 pt-3 border-t border-[#E8E8E5]">
                      Used for body copy, product descriptions, buttons, form inputs, prices, tables, and metadata.
                    </p>
                  </div>
                </div>

                {/* Type Scale Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Standard Type Scale & Hierarchy
                    </h4>
                    <span className="text-xs text-neutral-500">Arbitrary sizes (text-[Npx]) are outside the system</span>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#F8F8F6] border-b border-[#E8E8E5] text-neutral-900 uppercase font-semibold">
                          <tr>
                            <th className="py-3 px-4">Token</th>
                            <th className="py-3 px-4">Pixel Size</th>
                            <th className="py-3 px-4">Line Height</th>
                            <th className="py-3 px-4">Purpose & Application</th>
                            <th className="py-3 px-4">Specimen Preview</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E8E8E5] text-neutral-600">
                          {TYPE_SCALE.map((t) => (
                            <tr key={t.token}>
                              <td className="py-3 px-4 font-mono font-semibold text-neutral-900">{t.token}</td>
                              <td className="py-3 px-4 font-mono">{t.size}</td>
                              <td className="py-3 px-4 font-mono">{t.lh}</td>
                              <td className="py-3 px-4">{t.usage}</td>
                              <td className="py-3 px-4 font-medium text-neutral-900 truncate max-w-[200px]">
                                <span className={t.token}>VEYRO Standard</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
              <section id="layout-spacing" className="scroll-mt-12 space-y-6">
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
                    The four container recipes, gutter rhythm, and universal breakpoints.
                  </p>
                </div>

                {/* Visual Container Width Diagrams */}
                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Container Width Scale (Rendered Proportionally)
                  </h4>

                  <div className="space-y-4">
                    {/* Wide 1440px */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-900">Wide (max-w-[1440px])</span>
                        <span className="text-neutral-500">1440px • Home showcases, hero banners, wide catalog grids</span>
                      </div>
                      <div className="w-full bg-[#F8F8F6] p-1.5 rounded-lg border border-[#E8E8E5]">
                        <div className="w-full bg-neutral-900 text-white text-[10px] font-mono py-2 rounded text-center">
                          100% relative scale
                        </div>
                      </div>
                    </div>

                    {/* Standard 7xl (1280px) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-900">Standard (max-w-7xl)</span>
                        <span className="text-neutral-500">1280px • Cart, checkout, account dashboard, order history</span>
                      </div>
                      <div className="w-full bg-[#F8F8F6] p-1.5 rounded-lg border border-[#E8E8E5]">
                        <div className="w-[88%] bg-neutral-800 text-white text-[10px] font-mono py-2 rounded text-center">
                          88% (1280px)
                        </div>
                      </div>
                    </div>

                    {/* Reading 3xl (768px) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-900">Reading (max-w-3xl)</span>
                        <span className="text-neutral-500">768px • Policies, articles, FAQs, documentation</span>
                      </div>
                      <div className="w-full bg-[#F8F8F6] p-1.5 rounded-lg border border-[#E8E8E5]">
                        <div className="w-[53%] bg-neutral-700 text-white text-[10px] font-mono py-2 rounded text-center">
                          53% (768px)
                        </div>
                      </div>
                    </div>

                    {/* Form md (448px) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-900">Form (max-w-md)</span>
                        <span className="text-neutral-500">448px • Authentication dialogs, modal forms</span>
                      </div>
                      <div className="w-full bg-[#F8F8F6] p-1.5 rounded-lg border border-[#E8E8E5]">
                        <div className="w-[31%] bg-neutral-600 text-white text-[10px] font-mono py-2 rounded text-center">
                          31% (448px)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Rhythm & Padding Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Horizontal Padding Gutter
                    </span>
                    <h5 className="text-sm font-bold text-neutral-900">Universal px-4 sm:px-6 lg:px-8</h5>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      All viewports share this universal horizontal padding gutter across every container recipe to guarantee consistent edge alignment.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                      Vertical Section Spacing
                    </span>
                    <h5 className="text-sm font-bold text-neutral-900">Standard py-16 sm:py-20 lg:py-24</h5>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Sections follow an intentional rhythm: standard sections use py-16 to py-24; compact utility sections use py-10 sm:py-14.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 06: SHAPE AND ELEVATION */}
              <section id="shape-elevation" className="scroll-mt-12 space-y-6">
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
                    The four canonical corner radii and three elevation shadows rendered live.
                  </p>
                </div>

                {/* 4 Radii Live Samples */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    The Four Permitted Radii
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-3 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-[#FCD017] rounded-full flex items-center justify-center text-xs font-bold text-neutral-900 shadow-sm">
                        Full
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase text-neutral-900">rounded-full</h5>
                        <p className="text-[11px] text-neutral-600 mt-1">Buttons, pill chips, icon buttons, badges</p>
                      </div>
                    </div>

                    <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-3 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-[#111111] rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        12px
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase text-neutral-900">rounded-xl</h5>
                        <p className="text-[11px] text-neutral-600 mt-1">Product cards, feature cards, modal dialogs</p>
                      </div>
                    </div>

                    <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-3 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-[#F8F8F6] border border-[#E8E8E5] rounded-lg flex items-center justify-center text-xs font-bold text-neutral-900 shadow-sm">
                        8px
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase text-neutral-900">rounded-lg</h5>
                        <p className="text-[11px] text-neutral-600 mt-1">Form inputs, select dropdowns, image frames</p>
                      </div>
                    </div>

                    <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-3 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-[#F3F3F0] border border-[#E8E8E5] rounded-md flex items-center justify-center text-xs font-bold text-neutral-900 shadow-sm">
                        6px
                      </div>
                      <div>
                        <h5 className="text-xs font-bold uppercase text-neutral-900">rounded-md</h5>
                        <p className="text-[11px] text-neutral-600 mt-1">Small toggles, micro switches</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 italic">
                    Prohibited: rounded-none (permitted only for full-bleed containers), rounded-xs, rounded-sm, plain rounded, rounded-2xl (16px), rounded-3xl (24px), and arbitrary pixel radii like rounded-[2px].
                  </p>
                </div>

                {/* 3 Shadows Live Samples */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    The Three Permitted Shadows
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#E8E8E5] rounded-xl p-6 shadow-sm space-y-2">
                      <span className="text-xs font-mono font-bold text-neutral-500">shadow-sm</span>
                      <h5 className="text-sm font-bold text-neutral-900">Subtle Card Elevation</h5>
                      <p className="text-xs text-neutral-600">Rest state for product cards, containers, and table sheets.</p>
                    </div>

                    <div className="bg-white border border-[#E8E8E5] rounded-xl p-6 shadow-lg space-y-2">
                      <span className="text-xs font-mono font-bold text-neutral-500">shadow-lg</span>
                      <h5 className="text-sm font-bold text-neutral-900">Interactive Elevation</h5>
                      <p className="text-xs text-neutral-600">Hover state for interactive cards, dropdowns, and flyout popovers.</p>
                    </div>

                    <div className="bg-white border border-[#E8E8E5] rounded-xl p-6 shadow-2xl space-y-2">
                      <span className="text-xs font-mono font-bold text-neutral-500">shadow-2xl</span>
                      <h5 className="text-sm font-bold text-neutral-900">Modal & Drawer Overlay</h5>
                      <p className="text-xs text-neutral-600">Full dialog windows, cart side drawers, and high-elevation modals.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 07: MOTION */}
              <section id="motion" className="scroll-mt-12 space-y-6">
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
                    Durations, easings, transform-only rules, and accessibility guards.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-3">
                    <h4 className="text-xs font-bold uppercase text-neutral-900">Durations and Easings</h4>
                    <ul className="text-xs text-neutral-600 space-y-2">
                      <li><strong className="text-neutral-900 font-mono">duration-200:</strong> Micro-interactions, hover states, toggles.</li>
                      <li><strong className="text-neutral-900 font-mono">duration-300:</strong> Standard card shifts, tab transitions, dropdown reveals.</li>
                      <li><strong className="text-neutral-900 font-mono">duration-500:</strong> Modal entrances, page reveals, hero animations.</li>
                      <li><strong className="text-neutral-900 font-mono">ease-out:</strong> Element entrance transitions; <strong className="text-neutral-900 font-mono">ease-in:</strong> Element exits.</li>
                    </ul>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-3">
                    <h4 className="text-xs font-bold uppercase text-neutral-900">Transform and Opacity Rule</h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Continuous animations must animate <strong>only transform and opacity</strong>. Never animate geometry properties like top, left, width, height, or margin. Never use <code className="font-mono text-neutral-800">transition-all</code>.
                    </p>
                    <p className="text-xs text-neutral-500 pt-2 border-t border-[#E8E8E5]">
                      Accordion Exception: Height expansion is permitted exclusively using CSS grid <code>grid-template-rows: 0fr -&gt; 1fr</code> or Radix primitives with <code>overflow-hidden</code>.
                    </p>
                  </div>
                </div>

                <div className="border border-[#E8E8E5] rounded-xl p-5 bg-[#F8F8F6] space-y-2">
                  <h4 className="text-xs font-bold uppercase text-neutral-900">Library and Accessibility</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Standardize on <code className="font-mono text-neutral-900">&quot;motion&quot;</code> (<code className="font-mono">import &#123; motion &#125; from &quot;motion/react&quot;</code>). Deprecate <code className="font-mono">framer-motion</code>. Respect <code className="font-mono">prefers-reduced-motion</code> across all animated surfaces.
                  </p>
                </div>
              </section>

              {/* SECTION 08: Z-INDEX LADDER */}
              <section id="z-index-ladder" className="scroll-mt-12 space-y-6">
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
                    The canonical 7-tier stacking context ladder from canvas (0) to toast (60).
                  </p>
                </div>

                {/* Visual Ladder Diagram */}
                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-3">
                  <div className="space-y-2">
                    {Z_INDEX_LADDER.map((z, idx) => (
                      <div
                        key={z.token}
                        className="flex items-center justify-between p-3 rounded-lg border border-[#E8E8E5]"
                        style={{
                          backgroundColor: idx === 0 ? "#FFF8E7" : idx === 1 ? "#F8F8F6" : "#FFFFFF",
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-xs px-2.5 py-1 bg-neutral-900 text-white rounded">
                            {z.token}
                          </span>
                          <div>
                            <span className="text-xs font-bold text-neutral-900 uppercase">{z.name}</span>
                            <span className="text-xs text-neutral-500 ml-2 hidden sm:inline">— {z.role}</span>
                          </div>
                        </div>
                        <span className="font-mono text-xs text-neutral-400">Layer {z.val}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 pt-2 italic">
                    Strict Rule: No arbitrary z-index values (e.g. z-1, z-[70], z-[100], z-[150], z-[9999]) may be used.
                  </p>
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
              <section id="components" className="scroll-mt-12 space-y-6">
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
                    Live specimens of shared primitives, forms, cards, badges, and media rules.
                  </p>
                </div>

                {/* Button Variants & Sizes Live Specimen */}
                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Button Primitives (ui/Button)
                  </h4>

                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Primary Gold */}
                      <button
                        type="button"
                        className="px-6 py-2.5 bg-[#FCD017] hover:bg-[#E5BC05] text-[#111111] font-semibold text-sm rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                      >
                        Primary Gold CTA
                      </button>

                      {/* Secondary Ink */}
                      <button
                        type="button"
                        className="px-6 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white font-semibold text-sm rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                      >
                        Secondary Ink Action
                      </button>

                      {/* Outline */}
                      <button
                        type="button"
                        className="px-6 py-2.5 bg-transparent border border-neutral-300 hover:border-neutral-900 text-[#111111] font-semibold text-sm rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                      >
                        Outline Button
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <span className="text-xs text-neutral-400 font-mono">Sizes:</span>
                      <button
                        type="button"
                        className="px-4 py-1.5 bg-[#FCD017] text-[#111111] font-semibold text-xs rounded-full"
                      >
                        Small (sm)
                      </button>
                      <button
                        type="button"
                        className="px-6 py-2.5 bg-[#FCD017] text-[#111111] font-semibold text-sm rounded-full"
                      >
                        Medium (md)
                      </button>
                      <button
                        type="button"
                        className="px-8 py-3.5 bg-[#FCD017] text-[#111111] font-bold text-base rounded-full"
                      >
                        Large (lg)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Input Live Specimen */}
                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Form Input Primitive (ui/Input)
                  </h4>
                  <div className="max-w-md space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      readOnly
                      value="customer@veyro.in"
                      className="w-full px-4 py-2.5 text-sm bg-white border border-[#E8E8E5] rounded-lg text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]"
                    />
                    <span className="text-[11px] text-neutral-500 block">
                      Standard input container with rounded-lg and 2px focus ring.
                    </span>
                  </div>
                </div>

                {/* Card Live Specimen */}
                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Card Primitive (ui/Card)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                    <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-all duration-300 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        [ 001 ] HEAVYWEIGHT
                      </span>
                      <h5 className="text-sm font-bold text-neutral-900">Architectural Cut Tee</h5>
                      <p className="text-xs text-neutral-600">240+ GSM combed Indian cotton in boxy silhouette.</p>
                      <span className="text-xs font-bold text-neutral-900 block pt-2">₹1,499</span>
                    </div>

                    <div className="border border-[#E8E8E5] rounded-xl p-5 bg-[#F8F8F6] space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase text-neutral-900">Modal & Drawer Rules</span>
                        <p className="text-xs text-neutral-600 mt-1">
                          Modals use centered layout with rounded-xl and shadow-2xl. Drawers use right-side full height layout with z-50.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">Light theme enforced everywhere</span>
                    </div>
                  </div>
                </div>

                {/* Badges Live Specimen */}
                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Badge Primitives (ui/Badge)
                  </h4>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800">
                      Standard Neutral
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FFF8E7] text-[#111111] border border-[#FCD017]/40">
                      Gold Tint Active
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                      In Stock
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                      Limited Drop
                    </span>
                  </div>
                </div>

                {/* Media & Icons Rules */}
                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-[#F8F8F6] space-y-3">
                  <h4 className="text-xs font-bold uppercase text-neutral-900">Images and Iconography Rules</h4>
                  <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside">
                    <li>Always use <code className="font-mono text-neutral-900">next/image</code> with meaningful alt text, explicit width/height or fill, quality=80, and responsive sizes.</li>
                    <li>Exclusively use <code className="font-mono text-neutral-900">lucide-react</code> (1.5px stroke width) and curated vector assets from <code className="font-mono">ui/Logo.tsx</code> and <code className="font-mono">ui/Icons.tsx</code>.</li>
                    <li>When displaying text over photos, use the overlay sandwich: photo bottom layer, dark gradient scrim (<code className="font-mono">bg-gradient-to-t from-black/80 via-black/40 to-transparent</code>), and text top layer.</li>
                  </ul>
                </div>
              </section>

              {/* SECTION 10: ARCHITECTURE */}
              <section id="architecture" className="scroll-mt-12 space-y-6">
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
              <section id="accessibility" className="scroll-mt-12 space-y-6">
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
              <section id="transition-guidance" className="scroll-mt-12 space-y-6">
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
                    <li>Arbitrary text sizes (796 occurrences, 39 distinct sizes): <code className="text-neutral-900">grep -roE --exclude-dir=admin --exclude-dir=design-guidelines &quot;text-\[[0-9.]+px\]&quot; src/app src/components src/context src/lib | wc -l</code> (Top 3: text-[11px]: 312, text-[10px]: 178, text-[13px]: 54)</li>
                    <li>Non-standard radii (277 total outside canonical scale): rounded-2xl (84), rounded-3xl (14), plain rounded (52), rounded-sm (3), rounded-xs (14), arbitrary rounded-[...] (110)</li>
                    <li>Dark islands identified in code: AccountModal.tsx line 412 (bg-[#0c0c0e]) &amp; line 472 (bg-[#101013]); BrandPillarsSection.tsx line 150 (bg-[#0a0a0a]); Footer.tsx line 164 (bg-[#050505])</li>
                  </ul>
                  <p className="font-medium text-neutral-900 pt-1">
                    A prototype of these migrations exists on the design-system branch.
                  </p>
                </div>
              </section>

              {/* SECTION 13: QUICK REFERENCE */}
              <section id="quick-reference" className="scroll-mt-12 space-y-6">
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
