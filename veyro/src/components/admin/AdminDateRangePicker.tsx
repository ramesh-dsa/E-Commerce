"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import type { OrderRecord } from "@/types";
import {
  CalendarDays,
  ChevronDown,
  X,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/ScrollArea";

export interface DateFilterSelection {
  type: "all" | "preset" | "day" | "custom";
  label: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;   // "YYYY-MM-DD"
  singleDay?: string; // "YYYY-MM-DD"
}

export function parseOrderDateToDayString(dateStr: string): string {
  try {
    const parts = dateStr.split(",")[0].trim().split(" ");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const monthName = parts[1].toLowerCase();
      const year = parts[2];
      const monthMap: Record<string, string> = {
        jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06",
        jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12",
      };
      const month = monthMap[monthName.slice(0, 3)] || "10";
      return `${year}-${month}-${day}`;
    }
  } catch {
    // fallback
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toISOString().slice(0, 10);
  }
  return "2026-10-03";
}

export function formatDayDisplay(dayStr: string): string {
  try {
    const parts = dayStr.split("-");
    if (parts.length === 3) {
      const day = parts[2];
      const monthNum = parseInt(parts[1], 10);
      const year = parts[0];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[monthNum - 1] || "Oct";
      if (dayStr === "2026-10-03") return `Today (${day} ${month} ${year})`;
      if (dayStr === "2026-10-02") return `Yesterday (${day} ${month} ${year})`;
      return `${day} ${month} ${year}`;
    }
  } catch {
    // ignore
  }
  return dayStr;
}

export function formatBarDate(dayStr: string): string {
  try {
    const parts = dayStr.split("-");
    if (parts.length === 3) {
      const day = parts[2];
      const monthNum = parseInt(parts[1], 10);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = months[monthNum - 1] || "Oct";
      return `${day} ${month}`;
    }
  } catch {
    // ignore
  }
  return dayStr;
}

interface AdminDateRangePickerProps {
  currentFilter: DateFilterSelection;
  onSelectFilter: (filter: DateFilterSelection) => void;
  orders: OrderRecord[];
  compact?: boolean;
  align?: "left" | "right";
  customTriggerLabel?: string;
  className?: string;
}

export function AdminDateRangePicker({
  currentFilter,
  onSelectFilter,
  orders,
  compact = false,
  align = "right",
  customTriggerLabel,
  className = "",
}: AdminDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"preset" | "day" | "custom">("preset");
  const containerRef = useRef<HTMLDivElement>(null);

  // Month navigation state for custom calendar
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 is October, 8 is September

  // Custom range temporary state
  const [customStart, setCustomStart] = useState<string>(currentFilter.startDate);
  const [customEnd, setCustomEnd] = useState<string>(currentFilter.endDate);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Aggregate day-wise orders summary
  const orderDaysSummary = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number; rawDate: string }>();

    orders.forEach((o) => {
      const dayStr = parseOrderDateToDayString(o.date);
      const existing = map.get(dayStr) || {
        count: 0,
        revenue: 0,
        rawDate: o.date.split(",")[0].trim(),
      };
      existing.count += 1;
      existing.revenue += o.total;
      map.set(dayStr, existing);
    });

    return Array.from(map.entries())
      .map(([dayStr, data]) => ({
        dayStr,
        ...data,
      }))
      .sort((a, b) => b.dayStr.localeCompare(a.dayStr));
  }, [orders]);

  const presets: {
    id: string;
    label: string;
    sub: string;
    start: string;
    end: string;
    type: "all" | "preset" | "day";
  }[] = [
    {
      id: "all_time",
      label: "All Time (Till Date)",
      sub: "Complete store history up to 03 Oct 2026",
      start: "2026-01-01",
      end: "2026-10-03",
      type: "all",
    },
    {
      id: "today",
      label: "Today (03 Oct 2026)",
      sub: "Today's live volume (2 orders recorded)",
      start: "2026-10-03",
      end: "2026-10-03",
      type: "day",
    },
    {
      id: "yesterday",
      label: "Yesterday (02 Oct 2026)",
      sub: "Previous business day closing",
      start: "2026-10-02",
      end: "2026-10-02",
      type: "day",
    },
    {
      id: "this_month",
      label: "This Month (01 Oct - 03 Oct 2026)",
      sub: "Month to date (MTD till today)",
      start: "2026-10-01",
      end: "2026-10-03",
      type: "preset",
    },
    {
      id: "last_7",
      label: "Last 7 Days (27 Sep - 03 Oct 2026)",
      sub: "Rolling 7 days performance",
      start: "2026-09-27",
      end: "2026-10-03",
      type: "preset",
    },
    {
      id: "last_30",
      label: "Last 30 Days (04 Sep - 03 Oct 2026)",
      sub: "Rolling 30-day window",
      start: "2026-09-04",
      end: "2026-10-03",
      type: "preset",
    },
    {
      id: "sep_2026",
      label: "Sep 1, 2026 - Sep 30, 2026",
      sub: "Full previous calendar month",
      start: "2026-09-01",
      end: "2026-09-30",
      type: "preset",
    },
    {
      id: "last_90",
      label: "Last 90 Days",
      sub: "Quarterly volume",
      start: "2026-07-05",
      end: "2026-10-03",
      type: "preset",
    },
    {
      id: "ytd",
      label: "Year to Date (2026)",
      sub: "01 Jan 2026 - 03 Oct 2026",
      start: "2026-01-01",
      end: "2026-10-03",
      type: "preset",
    },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleCalendarDayClick = (dayStr: string) => {
    if (activeTab === "day") {
      onSelectFilter({
        type: "day",
        label: `Day: ${formatDayDisplay(dayStr)}`,
        startDate: dayStr,
        endDate: dayStr,
        singleDay: dayStr,
      });
      setIsOpen(false);
      return;
    }

    if (!customStart || (customStart && customEnd)) {
      setCustomStart(dayStr);
      setCustomEnd("");
    } else {
      if (dayStr < customStart) {
        setCustomEnd(customStart);
        setCustomStart(dayStr);
      } else {
        setCustomEnd(dayStr);
      }
    }
  };

  const handleApplyCustomRange = () => {
    if (!customStart) return;
    const start = customStart;
    const end = customEnd || customStart;
    const formattedLabel = start === end ? `Day: ${formatDayDisplay(start)}` : `${start} to ${end}`;
    onSelectFilter({
      type: "custom",
      label: formattedLabel,
      startDate: start,
      endDate: end,
    });
    setIsOpen(false);
  };

  const handleSelectDay = (dayStr: string) => {
    onSelectFilter({
      type: "day",
      label: formatDayDisplay(dayStr),
      startDate: dayStr,
      endDate: dayStr,
      singleDay: dayStr,
    });
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      {customTriggerLabel === "" ? (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-9 h-9 rounded-full bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/10 text-[var(--admin-text-muted)] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          aria-label="Open Calendar Date Range Picker"
          aria-expanded={isOpen}
          title="Open Calendar Date Range Picker"
        >
          <CalendarDays size={15} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 font-semibold transition-all cursor-pointer rounded-full bg-[var(--admin-surface)] hover:bg-[var(--admin-elevated)] border border-white/10 text-white ${
            compact ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-xs"
          }`}
          aria-label="Select Period and Date Range"
          aria-expanded={isOpen}
        >
          <CalendarDays
            size={compact ? 12 : 14}
            className="text-[var(--admin-text-muted)] shrink-0"
          />
          <span className={`truncate ${compact ? "max-w-[130px] sm:max-w-[180px]" : "max-w-[210px] sm:max-w-[280px]"}`}>
            {customTriggerLabel || currentFilter.label}
          </span>
          {currentFilter.type !== "all" && (
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--admin-success)]"
              title="Active date filter"
            />
          )}
          <ChevronDown size={compact ? 11 : 13} className="text-[var(--admin-text-muted)] shrink-0" />
        </button>
      )}

      {/* Popover */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-[320px] sm:w-[410px] z-50 text-xs overflow-hidden animate-in fade-in zoom-in-95 duration-150 bg-[var(--admin-elevated)] text-white rounded-[28px] border border-white/10 p-5 ${
            align === "left" ? "left-0" : "right-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
            <div>
              <h3 className="font-heading font-bold text-sm text-white">Select Period & Date Range</h3>
              <p className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">
                Current Store Date: <strong className="text-white">03 Oct 2026</strong>
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full hover:bg-white/10 text-[var(--admin-text-muted)] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-full mb-3 text-xs font-semibold bg-[var(--admin-surface-2)] border border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab("preset")}
              className={`py-1.5 rounded-full transition-all cursor-pointer text-center ${
                activeTab === "preset"
                  ? "bg-[var(--admin-surface)] text-white font-bold border border-white/10"
                  : "text-[var(--admin-text-muted)] hover:text-white"
              }`}
            >
              Quick Periods
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("day")}
              className={`py-1.5 rounded-full transition-all cursor-pointer text-center ${
                activeTab === "day"
                  ? "bg-[var(--admin-surface)] text-white font-bold border border-white/10"
                  : "text-[var(--admin-text-muted)] hover:text-white"
              }`}
            >
              Day-Wise
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              className={`py-1.5 rounded-full transition-all cursor-pointer text-center ${
                activeTab === "custom"
                  ? "bg-[var(--admin-surface)] text-white font-bold border border-white/10"
                  : "text-[var(--admin-text-muted)] hover:text-white"
              }`}
            >
              Custom Range
            </button>
          </div>

          {/* TAB 1: QUICK PERIODS */}
          {activeTab === "preset" && (
            <ScrollArea className="max-h-[320px] pr-1.5">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 text-[var(--admin-text-muted)]">
                  Standard Business Horizons
                </div>
                {presets.map((preset) => {
                  const isActive =
                    currentFilter.startDate === preset.start &&
                    currentFilter.endDate === preset.end &&
                    (currentFilter.type === preset.type || (preset.type === "all" && currentFilter.type === "all"));

                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        onSelectFilter({
                          type: preset.type,
                          label: preset.label,
                          startDate: preset.start,
                          endDate: preset.end,
                          singleDay: preset.type === "day" ? preset.start : undefined,
                        });
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-[14px] flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? "bg-[var(--admin-surface)] text-white font-semibold border border-white/10"
                          : "hover:bg-white/[0.06] text-white/90"
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-xs leading-tight">{preset.label}</div>
                        <div className={`text-[10px] mt-0.5 ${isActive ? "text-white/80" : "text-[var(--admin-text-muted)]"}`}>
                          {preset.sub}
                        </div>
                      </div>
                      {isActive && <Check size={14} className="text-[var(--admin-success)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* TAB 2: DAY-WISE (SINGLE DAY) */}
          {activeTab === "day" && (
            <ScrollArea className="max-h-[320px] pr-1.5">
              <div className="space-y-2">
                <div className="p-2.5 rounded-[14px] text-[11px] bg-[var(--admin-surface-2)] border border-white/5 text-[var(--admin-text-muted)]">
                  <span>Select any single date to view that exact day's orders, gross revenue, and fulfillment.</span>
                </div>

                {/* Quick Day Chips */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSelectDay("2026-10-03")}
                    className={`p-2.5 rounded-[14px] border text-left transition-all cursor-pointer ${
                      currentFilter.singleDay === "2026-10-03"
                        ? "bg-[var(--admin-surface)] text-white border-white/20 font-bold"
                        : "bg-[var(--admin-surface-2)] border-white/5 hover:bg-white/[0.06] text-white/90"
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Today</span>
                      <span className="w-2 h-2 rounded-full bg-[var(--admin-success)]" />
                    </div>
                    <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">03 Oct 2026</div>
                    <div className="text-[10px] font-heading font-bold tabular-nums text-[var(--admin-success)] mt-1">2 orders • ₹2,698</div>
                  </button>

                  <button
                    onClick={() => handleSelectDay("2026-10-02")}
                    className={`p-2.5 rounded-[14px] border text-left transition-all cursor-pointer ${
                      currentFilter.singleDay === "2026-10-02"
                        ? "bg-[var(--admin-surface)] text-white border-white/20 font-bold"
                        : "bg-[var(--admin-surface-2)] border-white/5 hover:bg-white/[0.06] text-white/90"
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Yesterday</span>
                      <span className="w-2 h-2 rounded-full bg-[var(--admin-warning)]" />
                    </div>
                    <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5">02 Oct 2026</div>
                    <div className="text-[10px] font-heading font-bold tabular-nums text-[var(--admin-success)] mt-1">1 order • ₹2,399</div>
                  </button>
                </div>

                {/* Day List by Transaction History */}
                <div className="text-[10px] uppercase font-bold tracking-wider px-1 pt-1 text-[var(--admin-text-muted)]">
                  Recorded Store Order Days
                </div>

                <div className="space-y-1">
                  {orderDaysSummary.map((item) => {
                    const isSelected = currentFilter.singleDay === item.dayStr;
                    return (
                      <button
                        key={item.dayStr}
                        onClick={() => handleSelectDay(item.dayStr)}
                        className={`w-full text-left p-2.5 rounded-[14px] flex items-center justify-between border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[var(--admin-surface)] text-white border-white/20 font-bold"
                            : "bg-[var(--admin-surface-2)] border-white/5 hover:bg-white/[0.06] text-white/90"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CalendarDays size={13} className={isSelected ? "text-[var(--admin-success)]" : "text-[var(--admin-text-muted)]"} />
                          <div>
                            <span className="font-semibold text-xs">{formatDayDisplay(item.dayStr)}</span>
                            <span className={`block text-[10px] ${isSelected ? "text-white/80" : "text-[var(--admin-text-muted)]"}`}>
                              {item.rawDate}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-heading font-bold tabular-nums block ${isSelected ? "text-[var(--admin-success)]" : "text-white"}`}>
                            ₹{item.revenue.toLocaleString("en-IN")}
                          </span>
                          <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-[var(--admin-text-muted)]"}`}>
                            {item.count} {item.count === 1 ? "order" : "orders"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          )}

          {/* TAB 3: CUSTOM RANGE (INTERACTIVE CALENDAR) */}
          {activeTab === "custom" && (
            <div className="space-y-3">
              {/* Range Preview Bar */}
              <div className="flex items-center justify-between p-2.5 rounded-[14px] text-xs bg-[var(--admin-surface-2)] border border-white/5 text-white">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[var(--admin-text-muted)] block">Start Date</span>
                  <strong className="font-mono text-xs text-white">
                    {customStart ? customStart : "Click day"}
                  </strong>
                </div>
                <ArrowRight size={14} className="text-[var(--admin-text-muted)]" />
                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-[var(--admin-text-muted)] block">End Date</span>
                  <strong className="font-mono text-xs text-white">
                    {customEnd ? customEnd : customStart ? customStart : "Click day"}
                  </strong>
                </div>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between px-1">
                <span className="font-heading font-bold text-sm text-white">
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-white/10 text-[var(--admin-text-muted)] hover:text-white"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:bg-white/10 text-[var(--admin-text-muted)] hover:text-white"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <span key={day} className="text-[10px] font-bold py-1 text-[var(--admin-text-muted)]">
                    {day}
                  </span>
                ))}

                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                  const isSelected = dateString === customStart || dateString === customEnd;
                  const isInRange =
                    customStart && customEnd && dateString >= customStart && dateString <= customEnd;
                  const hasOrders = orderDaysSummary.some((d) => d.dayStr === dateString);
                  const isToday = dateString === "2026-10-03";

                  return (
                    <button
                      key={dateString}
                      type="button"
                      onClick={() => handleCalendarDayClick(dateString)}
                      className={`h-8 w-full rounded-full text-xs font-semibold flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[var(--admin-primary)] text-white font-bold"
                          : isInRange
                          ? "bg-[var(--admin-primary)]/25 text-white font-bold rounded-none"
                          : isToday
                          ? "ring-1 ring-white/20 font-bold text-white bg-white/5"
                          : "hover:bg-white/[0.06] text-white/90"
                      }`}
                    >
                      <span>{dayNum}</span>
                      {hasOrders && (
                        <span
                          className={`w-1 h-1 rounded-full absolute bottom-1 ${
                            isSelected ? "bg-white" : "bg-[var(--admin-success)]"
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Range Confirmation Button */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="text-[11px] truncate text-[var(--admin-text-muted)]">
                  {customStart && customEnd
                    ? `${customStart} → ${customEnd}`
                    : customStart
                    ? `1 day: ${customStart}`
                    : "Select 2 dates for range"}
                </span>
                <button
                  type="button"
                  onClick={handleApplyCustomRange}
                  disabled={!customStart}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold disabled:opacity-40 transition-colors cursor-pointer bg-[var(--admin-primary)] hover:bg-[var(--admin-primary-hover)] text-white"
                >
                  Apply Range
                </button>
              </div>
            </div>
          )}

          {/* Popover Footer */}
          <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-[var(--admin-text-muted)]">
            <button
              type="button"
              onClick={() => {
                onSelectFilter({
                  type: "all",
                  label: "All Time (Till Date)",
                  startDate: "2026-01-01",
                  endDate: "2026-10-03",
                });
                setIsOpen(false);
              }}
              className="font-semibold flex items-center gap-1 text-[var(--admin-success)] hover:underline cursor-pointer"
            >
              <RotateCcw size={12} /> Show All Time (Till Date)
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 rounded-full font-medium cursor-pointer transition-colors bg-[var(--admin-surface-2)] hover:bg-[var(--admin-surface)] text-[var(--admin-text-muted)] hover:text-white border border-white/5"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
