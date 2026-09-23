import React from "react";
import type { Metadata } from "next";
import { FootwearCatalog } from "@/components/features";

export const metadata: Metadata = {
  title: "The Sneaker Vault — Vulcanized Silhouettes & Retro Runners | VEYRO",
  description:
    "Explore the complete VEYRO footwear archive. Handcrafted Italian vulcanized rubber soles, premium leather court lows, retro suede runners, and orthotic comfort insoles.",
  openGraph: {
    title: "VEYRO Sneaker Vault | Vulcanized Footwear Archive",
    description: "Italian Vulcanized Rubber Soles & Full-Grain Leather Silhouettes",
  },
};

export default function ShoesPage() {
  return <FootwearCatalog />;
}
