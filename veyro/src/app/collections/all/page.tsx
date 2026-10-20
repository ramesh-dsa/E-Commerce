import React from "react";
import type { Metadata } from "next";
import { AllProductsCatalog } from "@/components/features/AllProductsCatalog";

export const metadata: Metadata = {
  title: "Complete Archive — All 35 Silhouettes & Calibres | VEYRO",
  description:
    "Explore the complete VEYRO product archive. Heavyweight 240+ GSM oversized t-shirts, handcrafted vulcanized sneakers, and Swiss & Japanese mechanical timepieces.",
  openGraph: {
    title: "Complete VEYRO Archive | All Products",
    description: "240+ GSM Heavyweight Combed Cotton, Vulcanized Footwear, and Mechanical Horology",
  },
};

export default function AllProductsPage() {
  return <AllProductsCatalog />;
}
