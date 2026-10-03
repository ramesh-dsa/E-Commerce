"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import { useProducts } from "@/context/ProductsContext";
import { ProductGallery } from "@/components/features/ProductGallery";
import { ProductBuyBox } from "@/components/features/ProductBuyBox";
import { ProductCarousel } from "@/components/features/ProductCarousel";
import { ProductBackButton } from "@/components/features/ProductBackButton";
import { ProductReviewsSection } from "@/components/features/ProductReviewsSection";
import { Container } from "@/components/ui/Container";
import { ArrowLeft, PackageX } from "lucide-react";

interface ProductDetailViewProps {
  slug: string;
  initialProduct?: Product | null;
}

export function ProductDetailView({ slug, initialProduct }: ProductDetailViewProps) {
  const { products, isHydrated } = useProducts();

  // Find product from active ProductsContext (or initialProduct SSR fallback)
  const product = useMemo(() => {
    return products.find((p) => p.slug === slug) || initialProduct || null;
  }, [products, slug, initialProduct]);

  if (!product) {
    if (!isHydrated) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
          <PackageX size={28} />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Product Not Found</h1>
        <p className="text-sm text-neutral-500 max-w-md mb-6">
          The product you are looking for does not exist, has been removed, or the link is incorrect.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft size={16} /> Return to Store
        </Link>
      </div>
    );
  }

  const isFootwear =
    product.category?.toLowerCase() === "footwear" ||
    product.subcategory?.toLowerCase() === "shoes" ||
    product.id.startsWith("vey-ftw");
  const isWatch = product.category === "Watches";

  let backHref = "/clothing";
  let backLabel = "BACK TO CLOTHING";

  if (isFootwear) {
    backHref = "/shoes";
    backLabel = "BACK TO SHOES";
  } else if (isWatch) {
    backHref = "/watches";
    backLabel = "BACK TO WATCHES";
  }

  // Similar products: same category + same subcategoryTag, excluding current product
  const similarProducts = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.subcategoryTag === product.subcategoryTag &&
        p.id !== product.id
    )
    .slice(0, 8);

  // If not enough similar products from same subcategoryTag, fill from same category
  const filledSimilar =
    similarProducts.length >= 8
      ? similarProducts
      : [
          ...similarProducts,
          ...products
            .filter(
              (p) =>
                p.category === product.category &&
                p.subcategoryTag !== product.subcategoryTag &&
                p.id !== product.id &&
                !similarProducts.some((sp) => sp.id === p.id)
            )
            .slice(0, 8 - similarProducts.length),
        ];

  const isClothing = product.category === "Clothing";

  // "Pair With Shoes" — shown for clothing and watches
  const shoeRecommendations =
    isClothing || isWatch
      ? (() => {
          const relatedShoes = (product.relatedProducts || [])
            .map((id) => products.find((p) => p.id === id))
            .filter(
              (p): p is Product => p !== undefined && p.category === "Footwear"
            );
          const remainingShoes = products.filter(
            (p) =>
              p.category === "Footwear" &&
              !relatedShoes.some((rs) => rs.id === p.id)
          );
          return [...relatedShoes, ...remainingShoes].slice(0, 8);
        })()
      : [];

  // "Pair With Tees" — shown for footwear and watches
  const clothingPairings =
    isFootwear || isWatch
      ? (() => {
          const relatedTees = (product.relatedProducts || [])
            .map((id) => products.find((p) => p.id === id))
            .filter(
              (p): p is Product => p !== undefined && p.category === "Clothing"
            );
          const remainingTees = products.filter(
            (p) =>
              p.category === "Clothing" &&
              !relatedTees.some((rt) => rt.id === p.id)
          );
          return [...relatedTees, ...remainingTees].slice(0, 8);
        })()
      : [];

  // "Pair With Watches" — shown universally as an accessory (unless already viewing a watch)
  const watchRecommendations = !isWatch
    ? (() => {
        const relatedWatches = (product.relatedProducts || [])
          .map((id) => products.find((p) => p.id === id))
          .filter(
            (p): p is Product => p !== undefined && p.category === "Watches"
          );
        const remainingWatches = products.filter(
          (p) =>
            p.category === "Watches" &&
            !relatedWatches.some((rw) => rw.id === p.id)
        );
        return [...relatedWatches, ...remainingWatches].slice(0, 8);
      })()
    : [];

  // Build the carousel sections dynamically
  const carouselSections = [];

  if (filledSimilar.length > 0) {
    carouselSections.push({
      products: filledSimilar,
      title: "SIMILAR PRODUCTS",
      subtitle: `More from ${product.subcategoryTag || product.category}`,
    });
  }

  if (watchRecommendations.length > 0) {
    carouselSections.push({
      products: watchRecommendations,
      title: "ACCESSORIZE WITH WATCHES",
      subtitle: "Elevate your look",
    });
  }

  if (clothingPairings.length > 0) {
    carouselSections.push({
      products: clothingPairings,
      title: "PAIR WITH CLOTHING",
      subtitle: "Engineered to style together",
    });
  }

  if (shoeRecommendations.length > 0) {
    carouselSections.push({
      products: shoeRecommendations,
      title: "PAIR WITH SHOES",
      subtitle: "Step up your game",
    });
  }

  return (
    <div className="pt-4 pb-20">
      <Container>
        {/* Back Navigation */}
        <nav
          aria-label="Back Navigation"
          className="flex items-center text-[11px] font-mono tracking-widest text-veyro-muted uppercase mb-6 py-2"
        >
          <ProductBackButton backHref={backHref} backLabel={backLabel} />
        </nav>

        {/* Main Product Showcase Grid: Left Gallery, Right Buy-Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left: Multi-Angle Interactive Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery product={product} />
          </div>

          {/* Right: Purchase Engine & Editorial Buy-Box */}
          <div className="lg:col-span-5 flex flex-col">
            <ProductBuyBox product={product} />
          </div>
        </div>

        {/* Dedicated Customer Reviews Section */}
        <ProductReviewsSection product={product} />

        {/* Dynamic Recommendation Carousels */}
        {carouselSections.map((section, idx) => (
          <ProductCarousel
            key={section.title}
            products={section.products}
            categoryNumber={`[ 00${idx + 2} ]`}
            title={section.title}
            subtitle={section.subtitle}
          />
        ))}
      </Container>
    </div>
  );
}
