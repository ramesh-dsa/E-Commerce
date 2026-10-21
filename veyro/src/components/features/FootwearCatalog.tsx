"use client";

import React, { useState, useMemo, useTransition, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { useProducts } from "@/context/ProductsContext";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { ProductCardSkeleton } from "@/components/features/ProductCardSkeleton";
import { SortDropdown, SortOptionItem } from "@/components/ui/SortDropdown";
import { ActiveFilterChips, FilterChipItem } from "./ActiveFilterChips";
import {
  X,
  Zap,
  ArrowRight,
  ShieldCheck,
  Ruler,
  SlidersHorizontal,
  Grid2X2,
  LayoutGrid,
} from "lucide-react";
import {
  FootwearFilterSidebar,
  FootwearFilterState,
  FOOTWEAR_PRICE_MIN,
  FOOTWEAR_PRICE_MAX,
  FOOTWEAR_SILHOUETTES,
  FOOTWEAR_SOLES,
  FOOTWEAR_SIZES,
  FOOTWEAR_COLORS,
} from "@/components/features/FootwearFilterSidebar";

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "discount";

const FOOTWEAR_SORT_OPTIONS: SortOptionItem<SortOption>[] = [
  { value: "featured", label: "Archival Featured" },
  { value: "newest", label: "New Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Savings" },
];



export function FootwearCatalog() {
  const { products, isHydrated } = useProducts();
  // ── Cart & Wishlist Context ───────────────────────────────────────────────
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // ── Filter & View States ───────────────────────────────────────────────────
  const [filters, setFilters] = useState<FootwearFilterState>({
    silhouettes: [],
    soles: [],
    sizes: [],
    colors: [],
    priceMin: FOOTWEAR_PRICE_MIN,
    priceMax: FOOTWEAR_PRICE_MAX,
  });
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [gridColumns, setGridColumns] = useState<2 | 4>(4);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // ── Modals & Drawers ───────────────────────────────────────────────────────
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // ── Base Footwear Products ────────────────────────────────────────
  const footwearProducts = useMemo(() => {
    return products.filter((p) => p.category === "Footwear");
  }, [products]);

  // ── Heavyweight Tee Pairings (Clothing Cross-Sell) ─────────────────────────
  const clothingPairings = useMemo(() => {
    return products
      .filter((p) => p.category === "Clothing" && p.material.includes("240gsm"))
      .slice(0, 3);
  }, [products]);

  // ── Dynamic Item Counts for All Filter Criteria ────────────────────────────
  const itemCounts = useMemo(() => {
    const silhouettes: Record<string, number> = {};
    FOOTWEAR_SILHOUETTES.forEach((sil) => {
      const count = footwearProducts.filter((p) => {
        const sub = p.subcategoryTag.toLowerCase();
        const name = p.name.toLowerCase();
        const tags = (p.tags || []).map((t) => t.toLowerCase());
        if (sil.id === "Minimal") return sub === "minimal";
        if (sil.id === "Retro") return sub === "retro";
        if (sil.id === "Chunky") return sub === "chunky";
        if (sil.id === "HighTop") return name.includes("high") || tags.includes("high") || tags.includes("statement");
        return false;
      }).length;
      silhouettes[sil.id] = count > 0 ? count : sil.defaultCount;
    });

    const soles: Record<string, number> = {};
    FOOTWEAR_SOLES.forEach((sole) => {
      const count = footwearProducts.filter((p) => {
        const mat = p.material.toLowerCase();
        if (sole.id === "VULCANIZED") return mat.includes("vulcanized");
        if (sole.id === "CUPSOLE") return mat.includes("cupsole");
        if (sole.id === "SUEDE") return mat.includes("suede") || mat.includes("nubuck");
        if (sole.id === "LEATHER") return mat.includes("leather");
        if (sole.id === "EVA") return mat.includes("eva");
        return false;
      }).length;
      soles[sole.id] = count > 0 ? count : sole.defaultCount;
    });

    const sizes: Record<string, number> = {};
    FOOTWEAR_SIZES.forEach((item) => {
      const count = footwearProducts.filter((p) => p.sizes.includes(item.size)).length;
      sizes[item.size] = count > 0 ? count : item.count;
    });

    const colors: Record<string, number> = {};
    FOOTWEAR_COLORS.forEach((col) => {
      colors[col.id] = footwearProducts.filter((p) => {
        const cLower = p.colorName.toLowerCase();
        return col.matches.some((m) => cLower.includes(m));
      }).length;
    });

    return { silhouettes, soles, sizes, colors };
  }, [footwearProducts]);

  // ── Filter & Sort Logic ───────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return footwearProducts
      .filter((product) => {
        // 1. Silhouette / Subcategory filter
        if (filters.silhouettes.length > 0) {
          const sub = product.subcategoryTag.toLowerCase();
          const name = product.name.toLowerCase();
          const tags = (product.tags || []).map((t) => t.toLowerCase());
          const matchesSil = filters.silhouettes.some((silId) => {
            if (silId === "Minimal") return sub === "minimal";
            if (silId === "Retro") return sub === "retro";
            if (silId === "Chunky") return sub === "chunky";
            if (silId === "HighTop") return name.includes("high") || tags.includes("high") || tags.includes("statement");
            return false;
          });
          if (!matchesSil) return false;
        }

        // 2. Sole / Construction filter
        if (filters.soles.length > 0) {
          const mat = product.material.toLowerCase();
          const matchesSole = filters.soles.some((sole) => {
            if (sole === "VULCANIZED") return mat.includes("vulcanized");
            if (sole === "CUPSOLE") return mat.includes("cupsole");
            if (sole === "SUEDE") return mat.includes("suede") || mat.includes("nubuck");
            if (sole === "LEATHER") return mat.includes("leather");
            if (sole === "EVA") return mat.includes("eva");
            return false;
          });
          if (!matchesSole) return false;
        }

        // 3. Color Filter
        if (filters.colors.length > 0) {
          const colorLower = product.colorName.toLowerCase();
          const matchesColor = filters.colors.some((colKey) => {
            const swatch = FOOTWEAR_COLORS.find((s) => s.id === colKey);
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

        // 5. Price Range Filter (Dual Slider)
        if (filters.priceMin > FOOTWEAR_PRICE_MIN || filters.priceMax < FOOTWEAR_PRICE_MAX) {
          if (product.price < filters.priceMin || product.price > filters.priceMax) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          const isNewA = a.isNewArrival || a.badge === "NEW" || a.badge === "NEW ARRIVAL" ? 1 : 0;
          const isNewB = b.isNewArrival || b.badge === "NEW" || b.badge === "NEW ARRIVAL" ? 1 : 0;
          if (isNewB !== isNewA) return isNewB - isNewA;
          return 0;
        }
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "discount") {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        }
        return 0; // "featured" maintains archival order
      });
  }, [footwearProducts, filters, sortBy]);

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

  // ── Catalog Scroll Anchoring (Prevents Screen Jumps on Filter Changes) ──
  const lenis = useLenis();
  const catalogAnchorRef = useRef<HTMLElement>(null);

  const anchorToCatalogTop = useCallback(() => {
    if (typeof window === "undefined" || !catalogAnchorRef.current) return;
    const rect = catalogAnchorRef.current.getBoundingClientRect();
    // If the catalog header has scrolled more than 50px above viewport:
    if (rect.top < -50) {
      const targetY = Math.max(0, window.scrollY + rect.top);
      if (lenis) {
        lenis.scrollTo(targetY, {
          duration: 0.45,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  }, [lenis]);

  // ── Filter Handlers ────────────────────────────────────────────────────────
  const handleToggleSilhouette = (sil: string) => {
    setFilters((prev) => ({
      ...prev,
      silhouettes: prev.silhouettes.includes(sil)
        ? prev.silhouettes.filter((s) => s !== sil)
        : [...prev.silhouettes, sil],
    }));
    anchorToCatalogTop();
  };

  const handleToggleSole = (sole: string) => {
    setFilters((prev) => ({
      ...prev,
      soles: prev.soles.includes(sole)
        ? prev.soles.filter((s) => s !== sole)
        : [...prev.soles, sole],
    }));
    anchorToCatalogTop();
  };

  const handleToggleSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
    anchorToCatalogTop();
  };

  const handleToggleColor = (colorKey: string) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorKey)
        ? prev.colors.filter((c) => c !== colorKey)
        : [...prev.colors, colorKey],
    }));
    anchorToCatalogTop();
  };

  const [, startTransition] = useTransition();

  const handleChangePriceRange = useCallback(
    (min: number, max: number, isFinal?: boolean) => {
      startTransition(() => {
        setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
      });
      // Only anchor when user finishes slider drag or clicks a preset chip
      if (isFinal) {
        anchorToCatalogTop();
      }
    },
    [anchorToCatalogTop]
  );

  const handleClearAll = () => {
    setFilters({
      silhouettes: [],
      soles: [],
      sizes: [],
      colors: [],
      priceMin: FOOTWEAR_PRICE_MIN,
      priceMax: FOOTWEAR_PRICE_MAX,
    });
    setSortBy("featured");
    anchorToCatalogTop();
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.silhouettes.length;
    count += filters.soles.length;
    count += filters.sizes.length;
    count += filters.colors.length;
    if (filters.priceMin > FOOTWEAR_PRICE_MIN || filters.priceMax < FOOTWEAR_PRICE_MAX) count += 1;
    return count;
  }, [filters]);

  // ── Active Filter Chips Construction ─────────────────────────────────────
  const activeFilterChips = useMemo<FilterChipItem[]>(() => {
    const chips: FilterChipItem[] = [];

    // Silhouettes
    filters.silhouettes.forEach((sil) => {
      const item = FOOTWEAR_SILHOUETTES.find((s) => s.id === sil);
      chips.push({
        id: `sil-${sil}`,
        label: item ? item.label : sil,
        onRemove: () => handleToggleSilhouette(sil),
      });
    });

    // Soles
    filters.soles.forEach((sole) => {
      const item = FOOTWEAR_SOLES.find((s) => s.id === sole);
      chips.push({
        id: `sole-${sole}`,
        label: item ? item.label : sole,
        onRemove: () => handleToggleSole(sole),
      });
    });

    // Sizes
    filters.sizes.forEach((size) => {
      chips.push({
        id: `size-${size}`,
        label: `Size: ${size}`,
        onRemove: () => handleToggleSize(size),
      });
    });

    // Colors
    filters.colors.forEach((colKey) => {
      const swatch = FOOTWEAR_COLORS.find((s) => s.id === colKey);
      chips.push({
        id: `color-${colKey}`,
        label: swatch ? swatch.name : colKey,
        onRemove: () => handleToggleColor(colKey),
      });
    });

    // Price Dual Slider
    if (filters.priceMin > FOOTWEAR_PRICE_MIN || filters.priceMax < FOOTWEAR_PRICE_MAX) {
      chips.push({
        id: "price-range",
        label: `₹${filters.priceMin.toLocaleString()} - ₹${filters.priceMax.toLocaleString()}`,
        onRemove: () => handleChangePriceRange(FOOTWEAR_PRICE_MIN, FOOTWEAR_PRICE_MAX, true),
      });
    }

    return chips;
  }, [filters, handleChangePriceRange]);

  return (
    <div className="w-full bg-white text-[#111111] selection:bg-[#111111] selection:text-white">
      {/* ── 1. FULL-WIDTH GETHA SNEAKER VAULT HERO BANNER ──────────────── */}
      <section className="w-full mb-2">
        <div className="relative w-full overflow-hidden bg-[#111111] aspect-[18/9] sm:aspect-[2.3/1] md:aspect-[2.6/1] lg:aspect-[2.7/1] min-h-[280px] sm:min-h-[340px] md:min-h-[400px] lg:min-h-[460px]">
          {/* 2K Super-Resolution Editorial Footwear Campaign Image */}
          <Image
            src="/images/footwear-archive-campaign.jpg"
            alt="VEYRO Sneaker Vault - Vulcanized Silhouettes & Retro Runners"
            fill
            priority
            quality={85}
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

      {/* ── 2. SUB-BAR: BREADCRUMBS, CONTROLS & SCROLL ANCHOR ───────────── */}
      <section
        ref={catalogAnchorRef}
        className="w-full bg-white border-b border-[#f0f0ed] py-3.5 px-5 sm:px-8 lg:px-12 sticky top-0 z-20 backdrop-blur-md bg-white/95 scroll-mt-20 [overflow-anchor:none]"
      >
        <div className="mx-auto max-w-[1536px] flex flex-wrap items-center justify-between gap-3">
          {/* Left: Mobile Filter Button, Breadcrumbs & Item Count */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
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
              <span className="text-[#111111] font-bold">SHOES</span>
            </nav>

            <span className="hidden sm:inline-block text-[#555555] text-xs font-semibold pl-3 border-l border-[#dcdcd8]">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Pair" : "Pairs"} Available
            </span>
          </div>

          {/* Center: Active Filter Pills & Clear All in Sticky Sub-bar */}
          <div className="hidden lg:flex items-center justify-center flex-1 min-w-0 px-3 overflow-x-auto no-scrollbar">
            <ActiveFilterChips
              chips={activeFilterChips}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Right: Sort By & Grid Density (Archival Featured, New Arrivals, etc.) */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto lg:ml-0 shrink-0">
            {/* Veyro Standard SortDropdown */}
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={FOOTWEAR_SORT_OPTIONS}
              className="text-xs"
            />

            {/* 4-col / 2-col Grid Toggle */}
            <div className="hidden md:flex items-center h-9 p-1 bg-neutral-100/80 border border-neutral-200/60 rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => setGridColumns(4)}
                className={`h-7 w-7 inline-flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  gridColumns === 4 ? "bg-white text-black shadow-xs" : "text-neutral-400 hover:text-black"
                }`}
                aria-label="4-column grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setGridColumns(2)}
                className={`h-7 w-7 inline-flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  gridColumns === 2 ? "bg-white text-black shadow-xs" : "text-neutral-400 hover:text-black"
                }`}
                aria-label="2-column editorial view"
              >
                <Grid2X2 size={14} />
              </button>
            </div>
          </div>

          {/* Mobile Active Filter Chips Row */}
          {activeFilterChips.length > 0 && (
            <div className="lg:hidden w-full pt-2.5 border-t border-neutral-100 flex items-center justify-start overflow-x-auto no-scrollbar">
              <ActiveFilterChips
                chips={activeFilterChips}
                onClearAll={handleClearAll}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── 3. MAIN WORKSPACE: VERTICAL SIDEBAR + PRODUCT GRID ─────────── */}
      <main className="mx-auto max-w-[1536px] pl-3 sm:pl-5 lg:pl-7 pr-5 sm:pr-8 lg:pr-12 py-8 sm:py-10 min-h-0 lg:min-h-[1400px] [overflow-anchor:none]">
        <div className="flex items-start gap-6 xl:gap-8 min-h-0 lg:min-h-[1350px]">
          {/* Vertical Sidebar Filter (Desktop sticky + Mobile slide-over) */}
          <FootwearFilterSidebar
            filters={filters}
            onToggleSilhouette={handleToggleSilhouette}
            onToggleSole={handleToggleSole}
            onToggleSize={handleToggleSize}
            onToggleColor={handleToggleColor}
            onChangePriceRange={handleChangePriceRange}
            onClearAll={handleClearAll}
            onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            activeFilterCount={activeFilterCount}
            totalFilteredCount={filteredProducts.length}
            itemCounts={itemCounts}
            isMobileOpen={isMobileFilterOpen}
            onCloseMobile={() => setIsMobileFilterOpen(false)}
            productPrices={footwearProducts.map((p) => p.price)}
          />

          {/* Right Product Grid Column */}
          <div className="flex-1 min-w-0 min-h-0 lg:min-h-[1350px] [overflow-anchor:none]">

            {!isHydrated ? (
              <div
                className={`grid gap-x-4 sm:gap-x-6 gap-y-10 ${
                  gridColumns === 4
                    ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-2"
                }`}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty State */
              <div className="w-full min-h-[580px] py-24 flex flex-col items-center justify-center text-center bg-[#f8f8f6] rounded-[2px] border border-dashed border-[#dcdcd8]">
                <div className="relative w-72 h-72 -mt-8 -mb-12 overflow-hidden mix-blend-multiply transform transition-transform hover:scale-105 hover:-rotate-2 duration-500 ease-in-out">
                  <Image 
                    src="/images/footwear/empty-state-icon.jpg" 
                    alt="Retro Runner Sneaker" 
                    fill 
                    unoptimized
                    className="object-contain" 
                  />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                  No Archival Sneakers Found
                </h3>
                <p className="mt-2 text-sm text-[#777777] max-w-md">
                  We couldn&apos;t find any footwear matching your exact combination of silhouette, sole, size, and colorway filters.
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
                  {/* Embedded Luxury Sneaker Rotation Card at slot #2 */}
                  {index === 2 && (
                    <article className="col-span-2 flex flex-col justify-between p-6 sm:p-9 bg-[#0d0d10] text-white rounded-[2px] relative overflow-hidden shadow-2xl border border-white/10 group min-h-[380px] sm:min-h-[420px]">
                      {/* High-Fashion Editorial Sneaker Duo Campaign */}
                      <Image
                        src="/images/sneaker-rotation-campaign.jpg"
                        alt="VEYRO Sneaker Rotation - Handcrafted Vulcanized Soles"
                        fill
                        quality={80}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                        className="object-cover object-[85%_center] transition-transform duration-700 ease-out group-hover:scale-105"
                      />

                      {/* Cinematic Scrim */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/75 sm:via-[#09090b]/35 to-transparent z-1" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-transparent to-black/25 z-1" />

                      {/* Top Left Copy */}
                      <div className="relative z-10 max-w-[260px] sm:max-w-[300px]">
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
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">Regular MRP</span>
                          <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xs sm:text-sm font-semibold line-through text-neutral-400">₹5,398</span>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Save ₹1,000</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[#fcd017] uppercase tracking-widest font-bold block font-mono">Vault Pair Price</span>
                          <span className="text-xl sm:text-3xl font-black text-[#fcd017] tracking-tight drop-shadow-sm">FROM ₹4,398</span>
                        </div>
                      </div>

                      {/* Subtle Ambient Glow */}
                      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#fcd017]/10 rounded-full blur-3xl pointer-events-none" />
                    </article>
                  )}

                  {/* Standard Footwear Card */}
                  <article className="group flex flex-col relative transition-transform duration-300 ease-out hover:-translate-y-1.5 rounded-2xl">
                    {/* Image Stage Container */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-[#f4f2ee] transition-all duration-300">
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

                        {/* Secondary Angle / Macro Photo on Hover */}
                        {product.secondaryImageUrl && (
                          <Image
                            src={product.secondaryImageUrl}
                            alt={`${product.name} macro view`}
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
          </div>
        </div>
      </main>

      {/* ── 4. CROSS-CATEGORY CURATED PAIRINGS (HEAVYWEIGHT TEES) ───────────── */}
      <section className="w-full bg-[#f8f8f6] border-t border-b border-[#e8e8e5] py-10 sm:py-14 px-5 sm:px-8 lg:px-12 mt-8 sm:mt-12 [overflow-anchor:none]">
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
              className="group mt-4 sm:mt-0 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] rounded-xs"
            >
              <span className="relative pb-0.5 after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-[#111111] after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100 motion-reduce:after:transition-none">
                Explore Clothing Catalog (15)
              </span>
              <ArrowRight
                size={14}
                className="stroke-[2.5] transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transform-none"
              />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="shoe-guide-title"
            className="w-full max-w-2xl bg-white rounded-3xl border border-neutral-200/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-neutral-100 bg-neutral-50/70">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 block font-mono">
                  Footwear Sizing &amp; Conversion Spec
                </span>
                <h3 id="shoe-guide-title" className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-950 mt-0.5">
                  Footwear Size Conversion &amp; Fit Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close fit guide"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-neutral-950">
              {/* Sizing Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-950 mb-2.5">
                  Official Size Conversion Chart (Standard Indian/UK Scale)
                </h4>
                <div className="overflow-x-auto border border-neutral-200/90 rounded-2xl shadow-xs bg-white">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-100/90 text-neutral-900 uppercase font-extrabold text-[11px] tracking-wider border-b border-neutral-200">
                      <tr>
                        <th className="py-3 px-4 text-left w-1/4">UK (India)</th>
                        <th className="py-3 px-4 text-center w-1/4">US Men</th>
                        <th className="py-3 px-4 text-center w-1/4">EU</th>
                        <th className="py-3 px-4 text-center w-1/4">Foot Length (CM)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 text-neutral-950">
                      <tr className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-left font-extrabold text-neutral-950">UK 6</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">US 7</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">EU 40</td>
                        <td className="py-3.5 px-4 text-center font-bold text-neutral-950">25.0 cm</td>
                      </tr>
                      <tr className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-left font-extrabold text-neutral-950">UK 7</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">US 8</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">EU 41</td>
                        <td className="py-3.5 px-4 text-center font-bold text-neutral-950">26.0 cm</td>
                      </tr>
                      <tr className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-left font-extrabold text-neutral-950">UK 8</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">US 9</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">EU 42</td>
                        <td className="py-3.5 px-4 text-center font-bold text-neutral-950">27.0 cm</td>
                      </tr>
                      <tr className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-left font-extrabold text-neutral-950">UK 9</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">US 10</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">EU 43</td>
                        <td className="py-3.5 px-4 text-center font-bold text-neutral-950">28.0 cm</td>
                      </tr>
                      <tr className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-left font-extrabold text-neutral-950">UK 10</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">US 11</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">EU 44</td>
                        <td className="py-3.5 px-4 text-center font-bold text-neutral-950">29.0 cm</td>
                      </tr>
                      <tr className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-left font-extrabold text-neutral-950">UK 11</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">US 12</td>
                        <td className="py-3.5 px-4 text-center font-medium text-neutral-800">EU 45</td>
                        <td className="py-3.5 px-4 text-center font-bold text-neutral-950">30.0 cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Silhouette Profiles */}
              <div className="space-y-3">
                <div className="p-4 bg-neutral-50/80 rounded-2xl border border-neutral-200/80">
                  <div className="text-xs font-bold uppercase text-neutral-950">1. Minimal Court Lows</div>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-normal">
                    True to size. Features a tapered toe profile with medium volume. If you have wide feet, we recommend ordering one size up.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50/80 rounded-2xl border border-neutral-200/80">
                  <div className="text-xs font-bold uppercase text-neutral-950">2. Retro Runners &amp; Suede</div>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-normal">
                    Snug ergonomic hold. Features an EVA midsole wedge that hugs the heel. Fits true to size with socks.
                  </p>
                </div>
                <div className="p-4 bg-neutral-50/80 rounded-2xl border border-neutral-200/80">
                  <div className="text-xs font-bold uppercase text-neutral-950">3. Chunky Soles &amp; Platforms</div>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-normal">
                    Generous interior volume with deep heel cup. Order your standard UK sneaker size.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-4 border-t border-neutral-100 bg-neutral-50/70 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-full sm:w-auto px-7 py-3 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer shadow-md"
              >
                Got It, Return to Footwear Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
