"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Component,
  Search,
  Plus,
  Minus,
  ArrowRight,
  Loader2,
  Check,
  Command,
  Sliders,
  Sparkles,
} from "lucide-react";

export function GuidelinesComponentsSection() {
  const [qty, setQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <section id="section-9" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 09 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            APPLICATION LAYER
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          9. Components &amp; Interactive Controls
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          The VEYRO interactive component system is engineered for responsiveness, high tactile feedback, and accessibility. Test and inspect real rendered primitives across primary actions, badge tags, form inputs, and hardware skeleton loaders.
        </p>
      </div>

      {/* ── Interactive Action Button Matrix ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <Component size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              Action Button Primitives (Live Interactive States)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsLoading(!isLoading)}
            className="font-mono text-2xs px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Toggle Loading State:</span>
            <span className={isLoading ? "text-emerald-700 font-bold" : "text-neutral-500"}>
              {isLoading ? "ON" : "OFF"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Primary Action */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Variant: Primary Action
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Dominant action trigger used for AddToBag, Checkout Submit, and major CTAs.
              </p>
            </div>

            <div className="py-2">
              <button
                type="button"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm tracking-wide shadow-xs active:scale-95 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-veyro-yellow" />
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <span>ADD TO BAG • ₹2,499</span>
                )}
              </button>
            </div>

            <div className="font-mono text-3xs text-neutral-400">
              Radius: rounded-lg (8px) • BG: neutral-950
            </div>
          </div>

          {/* 2. Secondary Outline */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Variant: Secondary Outline
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Secondary actions like View Details, Filter Drawers, and Order Receipts.
              </p>
            </div>

            <div className="py-2">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-950 font-semibold text-sm shadow-xs transition-colors"
              >
                <span>VIEW SIZE CHART</span>
              </button>
            </div>

            <div className="font-mono text-3xs text-neutral-400">
              Radius: rounded-lg (8px) • Border: neutral-300
            </div>
          </div>

          {/* 3. Stadium Pill Primary */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Variant: Stadium Pill
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Editorial header controls, download buttons, and quick navigation pills.
              </p>
            </div>

            <div className="py-2">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 border border-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs group"
              >
                <span>EXPLORE ARCHIVE</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="font-mono text-3xs text-neutral-400">
              Radius: rounded-full (9999px) • Padding: px-5 py-2.5
            </div>
          </div>

          {/* 4. Accent Volt Gold Pill */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Variant: Signature Accent Pill
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Signature gold accent used on promotional triggers and VIP passes.
              </p>
            </div>

            <div className="py-2">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-veyro-yellow hover:bg-yellow-400 text-veyro-black text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
              >
                <Sparkles size={14} />
                <span>UNCLAIMED COUPON • VEYRO10</span>
              </button>
            </div>

            <div className="font-mono text-3xs text-neutral-400">
              Radius: rounded-full • Contrast: 12.74:1 AAA
            </div>
          </div>

          {/* 5. Micro Quantity Stepper Widget */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Interactive: Quantity Stepper
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Hardware-scaled bag item counter with tactile increment/decrement controls.
              </p>
            </div>

            <div className="py-2 flex items-center justify-center">
              <div className="inline-flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-mono text-xs font-bold text-neutral-950 select-none">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="w-10 h-10 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="font-mono text-3xs text-neutral-400 text-center">
              Active Count: {qty} items (₹{qty * 2499})
            </div>
          </div>

          {/* 6. Ghost Arrow Text Link */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                Variant: Editorial Text Link
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Inline editorial links within pro-se and catalog section headers.
              </p>
            </div>

            <div className="py-2 flex items-center justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-neutral-950 hover:text-neutral-600 underline underline-offset-4 group transition-colors"
              >
                <span>VIEW ALL IN ARCHIVE</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="font-mono text-3xs text-neutral-400 text-center">
              Underline: offset-4 • Hover: translate-x-1
            </div>
          </div>
        </div>
      </div>

      {/* ── Live Badge & Status Chip Primitives ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              Badge Primitives (@/components/ui/Badge)
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-500">
            rounded-full &bull; backdrop-blur
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Default Badge */}
          <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                variant=&quot;default&quot;
              </span>
              <p className="text-xs text-neutral-600">
                Fresh drops, new silhouettes, high-visibility flags on white backgrounds.
              </p>
            </div>
            <div className="py-2 flex items-center">
              <Badge variant="default" size="sm">
                NEW DROP
              </Badge>
            </div>
            <div className="font-mono text-3xs text-neutral-400">
              Surface: white/95 • Shadow: 2xs
            </div>
          </div>

          {/* Dark Badge */}
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3 flex flex-col justify-between text-white">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                variant=&quot;dark&quot;
              </span>
              <p className="text-xs text-neutral-300">
                Archival items, collector edition markers, low-noise dark badges.
              </p>
            </div>
            <div className="py-2 flex items-center">
              <Badge variant="dark" size="sm">
                ARCHIVE 2026
              </Badge>
            </div>
            <div className="font-mono text-3xs text-neutral-400">
              Surface: neutral-950/90 • Border: white/20
            </div>
          </div>

          {/* Sale Badge */}
          <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                variant=&quot;sale&quot;
              </span>
              <p className="text-xs text-neutral-600">
                Bundle promotions, discount ribbons, price reduction markers.
              </p>
            </div>
            <div className="py-2 flex items-center">
              <Badge variant="sale" size="sm">
                SAVE ₹500
              </Badge>
            </div>
            <div className="font-mono text-3xs text-neutral-400">
              Surface: terracotta #D9532F • Text: white
            </div>
          </div>

          {/* Outline Badge */}
          <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-200 space-y-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-3xs font-bold uppercase tracking-widest text-neutral-400 block mb-1">
                variant=&quot;outline&quot;
              </span>
              <p className="text-xs text-neutral-600">
                Material technical details, size chips, fabric certifications.
              </p>
            </div>
            <div className="py-2 flex items-center">
              <Badge variant="outline" size="sm">
                100% COMBED COTTON
              </Badge>
            </div>
            <div className="font-mono text-3xs text-neutral-400">
              Surface: transparent • Border: neutral-300
            </div>
          </div>
        </div>
      </div>

      {/* ── Form Inputs & Hardware Skeletons ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Form Inputs */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-4">
            <Sliders size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              Form Controls &amp; Input Focus States
            </h3>
          </div>

          <div className="space-y-4">
            {/* Standard Input */}
            <div className="space-y-1.5">
              <label className="block font-mono text-2xs uppercase tracking-wider text-neutral-700">
                Delivery Postal Pin Code (Standard Input)
              </label>
              <input
                type="text"
                placeholder="e.g. 641601 (Tirupur, TN)"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs font-mono text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-colors"
              />
            </div>

            {/* Error Input */}
            <div className="space-y-1.5">
              <label className="block font-mono text-2xs uppercase tracking-wider text-rose-800">
                Email Address (Validation Error State)
              </label>
              <input
                type="email"
                defaultValue="invalid.email@"
                className="w-full px-4 py-2.5 rounded-lg border border-rose-500 bg-rose-50/20 text-xs text-rose-900 focus:outline-none focus:border-rose-600 focus:ring-1 focus:ring-rose-600 transition-colors"
              />
              <span className="block font-mono text-3xs text-rose-600 font-semibold">
                Please enter a valid email address to receive order tracking.
              </span>
            </div>

            {/* Search Input with Shortcut Badge */}
            <div className="space-y-1.5">
              <label className="block font-mono text-2xs uppercase tracking-wider text-neutral-700">
                Fuzzy Product Search
              </label>
              <div className="relative">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search heavyweight tees, vulcanized shoes..."
                  className="w-full pl-9 pr-14 py-2.5 rounded-lg border border-neutral-300 text-xs text-neutral-950 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950 transition-colors"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 font-mono text-3xs text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                  <Command size={10} /> K
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Skeleton Loader Preview */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-4">
            <Component size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              Hardware Sweeping Skeleton Loader
            </h3>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Sweeps a 1.4s infinite gradient shimmer across card surfaces during catalog hydration. Prevents Cumulative Layout Shift (CLS) with exact dimensional footprints:
          </p>

          {/* Skeleton Specimen Card */}
          <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/50 space-y-4">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-4/5 rounded-sm" />
                <Skeleton className="h-3.5 w-1/2 rounded-sm" />
                <Skeleton className="h-3 w-1/3 rounded-sm" />
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>

          <div className="font-mono text-3xs text-neutral-500">
            Accessibility: Disables sweep immediately under motion-reduce:animate-none.
          </div>
        </div>
      </div>
    </section>
  );
}
