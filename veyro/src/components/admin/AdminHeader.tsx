"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronDown, Calendar as CalendarIcon, Check } from "lucide-react";
import type { OrderRecord } from "@/types";
import { EASE, DUR_ENTRY, DIST } from "./motion/motion-tokens";
import {
  AdminDateRangePicker,
  DateFilterSelection,
} from "./AdminDateRangePicker";

interface AdminHeaderProps {
  greeting?: string;
  subtitle?: string;
  currentFilter?: DateFilterSelection;
  onSelectFilter?: (filter: DateFilterSelection) => void;
  orders?: OrderRecord[];
  rightAction?: React.ReactNode;
  showDateFilter?: boolean;
}

export function AdminHeader({
  greeting = "Welcome back 👋",
  subtitle = "This is what's happening in your store this month.",
  currentFilter,
  onSelectFilter,
  orders = [],
  rightAction,
  showDateFilter = true,
}: AdminHeaderProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isQuickFilterOpen, setIsQuickFilterOpen] = useState(false);
  const quickFilterRef = useRef<HTMLDivElement>(null);

  // Close quick filter on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (quickFilterRef.current && !quickFilterRef.current.contains(e.target as Node)) {
        setIsQuickFilterOpen(false);
      }
    }
    if (isQuickFilterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isQuickFilterOpen]);

  // Standard preset ranges
  const quickPresets: { label: string; filter: DateFilterSelection }[] = [
    {
      label: "This month",
      filter: {
        type: "preset",
        label: "This Month (01 Oct - 03 Oct 2026)",
        startDate: "2026-10-01",
        endDate: "2026-10-03",
      },
    },
    {
      label: "Last month",
      filter: {
        type: "preset",
        label: "Sep 1, 2026 - Sep 30, 2026",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
      },
    },
    {
      label: "Last 7 days",
      filter: {
        type: "preset",
        label: "Last 7 Days (27 Sep - 03 Oct 2026)",
        startDate: "2026-09-27",
        endDate: "2026-10-03",
      },
    },
    {
      label: "All time (Till Date)",
      filter: {
        type: "all",
        label: "All Time (Till Date)",
        startDate: "2026-09-18",
        endDate: "2026-10-03",
      },
    },
  ];

  // Display label on the dropdown trigger pill
  const activeLabel = React.useMemo(() => {
    if (!currentFilter) return "This month";
    if (currentFilter.type === "all") return "All time";
    if (currentFilter.label.toLowerCase().includes("this month")) return "This month";
    if (currentFilter.label.toLowerCase().includes("sep")) return "Last month";
    if (currentFilter.label.toLowerCase().includes("7 days")) return "Last 7 days";
    if (currentFilter.label.toLowerCase().includes("today")) return "Today";
    return currentFilter.label.split("(")[0].trim() || "This month";
  }, [currentFilter]);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Left side: Greeting + Subtitle */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: DIST }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_ENTRY, ease: EASE }}
          className="text-2xl sm:text-[28px] font-bold text-white tracking-tight leading-tight font-heading"
        >
          {greeting}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: DIST }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_ENTRY, delay: 0.08, ease: EASE }}
          className="text-xs sm:text-[13px] text-[#71717A] mt-1 font-normal"
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Right side: Range Select Dropdown Pill + Calendar Button */}
      {(showDateFilter || rightAction) && (
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {rightAction}

          {showDateFilter && (
            <>
              {/* Range select pill */}
              <div className="relative" ref={quickFilterRef}>
                <button
                  type="button"
                  onClick={() => setIsQuickFilterOpen(!isQuickFilterOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/5 hover:border-white/10 text-white rounded-[14px] text-xs font-medium transition-all cursor-pointer shadow-xs"
                  aria-expanded={isQuickFilterOpen}
                  aria-label="Select date range"
                >
                  <span>{activeLabel}</span>
                  <ChevronDown size={14} className="text-[#71717A]" />
                </button>

                {isQuickFilterOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--admin-surface)] border border-white/10 rounded-[18px] shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                    {quickPresets.map((preset) => {
                      const isSelected = activeLabel === preset.label;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            if (onSelectFilter) {
                              onSelectFilter(preset.filter);
                            }
                            setIsQuickFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-[12px] text-left transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-[var(--admin-elevated)] text-white font-semibold"
                              : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span>{preset.label}</span>
                          {isSelected && <Check size={13} className="text-[#00F59B]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Standalone Calendar button (opens full picker if wired) */}
              <div className="relative">
                {currentFilter && onSelectFilter ? (
                  <AdminDateRangePicker
                    currentFilter={currentFilter}
                    onSelectFilter={onSelectFilter}
                    orders={orders}
                    compact
                    customTriggerLabel=""
                    className="dark-trigger-mode"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className="w-9 h-9 rounded-[14px] bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/5 hover:border-white/10 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    aria-label="Open Calendar Picker"
                  >
                    <CalendarIcon size={15} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
