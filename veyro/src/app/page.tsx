import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  PromoFlipBanner,
  NewArrivalsSection,
  BrandPillarsSection,
  TshirtsSection,
  EditorialBanner,
  FootwearSection,
} from "@/components/features";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-veyro-black overflow-clip">
      {/* Main Header / Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
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

        {/* 4. Split Editorial Lookbook Banner */}
        <EditorialBanner />

        {/* 5. Footwear / Sneakers Lineup with Style Filters */}
        <FootwearSection />
      </main>

      {/* Modern D2C Storefront Footer */}
      <Footer />
    </div>
  );
}
