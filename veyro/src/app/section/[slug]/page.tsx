"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCustomSections, type CustomSectionProduct, type CustomSectionFilter } from "@/context/CustomSectionsContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Grid3X3,
  Columns2,
  X,
  ShoppingBag,
  Heart,
  Check,
  ArrowRight,
} from "lucide-react";

// ── Product Card for Custom Sections ─────────────────────────────────────────
function CustomProductCard({ product }: { product: CustomSectionProduct }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? calculateDiscountPercentage(product.price, product.originalPrice)
      : null;

  const displayDiscount = discountPercent ? `${discountPercent}% OFF` : null;

  return (
    <article
      className="group flex flex-col card-hover-lift rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        {/* Product Image Container */}
        <div className="relative w-full overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-xl bg-[#f4f2ee] aspect-[3/4]">
          <Link
            href={`/product/${product.slug}`}
            className="relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            aria-label={product.name}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              quality={80}
              unoptimized={product.imageUrl?.startsWith("data:")}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
              className={`object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108 ${
                imageLoaded ? "opacity-100" : "opacity-90"
              }`}
            />
            {/* Secondary image on hover */}
            {product.secondaryImageUrl && (
              <Image
                src={product.secondaryImageUrl}
                alt={`${product.name} alternate view`}
                fill
                quality={80}
                loading="lazy"
                unoptimized={product.secondaryImageUrl?.startsWith("data:")}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
              />
            )}
          </Link>

          {/* Product Badge */}
          {product.badge && (
            <div className="absolute top-2.5 left-2.5 pointer-events-none z-10">
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
            </div>
          )}

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <span className="bg-white text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="pt-2.5 pb-1 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-neutral-500">
              {product.material || product.colorName}
            </span>
            {product.colorHex && (
              <span
                className="h-2.5 w-2.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: product.colorHex }}
                title={product.colorName}
              />
            )}
          </div>

          <h3 className="mt-0.5 font-medium leading-snug line-clamp-1 transition-colors text-neutral-900 group-hover:text-neutral-500 text-xs sm:text-sm">
            <Link href={`/product/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>

        {/* Pricing */}
        <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[11px] sm:text-xs line-through text-neutral-400">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="font-semibold text-neutral-900 text-xs sm:text-sm">
            {formatPrice(product.price)}
          </span>
          {displayDiscount && (
            <span className="text-[11px] sm:text-xs font-medium text-emerald-600">
              {displayDiscount}
            </span>
          )}
        </div>

        {/* Sizes Preview */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.sizes.slice(0, 5).map((size) => (
              <span key={size} className="text-[9px] border border-neutral-200 rounded px-1.5 py-0.5 text-neutral-500 font-medium">
                {size}
              </span>
            ))}
            {product.sizes.length > 5 && (
              <span className="text-[9px] text-neutral-400 font-medium">+{product.sizes.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

// ── Filter Sidebar for Custom Sections ───────────────────────────────────────
function CustomFilterSidebar({
  filters,
  activeFilters,
  onToggleFilter,
  onClearAll,
  isMobile,
  onClose,
}: {
  filters: CustomSectionFilter[];
  activeFilters: Record<string, string[]>;
  onToggleFilter: (filterKey: string, option: string) => void;
  onClearAll: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}) {
  const totalActive = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);

  const content = (
    <div className={`${isMobile ? "" : "sticky top-24"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-neutral-700" />
          <span className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Filters</span>
          {totalActive > 0 && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {totalActive}
            </span>
          )}
        </div>
        {totalActive > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-semibold text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-6">
        {filters.map((filter) => (
          <FilterGroup
            key={filter.id}
            filter={filter}
            activeValues={activeFilters[filter.key] || []}
            onToggle={(option) => onToggleFilter(filter.key, option)}
          />
        ))}
      </div>

      {filters.length === 0 && (
        <p className="text-xs text-neutral-400 text-center py-8">No filters configured</p>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[100] flex">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          onClick={onClose}
        />
        <div className="relative ml-auto w-full max-w-sm h-full bg-white shadow-xl flex flex-col z-10 overscroll-contain">
          <div className="flex items-center justify-between p-4 border-b border-neutral-100 shrink-0">
            <span className="text-sm font-bold text-neutral-900">Filters</span>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-100 rounded-lg cursor-pointer"
              aria-label="Close filters"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{content}</div>
          <div className="p-4 border-t border-neutral-100 shrink-0">
            <button
              onClick={onClose}
              className="w-full py-3 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <aside className="hidden lg:block w-[240px] xl:w-[260px] shrink-0 pr-6 xl:pr-8">
      {content}
    </aside>
  );
}

// ── Individual Filter Group ──────────────────────────────────────────────────
function FilterGroup({
  filter,
  activeValues,
  onToggle,
}: {
  filter: CustomSectionFilter;
  activeValues: string[];
  onToggle: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-neutral-100 pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider group-hover:text-neutral-600 transition-colors">
          {filter.label}
        </span>
        {isOpen ? (
          <ChevronLeft size={14} className="text-neutral-400 rotate-90" />
        ) : (
          <ChevronRight size={14} className="text-neutral-400 -rotate-90" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-1.5">
          {filter.options.map((option) => {
            const isActive = activeValues.includes(option);
            return (
              <label
                key={option}
                className="flex items-center gap-2.5 py-1 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded ${filter.type === "radio" ? "rounded-full" : "rounded"} border-2 flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-neutral-900 border-neutral-900"
                      : "bg-white border-neutral-300 group-hover:border-neutral-500"
                  }`}
                  role={filter.type === "radio" ? "radio" : "checkbox"}
                  aria-checked={isActive}
                  tabIndex={0}
                  onClick={() => onToggle(option)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") { e.preventDefault(); onToggle(option); }
                  }}
                >
                  {isActive && (
                    <Check size={10} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <span
                  className={`text-xs transition-colors ${
                    isActive ? "font-semibold text-neutral-900" : "text-neutral-600 group-hover:text-neutral-800"
                  }`}
                >
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Custom Section Page ─────────────────────────────────────────────────
export default function CustomSectionPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const { getSectionBySlug, isHydrated } = useCustomSections();

  const section = getSectionBySlug(slug);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter state
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [gridColumns, setGridColumns] = useState<3 | 4>(4);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "newest">("featured");

  // Auto-advance carousel
  useEffect(() => {
    if (!section || section.carouselImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % section.carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [section]);

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (isMobileFilterOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalDocOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
      };
    }
  }, [isMobileFilterOpen]);

  const handleToggleFilter = (filterKey: string, option: string) => {
    setActiveFilters((prev) => {
      const current = prev[filterKey] || [];
      // Find filter definition
      const filterDef = section?.filters.find((f) => f.key === filterKey);
      if (filterDef?.type === "radio") {
        // Radio: single select, toggle off if same
        return {
          ...prev,
          [filterKey]: current.includes(option) ? [] : [option],
        };
      }
      // Checkbox: multi select
      return {
        ...prev,
        [filterKey]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
  };

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    if (!section) return [];
    let result = [...section.products];

    // Apply filters
    const activeKeys = Object.keys(activeFilters).filter(
      (key) => activeFilters[key].length > 0
    );

    if (activeKeys.length > 0) {
      result = result.filter((product) => {
        return activeKeys.every((key) => {
          const selectedOptions = activeFilters[key];
          const productTags = (product.tags || []).map((t) => t.toLowerCase());
          const productColor = product.colorName.toLowerCase();
          const productMaterial = product.material.toLowerCase();
          const productSizes = product.sizes.map((s) => s.toLowerCase());

          // Check if any selected option matches any product attribute
          return selectedOptions.some((option) => {
            const optLower = option.toLowerCase();
            return (
              productTags.includes(optLower) ||
              productColor === optLower ||
              productMaterial.includes(optLower) ||
              productSizes.includes(optLower) ||
              product.name.toLowerCase().includes(optLower)
            );
          });
        });
      });
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.reverse();
        break;
    }

    return result;
  }, [section, activeFilters, sortBy]);

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  // Carousel height computed before any early return to strictly obey React Rules of Hooks
  const carouselHeightClass = useMemo(() => {
    switch (section?.carouselHeight) {
      case "compact":
        return "h-[220px] sm:h-[300px] lg:h-[360px]";
      case "large":
        return "h-[360px] sm:h-[480px] lg:h-[580px]";
      case "medium":
      default:
        return "h-[280px] sm:h-[380px] lg:h-[460px]";
    }
  }, [section?.carouselHeight]);

  // Loading/Not found states
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-neutral-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Section Not Found</h1>
        <p className="text-sm text-neutral-500 mb-6">This section doesn&apos;t exist or isn&apos;t published yet.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors"
        >
          <ArrowRight size={14} className="rotate-180" />
          Back to Home
        </Link>
      </div>
    );
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % section.carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + section.carouselImages.length) % section.carouselImages.length);

  return (
    <div className="min-h-screen">
      {/* ── Hero Carousel ────────────────────────────────────────────── */}
      {section.carouselImages.length > 0 && (
        <section className={`relative w-full ${carouselHeightClass} overflow-hidden bg-neutral-100`} aria-label={`${section.name} carousel`}>
          {section.carouselImages.map((img, index) => (
            <div
              key={img.id}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: index === currentSlide ? 1 : 0 }}
              aria-hidden={index !== currentSlide}
            >
              <Image
                src={img.src}
                alt={img.alt || section.name}
                fill
                priority={index === 0}
                quality={85}
                unoptimized={img.src?.startsWith("data:")}
                className="object-cover"
              />
              {/* Subtle bottom shadow vignette for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}

          {/* Navigation Arrows */}
          {section.carouselImages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white/30 backdrop-blur-md text-white rounded-full hover:bg-white/50 transition-colors cursor-pointer shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-white/30 backdrop-blur-md text-white rounded-full hover:bg-white/50 transition-colors cursor-pointer shadow-md"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2" role="tablist">
                {section.carouselImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    role="tab"
                    aria-selected={i === currentSlide}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentSlide
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/60 hover:bg-white/90"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {/* ── Catalog Area ─────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-8 lg:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="font-sans flex items-center gap-2.5 text-[13px] uppercase tracking-[0.04em] mb-6">
          <Link href="/" className="text-[#555555] font-medium hover:text-[#111111] transition-colors">
            HOME
          </Link>
          <span className="text-[#777777] font-semibold text-[11px]">&gt;</span>
          <span className="text-[#111111] font-bold uppercase">
            {section.name}
          </span>
        </nav>

        {/* Section Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 uppercase tracking-tight">
            {section.name}
          </h1>
          {section.description && (
            <p className="text-sm text-neutral-500 mt-2 max-w-2xl leading-relaxed">
              {section.description}
            </p>
          )}
        </div>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div className="flex items-center gap-3">
            {/* Mobile filter button */}
            {section.filters.length > 0 && (
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                Filters
                {totalActiveFilters > 0 && (
                  <span className="bg-neutral-900 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {totalActiveFilters}
                  </span>
                )}
              </button>
            )}

            <span className="text-xs text-neutral-500 font-medium">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs font-semibold text-neutral-700 bg-neutral-100 border-none rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>

            {/* Grid toggle */}
            <div className="hidden sm:flex items-center bg-neutral-100 rounded-xl p-0.5">
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  gridColumns === 3 ? "bg-white shadow-sm text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                }`}
                aria-label="3 column grid"
              >
                <Columns2 size={14} />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  gridColumns === 4 ? "bg-white shadow-sm text-neutral-900" : "text-neutral-400 hover:text-neutral-600"
                }`}
                aria-label="4 column grid"
              >
                <Grid3X3 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Pills */}
        {totalActiveFilters > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {Object.entries(activeFilters).map(([key, values]) =>
              values.map((val) => (
                <button
                  key={`${key}-${val}`}
                  onClick={() => handleToggleFilter(key, val)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white text-[11px] font-semibold rounded-full hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  {val}
                  <X size={11} />
                </button>
              ))
            )}
            <button
              onClick={handleClearAllFilters}
              className="text-[11px] font-semibold text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Content: Filter Sidebar + Product Grid */}
        <div className="flex gap-0">
          {/* Desktop Filter Sidebar */}
          {section.filters.length > 0 && (
            <CustomFilterSidebar
              filters={section.filters}
              activeFilters={activeFilters}
              onToggleFilter={handleToggleFilter}
              onClearAll={handleClearAllFilters}
            />
          )}

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <ShoppingBag size={48} className="text-neutral-300 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-600">No products found</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {totalActiveFilters > 0
                    ? "Try adjusting your filters"
                    : "Products will appear here once they're added"}
                </p>
                {totalActiveFilters > 0 && (
                  <button
                    onClick={handleClearAllFilters}
                    className="mt-4 px-5 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-4 sm:gap-5 lg:gap-6 ${
                  gridColumns === 3
                    ? "grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {filteredProducts.map((product) => (
                  <CustomProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && section.filters.length > 0 && (
        <CustomFilterSidebar
          filters={section.filters}
          activeFilters={activeFilters}
          onToggleFilter={handleToggleFilter}
          onClearAll={handleClearAllFilters}
          isMobile
          onClose={() => setIsMobileFilterOpen(false)}
        />
      )}
    </div>
  );
}
