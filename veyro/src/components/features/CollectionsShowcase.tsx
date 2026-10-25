"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  animate,
  useReducedMotion,
} from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Check,
  Star,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products as allProducts } from "@/data/products";
import type { Product } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS & CHOREOGRAPHY CONFIGURATION
// All timings, offsets, spring constants, and layout geometry are defined here.
// ─────────────────────────────────────────────────────────────────────────────
export const SHOWCASE_CONFIG = {
  intro: {
    deckRiseDurationSec: 0.75, // Time for entire bundled deck to rise smoothly from below screen (520px -> 0px)
    centerHoldDurationMs: 220, // Brief tactile pause bundled in screen center (~220ms)
    fanSpringDelayMs: 970, // 750ms rise + 220ms hold = 970ms fan spring start
    spring: { stiffness: 130, damping: 17, mass: 1 },
    footerDelayMs: 1650,
  },
  scrollTrack: {
    heightVh: 220, // Calibrated 220vh track for seamless transition into archive capsules
    phaseBThreshold: 0.35, // progress 0 -> 0.35 transforms fan -> rail
    spring: { stiffness: 120, damping: 24 },
  },
  // Fan target geometries: % of card width, rotation in degrees, y in px, zIndex
  // Stagger order spreads outward from center (index 3 & 2 first, then 4 & 1, then 5 & 0)
  fanTargets: [
    { xPct: -230, rot: -11, y: 20, zIndex: 1, staggerDelaySec: 0.16 }, // Card 1 (Far Left)
    { xPct: -138, rot: -7,  y: 9,  zIndex: 2, staggerDelaySec: 0.08 }, // Card 2 (Mid Left)
    { xPct: -46,  rot: -2.5,y: 0,  zIndex: 4, staggerDelaySec: 0.03 }, // Card 3 (Inner Left)
    { xPct: 46,   rot: 2.5, y: 0,  zIndex: 5, staggerDelaySec: 0 },    // Card 4 (Center Hero Card on Front)
    { xPct: 138,  rot: 7,   y: 9,  zIndex: 2, staggerDelaySec: 0.08 }, // Card 5 (Mid Right)
    { xPct: 230,  rot: 11,  y: 20, zIndex: 1, staggerDelaySec: 0.16 }, // Card 6 (Far Right)
  ],
  detail: {
    spring: { stiffness: 300, damping: 30 },
  },
};

// Stacked deck micro-offsets when cards are bundled together (Frame 35-65 in reference video)
export const STACKED_DECK_OFFSETS = [
  { x: -9, rot: -2.5, yOffset: 0, zIndex: 1 },  // Card 1 (Back Left)
  { x: -4, rot: -1.2, yOffset: 0, zIndex: 2 },  // Card 2
  { x: -1, rot: -0.4, yOffset: 0, zIndex: 4 },  // Card 3
  { x: 0,  rot: 0.6,  yOffset: 0, zIndex: 10 }, // Card 4 (Top Hero - Best Seller)
  { x: 3,  rot: 1.5,  yOffset: 0, zIndex: 3 },  // Card 5
  { x: 8,  rot: 2.6,  yOffset: 0, zIndex: 2 },  // Card 6
];

export type ShowcasePhase = "intro" | "fan" | "rail" | "detail";

export interface ShowcaseProductItem {
  id: string;
  product: Product;
  displayTitle: string;
  categoryTag: string;
  priceFormatted: string;
  originalPriceFormatted?: string;
  rating: number;
  reviewsCount: number;
  fullBleedImage: string;
  objectPosition: string;
  description: string;
  colors: { name: string; hex: string }[];
  sizes: { label: string; available: boolean }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 6 CURATED SHOWCASE PRODUCTS (Zero White Space · Full-Bleed Editorial Images)
// Real Veyro items paired with high-resolution lifestyle campaign photographs.
// ─────────────────────────────────────────────────────────────────────────────
const SHOWCASE_ITEMS: ShowcaseProductItem[] = [
  {
    id: "showcase-1",
    product: allProducts.find((p) => p.id === "vey-tsh-ovr-001") || allProducts[0],
    displayTitle: "Summer Cloths",
    categoryTag: "Drop 01",
    priceFormatted: "₹1,299",
    originalPriceFormatted: "₹1,699",
    rating: 4.8,
    reviewsCount: 142,
    fullBleedImage: "/hero/panel-graphic-tee.webp", // Vibrant graphic editorial photo
    objectPosition: "center 20%",
    description:
      "Vibrant high-density graphic on 240gsm combed cotton jersey. Boxy drop-shoulder cut with reinforced collar ribbing for everyday street drape.",
    colors: [
      { name: "Cream Yellow", hex: "#fef08a" },
      { name: "Warm Olive", hex: "#5c6b4f" },
      { name: "Jet Black", hex: "#111111" },
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: false }, // 1 disabled size as requested
    ],
  },
  {
    id: "showcase-2",
    product: allProducts.find((p) => p.id === "vey-tsh-ovr-002") || allProducts[1],
    displayTitle: "Winter Cloths",
    categoryTag: "Featured",
    priceFormatted: "₹1,899",
    originalPriceFormatted: "₹2,299",
    rating: 4.7,
    reviewsCount: 96,
    fullBleedImage: "/hero/panel-oversized-tees-clean.webp", // Lifestyle oversized tees neutral studio
    objectPosition: "center 28%",
    description:
      "Heavyweight thermal fleece blend crafted for modular winter layering. Architectural drape with dropped shoulders and tactile ribbed hem.",
    colors: [
      { name: "Warm Sand", hex: "#d5c4a1" },
      { name: "Off-White", hex: "#f5f0eb" },
      { name: "Charcoal", hex: "#2b2b2b" },
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: true },
    ],
  },
  {
    id: "showcase-3",
    product: allProducts.find((p) => p.id === "vey-tsh-ovr-003") || allProducts[2],
    displayTitle: "Modern Shorts",
    categoryTag: "Essential",
    priceFormatted: "₹1,499",
    originalPriceFormatted: "₹1,899",
    rating: 4.9,
    reviewsCount: 88,
    fullBleedImage: "/hero/panel-linen-shirt.webp", // Teal linen shirt editorial photo
    objectPosition: "center 25%",
    description:
      "Tailored resort silhouette cut from pure French flax linen. Airy, breathable weave designed for coastal warmth and easy evening drape.",
    colors: [
      { name: "Ocean Teal", hex: "#1e6068" },
      { name: "Crisp White", hex: "#ffffff" },
      { name: "Natural Sage", hex: "#8a9a86" },
    ],
    sizes: [
      { label: "S", available: false }, // Disabled size
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: true },
    ],
  },
  {
    // ── CARD #4: THE CENTER CARD THAT ENTERS FIRST ALONE ─────────────────────
    id: "showcase-4",
    product: allProducts.find((p) => p.id === "vey-tsh-ovr-004") || allProducts[3],
    displayTitle: "Woolan Fashion", // Iconic title matching the reference video
    categoryTag: "Best Seller",
    priceFormatted: "₹1,399",
    originalPriceFormatted: "₹1,799",
    rating: 4.9,
    reviewsCount: 312,
    fullBleedImage: "/images/woolan-fashion-portrait-centered.webp", // Perfectly centered 1152x1536 3:4 portrait of streetwear model
    objectPosition: "center center",
    description:
      "Bring the past into the future with VEYRO architectural street silhouettes. Heavyweight 240gsm jersey with geometric graphic accents, designed for timeless daily rotation.",
    colors: [
      { name: "Jet Black", hex: "#111111" },
      { name: "Crimson Red", hex: "#b91c1c" },
      { name: "Cyan Teal", hex: "#06b6d4" },
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: false }, // 1 disabled size as requested
    ],
  },
  {
    id: "showcase-5",
    product: allProducts.find((p) => p.id === "vey-ftw-std-001") || allProducts[4],
    displayTitle: "Jogger Outfit",
    categoryTag: "Court Sneaker",
    priceFormatted: "₹2,899",
    originalPriceFormatted: "₹3,499",
    rating: 4.8,
    reviewsCount: 164,
    fullBleedImage: "/hero/panel-footwear.webp", // Retro sneaker on stone pedestal
    objectPosition: "center center",
    description:
      "Handcrafted Italian vulcanized rubber court sneakers. Full-grain calf leather upper with cushioned EVA insole for 12-hour continuous walking comfort.",
    colors: [
      { name: "Chalk White", hex: "#f0eeea" },
      { name: "Warm Clay", hex: "#b5aea4" },
      { name: "Vintage Tan", hex: "#c29b68" },
    ],
    sizes: [
      { label: "UK 7", available: true },
      { label: "UK 8", available: true },
      { label: "UK 9", available: true },
      { label: "UK 10", available: true },
      { label: "UK 11", available: false },
    ],
  },
  {
    id: "showcase-6",
    product: allProducts.find((p) => p.id === "vey-tsh-reg-001") || allProducts[5],
    displayTitle: "Model Outfit",
    categoryTag: "Limited",
    priceFormatted: "₹999",
    originalPriceFormatted: "₹1,299",
    rating: 4.7,
    reviewsCount: 78,
    fullBleedImage: "/hero/panel-classic-fit-highres.webp", // Tailored fit portrait
    objectPosition: "center 22%",
    description:
      "The definitive Indian essential. Pure combed cotton jersey, reinforced collar ribbing, and clean set-in sleeves for tailored tuck or casual drape.",
    colors: [
      { name: "Pure White", hex: "#ffffff" },
      { name: "Heather Grey", hex: "#9ca3af" },
      { name: "Dark Navy", hex: "#1e293b" },
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: true },
    ],
  },
  {
    id: "showcase-7",
    product: allProducts.find((p) => p.id === "vey-tsh-gfx-001") || allProducts[0],
    displayTitle: "Apex Arachnid Tee",
    categoryTag: "Graphic",
    priceFormatted: "₹1,299",
    originalPriceFormatted: "₹1,699",
    rating: 4.9,
    reviewsCount: 118,
    fullBleedImage: "/products/tshirts/apex-arachnid-front.webp",
    objectPosition: "center center",
    description:
      "Architectural arachnid high-density screen print on 240gsm combed cotton jersey. Boxy drop-shoulder cut with reinforced ribbing.",
    colors: [
      { name: "Charcoal Black", hex: "#18181b" },
      { name: "Slate Grey", hex: "#475569" },
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: true },
    ],
  },
  {
    id: "showcase-8",
    product: allProducts.find((p) => p.id === "vey-tsh-txr-001") || allProducts[0],
    displayTitle: "Falcon Waffle Tee",
    categoryTag: "Textured",
    priceFormatted: "₹1,599",
    originalPriceFormatted: "₹2,099",
    rating: 4.8,
    reviewsCount: 92,
    fullBleedImage: "/products/tshirts/grid-waffle-falcon-tee-front.webp",
    objectPosition: "center center",
    description:
      "Heavyweight tactile waffle knit crafted from 100% organic cotton. Sculpted drop shoulder profile with breathable honeycomb weave.",
    colors: [
      { name: "Falcon Grey", hex: "#6b7280" },
      { name: "Oatmeal", hex: "#e5e7eb" },
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: false },
    ],
  },
  {
    id: "showcase-9",
    product: allProducts.find((p) => p.id === "vey-tsh-gfx-002") || allProducts[0],
    displayTitle: "Echo Dragon Tee",
    categoryTag: "Oversized",
    priceFormatted: "₹1,499",
    originalPriceFormatted: "₹1,899",
    rating: 4.9,
    reviewsCount: 145,
    fullBleedImage: "/products/tshirts/echo-dragon-oversized-tee-front.webp",
    objectPosition: "center center",
    description:
      "Mythic dragon high-density puff print across upper back and chest. 260gsm heavy drop drape for relaxed street silhouettes.",
    colors: [
      { name: "Jet Black", hex: "#111111" },
      { name: "Crimson", hex: "#991b1b" },
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: true },
    ],
  },
  {
    id: "showcase-10",
    product: allProducts.find((p) => p.id === "vey-ftw-ret-001") || allProducts[0],
    displayTitle: "Campus Retro Sneaker",
    categoryTag: "Footwear",
    priceFormatted: "₹3,199",
    originalPriceFormatted: "₹4,199",
    rating: 4.8,
    reviewsCount: 76,
    fullBleedImage: "/products/shoes/veyro-shoe-04-primary.webp",
    objectPosition: "center center",
    description:
      "Vintage court heritage sneaker with suede overlays and vulcanized rubber cupsole. Engineered for modern street durability.",
    colors: [
      { name: "Forest Green", hex: "#166534" },
      { name: "Classic White", hex: "#ffffff" },
    ],
    sizes: [
      { label: "UK 7", available: true },
      { label: "UK 8", available: true },
      { label: "UK 9", available: true },
      { label: "UK 10", available: true },
      { label: "UK 11", available: true },
    ],
  },
  {
    id: "showcase-11",
    product: allProducts.find((p) => p.id === "vey-tsh-txr-002") || allProducts[0],
    displayTitle: "Ridge Ribbed Tee",
    categoryTag: "Textured",
    priceFormatted: "₹1,299",
    originalPriceFormatted: "₹1,499",
    rating: 4.7,
    reviewsCount: 64,
    fullBleedImage: "/products/tshirts/ridge-ribbed-brown-front.webp",
    objectPosition: "center center",
    description:
      "Vertical engineered rib knit in rich earthen tones. Clean collar and refined cuff finish for effortless pairing.",
    colors: [
      { name: "Earthen Brown", hex: "#78350f" },
      { name: "Deep Olive", hex: "#3f6212" },
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: true },
    ],
  },
  {
    id: "showcase-12",
    product: allProducts.find((p) => p.id === "vey-tsh-txr-003") || allProducts[0],
    displayTitle: "Forge Heavyweight",
    categoryTag: "Textured",
    priceFormatted: "₹1,799",
    originalPriceFormatted: "₹2,299",
    rating: 4.9,
    reviewsCount: 89,
    fullBleedImage: "/products/tshirts/forge-charcoal-clean-front.webp",
    objectPosition: "center center",
    description:
      "280gsm architectural heavyweight cotton jersey. Pre-shrunk industrial washed finish with structured boxy fit.",
    colors: [
      { name: "Charcoal", hex: "#374151" },
      { name: "Midnight", hex: "#0f172a" },
    ],
    sizes: [
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: true },
      { label: "XL", available: true },
      { label: "2XL", available: true },
    ],
  },
  {
    id: "showcase-13",
    product: allProducts.find((p) => p.id === "vey-ftw-chk-001") || allProducts[0],
    displayTitle: "Elevate Chunky Sneaker",
    categoryTag: "Footwear",
    priceFormatted: "₹3,699",
    originalPriceFormatted: "₹4,799",
    rating: 4.8,
    reviewsCount: 112,
    fullBleedImage: "/products/shoes/veyro-shoe-07-primary.webp",
    objectPosition: "center center",
    description:
      "Sculpted EVA platform midsole with layered technical mesh and premium leather trims. High-impact street sneaker.",
    colors: [
      { name: "Triple White", hex: "#ffffff" },
      { name: "Stealth Grey", hex: "#6b7280" },
    ],
    sizes: [
      { label: "UK 7", available: true },
      { label: "UK 8", available: true },
      { label: "UK 9", available: true },
      { label: "UK 10", available: true },
      { label: "UK 11", available: false },
    ],
  },
  {
    id: "showcase-14",
    product: allProducts.find((p) => p.id === "vey-ftw-min-002") || allProducts[0],
    displayTitle: "Mono Low Sneaker",
    categoryTag: "Minimal",
    priceFormatted: "₹2,799",
    originalPriceFormatted: "₹3,599",
    rating: 4.9,
    reviewsCount: 98,
    fullBleedImage: "/products/shoes/veyro-shoe-02-primary.webp",
    objectPosition: "center center",
    description:
      "Monochrome low-profile court sneaker with Italian calf leather and padded collar for all-day comfort.",
    colors: [
      { name: "Pure Chalk", hex: "#fafaf9" },
      { name: "Obsidian", hex: "#09090b" },
    ],
    sizes: [
      { label: "UK 7", available: true },
      { label: "UK 8", available: true },
      { label: "UK 9", available: true },
      { label: "UK 10", available: true },
      { label: "UK 11", available: true },
    ],
  },
];

interface ShowcaseDeckCardProps {
  item: ShowcaseProductItem;
  index: number;
  introStep: "deck" | "fan" | "settled";
  shouldReduceMotion: boolean | null;
  cardSpread: any;
  smoothProgress: any;
  deckEnterY: any;
  deckEnterOpacity: any;
  deckEnterScale: any;
  railOffset: any;
  onPointerDown: (e: React.PointerEvent) => void;
  onClick: (item: ShowcaseProductItem, e: React.MouseEvent<HTMLButtonElement>) => void;
}

function ShowcaseDeckCard({
  item,
  index,
  introStep,
  shouldReduceMotion,
  cardSpread,
  smoothProgress,
  deckEnterY,
  deckEnterOpacity,
  deckEnterScale,
  railOffset,
  onPointerDown,
  onClick,
}: ShowcaseDeckCardProps) {
  const fanConfig = SHOWCASE_CONFIG.fanTargets[index] || {
    xPct: 0,
    rot: 0,
    y: 0,
    zIndex: 1,
  };
  const stacked = STACKED_DECK_OFFSETS[index] || { x: 0, rot: 0, yOffset: 0, zIndex: 1 };

  // Responsive fan offset multipliers
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const isTablet = typeof window !== "undefined" && window.innerWidth < 1024 && window.innerWidth >= 640;
  const fanSpreadMultiplier = isMobile ? 0.44 : isTablet ? 0.72 : 1.0;
  const fanTargetX = (fanConfig.xPct / 100) * 156 * fanSpreadMultiplier;

  // Horizontal rail target position
  const railCardWidth = isMobile ? 160 : isTablet ? 226 : 270;
  const railSpacing = railCardWidth + 22;
  const baseRailTargetX = (index - 2.5) * railSpacing;

  // ── DYNAMIC MOTION VALUE TRANSFORMS ──
  const cardX = useTransform(
    [cardSpread, smoothProgress, railOffset],
    ([spread, scrollProg, offset]: number[]) => {
      const currentRailX = baseRailTargetX + (offset || 0);
      if (index >= 6) {
        return currentRailX;
      }
      if (scrollProg > 0) {
        const t = Math.min(scrollProg / SHOWCASE_CONFIG.scrollTrack.phaseBThreshold, 1);
        return fanTargetX + (currentRailX - fanTargetX) * t;
      }
      return stacked.x * (1 - spread) + fanTargetX * spread;
    }
  );

  const cardY = useTransform(
    [cardSpread, smoothProgress, deckEnterY],
    ([spread, scrollProg, enterY]: number[]) => {
      if (index >= 6) return 0;
      if (introStep === "deck") {
        return enterY + stacked.yOffset;
      }
      if (scrollProg > 0) {
        const t = Math.min(scrollProg / SHOWCASE_CONFIG.scrollTrack.phaseBThreshold, 1);
        return fanConfig.y * (1 - t);
      }
      return fanConfig.y * spread;
    }
  );

  const cardRot = useTransform(
    [cardSpread, smoothProgress],
    ([spread, scrollProg]: number[]) => {
      if (shouldReduceMotion || index >= 6) return 0;
      if (scrollProg > 0) {
        const t = Math.min(scrollProg / SHOWCASE_CONFIG.scrollTrack.phaseBThreshold, 1);
        return fanConfig.rot * (1 - t);
      }
      return stacked.rot * (1 - spread) + fanConfig.rot * spread;
    }
  );

  const cardOpacity = useTransform(
    [cardSpread, deckEnterOpacity, smoothProgress],
    ([spread, enterOp, scrollProg]: number[]) => {
      if (index >= 6) {
        if (scrollProg < 0.20) return 0;
        return Math.min(Math.max((scrollProg - 0.20) / 0.12, 0), 1);
      }
      return enterOp;
    }
  );

  const cardScale = useTransform(
    [cardSpread, deckEnterScale],
    ([spread, enterSc]: number[]) => {
      if (index >= 6) return 1;
      if (introStep === "deck") {
        return enterSc;
      }
      return 0.95 + 0.05 * spread;
    }
  );

  const metadataOpacity = useTransform(smoothProgress, [0.18, 0.35], [0, 1]);

  return (
    <motion.div
      key={item.id}
      style={{
        x: cardX,
        y: cardY,
        rotate: cardRot,
        opacity: cardOpacity,
        scale: cardScale,
        zIndex: introStep === "deck" ? stacked.zIndex : fanConfig.zIndex,
        willChange: "transform, opacity",
      }}
      className="absolute flex flex-col items-center"
    >
      <motion.button
        type="button"
        layoutId={`showcase-card-${item.id}`}
        transition={{ type: "spring", stiffness: 350, damping: 32 }}
        onPointerDown={onPointerDown}
        onClick={(e) => onClick(item, e)}
        aria-label={`View ${item.displayTitle} details`}
        className="group relative w-[148px] sm:w-[192px] md:w-[232px] lg:w-[262px] xl:w-[275px] aspect-[3/4] rounded-2xl overflow-hidden p-0 m-0 border-0 bg-neutral-900 shadow-[0_12px_36px_rgba(0,0,0,0.16)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.24)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 transition-shadow duration-300"
        style={{
          transform: "translateZ(0)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
        whileHover={
          shouldReduceMotion
            ? {}
            : {
                scale: 1.03,
                y: -6,
                transition: { duration: 0.25 },
              }
        }
      >
        <Image
          src={item.fullBleedImage}
          alt={item.displayTitle}
          fill
          priority={index === 3 || index === 2 || index === 1}
          quality={90}
          sizes="(max-width: 640px) 260px, (max-width: 1024px) 420px, 500px"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: item.objectPosition }}
        />
      </motion.button>

      <motion.div
        style={{ opacity: metadataOpacity }}
        className="w-[148px] sm:w-[192px] md:w-[232px] lg:w-[262px] xl:w-[275px] mt-1.5 sm:mt-2 flex flex-col text-left px-1 pointer-events-none"
      >
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold font-[family-name:var(--font-montserrat)] text-neutral-900">
          <span className="truncate pr-2">{item.displayTitle}</span>
          <span>{item.priceFormatted}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-neutral-500">
          <Star className="w-3.5 h-3.5 fill-veyro-yellow text-veyro-yellow" />
          <span className="font-semibold text-neutral-800">({item.rating})</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CollectionsShowcase() {
  const shouldReduceMotion = useReducedMotion();
  const { addToCart } = useCart();

  // Scroll track references
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Phase state machine: "intro" | "fan" | "rail" | "detail"
  const [phase, setPhase] = useState<ShowcasePhase>("intro");
  const [selectedProductItem, setSelectedProductItem] = useState<ShowcaseProductItem | null>(null);

  // Intro choreo step: "deck" (rising & holding bundled) | "fan" (springing outward) | "settled" (fully interactive)
  const [introStep, setIntroStep] = useState<"deck" | "fan" | "settled">("deck");

  // Detail View interactive controls
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Touch vs tap tracking
  const pointerStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const originatingCardRef = useRef<HTMLButtonElement | null>(null);

  // ── PHASE A MOTION VALUES (INTRO CHOREOGRAPHY) ─────────────────────────────
  // Unified rising deck motion values (starts 520px below screen viewport)
  const deckEnterY = useMotionValue(520);
  const deckEnterOpacity = useMotionValue(0);
  const deckEnterScale = useMotionValue(0.85);

  // Carousel pagination state for horizontal rail
  const [carouselIndex, setCarouselIndex] = useState(0);
  const railOffset = useMotionValue(0);
  const fallbackSpread = useMotionValue(1); // Constant spread value for cards beyond index 5

  // Fan spread progress for each card (0 = stacked in bundled deck, 1 = at fan target)
  const spread0 = useMotionValue(0);
  const spread1 = useMotionValue(0);
  const spread2 = useMotionValue(0);
  const spread3 = useMotionValue(0); // Center card spread
  const spread4 = useMotionValue(0);
  const spread5 = useMotionValue(0);
  const cardSpreads = [spread0, spread1, spread2, spread3, spread4, spread5];

  // ── PHASE B MOTION VALUES (SCROLL-LINKED TRANSFORM) ────────────────────────
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll progress via spring
  const smoothProgress = useSpring(scrollYProgress, SHOWCASE_CONFIG.scrollTrack.spring);

  // Headline A & B transforms
  const headlineAY = useTransform(smoothProgress, [0, 0.32], [0, -80]);
  const headlineAOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0]);
  const speechBubblesDisplay = useTransform(smoothProgress, (v) => (v >= 0.28 ? "none" : "block"));
  const headlineBY = useTransform(smoothProgress, [0.18, 0.35], [60, 0]);
  const headlineBOpacity = useTransform(smoothProgress, [0.18, 0.35], [0, 1]);

  // Horizontal rail parallax drift while scrolling between 0.35 and 1.0
  const railDriftX = useTransform(smoothProgress, [0.35, 1], [0, -120]);

  // Update phase state on scroll change
  useEffect(() => {
    return smoothProgress.on("change", (latest) => {
      if (phase === "detail") return;
      if (latest >= SHOWCASE_CONFIG.scrollTrack.phaseBThreshold) {
        setPhase("rail");
      } else if (introStep === "settled" || introStep === "fan") {
        setPhase("fan");
      }
    });
  }, [smoothProgress, phase, introStep]);

  // ── PHASE A: INTRO EXECUTION (Runs once on load) ───────────────────────────
  useEffect(() => {
    // If reduced motion is requested, immediately settle to fan state
    if (shouldReduceMotion) {
      setIntroStep("settled");
      setPhase("fan");
      deckEnterY.set(0);
      deckEnterOpacity.set(1);
      deckEnterScale.set(1);
      cardSpreads.forEach((s) => s.set(1));
      return;
    }

    // 1. Entire bundled deck glides up from below viewport (520px -> 0px) in 0.75s
    animate(deckEnterY, 0, {
      duration: SHOWCASE_CONFIG.intro.deckRiseDurationSec,
      ease: [0.16, 1, 0.3, 1],
    });
    animate(deckEnterOpacity, 1, { duration: 0.35, ease: "easeOut" });
    animate(deckEnterScale, 1, {
      duration: SHOWCASE_CONFIG.intro.deckRiseDurationSec,
      ease: [0.16, 1, 0.3, 1],
    });

    // 2. Holds bundled in center for 220ms, then cards spring outward into fan arc
    const tFan = setTimeout(() => {
      setIntroStep("fan");

      // Trigger spring outward from bundled center stack with center-outward stagger
      SHOWCASE_CONFIG.fanTargets.forEach((target, index) => {
        setTimeout(() => {
          animate(cardSpreads[index], 1, {
            type: "spring",
            stiffness: SHOWCASE_CONFIG.intro.spring.stiffness,
            damping: SHOWCASE_CONFIG.intro.spring.damping,
            mass: SHOWCASE_CONFIG.intro.spring.mass,
          });
        }, target.staggerDelaySec * 1000);
      });
    }, SHOWCASE_CONFIG.intro.fanSpringDelayMs);

    // 3. Settle intro (headline, floating pills, and CTA fully revealed and interactive)
    const tSettled = setTimeout(() => {
      setIntroStep("settled");
      setPhase("fan");
    }, SHOWCASE_CONFIG.intro.footerDelayMs);

    return () => {
      clearTimeout(tFan);
      clearTimeout(tSettled);
    };
  }, []);

  // ── DETAIL VIEW (PHASE C) LOGIC ───────────────────────────────────────────
  const openDetail = useCallback((item: ShowcaseProductItem, cardEl?: HTMLButtonElement | null) => {
    originatingCardRef.current = cardEl || null;
    setSelectedProductItem(item);
    setSelectedSize(item.sizes[0]?.label || "S"); // Pre-select S matching reference video frame 220
    setSelectedColor(item.colors[0]?.name || "Classic");
    setAddedSuccess(false);
    setPhase("detail");

    // Push history state for browser back button support
    window.history.pushState({ modal: "product-detail", id: item.id }, "");
  }, []);

  const closeDetail = useCallback(() => {
    setPhase(smoothProgress.get() >= SHOWCASE_CONFIG.scrollTrack.phaseBThreshold ? "rail" : "fan");
    setSelectedProductItem(null);

    // Return focus to originating card
    setTimeout(() => {
      originatingCardRef.current?.focus();
    }, 150);
  }, [smoothProgress]);

  // Browser Back button listener
  useEffect(() => {
    const handlePopState = () => {
      if (phase === "detail") {
        closeDetail();
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [phase, closeDetail]);

  // Esc key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase === "detail") {
        closeDetail();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, closeDetail]);

  // In-stage transition (no body scroll lock so sticky container stays anchored)

  // Add to Bag handler
  const handleAddToCart = () => {
    if (!selectedProductItem || !selectedSize) return;
    addToCart(selectedProductItem.product, selectedSize, 1, true);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2400);
  };

  // Pointer drag vs tap protection (< 8px threshold)
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCardClick = (item: ShowcaseProductItem, e: React.MouseEvent<HTMLButtonElement>) => {
    if (pointerStartPosRef.current) {
      const dx = Math.abs(e.clientX - pointerStartPosRef.current.x);
      const dy = Math.abs(e.clientY - pointerStartPosRef.current.y);
      if (dx > 8 || dy > 8) return; // Finger dragged, ignore click
    }
    openDetail(item, e.currentTarget);
  };

  // Scroll controls
  const scrollToRail = useCallback(() => {
    if (!trackRef.current) return;
    const trackTop = trackRef.current.offsetTop;
    const scrollTarget = trackTop + window.innerHeight * 1.1;
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  }, []);

  const scrollToFan = useCallback(() => {
    if (!trackRef.current) return;
    const trackTop = trackRef.current.offsetTop;
    window.scrollTo({ top: trackTop, behavior: "smooth" });
  }, []);

  // Responsive rail metrics
  const getRailMetrics = useCallback(() => {
    if (typeof window === "undefined") {
      return { spacing: 292 };
    }
    const width = window.innerWidth;
    if (width < 640) {
      return { spacing: 160 + 22 }; // mobile: 182px
    }
    if (width < 1024) {
      return { spacing: 226 + 22 }; // tablet: 248px
    }
    return { spacing: 270 + 22 }; // desktop: 292px
  }, []);

  // Max pagination index ensures all catalog cards can slide smoothly into view
  const maxCarouselIndex = Math.max(0, SHOWCASE_ITEMS.length - 4);

  const handleRailScroll = useCallback(
    (dir: "left" | "right") => {
      const { spacing } = getRailMetrics();
      const currentIdx = carouselIndex;
      const nextIdx =
        dir === "right"
          ? Math.min(currentIdx + 1, maxCarouselIndex)
          : Math.max(currentIdx - 1, 0);

      if (nextIdx === currentIdx) return;

      setCarouselIndex(nextIdx);
      const targetOffset = -nextIdx * spacing;

      animate(railOffset, targetOffset, {
        type: "spring",
        stiffness: 280,
        damping: 28,
        mass: 0.8,
      });
    },
    [carouselIndex, maxCarouselIndex, getRailMetrics, railOffset]
  );

  const handleResetRailOrScrollToFan = useCallback(() => {
    if (carouselIndex > 0) {
      setCarouselIndex(0);
      animate(railOffset, 0, {
        type: "spring",
        stiffness: 280,
        damping: 28,
        mass: 0.8,
      });
    } else {
      scrollToFan();
    }
  }, [carouselIndex, railOffset, scrollToFan]);

  // Keyboard navigation support for rail (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "rail" || selectedProductItem) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleRailScroll("right");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleRailScroll("left");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, selectedProductItem, handleRailScroll]);

  return (
    <div
      ref={trackRef}
      className="relative w-full bg-veyro-surface-alt text-veyro-black"
      style={{ height: `${SHOWCASE_CONFIG.scrollTrack.heightVh}vh` }}
    >
      <LayoutGroup id="collections-showcase-group">
        {/* ── STICKY VIEWPORT CONTAINER (Fits neatly inside viewport below sticky Navbar) ── */}
        <div
          ref={stageRef}
          className="sticky top-[74px] sm:top-[78px] lg:top-[82px] h-[calc(100vh-108px)] min-h-[460px] max-h-[calc(100dvh-104px)] w-full overflow-hidden relative flex flex-col justify-between pt-1 pb-1.5 sm:pb-2.5 px-3 sm:px-6 select-none touch-pan-y"
        >
          {/* Subtle Ambient Studio Light */}
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-b from-veyro-yellow/8 via-transparent to-transparent blur-3xl rounded-full"
            aria-hidden="true"
          />


          <AnimatePresence>
            {phase !== "detail" ? (
              <motion.div
                key="stage-overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex-1 w-full max-h-[720px] sm:max-h-[770px] lg:max-h-[810px] my-auto flex flex-col justify-between"
              >
                {/* ── 2. HEADLINE STAGE ─────────────────────────────────────────── */}
                <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center text-center pt-2 sm:pt-3 md:pt-4 z-20">
            {/* Headline A: "The Ultimate COLLECTIONS" (Slides up and fades on scroll) */}
            <motion.div
              style={{ y: headlineAY, opacity: headlineAOpacity }}
              className="relative flex flex-col items-center pointer-events-none"
            >
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  animate={introStep === "fan" || introStep === "settled" ? { y: "0%" } : { y: "100%" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="font-[family-name:var(--font-outfit)] text-sm sm:text-[17px] md:text-xl font-medium tracking-normal text-neutral-800"
                >
                  The Ultimate
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={introStep === "fan" || introStep === "settled" ? { y: "0%" } : { y: "100%" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  className="font-[family-name:var(--font-outfit)] text-3xl sm:text-4xl md:text-5xl lg:text-[53px] font-bold uppercase tracking-tight text-veyro-black leading-none mt-1"
                >
                  COLLECTIONS
                </motion.h1>
              </div>
            </motion.div>

            {/* Headline B: "Best Selling Product Of The COLLECTION" (Slides in on scroll) */}
            <motion.div
              style={{ y: headlineBY, opacity: headlineBOpacity }}
              className="absolute top-2 sm:top-3 md:top-4 flex flex-col items-center pointer-events-none"
            >
              <h2 className="font-[family-name:var(--font-outfit)] text-sm sm:text-[17px] md:text-lg font-medium text-neutral-800">
                Best Selling Product Of The
              </h2>
              <h1 className="font-[family-name:var(--font-outfit)] text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-bold uppercase tracking-tight text-veyro-black leading-none mt-1">
                COLLECTION
              </h1>
            </motion.div>
          </div>

          {/* ── 3. FLOATING SPEECH BUBBLES WITH TAILS (Only visible in Stage 1 Fan Deck) ── */}
          <motion.div
            style={{ opacity: headlineAOpacity, display: speechBubblesDisplay }}
            className="absolute top-[14%] sm:top-[16%] md:top-[18%] inset-x-0 w-full max-w-6xl mx-auto pointer-events-none z-30 px-4 sm:px-8"
          >
            {/* Left Cyan Speech Bubble ("Get up to 50% Off") */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={
                introStep === "fan" || introStep === "settled"
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: shouldReduceMotion ? 0 : [0, -5, 0],
                    }
                  : { opacity: 0, scale: 0.75 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.3 }
                  : {
                      opacity: { duration: 0.4, delay: 0.2 },
                      scale: { duration: 0.4, delay: 0.2 },
                      y: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
                    }
              }
              className="absolute left-3 sm:left-6 md:left-10 lg:left-14 top-0 pointer-events-auto"
            >
              <div className="relative bg-cyan-500 text-white text-xs sm:text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 font-[family-name:var(--font-outfit)]">
                <Sparkles className="w-3 h-3 text-white" />
                <span>Get up to 50% Off</span>
                {/* Speech tail pointing inward towards cards */}
                <div className="absolute -bottom-1 left-3.5 w-2 h-2 bg-cyan-500 rotate-45" />
              </div>
            </motion.div>

            {/* Right Orange Speech Bubble ("New Season") */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={
                introStep === "fan" || introStep === "settled"
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: shouldReduceMotion ? 0 : [0, 5, 0],
                    }
                  : { opacity: 0, scale: 0.75 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.3 }
                  : {
                      opacity: { duration: 0.4, delay: 0.3 },
                      scale: { duration: 0.4, delay: 0.3 },
                      y: { duration: 3.8, repeat: Infinity, ease: "easeInOut" },
                    }
              }
              className="absolute right-3 sm:right-6 md:right-10 lg:right-14 top-0 pointer-events-auto"
            >
              <div className="relative bg-orange-500 text-white text-xs sm:text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1 font-[family-name:var(--font-outfit)]">
                <span>New Season</span>
                {/* Speech tail pointing inward towards cards */}
                <div className="absolute -bottom-1 right-3.5 w-2 h-2 bg-orange-500 rotate-45" />
              </div>
            </motion.div>
          </motion.div>

          {/* ── 4. CARDS DECK & RAIL CONTAINER (Centered Stage) ───────────── */}
          <div className="relative w-full flex-1 flex items-center justify-center my-auto min-h-[375px] sm:min-h-[415px] z-10">
            {/* Cards Stage Container */}
            <div
              ref={railRef}
              className="relative w-full h-full flex items-center justify-center overflow-visible"
            >
              {SHOWCASE_ITEMS.map((item, index) => (
                <ShowcaseDeckCard
                  key={item.id}
                  item={item}
                  index={index}
                  introStep={introStep}
                  shouldReduceMotion={shouldReduceMotion}
                  cardSpread={cardSpreads[index] || fallbackSpread}
                  smoothProgress={smoothProgress}
                  deckEnterY={deckEnterY}
                  deckEnterOpacity={deckEnterOpacity}
                  deckEnterScale={deckEnterScale}
                  railOffset={railOffset}
                  onPointerDown={handlePointerDown}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>

          {/* ── 5. FOOTER STAGE & CTA (From Reference Video) ──────────────── */}
          <div className="relative w-full max-w-xl mx-auto flex flex-col items-center text-center z-20 pb-2 sm:pb-3 md:pb-4">
            {/* Fan Deck Footer (visible when scrollProgress < 0.28) */}
            <motion.div
              style={{ opacity: headlineAOpacity }}
              className="flex flex-col items-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={
                  introStep === "fan" || introStep === "settled"
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 16 }
                }
                transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <p className="-translate-y-2 sm:-translate-y-2.5 font-[family-name:var(--font-outfit)] text-sm sm:text-base md:text-[17px] text-neutral-800 max-w-md sm:max-w-xl leading-relaxed font-medium">
                  We Do Not Divide Our Collections To Seasons. We Create New Models Every Week, And We In A Few Items.
                </p>
                <button
                  type="button"
                  onClick={scrollToRail}
                  className="mt-2.5 sm:mt-3 px-8 py-3 bg-veyro-black hover:bg-neutral-800 text-white rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-md flex items-center gap-2 group font-[family-name:var(--font-outfit)]"
                >
                  <span>Explore More</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </motion.div>

            {/* Rail Footer (visible when scrollProgress >= 0.28) */}
            <motion.div
              style={{ opacity: headlineBOpacity }}
              className="absolute inset-x-0 bottom-6 sm:bottom-8 md:bottom-10 flex flex-col items-center pointer-events-auto"
            >
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleRailScroll("left")}
                  disabled={carouselIndex === 0}
                  aria-label="Previous products"
                  className={`w-9 h-9 rounded-full bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center transition-colors shadow-sm ${
                    carouselIndex === 0
                      ? "opacity-35 cursor-not-allowed"
                      : "hover:text-black hover:border-black cursor-pointer active:scale-95"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <Link
                  href="/collections/all"
                  aria-label="View all products in complete Veyro archive"
                  className="px-7 py-3 bg-veyro-black hover:bg-neutral-800 active:scale-98 text-white rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition cursor-pointer shadow-md flex items-center gap-2 font-[family-name:var(--font-outfit)] group"
                >
                  <span>See All Product</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleRailScroll("right")}
                  disabled={carouselIndex >= maxCarouselIndex}
                  aria-label="Next products"
                  className={`w-9 h-9 rounded-full bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center transition-colors shadow-sm ${
                    carouselIndex >= maxCarouselIndex
                      ? "opacity-35 cursor-not-allowed"
                      : "hover:text-black hover:border-black cursor-pointer active:scale-95"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : selectedProductItem ? (
        <motion.div
          key={`stage-detail-${selectedProductItem.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 w-full h-full z-30 bg-veyro-surface-alt flex flex-col p-2 sm:p-4 pointer-events-auto overflow-y-auto"
        >
          <div className="w-full max-w-5xl mx-auto my-auto flex flex-col justify-center">
          {/* Top Navigation Bar: Back to Collection & Close */}
          <div className="w-full flex items-center justify-between pb-2 sm:pb-3 mb-1">
            <button
              type="button"
              onClick={closeDetail}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-black px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer group font-[family-name:var(--font-montserrat)]"
            >
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Collection</span>
            </button>
            <button
              type="button"
              onClick={closeDetail}
              aria-label="Close detail view"
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Column: Expanded Hero Portrait (Shared Element layoutId) */}
            <div className="flex justify-center md:justify-end">
              <motion.div
                layoutId={`showcase-card-${selectedProductItem.id}`}
                transition={{ type: "spring", stiffness: 350, damping: 32 }}
                className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[3/4] max-h-[470px] lg:max-h-[515px] rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.14)] bg-neutral-900"
              >
                <Image
                  src={selectedProductItem.fullBleedImage}
                  alt={selectedProductItem.displayTitle}
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover w-full h-full pointer-events-none"
                  style={{ objectPosition: selectedProductItem.objectPosition }}
                />
              </motion.div>
            </div>

            {/* Right Column: In-Stage Product Information Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center max-w-md"
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-2xs font-mono font-bold tracking-[0.2em] uppercase text-neutral-400">
                  VEYRO ARCHIVE // COLLECTION DROP
                </span>
                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-[9.5px] font-bold uppercase tracking-wider text-neutral-700 font-[family-name:var(--font-montserrat)]">
                  {selectedProductItem.categoryTag}
                </span>
              </div>

              <h2
                id="pdp-title"
                className="font-[family-name:var(--font-montserrat)] text-2xl sm:text-3xl lg:text-[34px] font-black uppercase tracking-tight text-veyro-black leading-tight"
              >
                {selectedProductItem.displayTitle}
              </h2>

              {/* Price and Rating */}
              <div className="flex items-center gap-3 mt-1.5 mb-3">
                <span className="text-2xl font-extrabold text-veyro-black">
                  {selectedProductItem.priceFormatted}
                </span>
                {selectedProductItem.originalPriceFormatted && (
                  <span className="text-xs sm:text-sm text-neutral-400 line-through">
                    {selectedProductItem.originalPriceFormatted}
                  </span>
                )}
                <div className="flex items-center gap-1 ml-auto text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-veyro-yellow text-veyro-yellow" />
                  <span>{selectedProductItem.rating}</span>
                  <span className="text-neutral-400">({selectedProductItem.reviewsCount})</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4 font-[family-name:var(--font-montserrat)]">
                {selectedProductItem.description}
              </p>

              {/* Size Selector */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 font-[family-name:var(--font-montserrat)]">
                  <span>SELECT SIZE (US)</span>
                  <span className="text-neutral-400 font-normal capitalize">
                    {selectedSize ? `Selected: ${selectedSize}` : "Please choose a size"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProductItem.sizes.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setSelectedSize(s.label)}
                      className={`min-w-[44px] h-9 px-3 text-xs font-bold rounded-lg border transition-colors cursor-pointer font-[family-name:var(--font-montserrat)] ${
                        !s.available
                          ? "bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed line-through"
                          : selectedSize === s.label
                          ? "bg-veyro-black text-white border-veyro-black shadow-sm"
                          : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div className="mb-5">
                <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2 font-[family-name:var(--font-montserrat)]">
                  <span>SELECT COLOR: <span className="font-normal text-neutral-500">{selectedColor}</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  {selectedProductItem.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.name)}
                      aria-label={`Select ${c.name} color`}
                      className={`w-6 h-6 rounded-full border-2 transition-colors cursor-pointer ${
                        selectedColor === c.name
                          ? "border-black scale-110 shadow-md ring-2 ring-black/20"
                          : "border-neutral-300 hover:border-neutral-500"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Add-to-Cart Button */}
              <button
                type="button"
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className={`w-fit px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2.5 shadow-md font-[family-name:var(--font-montserrat)] ${
                  !selectedSize
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    : addedSuccess
                    ? "bg-emerald-600 text-white shadow-emerald-200"
                    : "bg-veyro-black hover:bg-neutral-800 text-white cursor-pointer active:scale-[0.98]"
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-veyro-yellow" />
                    <span>{selectedSize ? "Add to Cart" : "Select a Size to Add"}</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>
      ) : null}
    </AnimatePresence>
  </div>
      </LayoutGroup>
    </div>
  );
}
