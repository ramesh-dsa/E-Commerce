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
  WatchFilterSidebar,
  WatchFilterState,
  WATCH_COLORS,
  WATCH_PRICE_RANGES,
} from "./WatchFilterSidebar";
import {
  SlidersHorizontal,
  Grid3X3,
  Columns2,
  X,
  Zap,
  ArrowRight,
  ShieldCheck,
  Watch as WatchIcon,
  Ruler,
  Check,
  ShoppingBag,
} from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "discount";

const WATCH_SORT_OPTIONS: SortOptionItem<SortOption>[] = [
  { value: "featured", label: "Archival Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Savings" },
];

export function WatchesCatalog() {
  // ── Cart & Wishlist Context ───────────────────────────────────────────────
  const { addToCart } = useCart();
  const { isInWishlist } = useWishlist();

  // ── Filter & View States ───────────────────────────────────────────────────
  const [filters, setFilters] = useState<WatchFilterState>({
    collections: [],
    movements: [],
    genders: [],
    priceRange: "ALL",
    discounts: [],
    caseSizes: [],
    colors: [],
    dialTypes: [],
    straps: [],
  });

  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // ── Base Watch Products (8 SKUs) ──────────────────────────────────────────
  const watchProducts = useMemo(() => {
    return products.filter((p) => p.category === "Watches");
  }, []);

  // ── Dynamic Item Counts for All Filter Criteria ────────────────────────────
  const itemCounts = useMemo(() => {
    const counts = {
      collections: {} as Record<string, number>,
      movements: {} as Record<string, number>,
      genders: {} as Record<string, number>,
      priceRanges: {} as Record<string, number>,
      discounts: {} as Record<string, number>,
      caseSizes: {} as Record<string, number>,
      colors: {} as Record<string, number>,
      dialTypes: {} as Record<string, number>,
      straps: {} as Record<string, number>,
    };

    watchProducts.forEach((p) => {
      if (p.subcategoryTag) {
        counts.collections[p.subcategoryTag] = (counts.collections[p.subcategoryTag] || 0) + 1;
      }
      if (p.movement) {
        counts.movements[p.movement] = (counts.movements[p.movement] || 0) + 1;
      }
      if (p.gender) {
        counts.genders[p.gender] = (counts.genders[p.gender] || 0) + 1;
      }
      if (p.strapMaterial) {
        counts.straps[p.strapMaterial] = (counts.straps[p.strapMaterial] || 0) + 1;
      }
      if (p.caseDiameter) {
        counts.caseSizes[p.caseDiameter] = (counts.caseSizes[p.caseDiameter] || 0) + 1;
      }
      if (p.price < 5000) counts.priceRanges["UNDER_5K"] = (counts.priceRanges["UNDER_5K"] || 0) + 1;
      if (p.price >= 5000 && p.price < 8000) counts.priceRanges["5K_TO_8K"] = (counts.priceRanges["5K_TO_8K"] || 0) + 1;
      if (p.price >= 8000) counts.priceRanges["ABOVE_8K"] = (counts.priceRanges["ABOVE_8K"] || 0) + 1;
      counts.priceRanges["ALL"] = watchProducts.length;

      const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
      if (disc >= 15) counts.discounts["15"] = (counts.discounts["15"] || 0) + 1;
      if (disc >= 20) counts.discounts["20"] = (counts.discounts["20"] || 0) + 1;
      if (disc >= 25) counts.discounts["25"] = (counts.discounts["25"] || 0) + 1;

      const colorLower = (p.colorName || "").toLowerCase();
      if (colorLower.includes("black")) counts.colors["black"] = (counts.colors["black"] || 0) + 1;
      if (colorLower.includes("silver") || colorLower.includes("steel")) counts.colors["silver"] = (counts.colors["silver"] || 0) + 1;
      if (colorLower.includes("gold") || colorLower.includes("champagne")) counts.colors["gold"] = (counts.colors["gold"] || 0) + 1;
      if (colorLower.includes("navy") || colorLower.includes("blue")) counts.colors["navy"] = (counts.colors["navy"] || 0) + 1;
      if (colorLower.includes("green") || colorLower.includes("emerald")) counts.colors["green"] = (counts.colors["green"] || 0) + 1;
      if (colorLower.includes("titanium") || colorLower.includes("olive")) counts.colors["titanium"] = (counts.colors["titanium"] || 0) + 1;

      if (p.subcategoryTag === "Minimalist") counts.dialTypes["Minimalist"] = (counts.dialTypes["Minimalist"] || 0) + 1;
      if (p.subcategoryTag === "Chronograph") counts.dialTypes["Chronograph"] = (counts.dialTypes["Chronograph"] || 0) + 1;
      if (p.subcategoryTag === "Automatic" || p.subcategoryTag === "Diver") counts.dialTypes["Field"] = (counts.dialTypes["Field"] || 0) + 1;
    });

    return counts;
  }, [watchProducts]);

  // ── Footwear Cross-Sell Pairings ─────────────────────────────────────────
  const footwearPairings = useMemo(() => {
    return products.filter((p) => p.category === "Footwear").slice(0, 3);
  }, []);

  // ── Filter Toggle Handlers ────────────────────────────────────────────────
  const handleToggleCollection = (collection: string) => {
    setFilters((prev) => ({
      ...prev,
      collections: prev.collections.includes(collection)
        ? prev.collections.filter((c) => c !== collection)
        : [...prev.collections, collection],
    }));
  };

  const handleToggleMovement = (movement: string) => {
    setFilters((prev) => ({
      ...prev,
      movements: prev.movements.includes(movement)
        ? prev.movements.filter((m) => m !== movement)
        : [...prev.movements, movement],
    }));
  };

  const handleToggleGender = (gender: string) => {
    setFilters((prev) => ({
      ...prev,
      genders: prev.genders.includes(gender)
        ? prev.genders.filter((g) => g !== gender)
        : [...prev.genders, gender],
    }));
  };

  const handleSelectPriceRange = (range: string) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: range,
    }));
  };

  const handleToggleDiscount = (discount: string) => {
    setFilters((prev) => ({
      ...prev,
      discounts: prev.discounts.includes(discount)
        ? prev.discounts.filter((d) => d !== discount)
        : [...prev.discounts, discount],
    }));
  };

  const handleToggleCaseSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      caseSizes: prev.caseSizes.includes(size)
        ? prev.caseSizes.filter((s) => s !== size)
        : [...prev.caseSizes, size],
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

  const handleToggleDialType = (dialType: string) => {
    setFilters((prev) => ({
      ...prev,
      dialTypes: prev.dialTypes.includes(dialType)
        ? prev.dialTypes.filter((dt) => dt !== dialType)
        : [...prev.dialTypes, dialType],
    }));
  };

  const handleToggleStrap = (strap: string) => {
    setFilters((prev) => ({
      ...prev,
      straps: prev.straps.includes(strap)
        ? prev.straps.filter((s) => s !== strap)
        : [...prev.straps, strap],
    }));
  };

  const handleClearAll = () => {
    setFilters({
      collections: [],
      movements: [],
      genders: [],
      priceRange: "ALL",
      discounts: [],
      caseSizes: [],
      colors: [],
      dialTypes: [],
      straps: [],
    });
    setSortBy("featured");
  };

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.collections.length;
    count += filters.movements.length;
    count += filters.genders.length;
    if (filters.priceRange !== "ALL") count += 1;
    count += filters.discounts.length;
    count += filters.caseSizes.length;
    count += filters.colors.length;
    count += filters.dialTypes.length;
    count += filters.straps.length;
    return count;
  }, [filters]);

  // ── Filter & Sort Logic ───────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return watchProducts
      .filter((product) => {
        // 1. Collection filter
        if (filters.collections.length > 0) {
          if (!product.subcategoryTag || !filters.collections.includes(product.subcategoryTag)) {
            return false;
          }
        }

        // 2. Movement filter
        if (filters.movements.length > 0) {
          if (!product.movement || !filters.movements.includes(product.movement)) {
            return false;
          }
        }

        // 3. Gender filter
        if (filters.genders.length > 0) {
          if (!product.gender || !filters.genders.includes(product.gender)) {
            return false;
          }
        }

        // 4. Price range filter
        if (filters.priceRange !== "ALL") {
          if (filters.priceRange === "UNDER_5K" && product.price >= 5000) return false;
          if (filters.priceRange === "5K_TO_8K" && (product.price < 5000 || product.price >= 8000)) return false;
          if (filters.priceRange === "ABOVE_8K" && product.price < 8000) return false;
        }

        // 5. Discount filter
        if (filters.discounts.length > 0) {
          const disc = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
          const matchesDiscount = filters.discounts.some((minD) => disc >= parseInt(minD, 10));
          if (!matchesDiscount) return false;
        }

        // 6. Case Size filter
        if (filters.caseSizes.length > 0) {
          if (!product.caseDiameter || !filters.caseSizes.includes(product.caseDiameter)) {
            return false;
          }
        }

        // 7. Colorway filter
        if (filters.colors.length > 0) {
          const colorLower = (product.colorName || "").toLowerCase();
          const matchesColor = filters.colors.some((colKey) => {
            if (colKey === "black" && colorLower.includes("black")) return true;
            if (colKey === "silver" && (colorLower.includes("silver") || colorLower.includes("steel"))) return true;
            if (colKey === "gold" && (colorLower.includes("gold") || colorLower.includes("champagne"))) return true;
            if (colKey === "navy" && (colorLower.includes("navy") || colorLower.includes("blue"))) return true;
            if (colKey === "green" && (colorLower.includes("green") || colorLower.includes("emerald"))) return true;
            if (colKey === "titanium" && (colorLower.includes("titanium") || colorLower.includes("olive"))) return true;
            return false;
          });
          if (!matchesColor) return false;
        }

        // 8. Dial Type filter
        if (filters.dialTypes.length > 0) {
          const matchesDial = filters.dialTypes.some((dt) => {
            if (dt === "Minimalist" && (product.subcategoryTag === "Minimalist" || product.name.includes("Minimalist"))) return true;
            if (dt === "Chronograph" && (product.subcategoryTag === "Chronograph" || product.name.includes("Chronograph"))) return true;
            if (dt === "Field" && (product.subcategoryTag === "Automatic" || product.subcategoryTag === "Diver" || product.name.includes("Field") || product.name.includes("Diver"))) return true;
            return false;
          });
          if (!matchesDial) return false;
        }

        // 9. Strap Material filter
        if (filters.straps.length > 0) {
          if (!product.strapMaterial || !filters.straps.includes(product.strapMaterial)) {
            return false;
          }
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
  }, [watchProducts, filters, sortBy]);

  // ── Quick Add to Bag ──────────────────────────────────────────────────────
  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes?.[0] || product.caseDiameter || "Standard";
    addToCart(product, size, 1, false);
    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
    }, 1200);
  };

  return (
    <div className="w-full bg-white text-[#111111] selection:bg-[#111111] selection:text-white pb-24">
      {/* ── 1. FULL-WIDTH HOROLOGY EDITORIAL HERO BANNER ───────────────── */}
      <section className="w-full mb-2">
        <h1 className="sr-only">All Watches — Time Lives Different Here | VEYRO Horology Archive</h1>
        <div className="relative w-full overflow-hidden bg-[#e8e2d9] aspect-[3/1] min-h-[170px] sm:min-h-[240px] md:min-h-[320px] max-h-[640px]">
          {/* User's High-Clarity Lossless WebP Editorial Campaign Banner Image (3K Native, Zero Quality Loss) */}
          <Image
            src="/images/watches-archive-campaign.webp"
            alt="All Watches — Time Lives Different Here | VEYRO Horology Archive"
            fill
            priority
            unoptimized
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      </section>

      {/* ── 2. SUB-BAR: BREADCRUMBS, PRODUCT COUNT & SORT ───────────── */}
      <section className="w-full bg-white border-b border-[#f0f0ed] py-3.5 px-5 sm:px-8 lg:px-12 sticky top-0 z-20 backdrop-blur-md bg-white/95">
        <div className="mx-auto max-w-[1536px] flex flex-wrap items-center justify-between gap-3">
          {/* Left: Mobile Filter Button, Breadcrumbs, Product Count */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Mobile Filter Drawer Trigger Button */}
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

            {/* Breadcrumbs matching Image 3 */}
            <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#111111]">
              <Link href="/" className="hover:text-[#555555] transition-colors">
                HOME
              </Link>
              <span className="text-[#888888]">&gt;</span>
              <span className="text-[#111111]">WATCHES</span>
            </nav>

            <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-wider text-[#8e8e8e]">
              WATCHES &nbsp;ITEMS 1 – {filteredProducts.length} OF {watchProducts.length}
            </span>
          </div>

          {/* Right: Sizing Guide Button, Grid Switcher, Sort Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Watch Case Size Guide Button */}
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-black uppercase tracking-wider px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#fcd017] transition-colors cursor-pointer"
            >
              <Ruler size={13} />
              <span>Case Size Guide</span>
            </button>

            {/* Desktop Grid Switcher (3 or 4 cols next to sidebar) */}
            <div className="hidden sm:flex items-center border border-[#e8e8e5] rounded-[2px] p-0.5 bg-[#f8f8f6]">
              <button
                type="button"
                onClick={() => setGridColumns(4)}
                aria-label="4-column boutique view"
                className={`p-1.5 rounded-[2px] transition-colors cursor-pointer ${
                  gridColumns === 4 ? "bg-[#111111] text-white" : "text-[#777777] hover:text-[#111111]"
                }`}
              >
                <Grid3X3 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setGridColumns(3)}
                aria-label="3-column editorial view"
                className={`p-1.5 rounded-[2px] transition-colors cursor-pointer ${
                  gridColumns === 3 ? "bg-[#111111] text-white" : "text-[#777777] hover:text-[#111111]"
                }`}
              >
                <Columns2 size={15} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <SortDropdown<SortOption>
              value={sortBy}
              onChange={setSortBy}
              options={WATCH_SORT_OPTIONS}
            />
          </div>

          {/* Active Filter Chips Row */}
          {activeFilterCount > 0 && (
            <div className="w-full flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#f0f0ed]">
              <span className="text-[11px] text-[#8e8e8e] uppercase font-semibold mr-1">Active:</span>

              {/* Collection Chips */}
              {filters.collections.map((col) => (
                <span
                  key={col}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold"
                >
                  {col}
                  <button
                    type="button"
                    onClick={() => handleToggleCollection(col)}
                    className="hover:text-[#fcd017] cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              {/* Movement Chips */}
              {filters.movements.map((mov) => (
                <span
                  key={mov}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold"
                >
                  {mov}
                  <button
                    type="button"
                    onClick={() => handleToggleMovement(mov)}
                    className="hover:text-[#fcd017] cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              {/* Gender Chips */}
              {filters.genders.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold"
                >
                  {g}
                  <button
                    type="button"
                    onClick={() => handleToggleGender(g)}
                    className="hover:text-[#fcd017] cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              {/* Price Range Chip */}
              {filters.priceRange !== "ALL" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold">
                  {WATCH_PRICE_RANGES.find((p) => p.id === filters.priceRange)?.label}
                  <button
                    type="button"
                    onClick={() => handleSelectPriceRange("ALL")}
                    className="hover:text-[#fcd017] cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </span>
              )}

              {/* Discount Chips */}
              {filters.discounts.map((d) => (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold"
                >
                  {d}% &amp; Above
                  <button
                    type="button"
                    onClick={() => handleToggleDiscount(d)}
                    className="hover:text-[#fcd017] cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              {/* Case Size Chips */}
              {filters.caseSizes.map((cs) => (
                <span
                  key={cs}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold"
                >
                  Size: {cs}
                  <button
                    type="button"
                    onClick={() => handleToggleCaseSize(cs)}
                    className="hover:text-[#fcd017] cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              {/* Color Chips */}
              {filters.colors.map((colKey) => {
                const colObj = WATCH_COLORS.find((c) => c.id === colKey);
                return (
                  <span
                    key={colKey}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold"
                  >
                    {colObj?.label || colKey}
                    <button
                      type="button"
                      onClick={() => handleToggleColor(colKey)}
                      className="hover:text-[#fcd017] cursor-pointer"
                    >
                      <X size={11} />
                    </button>
                  </span>
                );
              })}

              {/* Dial Type Chips */}
              {filters.dialTypes.map((dt) => (
                <span
                  key={dt}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold"
                >
                  {dt}
                  <button
                    type="button"
                    onClick={() => handleToggleDialType(dt)}
                    className="hover:text-[#fcd017] cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              {/* Strap Chips */}
              {filters.straps.map((strap) => (
                <span
                  key={strap}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#111111] text-white text-[11px] font-semibold"
                >
                  {strap}
                  <button
                    type="button"
                    onClick={() => handleToggleStrap(strap)}
                    className="hover:text-[#fcd017] cursor-pointer"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={handleClearAll}
                className="text-[11px] font-bold text-[#c44d25] hover:underline uppercase tracking-wider ml-1 cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. MAIN WORKSPACE: VERTICAL SIDEBAR + PRODUCT GRID ─────────── */}
      <main className="mx-auto max-w-[1536px] px-5 sm:px-8 lg:px-12 py-10">
        <div className="flex items-start gap-8 xl:gap-10">
          {/* Vertical Sidebar Filter (Desktop sticky + Mobile slide-over) */}
          <WatchFilterSidebar
            filters={filters}
            onToggleCollection={handleToggleCollection}
            onToggleMovement={handleToggleMovement}
            onToggleGender={handleToggleGender}
            onSelectPriceRange={handleSelectPriceRange}
            onToggleDiscount={handleToggleDiscount}
            onToggleCaseSize={handleToggleCaseSize}
            onToggleColor={handleToggleColor}
            onToggleDialType={handleToggleDialType}
            onToggleStrap={handleToggleStrap}
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
                <WatchIcon size={42} className="text-[#8e8e8e] mb-3" />
                <h3 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
                  No Archival Timepieces Found
                </h3>
                <p className="mt-2 text-sm text-[#777777] max-w-md">
                  We couldn&apos;t find any watches matching your selected combination of movement, strap, price, and color filters.
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
                    : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3"
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
                      {/* Embedded Editorial Campaign Card at slot #2 (spans 2 cols) */}
                      {index === 2 && (
                        <article className="col-span-2 flex flex-col justify-between p-6 sm:p-9 bg-[#0d0d10] text-white rounded-[2px] relative overflow-hidden shadow-2xl border border-white/10 group min-h-[380px] sm:min-h-[420px]">
                          {/* Editorial Photography Background */}
                          <Image
                            src="/images/watches-archive-campaign.jpg"
                            alt="VEYRO Horology Atelier - Architectural Watchmaking"
                            fill
                            quality={92}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
                            className="object-cover object-[70%_center] transition-transform duration-700 ease-out group-hover:scale-105"
                          />

                          {/* Cinematic Scrim */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/95 via-[#09090b]/75 sm:via-[#09090b]/35 to-transparent z-1" />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-transparent to-black/25 z-1" />

                          {/* Editorial Copy */}
                          <div className="relative z-10 max-w-[280px] sm:max-w-[340px]">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-[#fcd017] text-[#111111] text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm">
                              <Zap size={12} className="fill-[#111111]" />
                              HOROLOGY PRIVILEGE
                            </div>
                            <span className="font-script text-2xl sm:text-3xl text-[#fcd017] block -mb-1 font-bold drop-shadow-xs">
                              complimentary vault gift
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
                              Free Italian Leather Travel Roll
                            </h3>
                            <p className="mt-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light drop-shadow-xs">
                              Every VEYRO timepiece order ships with a bespoke single-watch travel roll in vegetable-tanned full-grain leather.
                            </p>
                          </div>

                          {/* Bottom Row */}
                          <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex items-end justify-between backdrop-blur-[2px] rounded-[2px] px-1">
                            <div>
                              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-mono">
                                Travel Roll Value
                              </span>
                              <span className="text-xs sm:text-sm font-semibold line-through text-neutral-400">
                                ₹2,499
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-[#fcd017] uppercase tracking-widest font-bold block font-mono">
                                Vault Privilege
                              </span>
                              <span className="text-xl sm:text-2xl font-black text-[#fcd017] tracking-tight drop-shadow-sm">
                                INCLUDED WITH ORDER
                              </span>
                            </div>
                          </div>

                          {/* Subtle Ambient Glow */}
                          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#fcd017]/10 rounded-full blur-3xl pointer-events-none" />
                        </article>
                      )}

                      {/* Standard Watch Card — Helios Center-Aligned Luxury Aesthetic with Smooth Hover Zoom */}
                      <article className="group flex flex-col relative card-hover-lift rounded-[2px] bg-white transition-all duration-300">
                        {/* Image Stage Container */}
                        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-[2px] bg-[#f8f8f6] transition-all duration-300">
                          <Link
                            href={`/product/${product.slug}`}
                            className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]"
                            aria-label={product.name}
                          >
                            {/* Primary Image with Smooth Luxury Zoom on Hover */}
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              quality={90}
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
                            />

                            {/* Secondary Angle / Macro View on Hover */}
                            {product.secondaryImageUrl && (
                              <Image
                                src={product.secondaryImageUrl}
                                alt={`${product.name} macro dial view`}
                                fill
                                quality={90}
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover object-center opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                              />
                            )}
                          </Link>

                          {/* Top Badges (Left) */}
                          <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none z-10">
                            {discountPercent && (
                              <span className="px-1.5 py-0.5 rounded-[1px] bg-[#d9381e] text-white text-[9px] font-black uppercase tracking-wider shadow-xs">
                                {discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          {/* Wishlist Heart Button (Right) */}
                          <div className="absolute top-2 right-2 z-10 transition-opacity duration-200">
                            <WishlistButton product={product} isWishlisted={isWishlisted} />
                          </div>
                        </div>

                        {/* Metadata Stage (Helios Center-Aligned Luxury Format) */}
                        <div className="pt-3.5 pb-2 flex flex-col items-center text-center flex-grow">
                          {/* Line 1: Maker / Brand Line */}
                          <span className="text-[11.5px] font-black uppercase tracking-[0.14em] text-[#111111]">
                            {product.subcategoryTag ? `${product.subcategoryTag.toUpperCase()} ARCHIVE` : "VEYRO HOROLOGY"}
                          </span>

                          {/* Line 2: Gender | Model Name */}
                          <h3 className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#666666] mt-0.5 line-clamp-1 group-hover:text-black transition-colors">
                            <Link href={`/product/${product.slug}`}>
                              {product.gender || "UNISEX"} | {product.name.replace(/^VEYRO\s+/i, "")}
                            </Link>
                          </h3>

                          {/* Line 3: Pricing Block */}
                          <div className="mt-1.5 flex items-baseline justify-center gap-2">
                            <span className="text-[14px] sm:text-[15px] font-black text-[#111111] font-mono">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="text-xs text-[#999999] line-through font-mono">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                            {discountPercent && (
                              <span className="text-[11px] font-bold text-[#d9381e] font-mono">
                                ({discountPercent}% OFF)
                              </span>
                            )}
                          </div>

                          {/* Line 4: Quick Action CTA (Helios style button with instant feedback) */}
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(product, e)}
                            className={`mt-2.5 w-full py-1.5 px-3 rounded-[2px] text-[11px] font-bold uppercase tracking-[0.1em] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                              addedProductId === product.id
                                ? "bg-[#fcd017] text-[#111111] font-black shadow-xs"
                                : "bg-transparent text-[#111111] border border-[#e5e5e3] hover:bg-[#111111] hover:text-white hover:border-[#111111] group-hover:border-[#111111]"
                            }`}
                          >
                            {addedProductId === product.id ? (
                              <>
                                <Check size={12} strokeWidth={3} />
                                <span>ADDED TO BAG</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={12} />
                                <span>QUICK ADD TO BAG</span>
                              </>
                            )}
                          </button>
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

      {/* ── 4. CROSS-CATEGORY CURATED PAIRINGS (FOOTWEAR) ───────────── */}
      <section className="w-full bg-[#f8f8f6] border-t border-b border-[#e8e8e5] py-14 px-5 sm:px-8 lg:px-12 mt-12">
        <div className="mx-auto max-w-[1536px]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8e8e8e] block mb-1">
                CURATED ARCHIVE ROTATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
                Pair With Vulcanized Footwear
              </h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-1">
                Italian vulcanized rubber soles and minimal court silhouettes designed to complement surgical steel timepieces.
              </p>
            </div>
            <Link
              href="/shoes"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:underline"
            >
              <span>Explore Footwear Catalog (9)</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {footwearPairings.map((shoe) => (
              <Link
                key={shoe.id}
                href={`/product/${shoe.slug}`}
                className="group flex flex-col bg-white p-4 rounded-[2px] border border-[#e8e8e5] card-hover-lift"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f4f2ee] rounded-[2px] mb-3">
                  <Image
                    src={shoe.imageUrl}
                    alt={shoe.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {shoe.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-[2px] bg-[#111111] text-[#fcd017] text-[9px] font-extrabold uppercase">
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

      {/* ── 5. INTERACTIVE WATCH CASE SIZING MODAL ──────────────────────── */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="watch-guide-title"
            className="w-full max-w-2xl bg-white rounded-[2px] border border-[#e8e8e5] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e8e5] bg-[#fafaf8]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8e8e8e] block">
                  VEYRO HOROLOGY FIT GUIDE
                </span>
                <h3 id="watch-guide-title" className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#111111]">
                  Watch Case Diameter &amp; Wrist Scale Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(false)}
                className="p-1.5 text-[#555555] hover:text-[#111111] hover:bg-[#eeeeea] rounded-[2px] transition-colors cursor-pointer"
                aria-label="Close fit guide"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Sizing Matrix */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Case Diameter vs. Wrist Circumference Matrix
                </h4>
                <div className="overflow-x-auto border border-neutral-200 rounded-[2px]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-100 text-neutral-700 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="px-3 py-2">Case Diameter</th>
                        <th className="px-3 py-2">Recommended Wrist Size</th>
                        <th className="px-3 py-2">Lug-to-Lug Distance</th>
                        <th className="px-3 py-2">Aesthetic Profile</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 font-mono">
                      <tr>
                        <td className="px-3 py-2 font-bold text-black">38mm</td>
                        <td className="px-3 py-2 text-neutral-600">5.8 – 6.8 inches (15–17 cm)</td>
                        <td className="px-3 py-2 text-neutral-600">44mm</td>
                        <td className="px-3 py-2 text-neutral-600">Classic Dress / Slim Vintage</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-black">40mm</td>
                        <td className="px-3 py-2 text-neutral-600">6.3 – 7.6 inches (16–19 cm)</td>
                        <td className="px-3 py-2 text-neutral-600">47mm</td>
                        <td className="px-3 py-2 text-neutral-600">Universal Golden Ratio</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-black">42mm</td>
                        <td className="px-3 py-2 text-neutral-600">6.9 – 8.2 inches (17.5–21 cm)</td>
                        <td className="px-3 py-2 text-neutral-600">49.5mm</td>
                        <td className="px-3 py-2 text-neutral-600">Commanding Diver / Sports Chrono</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Water Resistance Scale */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                  Official Depth Rating Scale
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-[2px] border border-neutral-200">
                    <div className="font-bold text-black uppercase">50M (5 ATM)</div>
                    <p className="text-neutral-600 mt-1 text-[11px]">
                      Rain, hand washing, light splashes. Not suitable for swimming or diving.
                    </p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-[2px] border border-neutral-200">
                    <div className="font-bold text-black uppercase">100M (10 ATM)</div>
                    <p className="text-neutral-600 mt-1 text-[11px]">
                      Swimming, snorkeling, watersports. Screw-down crown equipped.
                    </p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-[2px] border border-neutral-200">
                    <div className="font-bold text-black uppercase">200M (20 ATM)</div>
                    <p className="text-neutral-600 mt-1 text-[11px]">
                      Saturation scuba diving, high-impact aquatic sports, pressure certified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
