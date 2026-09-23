import React from "react";
import type { Metadata } from "next";
import { WatchesCatalog } from "@/components/features";

export const metadata: Metadata = {
  title: "The Horology Archive — Architectural Timepieces & Chronographs | VEYRO",
  description:
    "Explore the complete VEYRO horology archive. High-precision automatic mechanical and meca-quartz chronographs, double-domed sapphire crystal, and handcrafted Italian leather straps.",
  openGraph: {
    title: "VEYRO Horology Archive | Architectural Timepieces",
    description: "Automatic Mechanical Calibres & Surgical 316L Stainless Steel Watches",
  },
};

export default function WatchesPage() {
  return <WatchesCatalog />;
}
