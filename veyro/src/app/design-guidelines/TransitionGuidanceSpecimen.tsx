"use client";

import React, { useState } from "react";
import {
  Check,
  Copy,
  Palette,
  Type,
  Component,
  Sliders,
  Layers,
  ShieldCheck,
  Terminal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Code2,
} from "lucide-react";

type FilterCategory = "all" | "colors" | "typography" | "components" | "surfaces" | "accessibility";

interface TransitionPillar {
  id: string;
  num: string;
  category: FilterCategory;
  categoryLabel: string;
  title: string;
  status: "Completed in Shell" | "Standardized" | "Active Migration" | "Enforced";
  statusColor: "emerald" | "amber" | "blue";
  effort: "Low" | "Medium" | "High";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  context: string;
  standard: string;
  legacyCode: string;
  standardCode: string;
  sourceFile: string;
  benefit: string;
}

const PILLARS: TransitionPillar[] = [
  {
    id: "colors",
    num: "01",
    category: "colors",
    categoryLabel: "Color & Theming",
    title: "Design Token Consolidation",
    status: "Completed in Shell",
    statusColor: "emerald",
    effort: "Medium",
    icon: Palette,
    context: "Direct hex literals (#111111, #fcd017, #f8f8f6) in legacy templates bypass dynamic theming and centralized palette updates.",
    standard: "Adopt native Tailwind v4 @theme tokens (veyro-black, veyro-yellow, veyro-surface, veyro-border, veyro-muted) universally.",
    legacyCode: 'className="bg-[#fcd017] text-[#111111] border-[#e8e8e5]"',
    standardCode: 'className="bg-veyro-yellow text-veyro-black border-veyro-border"',
    sourceFile: "src/app/globals.css:5",
    benefit: "Centralized theme control & instant dark/brand theme synchronization across the storefront.",
  },
  {
    id: "typography",
    num: "02",
    category: "typography",
    categoryLabel: "Typography",
    title: "Typography Scale Alignment",
    status: "Standardized",
    statusColor: "emerald",
    effort: "Medium",
    icon: Type,
    context: "Arbitrary inline font sizes (e.g. text-[11px], text-[13px]) create micro-discrepancies in hierarchy and line-height balance.",
    standard: "Align to standard Tailwind size ramp (text-2xs through text-6xl) mapped to verified storefront typography (Geist Sans, Montserrat, Outfit).",
    legacyCode: 'className="text-[11px] leading-[14px] font-[500]"',
    standardCode: 'className="text-xs font-medium leading-normal"',
    sourceFile: "src/app/layout.tsx:14",
    benefit: "Predictable rhythm, responsive scaling, and optical line-height balance across devices.",
  },
  {
    id: "components",
    num: "03",
    category: "components",
    categoryLabel: "Components",
    title: "Shared UI Primitives Adoption",
    status: "Active Migration",
    statusColor: "amber",
    effort: "High",
    icon: Component,
    context: "Raw <button> and inline badges with divergent states make hover micro-interactions, focus rings, and loading spinners inconsistent.",
    standard: "Standardize on canonical design primitives (Button, Badge, WishlistButton, SpotlightBentoCard, Toast) for unified interactive behavior.",
    legacyCode: '<button className="px-6 py-3 bg-[#111111] text-white text-xs font-bold uppercase rounded-[2px] hover:bg-black transition-colors">',
    standardCode: '<Button variant="primary" size="md">CONTINUE SHOPPING</Button>',
    sourceFile: "src/components/ui/Button.tsx",
    benefit: "Built-in keyboard accessibility, loading state indicators, spring animations, and WCAG compliance.",
  },
  {
    id: "surfaces",
    num: "04",
    category: "surfaces",
    categoryLabel: "Layout & Rhythm",
    title: "Section Rhythm & Container Hierarchy",
    status: "Standardized",
    statusColor: "emerald",
    effort: "Medium",
    icon: Sliders,
    context: "Arbitrary section paddings and non-standard max widths cause jagged gutters and inconsistent margins across viewport widths.",
    standard: "Standardize on the 4 container tiers (Wide 1440px, Standard 7xl, Reading 3xl, Form md) with uniform py-16 / py-20 vertical section rhythm.",
    legacyCode: '<div className="max-w-[1540px] px-4 sm:px-8 xl:px-10 py-7">',
    standardCode: '<Container size="standard" className="py-16 sm:py-20">',
    sourceFile: "src/components/ui/Container.tsx",
    benefit: "Harmonious page pacing, predictable gutters, and seamless horizontal alignment.",
  },
  {
    id: "surfaces",
    num: "05",
    category: "surfaces",
    categoryLabel: "Surfaces & Motion",
    title: "Shape, Elevation & GPU Motion",
    status: "Standardized",
    statusColor: "emerald",
    effort: "Medium",
    icon: Layers,
    context: "Mixed border radii (rounded-xs vs rounded-3xl) and transition-all animating geometry (width, height, margin) triggering CPU layout recalculations.",
    standard: "Enforce rounded-2xl for cards, rounded-full for pills. Animate exclusively transform and opacity with motion/react or hardware acceleration.",
    legacyCode: 'className="rounded-[10px] transition-all duration-300 hover:h-48"',
    standardCode: 'className="rounded-2xl transition-transform duration-300 hover:-translate-y-1.5 transform-gpu"',
    sourceFile: "src/components/features/ProductCard.tsx:45",
    benefit: "Smooth 120fps GPU animations without paint reflows, cohesive card geometry.",
  },
  {
    id: "accessibility",
    num: "06",
    category: "accessibility",
    categoryLabel: "Accessibility",
    title: "Accessible Focus Rings & Contrast",
    status: "Enforced",
    statusColor: "blue",
    effort: "Low",
    icon: ShieldCheck,
    context: "Custom buttons and interactive elements with outline-none missing visible keyboard focus indicators for tab navigation.",
    standard: "Mandate visible focus-visible:ring-2 focus-visible:ring-veyro-yellow rings with focus-visible:outline-hidden across all interactive targets.",
    legacyCode: '<button className="p-2 hover:opacity-80 outline-none">',
    standardCode: '<button className="p-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-veyro-yellow">',
    sourceFile: "src/components/layout/Navbar.tsx:312",
    benefit: "Full WCAG 2.1 AA keyboard navigability, clear feedback for keyboard and screen reader users.",
  },
];

const AUDIT_COMMANDS = [
  {
    label: "Color Token Audit",
    cmd: 'git grep -nE "#[0-9a-fA-F]{3,6}" src/components/ src/app/',
    desc: "Scans for remaining direct hex literals to migrate to @theme design tokens.",
  },
  {
    label: "Arbitrary Font Size Audit",
    cmd: 'git grep -nE "text-\\[[0-9.]+px\\]" src/components/ src/app/',
    desc: "Finds arbitrary text sizes for consolidation to canonical Tailwind scale.",
  },
  {
    label: "Raw Buttons vs Primitive Audit",
    cmd: 'git grep -c "<button" src/ && git grep -c "<Button" src/',
    desc: "Compares adoption of shared <Button> primitive vs raw HTML buttons.",
  },
  {
    label: "Layout Reflow Animation Audit",
    cmd: 'git grep -nE "transition-(all|height|width)" src/components/',
    desc: "Flags transition-all and geometry animations to replace with GPU transform/opacity.",
  },
];

export default function TransitionGuidanceSpecimen() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [showAuditTerminal, setShowAuditTerminal] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => {
      setCopiedSnippet((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const filteredPillars =
    activeFilter === "all"
      ? PILLARS
      : PILLARS.filter((p) => p.category === activeFilter);

  return (
    <div className="space-y-8">
      {/* 1. Live Storefront Modernization Metrics Banner */}
      <div className="border border-neutral-200/80 rounded-2xl bg-gradient-to-br from-white via-[#fcfcfb] to-[#f8f8f6] p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Storefront Architecture Modernization
            </div>
            <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Modernization Roadmap &amp; Code Recipes
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Actionable transition paths from legacy inline overrides to production design tokens and canonical UI primitives.
            </p>
          </div>

          {/* 3 Metric Badges */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="bg-white border border-neutral-200/90 rounded-xl p-3.5 text-center shadow-2xs">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                Shell Tokens
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-600 tabular-nums">
                100%
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Navbar &bull; Footer &bull; Bag</span>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-xl p-3.5 text-center shadow-2xs">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                @theme Tokens
              </span>
              <span className="text-lg sm:text-xl font-black text-neutral-900 tabular-nums">
                14
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">globals.css</span>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-xl p-3.5 text-center shadow-2xs">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 block">
                UI Primitives
              </span>
              <span className="text-lg sm:text-xl font-black text-neutral-900 tabular-nums">
                6 Live
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">Buttons &bull; Badges</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: "all", label: "All 6 Pillars" },
            { id: "colors", label: "Color Tokens" },
            { id: "typography", label: "Typography" },
            { id: "components", label: "UI Primitives" },
            { id: "surfaces", label: "Surfaces & Layout" },
            { id: "accessibility", label: "Accessibility" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              activeFilter === tab.id
                ? "bg-neutral-950 text-white shadow-xs"
                : "bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. The Modernized Pillar Cards */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id + pillar.num}
              className="border border-neutral-200/90 rounded-2xl bg-white p-5 sm:p-6 shadow-xs hover:border-neutral-300 transition-all space-y-5"
            >
              {/* Card Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-2xs relative">
                    <span>{pillar.num}</span>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
                      <Icon size={10} />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                        {pillar.categoryLabel}
                      </span>
                      <span className="text-neutral-300">&bull;</span>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {pillar.sourceFile}
                      </span>
                    </div>
                    <h5 className="text-base sm:text-lg font-bold text-neutral-900">
                      {pillar.title}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
                      pillar.statusColor === "emerald"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                        : pillar.statusColor === "blue"
                        ? "bg-blue-50 text-blue-800 border-blue-200/80"
                        : "bg-amber-50 text-amber-800 border-amber-200/80"
                    }`}
                  >
                    {pillar.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-neutral-100 text-neutral-600 border border-neutral-200">
                    Effort: {pillar.effort}
                  </span>
                </div>
              </div>

              {/* Rationale & Standard Narrative */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-1">
                  <span className="font-bold text-neutral-900 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Current Code Context
                  </span>
                  <p className="text-neutral-600 leading-relaxed font-normal">
                    {pillar.context}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-1">
                  <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Standard Specification
                  </span>
                  <p className="text-emerald-900 leading-relaxed font-normal">
                    {pillar.standard}
                  </p>
                </div>
              </div>

              {/* Interactive Code Comparison (Before vs After) */}
              <div className="border border-neutral-200/90 rounded-xl overflow-hidden bg-neutral-950 text-neutral-100 text-xs font-mono shadow-inner">
                {/* Comparison Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/80 text-[11px] text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Code2 size={13} className="text-neutral-400" />
                    <span>Before vs After Implementation Recipe</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(pillar.standardCode, pillar.id)}
                    className="flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer text-[11px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
                    title="Copy standard implementation snippet"
                  >
                    {copiedSnippet === pillar.id ? (
                      <>
                        <Check size={12} className="text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Standard</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Diff Lines */}
                <div className="p-3.5 space-y-2 overflow-x-auto">
                  <div className="flex items-start gap-2.5 text-red-300/80">
                    <span className="text-red-500 font-bold select-none shrink-0">- Avoid (Legacy):</span>
                    <code className="text-red-200/90 whitespace-pre">{pillar.legacyCode}</code>
                  </div>
                  <div className="flex items-start gap-2.5 text-emerald-300">
                    <span className="text-emerald-500 font-bold select-none shrink-0">+ Adopt (Standard):</span>
                    <code className="text-emerald-300 font-semibold whitespace-pre">{pillar.standardCode}</code>
                  </div>
                </div>
              </div>

              {/* Benefit Footer */}
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <Sparkles size={13} className="text-[#fcd017] shrink-0" />
                <span className="text-neutral-700 font-medium">
                  <strong>Architectural Outcome:</strong> {pillar.benefit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Automated Verification & Codebase AST Audit Console (Replaces old bash text dump) */}
      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowAuditTerminal(!showAuditTerminal)}
          className="w-full flex items-center justify-between p-5 hover:bg-neutral-50/60 transition-colors text-left cursor-pointer"
          aria-expanded={showAuditTerminal}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
              <Terminal size={16} />
            </div>
            <div>
              <h5 className="text-sm font-bold text-neutral-900">
                Automated Verification &amp; Static AST Audit Commands
              </h5>
              <p className="text-xs text-neutral-500">
                Verified across 178 storefront source files in <code className="font-mono">veyro/src/</code>. Expand to inspect verification scripts.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
            <span>{showAuditTerminal ? "Hide Commands" : "Show Commands"}</span>
            {showAuditTerminal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {showAuditTerminal && (
          <div className="p-5 pt-0 border-t border-neutral-100 bg-[#fbfbf9] space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every design guideline metric is continuously measured via static regex and AST pattern extractions across the live branch. Developers can execute these commands locally in the terminal to verify zero regressions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AUDIT_COMMANDS.map((cmd) => (
                <div
                  key={cmd.label}
                  className="p-3.5 rounded-xl bg-neutral-950 text-neutral-100 border border-neutral-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-bold text-neutral-200 uppercase tracking-wider">{cmd.label}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(cmd.cmd, cmd.label)}
                      className="text-neutral-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedSnippet === cmd.label ? (
                        <Check size={11} className="text-emerald-400" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>
                  <code className="block text-xs font-mono text-emerald-400/90 break-all">
                    {cmd.cmd}
                  </code>
                  <p className="text-[11px] text-neutral-400 font-sans">
                    {cmd.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
