"use client";

import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";

export interface WatchFilterState {
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

export const WATCH_COLLECTIONS = [
  { id: "Chronograph", label: "Chronograph" },
  { id: "Automatic", label: "Automatic" },
  { id: "Field Watch", label: "Field Watch" },
  { id: "Diver", label: "Diver" },
  { id: "Minimalist", label: "Minimalist" },
];

export const WATCH_MOVEMENTS = [
  { id: "Automatic", label: "Automatic Mechanical", hint: "Self-winding calibre" },
  { id: "Quartz", label: "Meca-Quartz / Hybrid", hint: "High-precision split" },
  { id: "Solar", label: "Solar Photovoltaic", hint: "Light-powered reserve" },
];

export const WATCH_GENDERS = [
  { id: "Men", label: "Men" },
  { id: "Unisex", label: "Unisex" },
];

export const WATCH_PRICE_RANGES = [
  { id: "ALL", label: "All Prices" },
  { id: "UNDER_5K", label: "Under ₹5,000" },
  { id: "5K_TO_8K", label: "₹5,000 – ₹7,999" },
  { id: "ABOVE_8K", label: "₹8,000 & Above" },
];

export const WATCH_DISCOUNTS = [
  { id: "15", label: "15% & Above" },
  { id: "20", label: "20% & Above" },
  { id: "25", label: "25% & Above" },
];

export const WATCH_CASE_SIZES = [
  { id: "38mm", label: "38mm" },
  { id: "40mm", label: "40mm" },
  { id: "42mm", label: "42mm" },
];

export const WATCH_COLORS = [
  { id: "black", label: "Matte Black", hex: "#1a1a1a" },
  { id: "silver", label: "Brushed Steel / Silver", hex: "#d8d8d8" },
  { id: "gold", label: "Champagne / Gold", hex: "#c2b280" },
  { id: "navy", label: "Deep Navy", hex: "#1a2938" },
  { id: "green", label: "Emerald Green", hex: "#1b4d3e" },
  { id: "titanium", label: "Olive / Titanium", hex: "#525b44" },
];

export const WATCH_DIAL_TYPES = [
  { id: "Minimalist", label: "Minimalist" },
  { id: "Chronograph", label: "Chronograph" },
  { id: "Field", label: "Field" },
];

export const WATCH_STRAPS = [
  { id: "Full-Grain Leather", label: "Italian Full-Grain Leather" },
  { id: "Milanese Mesh Steel", label: "Milanese Mesh / Steel" },
  { id: "Silicone", label: "FKM Fluororubber / Silicone" },
  { id: "NATO Canvas", label: "Ballistic Cordura NATO" },
];

// ── Minimalist Checkbox Control ─────────────────────────────────────────────
function FilterCheckbox({
  id,
  label,
  sublabel,
  checked,
  onChange,
  count,
}: {
  id: string;
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label
      htmlFor={`cb-${id}`}
      className="flex items-start justify-between gap-2.5 py-1.5 cursor-pointer group select-none"
    >
      <div className="flex items-start gap-2.5 min-w-0">
        <div
          className={`mt-0.5 h-[14px] w-[14px] shrink-0 rounded-[2px] border transition-all duration-150 flex items-center justify-center ${
            checked
              ? "bg-[#111111] border-[#111111] ring-1 ring-[#fcd017]"
              : "border-[#bbbbbb] bg-white group-hover:border-[#111111]"
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
        <div className="flex flex-col">
          <span
            className={`text-[12.5px] leading-tight transition-colors ${
              checked
                ? "font-bold text-[#111111]"
                : "font-normal text-[#333333] group-hover:text-[#111111]"
            }`}
          >
            {label}
          </span>
          {sublabel && (
            <span className="text-[10px] text-[#8e8e8e] font-mono leading-none mt-0.5">
              {sublabel}
            </span>
          )}
        </div>
      </div>
      {count !== undefined && (
        <span className="text-[11px] font-mono text-[#8e8e8e] shrink-0 pt-0.5">
          ({count})
        </span>
      )}
    </label>
  );
}

// ── Accordion Section with Left Chevron ─────────────────────────────────────
function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#f0f0ed] py-2.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center gap-2.5 py-1 text-left cursor-pointer group transition-colors"
      >
        {/* Left-Aligned Chevron (rotates 180° when expanded) */}
        <ChevronDown
          size={14}
          strokeWidth={2.5}
          className={`text-[#111111] transition-transform duration-200 motion-reduce:transition-none shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
        <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#111111] group-hover:text-[#555555] transition-colors">
          {title}
        </span>
      </button>

      {isOpen && <div className="pt-2.5 pb-1 pl-6 flex flex-col gap-0.5">{children}</div>}
    </div>
  );
}

export function WatchFilterSidebar({
  filters,
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
  // Accordion open/collapse states matching the exact order from spec
  const [openSections, setOpenSections] = useState({
    collection: true,
    movement: true,
    gender: true,
    price: true,
    discount: false,
    caseShape: false,
    dialColor: true,
    dialType: false,
    strap: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filterContent = (
    <div className="flex flex-col text-[#111111] select-none">
      {/* ── HEADER ROW: FILTERS (Left) & CLEAR ALL (Right) ──────────── */}
      <div className="flex items-center justify-between pb-3 mb-1 border-b border-[#111111]">
        <h2 className="text-[13px] font-black uppercase tracking-[0.14em] text-[#111111]">
          FILTERS
          {activeFilterCount > 0 && (
            <span className="ml-1.5 text-[11px] font-mono font-normal text-[#8e8e8e]">
              ({activeFilterCount})
            </span>
          )}
        </h2>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-[11px] font-bold text-[#8e8e8e] hover:text-[#111111] hover:underline uppercase tracking-wider transition-colors cursor-pointer"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* ── 1. COLLECTION ───────────────────────────────────────────── */}
      <AccordionSection
        title="COLLECTION"
        isOpen={openSections.collection}
        onToggle={() => toggleSection("collection")}
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

      {/* ── 2. MOVEMENT ─────────────────────────────────────────────── */}
      <AccordionSection
        title="MOVEMENT"
        isOpen={openSections.movement}
        onToggle={() => toggleSection("movement")}
      >
        {WATCH_MOVEMENTS.map((m) => (
          <FilterCheckbox
            key={m.id}
            id={`mov-${m.id}`}
            label={m.label}
            sublabel={m.hint}
            checked={filters.movements.includes(m.id)}
            onChange={() => onToggleMovement(m.id)}
            count={itemCounts?.movements?.[m.id]}
          />
        ))}
      </AccordionSection>

      {/* ── 3. GENDER ───────────────────────────────────────────────── */}
      <AccordionSection
        title="GENDER"
        isOpen={openSections.gender}
        onToggle={() => toggleSection("gender")}
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

      {/* ── 4. PRICE ────────────────────────────────────────────────── */}
      <AccordionSection
        title="PRICE"
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
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
                    className={`h-[14px] w-[14px] rounded-full border flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-[#111111] bg-[#111111] ring-1 ring-[#fcd017]"
                        : "border-[#bbbbbb] bg-white group-hover:border-[#111111]"
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
                    className={`text-[12.5px] leading-tight transition-colors ${
                      isSelected
                        ? "font-bold text-[#111111]"
                        : "font-normal text-[#333333] group-hover:text-[#111111]"
                    }`}
                  >
                    {pr.label}
                  </span>
                </div>
                {itemCounts?.priceRanges?.[pr.id] !== undefined && (
                  <span className="text-[11px] font-mono text-[#8e8e8e]">
                    ({itemCounts.priceRanges[pr.id]})
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </AccordionSection>

      {/* ── 5. DISCOUNT ─────────────────────────────────────────────── */}
      <AccordionSection
        title="DISCOUNT"
        isOpen={openSections.discount}
        onToggle={() => toggleSection("discount")}
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

      {/* ── 6. CASE SHAPE / DIAMETER ─────────────────────────────────── */}
      <AccordionSection
        title="CASE SHAPE"
        isOpen={openSections.caseShape}
        onToggle={() => toggleSection("caseShape")}
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

      {/* ── 7. DIAL COLOR ───────────────────────────────────────────── */}
      <AccordionSection
        title="DIAL COLOR"
        isOpen={openSections.dialColor}
        onToggle={() => toggleSection("dialColor")}
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
                    className={`h-[15px] w-[15px] rounded-full border transition-all ${
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
                    className={`text-[12.5px] leading-tight transition-colors ${
                      isChecked
                        ? "font-bold text-[#111111]"
                        : "font-normal text-[#333333] group-hover:text-[#111111]"
                    }`}
                  >
                    {col.label}
                  </span>
                </div>
                {itemCounts?.colors?.[col.id] !== undefined && (
                  <span className="text-[11px] font-mono text-[#8e8e8e]">
                    ({itemCounts.colors[col.id]})
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </AccordionSection>

      {/* ── 8. DIAL TYPE ────────────────────────────────────────────── */}
      <AccordionSection
        title="DIAL TYPE"
        isOpen={openSections.dialType}
        onToggle={() => toggleSection("dialType")}
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

      {/* ── 9. STRAP MATERIAL ───────────────────────────────────────── */}
      <AccordionSection
        title="STRAP MATERIAL"
        isOpen={openSections.strap}
        onToggle={() => toggleSection("strap")}
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
      {/* ── DESKTOP STICKY SIDEBAR (Borderless, 240–260px wide, blends with page) ── */}
      <aside
        aria-label="Watches Category Filters"
        className="hidden lg:block w-[240px] xl:w-[260px] shrink-0 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain no-scrollbar pr-4"
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
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#111111]">
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
