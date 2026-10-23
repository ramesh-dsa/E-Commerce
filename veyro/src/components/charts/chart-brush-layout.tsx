"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ChartBrushLayoutState {
  /** The currently selected [startDate, endDate] range, or null if full range. */
  brushSelection: [Date, Date] | null;
  /** Callback to update the selection range. */
  onBrushSelectionChange: (selection: [Date, Date] | null) => void;
  /** Active xDomain to pass directly to the main AreaChart. */
  xDomain: [Date, Date] | undefined;
  /** Dataset length for x-scale padding when zoomed. */
  xDomainSlotCount: number | undefined;
}

export interface ChartBrushLayoutProps {
  /** Full dataset provided to both main chart and mini brush strip. */
  data: Record<string, unknown>[];
  /** Key inside data for the x-axis (date). Default: "date" */
  xDataKey?: string;
  /** Whether the brush strip zoom layout is active. */
  enabled?: boolean;
  /** Height in pixels of the mini-chart brush strip. Default: 72 */
  height?: number;
  /** Optional initial selection [startDate, endDate]. */
  defaultSelection?: [Date, Date];
  /** Additional container CSS class names. */
  className?: string;
  /** Additional container inline styles. */
  style?: CSSProperties;
  /** Render function returning the mini-chart brush strip. */
  brushStrip?: (layout: ChartBrushLayoutState) => ReactNode;
  /** Render function returning the main interactive chart. */
  children: (layout: ChartBrushLayoutState) => ReactNode;
}

export function ChartBrushLayout({
  data,
  enabled = true,
  height = 72,
  defaultSelection,
  className,
  style,
  brushStrip,
  children,
}: ChartBrushLayoutProps) {
  const [brushSelection, setBrushSelection] = useState<[Date, Date] | null>(
    () => defaultSelection ?? null
  );

  // Reset brush selection if the dataset identity changes (e.g., period toggle 7d/30d/90d)
  const dataRangeKey = useMemo(() => {
    if (!data || data.length === 0) return "";
    const first = data[0];
    const last = data[data.length - 1];
    const firstKey = (first as Record<string, unknown>)?.dateStr ?? (first as Record<string, unknown>)?.date ?? "";
    const lastKey = (last as Record<string, unknown>)?.dateStr ?? (last as Record<string, unknown>)?.date ?? "";
    return `${firstKey}-${lastKey}-${data.length}`;
  }, [data]);

  const prevKeyRef = useRef(dataRangeKey);
  useEffect(() => {
    if (prevKeyRef.current !== dataRangeKey) {
      prevKeyRef.current = dataRangeKey;
      setBrushSelection(defaultSelection ?? null);
    }
  }, [dataRangeKey, defaultSelection]);

  const layoutState: ChartBrushLayoutState = useMemo(() => {
    return {
      brushSelection,
      onBrushSelectionChange: (selection: [Date, Date] | null) => {
        setBrushSelection(selection);
      },
      xDomain: brushSelection ?? undefined,
      xDomainSlotCount: data?.length || undefined,
    };
  }, [brushSelection, data?.length]);

  return (
    <div
      className={cn("chart-brush-layout flex flex-col gap-3.5 w-full select-none", className)}
      style={{
        ["--chart-line-primary" as string]: "#7C3AED",
        ["--chart-crosshair" as string]: "#7C3AED",
        ...style,
      }}
    >
      {/* 1. Main interactive chart */}
      <div className="chart-brush-main w-full min-w-0">
        {children(layoutState)}
      </div>

      {/* 2. Mini timeline overview brush strip */}
      {enabled && brushStrip && (
        <div
          className="chart-brush-strip w-full min-w-0 relative rounded-[14px] bg-[var(--admin-surface-2)] border border-white/5 overflow-hidden px-2 pt-1 pb-1 [&>div]:!h-full [&>div]:!aspect-auto"
          style={{ height }}
        >
          {brushStrip(layoutState)}
        </div>
      )}
    </div>
  );
}

export default ChartBrushLayout;
