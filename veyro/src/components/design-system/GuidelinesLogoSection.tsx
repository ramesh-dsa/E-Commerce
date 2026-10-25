import React from "react";
import { Logo, VeyroMark } from "@/components/ui/Logo";
import { Check, X, Maximize2, ShieldAlert } from "lucide-react";

export function GuidelinesLogoSection() {
  return (
    <section id="section-2" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 02 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            VISUAL IDENTITY
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          2. Logo &amp; Clear Space Architecture
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          The VEYRO visual mark is defined in <code className="font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-xs text-neutral-900">@/components/ui/Logo.tsx</code> as two vector primitives: the full geometric wordmark (<code className="font-mono">Logo</code>) and the standalone architectural icon glyph (<code className="font-mono">VeyroMark</code>).
        </p>
      </div>

      {/* ── Dual Contrast Specimen Stages ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dark Stage */}
        <div className="rounded-3xl bg-neutral-950 border border-neutral-800 p-8 sm:p-12 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-2xs pb-6">
            <span className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-white font-bold uppercase tracking-widest">
              PRIMARY DARK STAGE
            </span>
            <span>variant=&quot;white&quot;</span>
          </div>

          <div className="py-12 flex items-center justify-center">
            <Logo variant="white" height={40} className="hover:scale-105 transition-transform" />
          </div>

          <div className="pt-6 border-t border-neutral-800 flex items-center justify-between text-2xs font-mono text-neutral-400">
            <span>Canvas: #050505 / #111111</span>
            <span>Contrast: 18.88:1 AAA</span>
          </div>
        </div>

        {/* Light Stage */}
        <div className="rounded-3xl bg-neutral-50 border border-neutral-200 p-8 sm:p-12 flex flex-col justify-between shadow-2xs relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-500 font-mono text-2xs pb-6">
            <span className="px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-900 font-bold uppercase tracking-widest">
              CANONICAL LIGHT STAGE
            </span>
            <span>variant=&quot;black&quot;</span>
          </div>

          <div className="py-12 flex items-center justify-center">
            <Logo variant="black" height={40} className="hover:scale-105 transition-transform" />
          </div>

          <div className="pt-6 border-t border-neutral-200 flex items-center justify-between text-2xs font-mono text-neutral-500">
            <span>Canvas: #FFFFFF</span>
            <span>Contrast: 18.88:1 AAA</span>
          </div>
        </div>
      </div>

      {/* ── Clear Space Blueprint ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <Maximize2 size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              Clear Space Exclusion Zone (Blueprint)
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-500">
            Radius: X = 24px (100% Glyph Width)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Blueprint SVG Diagram */}
          <div className="lg:col-span-5 bg-neutral-950 rounded-2xl p-8 border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Architectural Grid Background */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #000000 1px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
              }}
            />

            {/* Clear Space Bounding Box */}
            <div className="relative p-8 border border-dashed border-veyro-yellow/60 rounded-xl flex items-center justify-center">
              {/* Corner Indicators */}
              <span className="absolute -top-3 -left-3 font-mono text-3xs text-veyro-yellow bg-neutral-900 px-1 py-0.5 rounded border border-neutral-800">
                X
              </span>
              <span className="absolute -top-3 -right-3 font-mono text-3xs text-veyro-yellow bg-neutral-900 px-1 py-0.5 rounded border border-neutral-800">
                X
              </span>
              <span className="absolute -bottom-3 -left-3 font-mono text-3xs text-veyro-yellow bg-neutral-900 px-1 py-0.5 rounded border border-neutral-800">
                X
              </span>
              <span className="absolute -bottom-3 -right-3 font-mono text-3xs text-veyro-yellow bg-neutral-900 px-1 py-0.5 rounded border border-neutral-800">
                X
              </span>

              {/* Centered Glyph */}
              <div className="w-16 h-16 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-veyro-yellow shadow-inner">
                <VeyroMark className="w-10 h-10" />
              </div>
            </div>

            <span className="mt-4 font-mono text-2xs text-neutral-400">
              SAFE ZONE: [ 24px PADDING ]
            </span>
          </div>

          {/* Blueprint Spec Copy */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-base font-bold uppercase tracking-tight text-neutral-950">
              The Exclusion Zone Law
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              To preserve the brutalist authority and legibility of the VEYRO mark, a minimum exclusion zone of <strong className="text-neutral-900">X = 24px</strong> (or equivalent to the glyph&apos;s base width) must always be maintained.
            </p>
            <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside">
              <li>No typography, promotional ribbons, or price tags may enter exclusion zone X.</li>
              <li>Dividers, modal boundaries, and card edges must stay outside the bounding box.</li>
              <li>When used on photographic campaign imagery, place only over low-noise gradient surfaces.</li>
            </ul>

            {/* Minimum Scale Specs */}
            <div className="pt-2 grid grid-cols-2 gap-3 font-mono text-2xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Digital Screen Min
                </span>
                <span className="text-sm font-bold text-neutral-900">26px Height</span>
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="block text-neutral-400 uppercase tracking-wider mb-1">
                  Physical Garment Min
                </span>
                <span className="text-sm font-bold text-neutral-900">12mm Height</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DOs vs AVOIDs Visual Grid ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
          Logo Usage Governance
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase font-mono text-2xs">
              <Check size={14} className="text-emerald-600" />
              <span>DO: Canonical Vector</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Always render the official <code className="font-mono text-neutral-900 font-semibold">&lt;Logo&gt;</code> component with native aspect ratio (<code className="font-mono">w-auto shrink-0</code>).
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold uppercase font-mono text-2xs">
              <Check size={14} className="text-emerald-600" />
              <span>DO: High Contrast</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Use <code className="font-mono text-neutral-900 font-semibold">variant=&quot;white&quot;</code> over deep black (#111111, #050505) and <code className="font-mono text-neutral-900 font-semibold">variant=&quot;black&quot;</code> over pure white (#FFFFFF).
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold uppercase font-mono text-2xs">
              <X size={14} className="text-rose-600" />
              <span>AVOID: Font Re-creation</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Never re-type the wordmark using system fonts or custom text tracking. It must strictly render the vector bezier path.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-5 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold uppercase font-mono text-2xs">
              <X size={14} className="text-rose-600" />
              <span>AVOID: Drop Shadows</span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              Never apply heavy box-shadows, blur filters, outer glow, or colored gradient fills to the brand vector glyphs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
