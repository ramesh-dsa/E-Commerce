"use client";

import {
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface LegendItemData {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
}

export interface LegendContextValue {
  items: LegendItemData[];
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  selectedIndex?: number | null;
  onSelectItem?: (index: number | null, item: LegendItemData) => void;
}

export interface LegendItemContextValue {
  item: LegendItemData;
  index: number;
  isHovered: boolean;
  isFaded: boolean;
  isSelected: boolean;
  percentage: number;
}

const LegendContext = createContext<LegendContextValue | null>(null);
const LegendItemContext = createContext<LegendItemContextValue | null>(null);

export function useLegend(): LegendContextValue {
  const context = useContext(LegendContext);
  if (!context) {
    throw new Error("useLegend must be used within a <Legend> component.");
  }
  return context;
}

export function useLegendItem(): LegendItemContextValue {
  const context = useContext(LegendItemContext);
  if (!context) {
    throw new Error("useLegendItem must be used within a <LegendItem> component.");
  }
  return context;
}

export interface LegendProps {
  items: LegendItemData[];
  hoveredIndex?: number | null;
  onHoverChange?: (index: number | null) => void;
  selectedIndex?: number | null;
  onSelectItem?: (index: number | null, item: LegendItemData) => void;
  title?: string;
  titleClassName?: string;
  className?: string;
  children: ReactElement;
}

export function Legend({
  items,
  hoveredIndex: controlledHoveredIndex,
  onHoverChange,
  selectedIndex,
  onSelectItem,
  title,
  titleClassName = "text-sm font-semibold",
  className = "",
  children,
}: LegendProps) {
  const [internalHoveredIndex, setInternalHoveredIndex] = useState<number | null>(null);

  const isControlled = controlledHoveredIndex !== undefined;
  const hoveredIndex = isControlled ? controlledHoveredIndex : internalHoveredIndex;

  const setHoveredIndex = (index: number | null) => {
    if (isControlled) {
      onHoverChange?.(index);
    } else {
      setInternalHoveredIndex(index);
    }
  };

  const contextValue = useMemo(
    () => ({
      items,
      hoveredIndex,
      setHoveredIndex,
      selectedIndex,
      onSelectItem,
    }),
    [items, hoveredIndex, selectedIndex, onSelectItem]
  );

  return (
    <LegendContext.Provider value={contextValue}>
      <div className={cn("legend-container flex flex-col gap-2.5", className)}>
        {title && (
          <h3 className={cn("text-neutral-900 font-semibold mb-1 text-sm tracking-tight", titleClassName)}>
            {title}
          </h3>
        )}
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const isFaded = hoveredIndex !== null && hoveredIndex !== index;
          const isSelected = selectedIndex === index;
          const percentage = item.maxValue && item.maxValue > 0 ? (item.value / item.maxValue) * 100 : 0;

          const itemContext: LegendItemContextValue = {
            item,
            index,
            isHovered,
            isFaded,
            isSelected,
            percentage,
          };

          if (isValidElement(children)) {
            return (
              <LegendItemContext.Provider key={item.label} value={itemContext}>
                {cloneElement(children)}
              </LegendItemContext.Provider>
            );
          }

          return null;
        })}
      </div>
    </LegendContext.Provider>
  );
}

Legend.displayName = "Legend";

export interface LegendItemProps {
  className?: string;
  selectedClassName?: string;
  children: ReactNode;
  onClick?: () => void;
}

export function LegendItem({ className = "", selectedClassName = "", children, onClick }: LegendItemProps) {
  const { setHoveredIndex, onSelectItem } = useLegend();
  const { index, isHovered, isFaded, isSelected, item } = useLegendItem();

  const handleClick = () => {
    onClick?.();
    onSelectItem?.(isSelected ? null : index, item);
  };

  return (
    <button
      type="button"
      className={cn(
        "w-full cursor-pointer rounded-[14px] px-2.5 py-1.5 transition-all duration-200 text-left outline-none select-none",
        isSelected
          ? (selectedClassName || "bg-white/10 font-bold border border-white/15")
          : isHovered
          ? "bg-white/[0.04] scale-[1.01]"
          : "hover:bg-white/[0.02]",
        isFaded && "opacity-50",
        className
      )}
      data-hovered={isHovered ? "" : undefined}
      data-selected={isSelected ? "" : undefined}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

LegendItem.displayName = "LegendItem";

export interface LegendLabelProps {
  className?: string;
}

export function LegendLabel({ className = "text-sm font-semibold" }: LegendLabelProps) {
  const { item, isSelected } = useLegendItem();

  return (
    <span
      className={cn(
        "text-neutral-800 whitespace-nowrap transition-colors",
        isSelected && "text-neutral-900 font-bold",
        className
      )}
    >
      {item.label}
    </span>
  );
}

LegendLabel.displayName = "LegendLabel";

export interface LegendMarkerProps {
  className?: string;
}

export function LegendMarker({ className = "h-2.5 w-2.5" }: LegendMarkerProps) {
  const { item, isHovered } = useLegendItem();

  const color = item.color || "#10b981";

  return (
    <span
      className={cn("shrink-0 rounded-full transition-transform duration-200", className)}
      style={{
        backgroundColor: color,
        boxShadow: isHovered ? `0 0 8px ${color}80` : "none",
        transform: isHovered ? "scale(1.2)" : "scale(1)",
      }}
    />
  );
}

LegendMarker.displayName = "LegendMarker";

export interface LegendProgressProps {
  trackClassName?: string;
  indicatorClassName?: string;
  height?: string;
}

export function LegendProgress({
  trackClassName = "",
  indicatorClassName = "",
  height = "h-1.5",
}: LegendProgressProps) {
  const { item, percentage, isHovered } = useLegendItem();
  const color = item.color || "#10b981";

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-neutral-100 mt-1 transition-colors",
        height,
        trackClassName
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", indicatorClassName)}
        style={{
          width: `${Math.min(100, Math.max(0, percentage))}%`,
          backgroundColor: color,
          filter: isHovered ? `drop-shadow(0 0 4px ${color})` : "none",
        }}
      />
    </div>
  );
}

LegendProgress.displayName = "LegendProgress";

export interface LegendValueProps {
  className?: string;
  showPercentage?: boolean;
  percentageClassName?: string;
  formatValue?: (value: number) => string;
  formatPercentage?: (percentage: number) => string;
}

export function LegendValue({
  className = "text-sm tabular-nums",
  showPercentage = true,
  percentageClassName = "text-xs text-neutral-400 tabular-nums font-normal",
  formatValue = (v) => v.toLocaleString(),
  formatPercentage = (p) => `${p.toFixed(1)}%`,
}: LegendValueProps) {
  const { item, percentage } = useLegendItem();

  return (
    <div className={cn("flex items-center gap-3 shrink-0 text-neutral-900 font-bold ml-auto", className)}>
      <span>{formatValue(item.value)}</span>
      {showPercentage && (
        <span className={percentageClassName}>{formatPercentage(percentage)}</span>
      )}
    </div>
  );
}

LegendValue.displayName = "LegendValue";
