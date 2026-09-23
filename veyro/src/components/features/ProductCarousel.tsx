"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/features/ProductCard";

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle: string;
  categoryNumber: string;
}

export function ProductCarousel({ products, title, subtitle, categoryNumber }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-20 pt-14 border-t border-neutral-200">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
            {title}
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          {products.length > 2 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!showLeftArrow}
                className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
                  showLeftArrow 
                    ? "border-neutral-200 bg-white text-[#111111] hover:bg-neutral-50 hover:border-neutral-300 cursor-pointer" 
                    : "border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed"
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!showRightArrow}
                className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
                  showRightArrow 
                    ? "border-neutral-200 bg-white text-[#111111] hover:bg-neutral-50 hover:border-neutral-300 cursor-pointer" 
                    : "border-neutral-200 bg-neutral-50 text-neutral-300 cursor-not-allowed"
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative -mx-5 px-5 sm:mx-0 sm:px-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6 hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => {
            const getWidthClass = () => {
              if (products.length === 1) return "min-w-[80vw] sm:min-w-[80%] lg:min-w-full";
              if (products.length === 2) return "min-w-[80vw] sm:min-w-[45%] lg:min-w-[calc(50%-0.75rem)]";
              if (products.length === 3) return "min-w-[80vw] sm:min-w-[45%] lg:min-w-[calc(33.333%-1rem)]";
              return "min-w-[80vw] sm:min-w-[45%] lg:min-w-[calc(25%-1.125rem)]";
            };

            return (
              <div 
                key={product.id} 
                className={`${getWidthClass()} snap-start shrink-0`}
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
