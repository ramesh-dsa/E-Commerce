"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/features/ProductCard";
import { ProductCardSkeleton } from "@/components/features/ProductCardSkeleton";
import { SortDropdown, SortOptionItem } from "@/components/ui/SortDropdown";
import {
  Grid2X2,
  LayoutGrid,
  Search,
  X,
  Zap,
  ShieldCheck,
  Layers,
  ArrowRight,
} from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "discount";
type ViewLayout = "chapters" | "stream";

const ARCHIVE_SORT_OPTIONS: SortOptionItem<SortOption>[] = [
  { value: "featured", label: "Archival Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Savings" },
];

export function AllProductsCatalog() {
  const { products, isHydrated } = useProducts();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // ── States ──────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [gridColumns, setGridColumns] = useState<2 | 4>(4);
  const [viewLayout, setViewLayout] = useState<ViewLayout>("chapters");
  const [activeChapter, setActiveChapter] = useState<string>("chapter-apparel");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── Scroll Spy for Active Chapter Highlight ──────────────────────────────
  useEffect(() => {
    if (viewLayout !== "chapters") return;

    const chapters = ["chapter-apparel", "chapter-footwear", "chapter-watches", "chapter-other"];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 240;
      for (let i = chapters.length - 1; i >= 0; i--) {
        const el = document.getElementById(chapters[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveChapter(chapters[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [viewLayout]);

  // ── Sorting helper ───────────────────────────────────────────────────────
  const sortProducts = (list: typeof products) => {
    const copy = [...list];
    switch (sortBy) {
      case "price-asc":
        return copy.sort((a, b) => a.price - b.price);
      case "price-desc":
        return copy.sort((a, b) => b.price - a.price);
      case "discount":
        return copy.sort((a, b) => {
          const discA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const discB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return discB - discA;
        });
      case "featured":
      default:
        return copy;
    }
  };

  // ── Search filter helper ─────────────────────────────────────────────────
  const filterBySearch = (list: typeof products) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  };

  // ── All Products Filtered & Sorted (Unified Stream) ─────────────────────
  const allFilteredProducts = useMemo(() => {
    return sortProducts(filterBySearch(products));
  }, [products, searchQuery, sortBy]);

  // ── Chapter 01: Apparel & T-Shirts ──────────────────────────────────────
  const apparelProducts = useMemo(() => {
    const raw = products.filter(
      (p) => p.category?.toLowerCase() === "clothing" || p.category?.toLowerCase() === "t-shirts"
    );
    return sortProducts(filterBySearch(raw));
  }, [products, searchQuery, sortBy]);

  // ── Chapter 02: Footwear & Shoes ─────────────────────────────────────────
  const footwearProducts = useMemo(() => {
    const raw = products.filter(
      (p) => p.category?.toLowerCase() === "footwear" || p.category?.toLowerCase() === "shoes"
    );
    return sortProducts(filterBySearch(raw));
  }, [products, searchQuery, sortBy]);

  // ── Chapter 03: Timepieces & Watches ─────────────────────────────────────
  const watchProducts = useMemo(() => {
    const raw = products.filter(
      (p) => p.category?.toLowerCase() === "watches" || p.category?.toLowerCase() === "timepieces"
    );
    return sortProducts(filterBySearch(raw));
  }, [products, searchQuery, sortBy]);

  // ── Chapter 04: Atelier / Custom Products (if any) ───────────────────────
  const otherProducts = useMemo(() => {
    const raw = products.filter(
      (p) =>
        p.category?.toLowerCase() !== "clothing" &&
        p.category?.toLowerCase() !== "t-shirts" &&
        p.category?.toLowerCase() !== "footwear" &&
        p.category?.toLowerCase() !== "shoes" &&
        p.category?.toLowerCase() !== "watches" &&
        p.category?.toLowerCase() !== "timepieces"
    );
    return sortProducts(filterBySearch(raw));
  }, [products, searchQuery, sortBy]);

  const totalVisibleCount = allFilteredProducts.length;

  // ── Smooth Chapter Scroll with Proper Navbar + Dock Offsets ─────────────
  const scrollToChapter = (id: string) => {
    if (viewLayout !== "chapters") {
      setViewLayout("chapters");
      setTimeout(() => performScroll(id), 120);
    } else {
      performScroll(id);
    }
  };

  const performScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
      const isTablet = typeof window !== "undefined" && window.innerWidth >= 640;
      const navHeight = isDesktop ? 82 : isTablet ? 78 : 74;
      const dockHeight = 56;
      const yOffset = -(navHeight + dockHeight + 48);
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const handleViewLayoutChange = (layout: ViewLayout) => {
    setViewLayout(layout);
    // Smooth scroll to top of workspace
    const workspace = document.getElementById("catalog-workspace");
    if (workspace) {
      const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
      const isTablet = typeof window !== "undefined" && window.innerWidth >= 640;
      const navHeight = isDesktop ? 82 : isTablet ? 78 : 74;
      const dockHeight = 56;
      const yOffset = -(navHeight + dockHeight + 24);
      const y = workspace.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full bg-[#fbfbf9] text-[#111111] min-h-screen">
      {/* ── 1. CINEMATIC LOOKBOOK HERO BANNER ─────────────────────────── */}
      <section className="relative w-full h-[280px] sm:h-[340px] lg:h-[400px] overflow-hidden bg-[#0d0d10]">
        <Image
          src="/images/clothing-hero-banner.jpg"
          alt="VEYRO Complete Product Archive"
          fill
          priority
          quality={85}
          className="object-cover object-[center_35%] opacity-55"
          sizes="100vw"
        />

        {/* High-fashion subtle directional scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d10] via-[#0d0d10]/85 to-transparent pointer-events-none z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-transparent to-black/30 pointer-events-none z-1" />

        {/* Editorial Content Stage */}
        <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center px-6 sm:px-10 lg:px-16 max-w-2xl">
          <span className="font-script text-3xl sm:text-4xl lg:text-5xl text-[#fcd017] tracking-normal font-normal drop-shadow-md select-none -mb-1">
            the complete archive
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] uppercase text-white leading-[0.92] drop-shadow-md font-[family-name:var(--font-outfit)]">
            FULL REPERTOIRE ARCHIVE
          </h1>

          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <span className="inline-block px-3 py-1 bg-[#fcd017] text-[#111111] text-xs sm:text-sm font-black tracking-wider uppercase rounded-full shadow-sm">
              ALL 35 SILHOUETTES
            </span>
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] text-white/90">
              HEAVYWEIGHT COTTON · VULCANIZED SOLES · SWISS CALIBRES
            </span>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed max-w-lg hidden sm:block">
            Explore every silhouette, stitch density, and mechanical movement across VEYRO&apos;s
            three foundational pillars — presented in complete runway sequence.
          </p>
        </div>
      </section>

      {/* ── 2. STICKY RUNWAY DOCK: BREADCRUMBS, JUMP ANCHORS & CONTROLS ── */}
      <section className="w-full bg-white/95 border-b border-[#e8e8e5] py-2.5 sm:py-3 px-5 sm:px-8 lg:px-12 sticky top-[74px] sm:top-[78px] lg:top-[82px] z-30 backdrop-blur-md shadow-xs transition-all">
        <div className="mx-auto max-w-[1536px] flex items-center justify-between gap-4 flex-wrap">
          {/* Left: Breadcrumbs & Chapter Jump Links */}
          <div className="flex items-center gap-4 lg:gap-6 flex-wrap">
            <nav aria-label="Breadcrumbs" className="font-sans flex items-center gap-2 text-xs uppercase tracking-[0.06em]">
              <Link href="/" className="text-neutral-500 font-medium hover:text-black transition-colors">
                HOME
              </Link>
              <span className="text-neutral-300 font-semibold">/</span>
              <Link href="/collections" className="text-neutral-500 font-medium hover:text-black transition-colors">
                COLLECTIONS
              </Link>
              <span className="text-neutral-300 font-semibold">/</span>
              <span className="text-black font-bold">ALL PRODUCTS ({totalVisibleCount})</span>
            </nav>

            {/* Quick Runway Jump Anchors (Visible in Chapters Mode) */}
            {viewLayout === "chapters" && (
              <div className="hidden lg:flex items-center gap-1.5 pl-5 border-l border-neutral-200/80">
                <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase mr-1.5 select-none">
                  JUMP:
                </span>
                <button
                  type="button"
                  onClick={() => scrollToChapter("chapter-apparel")}
                  className={`h-8 px-3.5 inline-flex items-center justify-center text-xs font-semibold tracking-wide rounded-full transition-all cursor-pointer ${
                    activeChapter === "chapter-apparel"
                      ? "bg-[#111111] text-white shadow-xs"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-100/90"
                  }`}
                >
                  01 Apparel ({apparelProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => scrollToChapter("chapter-footwear")}
                  className={`h-8 px-3.5 inline-flex items-center justify-center text-xs font-semibold tracking-wide rounded-full transition-all cursor-pointer ${
                    activeChapter === "chapter-footwear"
                      ? "bg-[#111111] text-white shadow-xs"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-100/90"
                  }`}
                >
                  02 Footwear ({footwearProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => scrollToChapter("chapter-watches")}
                  className={`h-8 px-3.5 inline-flex items-center justify-center text-xs font-semibold tracking-wide rounded-full transition-all cursor-pointer ${
                    activeChapter === "chapter-watches"
                      ? "bg-[#111111] text-white shadow-xs"
                      : "text-neutral-600 hover:text-black hover:bg-neutral-100/90"
                  }`}
                >
                  03 Watches ({watchProducts.length})
                </button>
                {otherProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => scrollToChapter("chapter-other")}
                    className={`h-8 px-3.5 inline-flex items-center justify-center text-xs font-semibold tracking-wide rounded-full transition-all cursor-pointer ${
                      activeChapter === "chapter-other"
                        ? "bg-[#111111] text-white shadow-xs"
                        : "text-neutral-600 hover:text-black hover:bg-neutral-100/90"
                    }`}
                  >
                    04 Atelier ({otherProducts.length})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right: Layout Switcher, Search, Sort & Grid Density */}
          <div className="flex items-center gap-2.5 sm:gap-3 ml-auto flex-wrap">
            {/* View Mode Toggle: Chapters vs Unified Stream */}
            <div className="inline-flex items-center h-9 bg-neutral-100/80 p-1 rounded-full border border-neutral-200/60 shadow-2xs">
              <button
                type="button"
                onClick={() => handleViewLayoutChange("chapters")}
                className={`h-7 px-3.5 inline-flex items-center justify-center text-xs font-semibold tracking-wide rounded-full transition-all cursor-pointer ${
                  viewLayout === "chapters"
                    ? "bg-white text-black shadow-xs font-bold"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                Chapters
              </button>
              <button
                type="button"
                onClick={() => handleViewLayoutChange("stream")}
                className={`h-7 px-3.5 inline-flex items-center justify-center text-xs font-semibold tracking-wide rounded-full transition-all cursor-pointer ${
                  viewLayout === "stream"
                    ? "bg-white text-black shadow-xs font-bold"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                All Stream ({totalVisibleCount})
              </button>
            </div>

            {/* Minimal Search Input */}
            <div className="relative w-36 sm:w-52 h-9">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search archive..."
                className="w-full h-full text-xs bg-neutral-100/70 hover:bg-neutral-100/90 focus:bg-white rounded-full pl-8 pr-7 border border-transparent focus:border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
              />
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Veyro Standard SortDropdown */}
            <SortDropdown
              value={sortBy}
              onChange={setSortBy}
              options={ARCHIVE_SORT_OPTIONS}
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
        </div>
      </section>

      {/* ── 3. RUNWAY WORKSPACE ────────────────────────────────────────── */}
      <main id="catalog-workspace" className="mx-auto w-full max-w-[1536px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        {/* Loading Skeletons */}
        {!isMounted || !isHydrated ? (
          <div className="space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : totalVisibleCount === 0 ? (
          /* Empty Search State */
          <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-[#f8f8f6] rounded-[2px] border border-dashed border-[#dcdcd8]">
            <span className="text-4xl mb-3">🔍</span>
            <h2 className="text-xl font-bold uppercase tracking-tight text-[#111111]">
              No Archival Pieces Found
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-500 max-w-md">
              No products found matching &ldquo;{searchQuery}&rdquo;. Try another keyword or clear search.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-2.5 bg-[#111111] text-white text-xs font-bold uppercase tracking-[0.1em] rounded-[2px] hover:bg-[#333333] transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Clear Search</span>
            </button>
          </div>
        ) : viewLayout === "stream" ? (
          /* ── UNIFIED STREAM VIEW: ALL 35 PRODUCTS IN CONTINUOUS GRID ── */
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-[#111111] gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 mb-1">
                  <span>UNIFIED REPERTOIRE</span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-[#111111]">{allFilteredProducts.length} TOTAL PIECES</span>
                </div>
                <span className="font-script text-2xl sm:text-3xl text-neutral-500 tracking-normal block -mb-1">
                  from yarn to movement
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111111]">
                  COMPLETE ARCHIVAL STREAM
                </h2>
              </div>

              <div className="text-xs text-neutral-500 font-mono">
                SORTED BY: <span className="font-bold text-black uppercase">{ARCHIVE_SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
              </div>
            </div>

            <div
              className={`grid gap-x-4 sm:gap-x-6 gap-y-10 ${
                gridColumns === 4
                  ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {allFilteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isInWishlist(product.id)}
                  onWishlistToggle={() => toggleWishlist(product)}
                />
              ))}
            </div>
          </section>
        ) : (
          /* ── CHAPTER RUNWAY VIEW: ORGANIZED LUXURY LOOKBOOK ─────────── */
          <div className="space-y-16 sm:space-y-24">
            {/* ── CHAPTER 01: APPAREL & T-SHIRTS ─────────────────────── */}
            {apparelProducts.length > 0 && (
              <section id="chapter-apparel" className="scroll-mt-[200px]">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-[#111111] mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 mb-1">
                      <span>CHAPTER 01</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-[#111111]">{apparelProducts.length} SILHOUETTES</span>
                    </div>
                    <span className="font-script text-2xl sm:text-3xl text-neutral-500 tracking-normal block -mb-1">
                      the boxy drape
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111111]">
                      HEAVYWEIGHT APPAREL ARCHIVE
                    </h2>
                  </div>

                  <Link
                    href="/clothing"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-neutral-600 transition-colors group"
                  >
                    <span>Filter by GSM &amp; Fit</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>

                <div
                  className={`grid gap-x-4 sm:gap-x-6 gap-y-10 ${
                    gridColumns === 4
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {apparelProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={isInWishlist(product.id)}
                      onWishlistToggle={() => toggleWishlist(product)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── CHAPTER 02: FOOTWEAR & SNEAKERS ────────────────────── */}
            {footwearProducts.length > 0 && (
              <section id="chapter-footwear" className="scroll-mt-[200px]">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-[#111111] mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 mb-1">
                      <span>CHAPTER 02</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-[#111111]">{footwearProducts.length} EDITIONS</span>
                    </div>
                    <span className="font-script text-2xl sm:text-3xl text-neutral-500 tracking-normal block -mb-1">
                      double sole rotation
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111111]">
                      HANDCRAFTED VULCANIZED FOOTWEAR
                    </h2>
                  </div>

                  <Link
                    href="/shoes"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-neutral-600 transition-colors group"
                  >
                    <span>Filter Footwear Vault</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>

                <div
                  className={`grid gap-x-4 sm:gap-x-6 gap-y-10 ${
                    gridColumns === 4
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {footwearProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={isInWishlist(product.id)}
                      onWishlistToggle={() => toggleWishlist(product)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── CHAPTER 03: TIMEPIECES & WATCHES ───────────────────── */}
            {watchProducts.length > 0 && (
              <section id="chapter-watches" className="scroll-mt-[200px]">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-[#111111] mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 mb-1">
                      <span>CHAPTER 03</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-[#111111]">{watchProducts.length} CALIBRES</span>
                    </div>
                    <span className="font-script text-2xl sm:text-3xl text-neutral-500 tracking-normal block -mb-1">
                      the ticking art
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111111]">
                      ARCHIVAL TIMEPIECES &amp; HOROLOGY
                    </h2>
                  </div>

                  <Link
                    href="/watches"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111] hover:text-neutral-600 transition-colors group"
                  >
                    <span>Explore Horology Vault</span>
                    <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>

                <div
                  className={`grid gap-x-4 sm:gap-x-6 gap-y-10 ${
                    gridColumns === 4
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {watchProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={isInWishlist(product.id)}
                      onWishlistToggle={() => toggleWishlist(product)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── CHAPTER 04: ATELIER & CUSTOM SILHOUETTES (IF ANY) ─── */}
            {otherProducts.length > 0 && (
              <section id="chapter-other" className="scroll-mt-[200px]">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-[#111111] mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-neutral-400 mb-1">
                      <span>CHAPTER 04</span>
                      <span className="text-neutral-300">•</span>
                      <span className="text-[#111111]">{otherProducts.length} ATELIER PIECES</span>
                    </div>
                    <span className="font-script text-2xl sm:text-3xl text-neutral-500 tracking-normal block -mb-1">
                      capsule studio
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-[#111111]">
                      ATELIER &amp; SPECIAL DROPS
                    </h2>
                  </div>
                </div>

                <div
                  className={`grid gap-x-4 sm:gap-x-6 gap-y-10 ${
                    gridColumns === 4
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1 sm:grid-cols-2"
                  }`}
                >
                  {otherProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={isInWishlist(product.id)}
                      onWishlistToggle={() => toggleWishlist(product)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* ── 4. ARCHITECTURAL BRAND ASSURANCE FOOTER STRIP ─────────────── */}
      <section className="w-full border-t border-[#e8e8e5] bg-white py-12 px-5 sm:px-8 lg:px-14 mt-16">
        <div className="max-w-[1536px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#f7f7f5] border border-neutral-200 flex items-center justify-center text-[#111111] shadow-xs shrink-0">
              <Zap size={20} className="fill-[#111111]" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#111111]">
                Free Express Delivery
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
                Complete Authenticity
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                100% verified combed cotton, vulcanized soles &amp; Swiss calibres
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
