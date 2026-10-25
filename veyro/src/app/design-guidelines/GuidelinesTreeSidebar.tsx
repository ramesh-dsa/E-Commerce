"use client";

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from "react";
import {
  Sparkles,
  Shapes,
  Palette,
  Type,
  LayoutGrid,
  Box,
  Activity,
  ChevronsUpDown,
  Component,
  Terminal,
  Eye,
  ArrowRightLeft,
  ShieldCheck,
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
  { id: "layout-spacing", number: "05", title: "Layout and Spacing", group: "System", icon: LayoutGrid },
  { id: "shape-elevation", number: "06", title: "Shape and Elevation", group: "System", icon: Box },
  { id: "motion", number: "07", title: "Motion", group: "System", icon: Activity },
  { id: "z-index-ladder", number: "08", title: "Z-Index Ladder", group: "System", icon: ChevronsUpDown },
  { id: "components", number: "09", title: "Components", group: "Application", icon: Component },
  { id: "architecture", number: "10", title: "Architecture", group: "Application", icon: Terminal },
  { id: "accessibility", number: "11", title: "Accessibility", group: "Application", icon: Eye },
  { id: "transition-guidance", number: "12", title: "Transition Guidance", group: "Governance", icon: ArrowRightLeft },
  { id: "quick-reference", number: "13", title: "Quick Reference", group: "Governance", icon: ShieldCheck },
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
        rootMargin: "-20% 0px -70% 0px",
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

export default function GuidelinesTreeSidebar({ className = "" }: GuidelinesTreeSidebarProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeId, navigateToSection] = useScrollSpy(prefersReducedMotion);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  const [indicatorTop, setIndicatorTop] = useState(0);
  const [indicatorHeight, setIndicatorHeight] = useState(0);

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

  // Update Volt Gold indicator position using offsetTop and height
  useEffect(() => {
    const activeEl = itemRefs.current[activeId];
    if (activeEl) {
      setIndicatorTop(activeEl.offsetTop);
      setIndicatorHeight(activeEl.offsetHeight);
    }
  }, [activeId, groupedSections]);

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
            <span className="font-mono tabular-nums text-xs font-semibold text-neutral-500">
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
                    <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block px-1">
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
                                  : "text-neutral-500 hover:text-neutral-900"
                              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2`}
                              aria-current={isActive ? "location" : undefined}
                            >
                              <ItemIcon
                                size={14}
                                className={`shrink-0 ${
                                  isActive ? "text-[#111111]" : "text-neutral-400"
                                }`}
                                aria-hidden="true"
                              />
                              <span className="font-mono text-xs text-neutral-400 shrink-0">
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

      {/* ── Desktop Floating Sticky Rail (>= lg) ── */}
      <aside className={`hidden lg:block lg:sticky lg:top-28 max-h-[calc(100vh-8rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}>
        <nav aria-label="Guidelines sections">
          <div ref={listContainerRef} className="relative pl-3 space-y-4">
            {/* Continuous 1px vertical line */}
            <div
              className="absolute left-0 top-0 bottom-0 w-px bg-neutral-200"
              aria-hidden="true"
            />

            {/* 2px Volt Gold indicator sliding via translateY */}
            {indicatorHeight > 0 && (
              <div
                className="absolute left-0 w-[2px] bg-[#FCD017] rounded-full"
                style={{
                  height: `${indicatorHeight}px`,
                  transform: `translateY(${indicatorTop}px)`,
                  transition: prefersReducedMotion
                    ? "none"
                    : "transform 300ms ease-out, height 300ms ease-out",
                }}
                aria-hidden="true"
              />
            )}

            {groupedSections.map((group) => (
              <div key={group.name} className="space-y-1.5">
                <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block">
                  {group.name}
                </span>

                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeId === item.id;
                    const ItemIcon = item.icon;
                    return (
                      <li key={item.id}>
                        <a
                          ref={(el) => {
                            itemRefs.current[item.id] = el;
                          }}
                          href={`#${item.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigateToSection(item.id);
                          }}
                          className={`group flex items-center gap-2.5 py-1 text-sm rounded-md transition-colors duration-200 select-none ${
                            isActive
                              ? "text-[#111111] font-semibold"
                              : "text-neutral-500 hover:text-neutral-900"
                          } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2`}
                          aria-current={isActive ? "location" : undefined}
                        >
                          <ItemIcon
                            size={13}
                            className={`shrink-0 transition-colors duration-200 ${
                              isActive
                                ? "text-[#111111]"
                                : "text-neutral-400 group-hover:text-neutral-700"
                            }`}
                            aria-hidden="true"
                          />
                          <span className="font-mono text-xs text-neutral-400 shrink-0">
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
      </aside>
    </>
  );
}
