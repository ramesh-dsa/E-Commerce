import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { GuidelinesHeader } from "@/components/design-system/GuidelinesHeader";
import { GuidelinesTreeSidebar } from "@/components/design-system/GuidelinesTreeSidebar";
import { GuidelinesLivingSource } from "@/components/design-system/GuidelinesLivingSource";
import { GuidelinesSplitFooter } from "@/components/design-system/GuidelinesSplitFooter";
import { GuidelinesPhilosophySection } from "@/components/design-system/GuidelinesPhilosophySection";
import { GuidelinesLogoSection } from "@/components/design-system/GuidelinesLogoSection";
import { GuidelinesColorSection } from "@/components/design-system/GuidelinesColorSection";
import { GuidelinesTypographySection } from "@/components/design-system/GuidelinesTypographySection";
import { GuidelinesLayoutSection } from "@/components/design-system/GuidelinesLayoutSection";
import { GuidelinesShapeSection } from "@/components/design-system/GuidelinesShapeSection";
import { GuidelinesMotionSection } from "@/components/design-system/GuidelinesMotionSection";
import { GuidelinesZIndexSection } from "@/components/design-system/GuidelinesZIndexSection";
import { GuidelinesComponentsSection } from "@/components/design-system/GuidelinesComponentsSection";
import { GuidelinesArchitectureSection } from "@/components/design-system/GuidelinesArchitectureSection";
import { GuidelinesA11ySection } from "@/components/design-system/GuidelinesA11ySection";
import { GuidelinesTransitionSection } from "@/components/design-system/GuidelinesTransitionSection";
import { GuidelinesQuickRefSection } from "@/components/design-system/GuidelinesQuickRefSection";

export const metadata: Metadata = {
  title: "VEYRO Design & Brand Guidelines",
  description: "Official design guidelines and brand system for the VEYRO storefront.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased selection:bg-veyro-yellow selection:text-veyro-black">
      {/* ── Modern Editorial Header ── */}
      <GuidelinesHeader />

      <Container className="py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* ── Hierarchical Tree Navigation Sidebar ── */}
          <GuidelinesTreeSidebar />

          {/* ── Main Specification Content Stream (13 Modular Sections) ── */}
          <main className="flex-1 min-w-0 flex flex-col gap-16">
            {/* ── 01. Brand Philosophy & Craftsmanship ── */}
            <GuidelinesPhilosophySection />

            {/* ── 02. Logo & Clear Space Architecture ── */}
            <GuidelinesLogoSection />

            {/* ── 03. Color & OKLAB Ramp ── */}
            <GuidelinesColorSection />

            {/* ── 04. Fluid Typography Ladder ── */}
            <GuidelinesTypographySection />

            {/* ── 05. Layout & Spacing Architecture ── */}
            <GuidelinesLayoutSection />

            {/* ── 06. Shape, Radii & Elevation ── */}
            <GuidelinesShapeSection />

            {/* ── 07. Motion, Easing & Physics ── */}
            <GuidelinesMotionSection />

            {/* ── 08. Z-Index Stacking Ladder ── */}
            <GuidelinesZIndexSection />

            {/* ── 09. Components & Interactive Controls ── */}
            <GuidelinesComponentsSection />

            {/* ── 10. Architecture & Code Standards ── */}
            <GuidelinesArchitectureSection />

            {/* ── 11. Language, Tone & A11y Contracts ── */}
            <GuidelinesA11ySection />

            {/* ── 12. Transition Guidance & Governance ── */}
            <GuidelinesTransitionSection />

            {/* ── 13. Quick Reference & PR Quality Gate ── */}
            <GuidelinesQuickRefSection />

            {/* ── Signature Brutalist Bottom Card: The Living Source ── */}
            <GuidelinesLivingSource />
          </main>
        </div>
      </Container>

      {/* ── Asymmetrical Editorial Split Footer ── */}
      <GuidelinesSplitFooter />
    </div>
  );
}
