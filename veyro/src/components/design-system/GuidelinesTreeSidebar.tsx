"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  FolderGit2,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  Search,
  X,
  Sparkles,
  Layers,
  Palette,
  Type,
  LayoutGrid,
  Box,
  Activity,
  Component,
  Terminal,
  Languages,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  number: string;
  label: string;
  icon: React.ElementType;
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}

export const TREE_NAV: NavCategory[] = [
  {
    title: "System",
    items: [
      { id: "section-1", number: "01", label: "Brand Philosophy", icon: Sparkles },
      { id: "section-2", number: "02", label: "Logo & Clear Space", icon: Layers },
      { id: "section-3", number: "03", label: "Color & OKLAB Ramp", icon: Palette },
      { id: "section-4", number: "04", label: "Typography Ladder", icon: Type },
      { id: "section-5", number: "05", label: "Layout & Spacing", icon: LayoutGrid },
      { id: "section-6", number: "06", label: "Shape & Elevation", icon: Box },
      { id: "section-7", number: "07", label: "Motion & Easing", icon: Activity },
      { id: "section-8", number: "08", label: "Z-Index Ladder", icon: ChevronsUpDown },
    ],
  },
  {
    title: "Application",
    items: [
      { id: "section-9", number: "09", label: "Components & Controls", icon: Component },
      { id: "section-10", number: "10", label: "Architecture & Code", icon: Terminal },
      { id: "section-11", number: "11", label: "Language & A11y", icon: Languages },
    ],
  },
  {
    title: "Governance",
    items: [
      { id: "section-12", number: "12", label: "Transition Guidance", icon: ArrowRightLeft },
      { id: "section-13", number: "13", label: "Quick Reference", icon: ShieldCheck },
    ],
  },
];

export function GuidelinesTreeSidebar() {
  const [activeId, setActiveId] = useState<string>("section-1");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    System: true,
    Application: true,
    Governance: true,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // ── Scroll-Spy using IntersectionObserver ──
  useEffect(() => {
    const sectionElements = document.querySelectorAll("section[id]");
    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const newId = entry.target.id;
            setActiveId(newId);

            // Auto-expand parent category if currently collapsed
            const parent = TREE_NAV.find((c) => c.items.some((i) => i.id === newId));
            if (parent) {
              setExpandedFolders((prev) => (prev[parent.title] ? prev : { ...prev, [parent.title]: true }));
            }
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ── Global Keyboard Shortcut ('/' to search, 'Esc' to clear) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === searchInputRef.current) {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleScroll = (id: string) => {
    setActiveId(id);
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleFolder = (title: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const allExpanded = Object.values(expandedFolders).every(Boolean);
  const toggleAllFolders = () => {
    const nextState = !allExpanded;
    setExpandedFolders({
      System: nextState,
      Application: nextState,
      Governance: nextState,
    });
  };

  // ── Filter Sections in Real-Time ──
  const filteredNav = useMemo(() => {
    if (!searchQuery.trim()) return TREE_NAV;
    const query = searchQuery.toLowerCase().trim();

    return TREE_NAV.map((category) => {
      const categoryMatch = category.title.toLowerCase().includes(query);
      const items = category.items.filter(
        (item) =>
          categoryMatch ||
          item.label.toLowerCase().includes(query) ||
          item.number.includes(query) ||
          item.id.toLowerCase().includes(query)
      );
      return { ...category, items };
    }).filter((category) => category.items.length > 0);
  }, [searchQuery]);

  const totalFilteredItems = filteredNav.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <>
      {/* ── Mobile Sticky Navigation Header (< lg) ── */}
      <div className="lg:hidden sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 py-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors text-xs font-semibold text-neutral-900"
          aria-expanded={mobileMenuOpen}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-2xs uppercase tracking-widest text-neutral-500">
              Navigation •
            </span>
            <span className="font-bold truncate text-neutral-900">
              {TREE_NAV.flatMap((c) => c.items).find((i) => i.id === activeId)?.label ||
                "Index"}
            </span>
          </div>
          <ChevronDown
            size={16}
            className={cn("transition-transform duration-200", mobileMenuOpen && "rotate-180")}
          />
        </button>

        {mobileMenuOpen && (
          <div className="mt-2 p-3 bg-white border border-neutral-200 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto space-y-4">
            {/* Mobile Search */}
            <div className="relative flex items-center bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1.5">
              <Search size={13} className="text-neutral-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sections..."
                className="w-full text-xs bg-transparent focus:outline-none text-neutral-900 placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-neutral-400 hover:text-neutral-700"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {filteredNav.map((category) => (
              <div key={category.title}>
                <span className="font-mono text-2xs uppercase font-bold tracking-widest text-neutral-400 block mb-1 px-2">
                  {category.title}
                </span>
                <div className="space-y-0.5">
                  {category.items.map((item) => {
                    const isActive = activeId === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleScroll(item.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors",
                          isActive
                            ? "bg-neutral-950 text-white font-semibold shadow-xs"
                            : "text-neutral-700 hover:bg-neutral-100"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Icon size={14} className={isActive ? "text-veyro-yellow" : "text-neutral-500"} />
                          <span className="font-mono text-2xs opacity-75">{item.number}</span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-veyro-yellow animate-pulse shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Desktop Sticky Tree Sidebar (>= lg) ── */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-28 max-h-[calc(100vh-140px)] flex flex-col rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-xs">
          {/* Layer 1: Header Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <FolderGit2 size={15} className="text-neutral-900" />
              <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-900">
                Specification Tree
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleAllFolders}
                className="p-1 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                title={allExpanded ? "Collapse all categories" : "Expand all categories"}
                aria-label={allExpanded ? "Collapse all categories" : "Expand all categories"}
              >
                <ChevronsUpDown size={13} />
              </button>
              <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono text-3xs font-semibold border border-neutral-200">
                13 SECTIONS
              </span>
            </div>
          </div>

          {/* Layer 2: Filter Search Input */}
          <div className="pt-3 pb-2">
            <div className="relative flex items-center bg-neutral-50 hover:bg-neutral-100/80 focus-within:bg-white border border-neutral-200 focus-within:border-neutral-900 rounded-xl px-2.5 py-1.5 transition-colors">
              <Search size={13} className="text-neutral-400 shrink-0 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter 13 sections..."
                className="w-full text-xs text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-0.5 text-neutral-400 hover:text-neutral-700"
                  aria-label="Clear filter"
                >
                  <X size={12} />
                </button>
              ) : (
                <kbd className="font-mono text-3xs px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-400 shadow-2xs select-none">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Layer 3–5: Scrollable Tree Explorer */}
          <nav
            role="tree"
            aria-label="Specification sections tree navigation"
            className="flex-1 overflow-y-auto pr-1 py-1 space-y-3.5 scrollbar-thin"
          >
            {filteredNav.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-neutral-500 font-medium">
                  No matching specification sections found.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-semibold text-neutral-900 underline hover:text-black"
                >
                  Clear filter
                </button>
              </div>
            ) : (
              filteredNav.map((category) => {
                const isExpanded = searchQuery.trim() ? true : !!expandedFolders[category.title];
                const count = category.items.length;

                return (
                  <div key={category.title} className="space-y-1">
                    {/* Folder Parent Row (Button) */}
                    <button
                      onClick={() => toggleFolder(category.title)}
                      className="group w-full flex items-center justify-between px-1.5 py-1 rounded-lg text-xs hover:bg-neutral-100/80 transition-colors select-none text-left"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-1.5">
                        <ChevronRight
                          size={13}
                          className={cn(
                            "text-neutral-400 group-hover:text-neutral-700 transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )}
                        />
                        {isExpanded ? (
                          <FolderOpen size={14} className="text-amber-500 fill-amber-500/20 shrink-0" />
                        ) : (
                          <Folder size={14} className="text-amber-500 fill-amber-500/10 shrink-0" />
                        )}
                        <span className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                          {category.title}
                        </span>
                      </div>

                      <span className="font-mono text-3xs font-semibold text-neutral-400 bg-neutral-100 rounded-md px-1.5 py-0.5">
                        {count}
                      </span>
                    </button>

                    {/* True Hierarchical Children & Guide Lines */}
                    {isExpanded && (
                      <div className="relative pl-3.5 ml-3 space-y-0.5">
                        {category.items.map((item, idx) => {
                          const isActive = activeId === item.id;
                          const isLast = idx === category.items.length - 1;
                          const Icon = item.icon;

                          return (
                            <div key={item.id} className="relative flex items-center">
                              {/* ── Magic UI / GitHub True Tree Guide Lines ── */}
                              {/* Vertical Line: h-full for intermediate, h-1/2 for last child to prevent overhang */}
                              <div
                                className={cn(
                                  "absolute -left-3.5 top-0 w-px bg-neutral-200",
                                  isLast ? "h-1/2" : "h-full"
                                )}
                              />
                              {/* Horizontal Branch Line connecting cleanly to left edge */}
                              <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-px bg-neutral-200" />

                              {/* Leaf Node Link */}
                              <a
                                href={`#${item.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleScroll(item.id);
                                }}
                                className={cn(
                                  "group w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors select-none",
                                  isActive
                                    ? "bg-neutral-950 text-white font-semibold shadow-xs"
                                    : "text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100/80"
                                )}
                                role="treeitem"
                                aria-selected={isActive}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Icon
                                    size={13}
                                    className={cn(
                                      "shrink-0 transition-colors",
                                      isActive
                                        ? "text-veyro-yellow"
                                        : "text-neutral-400 group-hover:text-neutral-800"
                                    )}
                                  />
                                  <span
                                    className={cn(
                                      "font-mono text-2xs tracking-wider shrink-0",
                                      isActive ? "text-neutral-300 font-bold" : "text-neutral-400"
                                    )}
                                  >
                                    {item.number}
                                  </span>
                                  <span className="truncate">{item.label}</span>
                                </div>

                                {/* Active Volt Gold Pulsing Beacon */}
                                {isActive && (
                                  <span className="flex items-center shrink-0 pl-1.5" aria-hidden="true">
                                    <span className="w-1.5 h-1.5 rounded-full bg-veyro-yellow animate-pulse" />
                                  </span>
                                )}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </nav>
        </div>
      </aside>
    </>
  );
}
