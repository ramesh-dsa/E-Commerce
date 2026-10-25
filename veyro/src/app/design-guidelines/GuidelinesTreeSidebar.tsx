"use client";

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from "react";

export interface SectionItem {
  id: string;
  number: string;
  title: string;
  group: "Foundations" | "System" | "Application" | "Governance";
}

export const SECTIONS: SectionItem[] = [
  { id: "brand-essence", number: "01", title: "Brand Essence", group: "Foundations" },
  { id: "logo", number: "02", title: "Logo", group: "Foundations" },
  { id: "color", number: "03", title: "Color", group: "Foundations" },
  { id: "typography", number: "04", title: "Typography", group: "Foundations" },
  { id: "layout-spacing", number: "05", title: "Layout and Spacing", group: "System" },
  { id: "shape-elevation", number: "06", title: "Shape and Elevation", group: "System" },
  { id: "motion", number: "07", title: "Motion", group: "System" },
  { id: "z-index-ladder", number: "08", title: "Z-Index Ladder", group: "System" },
  { id: "components", number: "09", title: "Components", group: "Application" },
  { id: "architecture", number: "10", title: "Architecture", group: "Application" },
  { id: "accessibility", number: "11", title: "Accessibility", group: "Application" },
  { id: "transition-guidance", number: "12", title: "Transition Guidance", group: "Governance" },
  { id: "quick-reference", number: "13", title: "Quick Reference", group: "Governance" },
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
 * Calculates reading progress from section 01 top to section 13 bottom.
 */
function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const calculate = () => {
      const firstSection = document.getElementById(SECTIONS[0].id);
      const lastSection = document.getElementById(SECTIONS[SECTIONS.length - 1].id);
      if (!firstSection || !lastSection) return;

      const firstRect = firstSection.getBoundingClientRect();
      const lastRect = lastSection.getBoundingClientRect();

      const startY = firstRect.top + window.scrollY;
      const endY = lastRect.bottom + window.scrollY;
      const totalDistance = endY - startY;

      if (totalDistance <= 0) return;

      const currentPosition = window.scrollY + window.innerHeight * 0.35;
      const raw = (currentPosition - startY) / totalDistance;
      const clamped = Math.min(Math.max(raw, 0), 1);

      setProgress(clamped);
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        calculate();
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    calculate();

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return progress;
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
  const progress = useReadingProgress();
  const [activeId, navigateToSection] = useScrollSpy(prefersReducedMotion);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const sheetSearchInputRef = useRef<HTMLInputElement>(null);
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

  // Filtered sections for search
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return SECTIONS;
    const q = searchQuery.toLowerCase().trim();
    return SECTIONS.filter(
      (s) => s.number.includes(q) || s.title.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Group filtered sections
  const groupedSections = useMemo(() => {
    const groups: { name: SectionItem["group"]; items: SectionItem[] }[] = [
      { name: "Foundations", items: [] },
      { name: "System", items: [] },
      { name: "Application", items: [] },
      { name: "Governance", items: [] },
    ];

    filteredSections.forEach((s) => {
      const g = groups.find((grp) => grp.name === s.group);
      if (g) g.items.push(s);
    });

    return groups.filter((g) => g.items.length > 0);
  }, [filteredSections]);

  // Update Volt Gold indicator position using offsetTop and height
  useEffect(() => {
    const activeEl = itemRefs.current[activeId];
    if (activeEl) {
      setIndicatorTop(activeEl.offsetTop);
      setIndicatorHeight(activeEl.offsetHeight);
    }
  }, [activeId, searchQuery, groupedSections]);

  // Global keyboard shortcuts: "/" or Cmd/Ctrl+K to focus search, Esc to blur
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        if (sheetOpen) {
          sheetSearchInputRef.current?.focus();
        } else {
          searchInputRef.current?.focus();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (sheetOpen) {
          sheetSearchInputRef.current?.focus();
        } else {
          searchInputRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sheetOpen]);

  // Search input keydown handler (Arrow keys, Enter, Esc)
  const handleSearchKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    isMobile = false
  ) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      if (isMobile) {
        sheetSearchInputRef.current?.blur();
      } else {
        searchInputRef.current?.blur();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredSections.length > 0) {
        setSelectedSearchIndex((prev) => (prev + 1) % filteredSections.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredSections.length > 0) {
        setSelectedSearchIndex(
          (prev) => (prev - 1 + filteredSections.length) % filteredSections.length
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSections.length > 0) {
        const target =
          filteredSections[selectedSearchIndex] || filteredSections[0];
        if (target) {
          navigateToSection(target.id);
          if (sheetOpen) setSheetOpen(false);
        }
      }
    }
  };

  // Lock body scroll and handle focus trap when mobile sheet is open
  useEffect(() => {
    if (sheetOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      sheetSearchInputRef.current?.focus();

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
          <div className="truncate pr-3">
            <span className="text-sm font-semibold text-[#111111]">
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

        {/* Mobile Progress Bar along bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-200 overflow-hidden">
          <div
            className="h-full bg-[#111111] origin-left"
            style={{
              transform: `scaleX(${progress})`,
              transition: prefersReducedMotion ? "none" : "transform 200ms ease-out",
            }}
          />
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
            {/* Sheet Search */}
            <div className="relative mb-4">
              <label htmlFor="guidelines-sheet-search" className="sr-only">
                Find a section
              </label>
              <input
                id="guidelines-sheet-search"
                ref={sheetSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedSearchIndex(0);
                }}
                onKeyDown={(e) => handleSearchKeyDown(e, true)}
                placeholder="Find a section"
                className="w-full bg-transparent border-b border-neutral-200 py-2 pr-6 text-sm text-[#111111] placeholder:text-neutral-500 focus:outline-none focus:border-[#111111]"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-xs text-neutral-400 select-none">
                /
              </span>
            </div>

            {/* Sheet Nav List */}
            <nav aria-label="Guidelines mobile sections">
              {groupedSections.length === 0 ? (
                <div className="py-6 text-center text-sm text-neutral-500">
                  No section found
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedSections.map((group) => (
                    <div key={group.name} className="space-y-1">
                      <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block px-1">
                        {group.name}
                      </span>
                      <ul className="space-y-1">
                        {group.items.map((item) => {
                          const isActive = activeId === item.id;
                          return (
                            <li key={item.id}>
                              <a
                                href={`#${item.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigateToSection(item.id);
                                  setSheetOpen(false);
                                }}
                                className={`min-h-[44px] flex items-center px-2 py-2 text-sm rounded-md transition-colors duration-200 ${
                                  isActive
                                    ? "text-[#111111] font-semibold bg-neutral-100"
                                    : "text-neutral-500 hover:text-neutral-900"
                                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2`}
                                aria-current={isActive ? "location" : undefined}
                              >
                                <span className="font-mono text-xs">{item.number}</span>
                                <span className="ml-2 truncate">{item.title}</span>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* ── Desktop Floating Sticky Rail (>= lg) ── */}
      <aside className={`hidden lg:block lg:sticky lg:top-28 max-h-[calc(100vh-8rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}>
        <nav aria-label="Guidelines sections" className="space-y-4">
          {/* Top Block: INDEX & Progress */}
          <div className="space-y-1.5 pb-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                INDEX
              </span>
              <span className="font-mono tabular-nums text-xs font-semibold text-[#111111]">
                {activeSection.number} / {SECTIONS.length.toString().padStart(2, "0")}
              </span>
            </div>

            {/* 2px Progress Line (neutral-200 track, Ink fill) */}
            <div className="h-[2px] w-full bg-neutral-200 overflow-hidden rounded-full">
              <div
                className="h-full bg-[#111111] origin-left"
                style={{
                  transform: `scaleX(${progress})`,
                  transition: prefersReducedMotion ? "none" : "transform 200ms ease-out",
                }}
              />
            </div>

            <div className="flex justify-end">
              <span className="font-mono tabular-nums text-xs text-neutral-500">
                {Math.round(progress * 100)}%
              </span>
            </div>
          </div>

          {/* Minimal Search Input */}
          <div className="relative pb-2">
            <label htmlFor="guidelines-search" className="sr-only">
              Find a section
            </label>
            <input
              id="guidelines-search"
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedSearchIndex(0);
              }}
              onKeyDown={(e) => handleSearchKeyDown(e, false)}
              placeholder="Find a section"
              className="w-full bg-transparent border-b border-neutral-200 py-1.5 pr-6 text-sm text-[#111111] placeholder:text-neutral-500 focus:outline-none focus:border-[#111111] transition-colors duration-200"
            />
            <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-xs text-neutral-400 select-none">
              /
            </span>
          </div>

          {/* Section List with Sliding Volt Gold Indicator */}
          {groupedSections.length === 0 ? (
            <div className="py-6 text-left text-sm text-neutral-500">
              No section found
            </div>
          ) : (
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
                            className={`block py-1 text-sm rounded-md transition-colors duration-200 select-none ${
                              isActive
                                ? "text-[#111111] font-semibold"
                                : "text-neutral-500 hover:text-neutral-900"
                            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2`}
                            aria-current={isActive ? "location" : undefined}
                          >
                            <span className="font-mono text-xs">{item.number}</span>
                            <span className="ml-2 truncate">{item.title}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
