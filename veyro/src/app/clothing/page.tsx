import React from "react";
import type { Metadata } from "next";
import { ClothingCatalog } from "@/components/features/ClothingCatalog";

export const metadata: Metadata = {
  title: "Apparel Archive — 240+ GSM Heavyweight & Oversized T-Shirts | VEYRO",
  description:
    "Explore the complete VEYRO clothing archive. Heavyweight 240+ GSM combed cotton oversized t-shirts, graphic drops, breathable waffle textures, and minimal summer linen.",
  openGraph: {
    title: "VEYRO Apparel Archive | Luxury Streetwear",
    description: "240+ GSM Heavyweight Combed Cotton & Archival Silhouettes",
  },
};

export default function ClothingPage() {
  return <ClothingCatalog />;
}
