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
  }).slice(0, 8);

  return (
    <section className="w-full py-14 sm:py-20 bg-white">
      <Container>
        {/* Section Header */}
        <SectionHeading
          eyebrow="NEW DROPS • SEASON 01"
          title="LATEST ARRIVALS"
          subtitle="Engineered fits, heavyweight drapes, and vulcanized sneakers built for daily rotation."
          actionText="View All New Drops"
          actionHref="#"
        />

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-150 rounded-[2px] cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-veyro-black text-white shadow-xs"
                    : "bg-[#f4f2ee] text-[#555555] hover:bg-[#eae6df] hover:text-veyro-black"
                }`}
              >
                {tab === "ALL" ? "All New Drops" : tab}
              </button>
            );
          })}
        </div>

        {/* Responsive Product Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
