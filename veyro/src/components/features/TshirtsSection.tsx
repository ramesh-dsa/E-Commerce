"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/features/ProductCard";
import { products } from "@/data/products";

export function TshirtsSection() {
  const [selectedFit, setSelectedFit] = useState("ALL");

  const fits = ["ALL", "Oversized", "Regular", "Textured", "Graphic", "Relaxed"];

  const tshirts = products.filter((p) => p.category === "Clothing");

  const displayedTees = (
    selectedFit === "ALL"
      ? tshirts
      : tshirts.filter((p) => p.subcategoryTag.toLowerCase() === selectedFit.toLowerCase())
  ).slice(0, 8);

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
        <div role="tablist" className="flex items-center sm:flex-wrap overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 mb-8 sm:mb-12 border-b border-[#eae6df] sm:border-transparent scrollbar-none gap-5 sm:gap-0">
          {fits.map((fit, index) => {
            const isActive = selectedFit === fit;
            return (
              <React.Fragment key={fit}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedFit(fit)}
                  className={`relative pb-2.5 sm:pb-1 text-[11px] sm:text-[14px] font-bold sm:font-semibold tracking-wider uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "text-veyro-black"
                      : "text-veyro-muted hover:text-veyro-black"
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
                    <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-veyro-black" />
                  )}
                </button>
                {index < fits.length - 1 && (
                  <span className="hidden sm:inline text-veyro-muted/30 mx-5 font-light text-lg pb-1 pointer-events-none">/</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Asymmetric Product Gallery */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:gap-8 lg:auto-rows-fr">
          {displayedTees.map((product, index) => {
            // First item gets massive focal treatment
            const isFirst = index === 0;
            return (
              <div 
                key={product.id} 
                className={isFirst ? "col-span-2 row-span-2" : "col-span-1 row-span-1"}
              >
                <ProductCard 
                  product={product} 
                  isFeatured={isFirst} 
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
