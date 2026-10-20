"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ShoppingBag,
  Sparkles,
  Check,
  Layers,
  Star,
  Play,
  Pause,
  ArrowRight,
  Eye,
} from "lucide-react";
import { products as allProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

export type ShowcaseStage = "fan" | "rail" | "detail";

interface ShowcaseItem {
  product: Product;
  displayTitle: string;
  tag: string;
  priceFormatted: string;
  originalPriceFormatted?: string;
  rating: number;
  ratingCount: number;
  bgAccent: string; // Background studio tone matching the video cards
}

// 6 Curated cards matching the video's vibrant editorial collection
const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    product: allProducts.find((p) => p.id === "vey-tsh-ovr-001") || allProducts[0],
    displayTitle: "Summer Outfit",
    tag: "For Men",
    priceFormatted: "₹1,199",
    originalPriceFormatted: "₹1,599",
    rating: 4.8,
    ratingCount: 128,
    bgAccent: "bg-[#fcd017]/15", // Warm yellow tone like Card 1 in video
  },
  {
    product: allProducts.find((p) => p.id === "vey-tsh-ovr-002") || allProducts[1],
    displayTitle: "Winter Outfit",
    tag: "Hot Drop",
    priceFormatted: "₹1,299",
    originalPriceFormatted: "₹1,699",
    rating: 4.7,
    ratingCount: 94,
    bgAccent: "bg-[#f97316]/15", // Orange tone like Card 2 in video
  },
  {
    product: allProducts.find((p) => p.id === "vey-tsh-ovr-003") || allProducts[2],
    displayTitle: "Modern Shorts",
    tag: "Essential",
    priceFormatted: "₹999",
    originalPriceFormatted: "₹1,299",
    rating: 4.6,
    ratingCount: 82,
    bgAccent: "bg-[#84cc16]/15", // Warm green/beige tone like Card 3 in video
  },
  {
    product: allProducts.find((p) => p.id === "vey-tsh-ovr-004") || allProducts[3],
    displayTitle: "Woolan Fashion", // The iconic center card in video!
    tag: "Best Seller",
    priceFormatted: "₹1,399",
    originalPriceFormatted: "₹1,799",
    rating: 4.9,
    ratingCount: 246,
    bgAccent: "bg-[#ea580c]/15", // Studio rust tone like Card 4 in video
  },
  {
    product: allProducts.find((p) => p.id === "vey-ftw-std-001") || allProducts[4],
    displayTitle: "Jogger Outfit",
    tag: "Trending",
    priceFormatted: "₹2,899",
    originalPriceFormatted: "₹3,299",
    rating: 4.8,
    ratingCount: 110,
    bgAccent: "bg-[#06b6d4]/15", // Cyan/teal studio tone like Card 5 in video
  },
  {
    product: allProducts.find((p) => p.id === "vey-tsh-reg-001") || allProducts[5],
    displayTitle: "Modern Outfit",
    tag: "Limited",
    priceFormatted: "₹1,149",
    originalPriceFormatted: "₹1,499",
    rating: 4.7,
    ratingCount: 76,
    bgAccent: "bg-[#f59e0b]/15", // Warm studio tone like Card 6 in video
  },
];

// Fan arc geometry (concave curve across desktop)
const FAN_CONFIGS = [
  { xOffset: -370, yOffset: 24, rotate: -13, zIndex: 10 },
  { xOffset: -222, yOffset: 10, rotate: -7,  zIndex: 20 },
  { xOffset: -74,  yOffset: 0,  rotate: -2,  zIndex: 30 },
  { xOffset: 74,   yOffset: 0,  rotate: 2,   zIndex: 30 },
  { xOffset: 222,  yOffset: 10, rotate: 7,   zIndex: 20 },
  { xOffset: 370,  yOffset: 24, rotate: 13,  zIndex: 10 },
];

export function CollectionsInteractiveShowcase() {
  const shouldReduceMotion = useReducedMotion();
  const { addToCart } = useCart();

  const [stage, setStage] = useState<ShowcaseStage>("fan");
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Classic Black");
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const railContainerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play demo simulation matching the 13s video sequence
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      return;
    }

    // Sequence: Fan (0s - 4s) -> Rail (4s - 8s) -> Detail on Woolan Fashion (8s - 13s) -> Loop
    const runSequence = () => {
      setStage("fan");
      setSelectedItem(null);

      autoPlayTimerRef.current = setTimeout(() => {
        setStage("rail");

        autoPlayTimerRef.current = setTimeout(() => {
          // Select center card ("Woolan Fashion")
          const centerCard = SHOWCASE_ITEMS[3];
          setSelectedItem(centerCard);
          setStage("detail");

          autoPlayTimerRef.current = setTimeout(() => {
            // Loop back
            setStage("fan");
            setSelectedItem(null);
          }, 4500);
        }, 3800);
      }, 4200);
    };

    runSequence();
    const interval = setInterval(runSequence, 13000);

    return () => {
      clearInterval(interval);
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying]);

  // Keyboard navigation: Escape key closes the detail view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stage === "detail") {
        setStage("rail");
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage]);

  // Handle card click
  const handleSelectCard = (item: ShowcaseItem) => {
    setIsAutoPlaying(false);
    setSelectedItem(item);
    setSelectedSize(item.product.sizes?.[1] || item.product.sizes?.[0] || "M");
    setSelectedColor(item.product.colorName || "Classic Black");
    setAddedSuccess(false);
    setStage("detail");
  };

  // Close detail view back to rail
  const handleCloseDetail = () => {
    setStage("rail");
    setSelectedItem(null);
  };

  // Add to Bag action
  const handleAddToCart = () => {
    if (!selectedItem) return;
    addToCart(selectedItem.product, selectedSize, 1, true);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2400);
  };

  // Rail scroll helpers
  const handleScrollRail = (direction: "left" | "right") => {
    if (!railContainerRef.current) return;
    const scrollAmount = 300;
    railContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Touch gesture handler
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 45) {
      if (deltaX < 0 && stage === "fan") {
        setStage("rail");
      } else if (deltaX > 0 && stage === "rail") {
        if (railContainerRef.current && railContainerRef.current.scrollLeft <= 15) {
          setStage("fan");
        }
      }
    }
  };

  return (
    <section
      aria-label="Interactive Curated Collections Showcase"
      className="relative w-full bg-white border-b border-[#e8e8e5] overflow-hidden py-12 sm:py-20 select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── TOP CONTROLS & DEMO SWITCHER ── */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 sm:mb-10">
          {/* Segmented Mode Selector */}
          <div className="inline-flex items-center p-1 bg-[#f0eee9] rounded-full border border-neutral-300/60 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setStage("fan");
                setSelectedItem(null);
              }}
              className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors duration-200 ${
                stage === "fan" ? "text-white" : "text-neutral-600 hover:text-black"
              }`}
            >
              {stage === "fan" && (
                <motion.div
                  layoutId="activeShowcaseTab"
                  className="absolute inset-0 bg-[#111111] rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#fcd017]" />
                The Fan Deck
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAutoPlaying(false);
                setStage("rail");
                setSelectedItem(null);
              }}
              className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer transition-colors duration-200 ${
                stage === "rail" || stage === "detail"
                  ? "text-white"
                  : "text-neutral-600 hover:text-black"
              }`}
            >
              {(stage === "rail" || stage === "detail") && (
                <motion.div
                  layoutId="activeShowcaseTab"
                  className="absolute inset-0 bg-[#111111] rounded-full shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fcd017]" />
                Best Sellers Rail
              </span>
            </button>
          </div>

          {/* Autoplay Video Simulation Button */}
          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
              isAutoPlaying
                ? "bg-[#111111] text-[#fcd017] border-[#111111] shadow-sm animate-pulse"
                : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-[#fcd017]" />
                <span>Playing Video Flow</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Auto Demo</span>
              </>
            )}
          </button>
        </div>

        {/* ── STAGE 3: FULL PRODUCT DETAIL EXPANSION (1:1 FROM VIDEO) ── */}
        <AnimatePresence mode="wait">
          {stage === "detail" && selectedItem && (
            <motion.div
              key={`detail-${selectedItem.product.id}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-5xl mx-auto bg-white rounded-3xl border border-[#e8e8e5] p-6 sm:p-10 shadow-[0_24px_70px_rgba(0,0,0,0.09)] mb-12"
            >
              {/* Back / Close Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100 mb-8">
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Collection Rail</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  aria-label="Close detail view"
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid: Shared Large Image Left + Product Details Right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14 items-center">
                {/* Left Side: Shared Hero Image using layoutId */}
                <div className={`relative w-full h-[400px] sm:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden border border-neutral-200/80 shadow-inner flex items-center justify-center ${selectedItem.bgAccent}`}>
                  <motion.div
                    layoutId={`product-image-${selectedItem.product.id}`}
                    className="relative w-full h-full"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  >
                    <Image
                      src={selectedItem.product.imageUrl}
                      alt={selectedItem.displayTitle}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain p-6 sm:p-8"
                    />
                  </motion.div>

                  {/* Frosted tag on top-right */}
                  <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold uppercase rounded-full shadow-sm text-neutral-800">
                    {selectedItem.tag}
                  </span>
                </div>

                {/* Right Side: Exact Video Typography & Controls */}
                <motion.div
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
                  className="flex flex-col"
                >
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#111111]">
                    {selectedItem.displayTitle.toUpperCase()}
                  </h3>

                  <div className="flex items-center gap-3 mt-2 mb-4">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
                      {selectedItem.priceFormatted}
                    </span>
                    {selectedItem.originalPriceFormatted && (
                      <span className="text-sm text-neutral-400 line-through">
                        {selectedItem.originalPriceFormatted}
                      </span>
                    )}
                    <div className="flex items-center gap-1 ml-auto text-xs font-bold text-neutral-700 bg-neutral-100 px-2.5 py-1 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-[#fcd017] text-[#fcd017]" />
                      <span>{selectedItem.rating}</span>
                      <span className="text-neutral-400">({selectedItem.ratingCount})</span>
                    </div>
                  </div>

                  {/* 3-Line Description matching video */}
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6">
                    Bring the past into the future with VEYRO&apos;s iconic silhouettes. Engineered with 240gsm high-density combed cotton with an architectural oversized cut built for effortless rotation.
                  </p>

                  {/* Size Selector with Square Pill Buttons */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2.5">
                      <span>SELECT SIZE (US)</span>
                      <span className="text-neutral-400 font-normal capitalize">True to Size</span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {["S", "M", "L", "XL", "2XL"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`min-w-[48px] h-10 px-3.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            selectedSize === size
                              ? "bg-[#111111] text-white border-[#111111] shadow-sm"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selector with 3 Circular Swatches */}
                  <div className="mb-8">
                    <div className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2.5">
                      <span>SELECT COLOR: <span className="font-normal text-neutral-500">{selectedColor}</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      {[
                        { name: "Fire Red", hex: "#ef4444" },
                        { name: "Pure White", hex: "#ffffff" },
                        { name: "Cyan Teal", hex: "#06b6d4" },
                      ].map((c, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedColor(c.name)}
                          aria-label={`Select ${c.name} color`}
                          className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                            selectedColor === c.name
                              ? "border-black scale-110 shadow-md ring-2 ring-black/20"
                              : "border-neutral-300 hover:border-neutral-500"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* ADD TO BAG Button with Cart Icon */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`w-full py-4 px-6 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md ${
                      addedSuccess
                        ? "bg-emerald-600 text-white"
                        : "bg-[#111111] hover:bg-neutral-800 text-white"
                    }`}
                  >
                    {addedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Added to Your Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#fcd017]" />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STAGE 1: HERO FAN DECK (EXACT MATCH WITH VIDEO) ── */}
        {stage === "fan" && (
          <div className="relative w-full flex flex-col items-center">
            {/* Header: The Ultimate COLLECTIONS */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-4 sm:mb-6"
            >
              <h2 className="text-xl sm:text-3xl font-medium text-neutral-800">
                The Ultimate
              </h2>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#111111]">
                COLLECTIONS
              </h1>
            </motion.div>

            {/* ── FLOATING SPEECH BUBBLE PILLS WITH ARROWS (FROM VIDEO) ── */}
            <div className="relative w-full max-w-4xl h-[420px] sm:h-[480px] lg:h-[520px] flex items-center justify-center">
              {/* Left Cyan Pill Speech Bubble */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 sm:top-6 left-2 sm:left-12 z-40"
              >
                <div className="relative bg-[#06b6d4] text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>Get up to 50% Off</span>
                  {/* Speech triangle tail pointing towards cards */}
                  <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-[#06b6d4] rotate-45" />
                </div>
              </motion.div>

              {/* Right Orange Pill Speech Bubble */}
              <motion.div
                animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-2 sm:top-6 right-2 sm:right-12 z-40"
              >
                <div className="relative bg-[#f97316] text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <span>New Season</span>
                  {/* Speech triangle tail pointing towards cards */}
                  <div className="absolute -bottom-1.5 right-4 w-3 h-3 bg-[#f97316] rotate-45" />
                </div>
              </motion.div>

              {/* Six Cards Fanned Out in Arc */}
              {SHOWCASE_ITEMS.map((item, index) => {
                const config = FAN_CONFIGS[index] || { xOffset: 0, yOffset: 0, rotate: 0, zIndex: 10 };
                const isHovered = hoveredIndex === index;

                return (
                  <motion.div
                    key={item.product.id}
                    layoutId={`product-image-${item.product.id}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => handleSelectCard(item)}
                    className={`absolute w-[170px] sm:w-[210px] lg:w-[240px] aspect-[3/4] rounded-2xl sm:rounded-3xl border border-white/80 shadow-[0_16px_40px_rgba(0,0,0,0.14)] p-3 cursor-pointer group flex flex-col justify-between overflow-hidden transition-colors ${item.bgAccent} bg-white`}
                    style={{
                      zIndex: isHovered ? 50 : config.zIndex,
                      transformOrigin: "bottom center",
                      willChange: "transform, opacity",
                    }}
                    initial={{
                      opacity: 0,
                      scale: 0.7,
                      y: 60,
                      rotate: 0,
                      x: 0,
                    }}
                    animate={{
                      opacity: 1,
                      scale: isHovered ? 1.05 : 1,
                      y: isHovered ? -16 : config.yOffset,
                      x: typeof window !== "undefined" && window.innerWidth < 640 ? config.xOffset * 0.45 : config.xOffset,
                      rotate: shouldReduceMotion ? 0 : (isHovered ? 0 : config.rotate),
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 240,
                      damping: 24,
                      delay: index * 0.04,
                    }}
                  >
                    {/* Top White Frosted Tag (from video) */}
                    <div className="flex items-center justify-end">
                      <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-md text-[9px] font-mono font-bold uppercase rounded-full shadow-sm text-neutral-800">
                        {item.tag}
                      </span>
                    </div>

                    {/* Image Area */}
                    <div className="relative flex-1 w-full my-2">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.displayTitle}
                        fill
                        sizes="(max-width: 640px) 170px, 240px"
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Bottom Preview Cue */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-bold text-neutral-800 truncate">
                        {item.displayTitle}
                      </span>
                      <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="w-2.5 h-2.5 text-[#fcd017]" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom Statement & CTA (from video) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-6 flex flex-col items-center"
            >
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md leading-relaxed font-medium">
                We Do Not Divide Our Collections To Seasons. We Create New Models Every Week, And We In A Few Items.
              </p>
              <button
                type="button"
                onClick={() => setStage("rail")}
                className="mt-4 px-7 py-3 bg-[#111111] hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2 group"
              >
                <span>Explore More</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>
        )}

        {/* ── STAGE 2: BEST SELLERS HORIZONTAL RAIL (EXACT MATCH WITH VIDEO) ── */}
        {stage === "rail" && (
          <div className="relative w-full flex flex-col items-center">
            {/* Header: Best Selling Product Of The COLLECTION */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-6 sm:mb-8"
            >
              <h2 className="text-xl sm:text-2xl font-medium text-neutral-800">
                Best Selling Product Of The
              </h2>
              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#111111]">
                COLLECTION
              </h1>
            </motion.div>

            {/* Navigation Chevrons */}
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-400">
                SWIPE OR CLICK TO EXPAND
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScrollRail("left")}
                  aria-label="Scroll left"
                  className="w-9 h-9 rounded-full bg-white border border-neutral-300 text-neutral-700 hover:text-black hover:border-black flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleScrollRail("right")}
                  aria-label="Scroll right"
                  className="w-9 h-9 rounded-full bg-white border border-neutral-300 text-neutral-700 hover:text-black hover:border-black flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Track */}
            <div
              ref={railContainerRef}
              className="w-full flex items-center gap-5 overflow-x-auto scrollbar-none py-4 px-2 overscroll-x-contain"
            >
              {SHOWCASE_ITEMS.map((item, index) => {
                const isCenter = index === 3; // Center featured item ("Woolan Fashion")

                return (
                  <motion.div
                    key={item.product.id}
                    layoutId={`product-image-${item.product.id}`}
                    onClick={() => handleSelectCard(item)}
                    className={`flex-shrink-0 w-[230px] sm:w-[260px] rounded-2xl sm:rounded-3xl border border-[#e8e8e5] p-3.5 cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 bg-white ${
                      isCenter ? "ring-2 ring-black/10 scale-[1.02]" : ""
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 26,
                      delay: index * 0.04,
                    }}
                  >
                    {/* Card Image Container */}
                    <div className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-neutral-100 flex items-center justify-center ${item.bgAccent}`}>
                      <Image
                        src={item.product.imageUrl}
                        alt={item.displayTitle}
                        fill
                        sizes="260px"
                        className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Tag on Top-Right */}
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/90 backdrop-blur-md text-[9px] font-mono font-bold uppercase rounded-full shadow-sm text-neutral-800">
                        {item.tag}
                      </span>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-[#111111] text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#fcd017]" />
                          Quick View
                        </span>
                      </div>
                    </div>

                    {/* Meta: Title, Price, Star Rating (1:1 with video) */}
                    <div className="flex flex-col px-1">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-900">
                        <span className="truncate pr-2">{item.displayTitle}</span>
                        <span>{item.priceFormatted}</span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-500">
                        <Star className="w-3 h-3 fill-[#fcd017] text-[#fcd017]" />
                        <span className="font-semibold text-neutral-800">({item.rating})</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom CTA: See All Product */}
            <div className="mt-8 flex items-center justify-center">
              <Link
                href="/collections/all"
                className="px-8 py-3 bg-[#111111] hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2 group"
              >
                <span>See All Product</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
