"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import { SearchIcon, CloseIcon } from "@/components/ui/Icons";
import { ArrowUpRight, TrendingUp, Sparkles } from "lucide-react";

const searchPhrases = [
  "Search for products...",
  "Search for oversized t-shirts...",
  "Search for retro runners...",
  "Search for 240 GSM t-shirts...",
  "Search for graphic t-shirts...",
];

const TRENDING_KEYWORDS = [
  "Oversized T-Shirts",
  "Retro Runners",
  "Acid Wash",
  "240 GSM",
  "Graphic T-Shirts",
  "Chunky",
];

interface ProductSearchProps {
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

export function ProductSearch({
  className = "",
  inputClassName = "",
  autoFocus = false,
  isMobile = false,
  onClose,
}: ProductSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Zero-rerender typewriter animation using direct DOM mutation on inputRef
  useEffect(() => {
    if (query.length > 0) return;

    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseDuration = 2000;

    let phraseIdx = 0;
    let charIdx = searchPhrases[0].length;
    let isDeleting = true;
    let timer: NodeJS.Timeout;

    const tick = () => {
      // Respect prefers-reduced-motion accessibility setting
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (inputRef.current) inputRef.current.placeholder = "Search for products...";
        return;
      }

      // Pause when browser tab is inactive to save battery & CPU
      if (typeof document !== "undefined" && document.hidden) {
        timer = setTimeout(tick, 1000);
        return;
      }

      const currentPhrase = searchPhrases[phraseIdx];

      if (isDeleting) {
        if (charIdx > 0) {
          charIdx--;
          if (inputRef.current) {
            inputRef.current.placeholder = currentPhrase.substring(0, charIdx) || " ";
          }
          timer = setTimeout(tick, deleteSpeed);
        } else {
          isDeleting = false;
          phraseIdx = (phraseIdx + 1) % searchPhrases.length;
          timer = setTimeout(tick, 200);
        }
      } else {
        if (charIdx < currentPhrase.length) {
          charIdx++;
          if (inputRef.current) {
            inputRef.current.placeholder = currentPhrase.substring(0, charIdx);
          }
          timer = setTimeout(tick, typeSpeed);
        } else {
          isDeleting = true;
          timer = setTimeout(tick, pauseDuration);
        }
      }
    };

    // Initial pause before beginning first delete cycle
    timer = setTimeout(tick, pauseDuration);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time Instant Search Matching
  const filteredProducts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const words = trimmed.split(/\s+/).filter(Boolean);

    return products
      .map((product) => {
        let score = 0;
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        const subcategory = product.subcategory.toLowerCase();
        const subcategoryTag = product.subcategoryTag.toLowerCase();
        const fit = (product.fit || "").toLowerCase();
        const color = product.colorName.toLowerCase();
        const material = product.material.toLowerCase();
        const badge = (product.badge || "").toLowerCase();
        const tags = (product.tags || []).map((t) => t.toLowerCase());

        // Exact or startsWith phrase matches
        if (name === trimmed) score += 250;
        else if (name.startsWith(trimmed)) score += 150;
        else if (name.includes(trimmed)) score += 90;

        if (subcategoryTag.includes(trimmed)) score += 70;
        if (category.includes(trimmed)) score += 60;
        if (fit && fit.includes(trimmed)) score += 50;
        if (color.includes(trimmed)) score += 40;
        if (tags.some((t) => t.includes(trimmed))) score += 40;

        // Multi-word partial matching
        for (const word of words) {
          if (name.includes(word)) score += 40;
          if (subcategoryTag.includes(word)) score += 30;
          if (fit && fit.includes(word)) score += 25;
          if (category.includes(word)) score += 20;
          if (subcategory.includes(word)) score += 20;
          if (color.includes(word)) score += 20;
          if (material.includes(word)) score += 15;
          if (badge.includes(word)) score += 15;
          if (tags.some((t) => t.includes(word))) score += 20;
        }

        return { product, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product)
      .slice(0, 5);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setSelectedIndex((prev) =>
        prev < filteredProducts.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) return;
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredProducts.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isMobile) {
        if (filteredProducts.length > 0) {
          router.push(`/product/${filteredProducts[0].slug}`);
          handleCloseMobile();
        } else if (query.trim()) {
          router.push(`/clothing`);
          handleCloseMobile();
        }
        return;
      }
      if (selectedIndex >= 0 && filteredProducts[selectedIndex]) {
        const selected = filteredProducts[selectedIndex];
        router.push(`/product/${selected.slug}`);
        setIsOpen(false);
        onClose?.();
      } else if (filteredProducts.length > 0) {
        router.push(`/product/${filteredProducts[0].slug}`);
        setIsOpen(false);
        onClose?.();
      } else if (query.trim()) {
        router.push(`/clothing`);
        setIsOpen(false);
        onClose?.();
      }
    } else if (e.key === "Escape") {
      if (isMobile) {
        handleCloseMobile();
        return;
      }
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectKeyword = (kw: string) => {
    setQuery(kw);
    setIsOpen(true);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery("");
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleCloseMobile = () => {
    setQuery("");
    setIsOpen(false);
    onClose?.();
  };

  // Dedicated Full-Screen Mobile Search Modal (< 768px)
  if (isMobile) {
    const topCategory = filteredProducts[0]?.category?.toLowerCase();
    const categoryHref =
      topCategory === "footwear"
        ? "/shoes"
        : topCategory === "watches"
        ? "/watches"
        : "/clothing";
    const categoryLabel =
      topCategory === "footwear"
        ? "View All Footwear Catalog"
        : topCategory === "watches"
        ? "View All Watches Catalog"
        : "View All Clothing Catalog";

    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search Catalog"
        className="fixed inset-0 z-[120] bg-white flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-contain animate-in fade-in duration-200"
      >
        {/* Pinned Top Search Bar */}
        <div className="shrink-0 px-4 py-3 border-b border-[#f0f0ed] bg-white flex items-center gap-3">
          <div className="flex-1 relative flex items-center">
            <span className="absolute left-3.5 text-neutral-400 pointer-events-none">
              <SearchIcon size={18} />
            </span>
            <input
              ref={inputRef}
              type="text"
              role="searchbox"
              value={query}
              autoFocus
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search products..."
              aria-label="Search products"
              className="h-11 w-full rounded-full bg-[#f4f4f2] pl-10 pr-9 text-sm font-medium text-[#111111] placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-[#fcd017] border border-transparent transition-all"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search query"
                className="absolute right-3 p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-200/60 transition-all cursor-pointer"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleCloseMobile}
            aria-label="Cancel search"
            className="text-[14px] font-semibold text-neutral-700 hover:text-black cursor-pointer shrink-0 py-1 pl-1"
          >
            Cancel
          </button>
        </div>

        {/* Scrollable Results & Discovery Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 min-h-0 luxury-sidebar-scrollbar">
          {/* Empty Query: Trending searches & Category quick links */}
          {!query.trim() && (
            <div className="py-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-neutral-400 mb-3">
                <TrendingUp size={13} className="text-neutral-700" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleSelectKeyword(kw)}
                    className="px-3.5 py-2 rounded-full bg-neutral-100 hover:bg-[#fcd017] hover:text-black text-neutral-800 text-[12.5px] font-medium transition-all cursor-pointer active:scale-95 shadow-2xs"
                  >
                    {kw}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-bold tracking-wider uppercase text-neutral-400 mt-7 mb-3">
                Browse Collections
              </div>
              <div className="space-y-2">
                <Link
                  href="/clothing"
                  onClick={handleCloseMobile}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#fafaf8] border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-[13px] font-bold text-neutral-900">Clothing &amp; Tees</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">15 Oversized &amp; Graphic drops</div>
                  </div>
                  <ArrowUpRight size={16} className="text-neutral-400" />
                </Link>

                <Link
                  href="/shoes"
                  onClick={handleCloseMobile}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#fafaf8] border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-[13px] font-bold text-neutral-900">Footwear &amp; Sneakers</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">9 Retro &amp; Minimal silhouettes</div>
                  </div>
                  <ArrowUpRight size={16} className="text-neutral-400" />
                </Link>

                <Link
                  href="/watches"
                  onClick={handleCloseMobile}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-[#fafaf8] border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <div>
                    <div className="text-[13px] font-bold text-neutral-900">Timepieces &amp; Horology</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">12 Precision automatics</div>
                  </div>
                  <ArrowUpRight size={16} className="text-neutral-400" />
                </Link>
              </div>
            </div>
          )}

          {/* Active Query with Matching Results */}
          {query.trim() && filteredProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
                  <Sparkles size={12} className="text-[#e2b70d]" />
                  <span>Matching Catalog Products</span>
                </div>
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">
                  {filteredProducts.length} Found
                </span>
              </div>

              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={handleCloseMobile}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50/60 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700">
                            {product.subcategoryTag || product.subcategory}
                          </span>
                          {product.badge && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#fcd017] text-black">
                              {product.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[13.5px] font-bold text-neutral-900 truncate mt-1">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-2 text-[12px] mt-0.5">
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="line-through text-neutral-400 font-mono text-[11px]">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                          <span className="font-mono font-bold text-neutral-900">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-neutral-300 text-[10px]">·</span>
                          <span className="text-neutral-500 text-[11px] truncate">
                            {product.colorName}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 p-1.5 rounded-full bg-neutral-100 text-neutral-500">
                      <ArrowUpRight size={15} />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Dynamic Category Navigation Jump */}
              <div className="mt-4 pt-3 border-t border-neutral-100">
                <Link
                  href={categoryHref}
                  onClick={handleCloseMobile}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f8f8f6] hover:bg-[#f0f0ee] transition-colors text-neutral-900 font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <span>{categoryLabel}</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          )}

          {/* Active Query with No Matches */}
          {query.trim() && filteredProducts.length === 0 && (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                <SearchIcon size={22} />
              </div>
              <div className="text-[15px] font-bold text-neutral-900">
                No products found for &ldquo;{query}&rdquo;
              </div>
              <p className="text-[13px] text-neutral-500 mt-1.5 max-w-xs mx-auto">
                Try searching with general keywords like oversized, retro, graphic, or sneakers.
              </p>
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-3">
                  Popular Suggestions
                </span>
                <div className="flex flex-wrap justify-center gap-2">
                  {["Oversized", "Graphic", "Retro", "Sneakers", "Black", "240 GSM"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectKeyword(tag)}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#fcd017] hover:text-black text-neutral-700 text-xs font-medium transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DESKTOP VIEW (100% Unchanged)
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full group">
        <span className="absolute left-4 text-[#888888] group-focus-within:text-[#111111] transition-colors pointer-events-none">
          <SearchIcon size={18} />
        </span>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for products..."
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls={isOpen ? "search-results-dropdown" : undefined}
          aria-autocomplete="list"
          className={`h-[44px] xl:h-[46px] w-full rounded-full bg-[#f0f0ee] pl-11 pr-10 text-[13px] font-medium text-[#111111] placeholder:text-[#999999] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-[#fcd017]/60 border border-transparent shadow-xs transition-all duration-200 ${inputClassName}`}
        />

        {/* Clear Button */}
        {query.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search query"
            className="absolute right-3.5 p-1 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-200/70 transition-all cursor-pointer"
          >
            <CloseIcon size={14} />
          </button>
        )}
      </div>

      {/* Live Search Results Dropdown Popover */}
      {isOpen && (
        <div
          id="search-results-dropdown"
          className="absolute top-full right-0 mt-2.5 w-[420px] lg:w-[460px] xl:w-[480px] bg-white/98 backdrop-blur-xl border border-black/10 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.18)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-neutral-50/80 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-neutral-500">
              {query.trim() ? (
                <>
                  <Sparkles size={12} className="text-[#e2b70d]" />
                  <span>Matching Catalog Products</span>
                </>
              ) : (
                <>
                  <TrendingUp size={12} className="text-neutral-700" />
                  <span>Popular Streetwear Drops</span>
                </>
              )}
            </div>
            {query.trim() && (
              <span className="text-[10.5px] font-semibold text-neutral-400 tracking-wide uppercase">
                {filteredProducts.length} Found
              </span>
            )}
          </div>

          {/* Body Content */}
          <div className="p-3 max-h-[420px] overflow-y-auto">
            {/* When Query is Empty: Show Trending Keywords & Fast Links */}
            {!query.trim() && (
              <div className="py-2 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleSelectKeyword(kw)}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#fcd017] hover:text-black text-neutral-700 text-[12px] font-medium transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                    >
                      {kw}
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2">
                  <Link
                    href="/clothing"
                    onClick={() => {
                      setIsOpen(false);
                      onClose?.();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors group cursor-pointer"
                  >
                    <div>
                      <div className="text-[12px] font-bold text-neutral-900">
                        Clothing Catalog
                      </div>
                      <div className="text-[10.5px] text-neutral-500">
                        15 Oversized & Graphic T-Shirts
                      </div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </Link>

                  <Link
                    href="/#footwear"
                    onClick={() => {
                      setIsOpen(false);
                      onClose?.();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors group cursor-pointer"
                  >
                    <div>
                      <div className="text-[12px] font-bold text-neutral-900">
                        Footwear Drop
                      </div>
                      <div className="text-[10.5px] text-neutral-500">
                        9 Retro & Chunky Soles
                      </div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-neutral-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            )}

            {/* When Query Has Matching Products */}
            {query.trim() && filteredProducts.length > 0 && (
              <div className="space-y-1.5">
                {filteredProducts.map((product, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        onClose?.();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between gap-3 p-2 rounded-xl transition-all duration-150 group cursor-pointer ${
                        isSelected
                          ? "bg-neutral-100 ring-1 ring-black/10"
                          : "hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail Image */}
                        <div className="relative w-[46px] h-[54px] rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="46px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Title & Meta Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-200/70 text-neutral-800">
                              {product.subcategoryTag || product.subcategory}
                            </span>
                            {product.badge && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#fcd017] text-black">
                                {product.badge}
                              </span>
                            )}
                          </div>

                          <div className="text-[13px] font-bold text-neutral-900 truncate mt-0.5 group-hover:text-black">
                            {product.name}
                          </div>

                          <div className="flex items-center gap-2 text-[11.5px] mt-0.5">
                            {product.originalPrice && product.originalPrice > product.price && (
                              <span className="line-through text-neutral-400 font-mono text-[10.5px]">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                            <span className="font-mono font-bold text-neutral-900">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-neutral-400 text-[10.5px]">·</span>
                            <span className="text-neutral-500 text-[10.5px] truncate">
                              {product.colorName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Arrow */}
                      <div className="shrink-0 pr-2">
                        <div className="w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-[#111111] group-hover:text-[#fcd017] flex items-center justify-center text-neutral-500 transition-colors">
                          <ArrowUpRight size={14} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* When Query Has No Matching Products */}
            {query.trim() && filteredProducts.length === 0 && (
              <div className="py-7 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-2.5 text-neutral-400">
                  <SearchIcon size={20} />
                </div>
                <div className="text-[13.5px] font-bold text-neutral-900">
                  No products found for &ldquo;{query}&rdquo;
                </div>
                <p className="text-[12px] text-neutral-500 mt-1 max-w-xs mx-auto">
                  Try searching with broader terms like oversized, retro, graphic, or cotton.
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                    Popular suggestions
                  </span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {["Oversized", "Graphic", "Retro", "Black", "240 GSM"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleSelectKeyword(tag)}
                        className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-[#fcd017] hover:text-black text-neutral-700 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          {query.trim() && filteredProducts.length > 0 && (
            <div className="p-2.5 bg-neutral-50/90 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[10.5px] text-neutral-400 font-medium">
                Tip: Press <kbd className="px-1 py-0.5 rounded bg-white border border-neutral-200 text-[9.5px] font-mono text-neutral-700">↵ Enter</kbd> to view first item
              </span>
              <Link
                href="/clothing"
                onClick={() => {
                  setIsOpen(false);
                  onClose?.();
                }}
                className="text-[11.5px] font-bold text-neutral-900 hover:text-black flex items-center gap-1 group/btn cursor-pointer"
              >
                <span>View Clothing Catalog</span>
                <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
