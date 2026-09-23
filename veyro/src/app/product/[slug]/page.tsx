import React from "react";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductGallery } from "@/components/features/ProductGallery";
import { ProductBuyBox } from "@/components/features/ProductBuyBox";
import { ProductCarousel } from "@/components/features/ProductCarousel";
import { ProductBackButton } from "@/components/features/ProductBackButton";
import { ProductReviewsSection } from "@/components/features/ProductReviewsSection";
import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

// Statically pre-render all 24 products for instant 0ms transitions
export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return {
      title: "Product Not Found | VEYRO",
    };
  }

  return {
    title: `${product.name} — ${product.category} | VEYRO`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | VEYRO Archive`,
      description: product.shortDescription,
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
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
  const shoeRecommendations = (isClothing || isWatch)
    ? (() => {
        const relatedShoes = (product.relatedProducts || [])
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is typeof products[number] => p !== undefined && p.category === "Footwear");
        const remainingShoes = products.filter(
          (p) => p.category === "Footwear" && !relatedShoes.some((rs) => rs.id === p.id)
        );
        return [...relatedShoes, ...remainingShoes].slice(0, 8);
      })()
    : [];

  // "Pair With Tees" — shown for footwear and watches
  const clothingPairings = (isFootwear || isWatch)
    ? (() => {
        const relatedTees = (product.relatedProducts || [])
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is typeof products[number] => p !== undefined && p.category === "Clothing");
        const remainingTees = products.filter(
          (p) => p.category === "Clothing" && !relatedTees.some((rt) => rt.id === p.id)
        );
        return [...relatedTees, ...remainingTees].slice(0, 8);
      })()
    : [];

  // "Pair With Watches" — shown universally as an accessory (unless already viewing a watch)
  const watchRecommendations = !isWatch
    ? (() => {
        const relatedWatches = (product.relatedProducts || [])
          .map((id) => products.find((p) => p.id === id))
          .filter((p): p is typeof products[number] => p !== undefined && p.category === "Watches");
        const remainingWatches = products.filter(
          (p) => p.category === "Watches" && !relatedWatches.some((rw) => rw.id === p.id)
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
      subtitle: `More from ${product.subcategoryTag || product.category}`
    });
  }
  
  if (watchRecommendations.length > 0) {
    carouselSections.push({
      products: watchRecommendations,
      title: "ACCESSORIZE WITH WATCHES",
      subtitle: "Elevate your look"
    });
  }
  
  if (clothingPairings.length > 0) {
    carouselSections.push({
      products: clothingPairings,
      title: "PAIR WITH CLOTHING",
      subtitle: "Engineered to style together"
    });
  }
  
  if (shoeRecommendations.length > 0) {
    carouselSections.push({
      products: shoeRecommendations,
      title: "PAIR WITH SHOES",
      subtitle: "Step up your game"
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
