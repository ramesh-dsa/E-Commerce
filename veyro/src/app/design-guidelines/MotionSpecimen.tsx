"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Zap,
  Activity,
  Code2,
  ArrowRight,
  Eye,
  ShieldCheck,
} from "lucide-react";

interface DurationTier {
  id: string;
  token: string;
  ms: string;
  name: string;
  role: string;
  sourceFile: string;
  durationClass: string;
  demoType: "toggle" | "lift" | "card" | "drawer";
}

const DURATION_TIERS: DurationTier[] = [
  {
    id: "fast",
    token: "duration-150",
    ms: "150ms",
    name: "Micro Toggles & Clicks",
    role: "Checkbox switches, tag chip active states, icon state flips & tooltip popovers",
    sourceFile: "SortDropdown.tsx:84 • ActiveFilterChips.tsx",
    durationClass: "duration-150",
    demoType: "toggle",
  },
  {
    id: "standard",
    token: "duration-200",
    ms: "200ms",
    name: "Buttons & Icon Shifts",
    role: "Primary action buttons, wishlist heart pop, arrow translation on hover & tabs",
    sourceFile: "ProductBuyBox.tsx:378 • Navbar.tsx:457",
    durationClass: "duration-200",
    demoType: "lift",
  },
  {
    id: "card",
    token: "duration-300",
    ms: "300ms",
    name: "Product Cards & Zoom",
    role: "Footwear card lift (-translate-y-1.5), sneaker photo scale (105%) & tab panels",
    sourceFile: "ProductCard.tsx:45 • FootwearCatalog.tsx:647",
    durationClass: "duration-300",
    demoType: "card",
  },
  {
    id: "overlay",
    token: "duration-500",
    ms: "500ms",
    name: "Drawers & Modal Sheets",
    role: "CartDrawer slide-in, search modal backdrops & smooth accordion collapse",
    sourceFile: "CartDrawer.tsx • AccountModal.tsx:412",
    durationClass: "duration-500",
    demoType: "drawer",
  },
];

const TRANSITION_PROPERTIES = [
  {
    token: "transition-transform",
    type: "GPU Accelerated (0ms Paint)",
    role: "Hover lifts, button active shrink, scale zoom & arrow directional nudges",
    sourceFile: "Navbar.tsx:457 • ProductCard.tsx:45",
    exampleClass: "transition-transform duration-200 hover:-translate-y-1",
  },
  {
    token: "transition-opacity",
    type: "Compositor Only (No Layout Shift)",
    role: "Modal overlay backdrop fades, skeleton loading exit & floating pill visibility",
    sourceFile: "ScrollArea.tsx:229 • ImageCropperModal.tsx",
    exampleClass: "transition-opacity duration-200 hover:opacity-80",
  },
  {
    token: "transition-colors",
    type: "Style Layer",
    role: "Button background hover, border focus rings & subtle text highlight",
    sourceFile: "Button.tsx:22 • Footer.tsx:459",
    exampleClass: "transition-colors duration-200 hover:bg-[#FCD017] hover:text-[#111111]",
  },
];

export default function MotionSpecimen() {
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
      {/* 1. DURATION & TIMING SCALE CARDS                               */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#111111]" />
              Duration &amp; Timing Scale
            </h4>
            <p className="text-xs text-neutral-500 font-normal">
              Fixed transition speed tiers calibrated for instant user feedback without sluggishness
            </p>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">Hover preview box to test timing</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {DURATION_TIERS.map((tier) => {
            const isCopied = copiedToken === tier.token;

            return (
              <div
                key={tier.id}
                onClick={() => handleCopy(tier.token)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCopy(tier.token);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group border border-[#E8E8E5] rounded-2xl p-4 bg-white shadow-2xs hover:shadow-md hover:border-neutral-900 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                {/* Visual Motion Timing Preview */}
                <div className="w-full h-28 rounded-xl bg-[#F8F8F6] border border-[#E8E8E5] p-3 flex flex-col justify-between group-hover:bg-[#F3F3EF] transition-colors relative overflow-hidden">
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[11px] font-mono font-bold text-neutral-900 bg-white px-2 py-0.5 rounded shadow-2xs border border-neutral-200">
                      {tier.ms}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      ease-out
                    </span>
                  </div>

                  {/* Interactive Trigger Element */}
                  <div className="flex items-center justify-center py-1 z-10">
                    {tier.demoType === "toggle" && (
                      <div className="w-16 h-8 bg-neutral-200 rounded-full p-1 transition-colors group-hover:bg-[#111111]">
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${tier.durationClass} ease-out group-hover:translate-x-8`}
                        />
                      </div>
                    )}

                    {tier.demoType === "lift" && (
                      <div
                        className={`px-4 py-2 bg-[#111111] text-[#FCD017] rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm transition-transform ${tier.durationClass} ease-out group-hover:-translate-y-1.5`}
                      >
                        <span>Hover</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {tier.demoType === "card" && (
                      <div
                        className={`w-20 h-10 bg-white border border-neutral-300 rounded-xl shadow-2xs flex items-center justify-center text-[10px] font-mono font-bold text-neutral-800 transition-all ${tier.durationClass} ease-out group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-[#111111]`}
                      >
                        Card Lift
                      </div>
                    )}

                    {tier.demoType === "drawer" && (
                      <div className="w-24 h-10 bg-neutral-200/80 rounded-lg p-1 relative overflow-hidden border border-neutral-300/80">
                        <div
                          className={`w-12 h-full bg-[#111111] rounded text-[8px] font-mono text-white flex items-center justify-center transition-transform ${tier.durationClass} ease-out group-hover:translate-x-10`}
                        >
                          Drawer
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-neutral-950 tracking-tight">
                      {tier.name}
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
                          {tier.token}
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 font-normal leading-relaxed line-clamp-2">
                    {tier.role}
                  </p>

                  <div className="pt-2 flex items-center gap-1 text-[10px] font-mono text-neutral-400 border-t border-neutral-100">
                    <Code2 className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                    <span className="truncate">{tier.sourceFile}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PERFORMANCE-FIRST TRANSITION PROPERTIES                     */}
      {/* ============================================================== */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#111111]" />
              GPU-Accelerated Transition Properties
            </h4>
            <p className="text-xs text-neutral-500 font-normal">
              High-performance properties triggering zero DOM reflow for 60fps / 120fps fluid interaction
            </p>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">Click card to copy property</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRANSITION_PROPERTIES.map((prop) => {
            const isCopied = copiedToken === prop.token;

            return (
              <div
                key={prop.token}
                onClick={() => handleCopy(prop.token)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCopy(prop.token);
                  }
                }}
                role="button"
                tabIndex={0}
                className="group border border-[#E8E8E5] rounded-2xl p-4 sm:p-5 bg-white shadow-2xs hover:shadow-md hover:border-neutral-900 transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                {/* Visual Preview Swatch */}
                <div className="w-full h-28 rounded-xl bg-[#F8F8F6] border border-[#E8E8E5] p-3 flex flex-col justify-between group-hover:bg-[#F3F3EF] transition-colors relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-neutral-800 bg-white px-2 py-0.5 rounded shadow-2xs border border-neutral-200">
                      {prop.type}
                    </span>
                  </div>

                  {/* Interactive Demo Chip */}
                  <div className="flex items-center justify-center py-1">
                    <div
                      className={`px-4 py-2 rounded-xl bg-white border border-neutral-300 font-mono text-xs font-bold text-neutral-900 shadow-2xs ${prop.exampleClass}`}
                    >
                      {prop.token}
                    </div>
                  </div>
                </div>

                {/* Card Meta Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-bold text-neutral-950 tracking-tight">
                      {prop.token}
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
                          <span>Copy</span>
                        </>
                      )}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                    {prop.role}
                  </p>

                  <div className="pt-2 flex items-center gap-1 text-[10px] font-mono text-neutral-400 border-t border-neutral-100">
                    <Code2 className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                    <span className="truncate">{prop.sourceFile}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. CORE MOTION PROTOCOLS: REDUCED MOTION & MOTION/REACT       */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card A: Universal Reduced Motion */}
        <div className="border border-[#E8E8E5] rounded-2xl p-4 sm:p-5 bg-white shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h5 className="text-sm font-bold text-neutral-950">
              Accessibility: prefers-reduced-motion
            </h5>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed font-normal">
            Every animated element automatically suppresses continuous movement when the user requests reduced motion at system level:
          </p>
          <div className="bg-[#F8F8F6] p-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800">
            <code>motion-reduce:transform-none motion-reduce:transition-none</code>
          </div>
        </div>

        {/* Card B: Animation Engine */}
        <div className="border border-[#E8E8E5] rounded-2xl p-4 sm:p-5 bg-white shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#111111]" />
            <h5 className="text-sm font-bold text-neutral-950">
              Motion Engine: motion/react
            </h5>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed font-normal">
            Complex orchestration, layout springs, and entrance choreography are driven by the modern Motion for React engine:
          </p>
          <div className="bg-[#F8F8F6] p-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-800">
            <code>import &#123; motion, AnimatePresence &#125; from &quot;motion/react&quot;;</code>
          </div>
        </div>
      </div>
    </div>
  );
}
