"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { SortDropdown, SortOptionItem } from "@/components/ui/SortDropdown";
import {
  Grid3X3,
  Columns2,
  X,
  Zap,
  ArrowRight,
  ShieldCheck,
  Ruler,
} from "lucide-react";

// Filter options
type SilhouetteFilter = "ALL" | "Minimal" | "Retro" | "Chunky";
type SoleFilter = "ALL" | "VULCANIZED" | "CUPSOLE" | "SUEDE" | "LEATHER";
type SortOption = "featured" | "price-asc" | "price-desc" | "discount";

const FOOTWEAR_SORT_OPTIONS: SortOptionItem<SortOption>[] = [
  { value: "featured", label: "Archival Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Savings" },
];

interface ColorOption {
  label: string;
  key: string;
  hex: string;
  matches: string[];
}

const COLOR_SWATCHES: ColorOption[] = [
  { label: "All Colors", key: "ALL", hex: "transparent", matches: [] },
  { label: "Triple White", key: "white", hex: "#FFFFFF", matches: ["white", "triple white", "bone"] },
  { label: "Core Black", key: "black", hex: "#111111", matches: ["black", "core black"] },
  { label: "Bone / Chalk", key: "bone", hex: "#E8E4D9", matches: ["bone", "chalk", "off-white"] },
  { label: "Vintage Green", key: "green", hex: "#425238", matches: ["green", "olive", "vintage green"] },
  { label: "Sand / Tan", key: "sand", hex: "#C8B598", matches: ["sand", "tan", "beige"] },
  { label: "Charcoal / Grey", key: "charcoal", hex: "#4A4A4A", matches: ["charcoal", "grey", "slate"] },
];

const SHOE_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

export function FootwearCatalog() {
  // ── Cart & Wishlist Context ───────────────────────────────────────────────
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // ── Filter & View States ───────────────────────────────────────────────────
  const [selectedSilhouette, setSelectedSilhouette] = useState<SilhouetteFilter>("ALL");
  const [selectedSole, setSelectedSole] = useState<SoleFilter>("ALL");
  const [selectedColor, setSelectedColor] = useState<string>("ALL");
  const [selectedSize, setSelectedSize] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [gridColumns, setGridColumns] = useState<2 | 4>(4);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // ── Modals & Drawers ───────────────────────────────────────────────────────
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // ── Base Footwear Products (9 SKUs) ────────────────────────────────────────
  const footwearProducts = useMemo(() => {
    return products.filter((p) => p.category === "Footwear");
  }, []);

  // ── Heavyweight Tee Pairings (Clothing Cross-Sell) ─────────────────────────
  const clothingPairings = useMemo(() => {
    return products
      .filter((p) => p.category === "Clothing" && p.material.includes("240gsm"))
      .slice(0, 3);
  }, []);

  // ── Filter & Sort Logic ───────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return footwearProducts
      .filter((product) => {
        // 1. Silhouette / Subcategory filter
        if (selectedSilhouette !== "ALL") {
          if (product.subcategoryTag.toLowerCase() !== selectedSilhouette.toLowerCase()) {
            return false;
          }
        }

        // 2. Sole / Construction filter
        if (selectedSole !== "ALL") {
          const mat = product.material.toLowerCase();
          if (selectedSole === "VULCANIZED" && !mat.includes("vulcanized")) return false;
          if (selectedSole === "CUPSOLE" && !mat.includes("cupsole")) return false;
          if (selectedSole === "SUEDE" && !mat.includes("suede")) return false;
          if (selectedSole === "LEATHER" && !mat.includes("leather")) return false;
        }

        // 3. Color Filter
        if (selectedColor !== "ALL") {
          const swatch = COLOR_SWATCHES.find((s) => s.key === selectedColor);
          if (swatch) {
            const colorLower = product.colorName.toLowerCase();
            const matches = swatch.matches.some((m) => colorLower.includes(m));
            if (!matches) return false;
          }
        }

        // 4. Size In-Stock Filter
        if (selectedSize !== "ALL") {
          if (!product.sizes.includes(selectedSize)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "discount") {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        }
        return 0; // "featured" maintains archival order
      });
  }, [footwearProducts, selectedSilhouette, selectedSole, selectedColor, selectedSize, sortBy]);

  // ── Quick Add to Bag with Size ─────────────────────────────────────────────
  const handleQuickAdd = (product: Product, size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, 1, false);
    setAddedProductId(`${product.id}-${size}`);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1000);
  };

  // ── Active Filters Reset ───────────────────────────────────────────────────
  const hasActiveFilters =
    selectedSilhouette !== "ALL" ||
    selectedSole !== "ALL" ||
    selectedColor !== "ALL" ||
    selectedSize !== "ALL" ||
    sortBy !== "featured";

  const clearAllFilters = () => {
    setSelectedSilhouette("ALL");
    setSelectedSole("ALL");
    setSelectedColor("ALL");
    setSelectedSize("ALL");
    setSortBy("featured");
  };

  return (
    <div className="w-full bg-white text-[#111111] selection:bg-[#111111] selection:text-white pb-24">
      {/* ── 1. FULL-WIDTH GETHA SNEAKER VAULT HERO BANNER ──────────────── */}
      <section className="w-full mb-2">
        <div className="relative w-full overflow-hidden bg-[#111111] aspect-[16/9] sm:aspect-[2.2/1] md:aspect-[2.4/1] lg:aspect-[2.5/1] min-h-[300px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[520px]">
          {/* 2K Super-Resolution Editorial Footwear Campaign Image */}
          <Image
            src="/images/footwear-archive-campaign.jpg"
            alt="VEYRO Sneaker Vault - Vulcanized Silhouettes & Retro Runners"
            fill
            priority
            quality={98}
            className="object-cover object-center"
            sizes="100vw"
          />

          {/* Smooth directional scrim on the left */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent sm:bg-gradient-to-r sm:from-[#111111] sm:via-[#111111]/75 sm:via-40% sm:to-transparent pointer-events-none z-1" />

          {/* High-Fashion Editorial Typography Stage */}
          <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 max-w-xl sm:max-w-2xl">
            {/* Cursive Luxury Accent */}
            <span className="font-script text-3xl sm:text-4xl lg:text-5xl text-[#fcd017] tracking-normal font-normal drop-shadow-md select-none -mb-1">
              the sneaker vault
            </span>

            {/* Bold Architectural Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] uppercase text-white leading-[0.92] drop-shadow-md">
              VULCANIZED SILHOUETTES
            </h1>

            {/* High-Impact Offer Lockup */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <span className="inline-block px-3.5 py-1 bg-[#fcd017] text-[#111111] text-lg sm:text-2xl lg:text-3xl font-black tracking-tight uppercase rounded-[2px] shadow-lg">
                ARCHIVE DROP
              </span>
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.12em] text-white/95 drop-shadow-sm">
                HANDCRAFTED VULCANIZED SOLES
              </span>
            </div>

            {/* Crisp Editorial Subline */}
            <p className="mt-3 text-xs sm:text-sm text-[#dddddd] font-normal tracking-wide drop-shadow-xs max-w-md">
              Italian vulcanized rubber · Full-grain leather &amp; suede · Memory foam orthotic insole
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. LUXURY EDITORIAL SILHOUETTE TABS & FILTER BAR ──────────────── */}
      <section id="shoes-catalog-grid" className="w-full bg-white border-b border-[#e8e8e5] pt-6 pb-4 px-5 sm:px-8 lg:px-12 scroll-mt-20">
        <div className="mx-auto max-w-[1536px] flex flex-col gap-4">
          {/* Top Row: Clean Editorial Text Tabs */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar border-b border-[#f0f0ed] pb-3">
            <div className="flex items-center gap-6 sm:gap-8 shrink-0">
              {(["ALL", "Minimal", "Retro", "Chunky"] as SilhouetteFilter[]).map((sil) => {
                const isSelected = selectedSilhouette === sil;
                const count = sil === "ALL" 
                  ? footwearProducts.length 
                  : footwearProducts.filter((p) => p.subcategoryTag.toLowerCase() === sil.toLowerCase()).length;

                return (
                  <button
                    key={sil}
                    type="button"
                    onClick={() => setSelectedSilhouette(sil)}
                    className={`relative py-1 text-xs sm:text-[13px] font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "text-[#111111]"
                        : "text-[#8e8e8e] hover:text-[#111111]"
                    }`}
                  >
                    <span>{sil === "ALL" ? "All Silhouettes" : `${sil} Soles`} ({count})</span>
                    {isSelected && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111111]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop Grid Switcher & Count */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#fcd017] transition-colors cursor-pointer"
              >
                <Ruler size={13} />
                <span>Size Chart &amp; Fit Guide</span>
              </button>

              <span className="text-xs text-[#8e8e8e] font-mono">
                {filteredProducts.length} Silhouettes
              </span>

              <div className="flex items-center border border-[#e8e8e5] rounded-xs p-0.5 bg-[#f8f8f6]">
                <button
                  type="button"
                  onClick={() => setGridColumns(4)}
                  aria-label="4-column grid view"
                  className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                    gridColumns === 4 ? "bg-[#111111] text-white" : "text-[#777777] hover:text-[#111111]"
                  }`}
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setGridColumns(2)}
                  aria-label="2-column editorial view"
                  className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
                    gridColumns === 2 ? "bg-[#111111] text-white" : "text-[#777777] hover:text-[#111111]"
                  }`}
                >
                  <Columns2 size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Filter Row: Sole Construction + Color Swatches + Size Picker + Sort */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#f0f0ed]">
            {/* Sole Construction Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8e8e8e] mr-1">
                SOLE &amp; UPPER:
              </span>
              {(["ALL", "VULCANIZED", "CUPSOLE", "SUEDE", "LEATHER"] as SoleFilter[]).map((sole) => (
                <button
                  key={sole}
                  type="button"
                  onClick={() => setSelectedSole(sole)}
                  className={`px-2.5 py-1 text-[11px] font-medium tracking-wider uppercase rounded-xs transition-colors cursor-pointer ${
                    selectedSole === sole
                      ? "bg-[#fcd017] text-[#111111] font-bold"
                      : "bg-[#f8f8f6] text-[#666666] hover:bg-[#eeeeea]"
                  }`}
                >
                  {sole === "ALL" 
                    ? "All Soles" 
                    : sole === "VULCANIZED" 
                    ? "Vulcanized" 
                    : sole === "CUPSOLE" 
                    ? "Cupsole" 
                    : sole === "SUEDE" 
                    ? "Suede/Mesh" 
                    : "Full Leather"}
                </button>
              ))}
            </div>

            {/* Color Swatch Dots */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8e8e8e] mr-1">
                COLORWAY:
              </span>
              <div className="flex items-center gap-1.5">
                {COLOR_SWATCHES.map((swatch) => {
                  const isSelected = selectedColor === swatch.key;
                  return (
                    <button
                      key={swatch.key}
                      type="button"
                      title={swatch.label}
                      onClick={() => setSelectedColor(swatch.key)}
                      className={`relative flex items-center justify-center h-6 w-6 rounded-full transition-transform cursor-pointer ${
                        isSelected ? "ring-2 ring-[#111111] ring-offset-2 scale-110" : "hover:scale-105"
                      } ${swatch.key === 'ALL' ? 'border border-[#cccccc] text-[9px] font-bold uppercase bg-white' : 'border border-black/10'}`}
                      style={{ backgroundColor: swatch.key === "ALL" ? undefined : swatch.hex }}
                    >
                      {swatch.key === "ALL" && "ALL"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size In-Stock Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8e8e8e] mr-1">
                UK SIZE:
              </span>
              <button
                type="button"
                onClick={() => setSelectedSize("ALL")}
                className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer ${
                  selectedSize === "ALL" ? "bg-[#111111] text-white" : "bg-[#f4f2ee] text-[#555555]"
                }`}
              >
                ALL
              </button>
              {SHOE_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`h-6 px-1.5 flex items-center justify-center text-[10px] font-bold uppercase rounded-xs transition-colors cursor-pointer ${
                    selectedSize === size
                      ? "bg-[#111111] text-white"
                      : "bg-[#f4f2ee] text-[#555555] hover:bg-[#e8e8e5]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <SortDropdown<SortOption>
              value={sortBy}
              onChange={setSortBy}
              options={FOOTWEAR_SORT_OPTIONS}
              className="ml-auto"
            />
          </div>

          {/* Active Filter Chips & Reset All */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] text-[#8e8e8e] uppercase font-semibold">Active:</span>
              {selectedSilhouette !== "ALL" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#111111] text-white text-[11px] font-semibold">
                  Silhouette: {selectedSilhouette}
                  <button type="button" onClick={() => setSelectedSilhouette("ALL")} className="cursor-pointer hover:text-[#fcd017]">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedSole !== "ALL" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#111111] text-white text-[11px] font-semibold">
                  Sole: {selectedSole}
                  <button type="button" onClick={() => setSelectedSole("ALL")} className="cursor-pointer hover:text-[#fcd017]">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedColor !== "ALL" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#111111] text-white text-[11px] font-semibold">
                  Colorway: {selectedColor}
                  <button type="button" onClick={() => setSelectedColor("ALL")} className="cursor-pointer hover:text-[#fcd017]">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedSize !== "ALL" && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs bg-[#111111] text-white text-[11px] font-semibold">
                  Size: {selectedSize}
                  <button type="button" onClick={() => setSelectedSize("ALL")} className="cursor-pointer hover:text-[#fcd017]">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-[#c44d25] hover:underline uppercase tracking-wider ml-2 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. PRODUCT GRID WITH EMBEDDED SPECIAL CAMPAIGN CARD ───────────── */}
      <main className="mx-auto max-w-[1536px] px-5 sm:px-8 lg:px-12 py-10">
        {filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-[#f8f8f6] rounded-xs border border-dashed border-[#dcdcd8]">
            <span className="text-4xl mb-3">👟</span>
            <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
              No Archival Sneakers Found
            </h3>
            <p className="mt-2 text-sm text-[#777777] max-w-md">
              We couldn&apos;t find any footwear matching your exact combination of silhouette, sole, and colorway filters.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-6 px-6 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-[0.1em] rounded-xs hover:bg-[#333333] transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-x-5 gap-y-10 ${
              gridColumns === 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {filteredProducts.map((product, index) => {
              const isWishlisted = isInWishlist(product.id);
              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? calculateDiscountPercentage(product.price, product.originalPrice)
                  : null;

              return (
                <React.Fragment key={product.id}>
                  {/* Embedded Luxury Sneaker Rotation Card at slot #2 */}
                  {index === 2 && (
                    <article className="col-span-2 flex flex-col justify-between p-6 sm:p-9 bg-[#0d0d10] text-white rounded-[2px] relative overflow-hidden shadow-2xl border border-white/10 group min-h-[380px] sm:min-h-[420px]">
                      {/* High-Fashion Editorial Sneaker Duo Campaign */}
                      <Image
                        src="/images/sneaker-rotation-campaign.jpg"
                        alt="VEYRO Sneaker Rotation - Handcrafted Vulcanized Soles"
                        fill
                        quality={92}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                        className="object-cover object-[85%_center] transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Cinematic Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/75 sm:via-[#09090b]/35 to-transparent z-1" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-transparent to-black/25 z-1" />

                      {/* Top Left Copy */}
                      <div className="relative z-10 max-w-[260px] sm:max-w-[300px]">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[#fcd017] text-[#111111] text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm">
                          <Zap size={12} className="fill-[#111111]" />
                          VAULT PRIVILEGE
                        </div>
                        <span className="font-script text-2xl sm:text-3xl text-[#fcd017] block -mb-1 font-bold drop-shadow-xs">
                          double sole rotation
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
                          Buy Any 2 Pairs &amp; Save ₹1,000
                        </h3>
                        <p className="mt-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light drop-shadow-xs">
                          Pair minimal court lows with retro runners or chunky platforms. Complete your footwear rotation with Italian vulcanized soles.
                        </p>
                      </div>

                      {/* Bottom Pricing Row */}
                      <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-end justify-between backdrop-blur-[2px] rounded-xs px-1">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">Combined MRP</span>
                          <span className="text-xs sm:text-sm font-semibold line-through text-neutral-400">₹5,398 – ₹6,998</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#fcd017] uppercase tracking-widest font-bold block font-mono">Vault Promo</span>
                          <span className="text-xl sm:text-3xl font-black text-[#fcd017] tracking-tight drop-shadow-sm">₹1,000 INSTANT OFF</span>
                        </div>
                      </div>

                      {/* Subtle Ambient Glow */}
                      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#fcd017]/10 rounded-full blur-3xl pointer-events-none" />
                    </article>
                  )}

                  {/* Standard Footwear Card */}
                  <article className="group flex flex-col relative card-hover-lift rounded-lg">
                    {/* Image Stage Container */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg bg-[#f4f2ee] transition-all duration-300 group-hover:shadow-xl">
                      <Link
                        href={`/product/${product.slug}`}
                        className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
                        aria-label={product.name}
                      >
                        {/* Primary Image */}
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          quality={90}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                        />

                        {/* Secondary Angle / Macro Photo on Hover */}
                        {product.secondaryImageUrl && (
                          <Image
                            src={product.secondaryImageUrl}
                            alt={`${product.name} macro view`}
                            fill
                            quality={90}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover object-center opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                          />
                        )}
                      </Link>

                      {/* Top Badges (Left) */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
                        {product.badge && (
                          <Badge
                            variant={
                              product.badge === "SALE"
                                ? "sale"
                                : product.badge === "NEW"
                                ? "dark"
                                : "default"
                            }
                          >
                            {product.badge}
                          </Badge>
                        )}
                        <span className="px-2 py-0.5 rounded-xs bg-[#111111]/85 backdrop-blur-xs text-[#fcd017] text-[9px] font-extrabold uppercase tracking-wider">
                          {product.subcategoryTag}
                        </span>
                      </div>

                      {/* Wishlist Heart Button (Right) */}
                      <WishlistButton product={product} isWishlisted={isWishlisted} />

                    </div>

                    {/* Metadata Stage */}
                    <div className="pt-3.5 flex flex-col flex-grow">
                      {/* Subcategory & Colorway */}
                      <div className="flex items-center justify-between text-[11px] font-medium text-[#8e8e8e] uppercase tracking-wider mb-1">
                        <span>{product.subcategoryTag} Sneaker</span>
                        <span>{product.colorName}</span>
                      </div>

                      {/* Product Name */}
                      <h3 className="text-sm font-bold tracking-tight text-[#111111] group-hover:text-[#555555] transition-colors leading-snug">
                        <Link href={`/product/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h3>

                      {/* Material Spec */}
                      <p className="text-[11px] text-[#777777] truncate mt-0.5">
                        {product.material}
                      </p>

                      {/* Pricing Block */}
                      <div className="mt-2.5 pt-2 border-t border-[#f0f0ed] flex items-baseline gap-2">
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-[#8e8e8e] line-through font-mono">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                        <span className="text-sm sm:text-base font-black text-[#111111] font-mono">
                          {formatPrice(product.price)}
                        </span>
                        {discountPercent && (
                          <span className="text-[10.5px] font-extrabold text-[#c44d25] font-mono ml-auto">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </main>

      {/* ── 4. CROSS-CATEGORY CURATED PAIRINGS (HEAVYWEIGHT TEES) ───────────── */}
      <section className="w-full bg-[#f8f8f6] border-t border-b border-[#e8e8e5] py-14 px-5 sm:px-8 lg:px-12 mt-12">
        <div className="mx-auto max-w-[1536px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8e8e8e] block mb-1">
                CURATED ROTATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
                Pair With Heavyweight T-Shirts
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">
                240+ GSM combed cotton oversized silhouettes designed to drop cleanly over vulcanized soles.
              </p>
            </div>
            <Link
              href="/clothing"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline"
            >
              <span>Explore Clothing Catalog (15)</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {clothingPairings.map((tee) => (
              <Link
                key={tee.id}
                href={`/product/${tee.slug}`}
                className="group flex flex-col bg-white p-4 rounded-xs border border-[#e8e8e5] hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f4f2ee] rounded-xs mb-3">
                  <Image
                    src={tee.imageUrl}
                    alt={tee.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {tee.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-[#111111] text-[#fcd017] text-[9px] font-extrabold uppercase">
                      {tee.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#8e8e8e] uppercase">
                    {tee.subcategoryTag} Tee
                  </span>
                  <span className="text-xs font-bold text-[#111111]">
                    {formatPrice(tee.price)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#111111] group-hover:text-[#555555] transition-colors mt-0.5">
                  {tee.name}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. INTERACTIVE SHOE SIZING & FIT GUIDE MODAL ────────────────────── */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shoe-guide-title"
            className="w-full max-w-2xl bg-white rounded-xs border border-[#e8e8e5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e5] bg-[#fafaf8]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e] block">
                  VEYRO SNEAKER ARCHIVE
                </span>
                <h3 id="shoe-guide-title" className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#111111]">
                  Footwear Size Conversion &amp; Fit Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1.5 text-[#555555] hover:text-[#111111] hover:bg-[#eeeeea] rounded-xs transition-colors cursor-pointer"
                aria-label="Close fit guide"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Sizing Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Official Size Conversion Chart (Standard Indian/UK Scale)
                </h4>
                <div className="overflow-x-auto border border-neutral-200 rounded-xs">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-100 text-neutral-700 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="px-3 py-2">UK (India)</th>
                        <th className="px-3 py-2">US Men</th>
                        <th className="px-3 py-2">EU</th>
                        <th className="px-3 py-2">Foot Length (CM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-mono">
                      <tr>
                        <td className="px-3 py-2 font-bold text-black">UK 6</td>
                        <td className="px-3 py-2 text-neutral-600">US 7</td>
                        <td className="px-3 py-2 text-neutral-600">EU 40</td>
                        <td className="px-3 py-2 text-neutral-600">25.0 cm</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-black">UK 7</td>
                        <td className="px-3 py-2 text-neutral-600">US 8</td>
                        <td className="px-3 py-2 text-neutral-600">EU 41</td>
                        <td className="px-3 py-2 text-neutral-600">26.0 cm</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-black">UK 8</td>
                        <td className="px-3 py-2 text-neutral-600">US 9</td>
                        <td className="px-3 py-2 text-neutral-600">EU 42</td>
                        <td className="px-3 py-2 text-neutral-600">27.0 cm</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-black">UK 9</td>
                        <td className="px-3 py-2 text-neutral-600">US 10</td>
                        <td className="px-3 py-2 text-neutral-600">EU 43</td>
                        <td className="px-3 py-2 text-neutral-600">28.0 cm</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-black">UK 10</td>
                        <td className="px-3 py-2 text-neutral-600">US 11</td>
                        <td className="px-3 py-2 text-neutral-600">EU 44</td>
                        <td className="px-3 py-2 text-neutral-600">29.0 cm</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-black">UK 11</td>
                        <td className="px-3 py-2 text-neutral-600">US 12</td>
                        <td className="px-3 py-2 text-neutral-600">EU 45</td>
                        <td className="px-3 py-2 text-neutral-600">30.0 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Silhouette Profiles */}
              <div className="space-y-3">
                <div className="p-3.5 bg-neutral-50 rounded-xs border border-neutral-200">
                  <div className="text-xs font-bold uppercase text-black">1. Minimal Court Lows</div>
                  <p className="text-xs text-neutral-600 mt-1">
                    True to size. Features a tapered toe profile with medium volume. If you have wide feet, we recommend ordering one size up.
                  </p>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-xs border border-neutral-200">
                  <div className="text-xs font-bold uppercase text-black">2. Retro Runners &amp; Suede</div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Snug ergonomic hold. Features an EVA midsole wedge that hugs the heel. Fits true to size with socks.
                  </p>
                </div>
                <div className="p-3.5 bg-neutral-50 rounded-xs border border-neutral-200">
                  <div className="text-xs font-bold uppercase text-black">3. Chunky Soles &amp; Platforms</div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Generous interior volume with deep heel cup. Order your standard UK sneaker size.
                  </p>
                </div>
              </div>

              {/* Quality Guarantee Note */}
              <div className="p-3 bg-[#111111] text-white rounded-xs flex items-center gap-3">
                <ShieldCheck size={24} className="text-[#fcd017] shrink-0" />
                <p className="text-xs text-[#cccccc]">
                  All VEYRO footwear comes with doorstep size exchange. If the size doesn&apos;t fit 100%, we swap it for free within 7 days.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#e8e8e5] bg-[#fafaf8] flex justify-end">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="px-5 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Got It, Return to Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
