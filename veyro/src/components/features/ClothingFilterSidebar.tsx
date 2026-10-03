"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

export interface ClothingFilterState {
  fits: string[];
  gsmWeights: string[];
  sizes: string[];
  colors: string[];
  priceRange: string;
  curations: string[];
}

export interface ClothingFilterSidebarProps {
  filters: ClothingFilterState;
  onToggleFit: (fit: string) => void;
  onToggleGsm: (gsm: string) => void;
  onToggleSize: (size: string) => void;
  onToggleColor: (colorKey: string) => void;
  onSelectPriceRange: (range: string) => void;
  onToggleCuration: (curation: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
  itemCounts?: {
    fits?: Record<string, number>;
    gsmWeights?: Record<string, number>;
    sizes?: Record<string, number>;
    colors?: Record<string, number>;
    priceRanges?: Record<string, number>;
    curations?: Record<string, number>;
  };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

// ── Filter Definitions ────────────────────────────────────────────────────────
export const CLOTHING_FITS = [
  { id: "Oversized", label: "OVERSIZED FIT", desc: "240+ GSM boxy drop-shoulder" },
  { id: "Graphic", label: "GRAPHIC ART", desc: "Archival front & back prints" },
  { id: "Regular", label: "REGULAR CUT", desc: "Daily straight natural drape" },
  { id: "Relaxed", label: "RELAXED CUT", desc: "Mid-drop ease torso" },
  { id: "Textured", label: "TEXTURED WEAVE", desc: "Waffle knit & resort linen" },
];

export const CLOTHING_GSM_WEIGHTS = [
  { id: "HEAVYWEIGHT", label: "240+ GSM HEAVYWEIGHT", desc: "Structured architectural drape" },
  { id: "MIDWEIGHT", label: "180–220 GSM MIDWEIGHT", desc: "Breathable daily jersey" },
  { id: "TEXTURED", label: "WAFFLE / LINEN", desc: "Tactile open structure" },
];

export const CLOTHING_AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL"];

export const CLOTHING_COLORS = [
  { id: "black", label: "ONYX / VINTAGE BLACK", hex: "#111111", matches: ["black", "vintage black"] },
  { id: "white", label: "CHALK / BONE WHITE", hex: "#F5F0EB", matches: ["white", "off-white", "bone"] },
  { id: "charcoal", label: "ACID CHARCOAL / GREY", hex: "#3A3A3A", matches: ["charcoal", "light grey", "grey marl"] },
  { id: "olive", label: "VINTAGE OLIVE GREEN", hex: "#5C6B4F", matches: ["olive"] },
  { id: "sand", label: "DESERT SAND / BEIGE", hex: "#D6C7A1", matches: ["sand", "beige", "oatmeal"] },
  { id: "navy", label: "SLATE / ARCHIVE NAVY", hex: "#1E2A38", matches: ["navy", "slate blue"] },
];

export const CLOTHING_PRICE_RANGES = [
  { id: "ALL", label: "ALL PRICES" },
  { id: "UNDER_1000", label: "UNDER ₹1,000" },
  { id: "1000_TO_1299", label: "₹1,000 – ₹1,299" },
  { id: "ABOVE_1300", label: "₹1,300 & ABOVE" },
];

export const CLOTHING_CURATIONS = [
  { id: "VIP_BUNDLE", label: "VIP 3-TEE BUNDLE PASS (₹1,199)" },
  { id: "SALE", label: "ARCHIVE SALE EDITS" },
  { id: "BESTSELLER", label: "VAULT BESTSELLERS" },
  { id: "NEW", label: "NEW ARRIVALS" },
];

// ── Minimalist Helios Checkbox Control ────────────────────────────────────────
function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
  count,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label
      htmlFor={`cb-${id}`}
      className="flex items-center justify-between gap-2.5 py-1.5 cursor-pointer group select-none transition-colors"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`h-[13px] w-[13px] shrink-0 rounded-[1.5px] border transition-all duration-150 flex items-center justify-center ${
            checked
              ? "bg-[#111111] border-[#111111]"
              : "border-[#cfcfcf] bg-white group-hover:border-[#111111]"
          }`}
          aria-hidden="true"
        >
          {checked && (
            <svg
              width="8"
              height="6"
              viewBox="0 0 8 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#fcd017]"
            >
              <path
                d="M1 3L2.8 5L7 1"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <input
          type="checkbox"
          id={`cb-${id}`}
          checked={checked}
          onChange={onChange}
          className="sr-only"
          aria-checked={checked}
        />
        <span
          className={`font-luxury text-[11px] sm:text-[11.5px] uppercase tracking-[0.06em] leading-none transition-colors truncate ${
            checked
              ? "font-medium text-[#111111]"
              : "font-normal text-[#444444] group-hover:text-black"
          }`}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[10.5px] font-mono text-[#8e8e8e] shrink-0">
          ({count})
        </span>
      )}
    </label>
  );
}

// ── Accordion Section with Left Chevron ───────────────────────────────────────
function AccordionSection({
  title,
  isOpen,
  onToggle,
  activeCount = 0,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  activeCount?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-2.5 py-1.5 text-left cursor-pointer group transition-colors"
      >
        <ChevronDown
          size={13}
          strokeWidth={1.8}
          className={`text-[#111111] transition-transform duration-200 motion-reduce:transition-none shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
        <span className="font-luxury text-[12px] font-medium uppercase tracking-[0.08em] text-[#111111] group-hover:text-[#555555] transition-colors">
          {title}
        </span>
        {activeCount > 0 && (
          <span className="ml-auto text-[10px] font-mono font-medium text-[#111111] bg-[#f0f0ed] px-1.5 py-0.5 rounded-[2px]">
            {activeCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="pt-1.5 pb-2 pl-5 flex flex-col gap-0.5">
          {children}
        </div>
      )}
    </div>
  );
}

type SectionKey = "fits" | "gsm" | "sizes" | "colors" | "price" | "curations";

export function ClothingFilterSidebar({
  filters,
  onToggleFit,
  onToggleGsm,
  onToggleSize,
  onToggleColor,
  onSelectPriceRange,
  onToggleCuration,
  onClearAll,
  activeFilterCount,
  totalFilteredCount,
  itemCounts,
  isMobileOpen = false,
  onCloseMobile,
}: ClothingFilterSidebarProps) {
  // Lock background website scrolling when mobile filter drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalDocOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
      };
    }
  }, [isMobileOpen]);

  // Count active selections per section to protect them during auto-collapse
  const activeCounts: Record<SectionKey, number> = {
    fits: filters.fits.length,
    gsm: filters.gsmWeights.length,
    sizes: filters.sizes.length,
    colors: filters.colors.length,
    price: filters.priceRange && filters.priceRange !== "ALL" ? 1 : 0,
    curations: filters.curations.length,
  };

  // Max 3 Open Accordions Queue (Auto-Collapse / Smart Mutex)
  const MAX_OPEN = 3;
  const [openSections, setOpenSections] = useState<SectionKey[]>([
    "fits",
    "gsm",
    "sizes",
  ]);

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) => {
      if (prev.includes(section)) {
        // User clicked an open section -> close it
        return prev.filter((s) => s !== section);
      }

      // User clicked to open a section
      if (prev.length < MAX_OPEN) {
        return [...prev, section];
      }

      // 3 already open: Evict oldest section without active filters first (smart retention)
      const evictCandidate =
        prev.find((s) => (activeCounts[s] || 0) === 0) || prev[0];

      return [...prev.filter((s) => s !== evictCandidate), section];
    });
  };

  const filterContent = (
    <div className="flex flex-col text-[#111111] select-none">
      {/* ── HEADER ROW: FILTERS (Left) & CLEAR ALL (Right) ───────────────────── */}
      <div className="flex items-center justify-between pb-3 mb-1">
        <h2 className="font-luxury text-[13.5px] font-medium uppercase tracking-[0.08em] text-[#111111]">
          FILTERS
          {activeFilterCount > 0 && (
            <span className="ml-1.5 text-[11px] font-mono font-normal text-[#8e8e8e]">
              ({activeFilterCount})
            </span>
          )}
        </h2>

        <button
          type="button"
          onClick={activeFilterCount > 0 ? onClearAll : undefined}
          disabled={activeFilterCount === 0}
          className={`group relative font-luxury text-[11px] font-medium uppercase tracking-[0.06em] transition-colors ${
            activeFilterCount > 0
              ? "text-[#111111] cursor-pointer"
              : "text-[#c2c2c2] cursor-default"
          }`}
          aria-label="Clear all applied filters"
        >
          CLEAR ALL
          {activeFilterCount > 0 && (
            <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-[#111111] origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
          )}
        </button>
      </div>

      {/* ── 1. FIT & SILHOUETTE ──────────────────────────────────────────────── */}
      <AccordionSection
        title="FIT & SILHOUETTE"
        isOpen={openSections.includes("fits")}
        onToggle={() => toggleSection("fits")}
        activeCount={activeCounts.fits}
      >
        {CLOTHING_FITS.map((fit) => (
          <FilterCheckbox
            key={fit.id}
            id={`fit-${fit.id}`}
            label={fit.label}
            checked={filters.fits.includes(fit.id)}
            onChange={() => onToggleFit(fit.id)}
            count={itemCounts?.fits?.[fit.id]}
          />
        ))}
      </AccordionSection>

      {/* ── 2. FABRIC WEIGHT (GSM) ───────────────────────────────────────────── */}
      <AccordionSection
        title="FABRIC WEIGHT (GSM)"
        isOpen={openSections.includes("gsm")}
        onToggle={() => toggleSection("gsm")}
        activeCount={activeCounts.gsm}
      >
        {CLOTHING_GSM_WEIGHTS.map((gsm) => (
          <FilterCheckbox
            key={gsm.id}
            id={`gsm-${gsm.id}`}
            label={gsm.label}
            checked={filters.gsmWeights.includes(gsm.id)}
            onChange={() => onToggleGsm(gsm.id)}
            count={itemCounts?.gsmWeights?.[gsm.id]}
          />
        ))}
      </AccordionSection>

      {/* ── 3. SIZE IN-STOCK ─────────────────────────────────────────────────── */}
      <AccordionSection
        title="IN-STOCK SIZES"
        isOpen={openSections.includes("sizes")}
        onToggle={() => toggleSection("sizes")}
        activeCount={activeCounts.sizes}
      >
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {CLOTHING_AVAILABLE_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            const count = itemCounts?.sizes?.[size];
            return (
              <button
                key={size}
                type="button"
                onClick={() => onToggleSize(size)}
                title={`${size} (${count ?? 0} available)`}
                className={`h-8 flex flex-col items-center justify-center rounded-[2px] transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#111111] text-white font-bold shadow-xs scale-102"
                    : "bg-[#f4f2ee] text-[#555555] hover:bg-[#e8e8e5] hover:text-[#111111]"
                }`}
              >
                <span className="text-[11px] font-bold uppercase leading-none">
                  {size}
                </span>
                {count !== undefined && (
                  <span
                    className={`text-[8.5px] font-mono leading-none mt-0.5 ${
                      isSelected ? "text-neutral-300" : "text-[#8e8e8e]"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </AccordionSection>

      {/* ── 4. COLOR PALETTE ─────────────────────────────────────────────────── */}
      <AccordionSection
        title="COLORWAY"
        isOpen={openSections.includes("colors")}
        onToggle={() => toggleSection("colors")}
        activeCount={activeCounts.colors}
      >
        <div className="flex flex-col gap-1.5 pt-0.5">
          {CLOTHING_COLORS.map((col) => {
            const isChecked = filters.colors.includes(col.id);
            return (
              <label
                key={col.id}
                htmlFor={`color-${col.id}`}
                className="flex items-center justify-between gap-2.5 py-1 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-[13px] w-[13px] rounded-full border transition-all ${
                      isChecked
                        ? "border-[#111111] ring-2 ring-[#fcd017] scale-110"
                        : "border-[#d0d0cc] group-hover:border-[#111111]"
                    }`}
                    style={{ backgroundColor: col.hex }}
                    aria-label={`Color ${col.label}`}
                  />
                  <input
                    type="checkbox"
                    id={`color-${col.id}`}
                    checked={isChecked}
                    onChange={() => onToggleColor(col.id)}
                    className="sr-only"
                    aria-checked={isChecked}
                  />
                  <span
                    className={`font-luxury text-[11px] sm:text-[11.5px] uppercase tracking-[0.06em] leading-none transition-colors ${
                      isChecked
                        ? "font-medium text-[#111111]"
                        : "font-normal text-[#444444] group-hover:text-black"
                    }`}
                  >
                    {col.label}
                  </span>
                </div>
                {itemCounts?.colors?.[col.id] !== undefined && (
                  <span className="text-[10.5px] font-mono text-[#8e8e8e]">
                    ({itemCounts.colors[col.id]})
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </AccordionSection>

      {/* ── 5. PRICE RANGE ───────────────────────────────────────────────────── */}
      <AccordionSection
        title="PRICE"
        isOpen={openSections.includes("price")}
        onToggle={() => toggleSection("price")}
        activeCount={activeCounts.price}
      >
        <div className="flex flex-col gap-1">
          {CLOTHING_PRICE_RANGES.map((pr) => {
            const isSelected = filters.priceRange === pr.id;
            return (
              <label
                key={pr.id}
                htmlFor={`pr-${pr.id}`}
                className="flex items-center justify-between gap-2.5 py-1 cursor-pointer group select-none"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-[13px] w-[13px] rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#111111] bg-[#111111]"
                        : "border-[#cfcfcf] bg-white group-hover:border-[#111111]"
                    }`}
                  >
                    {isSelected && (
                      <div className="h-[5px] w-[5px] rounded-full bg-[#fcd017]" />
                    )}
                  </div>
                  <input
                    type="radio"
                    id={`pr-${pr.id}`}
                    name="clothingPriceRange"
                    checked={isSelected}
                    onChange={() => onSelectPriceRange(pr.id)}
                    className="sr-only"
                  />
                  <span
                    className={`font-luxury text-[11px] sm:text-[11.5px] uppercase tracking-[0.06em] leading-none transition-colors ${
                      isSelected
                        ? "font-medium text-[#111111]"
                        : "font-normal text-[#444444] group-hover:text-black"
                    }`}
                  >
                    {pr.label}
                  </span>
                </div>
                {itemCounts?.priceRanges?.[pr.id] !== undefined && (
                  <span className="text-[10.5px] font-mono text-[#8e8e8e]">
                    ({itemCounts.priceRanges[pr.id]})
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </AccordionSection>

      {/* ── 6. CURATIONS & DEALS ─────────────────────────────────────────────── */}
      <AccordionSection
        title="CURATIONS & OFFERS"
        isOpen={openSections.includes("curations")}
        onToggle={() => toggleSection("curations")}
        activeCount={activeCounts.curations}
      >
        {CLOTHING_CURATIONS.map((c) => (
          <FilterCheckbox
            key={c.id}
            id={`curation-${c.id}`}
            label={c.label}
            checked={filters.curations.includes(c.id)}
            onChange={() => onToggleCuration(c.id)}
            count={itemCounts?.curations?.[c.id]}
          />
        ))}
      </AccordionSection>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP STICKY SIDEBAR (Borderless, 220–240px wide) ─────────────── */}
      <aside
        aria-label="Clothing Category Filters"
        className="hidden lg:block w-[220px] xl:w-[240px] shrink-0 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain luxury-sidebar-scrollbar pr-3"
      >
        {filterContent}
      </aside>

      {/* ── MOBILE SLIDE-OVER DRAWER (< 1024px) ──────────────────────────────── */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 overscroll-contain touch-none"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Slide-over Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter T-Shirts"
            className="relative flex w-full max-w-xs flex-col bg-white text-[#111111] shadow-2xl z-10 animate-drawer-in h-[100dvh] max-h-[100dvh] overflow-hidden ml-auto overscroll-contain"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0ed] shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-luxury text-sm font-medium uppercase tracking-[0.1em] text-[#111111]">
                  FILTERS
                </span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-[#fcd017] text-[#111111] text-[10px] font-black rounded-[2px]">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 text-[#555555] hover:text-[#111111] transition-colors cursor-pointer"
                aria-label="Close filters"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filter List */}
            <div className="overflow-y-auto px-6 py-4 flex-1 min-h-0 overscroll-contain luxury-sidebar-scrollbar">
              {filterContent}
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="p-4 border-t border-[#f0f0ed] bg-[#fafaf8] flex items-center gap-3 shrink-0">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="px-4 py-2.5 border border-[#111111] text-xs font-bold uppercase tracking-wider text-[#111111] hover:bg-white rounded-[2px] transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex-1 py-2.5 bg-[#111111] hover:bg-[#222222] text-white text-xs font-bold uppercase tracking-[0.1em] rounded-[2px] transition-colors cursor-pointer text-center"
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
