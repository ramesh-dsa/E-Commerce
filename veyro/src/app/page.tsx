import {
  Hero,
  PromoFlipBanner,
  NewArrivalsSection,
  BrandPillarsSection,
  TshirtsSection,
  FootwearSection,
} from "@/components/features";

export default function Home() {
  return (
    <>
      {/* Multi-Panel Fashion Campaign Hero */}
      <Hero />

      {/* 3D Flipping Promotional Offers */}
      <PromoFlipBanner />

      {/* 1. Latest Drops / New Arrivals Grid with Category Tabs */}
      <NewArrivalsSection />

      {/* 2. Brand Value Pillars & Craftsmanship Highlights */}
      <BrandPillarsSection />

      {/* 3. T-Shirts Archive Showcase with Fit Filters */}
      <TshirtsSection />

      {/* 4. Footwear / Sneakers Lineup with Style Filters */}
      <FootwearSection />
    </>
  );
}
