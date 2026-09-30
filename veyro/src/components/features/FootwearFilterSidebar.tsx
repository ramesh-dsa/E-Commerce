"use client";

import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  ChevronDown,
  X,
  Ruler,
  Palette,
  Tag,
  Layers,
  Info,
} from "lucide-react";

export interface FootwearFilterState {
  silhouettes: string[];
  soles: string[];
  sizes: string[];
  colors: string[];
  priceMin: number;
  priceMax: number;
  priceRange?: string; // backwards compatibility
}

export interface FootwearFilterSidebarProps {
  filters: FootwearFilterState;
  onToggleSilhouette: (silhouette: string) => void;
  onToggleSole: (sole: string) => void;
  onToggleSize: (size: string) => void;
  onToggleColor: (colorKey: string) => void;
  onChangePriceRange: (min: number, max: number, isFinal?: boolean) => void;
  onClearAll: () => void;
  onOpenSizeGuide: () => void;
  activeFilterCount: number;
  totalFilteredCount: number;
  itemCounts?: {
    silhouettes?: Record<string, number>;
    soles?: Record<string, number>;
    sizes?: Record<string, number>;
    colors?: Record<string, number>;
  };
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  productPrices?: number[];
}

// ── Constants ────────────────────────────────────────────────────────────────
export const FOOTWEAR_PRICE_MIN = 2000;
export const FOOTWEAR_PRICE_MAX = 4000;
export const FOOTWEAR_PRICE_STEP = 100;
const PRICE_MIN = FOOTWEAR_PRICE_MIN;
const PRICE_MAX = FOOTWEAR_PRICE_MAX;
const PRICE_STEP = FOOTWEAR_PRICE_STEP;

// ── Filter Data ──────────────────────────────────────────────────────────────
export const FOOTWEAR_SILHOUETTES = [
  { id: "Minimal", label: "Minimal Court Lows", defaultCount: 4, image: "/images/filter/sil-minimal.webp" },
  { id: "Retro", label: "Retro Vintage Runners", defaultCount: 3, image: "/images/filter/sil-retro.webp" },
  { id: "Chunky", label: "Chunky Platforms", defaultCount: 2, image: "/images/filter/sil-chunky.webp" },
  { id: "HighTop", label: "High Tops", defaultCount: 6, image: "/images/filter/sil-hightop.webp" },
];

export const FOOTWEAR_SOLES = [
  { id: "VULCANIZED", label: "Vulcanized Rubber", defaultCount: 2, image: "/images/filter/sole-vulcanized.webp" },
  { id: "CUPSOLE", label: "Rubber Cupsoles", defaultCount: 2, image: "/images/filter/sole-cupsole.webp" },
  { id: "SUEDE", label: "Suede & Nubuck", defaultCount: 5, image: "/images/filter/sole-suede.webp" },
  { id: "LEATHER", label: "Full-Grain Leather", defaultCount: 6, image: "/images/filter/sole-leather.webp" },
  { id: "EVA", label: "Chunky EVA Outsoles", defaultCount: 3, image: "/images/filter/sole-eva.webp" },
];

export const FOOTWEAR_SIZES = [
  { size: "UK 6", count: 9 },
  { size: "UK 7", count: 9 },
  { size: "UK 8", count: 9 },
  { size: "UK 9", count: 9 },
  { size: "UK 10", count: 9 },
  { size: "UK 11", count: 9 },
];

export const FOOTWEAR_COLORS = [
  { id: "black", name: "Black", hex: "#111111", border: false, matches: ["black", "core black", "onyx"] },
  { id: "white", name: "White", hex: "#FFFFFF", border: true, matches: ["white", "triple white", "chalk", "off-white"] },
  { id: "grey", name: "Light Grey", hex: "#B8B8B8", border: false, matches: ["grey", "light grey", "fog"] },
  { id: "sand", name: "Clay Tan", hex: "#D5C4AF", border: false, matches: ["clay", "sand", "tan", "gum"] },
  { id: "olive", name: "Olive", hex: "#4A583A", border: false, matches: ["green", "olive", "forest"] },
  { id: "red", name: "Burgundy", hex: "#8B1E1E", border: false, matches: ["burgundy", "red"] },
  { id: "blue", name: "Deep Navy", hex: "#1E2A3A", border: false, matches: ["navy", "blue"] },
  { id: "brown", name: "Cognac", hex: "#8B4E26", border: false, matches: ["brown", "cognac"] },
];

export const FOOTWEAR_PRICE_RANGES = [
  { id: "ALL", label: "ALL PRICES" },
  { id: "UNDER_2800", label: "UNDER ₹2,800" },
  { id: "2800_TO_3299", label: "₹2,800 – ₹3,299" },
  { id: "ABOVE_3300", label: "₹3,300 & ABOVE" },
];

// ── Snap value to step grid ──────────────────────────────────────────────────
function snapToStep(value: number): number {
  return Math.round(value / PRICE_STEP) * PRICE_STEP;
}
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
function toPercent(value: number): number {
  return ((value - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ── Luxury Dual-Thumb Price Slider with Histogram & Micro-Animations ───────────
// ═══════════════════════════════════════════════════════════════════════════════
const PRESET_RANGES = [
  { id: "all", label: "All", min: PRICE_MIN, max: PRICE_MAX },
  { id: "under-2800", label: "< ₹2.8K", min: PRICE_MIN, max: 2800 },
  { id: "mid", label: "₹2.8–3.3K", min: 2800, max: 3300 },
  { id: "above-3300", label: "₹3.3K+", min: 3300, max: PRICE_MAX },
];

const THUMB_SIZE = 20; // 20px thumb diameter
const INSET = 11; // 11px inset so thumbs NEVER clip past container edges

function DualPriceSlider({
  minValue,
  maxValue,
  onChange,
  productPrices,
}: {
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number, isFinal?: boolean) => void;
  productPrices?: number[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"min" | "max" | null>(null);

  // Local state for 60fps fluid visual feedback while dragging
  const [localMin, setLocalMin] = useState(clamp(minValue, PRICE_MIN, PRICE_MAX));
  const [localMax, setLocalMax] = useState(clamp(maxValue, PRICE_MIN, PRICE_MAX));
  const [hoveredThumb, setHoveredThumb] = useState<"min" | "max" | null>(null);
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep local state in sync when external filters change (e.g. Clear All)
  useEffect(() => {
    if (!draggingRef.current) {
      setLocalMin(clamp(minValue, PRICE_MIN, PRICE_MAX));
      setLocalMax(clamp(maxValue, PRICE_MIN, PRICE_MAX));
    }
  }, [minValue, maxValue]);

  // ── Histogram Data Calculation (Smooth 26-bar Density Wave) ────────────────
  const HISTO_BINS = 26;
  const binStep = (PRICE_MAX - PRICE_MIN) / HISTO_BINS;
  const bins = useMemo(() => {
    const prices =
      productPrices && productPrices.length > 0
        ? productPrices
        : [2499, 2499, 2699, 2799, 2799, 2899, 3199, 3299, 3499, 3699];

    // Kernel density estimation across 26 points for an organic audio-wave contour
    const raw = Array.from({ length: HISTO_BINS }, (_, i) => {
      const center = PRICE_MIN + (i + 0.5) * binStep;
      let density = 0;
      prices.forEach((p) => {
        const diff = (center - p) / 160;
        density += Math.exp(-0.5 * diff * diff);
      });
      return { center, density };
    });

    const maxDensity = Math.max(0.1, ...raw.map((b) => b.density));
    return raw.map((b) => ({
      center: b.center,
      heightPx: Math.max(4, Math.round(4 + (b.density / maxDensity) * 22)),
    }));
  }, [productPrices, binStep]);

  // ── Value Commit Handler (Debounced during drag, immediate on release) ─────
  const commitValue = useCallback(
    (min: number, max: number, immediate = false) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (immediate) {
        onChange(min, max, true);
      } else {
        debounceRef.current = setTimeout(() => {
          onChange(min, max, false);
        }, 120);
      }
    },
    [onChange]
  );

  const getValueFromPointer = useCallback((clientX: number): number => {
    if (!trackRef.current) return PRICE_MIN;
    const rect = trackRef.current.getBoundingClientRect();
    const usableWidth = rect.width - INSET * 2;
    if (usableWidth <= 0) return PRICE_MIN;
    const ratio = clamp((clientX - (rect.left + INSET)) / usableWidth, 0, 1);
    return snapToStep(PRICE_MIN + ratio * (PRICE_MAX - PRICE_MIN));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const val = getValueFromPointer(e.clientX);
      // Grab whichever thumb is closest
      const distMin = Math.abs(val - localMin);
      const distMax = Math.abs(val - localMax);
      const thumb = distMin <= distMax ? "min" : "max";
      draggingRef.current = thumb;
      setIsDragging(thumb);

      if (thumb === "min") {
        const newMin = clamp(val, PRICE_MIN, localMax - PRICE_STEP);
        setLocalMin(newMin);
        commitValue(newMin, localMax, false);
      } else {
        const newMax = clamp(val, localMin + PRICE_STEP, PRICE_MAX);
        setLocalMax(newMax);
        commitValue(localMin, newMax, false);
      }

      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getValueFromPointer, localMin, localMax, commitValue]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return;
      const val = getValueFromPointer(e.clientX);

      if (draggingRef.current === "min") {
        const newMin = clamp(val, PRICE_MIN, localMax - PRICE_STEP);
        setLocalMin(newMin);
        commitValue(newMin, localMax, false);
      } else {
        const newMax = clamp(val, localMin + PRICE_STEP, PRICE_MAX);
        setLocalMax(newMax);
        commitValue(localMin, newMax, false);
      }
    },
    [getValueFromPointer, localMin, localMax, commitValue]
  );

  const handlePointerUp = useCallback(() => {
    if (draggingRef.current) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      commitValue(localMin, localMax, true);
    }
    draggingRef.current = null;
    setIsDragging(null);
  }, [commitValue, localMin, localMax]);

  const applyPreset = (min: number, max: number) => {
    setLocalMin(min);
    setLocalMax(max);
    commitValue(min, max, true);
  };

  // Keyboard navigation
  const handleKeyDownMin = (e: React.KeyboardEvent) => {
    let next = localMin;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(localMax - PRICE_STEP, localMin + PRICE_STEP);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(PRICE_MIN, localMin - PRICE_STEP);
    else if (e.key === "Home") next = PRICE_MIN;
    else if (e.key === "End") next = localMax - PRICE_STEP;
    else return;
    e.preventDefault();
    setLocalMin(next);
    commitValue(next, localMax, true);
  };

  const handleKeyDownMax = (e: React.KeyboardEvent) => {
    let next = localMax;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(PRICE_MAX, localMax + PRICE_STEP);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(localMin + PRICE_STEP, localMax - PRICE_STEP);
    else if (e.key === "Home") next = localMin + PRICE_STEP;
    else if (e.key === "End") next = PRICE_MAX;
    else return;
    e.preventDefault();
    setLocalMax(next);
    commitValue(localMin, next, true);
  };

  const leftPct = clamp(toPercent(localMin), 0, 100);
  const rightPct = clamp(toPercent(localMax), 0, 100);

  // Exact CSS calculation so thumb centers sit between INSET and (100% - INSET)
  const getThumbLeft = (pct: number) => `calc(${INSET}px + (100% - ${INSET * 2}px) * ${pct / 100})`;

  // Smart tooltip boundary detection so tooltips never clip off-screen
  const getTooltipStyle = (pct: number): React.CSSProperties => {
    if (pct < 16) {
      return { left: "-8px", transform: "translateX(0)" };
    }
    if (pct > 84) {
      return { right: "-8px", left: "auto", transform: "translateX(0)" };
    }
    return { left: "50%", transform: "translateX(-50%)" };
  };

  const getTooltipArrowStyle = (pct: number): React.CSSProperties => {
    if (pct < 16) {
      return { left: "14px" };
    }
    if (pct > 84) {
      return { right: "14px", left: "auto" };
    }
    return { left: "50%", transform: "translateX(-50%)" };
  };

  return (
    <div className="pt-1 pb-1 flex flex-col gap-2.5">
      {/* ── 1. Interactive Density Histogram (Acoustic Wave) ─────────────── */}
      <div
        className="flex items-end justify-between h-9 select-none pt-1"
        style={{ paddingLeft: `${INSET}px`, paddingRight: `${INSET}px` }}
      >
        {bins.map((bin, i) => {
          const inRange = bin.center >= localMin && bin.center <= localMax;
          return (
            <div
              key={i}
              className="flex flex-col justify-end items-center h-full group relative cursor-pointer py-0.5"
              onClick={() => {
                const distMin = Math.abs(bin.center - localMin);
                const distMax = Math.abs(bin.center - localMax);
                if (distMin <= distMax) {
                  const newMin = clamp(snapToStep(bin.center), PRICE_MIN, localMax - PRICE_STEP);
                  setLocalMin(newMin);
                  commitValue(newMin, localMax, true);
                } else {
                  const newMax = clamp(snapToStep(bin.center), localMin + PRICE_STEP, PRICE_MAX);
                  setLocalMax(newMax);
                  commitValue(localMin, newMax, true);
                }
              }}
              title={`~₹${Math.round(bin.center).toLocaleString("en-IN")}`}
            >
              <div
                style={{ height: `${bin.heightPx}px` }}
                className={`w-[3px] rounded-full transition-all duration-200 ${
                  inRange
                    ? "bg-[#111111] opacity-90 group-hover:opacity-100 group-hover:scale-y-115"
                    : "bg-[#E2E2E0] opacity-45 group-hover:opacity-80"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* ── 2. Dual Slider Track & Thumbs ──────────────────────────────────── */}
      <div
        ref={trackRef}
        className="relative w-full h-8 flex items-center cursor-pointer touch-none select-none my-0.5"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="group"
        aria-label="Price range slider"
      >
        {/* Background Track Rail */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[5px] bg-[#EAEAE8] rounded-full"
          style={{ left: `${INSET}px`, right: `${INSET}px` }}
        />

        {/* Active Range Bar */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-[5px] bg-[#111111] rounded-full shadow-xs"
          style={{
            left: getThumbLeft(leftPct),
            width: `calc((100% - ${INSET * 2}px) * ${(rightPct - leftPct) / 100})`,
          }}
        />

        {/* ── Min Thumb ────────────────────────────────────────────────────── */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Minimum price"
          aria-valuemin={PRICE_MIN}
          aria-valuemax={localMax - PRICE_STEP}
          aria-valuenow={localMin}
          aria-valuetext={`₹${localMin.toLocaleString("en-IN")}`}
          onKeyDown={handleKeyDownMin}
          onPointerEnter={() => setHoveredThumb("min")}
          onPointerLeave={() => setHoveredThumb(null)}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 outline-none cursor-grab active:cursor-grabbing flex flex-col items-center justify-center group"
          style={{ left: getThumbLeft(leftPct) }}
        >
          {/* Animated Floating Tooltip */}
          <div
            style={getTooltipStyle(leftPct)}
            className={`absolute -top-7 px-2 py-0.5 bg-[#111111] text-white text-[10px] font-bold rounded-[4px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] pointer-events-none whitespace-nowrap transition-all duration-150 transform ${
              hoveredThumb === "min" || isDragging === "min"
                ? "opacity-100 scale-100 -translate-y-1"
                : "opacity-0 scale-75 translate-y-2 pointer-events-none"
            }`}
          >
            ₹{localMin.toLocaleString("en-IN")}
            <div
              style={getTooltipArrowStyle(leftPct)}
              className="absolute -bottom-1 w-1.5 h-1.5 bg-[#111111] rotate-45"
            />
          </div>

          {/* Thumb Pill */}
          <div
            className={`w-[20px] h-[20px] rounded-full bg-white border-[2.5px] border-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center transition-transform duration-150 ${
              isDragging === "min"
                ? "scale-125 ring-4 ring-black/10 shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
                : "group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-black/15"
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
          </div>
        </div>

        {/* ── Max Thumb ────────────────────────────────────────────────────── */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Maximum price"
          aria-valuemin={localMin + PRICE_STEP}
          aria-valuemax={PRICE_MAX}
          aria-valuenow={localMax}
          aria-valuetext={`₹${localMax.toLocaleString("en-IN")}`}
          onKeyDown={handleKeyDownMax}
          onPointerEnter={() => setHoveredThumb("max")}
          onPointerLeave={() => setHoveredThumb(null)}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 outline-none cursor-grab active:cursor-grabbing flex flex-col items-center justify-center group"
          style={{ left: getThumbLeft(rightPct) }}
        >
          {/* Animated Floating Tooltip */}
          <div
            style={getTooltipStyle(rightPct)}
            className={`absolute -top-7 px-2 py-0.5 bg-[#111111] text-white text-[10px] font-bold rounded-[4px] shadow-[0_4px_12px_rgba(0,0,0,0.25)] pointer-events-none whitespace-nowrap transition-all duration-150 transform ${
              hoveredThumb === "max" || isDragging === "max"
                ? "opacity-100 scale-100 -translate-y-1"
                : "opacity-0 scale-75 translate-y-2 pointer-events-none"
            }`}
          >
            {localMax >= PRICE_MAX
              ? `₹${PRICE_MAX.toLocaleString("en-IN")}+`
              : `₹${localMax.toLocaleString("en-IN")}`}
            <div
              style={getTooltipArrowStyle(rightPct)}
              className="absolute -bottom-1 w-1.5 h-1.5 bg-[#111111] rotate-45"
            />
          </div>

          {/* Thumb Pill */}
          <div
            className={`w-[20px] h-[20px] rounded-full bg-white border-[2.5px] border-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.2)] flex items-center justify-center transition-transform duration-150 ${
              isDragging === "max"
                ? "scale-125 ring-4 ring-black/10 shadow-[0_4px_14px_rgba(0,0,0,0.3)]"
                : "group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-black/15"
            }`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
          </div>
        </div>
      </div>

      {/* ── 3. Range Min / Max Extremes ────────────────────────────────────── */}
      <div
        className="flex items-center justify-between text-[11px] font-medium text-[#888888] -mt-1 select-none"
        style={{ paddingLeft: `${INSET}px`, paddingRight: `${INSET}px` }}
      >
        <span className="tabular-nums">₹{PRICE_MIN.toLocaleString("en-IN")}</span>
        <span className="tabular-nums">₹{PRICE_MAX.toLocaleString("en-IN")}+</span>
      </div>

      {/* ── 4. Quick-Pick Preset Pills ─────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-1.5 pt-0.5">
        {PRESET_RANGES.map((p) => {
          const isPresetActive = localMin === p.min && localMax === p.max;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPreset(p.min, p.max)}
              className={`py-1.5 px-0.5 text-center rounded-[5px] text-[10px] sm:text-[10.5px] font-semibold tracking-tight whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isPresetActive
                  ? "bg-[#111111] text-white shadow-xs"
                  : "bg-[#F5F5F3] text-[#666666] hover:bg-[#EAEAE8] hover:text-[#111111]"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* ── 5. Value Display Boxes ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 flex items-center justify-between py-1.5 px-2.5 border border-[#E5E5E3] rounded-[6px] bg-[#FAFAF9] text-[#111111]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#999999]">Min</span>
          <div className="flex items-center gap-0.5">
            <span className="text-[#888888] text-[11px] font-medium">₹</span>
            <span className="text-[12px] font-semibold tabular-nums">
              {localMin.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
        <span className="text-[#CCCCCC] font-light text-[11px] shrink-0">—</span>
        <div className="flex-1 flex items-center justify-between py-1.5 px-2.5 border border-[#E5E5E3] rounded-[6px] bg-[#FAFAF9] text-[#111111]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#999999]">Max</span>
          <div className="flex items-center gap-0.5">
            <span className="text-[#888888] text-[11px] font-medium">₹</span>
            <span className="text-[12px] font-semibold tabular-nums">
              {localMax >= PRICE_MAX
                ? `${PRICE_MAX.toLocaleString("en-IN")}+`
                : localMax.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tactile Option Row ───────────────────────────────────────────────────────
function TactileOptionRow({
  id,
  label,
  imageSrc,
  checked,
  onChange,
  count,
}: {
  id: string;
  label: string;
  imageSrc: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  const checkboxRef = useRef<HTMLDivElement>(null);

  const handleChange = useCallback(() => {
    if (checkboxRef.current) {
      checkboxRef.current.style.animation = "none";
      void checkboxRef.current.offsetHeight;
      checkboxRef.current.style.animation =
        "checkbox-spring 280ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    }
    onChange();
  }, [onChange]);

  return (
    <label
      htmlFor={id}
      className={`group flex items-center justify-between w-full px-2 py-[7px] rounded-[6px] cursor-pointer select-none transition-all duration-200 active:scale-[0.98] ${
        checked
          ? "bg-[#FFF8D6] text-[#111111]"
          : "hover:bg-[#F7F7F5] text-[#222222]"
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          ref={checkboxRef}
          className={`h-[15px] w-[15px] shrink-0 rounded-[3px] border flex items-center justify-center transition-colors duration-200 ${
            checked
              ? "bg-[#FFD400] border-[#E8C200]"
              : "bg-white border-[#CDCDCD] group-hover:border-[#999999]"
          }`}
          aria-hidden="true"
        >
          {checked && (
            <svg width="9" height="7" viewBox="0 0 10 8" fill="none" className="text-[#111111]">
              <path d="M1.5 4L3.8 6.5L8.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={handleChange}
          className="sr-only"
          aria-checked={checked}
        />

        <div className="relative h-[42px] w-[42px] shrink-0 rounded-[6px] bg-[#F5F5F3] overflow-hidden flex items-center justify-center border border-[#EBEBEB]">
          <Image src={imageSrc} alt={label} fill sizes="42px" className="object-contain p-0.5" unoptimized />
        </div>

        <span
          className={`text-[13px] leading-snug truncate transition-colors duration-150 ${
            checked ? "font-medium text-[#111111]" : "font-normal text-[#333333] group-hover:text-[#111111]"
          }`}
        >
          {label}
        </span>
      </div>

      {count !== undefined && (
        <span className={`text-[12.5px] ml-2 shrink-0 tabular-nums ${checked ? "text-[#555555] font-medium" : "text-[#999999]"}`}>
          ({count})
        </span>
      )}
    </label>
  );
}

// ── Collapsible Filter Section ───────────────────────────────────────────────
function FilterGroupSection({
  title,
  icon,
  isOpen,
  onToggle,
  rightAction,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="py-3 border-b border-[#F0F0EE] last:border-b-0">
      <div className="flex items-center justify-between w-full">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="flex items-center gap-2 py-0.5 text-left cursor-pointer group flex-1"
        >
          <span className="text-[#555555] shrink-0 transition-colors duration-150 group-hover:text-[#333333]">{icon}</span>
          <span className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-[#111111] group-hover:text-[#333333] transition-colors duration-150">
            {title}
          </span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {rightAction}
          <button
            type="button"
            onClick={onToggle}
            aria-label={`Toggle ${title}`}
            className="p-1 text-[#999999] hover:text-[#555555] transition-colors duration-150 cursor-pointer"
          >
            <ChevronDown
              size={14}
              strokeWidth={1.8}
              className="transition-transform duration-300"
              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </div>
      </div>

      <div className="filter-section-content" data-open={isOpen} aria-hidden={!isOpen}>
        <div className="filter-section-inner">
          <div className="pt-2.5 pb-0.5 flex flex-col gap-0.5">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ── Sneaker Icon ─────────────────────────────────────────────────────────────
function SneakerIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d="M2 17h19.5c.3 0 .5.2.5.5v1.5c0 .8-.7 1.5-1.5 1.5H3.5C2.7 20.5 2 19.8 2 19V17z" />
      <path d="M2.5 17V9c0-1.1.9-2 2-2h2.5c.8 0 1.5.4 1.9 1.1L12 12.5h4c2.5 0 4.5 1.8 5 4.5" />
      <line x1="8.5" y1="9.5" x2="11.5" y2="12.5" />
      <line x1="11" y1="8" x2="14" y2="11" />
    </svg>
  );
}

type SectionKey = "silhouettes" | "soles" | "sizes" | "colors" | "price";

// ═══════════════════════════════════════════════════════════════════════════════
// ── Main Sidebar Component ───────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
export function FootwearFilterSidebar({
  filters,
  onToggleSilhouette,
  onToggleSole,
  onToggleSize,
  onToggleColor,
  onChangePriceRange,
  onClearAll,
  onOpenSizeGuide,
  activeFilterCount,
  totalFilteredCount,
  itemCounts,
  isMobileOpen = false,
  onCloseMobile,
  productPrices,
}: FootwearFilterSidebarProps) {
  const [openSections, setOpenSections] = useState<SectionKey[]>([
    "silhouettes",
    "sizes",
    "colors",
    "price",
  ]);

  const toggleSection = (section: SectionKey) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  // Active color selection for label display
  const activeColorNames = FOOTWEAR_COLORS.filter((c) => filters.colors.includes(c.id)).map((c) => c.name);

  // Color swatch pop animation refs
  const swatchRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const handleColorClick = useCallback(
    (colorId: string) => {
      const el = swatchRefs.current[colorId];
      if (el) {
        el.classList.remove("swatch-pop");
        void el.offsetHeight;
        el.classList.add("swatch-pop");
      }
      onToggleColor(colorId);
    },
    [onToggleColor]
  );

  const filterContent = (
    <div className="flex flex-col text-[#111111] select-none">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 mb-1 border-b border-[#E8E8E6]">
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-[#111111]" aria-hidden="true">
            <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#111111]">
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1.5 text-[11px] font-normal text-[#999999] tabular-nums">({activeFilterCount})</span>
            )}
          </h2>
        </div>
        <button
          type="button"
          onClick={activeFilterCount > 0 ? onClearAll : undefined}
          disabled={activeFilterCount === 0}
          className={`text-[11.5px] font-normal transition-colors duration-150 cursor-pointer ${
            activeFilterCount > 0 ? "text-[#999999] hover:text-[#111111]" : "text-[#D5D5D5] cursor-default"
          }`}
          aria-label="Clear all applied filters"
        >
          Clear all
        </button>
      </div>

      {/* ── 1. STYLE / SILHOUETTE ─────────────────────────────────────────── */}
      <FilterGroupSection
        title="Style / Silhouette"
        icon={<SneakerIcon />}
        isOpen={openSections.includes("silhouettes")}
        onToggle={() => toggleSection("silhouettes")}
      >
        <div className="flex flex-col gap-0.5">
          {FOOTWEAR_SILHOUETTES.map((sil) => (
            <TactileOptionRow
              key={sil.id}
              id={`sil-${sil.id}`}
              label={sil.label}
              imageSrc={sil.image}
              checked={filters.silhouettes.includes(sil.id)}
              onChange={() => onToggleSilhouette(sil.id)}
              count={itemCounts?.silhouettes?.[sil.id] ?? sil.defaultCount}
            />
          ))}
        </div>
      </FilterGroupSection>

      {/* ── 2. SOLE & CONSTRUCTION ────────────────────────────────────────── */}
      <FilterGroupSection
        title="Sole & Construction"
        icon={<Layers size={15} strokeWidth={1.8} className="shrink-0" />}
        isOpen={openSections.includes("soles")}
        onToggle={() => toggleSection("soles")}
      >
        <div className="flex flex-col gap-0.5">
          {FOOTWEAR_SOLES.map((sole) => (
            <TactileOptionRow
              key={sole.id}
              id={`sole-${sole.id}`}
              label={sole.label}
              imageSrc={sole.image}
              checked={filters.soles.includes(sole.id)}
              onChange={() => onToggleSole(sole.id)}
              count={itemCounts?.soles?.[sole.id] ?? sole.defaultCount}
            />
          ))}
        </div>
      </FilterGroupSection>

      {/* ── 3. IN-STOCK SIZES ─────────────────────────────────────────────── */}
      <FilterGroupSection
        title="In-Stock Sizes"
        icon={<Ruler size={15} strokeWidth={1.8} className="shrink-0" />}
        isOpen={openSections.includes("sizes")}
        onToggle={() => toggleSection("sizes")}
        rightAction={
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="flex items-center gap-1 text-[11px] font-normal text-[#999999] hover:text-[#555555] transition-colors duration-150 cursor-pointer mr-1"
          >
            <Info size={10} strokeWidth={1.8} />
            <span className="underline underline-offset-2 decoration-[#CCCCCC]">Size Guide</span>
          </button>
        }
      >
        <div className="grid grid-cols-3 gap-[6px] pt-0.5">
          {FOOTWEAR_SIZES.map((item) => {
            const isSelected = filters.sizes.includes(item.size);
            const count = itemCounts?.sizes?.[item.size] ?? item.count;
            return (
              <button
                key={item.size}
                type="button"
                onClick={() => onToggleSize(item.size)}
                title={`${item.size} (${count} available)`}
                className={`filter-btn-press py-2 px-1 rounded-[4px] flex flex-col items-center justify-center cursor-pointer select-none ${
                  isSelected
                    ? "bg-[#FFD400] text-[#111111] font-semibold border border-[#E8C200] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                    : "bg-[#F5F5F3] text-[#333333] border border-[#EBEBEB] hover:border-[#CCCCCC] hover:bg-[#EFEFED]"
                }`}
              >
                <span className="text-[11.5px] font-semibold leading-none tracking-wide">{item.size}</span>
                <span className={`text-[9px] tabular-nums leading-none mt-1 ${isSelected ? "text-[#333333]" : "text-[#999999]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </FilterGroupSection>

      {/* ── 4. COLOURWAY ──────────────────────────────────────────────────── */}
      <FilterGroupSection
        title="Colourway"
        icon={<Palette size={15} strokeWidth={1.8} className="shrink-0" />}
        isOpen={openSections.includes("colors")}
        onToggle={() => toggleSection("colors")}
      >
        <div className="pt-0.5">
          <div className="grid grid-cols-8 gap-[8px]">
            {FOOTWEAR_COLORS.map((col) => {
              const isSelected = filters.colors.includes(col.id);
              return (
                <button
                  key={col.id}
                  ref={(el) => { swatchRefs.current[col.id] = el; }}
                  type="button"
                  onClick={() => handleColorClick(col.id)}
                  title={col.name}
                  aria-label={`Filter by ${col.name}`}
                  aria-pressed={isSelected}
                  className={`relative h-[26px] w-[26px] rounded-full cursor-pointer filter-btn-press mx-auto ${
                    isSelected ? "ring-[1.5px] ring-[#111111] ring-offset-[3px] scale-[1.05]" : "hover:scale-110"
                  } ${col.border ? "border border-[#DCDCDC]" : ""}`}
                  style={{ backgroundColor: col.hex }}
                />
              );
            })}
          </div>
          <div
            className="overflow-hidden transition-all duration-300 ease-out"
            style={{
              maxHeight: activeColorNames.length > 0 ? "28px" : "0px",
              opacity: activeColorNames.length > 0 ? 1 : 0,
              marginTop: activeColorNames.length > 0 ? "8px" : "0px",
            }}
          >
            <p className="text-[11.5px] font-normal text-[#777777]">{activeColorNames.join(", ")}</p>
          </div>
        </div>
      </FilterGroupSection>

      {/* ── 5. PRICE ──────────────────────────────────────────────────────── */}
      <FilterGroupSection
        title="Price"
        icon={<Tag size={15} strokeWidth={1.8} className="shrink-0" />}
        isOpen={openSections.includes("price")}
        onToggle={() => toggleSection("price")}
        rightAction={
          filters.priceMin > FOOTWEAR_PRICE_MIN || filters.priceMax < FOOTWEAR_PRICE_MAX ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChangePriceRange(FOOTWEAR_PRICE_MIN, FOOTWEAR_PRICE_MAX, true);
              }}
              className="text-[10px] uppercase font-bold tracking-wider text-[#888888] hover:text-[#111111] transition-colors cursor-pointer"
            >
              Reset
            </button>
          ) : undefined
        }
      >
        <DualPriceSlider
          minValue={filters.priceMin}
          maxValue={filters.priceMax}
          onChange={onChangePriceRange}
          productPrices={productPrices}
        />
      </FilterGroupSection>
    </div>
  );

  return (
    <>
      {/* ── DESKTOP STICKY SIDEBAR ─────────────────────────────────────────── */}
      <aside
        aria-label="Footwear Category Filters"
        className="hidden lg:block w-[280px] xl:w-[300px] shrink-0 self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain luxury-sidebar-scrollbar bg-white rounded-[12px] border border-[#EAEAE8] p-5 shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
      >
        {filterContent}
      </aside>

      {/* ── MOBILE SLIDE-OVER DRAWER ──────────────────────────────────────── */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter Footwear"
            className="relative flex w-full max-w-xs flex-col bg-white text-[#111111] shadow-2xl z-10 animate-drawer-in h-full overflow-hidden ml-auto"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEAE8]">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#111111]">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-[#FFD400] text-[#111111] text-[10px] font-bold rounded-[3px] tabular-nums">{activeFilterCount}</span>
                )}
              </div>
              <button type="button" onClick={onCloseMobile} className="p-1 text-[#777777] hover:text-[#111111] transition-colors duration-150 cursor-pointer" aria-label="Close filters">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 flex-1 luxury-sidebar-scrollbar">{filterContent}</div>
            <div className="p-4 border-t border-[#EAEAE8] bg-[#FAFAF8] flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button type="button" onClick={onClearAll} className="filter-btn-press px-4 py-2.5 border border-[#111111] text-[11px] font-semibold uppercase tracking-wider text-[#111111] hover:bg-[#F5F5F3] rounded-[4px] cursor-pointer">
                  Clear
                </button>
              )}
              <button type="button" onClick={onCloseMobile} className="filter-btn-press flex-1 py-2.5 bg-[#111111] hover:bg-[#222222] text-white text-[11px] font-semibold uppercase tracking-[0.08em] rounded-[4px] cursor-pointer text-center">
                Show {totalFilteredCount} Silhouettes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
