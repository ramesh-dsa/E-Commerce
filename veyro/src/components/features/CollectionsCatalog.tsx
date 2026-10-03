"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Layers, ShieldCheck, Zap } from "lucide-react";
import { motion } from "motion/react";
import { SpotlightBentoCard } from "@/components/ui/SpotlightBentoCard";

interface CollectionItem {
  id: string;
  volNumber: string;
  title: string;
  subtitle: string;
  scriptAccent: string;
  description: string;
  category: "all" | "tees" | "shoes" | "resort";
  tag: string;
  itemCount: string;
  image: string;
  imagePosition?: string;
  href: string;
  ctaText: string;
  bentoSpan: string; // Tailwind grid span classes
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: "oversized-archive",
    volNumber: "VOL. 01 // ARCHIVAL DROP",
    title: "HEAVYWEIGHT OVERSIZED ARCHIVE",
    subtitle: "240+ GSM Combed Cotton Silhouettes",
    scriptAccent: "the boxy drape",
    description:
      "Densely knit combed cotton jersey, zero-sag 1x1 ribbed necklines, and relaxed drop-shoulder drapes engineered for modern Indian streetwear.",
    category: "tees",
    tag: "SIGNATURE DROP",
    itemCount: "12 Silhouettes",
    image: "/images/clothing-archive-campaign.jpg",
    imagePosition: "object-[68%_center] sm:object-center",
    href: "/clothing?fit=Oversized",
    ctaText: "Shop Oversized Archive",
    bentoSpan: "col-span-12 lg:col-span-7",
  },
  {
    id: "sneaker-vault",
    volNumber: "VOL. 02 // FOOTWEAR ARCHIVE",
    title: "THE SNEAKER VAULT",
    subtitle: "Handcrafted Vulcanized Silhouettes",
    scriptAccent: "double sole rotation",
    description:
      "Italian vulcanized rubber soles, minimalist monochrome leather court lows, and retro multi-panel suede runners built for all-day cushioning.",
    category: "shoes",
    tag: "VULCANIZED SOLES",
    itemCount: "10 Editions",
    image: "/images/footwear-archive-campaign.jpg",
    href: "/shoes",
    ctaText: "Explore Sneaker Vault",
    bentoSpan: "col-span-12 lg:col-span-5",
  },
  {
    id: "graphic-series",
    volNumber: "VOL. 03 // ART EDITIONS",
    title: "GRAPHIC ART STREETWEAR",
    subtitle: "Art-Driven Heavy Cotton Drops",
    scriptAccent: "good days ahead",
    description:
      "High-density screenprints and puff graphics rendered across pigment-dyed vintage washes with drop-tail hems and heavy collars.",
    category: "tees",
    tag: "LIMITED EDITION",
    itemCount: "6 Graphic Drops",
    image: "/hero/panel-graphic-tee.webp",
    href: "/clothing?fit=Graphic",
    ctaText: "Shop Graphic Series",
    bentoSpan: "col-span-12 md:col-span-6 lg:col-span-4",
  },
  {
    id: "resort-linen",
    volNumber: "VOL. 04 // SEASONAL DRAPE",
    title: "SUMMER RESORT LINEN",
    subtitle: "Pure French Flax Camp Collars",
    scriptAccent: "breeze easy",
    description:
      "Airy open-weave French flax linen shirts with cuban camp collars, crafted for tropical coastal heat and elevated weekend tailoring.",
    category: "resort",
    tag: "SEASONAL EDIT",
    itemCount: "4 Colorways",
    image: "/hero/panel-linen-shirt.webp",
    href: "/clothing",
    ctaText: "Shop Resort Linen",
    bentoSpan: "col-span-12 md:col-span-6 lg:col-span-4",
  },
  {
    id: "vip-bundle-pass",
    volNumber: "VOL. 05 // CURATED TRIO",
    title: "THE 3-T-SHIRTS VIP VAULT PASS",
    subtitle: "Mix & Match Trio Offer",
    scriptAccent: "the trio curation",
    description:
      "Mix and match any 3 silhouettes across Heavyweight Oversized, Graphic prints, and Classic fits. Automated instant savings applied at checkout.",
    category: "tees",
    tag: "BUNDLE · ₹1,199",
    itemCount: "Any 3 for ₹1,199",
    image: "/images/bundle-pass-campaign.jpg",
    href: "/clothing",
    ctaText: "Build Your 3-T-Shirt Bundle",
    bentoSpan: "col-span-12 md:col-span-12 lg:col-span-4",
  },
];

export function CollectionsCatalog() {
  const [activeCategory, setActiveCategory] = useState<"all" | "tees" | "shoes" | "resort">("all");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const filteredCollections = COLLECTIONS.filter(
    (col) => activeCategory === "all" || col.category === activeCategory
  );

  return (
    <div className="w-full bg-[#fbfbf9] text-[#111111]">
      {/* ── 1. EDITORIAL LOOKBOOK HEADER ─────────────────────────── */}
      <section className="w-full border-b border-[#e8e8e5] bg-white py-14 sm:py-20 px-5 sm:px-8 lg:px-14">
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 mb-2">
              <span>VEYRO ARCHIVE</span>
              <span>•</span>
              <span className="text-[#111111]">CURATED EDITIONS</span>
            </div>
            <span className="font-script text-3xl sm:text-5xl text-[#111111] tracking-normal block -mb-1 font-bold">
              the signature capsules
            </span>
            <h1 className="text-3xl sm:text-6xl font-black uppercase tracking-tight text-[#111111] leading-none">
              ARCHIVE COLLECTIONS
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-neutral-600 max-w-xl leading-relaxed">
              Explore our architectural drops categorised by silhouette, yarn density, and aesthetic purpose. Built for effortless daily rotation.
            </p>
          </div>

          {/* Segmented Pill Filter Bar (Luxury Minimalist with Liquid Hover) */}
          <div className="w-full md:w-auto overflow-x-auto scrollbar-none overscroll-x-contain -mx-5 px-5 sm:mx-0 sm:px-0 py-1 sm:py-0">
            <div 
              className="inline-flex items-center p-1 sm:p-1.5 bg-[#f0eee9] rounded-full border border-neutral-300/60 shadow-inner shrink-0"
              onMouseLeave={() => setHoveredTab(null)}
            >
              {[
                { key: "all", desktop: "ALL EDITIONS", mobile: "ALL" },
                { key: "tees", desktop: "T-SHIRTS & APPAREL", mobile: "APPAREL" },
                { key: "shoes", desktop: "SNEAKERS & SHOES", mobile: "FOOTWEAR" },
                { key: "resort", desktop: "SUMMER RESORT", mobile: "RESORT" },
              ].map((tab) => {
                const isActive = activeCategory === tab.key;
                const isHovered = hoveredTab === tab.key && !isActive;
                
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key as typeof activeCategory)}
                    onMouseEnter={() => setHoveredTab(tab.key)}
                    className={`relative px-3 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs uppercase tracking-wider rounded-full cursor-pointer whitespace-nowrap z-10 transition-colors duration-150 ${
                      isActive
                        ? "text-white font-bold"
                        : isHovered
                        ? "text-white font-bold"
                        : "text-neutral-600 font-semibold"
                    }`}
                  >
                    {/* Active Tab — Single layoutId, snappy spring slide */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#111111] rounded-full shadow-md"
                        style={{ zIndex: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                          mass: 0.8,
                        }}
                      />
                    )}

                    {/* Hover Pill — Solid dark bg on hover */}
                    <div
                      className={`absolute inset-0 bg-[#111111] rounded-full shadow-sm transition-opacity duration-150 ease-out ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ zIndex: 0 }}
                      aria-hidden="true"
                    />

                    <span className="relative z-10 block whitespace-nowrap">
                      <span className="sm:hidden">{tab.mobile}</span>
                      <span className="hidden sm:inline">{tab.desktop}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* ── 2. ASYMMETRICAL LUXURY EDITORIAL BENTO GRID ─────────── */}
      <section className="w-full max-w-[1536px] mx-auto px-5 sm:px-8 lg:px-14 py-12 sm:py-16">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          {filteredCollections.map((col) => {
            // If user filters to a specific category, adjust spans smoothly
            const gridSpan =
              activeCategory === "all"
                ? col.bentoSpan
                : filteredCollections.length === 1
                ? "col-span-12"
                : "col-span-12 md:col-span-6";

            const isHeroWide = col.id === "oversized-archive" && activeCategory === "all";
            const isTallSneaker = col.id === "sneaker-vault" && activeCategory === "all";

            return (
              <Link
                key={col.id}
                href={col.href}
                className={`${gridSpan} group block focus-visible:outline-none rounded-xl sm:rounded-2xl`}
              >
                <SpotlightBentoCard
                  spotlightColor="rgba(255, 255, 255, 0.05)"
                  enableTilt={true}
                  className="w-full h-full min-h-[350px] sm:min-h-[460px] lg:min-h-[500px] flex flex-col justify-between shadow-[0_12px_36px_rgba(0,0,0,0.18)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl border border-white/10"
                >
                  {/* Background High-Res Image Stage */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                      src={col.image}
                      alt={col.title}
                      fill
                      priority={isHeroWide}
                      quality={85}
                      sizes={
                        isHeroWide
                          ? "(max-width: 1024px) 100vw, 65vw"
                          : "(max-width: 768px) 100vw, 50vw"
                      }
                      className={`object-cover ${col.imagePosition || "object-center"} transition-transform duration-700 ease-out group-hover:scale-108`}
                    />
                    {/* Refined, Lighter Editorial Scrim (Preserves vibrant colors and texture) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 z-1" />
                  </div>

                  {/* Top Row: Pure Editorial Typography (No tech pill, no glowing dot) */}
                  <div
                    className="relative z-10 p-5 sm:p-7 flex items-center justify-between w-full transition-transform duration-300"
                    style={{ transform: "translateZ(28px)" }}
                  >
                    <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                      <span>{col.volNumber.split("//")[0].trim()}</span>
                      <span className="text-white/40 font-light">—</span>
                      <span className="text-white/75">{col.itemCount}</span>
                    </div>

                    <span className="w-8 h-8 rounded-full border border-white/25 bg-black/25 backdrop-blur-xs flex items-center justify-center text-white transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:scale-105 shadow-sm">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>

                  {/* Bottom Editorial Content */}
                  <div className="relative z-10 p-5 sm:p-7 space-y-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#fcd017] block">
                      {col.tag}
                    </span>
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-sm">
                      {col.title}
                    </h2>
                    <p className="hidden sm:block text-xs sm:text-sm text-neutral-300 leading-relaxed font-light mt-2 line-clamp-2 max-w-xl">
                      {col.description}
                    </p>
                  </div>
                </SpotlightBentoCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 3. ARCHITECTURAL BRAND ASSURANCE FOOTER STRIP ───────── */}
      <section className="w-full border-t border-[#e8e8e5] bg-white py-12 px-5 sm:px-8 lg:px-14">
        <div className="max-w-[1536px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f7f7f5] border border-neutral-200 flex items-center justify-center text-[#111111] shadow-xs shrink-0">
              <Zap size={20} className="fill-[#111111]" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
                Free Express Shipping
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                On all orders above ₹999 across India
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f7f7f5] border border-neutral-200 flex items-center justify-center text-[#111111] shadow-xs shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
                Easy 7-Day Returns
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Doorstep pickups with zero friction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f7f7f5] border border-neutral-200 flex items-center justify-center text-[#111111] shadow-xs shrink-0">
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
                240+ GSM Heavyweight
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Dense combed cotton & Italian vulcanized soles
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
