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
    <section className="w-full py-14 sm:py-20 bg-[#faf9f7] border-t border-[#eeebe5]">
      <Container>
        <SectionHeading
          eyebrow="CLOTHING ARCHIVE • 240+ GSM"
          title="THE T-SHIRT COLLECTION"
          subtitle="Heavyweight cotton, architectural drop-shoulders, and high-density ribbed collars."
          actionText="Shop All T-Shirts (15)"
          actionHref="#"
        />

        {/* Fit Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {fits.map((fit) => {
            const isActive = selectedFit === fit;
            return (
              <button
                key={fit}
                type="button"
                onClick={() => setSelectedFit(fit)}
                className={`px-3.5 py-1.5 text-xs font-medium tracking-wide uppercase transition-all duration-150 rounded-[2px] cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-veyro-accent text-veyro-black font-semibold shadow-xs"
                    : "bg-white border border-[#e5e1d8] text-[#555555] hover:border-veyro-black"
                }`}
              >
                {fit === "ALL" ? "All Silhouettes" : `${fit} Fit`}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {displayedTees.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
