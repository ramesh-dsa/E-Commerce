"use client";

import { memo, useMemo } from "react";
import { createPortal } from "react-dom";
import { useChartStable, useYScale } from "./chart-context";
import { cn } from "@/lib/utils";

export interface YAxisProps {
  /** Number of tick marks to generate. Default: 4 */
  numTicks?: number;
  /** Custom formatter function for tick label. */
  tickFormat?: (value: number) => string;
  /** Y-scale group ID. Default: primary left axis. */
  yAxisId?: string | number;
  /** Additional class name for container. */
  className?: string;
  /** Explicit tick values to show. Overrides numTicks. */
  tickValues?: number[];
}

export const YAxis = memo(function YAxis({
  numTicks = 4,
  tickFormat,
  yAxisId,
  className,
  tickValues: tickValuesProp,
}: YAxisProps) {
  const { margin, containerRef } = useChartStable();
  const yScale = useYScale(yAxisId);

  const ticks = useMemo(() => {
    if (!yScale) return [];
    const values =
      tickValuesProp ??
      (typeof yScale.ticks === "function" ? yScale.ticks(numTicks) : []);
    return values.map((val: number) => ({
      value: val,
      y: margin.top + yScale(val),
    }));
  }, [yScale, numTicks, margin.top, tickValuesProp]);

  const container = containerRef.current;
  if (!container || ticks.length === 0) return null;

  return createPortal(
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none z-10",
        className
      )}
      aria-hidden="true"
    >
      {ticks.map((tick, i) => {
        const label = tickFormat
          ? tickFormat(tick.value)
          : tick.value >= 1000
          ? `${(tick.value / 1000).toFixed(0)}k`
          : `${tick.value}`;

        return (
          <div
            key={`${tick.value}-${i}`}
            className="absolute -translate-y-1/2 text-right text-xs font-semibold text-zinc-300 tabular-nums"
            style={{
              left: 4,
              width: Math.max(24, margin.left - 12),
              top: tick.y,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>,
    container
  );
});

YAxis.displayName = "YAxis";

export default YAxis;
