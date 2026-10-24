import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo, VeyroMark } from "@/components/ui/Logo";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Star,
  Truck,
  ShieldCheck,
  Check,
  ArrowRight,
  Search,
  Heart,
  ShoppingBag,
  ExternalLink,
  SlidersHorizontal,
  Package,
} from "lucide-react";

export const metadata: Metadata = {
  title: "VEYRO Design & Brand Guidelines",
  description: "Official design guidelines and brand system for the VEYRO storefront.",
  robots: {
    index: false,
    follow: false,
  },
};

const SECTIONS = [
  { id: "section-1", title: "1. Brand Overview" },
  { id: "section-2", title: "2. Logo" },
  { id: "section-3", title: "3. Colour" },
  { id: "section-4", title: "4. Typography" },
  { id: "section-5", title: "5. Layout and Spacing" },
  { id: "section-6", title: "6. Shape and Elevation" },
  { id: "section-7", title: "7. Components" },
  { id: "section-8", title: "8. Iconography and Imagery" },
  { id: "section-9", title: "9. Motion" },
  { id: "section-10", title: "10. Layering" },
  { id: "section-11", title: "11. Page Templates" },
  { id: "section-12", title: "12. Accessibility & Responsive" },
  { id: "section-13", title: "13. Do and Don't" },
  { id: "section-14", title: "14. Known Inconsistencies" },
  { id: "section-15", title: "15. Maintenance" },
];

const COLORS = [
  {
    hex: "#111111",
    token: "--color-veyro-black",
    role: "Primary text ink, primary button backgrounds, header typography (559 code occurrences)",
    whiteContrast: "18.88:1",
    whiteRating: "AAA",
    blackContrast: "1.00:1",
    blackRating: "Fail",
    isDark: true,
  },
  {
    hex: "#FCD017",
    token: "--color-veyro-yellow",
    role: "Brand gold accent: badges, notification dots, active underlines, focus accents (170 code occurrences)",
    whiteContrast: "1.48:1",
    whiteRating: "Fail",
    blackContrast: "12.74:1",
    blackRating: "AAA",
    isDark: false,
  },
  {
    hex: "#E5BC05",
    token: "--color-veyro-yellow-dark",
    role: "Hover state for gold accent buttons and badges",
    whiteContrast: "1.82:1",
    whiteRating: "Fail",
    blackContrast: "10.37:1",
    blackRating: "AAA",
    isDark: false,
  },
  {
    hex: "#FFD400",
    token: "--veyro-accent",
    role: "Secondary gold literal in globals :root and Logo accent bar",
    whiteContrast: "1.43:1",
    whiteRating: "Fail",
    blackContrast: "13.19:1",
    blackRating: "AAA",
    isDark: false,
  },
  {
    hex: "#1F1F1F",
    token: "--color-veyro-charcoal",
    role: "Dark surface elevation, hover state for black buttons",
    whiteContrast: "16.48:1",
    whiteRating: "AAA",
    blackContrast: "1.15:1",
    blackRating: "Fail",
    isDark: true,
  },
  {
    hex: "#999999",
    token: "--color-veyro-muted",
    role: "Secondary product metadata, inactive indicators, micro copy",
    whiteContrast: "2.85:1",
    whiteRating: "Fail",
    blackContrast: "6.63:1",
    blackRating: "AA",
    isDark: false,
  },
  {
    hex: "#8E8E8E",
    token: "--color-veyro-subtle",
    role: "Subtle metadata borders, filter tags, secondary label copy",
    whiteContrast: "3.28:1",
    whiteRating: "Fail",
    blackContrast: "5.76:1",
    blackRating: "AA",
    isDark: false,
  },
  {
    hex: "#E8E8E5",
    token: "--color-veyro-border",
    role: "Canonical storefront surface border token (27 literals; Tailwind neutral-200 has 286 occurrences)",
    whiteContrast: "1.23:1",
    whiteRating: "Fail",
    blackContrast: "15.38:1",
    blackRating: "AAA",
    isDark: false,
  },
  {
    hex: "#F0F0ED",
    token: "--color-veyro-border-light",
    role: "Light horizontal divider, table row separator, sub-bar border",
    whiteContrast: "1.14:1",
    whiteRating: "Fail",
    blackContrast: "16.54:1",
    blackRating: "AAA",
    isDark: false,
  },
  {
    hex: "#F8F8F6",
    token: "--color-veyro-surface",
    role: "Section background surface, skeleton card loader base",
    whiteContrast: "1.06:1",
    whiteRating: "Fail",
    blackContrast: "17.76:1",
    blackRating: "AAA",
    isDark: false,
  },
  {
    hex: "#F3F3F0",
    token: "--color-veyro-surface-alt",
    role: "Alternate section surface, secondary button background",
    whiteContrast: "1.11:1",
    whiteRating: "Fail",
    blackContrast: "16.99:1",
    blackRating: "AAA",
    isDark: false,
  },
  {
    hex: "#FFFFFF",
    token: "--color-veyro-card",
    role: "Clean canvas background, card face, light modal background (766 occurrences)",
    whiteContrast: "1.00:1",
    whiteRating: "None",
    blackContrast: "18.88:1",
    blackRating: "AAA",
    isDark: false,
  },
  {
    hex: "#C44D25",
    token: "--color-veyro-accent",
    role: "Terracotta warm accent in @theme: discount tags, sale badges",
    whiteContrast: "4.73:1",
    whiteRating: "AA",
    blackContrast: "3.99:1",
    blackRating: "Fail",
    isDark: true,
  },
  {
    hex: "#A33C1A",
    token: "--color-veyro-accent-hover",
    role: "Terracotta hover state",
    whiteContrast: "6.52:1",
    whiteRating: "AAA",
    blackContrast: "2.89:1",
    blackRating: "Fail",
    isDark: true,
  },
  {
    hex: "#FDF3EF",
    token: "--color-veyro-accent-light",
    role: "Terracotta tinted background for promotional notices",
    whiteContrast: "1.09:1",
    whiteRating: "Fail",
    blackContrast: "17.30:1",
    blackRating: "AAA",
    isDark: false,
  },
  {
    hex: "#0A0A0A",
    token: "Not defined",
    role: "Cinematic dark canvas in BrandPillarsSection.tsx",
    whiteContrast: "19.80:1",
    whiteRating: "AAA",
    blackContrast: "1.05:1",
    blackRating: "Fail",
    isDark: true,
  },
  {
    hex: "#050505",
    token: "Not defined",
    role: "Pure luxury brutalist canvas in Footer.tsx",
    whiteContrast: "20.38:1",
    whiteRating: "AAA",
    blackContrast: "1.08:1",
    blackRating: "Fail",
    isDark: true,
  },
  {
    hex: "#09090B",
    token: "Not defined (Zinc-950)",
    role: "Dark overlay and modal canvas in AccountModal.tsx",
    whiteContrast: "19.90:1",
    whiteRating: "AAA",
    blackContrast: "1.05:1",
    blackRating: "Fail",
    isDark: true,
  },
  {
    hex: "#10B981",
    token: "Not defined (Emerald-500)",
    role: "Live delivery tracking, optical QR beam, success toast icon",
    whiteContrast: "2.54:1",
    whiteRating: "Fail",
    blackContrast: "7.44:1",
    blackRating: "AA",
    isDark: false,
  },
  {
    hex: "#EF4444",
    token: "Not defined (Red-500)",
    role: "Form validation error, danger toast icon, sold out dot",
    whiteContrast: "3.76:1",
    whiteRating: "Fail",
    blackContrast: "5.02:1",
    blackRating: "AA",
    isDark: false,
  },
  {
    hex: "#F59E0B",
    token: "Not defined (Amber-500)",
    role: "Warning notice, low stock alert pill",
    whiteContrast: "2.15:1",
    whiteRating: "Fail",
    blackContrast: "8.79:1",
    blackRating: "AA",
    isDark: false,
  },
];

export default function DesignGuidelinesPage() {
  return (
    <div className="min-h-screen bg-white text-[#111111] antialiased">
      {/* Top Header Bar */}
      <div className="border-b border-[#e8e8e5] bg-[#f8f8f6] py-10">
        <Container>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#999999]">
                [ SYSTEM SPECIFICATION ]
              </span>
              <span className="inline-block h-3 w-px bg-[#e8e8e5]" />
              <span className="font-mono text-xs uppercase tracking-wider text-veyro-black">
                VERSION 1.0 &bull; 2026-10-24
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] uppercase">
              VEYRO Design Guidelines &amp; Brand System
            </h1>
            <p className="max-w-3xl text-sm sm:text-base text-[#555555]">
              Authoritative, evidence-backed brand and design system documentation grounded strictly in the active storefront codebase on branch{" "}
              <code className="font-mono bg-[#e8e8e5] px-1.5 py-0.5 rounded text-xs text-[#111111]">main</code>.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sticky Table of Contents */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto rounded-lg border border-[#e8e8e5] bg-[#f8f8f6] p-5 shadow-xs">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-[#111111] mb-4 pb-2 border-b border-[#e8e8e5]">
                Table of Contents
              </h2>
              <nav className="flex flex-col gap-1.5 text-xs font-medium">
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="py-1 text-[#555555] hover:text-[#111111] hover:underline underline-offset-4 transition-colors"
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 flex flex-col gap-16">
            {/* SECTION 1 */}
            <section id="section-1" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 01 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">1. Brand Overview</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                VEYRO is a contemporary men&apos;s fashion and footwear brand based in India, specializing in heavyweight streetwear, vulcanized retro footwear, architectural tailoring, and precision horology.
              </p>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">The Three Value Pillars</h3>
              <p className="text-xs text-[#8e8e8e] mb-3">Defined in <code className="font-mono">src/components/features/BrandPillarsSection.tsx</code></p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-3">Pillar ID</th>
                      <th className="p-3">Pillar Title</th>
                      <th className="p-3">Code Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-3 font-mono font-bold">01</td>
                      <td className="p-3 font-bold text-[#111111]">240+ GSM HEAVYWEIGHT</td>
                      <td className="p-3 text-[#555555]">100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash. Engineered to feel substantial on the body.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">02</td>
                      <td className="p-3 font-bold text-[#111111]">CRAFTED IN TIRUPUR</td>
                      <td className="p-3 text-[#555555]">Direct partnerships with India&apos;s most respected artisanal garment mills. Every stitch is placed with precision by master craftsmen.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold">03</td>
                      <td className="p-3 font-bold text-[#111111]">ZERO MIDDLEMEN</td>
                      <td className="p-3 text-[#555555]">Pure direct-to-consumer model. We bypass traditional retail markups to bring you premium luxury-grade fabrics at honest, accessible prices.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Brand Personality</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { title: "Architectural", desc: "Rigid silhouettes, 240+ GSM cotton, boxy drop-shoulders" },
                  { title: "Brutalist", desc: "Monochromatic high-contrast surfaces, razor-sharp dividers" },
                  { title: "Artisanal", desc: "Tirupur long-staple cotton, vulcanized Italian rubber" },
                  { title: "Understated", desc: "Quiet luxury, minimalist utility, zero gaudy branding" },
                ].map((p) => (
                  <div key={p.title} className="p-4 rounded-lg border border-[#e8e8e5] bg-[#f8f8f6]">
                    <div className="font-bold text-xs uppercase tracking-wider text-[#111111] mb-1">{p.title}</div>
                    <div className="text-xs text-[#555555]">{p.desc}</div>
                  </div>
                ))}
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-2">Voice and Tone Rules</h3>
              <ul className="list-disc list-inside text-xs sm:text-sm text-[#555555] space-y-1 mb-4">
                <li>Confident, technical, and declarative.</li>
                <li>Never use hype-driven marketing fluff or hyperbolic discounts.</li>
                <li>State fabric specifications, weights, mill origins, and hardware engineering directly.</li>
              </ul>
              <div className="bg-[#f8f8f6] border border-[#e8e8e5] rounded p-4 mb-6">
                <span className="font-mono text-xs uppercase font-semibold text-[#8e8e8e] block mb-2">Real Storefront Copy Samples</span>
                <p className="text-xs text-[#555555] italic mb-1.5">&ldquo;Built For The Archive. We reject seasonal trends. Every piece is engineered with obsessive attention to fabric weight, structural drape, and minimalist utility.&rdquo; (BrandPillarsSection.tsx)</p>
                <p className="text-xs text-[#555555] italic mb-1.5">&ldquo;Engineered for the modern Indian uniform. Architectural cuts, premium textiles, and brutalist silhouettes.&rdquo; (Footer.tsx)</p>
                <p className="text-xs text-[#555555] italic mb-1.5">&ldquo;Combed cotton jersey &bull; Zero-sag ribbed collars &bull; Boxy drop-shoulder&rdquo; (ClothingCatalog.tsx)</p>
                <p className="text-xs text-[#555555] italic">&ldquo;MADE IN INDIA &bull; GLOBAL STANDARD&rdquo; (Footer.tsx)</p>
              </div>

              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: The brand wordmark is always written in full capitals as VEYRO. Never write &quot;Veyro&quot; or &quot;veyro&quot; in body text.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Navigation links, action buttons, category filter tags, metadata identifiers ([ 001 ]), and status badges are rendered in uppercase with tracking-wider or tracking-widest.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Script accent titles rendered in Dancing Script use lowercase cursive (for example: &quot;clean slate&quot;, &quot;breeze easy&quot;, &quot;the signature vault&quot;).
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="section-2" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 02 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">2. Logo</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                The VEYRO visual identity is defined in <code className="font-mono">src/components/ui/Logo.tsx</code> with two exported vector primitives: the full geometric wordmark (<code className="font-mono">Logo</code>) and the standalone glyph mark (<code className="font-mono">VeyroMark</code>).
              </p>

              {/* Logo Specimens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-6 rounded-lg border border-[#e8e8e5] bg-white flex flex-col items-center justify-center gap-4">
                  <Logo height={32} variant="black" />
                  <span className="font-mono text-[11px] text-[#8e8e8e] uppercase">Wordmark &bull; Black Variant (Default on Light)</span>
                </div>
                <div className="p-6 rounded-lg border border-[#1f1f1f] bg-[#050505] flex flex-col items-center justify-center gap-4">
                  <Logo height={32} variant="white" />
                  <span className="font-mono text-[11px] text-[#999999] uppercase">Wordmark &bull; White Variant (On Dark Footers/Banners)</span>
                </div>
                <div className="p-6 rounded-lg border border-[#e8e8e5] bg-white flex flex-col items-center justify-center gap-4">
                  <Logo height={32} variant="accent" />
                  <span className="font-mono text-[11px] text-[#8e8e8e] uppercase">Wordmark &bull; Accent Variant (With 5px Gold Top Bar)</span>
                </div>
                <div className="p-6 rounded-lg border border-[#e8e8e5] bg-[#f8f8f6] flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-6">
                    <VeyroMark className="w-8 h-8 text-[#111111]" />
                    <VeyroMark className="w-6 h-6 text-[#111111]" />
                    <VeyroMark className="w-5 h-5 text-[#fcd017]" />
                  </div>
                  <span className="font-mono text-[11px] text-[#8e8e8e] uppercase">Standalone Glyph &bull; VeyroMark (Letter V Vector)</span>
                </div>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-3">Property</th>
                      <th className="p-3">Wordmark (Logo)</th>
                      <th className="p-3">Glyph (VeyroMark)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-3 font-semibold">ViewBox</td>
                      <td className="p-3 font-mono">160 55 658 140</td>
                      <td className="p-3 font-mono">170 65 115 121</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Vector Geometry</td>
                      <td className="p-3">Letters V, E, Y, R, O with geometric squircle O</td>
                      <td className="p-3">Letter V path: VEYRO_V_PATH</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Default Height</td>
                      <td className="p-3 font-mono">28px (height=&#123;28&#125;)</td>
                      <td className="p-3 font-mono">20px (w-5 h-5)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Minimum Height</td>
                      <td className="p-3 font-mono">26px (Mobile Nav / AccountModal)</td>
                      <td className="p-3 font-mono">16px (w-4 h-4)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Clear Space</td>
                      <td className="p-3">Minimum 50% glyph height on all sides</td>
                      <td className="p-3">Minimum 8px clear boundary</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Do use variant=&quot;white&quot; whenever placing the logo over #050505, #0A0A0A, #111111, or photographic campaign overlays.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Do preserve aspect ratio with w-auto shrink-0.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Don&apos;t recreate the logo with text fonts. Always render the SVG component from src/components/ui/Logo.tsx.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Don&apos;t render the logo smaller than 26px in height on any storefront viewport.
              </div>
            </section>

            {/* SECTION 3 */}
                        <section id="section-3" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 03 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">3. Colour</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                The VEYRO palette is built upon high-contrast brutalist neutrals, pure white canvas, dark architectural stages, and a signature gold accent.
              </p>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Live Swatches &amp; Accessibility Contrast</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {COLORS.slice(0, 15).map((c) => (
                  <div key={c.hex} className="rounded-lg border border-[#e8e8e5] overflow-hidden bg-white shadow-xs">
                    <div
                      className="h-16 w-full flex items-center justify-between px-3 border-b border-[#e8e8e5]"
                      style={{ backgroundColor: c.hex }}
                    >
                      <span className={`font-mono text-xs font-bold uppercase ${c.isDark ? "text-white" : "text-[#111111]"}`}>
                        {c.hex}
                      </span>
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${c.isDark ? "bg-white/20 text-white" : "bg-black/10 text-[#111111]"}`}>
                        {c.whiteRating === "AAA" ? "AAA (18+:1)" : c.whiteRating === "AA" ? "AA (4.5+:1)" : "FAILS ON WHITE"}
                      </span>
                    </div>
                    <div className="p-3 text-xs flex flex-col gap-1">
                      <div className="font-mono text-[11px] font-semibold text-[#111111]">{c.token}</div>
                      <div className="text-[#555555] line-clamp-2">{c.role}</div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-[#8e8e8e]">
                        <span>On White: {c.whiteContrast}</span>
                        <span>&bull;</span>
                        <span>On #111: {c.blackContrast}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Canonical Rule</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Hex</th>
                      <th className="p-2.5">Token Name</th>
                      <th className="p-2.5">Usage Rule</th>
                      <th className="p-2.5">Contrast on #FFFFFF</th>
                      <th className="p-2.5">Contrast on #111111</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    {COLORS.map((c) => (
                      <tr key={c.hex + c.token}>
                        <td className="p-2.5 font-mono font-bold flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded border border-black/10 inline-block" style={{ backgroundColor: c.hex }} />
                          {c.hex}
                        </td>
                        <td className="p-2.5 font-mono text-[#555555]">{c.token}</td>
                        <td className="p-2.5 text-[#555555]">{c.role}</td>
                        <td className="p-2.5 font-mono">
                          <span className={c.whiteRating === "AAA" ? "text-emerald-700 font-bold" : c.whiteRating === "AA" ? "text-blue-700" : "text-neutral-400"}>
                            {c.whiteContrast} ({c.whiteRating})
                          </span>
                        </td>
                        <td className="p-2.5 font-mono">
                          <span className={c.blackRating === "AAA" ? "text-emerald-700 font-bold" : c.blackRating === "AA" ? "text-blue-700" : "text-neutral-400"}>
                            {c.blackContrast} ({c.blackRating})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">
                Page Base Background &amp; Base Text Colour (All 15 Storefront Screens)
              </h3>
              <p className="text-xs text-[#555555] mb-3 leading-relaxed">
                An exact audit of the base container background class, computed hex tint, base typography color, and contrast rating across all 15 storefront screens on branch <code className="font-mono">main</code>.
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Screen / Route</th>
                      <th className="p-2.5">Primary Source File</th>
                      <th className="p-2.5">Base Background Class</th>
                      <th className="p-2.5">Hex</th>
                      <th className="p-2.5">Base Text Colour</th>
                      <th className="p-2.5">Classification &amp; Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-bold">Homepage (/)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-white (body default)</td>
                      <td className="p-2.5 font-mono font-bold">#FFFFFF</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Canonical Background (18.88:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Clothing (/clothing)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/clothing/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-white</td>
                      <td className="p-2.5 font-mono font-bold">#FFFFFF</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Canonical Background (18.88:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Shoes (/shoes)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/shoes/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-white</td>
                      <td className="p-2.5 font-mono font-bold">#FFFFFF</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Canonical Background (18.88:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Watches (/watches)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/watches/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-white</td>
                      <td className="p-2.5 font-mono font-bold">#FFFFFF</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Canonical Background (18.88:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Collections (/collections)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/collections/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-[#fbfbf9] (main:41)</td>
                      <td className="p-2.5 font-mono font-bold">#FBFBF9</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-amber-800 font-medium">Variation: Warm curatorial off-white (18.23:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Product Details (/product/[slug])</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/product/[slug]/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-white</td>
                      <td className="p-2.5 font-mono font-bold">#FFFFFF</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Canonical Background (18.88:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Shopping Bag (/cart)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/cart/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-neutral-50/70 (div:70)</td>
                      <td className="p-2.5 font-mono font-bold">#FAFAFA</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-blue-800 font-medium">Variation: Utility workflow neutral tint (18.04:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Checkout (/checkout)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/checkout/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-neutral-50/70 (div:248)</td>
                      <td className="p-2.5 font-mono font-bold">#FAFAFA</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-blue-800 font-medium">Variation: Utility workflow neutral tint (18.04:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Wishlist (/wishlist)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/wishlist/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-neutral-50/60 (div:85)</td>
                      <td className="p-2.5 font-mono font-bold">#FAFAFA</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-blue-800 font-medium">Variation: Utility workflow neutral tint (18.04:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Orders Hub (/orders)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/orders/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-[#FAFAFA] (div:412)</td>
                      <td className="p-2.5 font-mono font-bold">#FAFAFA</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 / text-neutral-900</td>
                      <td className="p-2.5 text-blue-800 font-medium">Variation: Utility workflow neutral tint (18.04:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Order Details (/orders/[id])</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/orders/[id]/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-[#FAFAFA] (div:192)</td>
                      <td className="p-2.5 font-mono font-bold">#FAFAFA</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 / text-neutral-900</td>
                      <td className="p-2.5 text-blue-800 font-medium">Variation: Utility workflow neutral tint (18.04:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Order Return Flow (/orders/[id]/return)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/orders/[id]/return/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-neutral-50 (div:152)</td>
                      <td className="p-2.5 font-mono font-bold">#FAFAFA</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 (text-veyro-black)</td>
                      <td className="p-2.5 text-blue-800 font-medium">Variation: Utility workflow neutral tint (18.04:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Account (/account)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/account/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-[#FAFAFA] (div:30)</td>
                      <td className="p-2.5 font-mono font-bold">#FAFAFA</td>
                      <td className="p-2.5 font-mono text-[#111111]">#111111 / text-neutral-900</td>
                      <td className="p-2.5 text-blue-800 font-medium">Variation: Utility workflow neutral tint (18.04:1 AAA)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Customer Care &amp; FAQ (/faq)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/app/faq/page.tsx</td>
                      <td className="p-2.5 font-mono">bg-white (div:19)</td>
                      <td className="p-2.5 font-mono font-bold">#FFFFFF</td>
                      <td className="p-2.5 font-mono font-bold text-sky-950">#101828 (Deep Navy)</td>
                      <td className="p-2.5 text-indigo-900 font-medium">Canonical Background + Unique Deep Navy text palette</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Member Login Modal (AccountModal)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">src/components/features/AccountModal.tsx</td>
                      <td className="p-2.5 font-mono">bg-[#0c0c0e] (div:412)</td>
                      <td className="p-2.5 font-mono font-bold">#0C0C0E</td>
                      <td className="p-2.5 font-mono text-neutral-200">text-white (#FFFFFF)</td>
                      <td className="p-2.5 text-neutral-700 font-medium">Variation: Dark brutalist modal surface (bg-black/85 backdrop)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Count of Distinct Background Tints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="p-3.5 rounded-lg border border-[#e8e8e5] bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#111111]">#FFFFFF</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">CANONICAL</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-[#111111]">6 screens</div>
                  <div className="text-[11px] text-[#555555] mt-1">Root default (layout.tsx) + browsing pages (/, /clothing, /shoes, /watches, /product/[slug], /faq)</div>
                </div>

                <div className="p-3.5 rounded-lg border border-[#e8e8e5] bg-[#FAFAFA]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#111111]">#FAFAFA</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">VARIATION</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-[#111111]">7 screens</div>
                  <div className="text-[11px] text-[#555555] mt-1">Utility workflows (/cart, /checkout, /wishlist, /orders, /orders/[id], /orders/[id]/return, /account)</div>
                </div>

                <div className="p-3.5 rounded-lg border border-[#e8e8e5] bg-[#FBFBF9]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#111111]">#FBFBF9</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">VARIATION</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-[#111111]">1 screen</div>
                  <div className="text-[11px] text-[#555555] mt-1">Archival collections showcase (/collections) warm curatorial canvas</div>
                </div>

                <div className="p-3.5 rounded-lg border border-[#0c0c0e] bg-[#0C0C0E] text-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-white">#0C0C0E</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">VARIATION</span>
                  </div>
                  <div className="text-xl font-bold font-mono text-white">1 dialog</div>
                  <div className="text-[11px] text-neutral-300 mt-1">Account authentication modal (AccountModal) architectural dark stage</div>
                </div>
              </div>

              {/* FAQ Navy Text Palette */}
              <div className="p-4 rounded-lg border border-[#e8e8e5] bg-[#f8f8f6] mb-6">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#111111] mb-1.5">FAQ Navy Text Palette (Isolated Typography System)</h4>
                <p className="text-xs text-[#555555] leading-relaxed mb-3">
                  While the storefront universally standardizes on <code className="font-mono">#111111</code> (<code className="font-mono">text-veyro-black</code>) for primary copy, <code className="font-mono">src/app/faq/page.tsx</code> introduces an isolated deep navy / slate typography system:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded border border-[#e8e8e5] bg-white">
                    <div className="flex items-center justify-between font-mono text-xs mb-1">
                      <span className="font-bold text-[#101828]">#101828</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">16.14:1 AAA</span>
                    </div>
                    <div className="text-xs font-bold text-[#101828]">Deep Navy Headings</div>
                    <div className="text-[11px] text-[#555555]">Primary FAQ titles, active category tabs, concierge header</div>
                  </div>

                  <div className="p-2.5 rounded border border-[#e8e8e5] bg-white">
                    <div className="flex items-center justify-between font-mono text-xs mb-1">
                      <span className="font-bold text-[#344054]">#344054</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">9.51:1 AAA</span>
                    </div>
                    <div className="text-xs font-bold text-[#344054]">Slate Navy Questions</div>
                    <div className="text-[11px] text-[#555555]">Accordion trigger question titles (font-semibold)</div>
                  </div>

                  <div className="p-2.5 rounded border border-[#e8e8e5] bg-white">
                    <div className="flex items-center justify-between font-mono text-xs mb-1">
                      <span className="font-bold text-[#475467]">#475467</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-blue-50 text-blue-800 font-bold">6.97:1 AA</span>
                    </div>
                    <div className="text-xs font-bold text-[#475467]">Muted Slate Tabs</div>
                    <div className="text-[11px] text-[#555555]">Inactive category tab labels and concierge descriptions</div>
                  </div>

                  <div className="p-2.5 rounded border border-[#e8e8e5] bg-white">
                    <div className="flex items-center justify-between font-mono text-xs mb-1">
                      <span className="font-bold text-[#667085]">#667085</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-blue-50 text-blue-800 font-bold">4.58:1 AA</span>
                    </div>
                    <div className="text-xs font-bold text-[#667085]">Slate Gray Answers</div>
                    <div className="text-[11px] text-[#555555]">Accordion answer body copy (text-sm leading-relaxed)</div>
                  </div>

                  <div className="p-2.5 rounded border border-[#e8e8e5] bg-white">
                    <div className="flex items-center justify-between font-mono text-xs mb-1">
                      <span className="font-bold text-[#98a2b3]">#98A2B3</span>
                      <span className="text-[10px] px-1 py-0.5 rounded bg-rose-50 text-rose-800 font-bold">2.58:1 FAIL</span>
                    </div>
                    <div className="text-xs font-bold text-[#98a2b3]">Light Slate Metadata</div>
                    <div className="text-[11px] text-[#555555]">Concierge card subtitle and search input placeholder</div>
                  </div>
                </div>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Variations in Code</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Value</th>
                      <th className="p-2.5">Count</th>
                      <th className="p-2.5">Purpose in Code</th>
                      <th className="p-2.5">Example Files</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-mono font-bold">#111111 (literal)</td>
                      <td className="p-2.5 font-mono">559</td>
                      <td className="p-2.5">Hardcoded primary ink text and dark backgrounds</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">ArchiveFilterSidebar.tsx, PromoFlipBanner.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">white (token)</td>
                      <td className="p-2.5 font-mono">766</td>
                      <td className="p-2.5">White surface and text</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">CartDrawer.tsx, Navbar.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">black (token)</td>
                      <td className="p-2.5 font-mono">287</td>
                      <td className="p-2.5">Deep black backgrounds and icons</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Footer.tsx, BrandPillarsSection.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">neutral-200 (token)</td>
                      <td className="p-2.5 font-mono">286</td>
                      <td className="p-2.5">Standard Tailwind neutral border and dividers</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">CartDrawer.tsx, WishlistDrawer.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">#FCD017 (literal)</td>
                      <td className="p-2.5 font-mono">170</td>
                      <td className="p-2.5">Hardcoded gold accents and borders</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">StarBorder.tsx, Hero.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">#666666 (literal)</td>
                      <td className="p-2.5 font-mono">40</td>
                      <td className="p-2.5">Secondary text gray</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">CancelOrderModal.tsx, addresses/page.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">#888888 (literal)</td>
                      <td className="p-2.5 font-mono">37</td>
                      <td className="p-2.5">Tertiary metadata and counter text</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">ProductSearch.tsx, Footer.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">#555555 (literal)</td>
                      <td className="p-2.5 font-mono">23</td>
                      <td className="p-2.5">Body charcoal text (accessible AAA)</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Navbar.tsx, section/[slug]/page.tsx</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-2">How to Use</h3>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: For light surfaces (#FFFFFF or #F8F8F6), always set primary text to #111111 (text-veyro-black) to guarantee 18.88:1 AAA contrast.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Never use the gold accent #FCD017 as text on white backgrounds (contrast 1.48:1 fails WCAG AA). Pair gold with #111111 text, or use gold text against dark surfaces (#111111 or #050505) where contrast is 12.74:1 AAA.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: For subtle text on white surfaces, use #555555 (7.46:1 AAA) or #666666 (5.74:1 AA). Do not use #999999 for essential readable body text on white.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Dark background surfaces (#050505, #0A0A0A, #09090B) are reserved for deliberate architectural moments: the global Footer, the Brand Pillars sticky stack, promo banner left stubs, and the Account login modal.
              </div>
            </section>

            {/* SECTION 4 */}
            <section id="section-4" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 04 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">4. Typography</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                VEYRO uses Next.js Google Fonts loaded in <code className="font-mono">src/app/layout.tsx</code> to drive a geometric, monospaced, and luxury serif hierarchy.
              </p>

              {/* Real Type Specimens */}
              <div className="rounded-lg border border-[#e8e8e5] p-6 bg-[#f8f8f6] flex flex-col gap-6 mb-6">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#8e8e8e] block mb-1">
                    Geist Sans &bull; font-sans (Default Storefront Body &amp; Headings Across All 178 Files)
                  </span>
                  <div className="font-sans text-3xl font-bold text-[#111111] uppercase tracking-tight">
                    ARCHITECTURAL CUTS &bull; 240+ GSM HEAVYWEIGHT
                  </div>
                  <div className="font-sans text-sm text-[#555555] mt-1">
                    The quick brown fox jumps over the lazy dog. 100% long-staple Indian combed cotton.
                  </div>
                </div>

                <div className="border-t border-[#e8e8e5] pt-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#8e8e8e] block mb-1">
                    Geist Mono &bull; font-mono (Technical Metadata, SKUs, Coupons &bull; 157 Occurrences)
                  </span>
                  <div className="font-mono text-xl font-bold text-[#111111] uppercase tracking-wider">
                    [ 001 ] SKU: VEY-240-BLK-OVS &bull; CODE: VEYRO10
                  </div>
                </div>

                <div className="border-t border-[#e8e8e5] pt-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#8e8e8e] block mb-1">
                    Dancing Script &bull; font-script (Calligraphic Accent Titles &bull; 19 Occurrences)
                  </span>
                  <div className="font-script text-3xl text-[#111111]">
                    clean slate, the signature vault, breeze easy
                  </div>
                </div>

                <div className="border-t border-[#e8e8e5] pt-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#8e8e8e] block mb-1">
                    Montserrat &bull; font-luxury (Luxury Section Headings &bull; 19 Occurrences in 5 Files)
                  </span>
                  <div className="font-luxury text-2xl font-bold text-[#111111] uppercase tracking-wider">
                    ATELIER CAPSULE COLLECTION &bull; VOLUME I
                  </div>
                </div>

                <div className="border-t border-[#e8e8e5] pt-4">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-[#8e8e8e] block mb-1">
                    Outfit &bull; [font-family:var(--font-outfit)] (Feature Showcase &bull; 23 Occurrences in 5 Files)
                  </span>
                  <div style={{ fontFamily: "var(--font-outfit), sans-serif" }} className="text-2xl font-bold text-[#111111] uppercase">
                    CURATED CAPSULES &bull; VEYRO ARCHIVE
                  </div>
                </div>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Canonical Rule</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Font Family</th>
                      <th className="p-2.5">CSS Variable</th>
                      <th className="p-2.5">Fallback Stack</th>
                      <th className="p-2.5">Role in Code</th>
                      <th className="p-2.5">Occurrences</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-bold">Geist Sans</td>
                      <td className="p-2.5 font-mono">--font-geist-sans</td>
                      <td className="p-2.5 font-mono">-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif</td>
                      <td className="p-2.5">Default body, primary headings, navigation, form inputs</td>
                      <td className="p-2.5 font-mono">Applied to &lt;html&gt; / &lt;body&gt; (178 files; 23 explicit font-sans)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Geist Mono</td>
                      <td className="p-2.5 font-mono">--font-geist-mono</td>
                      <td className="p-2.5 font-mono">monospace</td>
                      <td className="p-2.5">Technical metadata, section tags ([ 001 ]), SKU identifiers, coupons</td>
                      <td className="p-2.5 font-mono">157 occurrences</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Dancing Script</td>
                      <td className="p-2.5 font-mono">--font-dancing-script</td>
                      <td className="p-2.5 font-mono">cursive, sans-serif</td>
                      <td className="p-2.5">Artistic calligraphic subheadings (.font-script)</td>
                      <td className="p-2.5 font-mono">19 occurrences</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Montserrat</td>
                      <td className="p-2.5 font-mono">--font-montserrat</td>
                      <td className="p-2.5 font-mono">system-ui, -apple-system, sans-serif</td>
                      <td className="p-2.5">Luxury typography system (.font-luxury)</td>
                      <td className="p-2.5 font-mono">19 occurrences in 5 files</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Outfit</td>
                      <td className="p-2.5 font-mono">--font-outfit</td>
                      <td className="p-2.5 font-mono">sans-serif</td>
                      <td className="p-2.5">Feature showcase typography in CollectionsShowcase.tsx</td>
                      <td className="p-2.5 font-mono">23 occurrences in 5 files</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Variations in Code</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Tailwind Utility</th>
                      <th className="p-2.5">Count</th>
                      <th className="p-2.5">Primary Purpose</th>
                      <th className="p-2.5">Example Files</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-mono font-bold">text-xs (12px)</td>
                      <td className="p-2.5 font-mono">571</td>
                      <td className="p-2.5">Dominant standard size: badges, filter chips, metadata, uppercase tags</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">ProductCard.tsx, ArchiveFilterSidebar.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">text-[11px] (arbitrary)</td>
                      <td className="p-2.5 font-mono">312</td>
                      <td className="p-2.5">Dominant micro-size: announcement marquee, badges, footer legal, metadata</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">AnnouncementBar.tsx, cart/page.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">text-sm (14px)</td>
                      <td className="p-2.5 font-mono">213</td>
                      <td className="p-2.5">Standard card body, product titles, input fields</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">ProductCard.tsx, Navbar.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">text-[10px] (arbitrary)</td>
                      <td className="p-2.5 font-mono">178</td>
                      <td className="p-2.5">Micro tags, stock badges, rating counters</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">cart/page.tsx, CollectionsShowcase.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">font-bold (700)</td>
                      <td className="p-2.5 font-mono">579</td>
                      <td className="p-2.5">Dominant weight: headings, tags, buttons, badges</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Badge.tsx, ProductCard.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">uppercase</td>
                      <td className="p-2.5 font-mono">494</td>
                      <td className="p-2.5">Universal capitalization across storefront</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Navbar.tsx, AnnouncementBar.tsx</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-2">How to Use</h3>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Default to font-sans (Geist Sans) for all standard storefront copy and user interfaces.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Pair all technical data, bracketed category indices ([ 001 ]), coupon codes, and timestamps with font-mono (Geist Mono).
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Use .font-script (Dancing Script) sparingly for single-line editorial accents above architectural headings.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Maintain uppercase styling with tracking-wider on all navigation, action buttons, category tags, and metadata badges.
              </div>
            </section>

            {/* SECTION 5 */}
            <section id="section-5" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 05 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">5. Layout and Spacing</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                VEYRO uses a disciplined grid and container architecture centered on a custom 1540px container.
              </p>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Canonical Rule</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Dimension</th>
                      <th className="p-2.5">Canonical Value</th>
                      <th className="p-2.5">Code Source</th>
                      <th className="p-2.5">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-bold">Desktop Container Max-Width</td>
                      <td className="p-2.5 font-mono">max-w-[1540px]</td>
                      <td className="p-2.5 font-mono">Container.tsx:17</td>
                      <td className="p-2.5">Full storefront section wrapper</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Mobile Horizontal Padding</td>
                      <td className="p-2.5 font-mono">px-4 (16px)</td>
                      <td className="p-2.5 font-mono">Container.tsx:25</td>
                      <td className="p-2.5">Viewports under 640px</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Tablet Horizontal Padding</td>
                      <td className="p-2.5 font-mono">sm:px-8 (32px)</td>
                      <td className="p-2.5 font-mono">Container.tsx:25</td>
                      <td className="p-2.5">Viewports 640px to 1279px</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Desktop Horizontal Padding</td>
                      <td className="p-2.5 font-mono">xl:px-10 (40px)</td>
                      <td className="p-2.5 font-mono">Container.tsx:25</td>
                      <td className="p-2.5">Viewports 1280px and wider</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Standard Section Padding</td>
                      <td className="p-2.5 font-mono">py-12 sm:py-16 lg:py-24</td>
                      <td className="p-2.5 font-mono">page.tsx</td>
                      <td className="p-2.5">Vertical separation between major storefront sections</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Standard Grid Gap</td>
                      <td className="p-2.5 font-mono">gap-4 sm:gap-6 lg:gap-8</td>
                      <td className="p-2.5 font-mono">NewArrivalsSection.tsx</td>
                      <td className="p-2.5">Product catalog grid spacing</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Variations in Code</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Value</th>
                      <th className="p-2.5">Count</th>
                      <th className="p-2.5">Purpose in Code</th>
                      <th className="p-2.5">Example Files</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-mono font-bold">gap-2</td>
                      <td className="p-2.5 font-mono">324</td>
                      <td className="p-2.5">Micro gaps in buttons, tags, rating pills</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">ProductCard.tsx, Navbar.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">gap-1</td>
                      <td className="p-2.5 font-mono">200</td>
                      <td className="p-2.5">Tight icon and text pairings</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Badge.tsx, Footer.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">max-w-md (448px)</td>
                      <td className="p-2.5 font-mono">19</td>
                      <td className="p-2.5">Centered dialogs, toast notifications, auth forms</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Toast.tsx, CancelOrderModal.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">max-w-2xl (672px)</td>
                      <td className="p-2.5 font-mono">13</td>
                      <td className="p-2.5">Editorial subheadings and banner text</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">BrandPillarsSection.tsx</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-2">How to Use</h3>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Wrap all standard storefront pages in &lt;Container&gt; to guarantee synchronized 1540px alignment and responsive padding.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Catalog product grids must render 2 columns on mobile (grid-cols-2) and 4 columns on desktop (lg:grid-cols-4).
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Maintain gap-4 sm:gap-6 lg:gap-8 on product grids to preserve comfortable card breathing room.
              </div>
            </section>

            {/* SECTION 6 */}
            <section id="section-6" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 06 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">6. Shape and Elevation</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                Corner radiuses across the storefront are split between card containers, form elements, buttons, and status pills.
              </p>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Canonical Rule</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Element Type</th>
                      <th className="p-2.5">Canonical Radius</th>
                      <th className="p-2.5">Canonical Border</th>
                      <th className="p-2.5">Canonical Shadow</th>
                      <th className="p-2.5">Code Evidence &amp; Counts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-bold">Card Containers</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">rounded-xl (12px)</td>
                      <td className="p-2.5">None (light) / 1px white/8% (dark)</td>
                      <td className="p-2.5">hover:-translate-y-1.5 lift</td>
                      <td className="p-2.5 font-mono">111 card occurrences (rounded-xl) vs 74 (rounded-2xl)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Action Buttons</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">rounded-lg (8px)</td>
                      <td className="p-2.5">None (or 1px solid #111111 for outline)</td>
                      <td className="p-2.5">None</td>
                      <td className="p-2.5 font-mono">40 button/link occurrences (rounded-lg); ui/Button.tsx (rounded-[2px]) is unused</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Status Badges &amp; Pills</td>
                      <td className="p-2.5 font-mono font-bold">rounded-full</td>
                      <td className="p-2.5">1px solid rgba(255,255,255,0.2)</td>
                      <td className="p-2.5 font-mono">shadow-2xs</td>
                      <td className="p-2.5 font-mono">388 occurrences in Badge.tsx, filter chips, rating pills</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Form Inputs</td>
                      <td className="p-2.5 font-mono font-bold">rounded-lg (8px)</td>
                      <td className="p-2.5">1px solid #E8E8E5</td>
                      <td className="p-2.5">None</td>
                      <td className="p-2.5 font-mono">187 occurrences across checkout, account, and auth forms</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Slide-out Drawers</td>
                      <td className="p-2.5 font-mono">rounded-none</td>
                      <td className="p-2.5">border-l border-neutral-200</td>
                      <td className="p-2.5 font-mono">shadow-2xl</td>
                      <td className="p-2.5 font-mono">CartDrawer.tsx, WishlistDrawer.tsx</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg border border-[#e8e8e5] bg-[#f8f8f6]">
                  <h4 className="font-bold text-xs uppercase tracking-wide text-[#111111] mb-2">Card Radius Audit: rounded-xl vs rounded-2xl</h4>
                  <p className="text-xs text-[#555555] leading-relaxed mb-2">
                    Recount of card-type elements (product cards, panels, summary boxes, order cards, wishlist cards, promo cards):
                  </p>
                  <ul className="text-xs text-[#555555] space-y-1">
                    <li><strong>rounded-xl (12px):</strong> <span className="font-mono font-bold text-emerald-800">111 card occurrences</span> (113 total in storefront). Canonical card radius by majority count.</li>
                    <li><strong>rounded-2xl (16px):</strong> <span className="font-mono">74 card occurrences</span> (74 total in storefront). Prominent in ProductBuyBox and reviews modal.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-[#e8e8e5] bg-[#f8f8f6]">
                  <h4 className="font-bold text-xs uppercase tracking-wide text-[#111111] mb-2">Button Radius Audit: Real Buttons vs ui/Button.tsx</h4>
                  <p className="text-xs text-[#555555] leading-relaxed mb-2">
                    Analysis of 312 raw &lt;button&gt; tags and 22 button-like &lt;Link&gt; elements across storefront code:
                  </p>
                  <ul className="text-xs text-[#555555] space-y-1">
                    <li><strong>ui/Button.tsx Usage:</strong> Imported in 6 files, but rendered <strong>0 times</strong> in storefront code. It does NOT define the canonical button rule.</li>
                    <li><strong>rounded-lg (8px):</strong> <span className="font-mono font-bold text-emerald-800">40 total occurrences</span> (29 on buttons + 11 on links). Canonical explicit button radius.</li>
                    <li><strong>rounded-full:</strong> <span className="font-mono">33 total occurrences</span> (icon/pill buttons).</li>
                    <li><strong>rounded-[2px]:</strong> <span className="font-mono text-rose-700">0 occurrences</span> on real storefront buttons.</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-2">How to Use</h3>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Standard card containers must use canonical rounded-xl (12px) to match the 111 card instances across checkout, orders, cart, and catalogs.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Action buttons must use rounded-lg (8px) for structured buttons and rounded-full for icon/pill buttons. Do not rely on rounded-[2px] from ui/Button.tsx as that component is unused.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Elevate product cards via hardware-accelerated translation (hover:-translate-y-1.5 duration-300) rather than heavy static box-shadows.
              </div>
            </section>

            {/* SECTION 7 */}
            <section id="section-7" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 07 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">7. Components</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                A complete specification of all reusable and domain components present in the VEYRO storefront.
              </p>

              {/* Live Component Previews */}
              <div className="rounded-lg border border-[#e8e8e5] p-6 bg-[#f8f8f6] flex flex-col gap-6 mb-8">
                <div>
                  <span className="font-mono text-xs uppercase font-bold text-[#8e8e8e] block mb-3">Real Action Button Primitives in Use (rounded-lg)</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" className="inline-flex items-center justify-center font-semibold text-sm px-6 py-2.5 rounded-lg bg-[#111111] text-white hover:bg-neutral-800 transition-colors">
                      PRIMARY ACTION (rounded-lg)
                    </button>
                    <button type="button" className="inline-flex items-center justify-center font-medium text-sm px-5 py-2.5 rounded-lg border border-[#e8e8e5] bg-white text-[#111111] hover:bg-neutral-50 transition-colors">
                      OUTLINE BUTTON (rounded-lg)
                    </button>
                    <button type="button" className="inline-flex items-center justify-center font-semibold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-neutral-100 text-[#111111] hover:bg-neutral-200 transition-colors">
                      PILL BUTTON (rounded-full)
                    </button>
                    <button type="button" className="inline-flex items-center justify-center font-medium text-sm text-[#111111] hover:text-[#555555] underline underline-offset-4">
                      TEXT LINK &rarr;
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#e8e8e5] pt-4">
                  <span className="font-mono text-xs uppercase font-bold text-[#8e8e8e] block mb-3">Live Badge Primitives (rounded-full)</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="default" size="sm">NEW DROP</Badge>
                    <Badge variant="dark" size="sm">ARCHIVE</Badge>
                    <Badge variant="sale" size="sm">SAVE ₹500</Badge>
                    <Badge variant="outline" size="sm">LIMITED EDITION</Badge>
                  </div>
                </div>

                <div className="border-t border-[#e8e8e5] pt-4">
                  <span className="font-mono text-xs uppercase font-bold text-[#8e8e8e] block mb-3">Live Skeleton Loader (Hardware Sweeping Shimmer)</span>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    <Skeleton className="h-24 w-full" />
                    <div className="col-span-2 flex flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full mt-2" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Component Breakdown Cards */}
              <div className="space-y-6">
                {[
                  {
                    title: "7.1 Announcement Bar",
                    file: "src/components/layout/AnnouncementBar.tsx",
                    purpose: "Global marquee communicating free shipping thresholds, drop releases, and return guarantees.",
                    classes: "relative z-40 w-full bg-[#fcd017] text-[#111111] select-none flex items-center overflow-hidden h-[36px]",
                    states: "Default: Scrolling 40s linear loop. Hover: Animation pauses via play-state: paused.",
                  },
                  {
                    title: "7.2 Navbar",
                    file: "src/components/layout/Navbar.tsx",
                    purpose: "Primary application header providing navigation, brand anchor, search trigger, account access, wishlist counter, and cart drawer launcher.",
                    classes: "sticky top-0 z-50 w-full bg-white flex items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-14",
                    states: "Active underline expands from left (origin-left duration-500). Focus: ring-2 ring-[#fcd017].",
                  },
                  {
                    title: "7.3 Hero Panels",
                    file: "src/components/features/Hero.tsx & HeroPanel.tsx",
                    purpose: "Full-bleed campaign slider showcasing seasonal collections across an auto-advancing 3-panel viewport.",
                    classes: "h-[calc(100dvh-118px)] min-h-[460px] sliding panels with 11px CSS gap",
                    states: "Image hover: scale-[1.02] duration-700. Auto-advance every 4500ms (paused on scroll).",
                  },
                  {
                    title: "7.4 Buttons",
                    file: "Authored inline as raw <button> elements across 45 storefront files",
                    purpose: "Primary interactive action trigger across all storefront forms, carts, and catalogs. ui/Button.tsx is imported in 6 files but rendered 0 times.",
                    classes: "Dominant primary action: bg-[#111111] text-white hover:bg-neutral-800 rounded-lg text-sm font-semibold tracking-wide py-3 px-6",
                    states: "Hover: Transition to neutral-800. Focus: Only 16 buttons (5.1%) have explicit focus styles; 296 rely on browser defaults.",
                  },
                  {
                    title: "7.5 Product Card",
                    file: "src/components/features/ProductCard.tsx",
                    purpose: "Universal commercial card representing products in catalog grids and carousels.",
                    classes: "group flex flex-col isolate transition-transform duration-300 ease-out hover:-translate-y-1.5 rounded-xl sm:rounded-2xl",
                    states: "Hover lifts 6px, secondary image fades in (opacity-100 duration-300), image scales 1.05.",
                  },
                  {
                    title: "7.6 Badges",
                    file: "src/components/ui/Badge.tsx",
                    purpose: "Status flags, promotion indicators, and category highlights on product cards.",
                    classes: "inline-flex items-center justify-center uppercase font-bold rounded-full backdrop-blur-md shadow-2xs border border-white/20",
                    states: "default (white/95), dark (neutral-950/90), sale (bg-veyro-accent terracotta), outline.",
                  },
                  {
                    title: "7.7 Inputs and Forms",
                    file: "src/app/checkout/page.tsx & src/components/layout/Footer.tsx",
                    purpose: "Customer data capture for shipping addresses, contact info, search queries, and newsletter signups.",
                    classes: "w-full px-4 py-3 rounded-lg border border-[#e8e8e5] text-sm text-[#111111] focus:border-[#111111]",
                    states: "Focus: border-[#111111]. Dark autofill protection applied via box-shadow 0 0 0 1000px #050505 inset.",
                  },
                  {
                    title: "7.8 Search",
                    file: "src/components/features/ProductSearch.tsx",
                    purpose: "Real-time fuzzy product and custom section discovery.",
                    classes: "Desktop: absolute top-full w-[420px] bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl. Mobile: fixed inset-0 z-[150] bg-white h-[100dvh].",
                    states: "Typewriter phrase rotation driven via DOM ref without React state re-renders.",
                  },
                  {
                    title: "7.9 Cart Drawer",
                    file: "src/components/features/CartDrawer.tsx",
                    purpose: "Global slide-over bag and instant checkout funnel.",
                    classes: "fixed inset-0 z-50 flex justify-end; panel: w-full max-w-[460px] h-full bg-white shadow-2xl animate-drawer-in",
                    states: "Spring pop on quantity changes (.animate-qty-pop), hardware-accelerated drawer slide-in.",
                  },
                  {
                    title: "7.10 Wishlist",
                    file: "src/components/features/WishlistDrawer.tsx & WishlistButton.tsx",
                    purpose: "Saved items management and cross-session persistence.",
                    classes: "Button: w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-xs. Drawer: max-w-[480px] slide-over.",
                    states: "Active saved state fills heart icon with #111111. Instant batch Move All to Bag CTA.",
                  },
                  {
                    title: "7.11 Modals and Drawers",
                    file: "src/components/features/AccountModal.tsx & CancelOrderModal.tsx",
                    purpose: "Contextual overlays for authentication, order cancellation, and size charts.",
                    classes: "AccountModal: max-w-5xl bg-[#0c0c0e] text-white rounded-3xl border border-white/12 shadow-[0_35px_100px_rgba(0,0,0,0.95)].",
                    states: "Esc key closes dialog; backdrop click triggers dismissal; focus trapped within modal.",
                  },
                  {
                    title: "7.12 Toasts",
                    file: "src/components/ui/Toast.tsx",
                    purpose: "Accessible micro-notifications for cart actions, wishlist toggles, and system alerts.",
                    classes: "fixed z-50 bg-[#0c0d0e]/95 backdrop-blur-md border border-white/10 shadow-2xl text-neutral-100 rounded-2xl px-4 py-3",
                    states: "role=status aria-live=polite. Auto-dismiss after timeout or manual close.",
                  },
                  {
                    title: "7.13 Skeletons",
                    file: "src/components/ui/Skeleton.tsx",
                    purpose: "Zero-layout-reflow loading states during catalog hydration and route transitions.",
                    classes: "relative overflow-hidden bg-veyro-surface rounded-sm; shimmer: 1.4s infinite sweep",
                    states: "motion-reduce:animate-none disables animation for accessibility.",
                  },
                  {
                    title: "7.14 Footer and Newsletter Pass",
                    file: "src/components/layout/Footer.tsx & TearTicket.tsx",
                    purpose: "Brand closing statement, VIP pass tear interaction, navigation directory, and copyright legal strip.",
                    classes: "relative w-full bg-[#050505] text-white pt-16 sm:pt-24 pb-12 border-t border-[#1a1a1a]",
                    states: "TearTicket: Interactive mouse drag tears perforated ticket to reveal VEYRO10 discount code.",
                  },
                  {
                    title: "7.15 Promo Banners",
                    file: "src/components/features/TshirtPromoBanner.tsx & PromoFlipBanner.tsx",
                    purpose: "Highlighting high-volume bundle offers (T-Shirts 3 at 1199; Sneakers 500 off).",
                    classes: "max-w-[1300px] ticket-notched banner using CSS mask gradients. PromoFlipBanner flips 3D every 5000ms.",
                    states: "Flip card pauses on hover/focus; keyboard navigable switch.",
                  },
                  {
                    title: "7.16 Reviews",
                    file: "src/components/features/ProductReviewsSection.tsx",
                    purpose: "Social proof breakdown, star ratings, verified buyer badges, and review submissions.",
                    classes: "Star icons filled with #fcd017; quantitative rating bars filled with #111111.",
                    states: "Verified buyer badge, helpful count voter, modal submission dialog.",
                  },
                  {
                    title: "7.17 Order Status and Tracking",
                    file: "src/app/orders/page.tsx & src/app/orders/[id]/page.tsx",
                    purpose: "Multi-stage order fulfillment tracking and return portal.",
                    classes: "Timeline stepper: Confirmed -> Packed -> Shipped -> Out for Delivery -> Delivered.",
                    states: "Active step features gold circle badge with pulsing beacon ring (animate-live-ping).",
                  },
                ].map((comp) => (
                  <div key={comp.title} className="p-4 rounded-lg border border-[#e8e8e5] bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h4 className="font-bold text-sm text-[#111111] uppercase tracking-wide">{comp.title}</h4>
                      <span className="font-mono text-[11px] text-[#8e8e8e]">{comp.file}</span>
                    </div>
                    <p className="text-xs text-[#555555] mb-2">{comp.purpose}</p>
                    <div className="font-mono text-[11px] bg-[#f8f8f6] p-2 rounded border border-[#e8e8e5] text-[#111111] mb-2 break-all">
                      {comp.classes}
                    </div>
                    <div className="text-xs text-[#555555]">
                      <strong className="text-[#111111]">States:</strong> {comp.states}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 8 */}
            <section id="section-8" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 08 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">8. Iconography and Imagery</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                VEYRO combines sharp technical line iconography with editorial, high-contrast studio photography.
              </p>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Canonical Rule</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Library / Source</th>
                      <th className="p-2.5">Primary Usages</th>
                      <th className="p-2.5">Sizes in Use</th>
                      <th className="p-2.5">Example Files</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-bold font-mono">src/components/ui/Icons.tsx</td>
                      <td className="p-2.5">Core shopping chrome: Search, User, Heart, ShoppingCart, Menu, Close, ArrowRight</td>
                      <td className="p-2.5 font-mono">14px, 16px, 20px, 24px</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Navbar.tsx, Footer.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono">lucide-react</td>
                      <td className="p-2.5">Functional indicators: Star, Truck, Package, ShieldCheck, Check, Trash2, SlidersHorizontal</td>
                      <td className="p-2.5 font-mono">12px, 14px, 16px, 18px, 20px</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">ProductCard.tsx, orders/page.tsx</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold font-mono">Custom SVG Primitives</td>
                      <td className="p-2.5">Brand glyph VeyroMark, social icons (Instagram, X, YouTube, Spotify), delivery truck</td>
                      <td className="p-2.5 font-mono">14px, 16px, 20px, 32px</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Logo.tsx, Footer.tsx</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Image Assets in public/</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Folder Path</th>
                      <th className="p-2.5">File Count</th>
                      <th className="p-2.5">File Formats</th>
                      <th className="p-2.5">Content Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-mono font-bold">public/hero/</td>
                      <td className="p-2.5 font-mono">6</td>
                      <td className="p-2.5 font-mono">.webp</td>
                      <td className="p-2.5">Panel campaign hero photography</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">public/products/tshirts/</td>
                      <td className="p-2.5 font-mono">70</td>
                      <td className="p-2.5 font-mono">.webp, .jpg</td>
                      <td className="p-2.5">Heavyweight t-shirt primary and hover garment photography</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">public/products/watches/</td>
                      <td className="p-2.5 font-mono">31</td>
                      <td className="p-2.5 font-mono">.png, .webp, .jpg</td>
                      <td className="p-2.5">High-precision timepiece photography with transparent and studio backgrounds</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">public/products/shoes/</td>
                      <td className="p-2.5 font-mono">33</td>
                      <td className="p-2.5 font-mono">.webp, .jpg</td>
                      <td className="p-2.5">Vulcanized Italian rubber footwear and retro runners</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold">public/images/</td>
                      <td className="p-2.5 font-mono">66</td>
                      <td className="p-2.5 font-mono">.png, .webp, .jpg</td>
                      <td className="p-2.5">Promo textures, campaign lookbook backgrounds</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-2">How to Use</h3>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Always set quality=80 or quality=85 for WebP images to balance sharpness with loading speed.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Use fill with sizes=&quot;(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw&quot; on product card images to prevent loading oversized image assets on mobile.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Set priority and fetchPriority=&quot;high&quot; exclusively on the first visible Hero panel and the top collection banner.
              </div>
            </section>

            {/* SECTION 9 */}
            <section id="section-9" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 09 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">9. Motion</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                Storefront motion is strictly hardware-accelerated, animating only transform and opacity to maintain 120fps performance on mobile and desktop.
              </p>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Canonical Rule</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Motion Target</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Easing Curve</th>
                      <th className="p-2.5">Code Implementation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-bold">Interactive Transition</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">200ms (duration-200)</td>
                      <td className="p-2.5 font-mono">ease-out / ease-in-out</td>
                      <td className="p-2.5">131 occurrences (canonical duration)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Structural / Modal Lift</td>
                      <td className="p-2.5 font-mono">300ms (duration-300)</td>
                      <td className="p-2.5 font-mono">cubic-bezier(0.16, 1, 0.3, 1)</td>
                      <td className="p-2.5">113 occurrences</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Button Active Press</td>
                      <td className="p-2.5 font-mono">150ms</td>
                      <td className="p-2.5 font-mono">cubic-bezier(0.34, 1.56, 0.64, 1)</td>
                      <td className="p-2.5 font-mono">globals.css:392 (.filter-btn-press:active)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Image Hover Zoom</td>
                      <td className="p-2.5 font-mono">500ms</td>
                      <td className="p-2.5 font-mono">ease-out</td>
                      <td className="p-2.5 font-mono">ProductCard.tsx:66 (group-hover:scale-105)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Drawer Slide-In</td>
                      <td className="p-2.5 font-mono">300ms (0.3s)</td>
                      <td className="p-2.5 font-mono">cubic-bezier(0.16, 1, 0.3, 1)</td>
                      <td className="p-2.5 font-mono">globals.css:657 (.animate-drawer-in)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Hero Sliding Window</td>
                      <td className="p-2.5 font-mono">700ms</td>
                      <td className="p-2.5 font-mono">ease-in-out</td>
                      <td className="p-2.5 font-mono">Hero.tsx:222 (transition: transform 700ms)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Announcement Marquee</td>
                      <td className="p-2.5 font-mono">40s</td>
                      <td className="p-2.5 font-mono">linear infinite</td>
                      <td className="p-2.5 font-mono">globals.css:165 (.animate-marquee)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-2">How to Use</h3>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Never animate top, left, width, height, or margin. Always animate transform (translate3d, scale) and opacity.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Avoid universal transition-all (223 occurrences in existing code); declare specific transitions (transition-transform, transition-opacity, transition-colors) for performance.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Use motion/react as the single canonical motion library for React components (used in 35 files vs 7 for framer-motion).
              </div>
            </section>

            {/* SECTION 10 */}
                        <section id="section-10" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 10 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">10. Layering</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                A comprehensive recount of every <code className="font-mono">z-*</code> class across the VEYRO storefront, classifying canonical values by purpose alongside one-off and ad-hoc overrides.
              </p>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Canonical Z-Index Scale (By Majority Purpose)</h3>
              <p className="text-xs text-[#555555] mb-3 leading-relaxed">
                The canonical scale consists exclusively of standard Tailwind z-index tokens that represent the dominant value for their respective architectural purpose:
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Canonical Token</th>
                      <th className="p-2.5">Occurrences</th>
                      <th className="p-2.5">Purpose in Code</th>
                      <th className="p-2.5">Dominant Element Types &amp; Files</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-10</td>
                      <td className="p-2.5 font-mono font-bold">99</td>
                      <td className="p-2.5">Badges, card media controls, rating pills, active panel content</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Sold out pill, ratings, WishlistButton (ProductCard.tsx), slide panels (Hero.tsx)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-20</td>
                      <td className="p-2.5 font-mono font-bold">25</td>
                      <td className="p-2.5">Interactive overlays, photo nav arrows, ambient illumination</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Bento spotlight border (SpotlightBentoCard.tsx), gallery arrows (ProductGallery.tsx), pillar sticky cards (BrandPillarsSection.tsx)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-30</td>
                      <td className="p-2.5 font-mono font-bold">11</td>
                      <td className="p-2.5">Sticky catalog filter toolbars, active dropdown menus</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Category filter sub-bar (ClothingCatalog.tsx:409, WatchesCatalog.tsx:581, FootwearCatalog.tsx:428, AllProductsCatalog.tsx:194), sort dropdown (SortDropdown.tsx:56)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-40</td>
                      <td className="p-2.5 font-mono font-bold">7</td>
                      <td className="p-2.5">Secondary sticky headers, announcement marquee</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Announcement marquee (AnnouncementBar.tsx:23), sticky checkout summary bar (checkout/page.tsx:968), sticky return nav (orders/[id]/page.tsx:239)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-50</td>
                      <td className="p-2.5 font-mono font-bold">22</td>
                      <td className="p-2.5">Primary global headers, slide-over drawers, modals, toasts</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">Sticky Navbar (Navbar.tsx:252), CartDrawer.tsx:527, WishlistDrawer.tsx:182, AccountModal.tsx:396, CancelOrderModal.tsx:85, Toast.tsx:71</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">One-Off and Ad-Hoc Z-Index Values</h3>
              <p className="text-xs text-[#555555] mb-3 leading-relaxed">
                The following non-standard and bracketed values exist in the codebase as isolated, one-off overrides. They are excluded from the canonical scale:
              </p>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Value</th>
                      <th className="p-2.5">Occurrences</th>
                      <th className="p-2.5">Element Description</th>
                      <th className="p-2.5">File Path &amp; Line</th>
                      <th className="p-2.5">Status &amp; Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-amber-800">z-1</td>
                      <td className="p-2.5 font-mono">9</td>
                      <td className="p-2.5">Directional dark gradient scrims and vignette overlays over campaign banners</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">FootwearCatalog.tsx:393, 610, 611, ClothingCatalog.tsx:376, 582, 583, CollectionsCatalog.tsx:355, AccountModal.tsx:427, 428</td>
                      <td className="p-2.5 text-amber-800 font-medium">Ad-hoc sub-layer: Non-standard utility used between base (z-0) and content (z-10)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-neutral-600">z-0</td>
                      <td className="p-2.5 font-mono">8</td>
                      <td className="p-2.5">Return stepper track lines, decorative gradient lines, inactive slider backgrounds</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">app/orders/[id]/return/page.tsx:255, 259, 420, 720, WatchesCatalog.tsx:531, FootwearSection.tsx:465, 466, CollectionsCatalog.tsx:340</td>
                      <td className="p-2.5 text-neutral-600 font-medium">Base layer: Standard background utility, not an overlay</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-rose-800">z-[70]</td>
                      <td className="p-2.5 font-mono font-bold text-rose-800">1</td>
                      <td className="p-2.5">Toast notification container mount inside AccountModal dialog</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">components/features/AccountModal.tsx:390</td>
                      <td className="p-2.5 text-rose-800 font-medium">One-off override: Elevates toast notifications above the z-50 modal backdrop</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-rose-800">z-[100]</td>
                      <td className="p-2.5 font-mono">2</td>
                      <td className="p-2.5">Mobile navigation menu slide-out drawer; mobile catalog filter drawer</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">components/layout/Navbar.tsx:497, src/app/section/[slug]/page.tsx:222</td>
                      <td className="p-2.5 text-rose-800 font-medium">One-off override: Ad-hoc drawer elevation that bypasses canonical z-50</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-rose-800">z-[150]</td>
                      <td className="p-2.5 font-mono font-bold text-rose-800">1</td>
                      <td className="p-2.5">Fullscreen mobile search takeover overlay</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">components/features/ProductSearch.tsx:243</td>
                      <td className="p-2.5 text-rose-800 font-medium">One-off override: Extreme elevation ensuring search covers headers, drawers, and toasts</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-3">Complete Table of All Z-Index Values in Code</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Z-Index Value</th>
                      <th className="p-2.5">Total Count</th>
                      <th className="p-2.5">Purpose &amp; Elements Using It</th>
                      <th className="p-2.5">Exact Files in Storefront</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-10</td>
                      <td className="p-2.5 font-mono font-bold">99</td>
                      <td className="p-2.5">Product card badges, rating pills, WishlistButton, active slide wrappers, modal text lockups</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">31 files (ProductCard.tsx, HeroPanel.tsx, Hero.tsx, AccountModal.tsx, CancelOrderModal.tsx, y-axis.tsx, etc.)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-20</td>
                      <td className="p-2.5 font-mono font-bold">25</td>
                      <td className="p-2.5">Spotlight bento borders, photo nav buttons, clickable full-panel links, flip sneaker cutout graphic, pillar sticky text</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">15 files (SpotlightBentoCard.tsx, ProductGallery.tsx, HeroPanel.tsx, BrandPillarsSection.tsx, PromoFlipBanner.tsx)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-50</td>
                      <td className="p-2.5 font-mono font-bold">22</td>
                      <td className="p-2.5">Primary sticky Navbar, CartDrawer, WishlistDrawer, AccountModal, CancelOrderModal, sidebar filter drawers, search popover, toasts</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">19 files (Navbar.tsx, CartDrawer.tsx, WishlistDrawer.tsx, AccountModal.tsx, CancelOrderModal.tsx, Toast.tsx, SortDropdown.tsx)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-30</td>
                      <td className="p-2.5 font-mono font-bold">11</td>
                      <td className="p-2.5">Sticky catalog filter toolbars, sort dropdown menu container, TearTicket holographic foil, ScrollArea scroll thumb</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">10 files (ClothingCatalog.tsx, WatchesCatalog.tsx, FootwearCatalog.tsx, AllProductsCatalog.tsx, PromoFlipBanner.tsx, TearTicket.tsx, SortDropdown.tsx, ScrollArea.tsx)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-amber-800">z-1</td>
                      <td className="p-2.5 font-mono">9</td>
                      <td className="p-2.5">Directional dark gradient scrims over banner photos, radial vignette masks</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">4 files (ClothingCatalog.tsx, FootwearCatalog.tsx, CollectionsCatalog.tsx, AccountModal.tsx)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-neutral-600">z-0</td>
                      <td className="p-2.5 font-mono">8</td>
                      <td className="p-2.5">Stepper connector lines, inactive slider slides, background scrim tracks</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">4 files (orders/[id]/return/page.tsx, WatchesCatalog.tsx, FootwearSection.tsx, CollectionsCatalog.tsx)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-emerald-800">z-40</td>
                      <td className="p-2.5 font-mono font-bold">7</td>
                      <td className="p-2.5">Announcement marquee bar, sticky checkout summary header, order details sticky return bar, review sort popover</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">6 files (AnnouncementBar.tsx, checkout/page.tsx, orders/page.tsx, orders/[id]/page.tsx, ProductReviewsSection.tsx, CollectionsInteractiveShowcase.tsx)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-rose-800">z-[100]</td>
                      <td className="p-2.5 font-mono">2</td>
                      <td className="p-2.5">Mobile navigation slide-out drawer, mobile section filter drawer</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">2 files (Navbar.tsx:497, section/[slug]/page.tsx:222)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-rose-800">z-[150]</td>
                      <td className="p-2.5 font-mono font-bold text-rose-800">1</td>
                      <td className="p-2.5">Fullscreen mobile search modal takeover</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">1 file (ProductSearch.tsx:243)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono font-bold text-rose-800">z-[70]</td>
                      <td className="p-2.5 font-mono font-bold text-rose-800">1</td>
                      <td className="p-2.5">Toast notification container mount inside AccountModal dialog</td>
                      <td className="p-2.5 font-mono text-[#8e8e8e]">1 file (AccountModal.tsx:390)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-base font-bold uppercase tracking-wide text-[#111111] mb-2">How to Use</h3>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Limit all standard layering to the 5 canonical tokens: z-10 (badges/cards), z-20 (overlays/controls), z-30 (toolbars), z-40 (secondary sticky chrome), z-50 (drawers/modals/toasts).
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: Avoid introducing arbitrary bracketed z-index values like z-[100] or z-[150]; use canonical z-50 for application drawers and modals.
              </div>
              <div className="border-l-4 border-veyro-black bg-veyro-surface p-3 text-xs sm:text-sm font-medium my-2">
                Rule: When mounting toasts within modal dialogs, use canonical toast stacking rather than ad-hoc z-[70].
              </div>
            </section>

            {/* SECTION 11 */}
            <section id="section-11" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 11 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">11. Page Templates</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                The structural blueprint and section ordering for all storefront pages.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Homepage (/)",
                    order: "Announcement Bar -> Navbar -> Hero -> PromoFlipBanner -> NewArrivalsSection -> BrandPillarsSection -> TshirtsSection -> FootwearSection -> Footer",
                  },
                  {
                    title: "Clothing Catalog (/clothing)",
                    order: "Archive Campaign Banner -> Sticky Sub-Bar Toolbar -> Desktop Filter Sidebar + Product Grid (4-col on lg, 2-col on mobile) -> Bundle Promotion Banner -> Measurement Modal",
                  },
                  {
                    title: "Shoes / Footwear Catalog (/shoes)",
                    order: "Sneaker Vault Hero Banner -> Sticky Sub-Bar Toolbar -> Footwear Filter Sidebar + 4-Column Product Grid -> Sneaker Promo Banner",
                  },
                  {
                    title: "Watches Catalog (/watches)",
                    order: "Horology Archive Hero Banner -> Sticky Sub-Bar Toolbar -> Horology Filter Sidebar + 4-Column Watch Grid -> Precision Specifications",
                  },
                  {
                    title: "Collections Showcase (/collections)",
                    order: "Interactive Fan Deck Showcase -> Curated Capsule Volumes Catalog Grid",
                  },
                  {
                    title: "Product Detail Page (/product/[slug])",
                    order: "Back Navigation -> 2-Column Split: ProductGallery (7 cols) + ProductBuyBox (5 cols) -> ProductReviewsSection -> 4 Dynamic Recommendation Carousels",
                  },
                  {
                    title: "Shopping Bag (/cart)",
                    order: "Breadcrumbs -> Split Grid (12 cols): Free Shipping Progress + Items List (8 cols) + Order Summary Card with Coupon (4 cols) -> Recommendations",
                  },
                  {
                    title: "Checkout Funnel (/checkout)",
                    order: "Security Header -> 3-Step Stepper: Shipping Address -> Delivery Method -> Payment Method (UPI QR / Card / COD) -> Sticky Order Review Ledger",
                  },
                  {
                    title: "Wishlist (/wishlist)",
                    order: "Breadcrumbs -> Header with Batch Move to Bag -> Saved Product Grid -> Empty State Handler",
                  },
                  {
                    title: "Orders Hub (/orders)",
                    order: "Breadcrumbs -> Live Search & Filter Chips (Processing, Shipped, Delivered) -> Order Card List with Live Status Bar -> Support Concierge",
                  },
                  {
                    title: "Order Details (/orders/[id])",
                    order: "Back Navigation -> Meta Strip -> Live 5-Stage Stepper -> Ordered Items -> Shipping & Payment Ledger -> Action Hub (Cancel / Return)",
                  },
                  {
                    title: "Account Page (/account)",
                    order: "Profile Banner -> Quick Access Cards (Orders, Addresses, Wishlist) -> Profile Editor -> Demo Sign-in Banner",
                  },
                  {
                    title: "Customer Care & FAQ (/faq)",
                    order: "Breadcrumbs -> Concierge Search -> Category Tabs -> Smooth-expanding Accordion Q&A Cards -> Contact Concierge Card",
                  },
                  {
                    title: "Member Login Modal (AccountModal)",
                    order: "2-Column Split Dialog: Left dark campaign photography with white Logo + Right OTP/phone authentication form",
                  },
                ].map((tmpl) => (
                  <div key={tmpl.title} className="p-4 rounded-lg border border-[#e8e8e5] bg-white">
                    <h4 className="font-bold text-xs uppercase tracking-wide text-[#111111] mb-2">{tmpl.title}</h4>
                    <p className="text-xs text-[#555555] leading-relaxed font-mono">{tmpl.order}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 12 */}
            <section id="section-12" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 12 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">12. Accessibility and Responsive Behaviour</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                Technical standards ensuring universal access across all devices and input methods.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg border border-[#e8e8e5] bg-[#f8f8f6]">
                  <h4 className="font-bold text-xs uppercase tracking-wide text-[#111111] mb-2">Colour Contrast Compliance</h4>
                  <ul className="text-xs text-[#555555] space-y-1.5">
                    <li>Primary text #111111 on #FFFFFF yields <strong>18.88:1</strong> (exceeds WCAG AAA 7:1).</li>
                    <li>Gold accent #FCD017 on #111111 yields <strong>12.74:1</strong> (AAA).</li>
                    <li>Gold accent #FCD017 on #FFFFFF yields <strong>1.48:1</strong> (FAILS WCAG AA; forbidden as text on white).</li>
                    <li>Secondary body gray uses #555555 (<strong>7.46:1</strong> AAA) or #666666 (<strong>5.74:1</strong> AA).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-[#e8e8e5] bg-[#f8f8f6]">
                  <h4 className="font-bold text-xs uppercase tracking-wide text-[#111111] mb-2">Keyboard &amp; ARIA Semantics</h4>
                  <ul className="text-xs text-[#555555] space-y-1.5">
                    <li><strong>Focus-Visible Audit:</strong> Only 16 buttons (5.1%) currently declare focus styling; 296 buttons (94.9%) rely on browser defaults. Focus outline remediation is a top priority.</li>
                    <li>Modals capture focus and close on <kbd className="font-mono bg-white px-1 border border-neutral-300 rounded">Escape</kbd>.</li>
                    <li>Toast notifications announce dynamically via <code className="font-mono">role=&quot;status&quot; aria-live=&quot;polite&quot;</code>.</li>
                    <li>Mandatory <code className="font-mono">aria-label</code> on all icon-only action buttons.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-[#e8e8e5] bg-white">
                <h4 className="font-bold text-xs uppercase tracking-wide text-[#111111] mb-2">Mobile Adaptive Patterns</h4>
                <ul className="text-xs text-[#555555] space-y-1.5">
                  <li><strong>Navigation:</strong> Desktop links collapse into slide-out menu drawer (z-[100]) with body scroll locking.</li>
                  <li><strong>Search:</strong> Desktop popover expands into a full-screen takeover modal (z-[150]) with native 100dvh height.</li>
                  <li><strong>Catalog Grids:</strong> 4 columns collapse to 2 columns on mobile (grid-cols-2); sidebar filters move to a slide-over drawer (z-50).</li>
                  <li><strong>Tap Targets:</strong> Action buttons provide minimum 42px height; icon buttons feature p-2 padding for 44x44px touch envelopes.</li>
                </ul>
              </div>
            </section>

            {/* SECTION 13 */}
            <section id="section-13" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 13 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">13. Do and Don&apos;t</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                Ten mandatory rules to follow and ten critical violations to avoid.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-700" />
                    10 Mandatory Do Rules
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-emerald-950 space-y-2">
                    <li><strong>Do</strong> use Container with default max-w-[1540px] on all storefront sections.</li>
                    <li><strong>Do</strong> set primary text to #111111 (text-veyro-black) on white surfaces for 18.88:1 AAA contrast.</li>
                    <li><strong>Do</strong> pair the gold accent #FCD017 with #111111 text, or use it as text only against dark backgrounds.</li>
                    <li><strong>Do</strong> use rounded-xl (12px) for card containers based on the storefront majority count (111 card instances).</li>
                    <li><strong>Do</strong> use rounded-lg (8px) for action buttons and rounded-full for icon/pill buttons across storefront forms.</li>
                    <li><strong>Do</strong> format technical codes, section tags ([ 001 ]), and coupon codes in font-mono.</li>
                    <li><strong>Do</strong> animate only transform and opacity to maintain 120fps GPU execution.</li>
                    <li><strong>Do</strong> provide clear alt descriptions on all Next.js Image components and aria-label on icon buttons.</li>
                    <li><strong>Do</strong> include motion-reduce:animate-none guards on every animation.</li>
                    <li><strong>Do</strong> format navigation links, badges, button CTAs, and section tags in uppercase with tracking-wider.</li>
                  </ol>
                </div>

                <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-rose-900 mb-3 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold">&times;</span>
                    10 Critical Don&apos;t Violations
                  </h4>
                  <ol className="list-decimal list-inside text-xs text-rose-950 space-y-2">
                    <li><strong>Don&apos;t</strong> use gold #FCD017 as text on white backgrounds (fails WCAG contrast at 1.48:1).</li>
                    <li><strong>Don&apos;t</strong> claim ui/Button.tsx defines canonical button rules while using raw &lt;button&gt; tags inline across the storefront.</li>
                    <li><strong>Don&apos;t</strong> invent external font families (do not use Archivo or Inter in storefront code).</li>
                    <li><strong>Don&apos;t</strong> hardcode random pixel values for containers; use the canonical max-w-[1540px].</li>
                    <li><strong>Don&apos;t</strong> animate top, left, width, height, or margin for transitions.</li>
                    <li><strong>Don&apos;t</strong> write the brand name as &quot;Veyro&quot; or &quot;veyro&quot;; always write VEYRO.</li>
                    <li><strong>Don&apos;t</strong> create new z-index values arbitrarily; adhere to the canonical scale.</li>
                    <li><strong>Don&apos;t</strong> omit quality=80 or responsive sizes on Next.js images.</li>
                    <li><strong>Don&apos;t</strong> use #999999 for body copy on white surfaces.</li>
                    <li><strong>Don&apos;t</strong> use hype-driven marketing fluff or hyperbolic discount slogans in brand copy.</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* SECTION 14 */}
            <section id="section-14" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 14 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">14. Known Inconsistencies</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-4">
                A factual audit of existing stylistic variations on branch main and the canonical rule that new work should follow.
              </p>

              {/* Counting Method Note */}
              <div className="p-4 rounded-lg border border-[#e8e8e5] bg-[#f8f8f6] mb-6">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#111111] mb-1.5">How Counts Were Measured</h3>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Counts were measured across exactly 178 storefront source files in <code className="font-mono">veyro/src/</code> (excluding <code className="font-mono">src/app/admin/**</code>, <code className="font-mono">src/components/admin/**</code>, and documentation <code className="font-mono">design-guidelines</code>). Parsing used AST extraction and regex token analysis across TSX/TS/CSS source text, including className strings, inline styles (<code className="font-mono">style=&#123;&#123; ... &#125;&#125;</code>), and CSS declarations.
                  <br /><br />
                  <strong>Color count note:</strong> Storefront-only source files contain 559 literal occurrences of <code className="font-mono">#111111</code> and 170 literal occurrences of <code className="font-mono">#fcd017</code>; broader totals of 583 and 205 reported in earlier audits included <code className="font-mono">src/app/admin/**</code> files and <code className="font-mono">public/</code> vector assets.
                </p>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-[#e8e8e5]">
                  <thead className="bg-[#f8f8f6] border-b border-[#e8e8e5] font-mono uppercase text-[#111111]">
                    <tr>
                      <th className="p-2.5">Inconsistency Area</th>
                      <th className="p-2.5">Existing Variations in Code</th>
                      <th className="p-2.5">Occurrences</th>
                      <th className="p-2.5">Canonical Rule for New Work</th>
                      <th className="p-2.5">Remediation Effort</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e8e5]">
                    <tr>
                      <td className="p-2.5 font-bold">Colour Literals vs Tokens</td>
                      <td className="p-2.5 text-[#555555]">Hardcoded #111111 used instead of veyro-black (559); hardcoded #fcd017 instead of veyro-yellow (170)</td>
                      <td className="p-2.5 font-mono">729 across 41 files</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Use @theme tokens text-veyro-black, bg-veyro-black, bg-veyro-yellow</td>
                      <td className="p-2.5 font-mono text-neutral-600">Low</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Card Corner Radius</td>
                      <td className="p-2.5 text-[#555555]">rounded-xl (12px) with 111 card occurrences vs rounded-2xl (16px) with 74 card occurrences</td>
                      <td className="p-2.5 font-mono">111 vs 74 on cards (113 vs 76 total)</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Standard card containers must use canonical rounded-xl (12px)</td>
                      <td className="p-2.5 font-mono text-neutral-600">Low</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Button Radius &amp; Adoption</td>
                      <td className="p-2.5 text-[#555555]">ui/Button.tsx (rounded-[2px]) imported in 6 files but rendered 0 times. Raw &lt;button&gt; tags (312): no_explicit_radius (218), rounded-lg (40 with links), rounded-full (33 with links), rounded (21), rounded-xl (16), rounded-[2px] (0)</td>
                      <td className="p-2.5 font-mono">312 raw &lt;button&gt; tags across 45 files</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Standardize action buttons on rounded-lg (8px) and icon/pill buttons on rounded-full</td>
                      <td className="p-2.5 font-mono text-neutral-600">High</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Primary Button Styles</td>
                      <td className="p-2.5 text-[#555555]">8 distinct inline primary button combinations: bg-black + rounded-lg (7), bg-[#111111] + rounded-[2px] (7), bg-[#111111] + rounded-lg (4), bg-[#111111] + rounded-full (4), bg-neutral-900 + rounded-xl (2), bg-black + rounded-xl (2), others (2)</td>
                      <td className="p-2.5 font-mono">28 primary action buttons across 14 screens</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Unify primary CTA buttons on bg-veyro-black text-white rounded-lg px-6 py-3 font-semibold</td>
                      <td className="p-2.5 font-mono text-neutral-600">Medium</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Button Focus Coverage</td>
                      <td className="p-2.5 text-[#555555]">Buttons with explicit focus styling (focus-visible: or focus:): 16 (5.1%). Buttons lacking focus styling: 296 (94.9%)</td>
                      <td className="p-2.5 font-mono">16 with focus vs 296 without</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Add mandatory focus-visible:ring-2 focus-visible:ring-veyro-black focus-visible:ring-offset-2</td>
                      <td className="p-2.5 font-mono text-neutral-600">Medium</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Font Families &amp; Roles</td>
                      <td className="p-2.5 text-[#555555]">5 families loaded in layout.tsx: Geist Sans (default across all 178 files; 23 explicit font-sans), Geist Mono (font-mono, 157), Dancing Script (.font-script, 19), Montserrat (.font-luxury, 19 in 5 files), Outfit (--font-outfit, 23 in 5 files)</td>
                      <td className="p-2.5 font-mono">5 families across 178 files</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Default to Geist Sans for general UI; Geist Mono for SKUs/metadata; reserve Dancing Script and Montserrat for editorial accents</td>
                      <td className="p-2.5 font-mono text-neutral-600">Low</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Arbitrary Text Sizes (text-[Npx])</td>
                      <td className="p-2.5 text-[#555555]">42 distinct arbitrary text sizes across 799 usages. Top 3: text-[11px] (312), text-[10px] (178), text-[13px] (54) (plus text-[14px]: 45, text-[9px]: 37)</td>
                      <td className="p-2.5 font-mono">42 distinct sizes, 799 occurrences</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Consolidate onto standard Tailwind scale (text-xs 12px, text-sm 14px) or @theme micro-tokens (text-label-small: 11px)</td>
                      <td className="p-2.5 font-mono text-neutral-600">Medium</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Grey Families &amp; Hexes</td>
                      <td className="p-2.5 text-[#555555]">Tailwind neutral (2,103 occurrences) dominates, with minor zinc (8) and slate (5). Hardcoded greys: #111111 (559), #666666 (40), #888888 (37), #E8E8E5 (27), #555555 (23), #999999 (20), #8E8E8E (20), #333333 (19)</td>
                      <td className="p-2.5 font-mono">2,116 Tailwind tokens; 745 hex literals</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Use Tailwind neutral for general neutrals; use @theme tokens (veyro-border, veyro-muted, veyro-subtle) for brand borders/meta</td>
                      <td className="p-2.5 font-mono text-neutral-600">Medium</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Shadow Fragmentation</td>
                      <td className="p-2.5 text-[#555555]">49 distinct shadow definitions (10 standard utilities + 39 custom bracketed shadow-[...] definitions). Standard: shadow-xs (118), shadow-sm (75), shadow-md (55), shadow-2xs (47), shadow (39), shadow-lg (21), shadow-2xl (19)</td>
                      <td className="p-2.5 font-mono">49 distinct values, 421 occurrences</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Restrict shadow usage to canonical scale: shadow-xs for cards/pills, shadow-md for hover states, shadow-2xl for modals</td>
                      <td className="p-2.5 font-mono text-neutral-600">Low</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Container Max Widths</td>
                      <td className="p-2.5 text-[#555555]">Canonical max-w-[1540px] (Container.tsx) vs max-w-7xl (1280px, 2 files), max-w-[1300px] (3 promo banners), max-w-[1536px] (2 catalog sub-bars), max-w-2xl (13 editorial texts), max-w-md (19 dialogs)</td>
                      <td className="p-2.5 font-mono">8 variations across 39 files</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Standard storefront page sections use &lt;Container&gt; with default max-w-[1540px]</td>
                      <td className="p-2.5 font-mono text-neutral-600">Low</td>
                    </tr>
                                        <tr>
                      <td className="p-2.5 font-bold">Page Background Tints</td>
                      <td className="p-2.5 text-[#555555]">Canonical canvas is bg-white (#FFFFFF, 6 screens), but 7 utility screens use bg-neutral-50/#FAFAFA, 1 screen uses bg-[#fbfbf9], and 1 dialog uses bg-[#0c0c0e] (4 distinct tints total)</td>
                      <td className="p-2.5 font-mono">4 distinct background tints across 15 screens</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Standardize standard pages on canonical bg-white; keep bg-neutral-50 consistently for utility workflows</td>
                      <td className="p-2.5 font-mono text-neutral-600">Low</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">FAQ Navy Text Color</td>
                      <td className="p-2.5 text-[#555555]">FAQ page uses isolated Deep Navy text (#101828) and slate neutrals (#344054, #475467, #667085), diverging from universal #111111</td>
                      <td className="p-2.5 font-mono">15 occurrences in app/faq/page.tsx</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Align FAQ headings and body with canonical #111111 (text-veyro-black) and #555555</td>
                      <td className="p-2.5 font-mono text-neutral-600">Low</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">Transitions &amp; Motion Libs</td>
                      <td className="p-2.5 text-[#555555]">223 occurrences of transition-all. Duration values: duration-200 (131), duration-300 (113), duration-150 (41), duration-500 (21), duration-700 (19). Two animation libraries: motion/react in 35 files vs framer-motion in 7 files</td>
                      <td className="p-2.5 font-mono">223 transition-all; 325 durations; 2 libraries</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Use specific transitions (transition-transform, transition-opacity, transition-colors); standardize on duration-200/duration-300; consolidate on motion/react</td>
                      <td className="p-2.5 font-mono text-neutral-600">Medium</td>
                    </tr>
                                        <tr>
                      <td className="p-2.5 font-bold">Z-Index Layering Scale</td>
                      <td className="p-2.5 text-[#555555]">5 canonical values (z-10, z-20, z-30, z-40, z-50) alongside 5 non-standard / one-off values: z-1 (9 scrims), z-0 (8 lines/tracks), z-[70] (1 in AccountModal.tsx), z-[100] (2 in Navbar.tsx &amp; section/[slug]), z-[150] (1 in ProductSearch.tsx)</td>
                      <td className="p-2.5 font-mono">185 total z-index occurrences across 10 distinct values</td>
                      <td className="p-2.5 text-emerald-800 font-medium">Restrict layering to the 5 canonical tokens (z-10 to z-50); eliminate arbitrary one-offs (z-[70], z-[100], z-[150])</td>
                      <td className="p-2.5 font-mono text-neutral-600">Low</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* SECTION 15 */}
            <section id="section-15" className="scroll-mt-28">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-semibold text-[#999999] uppercase tracking-widest">[ 15 ]</span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#111111]">15. Maintenance</h2>
              </div>
              <p className="text-sm text-[#555555] leading-relaxed mb-6">
                Protocols for updating, maintaining, and verifying the VEYRO design guidelines.
              </p>

              <div className="p-5 rounded-lg border border-[#e8e8e5] bg-[#f8f8f6] mb-6">
                <h4 className="font-bold text-xs uppercase tracking-wide text-[#111111] mb-2">Update Protocols</h4>
                <ol className="list-decimal list-inside text-xs text-[#555555] space-y-1.5">
                  <li><strong>Inspect Before Changing:</strong> Scan the storefront code first using ripgrep or ast-grep to verify whether a proposed value already exists.</li>
                  <li><strong>Verify Against Tokens:</strong> When adding a color, declare it in <code className="font-mono">src/app/globals.css</code> @theme block before utilizing it in markup.</li>
                  <li><strong>Calculate WCAG Contrast:</strong> For every new color combination, calculate relative luminance and contrast ratio against #FFFFFF and #111111 using the WCAG 2.1 formula.</li>
                  <li><strong>Enforce Motion Discipline:</strong> Any new animated element must animate only transform and opacity and include prefers-reduced-motion overrides.</li>
                  <li><strong>Dual Documentation Sync:</strong> Whenever modifying DESIGN_GUIDELINES.md, update the read-only page <code className="font-mono">src/app/design-guidelines/page.tsx</code> simultaneously.</li>
                </ol>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#8e8e8e] pt-4 border-t border-[#e8e8e5]">
                <span>CUSTODIAN: VEYRO DESIGN SYSTEM TEAM</span>
                <span>VERSION 1.0 &bull; EFFECTIVE: 2026-10-24</span>
              </div>
            </section>
          </main>
        </div>
      </Container>
    </div>
  );
}
