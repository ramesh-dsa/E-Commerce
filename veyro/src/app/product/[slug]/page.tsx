import React from "react";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductGallery } from "@/components/features/ProductGallery";
import { ProductBuyBox } from "@/components/features/ProductBuyBox";
import { ProductCarousel } from "@/components/features/ProductCarousel";
import { ProductBackButton } from "@/components/features/ProductBackButton";
import { ProductReviewsSection } from "@/components/features/ProductReviewsSection";
import { Container } from "@/components/ui/Container";
import { ProductDetailView } from "@/components/features/ProductDetailView";
import type { Metadata } from "next";

// Statically pre-render all 32 products for instant 0ms transitions
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
      title: "Product Archive | VEYRO",
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
  const initialProduct = products.find((p) => p.slug === slug) || null;

  return <ProductDetailView slug={slug} initialProduct={initialProduct} />;
}

