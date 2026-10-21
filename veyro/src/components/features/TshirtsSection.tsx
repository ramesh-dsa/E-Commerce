"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/features/ProductCard";
import { ProductCardSkeleton } from "@/components/features/ProductCardSkeleton";
import { useProducts } from "@/context/ProductsContext";

export function TshirtsSection() {
  const { products, isHydrated } = useProducts();
  const [selectedFit, setSelectedFit] = useState("ALL");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = useState<number | undefined>(undefined);
  const shouldReduceMotion = useReducedMotion();

  const fits = ["ALL", "Oversized", "Regular", "Textured", "Graphic", "Relaxed"];

  const tshirts = products.filter((p) => p.category === "Clothing");

  const displayedTees = (
    selectedFit === "ALL"
      ? tshirts.slice(0, 9)
      : tshirts.filter((p) => p.subcategoryTag.toLowerCase() === selectedFit.toLowerCase())
  );

  const handleFitSelect = (fit: string, index: number) => {
    setSelectedFit(fit);
    tabRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % fits.length;
      handleFitSelect(fits[nextIndex], nextIndex);
      tabRefs.current[nextIndex]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + fits.length) % fits.length;
      handleFitSelect(fits[prevIndex], prevIndex);
      tabRefs.current[prevIndex]?.focus();
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.offsetHeight;
      if (height > 0) {
        setMinHeight(height);
      }
    }
  }, [selectedFit, displayedTees, isHydrated]);

  useEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        const height = contentRef.current.offsetHeight;
        if (height > 0) {
          setMinHeight(height);
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    <section id="clothing" className="w-full py-16 sm:py-24 bg-white border-t border-[#f0f0ed]">
      <Container>
        <SectionHeading
          eyebrow="CLOTHING ARCHIVE • 240+ GSM"
          title="THE T-SHIRT COLLECTION"
          subtitle="Heavyweight cotton, architectural drop-shoulders, and high-density ribbed collars."
          actionText="Shop All T-Shirts (15)"
          actionHref="/clothing"
        />

        {/* Editorial Fit Filters */}
        <div
          role="tablist"
          aria-label="T-shirt silhouette categories"
          className="flex items-center sm:flex-wrap overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 mb-8 sm:mb-12 border-b border-[#eae6df] sm:border-transparent scrollbar-none gap-5 sm:gap-0"
        >
          {fits.map((fit, index) => {
            const isActive = selectedFit === fit;
            return (
              <React.Fragment key={fit}>
                <button
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tab-tshirts-${fit.toLowerCase()}`}
                  aria-controls={`panel-tshirts-${fit.toLowerCase()}`}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleFitSelect(fit, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`relative pb-2.5 sm:pb-1 text-[11px] sm:text-[14px] font-bold sm:font-semibold tracking-wider uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-veyro-black ${
                    isActive
                      ? "text-veyro-black"
                      : "text-neutral-400 hover:text-neutral-700"
                  }`}
                >
                  {fit === "ALL" ? (
                    <>
                      <span className="sm:hidden">All Fits</span>
                      <span className="hidden sm:inline">All Silhouettes</span>
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden">{fit}</span>
                      <span className="hidden sm:inline">{fit} Fit</span>
                    </>
                  )}
                  {/* Animated Active Underline */}
                  {isActive && (
                    <motion.span
                      layoutId="tshirts-tab-underline"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 400, damping: 35 }
                      }
                      className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-veyro-black pointer-events-none"
                    />
                  )}
                </button>
                {index < fits.length - 1 && (
                  <span className="hidden sm:inline text-veyro-muted/30 mx-5 font-light text-lg pb-1 pointer-events-none">
                    /
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Asymmetric Product Gallery */}
        <div
          ref={containerRef}
          style={{ minHeight: minHeight ? `${minHeight}px` : undefined }}
          className="transition-[min-height] duration-200 ease-out"
        >
          {!isHydrated ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:gap-8 lg:auto-rows-fr">
              {Array.from({ length: 9 }).map((_, index) => {
                const isFirst = index === 0;
                return (
                  <div
                    key={index}
                    className={isFirst ? "col-span-2 lg:row-span-2" : "col-span-1 row-span-1"}
                  >
                    <ProductCardSkeleton
                      isFeatured={isFirst}
                      className="h-full"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedFit}
                ref={contentRef}
                role="tabpanel"
                id={`panel-tshirts-${selectedFit.toLowerCase()}`}
                aria-labelledby={`tab-tshirts-${selectedFit.toLowerCase()}`}
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:gap-8 lg:auto-rows-fr"
              >
                {displayedTees.map((product, index) => {
                  const isFirst = selectedFit === "ALL" && index === 0;
                  return (
                    <motion.div 
                      key={product.id} 
                      variants={cardVariants}
                      className={isFirst ? "col-span-2 lg:row-span-2" : "col-span-1 row-span-1"}
                    >
                      <ProductCard 
                        product={product} 
                        isFeatured={isFirst} 
                        className="h-full"
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </Container>
    </section>
  );
}
