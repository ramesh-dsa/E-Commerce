"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Code2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { SpotlightBentoCard } from "@/components/ui/SpotlightBentoCard";
import { ProductCard } from "@/components/features/ProductCard";
import { Toast, ToastVariant } from "@/components/ui/Toast";
import { products } from "@/data/products";

type ComponentCategory = "all" | "buttons" | "badges" | "cards" | "feedback";

export default function ComponentsSpecimen() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>("all");

  // Live Toast State
  const [toastOpen, setToastOpen] = useState(false);
  const [toastVariant, setToastVariant] = useState<ToastVariant>("success");
  const [toastMessage, setToastMessage] = useState("Added to cart successfully!");

  const handleCopy = (code: string, id: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 1800);
    }
  };

  const triggerToast = (variant: ToastVariant, msg: string) => {
    setToastVariant(variant);
    setToastMessage(msg);
    setToastOpen(true);
  };

  // Sample real product for card specimen
  const sampleProduct =
    products.find((p) => p.id === "vey-tsh-ovr-001") || products[0];

  return (
    <div className="space-y-8">
      {/* ============================================================== */}
      {/* 1. SECTION FILTER BAR                                          */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FAFAF8] rounded-xl border border-[#E8E8E5]">
        <div>
          <h4 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
            Storefront Component Primitives
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Verified in JSX
            </span>
          </h4>
          <p className="text-xs text-neutral-600">
            Modular UI primitives and interactive containers driving VEYRO storefront
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {[
            { id: "all", label: "All (4 Groups)" },
            { id: "buttons", label: "Buttons & Actions" },
            { id: "badges", label: "Badges & Tags" },
            { id: "cards", label: "Cards & Surfaces" },
            { id: "feedback", label: "Feedback & Toasts" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id as ComponentCategory)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#111111] text-white shadow-xs font-bold"
                  : "bg-white text-neutral-700 border border-[#E8E8E5] hover:bg-neutral-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. GROUP 1: BUTTONS & ACTION PRIMITIVES                        */}
      {/* ============================================================== */}
      {(activeCategory === "all" || activeCategory === "buttons") && (
        <div className="border border-[#E8E8E5] rounded-2xl bg-white p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase">
                Group 01 • Interactive Actions
              </span>
              <h5 className="text-base font-bold text-neutral-950">
                Action Buttons &amp; Micro-Interactions
              </h5>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>src/components/ui/Button.tsx</span>
            </span>
          </div>

          {/* Interactive Button Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Primary Ink */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                  variant=&quot;primary&quot;
                </span>
                <p className="text-xs text-neutral-700">
                  Obsidian ink primary action with charcoal hover and 2px radius
                </p>
              </div>

              <div className="py-2 flex items-center justify-center">
                <Button variant="primary" size="md">
                  Add to Cart
                </Button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-[11px] font-mono">
                <span className="text-neutral-500">size=&quot;md&quot;</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      '<Button variant="primary">Add to Cart</Button>',
                      "btn-pri"
                    )
                  }
                  className="hover:text-black font-semibold flex items-center gap-1 text-neutral-700"
                >
                  {copiedCode === "btn-pri" ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy JSX
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Brand CTA Gold */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                  High-Impact CTA
                </span>
                <p className="text-xs text-neutral-700">
                  Veyro signature yellow accent for primary checkout &amp; drop conversions
                </p>
              </div>

              <div className="py-2 flex items-center justify-center">
                <button
                  type="button"
                  className="px-5 py-2.5 bg-[#FCD017] hover:bg-[#e0b805] active:bg-[#c9a504] text-[#111111] font-bold text-sm rounded-[2px] transition-colors duration-200 shadow-2xs cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Checkout</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-[11px] font-mono">
                <span className="text-neutral-500">bg-[#FCD017]</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      '<button className="px-5 py-2.5 bg-[#FCD017] hover:bg-[#e0b805] text-[#111111] font-bold rounded-[2px]">Instant Checkout</button>',
                      "btn-cta"
                    )
                  }
                  className="hover:text-black font-semibold flex items-center gap-1 text-neutral-700"
                >
                  {copiedCode === "btn-cta" ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy JSX
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Secondary Surface */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                  variant=&quot;secondary&quot;
                </span>
                <p className="text-xs text-neutral-700">
                  Subtle architectural warm-grey fill for tertiary dialog choices
                </p>
              </div>

              <div className="py-2 flex items-center justify-center">
                <Button variant="secondary" size="md">
                  View Details
                </Button>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-[11px] font-mono">
                <span className="text-neutral-500">bg-veyro-surface-alt</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      '<Button variant="secondary">View Details</Button>',
                      "btn-sec"
                    )
                  }
                  className="hover:text-black font-semibold flex items-center gap-1 text-neutral-700"
                >
                  {copiedCode === "btn-sec" ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy JSX
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Liquid Wishlist Button */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase text-neutral-500">
                  Directional Spring
                </span>
                <p className="text-xs text-neutral-700">
                  Luxury direction-aware liquid spring fill from WishlistButton.tsx
                </p>
              </div>

              <div className="py-2 flex items-center justify-center gap-3">
                <WishlistButton product={sampleProduct} size={20} />
                <span className="text-xs font-mono text-neutral-500">
                  Hover &amp; click me
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-[11px] font-mono">
                <span className="text-neutral-500">WishlistButton.tsx</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      '<WishlistButton product={product} size={20} />',
                      "btn-wish"
                    )
                  }
                  className="hover:text-black font-semibold flex items-center gap-1 text-neutral-700"
                >
                  {copiedCode === "btn-wish" ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy JSX
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. GROUP 2: BADGES & STATUS TAGS                               */}
      {/* ============================================================== */}
      {(activeCategory === "all" || activeCategory === "badges") && (
        <div className="border border-[#E8E8E5] rounded-2xl bg-white p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase">
                Group 02 • Editorial Categorization
              </span>
              <h5 className="text-base font-bold text-neutral-950">
                Pill Badges &amp; Status Indicators
              </h5>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>src/components/ui/Badge.tsx</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Default White Frosted */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                  variant=&quot;default&quot;
                </span>
                <p className="text-xs text-neutral-600">
                  Frosted glass pill for product category badges
                </p>
              </div>
              <div className="py-2 flex items-center justify-center">
                <Badge variant="default" size="md">
                  Oversized Fit
                </Badge>
              </div>
              <div className="pt-2 border-t border-neutral-200 text-right">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('<Badge variant="default">Oversized Fit</Badge>', "bdg-def")
                  }
                  className="text-[11px] font-mono hover:text-black font-semibold text-neutral-700"
                >
                  {copiedCode === "bdg-def" ? "✓ Copied" : "Copy JSX"}
                </button>
              </div>
            </div>

            {/* Dark Tactical */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                  variant=&quot;dark&quot;
                </span>
                <p className="text-xs text-neutral-600">
                  Obsidian pill for featured drops &amp; limited editions
                </p>
              </div>
              <div className="py-2 flex items-center justify-center">
                <Badge variant="dark" size="md">
                  Edition 01
                </Badge>
              </div>
              <div className="pt-2 border-t border-neutral-200 text-right">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('<Badge variant="dark">Edition 01</Badge>', "bdg-drk")
                  }
                  className="text-[11px] font-mono hover:text-black font-semibold text-neutral-700"
                >
                  {copiedCode === "bdg-drk" ? "✓ Copied" : "Copy JSX"}
                </button>
              </div>
            </div>

            {/* Sale / Accent */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                  variant=&quot;sale&quot;
                </span>
                <p className="text-xs text-neutral-600">
                  Crimson discount tag for live savings &amp; flash sales
                </p>
              </div>
              <div className="py-2 flex items-center justify-center">
                <Badge variant="sale" size="md">
                  25% OFF
                </Badge>
              </div>
              <div className="pt-2 border-t border-neutral-200 text-right">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('<Badge variant="sale">25% OFF</Badge>', "bdg-sale")
                  }
                  className="text-[11px] font-mono hover:text-black font-semibold text-neutral-700"
                >
                  {copiedCode === "bdg-sale" ? "✓ Copied" : "Copy JSX"}
                </button>
              </div>
            </div>

            {/* Outline */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                  variant=&quot;outline&quot;
                </span>
                <p className="text-xs text-neutral-600">
                  Minimal hairline pill for fabric &amp; sizing tags
                </p>
              </div>
              <div className="py-2 flex items-center justify-center">
                <Badge variant="outline" size="md">
                  100% Cotton
                </Badge>
              </div>
              <div className="pt-2 border-t border-neutral-200 text-right">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('<Badge variant="outline">100% Cotton</Badge>', "bdg-out")
                  }
                  className="text-[11px] font-mono hover:text-black font-semibold text-neutral-700"
                >
                  {copiedCode === "bdg-out" ? "✓ Copied" : "Copy JSX"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. GROUP 3: LUXURY CARDS & SURFACES                           */}
      {/* ============================================================== */}
      {(activeCategory === "all" || activeCategory === "cards") && (
        <div className="border border-[#E8E8E5] rounded-2xl bg-white p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase">
                Group 03 • Containers &amp; Cards
              </span>
              <h5 className="text-base font-bold text-neutral-950">
                Product Cards &amp; 3D Cursor Spotlight Bento
              </h5>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>src/components/features/ProductCard.tsx</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Real Storefront ProductCard */}
            <div className="lg:col-span-6 p-5 rounded-2xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-900">
                    Storefront Product Card
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    rounded-2xl • hover:-translate-y-1.5
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mb-4">
                  The primary commerce card from ProductCard.tsx featuring live rating, wishlist trigger, and price.
                </p>

                {/* Render Product Card in controlled container */}
                <div className="max-w-xs mx-auto">
                  <ProductCard product={sampleProduct} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200 text-[11px] font-mono">
                <span className="text-neutral-500">ProductCard.tsx:45</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy('<ProductCard product={product} />', "card-prod")
                  }
                  className="hover:text-black font-semibold text-neutral-700"
                >
                  {copiedCode === "card-prod" ? "✓ Copied" : "Copy JSX"}
                </button>
              </div>
            </div>

            {/* Right: 3D Spotlight Bento Card */}
            <div className="lg:col-span-6 p-5 rounded-2xl border border-neutral-200 bg-[#FAFAFA] flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-900">
                    60fps 3D Cursor Spotlight Card
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    SpotlightBentoCard.tsx
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mb-4">
                  Interactive GPU-accelerated card driven by CSS variables with true 3D perspective tilt. Hover below:
                </p>

                <SpotlightBentoCard
                  enableTilt={true}
                  className="bg-[#111111] text-white p-6 rounded-2xl border border-neutral-800 shadow-xl flex flex-col justify-between min-h-[260px]"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-[#FCD017] uppercase tracking-wider">
                      Architectural Surface
                    </span>
                    <h5 className="text-lg font-bold">
                      Bento Perspective Depth
                    </h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Smooth dynamic spotlight follows your cursor using direct DOM mutations without triggering component re-renders.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800 text-xs font-mono text-neutral-400">
                    <span>perspective(1400px)</span>
                    <span className="text-[#FCD017] flex items-center gap-1 font-bold">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </SpotlightBentoCard>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200 text-[11px] font-mono">
                <span className="text-neutral-500">SpotlightBentoCard.tsx</span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      '<SpotlightBentoCard enableTilt={true}>\n  <h5>Title</h5>\n</SpotlightBentoCard>',
                      "card-spot"
                    )
                  }
                  className="hover:text-black font-semibold text-neutral-700"
                >
                  {copiedCode === "card-spot" ? "✓ Copied" : "Copy JSX"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. GROUP 4: FEEDBACK & NOTIFICATION TOAST                      */}
      {/* ============================================================== */}
      {(activeCategory === "all" || activeCategory === "feedback") && (
        <div className="border border-[#E8E8E5] rounded-2xl bg-white p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-500 uppercase">
                Group 04 • Feedback &amp; Alerts
              </span>
              <h5 className="text-base font-bold text-neutral-950">
                Interactive Toast Notification Mount
              </h5>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>src/components/ui/Toast.tsx</span>
            </span>
          </div>

          <div className="p-5 rounded-2xl border border-neutral-200 bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-md">
              <span className="text-xs font-mono font-bold text-neutral-900 block uppercase">
                Global Notification Toast
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Framer Motion spring entry from top viewport with 4000ms auto-dismiss and action handler. Click any button below to trigger live:
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  triggerToast("success", "Item added to bag successfully!")
                }
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                Trigger Success
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerToast("danger", "Failed to update quantity. Try again.")
                }
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                Trigger Error
              </button>
              <button
                type="button"
                onClick={() =>
                  triggerToast("info", "Promo code VEYRO15 applied.")
                }
                className="px-3 py-2 bg-neutral-900 hover:bg-black text-[#FCD017] rounded text-xs font-mono font-bold transition-colors cursor-pointer"
              >
                Trigger Info
              </button>
            </div>
          </div>

          {/* Mounted Live Toast */}
          <Toast
            isOpen={toastOpen}
            onClose={() => setToastOpen(false)}
            variant={toastVariant}
            message={toastMessage}
            duration={4000}
          />
        </div>
      )}
    </div>
  );
}
