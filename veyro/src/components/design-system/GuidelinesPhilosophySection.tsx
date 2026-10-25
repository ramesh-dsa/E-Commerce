import React from "react";
import { Sparkles, Factory, Scale, Check, X, Shield, ArrowUpRight } from "lucide-react";

export function GuidelinesPhilosophySection() {
  return (
    <section id="section-1" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 01 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            SYSTEM FOUNDATION
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          1. Brand Philosophy &amp; Artisanal Roots
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          VEYRO is an architectural streetwear and precision horology house founded in India. Engineered around 240+ GSM long-staple Indian combed cotton, vulcanized retro footwear, and brutalist minimalism.
        </p>
      </div>

      {/* ── Editorial Hero Quote Card ── */}
      <div className="relative rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 border border-neutral-800 shadow-xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-veyro-yellow/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-veyro-yellow font-mono text-2xs font-bold uppercase tracking-widest">
              <Sparkles size={11} />
              <span>THE ARCHIVE MANIFESTO</span>
            </span>
            <span className="font-mono text-2xs text-neutral-400 uppercase tracking-wider">
              EST. TIRUPUR, INDIA
            </span>
          </div>

          <blockquote className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-tight text-neutral-100 leading-snug max-w-3xl">
            &ldquo;Built for the archive. We reject seasonal churn. Every garment is engineered with obsessive discipline to fabric weight, structural drape, and quiet luxury.&rdquo;
          </blockquote>

          <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-2xs text-neutral-400 border-t border-neutral-800">
            <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
              240+ GSM HEAVYWEIGHT
            </span>
            <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
              100% COMBED COTTON
            </span>
            <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-300">
              ZERO MIDDLEMEN PRICING
            </span>
          </div>
        </div>
      </div>

      {/* ── The 3 Core Value Pillars ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
            The Three Value Pillars
          </h3>
          <span className="font-mono text-2xs text-neutral-500">
            Source: BrandPillarsSection.tsx
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 01 */}
          <div className="p-6 rounded-2xl bg-neutral-50/70 hover:bg-white border border-neutral-200 transition-colors shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-veyro-yellow flex items-center justify-center font-mono text-xs font-bold">
              01
            </div>
            <h4 className="font-bold text-sm uppercase tracking-wide text-neutral-950">
              240+ GSM Heavyweight
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              100% long-staple Indian combed cotton. Architectural boxy drape that retains its structural silhouette wash after wash. Anti-sag rib collars.
            </p>
            <div className="pt-2 text-2xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">
              Weight Index: 240–280 GSM
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="p-6 rounded-2xl bg-neutral-50/70 hover:bg-white border border-neutral-200 transition-colors shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-veyro-yellow flex items-center justify-center font-mono text-xs font-bold">
              02
            </div>
            <h4 className="font-bold text-sm uppercase tracking-wide text-neutral-950">
              Crafted in Tirupur
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Direct master-craft partnerships with India&apos;s knitwear capital. Dual-needle precision stitching, reactive garment dyes, and vulcanized soles.
            </p>
            <div className="pt-2 text-2xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">
              Mill Origin: Tamil Nadu, IN
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="p-6 rounded-2xl bg-neutral-50/70 hover:bg-white border border-neutral-200 transition-colors shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-veyro-yellow flex items-center justify-center font-mono text-xs font-bold">
              03
            </div>
            <h4 className="font-bold text-sm uppercase tracking-wide text-neutral-950">
              Zero Middlemen
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Direct-from-mill pricing model. We bypass traditional retail distribution markups to offer luxury-grade architectural streetwear at honest prices.
            </p>
            <div className="pt-2 text-2xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">
              Margin Structure: Transparent D2C
            </div>
          </div>
        </div>
      </div>

      {/* ── 4-Quadrant Brand Personality ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
          Brand Personality Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Architectural",
              tag: "Form",
              desc: "Rigid boxy drape, drop-shoulder geometry, zero cling, substantial silhouette.",
            },
            {
              title: "Brutalist",
              tag: "Aesthetics",
              desc: "Monochromatic ink & canvas contrast, razor-sharp lines, monospace technical indices.",
            },
            {
              title: "Artisanal",
              tag: "Craft",
              desc: "Tirupur combed yarns, vulcanized Italian rubber foxing, 316L stainless horology.",
            },
            {
              title: "Understated",
              tag: "Voice",
              desc: "Quiet luxury, minimalist restraint, no gaudy branding, zero marketing hype.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-2xs space-y-2 hover:border-neutral-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-neutral-950">
                  {item.title}
                </span>
                <span className="font-mono text-2xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Declarative Voice & Tone Rules ── */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-neutral-900" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
            Voice &amp; Copy Standards
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-white border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase font-mono text-2xs tracking-wider">
              <Check size={14} className="text-emerald-600" />
              <span>DO: Declarative &amp; Technical</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              State fabric specifications, cotton weights, mill origins, and hardware engineering directly. Let the physical garment speak for itself.
            </p>
            <div className="font-mono text-2xs text-neutral-500 bg-neutral-100 p-2 rounded">
              Example: &ldquo;240 GSM Indian Combed Cotton • Zero-sag Ribbed Collar • Boxy Fit&rdquo;
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-rose-200/80 space-y-2">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold uppercase font-mono text-2xs tracking-wider">
              <X size={14} className="text-rose-600" />
              <span>AVOID: Hype &amp; Fluff</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Never use hype-driven consumer marketing fluff, artificial urgency (&quot;Hurry! Only 2 seconds left!&quot;), or hyperbolic buzzwords.
            </p>
            <div className="font-mono text-2xs text-neutral-500 bg-neutral-100 p-2 rounded line-through">
              Banned: &ldquo;Insane Mega Drops! Crazy Discounts! Best T-Shirt Ever Made!&rdquo;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
