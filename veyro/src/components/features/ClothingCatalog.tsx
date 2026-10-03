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
import {
  ClothingFilterSidebar,
  ClothingFilterState,
  CLOTHING_FITS,
  CLOTHING_GSM_WEIGHTS,
  CLOTHING_AVAILABLE_SIZES,
  CLOTHING_COLORS,
  CLOTHING_PRICE_RANGES,
  CLOTHING_CURATIONS,
} from "./ClothingFilterSidebar";
import {
  SlidersHorizontal,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react";

// Filter options
type SortOption = "featured" | "price-asc" | "price-desc" | "discount";

export function ClothingCatalog() {
  // ── Cart & Wishlist Context ───────────────────────────────────────────────
  const { addToCart } = useCart();
  const { isInWishlist } = useWishlist();

  // ── Filter & View States ───────────────────────────────────────────────────
  const [filters, setFilters] = useState<ClothingFilterState>({
    fits: [],
    gsmWeights: [],
    sizes: [],
    colors: [],
    priceRange: "ALL",
    curations: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [gridColumns, setGridColumns] = useState<2 | 4>(4);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFitGuideOpen, setIsFitGuideOpen] = useState(false);

  // ── Base Clothing Products (15 SKUs) ───────────────────────────────────────
  const clothingProducts = useMemo(() => {
    return products.filter((p) => p.category === "Clothing");
  }, []);

  // ── Sneaker Vault Curated Pairings (Footwear) ──────────────────────────────
  const footwearPairings = useMemo(() => {
    return products.filter((p) => p.category === "Footwear").slice(0, 3);
  }, []);

  // ── Filter Toggle Handlers ─────────────────────────────────────────────────
  const handleToggleFit = (fit: string) => {
    setFilters((prev) => ({
      ...prev,
      fits: prev.fits.includes(fit)
        ? prev.fits.filter((f) => f !== fit)
        : [...prev.fits, fit],
    }));
  };

  const handleToggleGsm = (gsm: string) => {
    setFilters((prev) => ({
      ...prev,
      gsmWeights: prev.gsmWeights.includes(gsm)
        ? prev.gsmWeights.filter((g) => g !== gsm)
        : [...prev.gsmWeights, gsm],
    }));
  };

  const handleToggleSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleToggleColor = (colorKey: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorKey)
        ? prev.colors.filter((c) => c !== colorKey)
        : [...prev.colors, colorKey],
    }));
  };

  const handleSelectPriceRange = (range: string) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: range,
    }));
  };

  const handleToggleCuration = (curation: string) => {
    setFilters((prev) => ({
      ...prev,
      curations: prev.curations.includes(curation)
        ? prev.curations.filter((c) => c !== curation)
        : [...prev.curations, curation],
    }));
  };

  const handleClearAll = () => {
    setFilters({
      fits: [],
      gsmWeights: [],
      sizes: [],
      colors: [],
      priceRange: "ALL",
      curations: [],
    });
    setSortBy("featured");
  };

  const activeFilterCount = useMemo(() => {
    return (
      filters.fits.length +
      filters.gsmWeights.length +
      filters.sizes.length +
      filters.colors.length +
      (filters.priceRange && filters.priceRange !== "ALL" ? 1 : 0) +
      filters.curations.length
    );
  }, [filters]);

  // ── Dynamic Item Counts for Sidebar Badges ─────────────────────────────────
  const itemCounts = useMemo(() => {
    const fits: Record<string, number> = {};
    CLOTHING_FITS.forEach((f) => {
      fits[f.id] = clothingProducts.filter((p) => {
        if (f.id === "Graphic") return p.subcategoryTag === "Graphic";
        if (f.id === "Oversized") return p.fit === "Oversized" || p.subcategoryTag === "Oversized";
        if (f.id === "Regular") return p.fit === "Regular" || p.subcategoryTag === "Regular";
        if (f.id === "Relaxed") return p.fit === "Relaxed" || p.subcategoryTag === "Relaxed";
        if (f.id === "Textured") return p.subcategoryTag === "Textured";
        return false;
      }).length;
    });

    const gsmWeights: Record<string, number> = {};
    CLOTHING_GSM_WEIGHTS.forEach((g) => {
      gsmWeights[g.id] = clothingProducts.filter((p) => {
        const mat = p.material.toLowerCase();
        if (g.id === "HEAVYWEIGHT") return mat.includes("240gsm") || mat.includes("260gsm");
        if (g.id === "MIDWEIGHT") return mat.includes("180gsm") || mat.includes("220gsm") || mat.includes("190gsm");
        if (g.id === "TEXTURED") return mat.includes("waffle") || mat.includes("linen");
        return false;
      }).length;
    });

    const sizes: Record<string, number> = {};
    CLOTHING_AVAILABLE_SIZES.forEach((s) => {
      sizes[s] = clothingProducts.filter((p) => p.sizes.includes(s)).length;
    });

    const colors: Record<string, number> = {};
    CLOTHING_COLORS.forEach((col) => {
      colors[col.id] = clothingProducts.filter((p) => {
        const cLower = p.colorName.toLowerCase();
        return col.matches.some((m) => cLower.includes(m));
      }).length;
    });

    const priceRanges: Record<string, number> = {
      ALL: clothingProducts.length,
      UNDER_1000: clothingProducts.filter((p) => p.price < 1000).length,
      "1000_TO_1299": clothingProducts.filter((p) => p.price >= 1000 && p.price <= 1299).length,
      ABOVE_1300: clothingProducts.filter((p) => p.price >= 1300).length,
    };

    const curations: Record<string, number> = {
      VIP_BUNDLE: clothingProducts.length,
      SALE: clothingProducts.filter((p) => p.badge === "SALE" || (p.originalPrice && p.originalPrice > p.price)).length,
      BESTSELLER: clothingProducts.filter((p) => p.badge === "BESTSELLER").length,
      NEW: clothingProducts.filter((p) => p.isNewArrival || p.badge === "NEW").length,
    };

    return { fits, gsmWeights, sizes, colors, priceRanges, curations };
  }, [clothingProducts]);

  // ── Filter & Sort Logic ───────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return clothingProducts
      .filter((product) => {
        // 1. Fit filter
        if (filters.fits.length > 0) {
          const matchesFit = filters.fits.some((fit) => {
            if (fit === "Graphic") return product.subcategoryTag === "Graphic";
            if (fit === "Oversized") return product.fit === "Oversized" || product.subcategoryTag === "Oversized";
            if (fit === "Regular") return product.fit === "Regular" || product.subcategoryTag === "Regular";
            if (fit === "Relaxed") return product.fit === "Relaxed" || product.subcategoryTag === "Relaxed";
            if (fit === "Textured") return product.subcategoryTag === "Textured";
            return false;
          });
          if (!matchesFit) return false;
        }

        // 2. GSM / Fabric Weight Filter
        if (filters.gsmWeights.length > 0) {
          const mat = product.material.toLowerCase();
          const matchesGsm = filters.gsmWeights.some((gsm) => {
            if (gsm === "HEAVYWEIGHT") return mat.includes("240gsm") || mat.includes("260gsm");
            if (gsm === "MIDWEIGHT") return mat.includes("180gsm") || mat.includes("220gsm") || mat.includes("190gsm");
            if (gsm === "TEXTURED") return mat.includes("waffle") || mat.includes("linen");
            return false;
          });
          if (!matchesGsm) return false;
        }

        // 3. Color Filter
        if (filters.colors.length > 0) {
          const colorLower = product.colorName.toLowerCase();
          const matchesColor = filters.colors.some((colKey) => {
            const swatch = CLOTHING_COLORS.find((s) => s.id === colKey);
            if (!swatch) return false;
            return swatch.matches.some((m) => colorLower.includes(m));
          });
          if (!matchesColor) return false;
        }

        // 4. Size In-Stock Filter
        if (filters.sizes.length > 0) {
          const matchesSize = filters.sizes.some((size) => product.sizes.includes(size));
          if (!matchesSize) return false;
        }

        // 5. Price Range Filter
        if (filters.priceRange && filters.priceRange !== "ALL") {
          if (filters.priceRange === "UNDER_1000" && product.price >= 1000) return false;
          if (filters.priceRange === "1000_TO_1299" && (product.price < 1000 || product.price > 1299)) return false;
          if (filters.priceRange === "ABOVE_1300" && product.price < 1300) return false;
        }

        // 6. Curations Filter
        if (filters.curations.length > 0) {
          const matchesCuration = filters.curations.some((c) => {
            if (c === "VIP_BUNDLE") return true;
            if (c === "SALE") return product.badge === "SALE" || (product.originalPrice && product.originalPrice > product.price);
            if (c === "BESTSELLER") return product.badge === "BESTSELLER";
            if (c === "NEW") return product.isNewArrival || product.badge === "NEW";
            return false;
          });
          if (!matchesCuration) return false;
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
  }, [clothingProducts, filters, sortBy]);

  return (
    <div className="w-full max-w-full overflow-x-clip bg-white text-[#111111] selection:bg-[#111111] selection:text-white">
      {/* ── 1. FULL-WIDTH GETHA ARCHIVE SALE HERO BANNER ──────────────── */}
      <section className="w-full max-w-full overflow-x-clip mb-2">
        <div className="relative w-full overflow-hidden bg-[#111111] aspect-[16/9] sm:aspect-[2.2/1] md:aspect-[2.4/1] lg:aspect-[2.5/1] min-h-[300px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[520px]">
          {/* 2K Super-Resolution Sharpened Streetwear Campaign Image */}
          <Image
            src="/images/clothing-archive-campaign.jpg"
            alt="VEYRO Archive Sale - Up to 50% Off 240+ GSM Heavyweight Silhouettes"
            fill
            priority
            quality={85}
            className="object-cover object-[80%_top] sm:object-top md:object-top"
            sizes="100vw"
          />

          {/* Smooth directional scrim strictly on the left — Model on the right is 100% unmasked, bright & crystal clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/70 to-transparent sm:bg-gradient-to-r sm:from-[#111111] sm:via-[#111111]/70 sm:via-35% sm:to-transparent pointer-events-none z-1" />

          {/* High-Fashion Editorial Typography Stage (Neatly positioned in the sweet spot on left) */}
          <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 max-w-xl sm:max-w-2xl">
            {/* Cursive Luxury Accent */}
            <span className="font-script text-2xl sm:text-3xl lg:text-4xl text-[#fcd017] tracking-normal font-normal drop-shadow-md select-none -mb-1">
              The Limited Drop
            </span>

            {/* Bold Architectural Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] uppercase text-white leading-[0.92] drop-shadow-md">
              ARCHIVE SALE
            </h1>

            {/* High-Impact 50% Offer Lockup */}
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <span className="inline-block px-3.5 py-1 bg-[#fcd017] text-[#111111] text-lg sm:text-2xl lg:text-3xl font-black tracking-tight uppercase rounded-[2px] shadow-lg">
                UP TO 50% OFF
              </span>
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.12em] text-white/95 drop-shadow-sm">
                240+ GSM HEAVYWEIGHT SILHOUETTES
              </span>
            </div>

            {/* Crisp Editorial Subline */}
            <p className="mt-3 text-xs sm:text-sm text-[#dddddd] font-normal tracking-wide drop-shadow-xs max-w-md">
              Combed cotton jersey · Zero-sag ribbed collars · Boxy drop-shoulder
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. SUB-BAR: BREADCRUMBS & MOBILE FILTER ──────────────────────── */}
      <section className="w-full max-w-full bg-white border-b border-[#f0f0ed] py-3.5 px-5 sm:px-8 lg:px-12 sticky top-0 z-20 backdrop-blur-md bg-white/95">
        <div className="mx-auto max-w-[1536px] flex flex-wrap items-center justify-between gap-3">
          {/* Left: Mobile Filter Button & Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-[#111111] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#333333] transition-colors cursor-pointer"
              aria-label="Open filter sidebar"
            >
              <SlidersHorizontal size={13} className="text-[#fcd017]" />
              <span>FILTERS</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#fcd017] text-[#111111] text-[10px] font-black rounded-[2px]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumbs" className="font-sans flex items-center gap-2.5 text-[13px] uppercase tracking-[0.04em]">
              <Link href="/" className="text-[#555555] font-medium hover:text-[#111111] transition-colors">
                HOME
              </Link>
              <span className="text-[#777777] font-semibold text-[11px]">&gt;</span>
              <span className="text-[#111111] font-bold">CLOTHING</span>
            </nav>
          </div>
        </div>
      </section>

      {/* ── 3. MAIN WORKSPACE: VERTICAL SIDEBAR + PRODUCT GRID ─────────── */}
      <main className="mx-auto w-full max-w-[1536px] px-5 sm:px-8 lg:px-12 py-8 sm:py-10 overflow-x-clip">
        <div className="flex items-start gap-8 xl:gap-10">
          {/* Vertical Sidebar Filter (Desktop sticky + Mobile slide-over) */}
          <ClothingFilterSidebar
            filters={filters}
            onToggleFit={handleToggleFit}
            onToggleGsm={handleToggleGsm}
            onToggleSize={handleToggleSize}
            onToggleColor={handleToggleColor}
            onSelectPriceRange={handleSelectPriceRange}
            onToggleCuration={handleToggleCuration}
            onClearAll={handleClearAll}
            activeFilterCount={activeFilterCount}
            totalFilteredCount={filteredProducts.length}
            itemCounts={itemCounts}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
          />

          {/* Right Product Grid Column */}
          <div className="flex-1 min-w-0">

            {filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-[#f8f8f6] rounded-[2px] border border-dashed border-[#dcdcd8]">
                <span className="text-4xl mb-3">🔍</span>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                  No Archival Pieces Found
                </h3>
                <p className="mt-2 text-sm text-[#777777] max-w-md">
                  We couldn&apos;t find any t-shirts matching your exact combination of fit, GSM, size, and color filters.
                </p>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="mt-6 px-6 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-[0.1em] rounded-[2px] hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-x-4 sm:gap-x-6 gap-y-10 ${
                  gridColumns === 4
                    ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-2"
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
                  {/* Embedded Luxury 3-Tees Bundle Pass Card at slot #4 (After full 4-col first row) */}
                  {index === 4 && (
                    <article className="col-span-2 flex flex-col justify-between p-6 sm:p-9 bg-[#0d0d10] text-white rounded-[2px] relative overflow-hidden shadow-2xl border border-white/10 group min-h-[380px] sm:min-h-[420px]">
                      {/* High-Fashion Editorial Photography Background: 3 Models Trio */}
                      <Image
                        src="/images/bundle-pass-campaign.jpg"
                        alt="VEYRO VIP 3-Tee Bundle Collection - 3 Heavyweight Silhouettes"
                        fill
                        quality={80}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                        className="object-cover object-[85%_center] transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Cinematic Scrim: deep moody wall on the left, clear view of models on the right */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/75 sm:via-[#09090b]/35 to-transparent z-1" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-transparent to-black/25 z-1" />

                      {/* Top Left Editorial Copy (Positioned in Negative Space) */}
                      <div className="relative z-10 max-w-[260px] sm:max-w-[300px]">
                        <span className="font-script text-2xl sm:text-3xl text-[#fcd017] block -mb-1 font-bold drop-shadow-xs">
                          the trio curation
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
                          Buy Any 3 T-Shirts For ₹1,199
                        </h3>
                        <p className="mt-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light drop-shadow-xs">
                          Mix &amp; match any 3 silhouettes across Heavyweight Oversized, Graphic prints, and Classic fits. Savings applied automatically at checkout.
                        </p>
                      </div>

                      {/* Bottom Pricing Row with Clear Highlight */}
                      <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-end justify-between backdrop-blur-[2px] rounded-xs px-1">
                        <div>
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">Regular MRP</span>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xs sm:text-sm font-semibold line-through text-neutral-400">₹2,397</span>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Save 50%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#fcd017] uppercase tracking-widest font-bold block font-mono">Pass Price</span>
                          <span className="text-xl sm:text-3xl font-black text-[#fcd017] tracking-tight drop-shadow-sm">₹1,199 ONLY</span>
                        </div>
                      </div>

                      {/* Subtle Ambient Glow */}
                      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#fcd017]/10 rounded-full blur-3xl pointer-events-none" />
                    </article>
                  )}

                  {/* Standard Clothing Product Card */}
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
                          quality={80}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                        />

                        {/* Secondary Angle Photo on Hover */}
                        {product.secondaryImageUrl && (
                          <Image
                            src={product.secondaryImageUrl}
                            alt={`${product.name} alternate view`}
                            fill
                            quality={80}
                            loading="lazy"
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
                        {/* GSM Fabric Badge */}
                        {product.material.includes("240gsm") && (
                          <span className="px-2 py-0.5 rounded-xs bg-[#111111]/85 backdrop-blur-xs text-[#fcd017] text-[9px] font-extrabold uppercase tracking-wider">
                            240 GSM
                          </span>
                        )}
                      </div>

                      {/* Wishlist Heart Button (Right) */}
                      <WishlistButton product={product} isWishlisted={isWishlisted} />

                    </div>

                    {/* Product Details Block */}
                    <div className="pt-3 pb-1 flex flex-col flex-1">
                      {/* Meta tag & Color Swatch */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#8e8e8e]">
                          {product.subcategoryTag || product.category} · {product.fit}
                        </span>
                        {product.colorHex && (
                          <span
                            className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: product.colorHex }}
                            title={product.colorName}
                          />
                        )}
                      </div>

                      {/* Title */}
                      <h4 className="mt-1 text-xs sm:text-sm font-semibold tracking-tight text-[#111111] group-hover:text-[#333333] line-clamp-1">
                        <Link href={`/product/${product.slug}`} className="focus:outline-none">
                          {product.name}
                        </Link>
                      </h4>

                      {/* Material Spec */}
                      <span className="text-[11px] text-[#8e8e8e] line-clamp-1 mt-0.5">
                        {product.material.split(",")[0]}
                      </span>

                      {/* Price Strip */}
                      <div className="mt-2 flex items-center gap-2">
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-xs text-[#8e8e8e] line-through font-mono">
                              {formatPrice(product.originalPrice)}
                            </span>
                          </>
                        )}
                        <span className="text-sm sm:text-[15px] font-bold text-[#111111] font-mono">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && discountPercent && (
                          <span className="text-[10px] font-bold text-[#c44d25] font-mono">
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
          </div>
        </div>
      </main>

      {/* ── 5. "ENGINEERED WITH FOOTWEAR" CURATED PAIRINGS ─────────────────── */}
      <section className="w-full max-w-full overflow-x-clip bg-[#fafaf8] border-t border-b border-[#e8e8e5] py-10 sm:py-14 px-5 sm:px-8 lg:px-12 mt-8 sm:mt-12">
        <div className="mx-auto max-w-[1536px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#fcd017] bg-[#111111] px-2.5 py-1 rounded-xs inline-block mb-2">
                COMPLETE THE LOOK
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#111111]">
                Engineered With Footwear Pairings
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#777777]">
                Archival sneakers designed to anchor the drape of heavyweight oversized t-shirts.
              </p>
            </div>
            <Link
              href="/#footwear"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#111111] hover:text-[#555555] transition-colors"
            >
              <span>Explore All 9 Footwear Silhouettes</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {footwearPairings.map((shoe) => (
              <Link
                key={shoe.id}
                href={`/product/${shoe.slug}`}
                className="group flex flex-col bg-white border border-[#e8e8e5] p-3 rounded-xs transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative w-full aspect-[4/3] bg-[#f4f2ee] rounded-xs overflow-hidden mb-3">
                  <Image
                    src={shoe.imageUrl}
                    alt={shoe.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {shoe.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-[#111111] text-[#fcd017] text-[9px] font-extrabold uppercase">
                      {shoe.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#8e8e8e] uppercase">
                    {shoe.subcategoryTag} Sneaker
                  </span>
                  <span className="text-xs font-bold text-[#111111]">
                    {formatPrice(shoe.price)}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#111111] group-hover:text-[#555555] transition-colors mt-0.5">
                  {shoe.name}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ── 6. INTERACTIVE FIT & SILHOUETTE GUIDE SLIDE-OVER MODAL ─────────── */}
      {isFitGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fit-guide-title"
            className="w-full max-w-2xl bg-white rounded-xs border border-[#e8e8e5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e5] bg-[#fafaf8]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e] block">
                  VEYRO BESPOKE SIZING ARCHIVE
                </span>
                <h3 id="fit-guide-title" className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#111111]">
                  Silhouette &amp; Fit Visualizer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFitGuideOpen(false)}
                className="p-1.5 text-[#555555] hover:text-[#111111] hover:bg-[#eeeeea] rounded-xs transition-colors cursor-pointer"
                aria-label="Close fit guide"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Fit Comparison Matrix */}
              <div className="space-y-4">
                {/* Oversized Fit */}
                <div className="p-4 rounded-xs border border-[#111111] bg-[#fafaf8]">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-[#111111]">
                      1. The Oversized Silhouette (240 GSM)
                    </h4>
                    <span className="px-2 py-0.5 rounded-xs bg-[#111111] text-[#fcd017] text-[10px] font-bold uppercase">
                      Signature Cut
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed mb-3">
                    Engineered with extended drop shoulders, extra width through the chest, and a structured vertical fall that does not cling.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-medium text-[#444444]">
                    <li className="bg-white p-2 rounded-xs border border-[#e8e8e5]">
                      <strong className="block text-[#111111]">Shoulder:</strong> +4.5cm Drop
                    </li>
                    <li className="bg-white p-2 rounded-xs border border-[#e8e8e5]">
                      <strong className="block text-[#111111]">Chest:</strong> Boxy / Relaxed
                    </li>
                    <li className="bg-white p-2 rounded-xs border border-[#e8e8e5]">
                      <strong className="block text-[#111111]">Sleeve:</strong> Reaches Elbow
                    </li>
                  </ul>
                </div>

                {/* Regular Fit */}
                <div className="p-4 rounded-xs border border-[#e8e8e5] bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-[#111111]">
                      2. The Daily Regular Cut (180 GSM)
                    </h4>
                    <span className="px-2 py-0.5 rounded-xs bg-[#f4f2ee] text-[#555555] text-[10px] font-bold uppercase">
                      Classic Fit
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed mb-3">
                    Clean, traditional proportions that sit perfectly on your natural shoulder seam. Great for tucking into trousers or layering under overshirts.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-medium text-[#444444]">
                    <li className="bg-[#fafaf8] p-2 rounded-xs border border-[#e8e8e5]">
                      <strong className="block text-[#111111]">Shoulder:</strong> Natural Seam
                    </li>
                    <li className="bg-[#fafaf8] p-2 rounded-xs border border-[#e8e8e5]">
                      <strong className="block text-[#111111]">Chest:</strong> Tailored Straight
                    </li>
                    <li className="bg-[#fafaf8] p-2 rounded-xs border border-[#e8e8e5]">
                      <strong className="block text-[#111111]">Sleeve:</strong> Mid-Bicep
                    </li>
                  </ul>
                </div>

                {/* Relaxed Fit */}
                <div className="p-4 rounded-xs border border-[#e8e8e5] bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold uppercase tracking-wide text-[#111111]">
                      3. The Relaxed Weekend Cut (220 GSM)
                    </h4>
                    <span className="px-2 py-0.5 rounded-xs bg-[#f4f2ee] text-[#555555] text-[10px] font-bold uppercase">
                      Comfort Fit
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed mb-3">
                    The midpoint between Regular and Oversized. Gives extra breathing room around the torso without extreme drop-shoulders.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-medium text-[#444444]">
                    <li className="bg-[#fafaf8] p-2 rounded-xs border border-[#e8e8e5]">
                      <strong className="block text-[#111111]">Shoulder:</strong> +1.5cm Soft Drop
                    </li>
                    <li className="bg-[#fafaf8] p-2 rounded-xs border border-[#e8e8e5]">
                      <strong className="block text-[#111111]">Chest:</strong> Eased 2cm
                    </li>
                    <li className="bg-[#fafaf8] p-2 rounded-xs border border-[#e8e8e5]">
                      <strong className="block text-[#111111]">Sleeve:</strong> Lower Bicep
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sizing Recommendation Banner */}
              <div className="p-3 bg-[#111111] text-white rounded-xs flex items-center gap-3">
                <ShieldCheck size={24} className="text-[#fcd017] shrink-0" />
                <p className="text-xs text-[#cccccc]">
                  All VEYRO t-shirts are pre-shrunk via bio-wash. Order your true size for the intended silhouette, or size down one if you prefer a standard tailored fit.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-[#e8e8e5] bg-[#fafaf8] flex justify-end">
              <button
                type="button"
                onClick={() => setIsFitGuideOpen(false)}
                className="px-5 py-2 bg-[#111111] hover:bg-[#333333] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Got It, Return to Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
