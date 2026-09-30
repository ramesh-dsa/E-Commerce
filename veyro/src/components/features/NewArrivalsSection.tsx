"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/features/ProductCard";
import { products } from "@/data/products";

export function NewArrivalsSection() {
  const [activeTab, setActiveTab] = useState<"ALL" | "OVERSIZED" | "FOOTWEAR" | "TEXTURED">("ALL");

  const tabs: Array<"ALL" | "OVERSIZED" | "FOOTWEAR" | "TEXTURED"> = [
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

  return (
    <section id="new-arrivals" className="w-full py-14 sm:py-20 bg-white">
      <Container>
        {/* Section Header */}
        <SectionHeading
          eyebrow="NEW DROPS • SEASON 01"
          title="LATEST ARRIVALS"
          subtitle="Engineered fits, heavyweight drapes, and vulcanized sneakers built for daily rotation."
          actionText="View All New Drops"
          actionHref="/clothing"
        />

        {/* Filter Category Tabs */}
        <div role="tablist" className="flex items-center gap-4 sm:gap-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-2 mb-8 sm:mb-10 border-b border-[#eae6df] scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-[11px] sm:text-xs font-bold tracking-wider sm:tracking-widest uppercase transition-colors duration-300 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive ? "text-veyro-black" : "text-veyro-muted hover:text-veyro-black"
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
                  <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-veyro-black" />
                )}
              </button>
            );
          })}
        </div>

        {/* Editorial Asymmetrical Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product, index) => {
            const isFeatured = index === 0;
            return (
              <ProductCard 
                key={product.id} 
                product={product} 
                isFeatured={isFeatured}
                className={isFeatured ? "col-span-2 row-span-2" : ""}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
