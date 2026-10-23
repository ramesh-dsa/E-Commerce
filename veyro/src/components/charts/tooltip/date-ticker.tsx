"use client";

import { type MotionValue, motion, useSpring } from "motion/react";
import { memo, type RefObject, useEffect, useLayoutEffect, useMemo, useRef } from "react";

const TICKER_ITEM_HEIGHT = 24;
const TICKER_SPRING = { stiffness: 400, damping: 35 };
/** Full scroll stacks are skipped above this count — single label + instant updates. */
const COMPACT_TICKER_THRESHOLD = 60;

/**
 * Widths of a stack's `[data-ticker-item]` children, re-measured when the
 * items or loaded fonts change. Drives `width` toward the active item so the
 * pill hugs the current label instead of the longest one.
 */
function useActiveItemWidth(
  stackRef: RefObject<HTMLElement | null>,
  items: readonly unknown[],
  activeIndex: number,
  width: MotionValue<number>
) {
  const widthsRef = useRef<number[]>([]);
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // biome-ignore lint/correctness/useExhaustiveDependencies: items change the rendered stack, so re-measure
  useLayoutEffect(() => {
    let cancelled = false;
    const measure = (snap: boolean) => {
      const stack = stackRef.current;
      if (cancelled || !stack) {
        return;
      }
      widthsRef.current = Array.from(
        stack.querySelectorAll<HTMLElement>("[data-ticker-item]"),
        (node) => Math.max(14, Math.ceil(node.getBoundingClientRect().width) + 2)
      );
      const next = widthsRef.current[activeIndexRef.current];
      if (next === undefined) {
        return;
      }
      // First measure snaps so the pill never grows in from zero.
      if (snap) {
        width.jump(next);
      } else {
        width.set(next);
      }
    };
    measure(widthsRef.current.length === 0);
    document.fonts?.ready.then(() => measure(false));
    return () => {
      cancelled = true;
    };
  }, [stackRef, items, width]);

  const target = widthsRef.current[activeIndex];
  if (target !== undefined) {
    width.set(target);
  }
}

export interface DateTickerProps {
  currentIndex: number;
  labels: string[];
  visible: boolean;
}

const DateTickerCompact = memo(function DateTickerCompact({
  currentIndex,
  labels,
}: Omit<DateTickerProps, "visible">) {
  const safeIndex = Math.max(0, Math.min(currentIndex, labels.length - 1));
  const label = labels[safeIndex] ?? labels[0] ?? "";
  const labelItems = useMemo(() => [label], [label]);
  const stackRef = useRef<HTMLDivElement>(null);
  const width = useSpring(48, TICKER_SPRING);
  useActiveItemWidth(stackRef, labelItems, 0, width);

  return (
    <div className="overflow-hidden rounded-full bg-white px-3.5 py-0.5 text-zinc-950 shadow-xl border border-white/60">
      <motion.div className="relative h-6" style={{ width }}>
        <motion.div
          className="absolute top-0 left-1/2 flex h-6 items-center"
          ref={stackRef}
          style={{ x: "-50%" }}
        >
          <span
            className="whitespace-nowrap font-bold text-xs text-zinc-950 leading-none"
            data-ticker-item
          >
            {label}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
});

const DateTickerInner = memo(function DateTickerInner({
  currentIndex,
  labels,
}: Omit<DateTickerProps, "visible">) {
  const safeIndex = Math.max(0, Math.min(currentIndex, labels.length - 1));

  // Parse labels into month and day parts
  const parsedLabels = useMemo(() => {
    return labels.map((label, index) => {
      const parts = label.trim().split(/\s+/);
      let month = "";
      let day = "";
      if (parts.length >= 2) {
        month = parts[0];
        day = parts.slice(1).join(" ");
      } else if (parts.length === 1) {
        if (/^\d+$/.test(parts[0])) {
          day = parts[0];
        } else {
          month = parts[0];
        }
      }
      return { month, day, full: label, key: `${label}::${index}` };
    });
  }, [labels]);

  // Month segments: one entry per consecutive run (Jan → Feb → …), keyed by start index
  const monthSegments = useMemo(() => {
    const segments: { month: string; key: string; startIndex: number }[] = [];

    parsedLabels.forEach((label, index) => {
      const prev = segments.at(-1);
      if (!prev || prev.month !== label.month) {
        segments.push({
          month: label.month,
          key: `${label.month}-${index}`,
          startIndex: index,
        });
      }
    });

    return segments;
  }, [parsedLabels]);

  // Index into monthSegments for the current data point
  const currentMonthIndex = useMemo(() => {
    if (safeIndex < 0 || safeIndex >= parsedLabels.length) {
      return 0;
    }
    for (let i = monthSegments.length - 1; i >= 0; i--) {
      const segment = monthSegments[i];
      if (segment && segment.startIndex <= safeIndex) {
        return i;
      }
    }
    return 0;
  }, [safeIndex, parsedLabels.length, monthSegments]);

  // Animated Y offsets initialized at target so they don't scroll from 0 on first render
  const initialDayY = -safeIndex * TICKER_ITEM_HEIGHT;
  const initialMonthY = -currentMonthIndex * TICKER_ITEM_HEIGHT;
  const dayY = useSpring(initialDayY, TICKER_SPRING);
  const monthY = useSpring(initialMonthY, TICKER_SPRING);

  // Each stack's width follows its active item, so the pill resizes per label.
  const monthStackRef = useRef<HTMLDivElement>(null);
  const dayStackRef = useRef<HTMLDivElement>(null);
  const monthWidth = useSpring(32, TICKER_SPRING);
  const dayWidth = useSpring(20, TICKER_SPRING);

  useActiveItemWidth(
    monthStackRef,
    monthSegments,
    currentMonthIndex,
    monthWidth
  );
  useActiveItemWidth(dayStackRef, parsedLabels, safeIndex, dayWidth);

  // Smoothly roll numbers as user moves between data points
  dayY.set(-safeIndex * TICKER_ITEM_HEIGHT);

  useEffect(() => {
    if (currentMonthIndex >= 0) {
      monthY.set(-currentMonthIndex * TICKER_ITEM_HEIGHT);
    }
  }, [currentMonthIndex, monthY]);

  return (
    <div className="overflow-hidden rounded-full bg-white px-3.5 py-0.5 text-zinc-950 shadow-xl border border-white/60">
      <div className="relative h-6 overflow-hidden">
        <div className="flex items-center justify-center gap-1">
          {/* Month stack */}
          <motion.div
            className="relative h-6 overflow-hidden"
            style={{ width: monthWidth }}
          >
            <motion.div
              className="absolute top-0 left-1/2 flex flex-col items-center"
              ref={monthStackRef}
              style={{ x: "-50%", y: monthY }}
            >
              {monthSegments.map((segment) => (
                <div
                  className="flex h-6 shrink-0 items-center justify-center"
                  data-ticker-item
                  key={segment.key}
                >
                  <span className="whitespace-nowrap font-bold text-xs text-zinc-950 leading-none">
                    {segment.month}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Day stack */}
          <motion.div
            className="relative h-6 overflow-hidden"
            style={{ width: dayWidth }}
          >
            <motion.div
              className="absolute top-0 left-1/2 flex flex-col items-center"
              ref={dayStackRef}
              style={{ x: "-50%", y: dayY }}
            >
              {parsedLabels.map((label) => (
                <div
                  className="flex h-6 shrink-0 items-center justify-center"
                  data-ticker-item
                  key={label.key}
                >
                  <span className="whitespace-nowrap font-bold text-xs text-zinc-950 leading-none">
                    {label.day}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
});

export function DateTicker({ currentIndex, labels, visible }: DateTickerProps) {
  if (!visible || labels.length === 0) {
    return null;
  }

  if (labels.length > COMPACT_TICKER_THRESHOLD) {
    return <DateTickerCompact currentIndex={currentIndex} labels={labels} />;
  }

  return <DateTickerInner currentIndex={currentIndex} labels={labels} />;
}

DateTicker.displayName = "DateTicker";

export default DateTicker;
