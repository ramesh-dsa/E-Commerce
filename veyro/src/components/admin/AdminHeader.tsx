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

/**
 * Calculates deterministic executive greeting based on time of day
 * 04:00 - 11:59 -> "Good morning"
 * 12:00 - 16:59 -> "Good afternoon"
 * 17:00 - 03:59 -> "Good evening"
 */
export function getTimeOfDayGreeting(date: Date = new Date()): string {
  const hours = date.getHours();
  if (hours >= 4 && hours < 12) {
    return "Good morning";
  }
  if (hours >= 12 && hours < 17) {
    return "Good afternoon";
  }
  return "Good evening";
}

interface AdminHeaderProps {
  greeting?: React.ReactNode;
  adminName?: string;
  subtitle?: string;
  currentFilter?: DateFilterSelection;
  onSelectFilter?: (filter: DateFilterSelection) => void;
  orders?: OrderRecord[];
  rightAction?: React.ReactNode;
  showDateFilter?: boolean;
}

export function AdminHeader({
  greeting,
  adminName = "Santhosh",
  subtitle = "Here's what's happening in your store today.",
  currentFilter,
  onSelectFilter,
  orders = [],
  rightAction,
  showDateFilter = true,
}: AdminHeaderProps) {
  const [timeGreeting, setTimeGreeting] = useState<string>("Good morning");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isQuickFilterOpen, setIsQuickFilterOpen] = useState(false);
  const quickFilterRef = useRef<HTMLDivElement>(null);

  // Sync greeting with real client-side local time on mount & keep updated
  useEffect(() => {
    setTimeGreeting(getTimeOfDayGreeting());
    const interval = setInterval(() => {
      setTimeGreeting(getTimeOfDayGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const resolvedGreeting =
    greeting !== undefined
      ? greeting
      : adminName
      ? `${timeGreeting}, ${adminName}`
      : timeGreeting;

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

  // Standard preset ranges based on current date
  const quickPresets = React.useMemo(() => {
    const now = new Date();
    const formatIso = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };
    const formatDisplay = (d: Date) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const day = String(d.getDate()).padStart(2, "0");
      const m = months[d.getMonth()];
      const y = d.getFullYear();
      return `${day} ${m} ${y}`;
    };

    const todayIso = formatIso(now);
    const todayDisplay = formatDisplay(now);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartIso = formatIso(monthStart);
    const monthStartDisplay = formatDisplay(monthStart);

    const last7 = new Date(now);
    last7.setDate(now.getDate() - 6);
    const last7Iso = formatIso(last7);
    const last7Display = formatDisplay(last7);

    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const prevMonthStartIso = formatIso(prevMonthStart);
    const prevMonthEndIso = formatIso(prevMonthEnd);
    const prevMonthLabel = `${formatDisplay(prevMonthStart)} - ${formatDisplay(prevMonthEnd)}`;

    return [
      {
        label: "This month",
        filter: {
          type: "preset" as const,
          label: `This Month (${monthStartDisplay.slice(0, 6)} - ${todayDisplay})`,
          startDate: monthStartIso,
          endDate: todayIso,
        },
      },
      {
        label: "Last month",
        filter: {
          type: "preset" as const,
          label: prevMonthLabel,
          startDate: prevMonthStartIso,
          endDate: prevMonthEndIso,
        },
      },
      {
        label: "Last 7 days",
        filter: {
          type: "preset" as const,
          label: `Last 7 Days (${last7Display.slice(0, 6)} - ${todayDisplay})`,
          startDate: last7Iso,
          endDate: todayIso,
        },
      },
      {
        label: "All time (Till Date)",
        filter: {
          type: "all" as const,
          label: "All Time (Till Date)",
          startDate: "2026-01-01",
          endDate: todayIso,
        },
      },
    ];
  }, []);

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
          suppressHydrationWarning
        >
          {resolvedGreeting}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: DIST }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DUR_ENTRY, delay: 0.08, ease: EASE }}
          className="text-xs sm:text-[13px] text-[var(--admin-text-muted)] mt-1 font-normal"
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
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--admin-surface)] border border-white/10 rounded-[18px] shadow-2xl p-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 space-y-0.5">
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
