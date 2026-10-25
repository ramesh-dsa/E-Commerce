"use client";

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from "react";
import {
  Sparkles,
  Shapes,
  Palette,
  Type,
  Ruler,
  Box,
  Activity,
  Layers,
  Component,
  Workflow,
  Languages,
  ArrowRightLeft,
  ListChecks,
} from "lucide-react";

export interface SectionItem {
  id: string;
  number: string;
  title: string;
  group: "Foundations" | "System" | "Application" | "Governance";
  icon: React.ElementType;
}

export const SECTIONS: SectionItem[] = [
  { id: "brand-essence", number: "01", title: "Brand Essence", group: "Foundations", icon: Sparkles },
  { id: "logo", number: "02", title: "Logo", group: "Foundations", icon: Shapes },
  { id: "color", number: "03", title: "Color", group: "Foundations", icon: Palette },
  { id: "typography", number: "04", title: "Typography", group: "Foundations", icon: Type },
  { id: "layout-spacing", number: "05", title: "Layout and Spacing", group: "System", icon: Ruler },
  { id: "shape-elevation", number: "06", title: "Shape and Elevation", group: "System", icon: Box },
  { id: "motion", number: "07", title: "Motion", group: "System", icon: Activity },
  { id: "z-index-ladder", number: "08", title: "Z-Index Ladder", group: "System", icon: Layers },
  { id: "components", number: "09", title: "Components", group: "Application", icon: Component },
  { id: "architecture", number: "10", title: "Architecture", group: "Application", icon: Workflow },
  { id: "accessibility", number: "11", title: "Accessibility", group: "Application", icon: Languages },
  { id: "transition-guidance", number: "12", title: "Transition Guidance", group: "Governance", icon: ArrowRightLeft },
  { id: "quick-reference", number: "13", title: "Quick Reference", group: "Governance", icon: ListChecks },
];

export interface GuidelinesTreeSidebarProps {
  className?: string;
}

// Media query subscriptions for useSyncExternalStore
function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

/**
 * Tracks prefers-reduced-motion media query via useSyncExternalStore.
 */
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

/**
 * High-precision scroll-spy with multiple IntersectionObserver thresholds.
 */
function useScrollSpy(
  prefersReducedMotion: boolean
): [string, (id: string) => void] {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    // Deep-link hash sync on mount (async to prevent synchronous effect re-render)
    const rafInit = window.requestAnimationFrame(() => {
      if (window.location.hash) {
        const targetHash = window.location.hash.replace("#", "");
        if (SECTIONS.some((s) => s.id === targetHash)) {
          setActiveId(targetHash);
          const el = document.getElementById(targetHash);
          if (el) {
            el.scrollIntoView({
              behavior: prefersReducedMotion ? "auto" : "smooth",
              block: "start",
            });
          }
        }
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          // Sort by nearest to top threshold band
          intersecting.sort(
            (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top)
          );
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    // Anchor to section 13 when user reaches bottom of document
    const handleBottom = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom) {
        setActiveId(SECTIONS[SECTIONS.length - 1].id);
      }
    };

    window.addEventListener("scroll", handleBottom, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafInit);
      observer.disconnect();
      window.removeEventListener("scroll", handleBottom);
    };
  }, [prefersReducedMotion]);

  const navigateToSection = (id: string) => {
    setActiveId(id);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
      window.history.replaceState(null, "", `#${id}`);

      // Accessibility: Move keyboard focus to section heading
      const heading = target.querySelector("h2, h3, h1") as HTMLElement | null;
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
  };

  return [activeId, navigateToSection];
}

interface BranchedMenuLinesProps {
  count: number;
  activeIndex: number;
  prefersReducedMotion: boolean;
}

function BranchedMenuLines({ count, activeIndex, prefersReducedMotion }: BranchedMenuLinesProps) {
  const l = 11 + 30 * (count - 1);
  return (
    <svg
      className="absolute left-0 top-0 overflow-visible pointer-events-none"
      width={40}
      height={30 * count + 12}
      aria-hidden="true"
    >
      {/* Base vertical line */}
      <path
        d={`M 14 0 V ${l}`}
        fill="none"
        stroke="#E8E8E5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Base branch lines */}
      {Array.from({ length: count }, (_, t) => (
        <path
          key={`b-${t}`}
          d={`M 14 ${11 + 30 * t} A 10 10 0 0 0 24 ${11 + 30 * t + 10} H 32`}
          fill="none"
          stroke="#E8E8E5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* Active reach lines with animated stroke-dashoffset */}
      {Array.from({ length: count }, (_, t) => (
        <path
          key={`r-${t}`}
          d={`M 14 0 V ${11 + 30 * t} A 10 10 0 0 0 24 ${11 + 30 * t + 10} H 32`}
          fill="none"
          stroke="#111111"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: `${34.71 + 30 * t}`,
            strokeDashoffset: t === activeIndex ? 0 : 34.71 + 30 * t,
            transition: prefersReducedMotion
              ? "none"
              : "stroke-dashoffset 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        />
      ))}
    </svg>
  );
}

export default function GuidelinesTreeSidebar({ className = "" }: GuidelinesTreeSidebarProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeId, navigateToSection] = useScrollSpy(prefersReducedMotion);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Active section metadata
  const activeSection = useMemo(() => {
    return SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];
  }, [activeId]);

  // Group sections
  const groupedSections = useMemo(() => {
    const groups: { name: SectionItem["group"]; items: SectionItem[] }[] = [
      { name: "Foundations", items: [] },
      { name: "System", items: [] },
      { name: "Application", items: [] },
      { name: "Governance", items: [] },
    ];

    SECTIONS.forEach((s) => {
      const g = groups.find((grp) => grp.name === s.group);
      if (g) g.items.push(s);
    });

    return groups;
  }, []);

  // Lock body scroll and handle focus trap when mobile sheet is open
  useEffect(() => {
    if (sheetOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleSheetKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSheetOpen(false);
          openButtonRef.current?.focus();
        }
      };

      window.addEventListener("keydown", handleSheetKeyDown);
      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener("keydown", handleSheetKeyDown);
      };
    } else {
      openButtonRef.current?.focus();
    }
  }, [sheetOpen]);

  return (
    <>
      {/* ── Mobile & Tablet Sticky Bar (< lg) ── */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-neutral-200 px-4 py-3">
        <div className="flex items-center justify-between min-h-[44px]">
          <div className="flex items-center gap-2 truncate pr-3">
            {activeSection.icon && (
              <activeSection.icon
                size={14}
                className="text-[#111111] shrink-0"
                aria-hidden="true"
              />
            )}
            <span className="text-sm font-semibold text-[#111111] truncate">
              {activeSection.number} &nbsp;{activeSection.title}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono tabular-nums text-xs font-bold text-neutral-700">
              {activeSection.number} / {SECTIONS.length.toString().padStart(2, "0")}
            </span>
            <button
              ref={openButtonRef}
              type="button"
              onClick={() => setSheetOpen(true)}
              className="min-h-[44px] px-3.5 py-2 rounded-md bg-[#111111] text-white text-xs font-semibold hover:bg-neutral-900 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
            >
              Sections
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Modal Sheet (< lg) ── */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setSheetOpen(false)}
        >
          <div
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Sections navigation"
            className="w-full max-w-lg bg-white rounded-lg shadow-2xl p-5 max-h-[70vh] overflow-y-auto z-50 text-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Nav List */}
            <nav aria-label="Guidelines mobile sections">
              <div className="space-y-4">
                {groupedSections.map((group) => (
                  <div key={group.name} className="space-y-1">
                    <span className="text-xs uppercase tracking-wider text-neutral-700 font-bold block px-1">
                      {group.name}
                    </span>
                    <ul className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = activeId === item.id;
                        const ItemIcon = item.icon;
                        return (
                          <li key={item.id}>
                            <a
                              href={`#${item.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                navigateToSection(item.id);
                                setSheetOpen(false);
                              }}
                              className={`min-h-[44px] flex items-center gap-2.5 px-2 py-2 text-sm rounded-md transition-colors duration-200 ${
                                isActive
                                  ? "text-[#111111] font-semibold bg-neutral-100"
                                  : "text-neutral-700 hover:text-neutral-950 font-medium"
                              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2`}
                              aria-current={isActive ? "location" : undefined}
                            >
                              <ItemIcon
                                size={15}
                                strokeWidth={isActive ? 2 : 1.8}
                                className={`shrink-0 ${
                                  isActive ? "text-[#111111]" : "text-neutral-600"
                                }`}
                                aria-hidden="true"
                              />
                              <span className="font-mono text-xs text-neutral-500 font-medium shrink-0">
                                {item.number}
                              </span>
                              <span className="truncate">{item.title}</span>
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* ── Desktop Branched Tree Rail (>= lg) ── */}
      <aside
        className={`hidden lg:block lg:sticky lg:top-[max(6rem,calc(50vh-280px))] max-h-[calc(100vh-7rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-64 shrink-0 pb-16 pt-1 select-none ${className}`}
      >
        <p className="mb-3 pl-[14px] font-sans text-xs font-bold uppercase tracking-wider text-neutral-600 select-none">
          Contents
        </p>

        <nav aria-label="Guidelines sections" className="relative flex flex-col pl-[14px]">
          {/* Subtle vertical gradient spine on left */}
          <div
            className="absolute left-0 top-2 bottom-0 w-[2px] rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, #E8E8E5 0%, #E8E8E5 55%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          {groupedSections.map((group) => {
            const activeIndex = group.items.findIndex((item) => item.id === activeId);
            const isGroupActive = activeIndex !== -1;

            return (
              <div key={group.name} className="relative flex flex-col mb-2">
                {/* Section active vertical bar marker */}
                <span
                  className="absolute -left-[14px] top-[7px] w-[2px] h-[16px] rounded-full bg-[#111111] transition-opacity duration-200 pointer-events-none"
                  style={{ opacity: isGroupActive ? 1 : 0 }}
                  aria-hidden="true"
                />

                {/* Section Group Title */}
                <div
                  className={`py-1.5 text-sm font-bold tracking-tight transition-colors duration-200 select-none ${
                    isGroupActive ? "text-neutral-950" : "text-neutral-800"
                  }`}
                >
                  {group.name}
                </div>

                {/* Tree Lines and Items */}
                <div
                  className="relative box-border"
                  style={{ height: `${30 * group.items.length + 12}px` }}
                >
                  <BranchedMenuLines
                    count={group.items.length}
                    activeIndex={activeIndex}
                    prefersReducedMotion={prefersReducedMotion}
                  />

                  {group.items.map((item, index) => {
                    const isActive = activeId === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigateToSection(item.id);
                        }}
                        className={`group absolute left-0 right-0 flex items-center gap-2 pl-[40px] pr-2 text-sm select-none transition-colors duration-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 ${
                          isActive
                            ? "text-[#111111] font-semibold"
                            : "text-neutral-700 hover:text-neutral-950 font-medium"
                        }`}
                        style={{
                          top: `${6 + 30 * index}px`,
                          height: "30px",
                        }}
                        aria-current={isActive ? "location" : undefined}
                      >
                        <ItemIcon
                          size={15}
                          strokeWidth={isActive ? 2 : 1.8}
                          className={`shrink-0 transition-colors duration-200 ${
                            isActive
                              ? "text-[#111111]"
                              : "text-neutral-600 group-hover:text-neutral-950"
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.title}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
