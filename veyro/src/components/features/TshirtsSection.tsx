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
        <div role="tablist" className="flex items-center sm:flex-wrap overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 sm:pb-0 mb-8 sm:mb-12 scrollbar-none">
          {fits.map((fit, index) => {
            const isActive = selectedFit === fit;
            return (
              <React.Fragment key={fit}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedFit(fit)}
                  className={`text-[12px] sm:text-[14px] font-semibold tracking-wider uppercase transition-colors duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "text-veyro-black border-b-2 border-veyro-black pb-1"
                      : "text-veyro-muted hover:text-veyro-black pb-1 border-b-2 border-transparent"
                  }`}
                >
                  {fit === "ALL" ? "All Silhouettes" : `${fit} Fit`}
                </button>
                {index < fits.length - 1 && (
                  <span className="text-veyro-muted/30 mx-2.5 sm:mx-5 font-light text-base sm:text-lg pb-1 pointer-events-none shrink-0">/</span>
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
