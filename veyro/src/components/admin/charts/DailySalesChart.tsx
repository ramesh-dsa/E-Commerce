"use client";

import React, { useId, useMemo, useRef, useState, useEffect } from "react";
import { line as d3Line, area as d3Area, curveMonotoneX } from "d3-shape";

export interface DailySalesChartDayItem {
  date: string;
  label: string;
  count: number;
  totalRevenue: number;
  deliveredCount?: number;
  aov?: number;
}

export interface DailySalesChartProps {
  days: DailySalesChartDayItem[];
  activeDate?: string | null;
  onSelectDay?: (date: string, label: string) => void;
  className?: string;
}

interface ContinuousPlotPoint {
  date: string;
  label: string;
  count: number;
  revenue: number;
  aov: number;
  hasOrders: boolean;
  x: number;
  y: number;
}

const MONTH_NAMES_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatDayLabel(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  return `${d} ${MONTH_NAMES_SHORT[(m || 1) - 1]}`;
}

export function DailySalesChart({
  days,
  activeDate,
  onSelectDay,
  className = "",
}: DailySalesChartProps) {
  const gradientId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Measure container width via ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.floor(entry.contentRect.width);
        if (w > 0) {
          setContainerWidth(w);
        }
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 1. Sort recorded days chronologically (oldest to newest)
  const chronologicalRecordedDays = useMemo(() => {
    return [...days].sort((a, b) => a.date.localeCompare(b.date));
  }, [days]);

  // 2. Generate Continuous UTC Calendar Days
  const continuousCalendarDays = useMemo(() => {
    if (chronologicalRecordedDays.length === 0) return [];
    if (chronologicalRecordedDays.length === 1) {
      const single = chronologicalRecordedDays[0];
      return [
        {
          date: single.date,
          label: single.label || formatDayLabel(single.date),
          count: single.count,
          revenue: single.totalRevenue,
          aov: single.aov || (single.count > 0 ? Math.round(single.totalRevenue / single.count) : 0),
          hasOrders: true,
        },
      ];
    }

    const firstDateStr = chronologicalRecordedDays[0].date;
    const lastDateStr = chronologicalRecordedDays[chronologicalRecordedDays.length - 1].date;

    const [firstY, firstM, firstD] = firstDateStr.split("-").map(Number);
    const [lastY, lastM, lastD] = lastDateStr.split("-").map(Number);

    const startUtc = Date.UTC(firstY, firstM - 1, firstD);
    const endUtc = Date.UTC(lastY, lastM - 1, lastD);
    const oneDayMs = 86_400_000;

    const recordedMap = new Map<string, DailySalesChartDayItem>();
    chronologicalRecordedDays.forEach((d) => recordedMap.set(d.date, d));

    const result: Array<{
      date: string;
      label: string;
      count: number;
      revenue: number;
      aov: number;
      hasOrders: boolean;
    }> = [];

    for (let time = startUtc; time <= endUtc; time += oneDayMs) {
      const d = new Date(time);
      const y = d.getUTCFullYear();
      const m = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      const dateKey = `${y}-${m}-${day}`;

      const rec = recordedMap.get(dateKey);
      if (rec) {
        result.push({
          date: rec.date,
          label: rec.label || formatDayLabel(rec.date),
          count: rec.count,
          revenue: rec.totalRevenue,
          aov: rec.aov || (rec.count > 0 ? Math.round(rec.totalRevenue / rec.count) : 0),
          hasOrders: true,
        });
      } else {
        result.push({
          date: dateKey,
          label: formatDayLabel(dateKey),
          count: 0,
          revenue: 0,
          aov: 0,
          hasOrders: false,
        });
      }
    }

    return result;
  }, [chronologicalRecordedDays]);

  // 3. Y Scale Max with 8% headroom
  const maxRecordedRevenue = useMemo(() => {
    if (days.length === 0) return 0;
    return Math.max(...days.map((d) => d.totalRevenue || 0), 0);
  }, [days]);

  const yMax = useMemo(() => {
    if (maxRecordedRevenue <= 0) return 1;
    return maxRecordedRevenue * 1.08;
  }, [maxRecordedRevenue]);

  // Dimensions & Padding
  // Total container height: h-40 (160px) below sm, h-48 (192px) on desktop
  const isMobile = containerWidth > 0 && containerWidth < 640;
  const height = isMobile ? 160 : 192;
  const paddingLeft = 16;
  const paddingRight = 16;
  const paddingTop = 18;
  const paddingBottom = 32; // Reserved 32px for X tick labels and capsule

  const plotWidth = Math.max(0, containerWidth - paddingLeft - paddingRight);
  const plotHeight = Math.max(0, height - paddingTop - paddingBottom);

  // 4. Calculate coordinates for points
  const plotPoints: ContinuousPlotPoint[] = useMemo(() => {
    if (continuousCalendarDays.length === 0 || plotWidth <= 0 || plotHeight <= 0) return [];

    if (continuousCalendarDays.length === 1) {
      const item = continuousCalendarDays[0];
      const yFraction = Math.min(1, Math.max(0, item.revenue / yMax));
      return [
        {
          ...item,
          x: paddingLeft + plotWidth / 2,
          y: paddingTop + plotHeight - yFraction * plotHeight,
        },
      ];
    }

    const step = plotWidth / (continuousCalendarDays.length - 1);
    return continuousCalendarDays.map((item, index) => {
      const x = paddingLeft + index * step;
      const yFraction = Math.min(1, Math.max(0, item.revenue / yMax));
      const y = paddingTop + plotHeight - yFraction * plotHeight;
      return {
        ...item,
        x,
        y,
      };
    });
  }, [continuousCalendarDays, plotWidth, plotHeight, yMax, paddingLeft, paddingTop]);

  // 5. Generate D3 Line & Area Paths with curveMonotoneX
  const linePath = useMemo(() => {
    if (plotPoints.length < 2) return "";
    const gen = d3Line<ContinuousPlotPoint>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveMonotoneX);
    return gen(plotPoints) || "";
  }, [plotPoints]);

  const areaPath = useMemo(() => {
    if (plotPoints.length < 2) return "";
    const baselineY = paddingTop + plotHeight;
    const gen = d3Area<ContinuousPlotPoint>()
      .x((d) => d.x)
      .y0(baselineY)
      .y1((d) => d.y)
      .curve(curveMonotoneX);
    return gen(plotPoints) || "";
  }, [plotPoints, paddingTop, plotHeight]);

  // 6. X Ticks Selection (5 to 6 evenly spaced, 3 on mobile)
  const xTicks = useMemo(() => {
    if (plotPoints.length === 0) return [];
    if (plotPoints.length === 1) return [plotPoints[0]];

    const tickTarget = isMobile ? 3 : 5;
    const count = Math.min(plotPoints.length, tickTarget);
    const step = (plotPoints.length - 1) / (count - 1);

    const ticks: ContinuousPlotPoint[] = [];
    const usedIndices = new Set<number>();

    for (let i = 0; i < count; i++) {
      const idx = Math.round(i * step);
      if (!usedIndices.has(idx) && plotPoints[idx]) {
        usedIndices.add(idx);
        ticks.push(plotPoints[idx]);
      }
    }

    return ticks;
  }, [plotPoints, isMobile]);

  // Render Case 0: Empty State
  if (days.length === 0) {
    return (
      <div className={`h-40 sm:h-48 p-4 bg-[var(--admin-surface-2)] rounded-[14px] border border-white/5 flex items-center justify-center text-xs text-[var(--admin-text-muted)] ${className}`}>
        No sales activity recorded
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-40 sm:h-48 select-none overflow-visible ${className}`}
    >
      {containerWidth > 0 && (
        <svg
          width={containerWidth}
          height={height}
          viewBox={`0 0 ${containerWidth} ${height}`}
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--admin-primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--admin-primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* 3 Horizontal Grid lines (5% white opacity) */}
          {[0.25, 0.5, 0.75].map((ratio) => {
            const gridY = paddingTop + plotHeight * (1 - ratio);
            return (
              <line
                key={ratio}
                x1={paddingLeft}
                x2={paddingLeft + plotWidth}
                y1={gridY}
                y2={gridY}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Baseline boundary gridline at 0 */}
          <line
            x1={paddingLeft}
            x2={paddingLeft + plotWidth}
            y1={paddingTop + plotHeight}
            y2={paddingTop + plotHeight}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={1}
          />

          {/* Area fill (monotonic curve) */}
          {areaPath && <path d={areaPath} fill={`url(#${gradientId})`} />}

          {/* Stroke Line (monotonic curve) */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--admin-primary)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Small dots (r=3) only on days WITH recorded orders */}
          {plotPoints
            .filter((p) => p.hasOrders)
            .map((p) => {
              const isSelected = Boolean(activeDate && activeDate === p.date);
              return (
                <circle
                  key={p.date}
                  cx={p.x}
                  cy={p.y}
                  r={isSelected ? 4 : 3}
                  fill="var(--admin-primary)"
                  stroke={isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.2)"}
                  strokeWidth={isSelected ? 2 : 1}
                />
              );
            })}

          {/* X Tick Labels in reserved 32px bottom track */}
          {xTicks.map((tick) => {
            return (
              <text
                key={tick.date}
                x={tick.x}
                y={height - 10}
                textAnchor="middle"
                className="text-[11px] font-medium"
                fill="var(--admin-text-muted)"
              >
                {tick.label}
              </text>
            );
          })}
        </svg>
      )}
    </div>
  );
}
