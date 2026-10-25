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
  onOpenFitGuide?: () => void;
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
          className={`h-[13px] w-[13px] shrink-0 rounded-xs border transition-colors duration-150 flex items-center justify-center ${
            checked
              ? "bg-veyro-black border-veyro-black"
              : "border-neutral-200 bg-white group-hover:border-veyro-black"
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
              className="text-veyro-yellow"
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
          className={`font-luxury text-xs sm:text-[11.5px] uppercase tracking-[0.06em] leading-none transition-colors truncate ${
            checked
              ? "font-medium text-veyro-black"
              : "font-normal text-neutral-800 group-hover:text-black"
          }`}
        >
          {label}
        </span>
      </div>
      {count !== undefined && (
        <span className="text-[10.5px] font-mono text-veyro-subtle shrink-0">
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
  rightAction,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  activeCount?: number;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <div className="w-full flex items-center justify-between py-1.5">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex items-center gap-2.5 text-left cursor-pointer group transition-colors flex-1"
        >
          <ChevronDown
            size={13}
            strokeWidth={1.8}
            className={`text-veyro-black transition-transform duration-200 motion-reduce:transition-none shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
          <span className="font-luxury text-xs font-medium uppercase tracking-[0.08em] text-veyro-black group-hover:text-neutral-600 transition-colors">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="ml-2 text-2xs font-mono font-medium text-veyro-black bg-veyro-border-light px-1.5 py-0.5 rounded-sm">
              {activeCount}
            </span>
          )}
        </button>
        {rightAction && <div className="shrink-0">{rightAction}</div>}
      </div>

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
  onOpenFitGuide,
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
    <div className="flex flex-col text-veyro-black select-none">
      {/* ── HEADER ROW: FILTERS (Left) & CLEAR ALL (Right) ───────────────────── */}
      <div className="flex items-center justify-between pb-3 mb-1">
        <h2 className="font-luxury text-[13.5px] font-medium uppercase tracking-[0.08em] text-veyro-black">
          FILTERS
          {activeFilterCount > 0 && (
            <span className="ml-1.5 text-xs font-mono font-normal text-veyro-subtle">
              ({activeFilterCount})
            </span>
          )}
        </h2>

        <button
          type="button"
          onClick={activeFilterCount > 0 ? onClearAll : undefined}
          disabled={activeFilterCount === 0}
          className={`group relative font-luxury text-xs font-medium uppercase tracking-[0.06em] transition-colors ${
            activeFilterCount > 0
              ? "text-veyro-black cursor-pointer"
              : "text-neutral-400 cursor-default"
          }`}
          aria-label="Clear all applied filters"
        >
          CLEAR ALL
          {activeFilterCount > 0 && (
            <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-veyro-black origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100" />
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
                className={`h-8 flex flex-col items-center justify-center rounded-sm transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-veyro-black text-white font-bold shadow-xs scale-102"
                    : "bg-veyro-surface-alt text-neutral-600 hover:bg-veyro-border hover:text-veyro-black"
                }`}
              >
                <span className="text-xs font-bold uppercase leading-none">
                  {size}
                </span>
                {count !== undefined && (
                  <span
                    className={`text-[8.5px] font-mono leading-none mt-0.5 ${
                      isSelected ? "text-neutral-300" : "text-veyro-subtle"
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
                    className={`h-[13px] w-[13px] rounded-full border transition-colors ${
                      isChecked
                        ? "border-veyro-black ring-2 ring-veyro-yellow scale-110"
                        : "border-neutral-300 group-hover:border-veyro-black"
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
                    className={`font-luxury text-xs sm:text-[11.5px] uppercase tracking-[0.06em] leading-none transition-colors ${
                      isChecked
                        ? "font-medium text-veyro-black"
                        : "font-normal text-neutral-800 group-hover:text-black"
                    }`}
                  >
                    {col.label}
                  </span>
                </div>
                {itemCounts?.colors?.[col.id] !== undefined && (
                  <span className="text-[10.5px] font-mono text-veyro-subtle">
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
                    className={`h-[13px] w-[13px] rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-veyro-black bg-veyro-black"
                        : "border-neutral-200 bg-white group-hover:border-veyro-black"
                    }`}
                  >
                    {isSelected && (
                      <div className="h-[5px] w-[5px] rounded-full bg-veyro-yellow" />
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
                    className={`font-luxury text-xs sm:text-[11.5px] uppercase tracking-[0.06em] leading-none transition-colors ${
                      isSelected
                        ? "font-medium text-veyro-black"
                        : "font-normal text-neutral-800 group-hover:text-black"
                    }`}
                  >
                    {pr.label}
                  </span>
                </div>
                {itemCounts?.priceRanges?.[pr.id] !== undefined && (
                  <span className="text-[10.5px] font-mono text-veyro-subtle">
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
            className="relative flex w-full max-w-xs flex-col bg-white text-veyro-black shadow-2xl z-10 animate-drawer-in h-[100dvh] max-h-[100dvh] overflow-hidden ml-auto overscroll-contain"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-veyro-border-light shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-luxury text-sm font-medium uppercase tracking-[0.1em] text-veyro-black">
                  FILTERS
                </span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-veyro-yellow text-veyro-black text-2xs font-black rounded-sm">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 text-neutral-600 hover:text-veyro-black transition-colors cursor-pointer"
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
            <div className="p-4 border-t border-veyro-border-light bg-veyro-surface-alt flex items-center gap-3 shrink-0">
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={onClearAll}
                  className="px-4 py-2.5 border border-veyro-black text-xs font-bold uppercase tracking-wider text-veyro-black hover:bg-white rounded-sm transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex-1 py-2.5 bg-veyro-black hover:bg-neutral-900 text-white text-xs font-bold uppercase tracking-[0.1em] rounded-sm transition-colors cursor-pointer text-center"
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
