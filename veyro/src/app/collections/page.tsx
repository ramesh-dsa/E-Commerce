import React from "react";
import type { Metadata } from "next";
import { CollectionsCatalog } from "@/components/features";

export const metadata: Metadata = {
  title: "Collections & Curated Drops — Heavyweight T-Shirts & Sneakers | VEYRO",
  description:
    "Explore VEYRO curated capsules. Heavyweight 240+ GSM oversized cotton t-shirts, handcrafted vulcanized Italian sneakers, summer resort linen, and graphic art drops.",
  openGraph: {
    title: "VEYRO Archive Collections | Curated Capsule Drops",
    description: "240+ GSM Heavyweight Cotton, Vulcanized Sneakers, and Summer Linen Edits",
  },
};

export default function CollectionsPage() {
  return <CollectionsCatalog />;
}
