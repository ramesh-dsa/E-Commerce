"use client";

import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

export interface WatchFilterState {
  brands?: string[];
  collections: string[];
  movements: string[];
  genders: string[];
  priceRange: string;
  discounts: string[];
  caseSizes: string[];
  colors: string[];
  dialTypes: string[];
  straps: string[];
}

export interface WatchFilterSidebarProps {
  filters: WatchFilterState;
  onToggleBrand?: (brand: string) => void;
  onToggleCollection: (collection: string) => void;
  onToggleMovement: (movement: string) => void;
  onToggleGender: (gender: string) => void;
  onSelectPriceRange: (range: string) => void;
  onToggleDiscount: (discount: string) => void;
  onToggleCaseSize: (size: string) => void;
  onToggleColor: (colorKey: string) => void;
  onToggleDialType: (dialType: string) => void;
  onToggleStrap: (strap: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
  itemCounts?: {
    brands?: Record<string, number>;
    collections?: Record<string, number>;
    movements?: Record<string, number>;
    genders?: Record<string, number>;
    priceRanges?: Record<string, number>;
    discounts?: Record<string, number>;
    caseSizes?: Record<string, number>;
    colors?: Record<string, number>;
    dialTypes?: Record<string, number>;
    straps?: Record<string, number>;
  };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const WATCH_BRANDS = [
  { id: "VEYRO HOROLOGY", label: "VEYRO HOROLOGY" },
  { id: "ARCHIVAL VAULT", label: "ARCHIVAL VAULT" },
  { id: "ATELIER SPECIALTY", label: "ATELIER SPECIALTY" },
];

export const WATCH_COLLECTIONS = [
  { id: "Chronograph", label: "CHRONOGRAPH" },
  { id: "Automatic", label: "AUTOMATIC" },
  { id: "Field Watch", label: "FIELD WATCH" },
  { id: "Diver", label: "DIVER" },
  { id: "Minimalist", label: "MINIMALIST" },
];

export const WATCH_MOVEMENTS = [
  { id: "Automatic", label: "AUTOMATIC" },
  { id: "Quartz", label: "QUARTZ" },
  { id: "Solar", label: "SOLAR" },
];

export const WATCH_GENDERS = [
  { id: "Men", label: "MEN" },
  { id: "Unisex", label: "UNISEX" },
];

export const WATCH_PRICE_RANGES = [
  { id: "ALL", label: "ALL PRICES" },
  { id: "UNDER_5K", label: "UNDER ₹5,000" },
  { id: "5K_TO_8K", label: "₹5,000 – ₹7,999" },
  { id: "ABOVE_8K", label: "₹8,000 & ABOVE" },
];

export const WATCH_DISCOUNTS = [
  { id: "15", label: "15% & ABOVE" },
  { id: "20", label: "20% & ABOVE" },
  { id: "25", label: "25% & ABOVE" },
];

export const WATCH_CASE_SIZES = [
  { id: "38mm", label: "38MM" },
  { id: "40mm", label: "40MM" },
  { id: "42mm", label: "42MM" },
];

export const WATCH_COLORS = [
  { id: "black", label: "MATTE BLACK", hex: "#1a1a1a" },
  { id: "silver", label: "BRUSHED STEEL / SILVER", hex: "#d8d8d8" },
  { id: "gold", label: "CHAMPAGNE / GOLD", hex: "#c2b280" },
  { id: "navy", label: "DEEP NAVY", hex: "#1a2938" },
  { id: "green", label: "EMERALD GREEN", hex: "#1b4d3e" },
  { id: "titanium", label: "OLIVE / TITANIUM", hex: "#525b44" },
];

export const WATCH_DIAL_TYPES = [
  { id: "Minimalist", label: "MINIMALIST" },
  { id: "Chronograph", label: "CHRONOGRAPH" },
  { id: "Field", label: "FIELD" },
];

export const WATCH_STRAPS = [
  { id: "Full-Grain Leather", label: "ITALIAN FULL-GRAIN LEATHER" },
  { id: "Milanese Mesh Steel", label: "MILANESE MESH / STEEL" },
  { id: "Silicone", label: "FKM SILICONE" },
  { id: "NATO Canvas", label: "BALLISTIC CORDURA NATO" },
];

// ── Minimalist Helios-Style Checkbox Control ──────────────────────────────────
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

// ── Accordion Section with Left Chevron (Image 2 Elegant Style) ────────────────
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
        {/* Left-Aligned Chevron (rotates 180° when expanded, clean thin stroke) */}
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

type SectionKey =
  | "brands"
  | "collection"
  | "movement"
  | "gender"
  | "price"
  | "discount"
  | "caseShape"
  | "dialColor"
  | "dialType"
  | "strap";

export function WatchFilterSidebar({
  filters,
  onToggleBrand,
  onToggleCollection,
  onToggleMovement,
  onToggleGender,
  onSelectPriceRange,
  onToggleDiscount,
  onToggleCaseSize,
  onToggleColor,
  onToggleDialType,
  onToggleStrap,
  onClearAll,
  activeFilterCount,
  totalFilteredCount,
  itemCounts,
  isMobileOpen = false,
  onCloseMobile,
}: WatchFilterSidebarProps) {
  // Count active selections per section to protect them during auto-collapse
  const activeCounts: Record<SectionKey, number> = {
    brands: filters.brands?.length || 0,
    collection: filters.collections.length,
    movement: filters.movements.length,
    gender: filters.genders.length,
    price: filters.priceRange ? 1 : 0,
    discount: filters.discounts.length,
    caseShape: filters.caseSizes.length,
    dialColor: filters.colors.length,
    dialType: filters.dialTypes.length,
    strap: filters.straps.length,
  };

  // Max 3 Open Accordions Queue (Auto-Collapse / Smart Mutex)
  const MAX_OPEN = 3;
  const [openSections, setOpenSections] = useState<SectionKey[]>([
    "brands",
    "collection",
    "price",
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
      {/* ── HEADER ROW: FILTERS (Left) & CLEAR ALL (Right) — Zero Underline ──── */}
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
          className={`font-luxury text-[11px] font-medium uppercase tracking-[0.06em] transition-colors ${
            activeFilterCount > 0
              ? "text-[#111111] hover:underline cursor-pointer"
              : "text-[#c2c2c2] cursor-default"
          }`}
          aria-label="Clear all applied filters"
        >
          CLEAR ALL
        </button>
      </div>

      {/* ── 1. BRANDS (Image 2 First Item) ─────────────────────────── */}
      <AccordionSection
        title="BRANDS"
        isOpen={openSections.includes("brands")}
        onToggle={() => toggleSection("brands")}
        activeCount={activeCounts.brands}
      >
        {WATCH_BRANDS.map((b) => (
          <FilterCheckbox
            key={b.id}
            id={`brand-${b.id}`}
            label={b.label}
            checked={(filters.brands || []).includes(b.id)}
            onChange={() => onToggleBrand?.(b.id)}
            count={itemCounts?.brands?.[b.id] ?? totalFilteredCount}
          />
        ))}
      </AccordionSection>

      {/* ── 2. COLLECTION ───────────────────────────────────────────── */}
      <AccordionSection
        title="COLLECTION"
        isOpen={openSections.includes("collection")}
        onToggle={() => toggleSection("collection")}
        activeCount={activeCounts.collection}
      >
        {WATCH_COLLECTIONS.map((c) => (
          <FilterCheckbox
            key={c.id}
            id={`col-${c.id}`}
            label={c.label}
            checked={filters.collections.includes(c.id)}
            onChange={() => onToggleCollection(c.id)}
            count={itemCounts?.collections?.[c.id]}
          />
        ))}
      </AccordionSection>

      {/* ── 3. MOVEMENT ─────────────────────────────────────────────── */}
      <AccordionSection
        title="MOVEMENT"
        isOpen={openSections.includes("movement")}
        onToggle={() => toggleSection("movement")}
        activeCount={activeCounts.movement}
      >
        {WATCH_MOVEMENTS.map((m) => (
          <FilterCheckbox
            key={m.id}
            id={`mov-${m.id}`}
            label={m.label}
            checked={filters.movements.includes(m.id)}
            onChange={() => onToggleMovement(m.id)}
            count={itemCounts?.movements?.[m.id]}
          />
        ))}
      </AccordionSection>

      {/* ── 4. GENDER ───────────────────────────────────────────────── */}
      <AccordionSection
        title="GENDER"
        isOpen={openSections.includes("gender")}
        onToggle={() => toggleSection("gender")}
        activeCount={activeCounts.gender}
      >
        {WATCH_GENDERS.map((g) => (
          <FilterCheckbox
            key={g.id}
            id={`gen-${g.id}`}
            label={g.label}
            checked={filters.genders.includes(g.id)}
            onChange={() => onToggleGender(g.id)}
            count={itemCounts?.genders?.[g.id]}
          />
        ))}
      </AccordionSection>

      {/* ── 5. PRICE ────────────────────────────────────────────────── */}
      <AccordionSection
        title="PRICE"
        isOpen={openSections.includes("price")}
        onToggle={() => toggleSection("price")}
        activeCount={activeCounts.price}
      >
        <div className="flex flex-col gap-1.5">
          {WATCH_PRICE_RANGES.map((pr) => {
            const isSelected = filters.priceRange === pr.id;
            return (
              <label
                key={pr.id}
                htmlFor={`price-${pr.id}`}
                className="flex items-center justify-between gap-2.5 py-1 cursor-pointer group"
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
                      <span className="h-[4.5px] w-[4.5px] rounded-full bg-[#fcd017]" />
                    )}
                  </div>
                  <input
                    type="radio"
                    id={`price-${pr.id}`}
                    name="watch-price"
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

      {/* ── 6. DISCOUNT ─────────────────────────────────────────────── */}
      <AccordionSection
        title="DISCOUNT"
        isOpen={openSections.includes("discount")}
        onToggle={() => toggleSection("discount")}
        activeCount={activeCounts.discount}
      >
        {WATCH_DISCOUNTS.map((d) => (
          <FilterCheckbox
            key={d.id}
            id={`disc-${d.id}`}
            label={d.label}
            checked={filters.discounts.includes(d.id)}
            onChange={() => onToggleDiscount(d.id)}
            count={itemCounts?.discounts?.[d.id]}
          />
        ))}
      </AccordionSection>

      {/* ── 7. CASE SHAPE / DIAMETER ─────────────────────────────────── */}
      <AccordionSection
        title="CASE SHAPE"
        isOpen={openSections.includes("caseShape")}
        onToggle={() => toggleSection("caseShape")}
        activeCount={activeCounts.caseShape}
      >
        {WATCH_CASE_SIZES.map((cs) => (
          <FilterCheckbox
            key={cs.id}
            id={`case-${cs.id}`}
            label={cs.label}
            checked={filters.caseSizes.includes(cs.id)}
            onChange={() => onToggleCaseSize(cs.id)}
            count={itemCounts?.caseSizes?.[cs.id]}
          />
        ))}
      </AccordionSection>

      {/* ── 8. DIAL COLOR ───────────────────────────────────────────── */}
      <AccordionSection
        title="DIAL COLOR"
        isOpen={openSections.includes("dialColor")}
        onToggle={() => toggleSection("dialColor")}
        activeCount={activeCounts.dialColor}
      >
        <div className="flex flex-col gap-1.5">
          {WATCH_COLORS.map((col) => {
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
                    aria-label={`Dial color ${col.label}`}
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

      {/* ── 9. DIAL TYPE ────────────────────────────────────────────── */}
      <AccordionSection
        title="DIAL TYPE"
        isOpen={openSections.includes("dialType")}
        onToggle={() => toggleSection("dialType")}
        activeCount={activeCounts.dialType}
      >
        {WATCH_DIAL_TYPES.map((dt) => (
          <FilterCheckbox
            key={dt.id}
            id={`dial-${dt.id}`}
            label={dt.label}
            checked={filters.dialTypes.includes(dt.id)}
            onChange={() => onToggleDialType(dt.id)}
            count={itemCounts?.dialTypes?.[dt.id]}
          />
        ))}
      </AccordionSection>

      {/* ── 10. STRAP MATERIAL ──────────────────────────────────────── */}
      <AccordionSection
        title="STRAP MATERIAL"
        isOpen={openSections.includes("strap")}
        onToggle={() => toggleSection("strap")}
        activeCount={activeCounts.strap}
      >
        {WATCH_STRAPS.map((strap) => (
          <FilterCheckbox
            key={strap.id}
            id={`strap-${strap.id}`}
            label={strap.label}
            checked={filters.straps.includes(strap.id)}
            onChange={() => onToggleStrap(strap.id)}
            count={itemCounts?.straps?.[strap.id]}
          />
        ))}
      </AccordionSection>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP STICKY SIDEBAR (Borderless, 220–240px wide, blends with page) ── */}
      <aside
        aria-label="Watches Category Filters"
        className="hidden lg:block w-[220px] xl:w-[240px] shrink-0 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain luxury-sidebar-scrollbar pr-3"
      >
        {filterContent}
      </aside>

      {/* ── MOBILE SLIDE-OVER DRAWER (< 1024px) ────────────────────────── */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Slide-over Panel */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter Timepieces"
            className="relative flex w-full max-w-xs flex-col bg-white text-[#111111] shadow-2xl z-10 animate-drawer-in h-full overflow-hidden ml-auto"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0f0ed]">
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
            <div className="overflow-y-auto px-6 py-4 flex-1">
              {filterContent}
            </div>

            {/* Fixed Bottom Action Bar */}
            <div className="p-4 border-t border-[#f0f0ed] bg-[#fafaf8] flex items-center gap-3">
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
                Show {totalFilteredCount} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
