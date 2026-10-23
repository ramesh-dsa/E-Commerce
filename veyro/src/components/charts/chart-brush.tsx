"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChartStable } from "./chart-context";

export interface ChartBrushProps {
  /** Initial selected time window [start, end]. */
  initialSelection?: [Date, Date];
  /** Callback fired whenever the brush selection bounds change. */
  onSelectionChange?: (selection: [Date, Date] | null) => void;
  /** Minimum selection span in milliseconds. Default: 2 days. */
  minSpanMs?: number;
  className?: string;
}

type DragMode = "left" | "right" | "move";

interface DragState {
  mode: DragMode;
  startX: number;
  origLeft: number;
  origRight: number;
}

export function ChartBrush({
  initialSelection,
  onSelectionChange,
  minSpanMs = 2 * 24 * 60 * 60 * 1000, // 2 days min span
}: ChartBrushProps) {
  const { xScale, innerWidth, innerHeight, data, xAccessor, margin } = useChartStable();

  const domain = useMemo(() => {
    if (!xScale) return null;
    const d = xScale.domain();
    if (!d || d.length < 2) return null;
    return [new Date(d[0]), new Date(d[1])] as [Date, Date];
  }, [xScale]);

  // Internal selection state
  const [selection, setSelection] = useState<[Date, Date]>(() => {
    if (initialSelection) return initialSelection;
    if (domain) return domain;
    if (data && data.length > 0) {
      const first = xAccessor(data[0]);
      const last = xAccessor(data[data.length - 1]);
      return [first, last];
    }
    return [new Date(), new Date()];
  });

  // Sync when initialSelection changes from parent
  useEffect(() => {
    if (initialSelection) {
      setSelection(initialSelection);
    }
  }, [initialSelection]);

  const [dragState, setDragState] = useState<DragState | null>(null);
  const activePointerId = useRef<number | null>(null);

  // Pixel coordinates for left and right edges
  const [leftX, rightX] = useMemo(() => {
    if (!xScale || innerWidth <= 0) return [0, innerWidth];
    const x0 = xScale(selection[0]);
    const x1 = xScale(selection[1]);
    const l = Math.max(0, Math.min(innerWidth, Math.min(x0, x1)));
    const r = Math.max(0, Math.min(innerWidth, Math.max(x0, x1)));
    return [l, r];
  }, [xScale, innerWidth, selection]);

  const boxWidth = Math.max(0, rightX - leftX);

  // Minimum selection width in pixels
  const minWidthPx = useMemo(() => {
    if (!domain || innerWidth <= 0) return 20;
    const totalMs = domain[1].getTime() - domain[0].getTime();
    if (totalMs <= 0) return 20;
    return Math.max(16, (minSpanMs / totalMs) * innerWidth);
  }, [domain, innerWidth, minSpanMs]);

  // Handle pointer down on handles or window
  const startDrag = useCallback(
    (mode: DragMode, e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      activePointerId.current = e.pointerId;
      try {
        (e.target as Element).setPointerCapture(e.pointerId);
      } catch {
        // Fallback if pointer capture is not supported
      }
      setDragState({
        mode,
        startX: e.clientX,
        origLeft: leftX,
        origRight: rightX,
      });
    },
    [leftX, rightX]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState || !xScale || innerWidth <= 0) return;
      e.preventDefault();
      const delta = e.clientX - dragState.startX;

      let newLeft = dragState.origLeft;
      let newRight = dragState.origRight;

      if (dragState.mode === "left") {
        newLeft = Math.max(0, Math.min(dragState.origRight - minWidthPx, dragState.origLeft + delta));
      } else if (dragState.mode === "right") {
        newRight = Math.max(dragState.origLeft + minWidthPx, Math.min(innerWidth, dragState.origRight + delta));
      } else if (dragState.mode === "move") {
        const curWidth = dragState.origRight - dragState.origLeft;
        newLeft = Math.max(0, Math.min(innerWidth - curWidth, dragState.origLeft + delta));
        newRight = newLeft + curWidth;
      }

      const newStartDate = xScale.invert(newLeft);
      const newEndDate = xScale.invert(newRight);

      const nextSelection: [Date, Date] = [newStartDate, newEndDate];
      setSelection(nextSelection);
      onSelectionChange?.(nextSelection);
    },
    [dragState, xScale, innerWidth, minWidthPx, onSelectionChange]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (dragState) {
        try {
          (e.target as Element).releasePointerCapture(e.pointerId);
        } catch {
          // Ignore
        }
        setDragState(null);
        activePointerId.current = null;
      }
    },
    [dragState]
  );

  // Double click resets to full domain
  const handleDoubleClick = useCallback(() => {
    if (domain) {
      setSelection(domain);
      onSelectionChange?.(null);
    }
  }, [domain, onSelectionChange]);

  if (!xScale || innerWidth <= 0 || innerHeight <= 0) {
    return null;
  }

  const handleHeight = Math.min(28, Math.max(18, innerHeight * 0.7));

  return (
    <g
      className="chart-brush select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* Dimmed left mask */}
      {leftX > 0 && (
        <rect
          x={0}
          y={0}
          width={leftX}
          height={innerHeight}
          fill="rgba(0, 0, 0, 0.55)"
          className="transition-colors pointer-events-auto cursor-pointer"
          onClick={(e) => {
            const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
            const clickX = e.clientX - rect.left - (margin?.left ?? 0);
            const newLeft = Math.max(0, clickX - boxWidth / 2);
            const newRight = Math.min(innerWidth, newLeft + boxWidth);
            const next: [Date, Date] = [xScale.invert(newLeft), xScale.invert(newRight)];
            setSelection(next);
            onSelectionChange?.(next);
          }}
        >
          <title>Click to shift window</title>
        </rect>
      )}

      {/* Dimmed right mask */}
      {rightX < innerWidth && (
        <rect
          x={rightX}
          y={0}
          width={Math.max(0, innerWidth - rightX)}
          height={innerHeight}
          fill="rgba(0, 0, 0, 0.55)"
          className="transition-colors pointer-events-auto cursor-pointer"
          onClick={(e) => {
            const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
            const clickX = e.clientX - rect.left - (margin?.left ?? 0);
            const newLeft = Math.max(0, clickX - boxWidth / 2);
            const newRight = Math.min(innerWidth, newLeft + boxWidth);
            const next: [Date, Date] = [xScale.invert(newLeft), xScale.invert(newRight)];
            setSelection(next);
            onSelectionChange?.(next);
          }}
        >
          <title>Click to shift window</title>
        </rect>
      )}

      {/* Highlighted active window */}
      <rect
        x={leftX}
        y={0}
        width={boxWidth}
        height={innerHeight}
        fill="rgba(124, 58, 237, 0.08)"
        stroke="#7C3AED"
        strokeOpacity="0.45"
        strokeWidth="1.5"
        rx="4"
        className="pointer-events-none"
      />

      {/* Moveable window drag area */}
      {boxWidth > 16 && (
        <rect
          x={leftX + 8}
          y={0}
          width={Math.max(0, boxWidth - 16)}
          height={innerHeight}
          fill="transparent"
          className="cursor-grab active:cursor-grabbing pointer-events-auto"
          onPointerDown={(e) => startDrag("move", e)}
        />
      )}

      {/* Left Handle */}
      <g className="chart-brush-handle-left pointer-events-auto">
        {/* Left vertical border line */}
        <line
          x1={leftX}
          y1={0}
          x2={leftX}
          y2={innerHeight}
          stroke="#7C3AED"
          strokeWidth="1.5"
          className="pointer-events-none"
        />
        {/* Left pill button */}
        <g
          transform={`translate(${leftX}, ${innerHeight / 2})`}
          className="cursor-ew-resize pointer-events-none"
        >
          <rect
            x={-5}
            y={-handleHeight / 2}
            width={10}
            height={handleHeight}
            rx={4}
            fill="#FFFFFF"
            stroke="#7C3AED"
            strokeWidth="1"
            className="filter drop-shadow-sm"
          />
          <line
            x1={-1.5}
            y1={-5}
            x2={-1.5}
            y2={5}
            stroke="#71717A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1={1.5}
            y1={-5}
            x2={1.5}
            y2={5}
            stroke="#71717A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
        {/* Generous touch/pointer capture zone */}
        <rect
          x={leftX - 12}
          y={0}
          width={24}
          height={innerHeight}
          fill="transparent"
          className="cursor-ew-resize pointer-events-auto"
          onPointerDown={(e) => startDrag("left", e)}
        />
      </g>

      {/* Right Handle */}
      <g className="chart-brush-handle-right pointer-events-auto">
        {/* Right vertical border line */}
        <line
          x1={rightX}
          y1={0}
          x2={rightX}
          y2={innerHeight}
          stroke="#7C3AED"
          strokeWidth="1.5"
          className="pointer-events-none"
        />
        {/* Right pill button */}
        <g
          transform={`translate(${rightX}, ${innerHeight / 2})`}
          className="cursor-ew-resize pointer-events-none"
        >
          <rect
            x={-5}
            y={-handleHeight / 2}
            width={10}
            height={handleHeight}
            rx={4}
            fill="#FFFFFF"
            stroke="#7C3AED"
            strokeWidth="1"
            className="filter drop-shadow-sm"
          />
          <line
            x1={-1.5}
            y1={-5}
            x2={-1.5}
            y2={5}
            stroke="#71717A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1={1.5}
            y1={-5}
            x2={1.5}
            y2={5}
            stroke="#71717A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </g>
        {/* Generous touch/pointer capture zone */}
        <rect
          x={rightX - 12}
          y={0}
          width={24}
          height={innerHeight}
          fill="transparent"
          className="cursor-ew-resize pointer-events-auto"
          onPointerDown={(e) => startDrag("right", e)}
        />
      </g>
    </g>
  );
}

ChartBrush.displayName = "ChartBrush";
