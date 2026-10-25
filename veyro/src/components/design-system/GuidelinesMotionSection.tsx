import React from "react";
import { Activity, Zap, ShieldAlert, Cpu, EyeOff } from "lucide-react";

export function GuidelinesMotionSection() {
  const MOTION_LANES = [
    {
      lane: "Lane 1: Fast",
      duration: "150ms",
      easing: "ease-out",
      tailwind: "duration-150 ease-out",
      use: "Micro-interactions, button active press states, checkbox toggles, tag hover color shifts.",
      sample: "transition-colors duration-150 ease-out",
    },
    {
      lane: "Lane 2: Base",
      duration: "200ms – 300ms",
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      tailwind: "duration-200 / duration-300",
      use: "Primary interface choreography: catalog product card hover lifts, drawer slide-overs, accordion disclosure.",
      sample: "transition-transform duration-300 ease-out hover:-translate-y-1.5",
    },
    {
      lane: "Lane 3: Slow",
      duration: "500ms – 700ms",
      easing: "ease-in-out",
      tailwind: "duration-500 / duration-700",
      use: "Atmospheric full-bleed movement: hero sliding panels, continuous marquee tickers, 3D flip banners.",
      sample: "transition-transform duration-700 ease-in-out",
    },
  ];

  return (
    <section id="section-7" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 07 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            PHYSICS &amp; EASING
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          7. Motion, Easing &amp; Physics
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          VEYRO motion is engineered around strict GPU compositing. Continuous animations interpolate exclusively along <code className="font-mono bg-neutral-100 text-neutral-900 px-1 py-0.5 rounded text-xs">transform</code> and <code className="font-mono bg-neutral-100 text-neutral-900 px-1 py-0.5 rounded text-xs">opacity</code>. The catch-all performance anti-pattern <code className="font-mono text-rose-700 bg-rose-50 px-1 py-0.5 rounded text-xs">transition-all</code> is prohibited.
        </p>
      </div>

      {/* ── The 3 Physics Motion Lanes ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-900">
            The Three Physics Motion Lanes
          </h3>
          <span className="font-mono text-2xs text-neutral-500">
            Standard Duration Scales
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOTION_LANES.map((m) => (
            <div
              key={m.lane}
              className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-neutral-950">
                    {m.lane}
                  </span>
                  <span className="font-mono text-2xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-900 font-bold">
                    {m.duration}
                  </span>
                </div>
                <div className="font-mono text-3xs text-neutral-500">
                  Curve: {m.easing}
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                  {m.use}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <span className="font-mono text-3xs text-neutral-400 block mb-1">
                  Tailwind Recipe:
                </span>
                <code className="font-mono text-2xs bg-neutral-50 p-2 rounded block border border-neutral-200 text-neutral-800 break-all">
                  {m.sample}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GPU-Only Animation Law ── */}
      <div className="rounded-3xl border border-neutral-200 bg-neutral-950 text-white p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-4">
          <Cpu size={18} className="text-veyro-yellow" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
            GPU Acceleration Law (Zero Layout Thrashing)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Allowed */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xs font-bold uppercase tracking-wider text-emerald-400">
                ✓ ALLOWED: 60FPS HARDWARE COMPOSITING
              </span>
              <span className="font-mono text-3xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                GPU SAFE
              </span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              These properties run directly on the GPU compositor thread without triggering layout recomputation (reflow) or pixel repaints:
            </p>
            <div className="font-mono text-2xs space-y-1 text-emerald-300 bg-black/40 p-3 rounded-lg border border-neutral-800">
              <div>• transform: translate3d(), scale(), rotate()</div>
              <div>• opacity: 0 → 1</div>
              <div>• filter: blur() (used sparingly on scrims)</div>
            </div>
          </div>

          {/* Banned */}
          <div className="p-5 rounded-2xl bg-neutral-900 border border-rose-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-2xs font-bold uppercase tracking-wider text-rose-400">
                ✕ BANNED: EXPENSIVE REFLOW PROPERTIES
              </span>
              <span className="font-mono text-3xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                LAYOUT THRASHING
              </span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Never animate box-model dimensions or use broad wildcard transitions on interactive elements:
            </p>
            <div className="font-mono text-2xs space-y-1 text-rose-300 bg-black/40 p-3 rounded-lg border border-neutral-800 line-through">
              <div>• transition-all (animates all 200+ properties)</div>
              <div>• top, left, bottom, right (use translate instead)</div>
              <div>• width, height, margin, padding</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Accessibility & Reduced Motion ── */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-3">
        <div className="flex items-center gap-2">
          <EyeOff size={16} className="text-neutral-900" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
            Prefers-Reduced-Motion Accessibility Contract
          </h4>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          For users who have enabled vestibular motion reduction in their operating system, all continuous marquee rotations, 3D flip card loops, and heavy transforms must be disabled immediately using Tailwind&apos;s <code className="font-mono text-neutral-900 font-bold bg-neutral-100 px-1 py-0.5 rounded">motion-reduce:animate-none</code> and <code className="font-mono text-neutral-900 font-bold bg-neutral-100 px-1 py-0.5 rounded">motion-reduce:transition-none</code>.
        </p>
      </div>
    </section>
  );
}
