"use client";

import React from "react";
import { X, RotateCcw } from "lucide-react";

export interface FilterChipItem {
  id: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  chips: FilterChipItem[];
  onClearAll: () => void;
  className?: string;
}

export function ActiveFilterChips({
  chips,
  onClearAll,
  className = "",
}: ActiveFilterChipsProps) {
  // Only display chips & Clear All when at least one filter is actively selected
  if (!chips || chips.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Active filters"
      className={`flex items-center gap-1.5 flex-nowrap lg:flex-wrap justify-start lg:justify-center animate-in fade-in duration-200 ${className}`}
    >
      {chips.map((chip) => (
        <button
          key={chip.id}
          type="button"
          onClick={chip.onRemove}
          aria-label={`Remove filter: ${chip.label}`}
          className="group inline-flex items-center gap-1.5 h-7.5 px-3 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200/90 text-neutral-800 border border-neutral-200/80 hover:border-neutral-300 transition-colors cursor-pointer shadow-2xs select-none shrink-0 focus:outline-none focus:ring-2 focus:ring-neutral-900/15"
        >
          <span>{chip.label}</span>
          <X
            size={11}
            className="text-neutral-400 group-hover:text-neutral-900 transition-colors"
          />
        </button>
      ))}

      {/* Clear All button — only appears when at least one filter is chosen */}
      <button
        type="button"
        onClick={onClearAll}
        aria-label="Clear all active filters"
        className="group inline-flex items-center gap-1.5 h-7.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-red-600 bg-neutral-100/90 hover:bg-red-50 border border-neutral-200/80 hover:border-red-200 transition-colors cursor-pointer select-none shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500/20 shadow-2xs"
      >
        <RotateCcw size={10} className="transition-transform duration-300 group-hover:-rotate-90" />
        <span>Clear All ({chips.length})</span>
      </button>
    </div>
  );
}
