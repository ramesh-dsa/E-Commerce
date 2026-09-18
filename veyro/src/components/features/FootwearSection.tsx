"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCard } from "@/components/features/ProductCard";
import { products } from "@/data/products";

export function FootwearSection() {
  const [selectedStyle, setSelectedStyle] = useState("ALL");

  const styles = ["ALL", "Minimal", "Retro", "Chunky"];

  const footwear = products.filter((p) => p.category === "Footwear");

  const displayedShoes = (
    selectedStyle === "ALL"
      ? footwear
      : footwear.filter((p) => p.subcategoryTag.toLowerCase() === selectedStyle.toLowerCase())
  ).slice(0, 6);

  return (
    <section className="w-full py-14 sm:py-20 bg-white border-t border-[#ede9e3]">
      <Container>
        <SectionHeading
          eyebrow="FOOTWEAR ARCHIVE • EDITION 01"
          title="THE SNEAKER LINEUP"
          subtitle="Low-top court sneakers, retro runners, and statement chunky silhouettes engineered for all-day comfort."
          actionText="Shop All Footwear (9)"
          actionHref="#"
        />

        {/* Style Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {styles.map((style) => {
            const isActive = selectedStyle === style;
            return (
              <button
                key={style}
                type="button"
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-all duration-150 rounded-[2px] cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-veyro-black text-white shadow-xs"
                    : "bg-[#f4f2ee] text-[#555555] hover:bg-[#eae6df] hover:text-veyro-black"
                }`}
              >
                {style === "ALL" ? "All Footwear" : `${style} Silhouettes`}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {displayedShoes.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
