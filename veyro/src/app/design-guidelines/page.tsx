import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import { Logo, VeyroMark } from "@/components/ui/Logo";
import GuidelinesTreeSidebar from "./GuidelinesTreeSidebar";
import ColorPaletteSpecimen from "./ColorPaletteSpecimen";
import TypographySpecimen from "./TypographySpecimen";
import LayoutSpacingSpecimen from "./LayoutSpacingSpecimen";
import ShapeElevationSpecimen from "./ShapeElevationSpecimen";
import MotionSpecimen from "./MotionSpecimen";
import ZIndexSpecimen from "./ZIndexSpecimen";
import ComponentsSpecimen from "./ComponentsSpecimen";
import TransitionGuidanceSpecimen from "./TransitionGuidanceSpecimen";
import {
  Download,
  Check,
  X,
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
      className={`${inter.className} bg-white text-[#111111] min-h-screen selection:bg-[#FCD017] selection:text-[#111111] antialiased [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]`}
      style={{
        fontFamily: inter.style.fontFamily,
      }}
    >
      {/* Top Banner Header */}
      <header className="border-b border-[#E8E8E5] bg-[#F8F8F6] pt-12 pb-10">
        <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  VEYRO Design System
                </span>
                <span className="text-neutral-300">/</span>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Specification
                </span>
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111111] uppercase"
                style={{ fontFamily: archivo.style.fontFamily }}
              >
                Brand & Design Guidelines
              </h1>
              <p className="text-base sm:text-lg text-neutral-700 max-w-2xl leading-relaxed font-normal">
                The prescriptive brand, geometric, and visual system standard for the VEYRO digital storefront.
                The guidelines state the standard; where existing code disagrees, the rule wins and the code is scheduled for migration.
              </p>

              {/* Status Banner */}
              <div className="border-l-4 border-[#FCD017] bg-white p-4 rounded-r-lg shadow-2xs border-y border-r border-[#E8E8E5] max-w-3xl">
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-800 leading-relaxed font-medium">
                    This document defines the standard VEYRO is moving to. The live website on this branch does not follow it everywhere yet. Each section shows what the code uses today and what the standard requires. Section 12 lists the migration order.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-neutral-600">
                <span className="px-2.5 py-1 bg-white border border-[#E8E8E5] rounded-full text-neutral-900 font-bold">
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
      <div className="w-full max-w-[1680px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-14 py-12">
        <div className="grid lg:grid-cols-[16rem_minmax(0,1fr)] gap-12 xl:gap-16">
          {/* Navigation Rail */}
          <GuidelinesTreeSidebar />

          {/* Main Content Editorial Body */}
          <main className="min-w-0 space-y-16">
            {/* GROUP: FOUNDATIONS */}
            <div className="space-y-16">
              <div className="border-b border-[#111111] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    The five architectural pillars and studio voice governing the VEYRO aesthetic.
                  </p>
                </div>

                {/* 5 Core Principles Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2.5">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded w-fit inline-block">01</span>
                    <h4 className="text-[15px] sm:text-base font-bold uppercase tracking-tight text-neutral-950">One Brand Colour Story</h4>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      Unified contrast centered on Ink (<code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">#111111</code>), disciplined Gold (<code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">#FCD017</code>) accents, and clean off-white surfaces.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2.5">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded w-fit inline-block">02</span>
                    <h4 className="text-[15px] sm:text-base font-bold uppercase tracking-tight text-neutral-950">One Neutral Family</h4>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      Exclusively use the Tailwind <code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">neutral</code> ramp (<code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">neutral-50</code> through <code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">neutral-950</code>). Mixing grey families is forbidden.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2.5">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded w-fit inline-block">03</span>
                    <h4 className="text-[15px] sm:text-base font-bold uppercase tracking-tight text-neutral-950">Tokens Before Literals</h4>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      No hardcoded hex values or arbitrary CSS classes. Every colour, spacing, and typography value must reference defined tokens.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2.5">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded w-fit inline-block">04</span>
                    <h4 className="text-[15px] sm:text-base font-bold uppercase tracking-tight text-neutral-950">Motion is Intentional</h4>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      Frequent animations must animate only <code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">transform</code> and <code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">opacity</code> to preserve 60fps performance and avoid layout reflows.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2.5 md:col-span-2 lg:col-span-1">
                    <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded w-fit inline-block">05</span>
                    <h4 className="text-[15px] sm:text-base font-bold uppercase tracking-tight text-neutral-950">Shared Components First</h4>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      All UI elements must utilize centralized primitives (<code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">ui/Button</code>, <code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">ui/Input</code>, <code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">ui/Card</code>, <code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">ui/Modal</code>).
                    </p>
                  </div>
                </div>

                {/* Precedence Callout */}
                <div className="border-l-4 border-[#111111] bg-neutral-50/80 border-y border-r border-[#E8E8E5] p-4 rounded-r-lg">
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Rule Precedence
                  </p>
                  <p className="text-sm sm:text-[15px] text-neutral-900 font-semibold leading-relaxed">
                    When a rule and existing code disagree, the rule wins and the code is scheduled for migration.
                  </p>
                </div>

                {/* The Studio Voice */}
                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      The Studio Voice
                    </span>
                    <blockquote className="text-sm sm:text-base text-neutral-800 leading-relaxed font-medium bg-neutral-50/80 border border-[#E8E8E5] p-4 rounded-lg">
                      &quot;Built For The Archive. We reject seasonal trends. Every piece is engineered with obsessive attention to fabric weight, structural drape, and minimalist utility.&quot;
                    </blockquote>
                    <p className="text-xs text-neutral-600">
                      Source: <code className="font-mono text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded">src/components/features/BrandPillarsSection.tsx:163</code> and <code className="font-mono text-neutral-900 bg-neutral-100 px-1.5 py-0.5 rounded">src/components/layout/Footer.tsx:181</code>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E8E8E5]">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 block mb-3">
                      The Three Value Pillars (src/components/features/BrandPillarsSection.tsx)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-[#F8F8F6] p-4 rounded-lg space-y-2 border border-[#E8E8E5]">
                        <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded w-fit inline-block">01</span>
                        <h5 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-neutral-950">240+ GSM HEAVYWEIGHT</h5>
                        <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                          100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash. Engineered to feel substantial on the body.
                        </p>
                      </div>

                      <div className="bg-[#F8F8F6] p-4 rounded-lg space-y-2 border border-[#E8E8E5]">
                        <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded w-fit inline-block">02</span>
                        <h5 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-neutral-950">CRAFTED IN TIRUPUR</h5>
                        <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                          Direct partnerships with India&apos;s most respected artisanal garment mills. Every stitch is placed with precision by master craftsmen.
                        </p>
                      </div>

                      <div className="bg-[#F8F8F6] p-4 rounded-lg space-y-2 border border-[#E8E8E5]">
                        <span className="font-mono text-xs font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded w-fit inline-block">03</span>
                        <h5 className="text-xs sm:text-sm font-bold uppercase tracking-tight text-neutral-950">ZERO MIDDLEMEN</h5>
                        <p className="text-[13px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    Vector identity defined in <code className="text-xs font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">src/components/ui/Logo.tsx</code>.
                  </p>
                </div>

                {/* Live Logo Renderings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* On Pure White Canvas */}
                  <div className="border border-[#E8E8E5] rounded-xl p-8 bg-white flex flex-col items-center justify-center space-y-4 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                      On Pure White Canvas (variant=&quot;black&quot;)
                    </span>
                    <div className="py-6 flex items-center justify-center">
                      <Logo height={32} variant="black" />
                    </div>
                    <span className="text-xs font-mono text-neutral-600">
                      fill=&quot;#0B0B0B&quot; • viewBox=&quot;160 55 658 140&quot;
                    </span>
                  </div>

                  {/* On Ink Canvas */}
                  <div className="border border-neutral-800 rounded-xl p-8 bg-[#111111] flex flex-col items-center justify-center space-y-4 shadow-2xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                      On Ink Canvas (variant=&quot;white&quot;)
                    </span>
                    <div className="py-6 flex items-center justify-center">
                      <Logo height={32} variant="white" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      fill=&quot;#FFFFFF&quot; • viewBox=&quot;160 55 658 140&quot;
                    </span>
                  </div>
                </div>

                {/* Glyph Mark & Accent Variant */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-[#E8E8E5] rounded-xl p-6 bg-[#F8F8F6] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-950">Glyph Mark (VeyroMark)</h4>
                      <p className="text-sm text-neutral-700 mt-1 leading-relaxed">Standalone &quot;V&quot; vector glyph with fill-current.</p>
                      <span className="text-xs font-mono text-neutral-600 mt-2 block">viewBox=&quot;170 65 115 121&quot;</span>
                    </div>
                    <div className="p-4 bg-white border border-[#E8E8E5] rounded-lg shadow-2xs">
                      <VeyroMark className="w-8 h-8 text-[#111111]" />
                    </div>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-6 bg-[#F8F8F6] flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-950">Accent Variant</h4>
                      <p className="text-sm text-neutral-700 mt-1 leading-relaxed">Wordmark featuring the 5px gold top accent bar.</p>
                      <span className="text-xs font-mono text-neutral-600 mt-2 block">variant=&quot;accent&quot;</span>
                    </div>
                    <div className="p-4 bg-white border border-[#E8E8E5] rounded-lg shadow-2xs">
                      <Logo height={26} variant="accent" />
                    </div>
                  </div>
                </div>

                {/* Logo Specifications Table */}
                <div className="border border-[#E8E8E5] rounded-xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-neutral-100/70 border-b border-[#E8E8E5] text-neutral-900 uppercase font-bold text-xs tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Property</th>
                          <th className="py-3 px-4">Wordmark (Logo)</th>
                          <th className="py-3 px-4">Glyph (VeyroMark)</th>
                          <th className="py-3 px-4">Active Locations in Code</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E8E5] text-neutral-700 leading-relaxed">
                        <tr>
                          <td className="py-3 px-4 font-bold text-neutral-950">Default Height</td>
                          <td className="py-3 px-4 font-mono font-medium text-neutral-900">28px</td>
                          <td className="py-3 px-4 font-mono font-medium text-neutral-900">20px (w-5 h-5)</td>
                          <td className="py-3 px-4 font-mono text-neutral-800">Navbar (desktop 29-33px)</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-bold text-neutral-950">Minimum Height</td>
                          <td className="py-3 px-4 font-mono font-medium text-neutral-900">26px</td>
                          <td className="py-3 px-4 font-mono font-medium text-neutral-900">16px (w-4 h-4)</td>
                          <td className="py-3 px-4 font-mono text-neutral-800">Navbar (mobile 26px), AccountModal</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-bold text-neutral-950">Clear Space</td>
                          <td className="py-3 px-4">50% glyph height on all 4 sides</td>
                          <td className="py-3 px-4">8px minimum clear margin</td>
                          <td className="py-3 px-4">Universal layout boundary</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-bold text-neutral-950">Footer Scale</td>
                          <td className="py-3 px-4 font-mono font-medium text-neutral-900">32px (variant=&quot;white&quot;)</td>
                          <td className="py-3 px-4">—</td>
                          <td className="py-3 px-4 font-mono text-neutral-800">src/components/layout/Footer.tsx</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Do and Don't for Logo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-emerald-200 bg-emerald-50/60 rounded-xl p-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" /> Logo Do
                    </span>
                    <ul className="text-sm text-neutral-800 space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>Maintain at least 50% glyph height clear space on all four sides.</li>
                      <li>Use variant=&quot;black&quot; on white storefront surfaces.</li>
                      <li>Use variant=&quot;white&quot; on dark surfaces and modals.</li>
                    </ul>
                  </div>

                  <div className="border border-red-200 bg-red-50/60 rounded-xl p-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-900 flex items-center gap-1.5">
                      <X className="w-4 h-4 text-red-700 stroke-[2.5]" /> Logo Don&apos;t
                    </span>
                    <ul className="text-sm text-neutral-800 space-y-1.5 list-disc list-inside leading-relaxed">
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    The 2 core brand tokens, light canvas surfaces, neutral typography scale, and semantic status accents.
                  </p>
                </div>

                <ColorPaletteSpecimen />
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    The active storefront font system: Geist Sans for UI &amp; display, Geist Mono for data, and editorial accents.
                  </p>
                </div>

                <TypographySpecimen />
              </section>
            </div>

            {/* GROUP: SYSTEM */}
            <div className="space-y-16">
              <div className="border-b border-[#111111] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    Container width architecture, responsive product grid breakpoints, and the 8pt rhythm spacing scale.
                  </p>
                </div>

                <LayoutSpacingSpecimen />
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    Corner radii architecture, elevation shadow hierarchy, and interactive component preview.
                  </p>
                </div>

                <ShapeElevationSpecimen />
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    Duration timing hierarchy, GPU-accelerated transition tokens, and reduced-motion accessibility.
                  </p>
                </div>

                <MotionSpecimen />
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    Active stacking context tokens in the storefront codebase, component layer mappings, and verified file locations.
                  </p>
                </div>

                <ZIndexSpecimen />
              </section>
            </div>

            {/* GROUP: APPLICATION */}
            <div className="space-y-16">
              <div className="border-b border-[#111111] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    Interactive UI primitives, action buttons, status badges, luxury cards, and global toast feedback components.
                  </p>
                </div>

                <ComponentsSpecimen />
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    Repository structure, naming conventions, Client Component rules, and utility helpers.
                  </p>
                </div>

                <div className="border border-[#E8E8E5] rounded-xl p-6 bg-white space-y-4 shadow-2xs">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-950">
                    Repository Directory Structure
                  </h4>
                  <pre className="p-4 bg-[#F8F8F6] rounded-xl font-mono text-xs sm:text-[13px] text-neutral-900 leading-relaxed overflow-x-auto border border-[#E8E8E5]">
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
                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2 shadow-2xs">
                    <h5 className="text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-950">Naming Conventions</h5>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      PascalCase for React components (<code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">ProductCard.tsx</code>); camelCase for hooks and utilities (<code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">useCart.ts</code>, <code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">formatPrice.ts</code>).
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2 shadow-2xs">
                    <h5 className="text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-950">Client Component Rules</h5>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      Mark files with <code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">&quot;use client&quot;</code> only when using React hooks, browser events, or window APIs. Push client component boundaries down to leaf nodes.
                    </p>
                  </div>
                </div>

                <div className="border border-[#E8E8E5] rounded-xl p-5 bg-[#F8F8F6] space-y-2">
                  <h5 className="text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-950">Class Name Utility (cn)</h5>
                  <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                    Use <code className="font-mono font-bold text-neutral-900 bg-neutral-200/80 px-1.5 py-0.5 rounded">cn()</code> from <code className="font-mono text-neutral-900 bg-neutral-200/80 px-1.5 py-0.5 rounded">src/lib/utils.ts</code> (combining <code className="font-mono">clsx</code> and <code className="font-mono">tailwind-merge</code>) whenever combining dynamic and conditional classes.
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    Mandatory standards for focus visibility, touch targets, contrast, and reduced motion.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2 shadow-2xs">
                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-950">Focus-Visible Ring</h4>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      Every interactive element must display a visible 2px outline with 2px offset: <code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]</code>.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2 shadow-2xs">
                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-950">Icon-Only Buttons</h4>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      Every button lacking visible label text must have an explicit, descriptive <code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">aria-label</code> attribute.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2 shadow-2xs">
                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-950">Touch Target Dimensions</h4>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      All mobile interactive elements must measure at least 44px by 44px to satisfy touch accessibility requirements.
                    </p>
                  </div>

                  <div className="border border-[#E8E8E5] rounded-xl p-5 bg-white space-y-2 shadow-2xs">
                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-tight text-neutral-950">Heading Order</h4>
                    <p className="text-[13.5px] sm:text-sm text-neutral-700 leading-relaxed font-normal">
                      Exactly one <code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">&lt;h1&gt;</code> per page; heading hierarchy must proceed sequentially (<code className="font-mono text-neutral-900 bg-neutral-100 px-1 py-0.5 rounded">h2 &gt; h3 &gt; h4</code>) without skipping levels.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* GROUP: GOVERNANCE */}
            <div className="space-y-16">
              <div className="border-b border-[#111111] pb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    The built surface largely honors the system. Where it diverges, migration follows this order of impact — a pull request that changes UI is checked against these guidelines before it ships.
                  </p>
                </div>

                <TransitionGuidanceSpecimen />
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
                  <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed font-normal">
                    A 12-row summary of canonical rules versus code anti-patterns using real class names.
                  </p>
                </div>

                {/* Follow vs Avoid Table */}
                <div className="border border-[#E8E8E5] rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-neutral-100/70 border-b border-[#E8E8E5] text-neutral-900 uppercase font-bold text-xs tracking-wider">
                        <tr>
                          <th className="py-3 px-4 w-48">Category</th>
                          <th className="py-3 px-4 text-emerald-900">Follow (The Standard)</th>
                          <th className="py-3 px-4 text-red-900">Avoid (Anti-Pattern)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E8E5] text-neutral-700 leading-relaxed">
                        {QUICK_REFERENCE.map((row) => (
                          <tr key={row.category} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="py-3 px-4 font-bold text-neutral-950">{row.category}</td>
                            <td className="py-3 px-4 font-mono text-neutral-950 font-medium">
                              <span className="text-emerald-700 font-bold mr-1.5">✓</span>
                              {row.follow}
                            </td>
                            <td className="py-3 px-4 font-mono text-neutral-700">
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
            <div className="pt-8 border-t border-[#E8E8E5] bg-[#F8F8F6] p-8 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border">
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-950">
                  The Living Source
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  These guidelines are maintained as <code className="font-mono text-neutral-900 bg-neutral-200/60 px-1 py-0.5 rounded">DESIGN.md</code> in the repository and rendered here.
                </p>
              </div>

              <div>
                <a
                  href="/DESIGN.md"
                  download="DESIGN.md"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FCD017] hover:bg-[#E5BC05] text-[#111111] font-bold text-xs sm:text-sm rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111] shadow-2xs"
                >
                  <Download className="w-4 h-4 text-[#111111] stroke-[2.2]" />
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
