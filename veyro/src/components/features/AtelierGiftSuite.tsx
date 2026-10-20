"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { GiftTheme } from "@/types";
import {
  Check,
  Gift,
  Package,
} from "lucide-react";

interface AtelierGiftSuiteProps {
  className?: string;
  compact?: boolean;
}

interface ThemeConfig {
  id: GiftTheme;
  name: string;
  image: string;
  previewBg: string;
  previewBorder: string;
  previewText: string;
  scriptColor: string;
  tagColor: string;
}

const THEME_CONFIGS: Record<GiftTheme, ThemeConfig> = {
  "heritage-kraft": {
    id: "heritage-kraft",
    name: "Heritage Kraft",
    image: "/images/gift-kraft.jpg",
    previewBg: "bg-[#F3ECE4]",
    previewBorder: "border-[#DECDBE]",
    previewText: "text-[#3D2E24]",
    scriptColor: "text-[#231710]",
    tagColor: "text-[#7A695D]",
  },
  "atelier-bone": {
    id: "atelier-bone",
    name: "Atelier Bone",
    image: "/images/gift-bone.jpg",
    previewBg: "bg-[#FAF8F5]",
    previewBorder: "border-[#EBE6DE]",
    previewText: "text-[#3A3733]",
    scriptColor: "text-[#18181B]",
    tagColor: "text-[#857F77]",
  },
  "brutalist-noir": {
    id: "brutalist-noir",
    name: "Brutalist Noir",
    image: "/images/gift-noir.jpg",
    previewBg: "bg-[#18181B]",
    previewBorder: "border-[#27272A]",
    previewText: "text-[#E4E4E7]",
    scriptColor: "text-[#FCD017]",
    tagColor: "text-[#A1A1AA]",
  },
};

export function AtelierGiftSuite({ className = "", compact = false }: AtelierGiftSuiteProps) {
  const { giftPackaging, toggleGiftPackaging, updateGiftPackaging, giftPackagingFee } = useCart();
  const shouldReduceMotion = useReducedMotion();

  const maxMessageLength = 80;
  const charsRemaining = maxMessageLength - (giftPackaging.message?.length || 0);

  const activeThemeKey: GiftTheme = giftPackaging.theme || "heritage-kraft";
  const activeTheme = THEME_CONFIGS[activeThemeKey] || THEME_CONFIGS["heritage-kraft"];

  const handleThemeChange = (theme: GiftTheme) => {
    updateGiftPackaging({ theme });
  };

  return (
    <section
      aria-label="VEYRO Signature Atelier Gift Packaging"
      className={`rounded-2xl border transition-all duration-300 bg-white ${
        giftPackaging.enabled
          ? "border-neutral-300 shadow-sm"
          : "border-neutral-200/90 shadow-2xs hover:border-neutral-300"
      } ${className}`}
    >
      {/* ── TOP HEADER (CLEAN MONOCHROME ACCORDION BAR) ── */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Black & White Luxury Gift Box Icon Badge */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Gift size={22} className="stroke-[1.75]" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                BESPOKE GIFTING
              </span>
              <span className="text-xs font-bold text-neutral-900">
                +{formatPrice(giftPackagingFee || 99)}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-neutral-950 tracking-tight mt-0.5 truncate">
              VEYRO Signature Atelier Gift Box &amp; Card
            </h3>

            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
              Rigid matte-black magnetic box, gold-foil seal, archival tissue &amp; personalized letterpress card.
            </p>
          </div>
        </div>

        {/* Minimalist Switch Toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={giftPackaging.enabled}
          aria-label="Add VEYRO Signature Gift Packaging"
          onClick={toggleGiftPackaging}
          className={`relative shrink-0 w-12 h-7 rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FCD017] cursor-pointer ${
            giftPackaging.enabled ? "bg-[#FCD017]" : "bg-neutral-200 hover:bg-neutral-300"
          }`}
        >
          <span
            className={`block w-6 h-6 rounded-full bg-white shadow-xs transform transition-transform duration-200 ease-out flex items-center justify-center ${
              giftPackaging.enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* ── EXPANDABLE STUDIO LAYOUT ── */}
      <AnimatePresence initial={false}>
        {giftPackaging.enabled && (
          <motion.div
            key="gift-studio-panel"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-neutral-100"
          >
            <div className="p-4 sm:p-5 space-y-4">
              
              {/* 2-Column Responsive Workspace: Perfectly Balanced Heights */}
              <div className={`grid gap-5 items-stretch ${compact ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}`}>
                
                {/* ── LEFT COLUMN: DYNAMIC PACKAGING PHOTOGRAPHY (NATURAL PROPORTIONAL FIT) ── */}
                <div className={`${compact ? "w-full" : "lg:col-span-6"} flex flex-col`}>
                  <div className="relative w-full h-full min-h-[360px] sm:min-h-[400px] rounded-xl overflow-hidden border border-neutral-200/90 bg-neutral-900 shadow-2xs group flex-1">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTheme.image}
                        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image
                          src={activeTheme.image}
                          alt={`VEYRO Signature Gift Packaging - ${activeTheme.name}`}
                          fill
                          priority
                          className="object-cover object-center"
                          sizes="(max-width: 1024px) 100vw, 550px"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Atelier Signature Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-4 text-white pointer-events-none">
                      <p className="text-xs sm:text-sm font-semibold tracking-wide">
                        Hand-packed in Tirupur Atelier
                      </p>
                      <p className="text-[11px] text-neutral-300 mt-0.5">
                        Gold-debossed seal • Archival tissue • Wax seal envelope
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: CARD MAKER, CALLIGRAPHY PREVIEW & THEMES (CLEAN & COMPACT) ── */}
                <div className={`${compact ? "w-full" : "lg:col-span-6"} space-y-3.5 flex flex-col justify-between`}>
                  
                  {/* Header: Personalized Letterpress Card */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      PERSONALIZED LETTERPRESS CARD
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {charsRemaining} chars left
                    </span>
                  </div>

                  {/* To / From Dual Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        To (Recipient Name)
                      </label>
                      <input
                        type="text"
                        maxLength={35}
                        value={giftPackaging.recipientName || ""}
                        onChange={(e) => updateGiftPackaging({ recipientName: e.target.value })}
                        placeholder="e.g. Julian Vance"
                        className="w-full h-9 text-xs px-3 rounded-lg border border-neutral-300 bg-white focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        From (Your Name)
                      </label>
                      <input
                        type="text"
                        maxLength={35}
                        value={giftPackaging.senderName || ""}
                        onChange={(e) => updateGiftPackaging({ senderName: e.target.value })}
                        placeholder="e.g. Marcus Cole"
                        className="w-full h-9 text-xs px-3 rounded-lg border border-neutral-300 bg-white focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Personal Note Text Input */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Personal Note
                    </label>
                    <input
                      type="text"
                      maxLength={maxMessageLength}
                      value={giftPackaging.message || ""}
                      onChange={(e) => updateGiftPackaging({ message: e.target.value })}
                      placeholder="e.g. Crafted for moments that endure. Wear in good health."
                      className="w-full h-9 text-xs px-3 rounded-lg border border-neutral-300 bg-white focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-neutral-950 transition-colors"
                    />
                  </div>

                  {/* ── PRINTED CALLIGRAPHY PREVIEW (THEMED LIVE CARD) ── */}
                  <div
                    className={`rounded-xl border p-3.5 space-y-2 transition-colors duration-300 overflow-hidden ${activeTheme.previewBg} ${activeTheme.previewBorder}`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest">
                      <span className={activeTheme.tagColor}>PRINTED CALLIGRAPHY PREVIEW</span>
                      <span className={activeTheme.tagColor}>NO. 2026-GIFT</span>
                    </div>

                    <div className="py-2 text-center px-1.5 min-h-[54px] flex items-center justify-center overflow-hidden">
                      <p
                        className={`font-script leading-snug tracking-wide italic transition-all duration-200 break-words [overflow-wrap:anywhere] max-w-full text-center ${
                          (giftPackaging.message?.length || 0) > 42
                            ? "text-base sm:text-lg"
                            : "text-lg sm:text-xl"
                        } ${activeTheme.scriptColor}`}
                      >
                        &ldquo;{giftPackaging.message || "Crafted for moments that endure. Wear in good health."}&rdquo;
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono tracking-wider pt-2 border-t border-black/10 dark:border-white/10 uppercase">
                      <span className={activeTheme.tagColor}>
                        TO: <strong className={activeTheme.previewText}>{giftPackaging.recipientName || "Julian Vance"}</strong>
                      </span>
                      <span className={activeTheme.tagColor}>
                        FROM: <strong className={activeTheme.previewText}>{giftPackaging.senderName || "Marcus Cole"}</strong>
                      </span>
                    </div>
                  </div>

                  {/* ── STATIONERY THEME SELECTOR ── */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-900">
                      Stationery Theme
                    </label>

                    <div className="grid grid-cols-3 gap-2.5">
                      {(Object.keys(THEME_CONFIGS) as GiftTheme[]).map((themeKey) => {
                        const theme = THEME_CONFIGS[themeKey];
                        const isSelected = activeThemeKey === themeKey;

                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => handleThemeChange(theme.id)}
                            className={`group relative rounded-xl text-left overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "border-[#FCD017] shadow-xs"
                                : "border-neutral-200 hover:border-neutral-300 bg-white"
                            }`}
                          >
                            {/* Card Thumbnail */}
                            <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100">
                              <Image
                                src={theme.image}
                                alt={theme.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                                sizes="140px"
                              />

                              {/* Yellow Active Check Indicator Badge */}
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FCD017] flex items-center justify-center text-neutral-950 shadow-xs">
                                  <Check size={12} className="stroke-[3]" />
                                </div>
                              )}
                            </div>

                            <div className="p-1.5 text-center bg-white">
                              <span className="text-[11px] font-medium text-neutral-900 block truncate">
                                {theme.name}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* ── FOOTER: REDACTED INVOICES & STEALTH OUTER CARTON ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
                {/* Redacted Invoices */}
                <div
                  onClick={() => updateGiftPackaging({ hidePriceTag: !giftPackaging.hidePriceTag })}
                  className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200/90 bg-white hover:border-neutral-300 transition-colors cursor-pointer select-none"
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                      giftPackaging.hidePriceTag !== false
                        ? "bg-[#FCD017] text-neutral-950"
                        : "border border-neutral-300 bg-white text-transparent"
                    }`}
                  >
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <Package size={18} className="text-neutral-800 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-neutral-900 block">
                      Redacted Invoices
                    </span>
                    <span className="text-[11px] text-neutral-500 block leading-tight">
                      Price tags and invoice amounts are strictly omitted from the interior parcel.
                    </span>
                  </div>
                </div>

                {/* Stealth Outer Carton */}
                <div
                  onClick={() => updateGiftPackaging({ stealthOuterBox: !giftPackaging.stealthOuterBox })}
                  className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200/90 bg-white hover:border-neutral-300 transition-colors cursor-pointer select-none"
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                      giftPackaging.stealthOuterBox !== false
                        ? "bg-[#FCD017] text-neutral-950"
                        : "border border-neutral-300 bg-white text-transparent"
                    }`}
                  >
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <Package size={18} className="text-neutral-800 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-neutral-900 block">
                      Stealth Outer Carton
                    </span>
                    <span className="text-[11px] text-neutral-500 block leading-tight">
                      Shipped in an unmarked exterior kraft carton to preserve the surprise.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
