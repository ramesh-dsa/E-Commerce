import React from "react";
import type { Metadata } from "next";
import { AllProductsCatalog } from "@/components/features/AllProductsCatalog";

export const metadata: Metadata = {
  title: "Shop All Products — Complete VEYRO Collection",
  description:
    "Explore the complete VEYRO product archive. Heavyweight 240+ GSM oversized t-shirts, handcrafted vulcanized sneakers, and Swiss & Japanese mechanical timepieces.",
};

export default function ShopPage() {
  return <AllProductsCatalog />;
}
