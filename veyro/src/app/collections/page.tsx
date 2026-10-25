import React from "react";
import type { Metadata } from "next";
import { CollectionsShowcase } from "@/components/features/CollectionsShowcase";
import { CollectionsCatalog } from "@/components/features/CollectionsCatalog";

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
  return (
    <main className="w-full bg-neutral-50">
      {/* ── 1. INTERACTIVE COLLECTION HERO SHOWCASE (Fan Deck -> Rail -> Detail) ── */}
      <CollectionsShowcase />

      {/* ── 2. CURATED CAPSULE VOLUMES CATALOG ── */}
      <CollectionsCatalog showHeroHeader={false} />
    </main>
  );
}
