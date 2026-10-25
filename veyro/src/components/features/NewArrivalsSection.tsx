"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/features/ProductCard";
import { ProductCardSkeleton } from "@/components/features/ProductCardSkeleton";
import { useProducts } from "@/context/ProductsContext";

import { ScrollReveal } from "@/components/ui/ScrollReveal";

type TabType = "ALL" | "OVERSIZED" | "FOOTWEAR" | "TEXTURED";

export function NewArrivalsSection() {
  const { products, isHydrated } = useProducts();
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
  const shouldReduceMotion = useReducedMotion();

  const tabs: TabType[] = [
    "ALL",
    "OVERSIZED",
    "FOOTWEAR",
    "TEXTURED",
  ];

  const filteredProducts = products.filter((p) => {
    if (activeTab === "ALL") return p.isNewArrival;
    if (activeTab === "OVERSIZED") return p.subcategoryTag === "Oversized";
    if (activeTab === "FOOTWEAR") return p.category === "Footwear";
    if (activeTab === "TEXTURED")
      return p.subcategoryTag === "Textured" || p.subcategoryTag === "Graphic";
    return true;
  }).slice(0, 5);

  const handleTabSelect = (tab: TabType, index: number) => {
    setActiveTab(tab);
    tabRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabs.length;
      handleTabSelect(tabs[nextIndex], nextIndex);
      tabRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      handleTabSelect(tabs[prevIndex], prevIndex);
      tabRefs.current[prevIndex]?.focus();
    }
  };

  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Dynamic height stabilization: immediately measures when a new tab mounts & adapts on resize
  const setContentRef = useCallback((node: HTMLDivElement | null) => {
    contentRef.current = node;
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }
    if (node) {
      const updateHeight = () => {
        const height = node.offsetHeight;
        if (height > 0) {
          setMinHeight(height);
        }
      };

      updateHeight();
      requestAnimationFrame(updateHeight);

      const ro = new ResizeObserver(() => {
        updateHeight();
      });
      ro.observe(node);
      resizeObserverRef.current = ro;
    }
  }, []);

  useEffect(() => {
    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, []);

  const gridVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.04,
        delayChildren: 0.02,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.05 : 0.25,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="new-arrivals" className="w-full py-14 sm:py-20 bg-white">
      <Container>
        {/* Section Header & Tabs Scroll Reveal */}
        <ScrollReveal y={20} duration={0.65} amount={0.15}>
          <SectionHeading
            eyebrow="NEW DROPS • SEASON 01"
            title="LATEST ARRIVALS"
            subtitle="Engineered fits, heavyweight drapes, and vulcanized sneakers built for daily rotation."
            actionText="View All New Drops"
            actionHref="/clothing"
          />

          {/* Filter Category Tabs */}
          <div
            role="tablist"
            aria-label="New arrivals categories"
            className="flex items-center gap-4 sm:gap-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 mb-8 sm:mb-10 border-b border-neutral-200 scrollbar-none"
          >
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-arrivals-${tab.toLowerCase()}`}
                  aria-controls={`panel-arrivals-${tab.toLowerCase()}`}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabSelect(tab, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`relative pb-3 text-xs sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-veyro-black ${
                    isActive ? "text-veyro-black" : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {tab === "ALL" ? (
                    <>
                      <span className="sm:hidden">All Drops</span>
                      <span className="hidden sm:inline">All New Drops</span>
                    </>
                  ) : (
                    tab
                  )}
                  {/* Animated Underline */}
                  {isActive && (
                    <motion.span
                      layoutId="new-arrivals-tab-underline"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 35 }
                      }
                      className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-veyro-black pointer-events-none"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Editorial Asymmetrical Grid with Height Stabilization & Scroll Reveal */}
        <ScrollReveal y={28} duration={0.7} delay={0.1} amount={0.1}>
          <div
            ref={containerRef}
            style={{ minHeight: minHeight ? `${minHeight}px` : undefined }}
            className="transition-[min-height] duration-200 ease-out"
          >
            {!isHydrated ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                {Array.from({ length: 5 }).map((_, index) => {
                  const isFeatured = activeTab === "ALL" && index === 0;
                  return (
                    <ProductCardSkeleton
                      key={index}
                      isFeatured={isFeatured}
                      className={isFeatured ? "col-span-2 md:row-span-2" : "col-span-1"}
                    />
                  );
                })}
              </div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  ref={setContentRef}
                  role="tabpanel"
                  id={`panel-arrivals-${activeTab.toLowerCase()}`}
                  aria-labelledby={`tab-arrivals-${activeTab.toLowerCase()}`}
                  variants={gridVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onAnimationComplete={(definition) => {
                    if (definition === "visible" && contentRef.current) {
                      const h = contentRef.current.offsetHeight;
                      if (h > 0) setMinHeight(h);
                    }
                  }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
                >
                  {filteredProducts.map((product, index) => {
                    const isFeatured =
                      activeTab === "ALL" &&
                      filteredProducts.length >= 4 &&
                      index === 0;
                    return (
                      <motion.div
                        key={product.id}
                        variants={cardVariants}
                        className={isFeatured ? "col-span-2 md:row-span-2" : "col-span-1"}
                      >
                        <ProductCard
                          product={product}
                          isFeatured={isFeatured}
                          className={isFeatured ? "h-full" : ""}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
