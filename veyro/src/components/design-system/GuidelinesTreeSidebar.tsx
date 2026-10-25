"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Layers,
  Palette,
  Type,
  LayoutGrid,
  Box,
  Activity,
  ChevronsUpDown,
  Component,
  Terminal,
  Languages,
  ArrowRightLeft,
  ShieldCheck,
  ChevronDown,
  FileCode2,
} from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const sectionElements = document.querySelectorAll("section[id]");
    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
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

  const handleScroll = (id: string) => {
    setActiveId(id);
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

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
            className={`transition-transform duration-200 ${
              mobileMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {mobileMenuOpen && (
          <div className="mt-2 p-3 bg-white border border-neutral-200 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto space-y-4">
            {TREE_NAV.map((category) => (
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
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                          isActive
                            ? "bg-neutral-900 text-white font-semibold"
                            : "text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        <Icon size={14} className={isActive ? "text-veyro-yellow" : "text-neutral-500"} />
                        <span className="font-mono text-2xs opacity-75">{item.number}</span>
                        <span className="truncate">{item.label}</span>
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
        <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto pr-3 py-1 scrollbar-thin">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <FileCode2 size={16} className="text-neutral-900" />
              <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-900">
                Specification Tree
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono text-2xs font-semibold">
              13 Sections
            </span>
          </div>

          <nav className="space-y-6">
            {TREE_NAV.map((category) => (
              <div key={category.title} className="space-y-1.5">
                {/* Category Header */}
                <div className="flex items-center gap-2 px-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    {category.title}
                  </h3>
                </div>

                {/* Tree Connector Line & Children */}
                <div className="relative pl-3 ml-2 border-l border-neutral-200 space-y-1">
                  {category.items.map((item) => {
                    const isActive = activeId === item.id;
                    const Icon = item.icon;

                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleScroll(item.id);
                        }}
                        className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors select-none ${
                          isActive
                            ? "bg-neutral-900 text-white font-semibold shadow-xs"
                            : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                        }`}
                      >
                        {/* Tree Branch Horizontal Tick */}
                        <span
                          className={`absolute -left-3 top-1/2 -translate-y-1/2 w-2.5 h-px transition-colors ${
                            isActive ? "bg-neutral-900" : "bg-neutral-200 group-hover:bg-neutral-400"
                          }`}
                        />

                        <Icon
                          size={13}
                          className={`shrink-0 transition-colors ${
                            isActive ? "text-veyro-yellow" : "text-neutral-400 group-hover:text-neutral-900"
                          }`}
                        />

                        <span
                          className={`font-mono text-2xs tracking-wider shrink-0 ${
                            isActive ? "text-neutral-300" : "text-neutral-400"
                          }`}
                        >
                          {item.number}
                        </span>

                        <span className="truncate">{item.label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
