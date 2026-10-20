"use client";

import React, { useState } from "react";
import { ChevronDown, X, SlidersHorizontal, Check } from "lucide-react";

export interface ArchiveFilterState {
  category: "all" | "clothing" | "footwear" | "watches";
  priceRange: "ALL" | "UNDER_1500" | "1500_3000" | "ABOVE_3000";
  curations: string[];
  inStockOnly: boolean;
}

export interface ArchiveFilterSidebarProps {
  filters: ArchiveFilterState;
  onSelectCategory: (cat: "all" | "clothing" | "footwear" | "watches") => void;
  onSelectPriceRange: (range: "ALL" | "UNDER_1500" | "1500_3000" | "ABOVE_3000") => void;
  onToggleCuration: (curation: string) => void;
  onToggleInStock: () => void;
  onClearAll: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
  itemCounts: {
    categories: Record<string, number>;
    priceRanges: Record<string, number>;
    curations: Record<string, number>;
    inStock: number;
  };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const ARCHIVE_CATEGORIES = [
  { id: "all", label: "ALL SILHOUETTES" },
  { id: "clothing", label: "APPAREL & T-SHIRTS" },
  { id: "footwear", label: "SNEAKERS & SHOES" },
  { id: "watches", label: "TIMEPIECES & WATCHES" },
] as const;

export const ARCHIVE_PRICE_RANGES = [
  { id: "ALL", label: "ALL PRICES" },
  { id: "UNDER_1500", label: "UNDER ₹1,500" },
  { id: "1500_3000", label: "₹1,500 – ₹3,000" },
  { id: "ABOVE_3000", label: "ABOVE ₹3,000" },
] as const;

export const ARCHIVE_CURATIONS = [
  { id: "BESTSELLER", label: "BESTSELLERS" },
  { id: "NEW", label: "NEW ARRIVALS" },
  { id: "SALE", label: "SPECIAL SAVINGS" },
] as const;

export function ArchiveFilterSidebar({
  filters,
  onSelectCategory,
  onSelectPriceRange,
  onToggleCuration,
  onToggleInStock,
  onClearAll,
  activeFilterCount,
  totalFilteredCount,
  itemCounts,
  isMobileOpen = false,
  onCloseMobile,
}: ArchiveFilterSidebarProps) {
  // Accordion toggle states
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    curations: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const sidebarContent = (
    <div className="flex flex-col space-y-6">
      {/* ── Sidebar Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e8e5]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-[#111111]" />
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#111111]">
            FILTERS
          </span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-[2px] bg-[#111111] text-white text-[10px] font-mono font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-bold text-[#777777] hover:text-[#111111] uppercase tracking-wider transition-colors cursor-pointer"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* ── Section 1: Categories ─────────────────────────────────────── */}
      <div className="border-b border-[#e8e8e5] pb-5">
        <button
          type="button"
          onClick={() => toggleSection("categories")}
          className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-[0.12em] text-[#111111] mb-3.5 select-none"
        >
          <span>Category</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 text-neutral-500 ${
              openSections.categories ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.categories && (
          <div className="space-y-2 pt-1">
            {ARCHIVE_CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat.id;
              const count = itemCounts.categories[cat.id] ?? 0;

              return (
                <label
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex items-center justify-between py-1 px-1.5 rounded text-xs cursor-pointer select-none transition-colors ${
                    isSelected
                      ? "bg-[#111111] text-white font-bold"
                      : "text-neutral-700 hover:text-black hover:bg-neutral-100/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-white border-white text-black"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </span>
                    <span className="tracking-wide uppercase text-[11px] font-semibold">
                      {cat.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? "text-neutral-300" : "text-neutral-400"
                    }`}
                  >
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Section 2: Price Range ────────────────────────────────────── */}
      <div className="border-b border-[#e8e8e5] pb-5">
        <button
          type="button"
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-[0.12em] text-[#111111] mb-3.5 select-none"
        >
          <span>Price Range</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 text-neutral-500 ${
              openSections.price ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.price && (
          <div className="space-y-2 pt-1">
            {ARCHIVE_PRICE_RANGES.map((range) => {
              const isSelected = filters.priceRange === range.id;
              const count = itemCounts.priceRanges[range.id] ?? 0;

              return (
                <label
                  key={range.id}
                  onClick={() => onSelectPriceRange(range.id)}
                  className={`flex items-center justify-between py-1 px-1.5 rounded text-xs cursor-pointer select-none transition-colors ${
                    isSelected
                      ? "bg-[#111111] text-white font-bold"
                      : "text-neutral-700 hover:text-black hover:bg-neutral-100/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-white bg-white"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                      )}
                    </span>
                    <span className="tracking-wide uppercase text-[11px] font-semibold">
                      {range.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? "text-neutral-300" : "text-neutral-400"
                    }`}
                  >
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Section 3: Curations & Badges ─────────────────────────────── */}
      <div className="border-b border-[#e8e8e5] pb-5">
        <button
          type="button"
          onClick={() => toggleSection("curations")}
          className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-[0.12em] text-[#111111] mb-3.5 select-none"
        >
          <span>Curated Editions</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 text-neutral-500 ${
              openSections.curations ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.curations && (
          <div className="space-y-2 pt-1">
            {ARCHIVE_CURATIONS.map((c) => {
              const isSelected = filters.curations.includes(c.id);
              const count = itemCounts.curations[c.id] ?? 0;

              return (
                <label
                  key={c.id}
                  onClick={() => onToggleCuration(c.id)}
                  className={`flex items-center justify-between py-1 px-1.5 rounded text-xs cursor-pointer select-none transition-colors ${
                    isSelected
                      ? "bg-[#111111] text-white font-bold"
                      : "text-neutral-700 hover:text-black hover:bg-neutral-100/70"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-white border-white text-black"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {isSelected && <Check size={10} strokeWidth={3} />}
                    </span>
                    <span className="tracking-wide uppercase text-[11px] font-semibold">
                      {c.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono ${
                      isSelected ? "text-neutral-300" : "text-neutral-400"
                    }`}
                  >
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Section 4: Availability ──────────────────────────────────── */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection("availability")}
          className="w-full flex items-center justify-between text-left text-xs font-bold uppercase tracking-[0.12em] text-[#111111] mb-3.5 select-none"
        >
          <span>Availability</span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 text-neutral-500 ${
              openSections.availability ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.availability && (
          <div className="pt-1">
            <label
              onClick={onToggleInStock}
              className={`flex items-center justify-between py-1 px-1.5 rounded text-xs cursor-pointer select-none transition-colors ${
                filters.inStockOnly
                  ? "bg-[#111111] text-white font-bold"
                  : "text-neutral-700 hover:text-black hover:bg-neutral-100/70"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center transition-colors ${
                    filters.inStockOnly
                      ? "bg-white border-white text-black"
                      : "border-neutral-300 bg-white"
                  }`}
                >
                  {filters.inStockOnly && <Check size={10} strokeWidth={3} />}
                </span>
                <span className="tracking-wide uppercase text-[11px] font-semibold">
                  In Stock Only
                </span>
              </div>
              <span
                className={`text-[10px] font-mono ${
                  filters.inStockOnly ? "text-neutral-300" : "text-neutral-400"
                }`}
              >
                ({itemCounts.inStock})
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Left Column) */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200 pr-2">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Slide Drawer */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-900">
                Filter Archive ({activeFilterCount})
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">{sidebarContent}</div>

            <div className="p-4 border-t border-neutral-200 bg-neutral-50">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-3 bg-[#111111] text-white rounded-[2px] text-xs font-bold uppercase tracking-wider shadow-md hover:bg-black transition-colors"
              >
                Show {totalFilteredCount} Pieces
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
