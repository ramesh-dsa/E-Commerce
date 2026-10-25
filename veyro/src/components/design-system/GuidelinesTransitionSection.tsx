import React from "react";
import { ArrowRightLeft, Search, Palette, CheckCircle2, GitCommit, AlertTriangle } from "lucide-react";

export function GuidelinesTransitionSection() {
  const STAGES = [
    {
      stage: "Stage 01",
      title: "Scoped Reconnaissance",
      subtitle: "Inspect Before Building",
      icon: Search,
      desc: "Before writing or modifying any storefront code, search the codebase using ripgrep or ast-grep to verify whether a proposed token, radius, or component pattern already exists. Never introduce ad-hoc values based on assumption.",
      command: "rg \"#111111\" src/ --type tsx",
    },
    {
      stage: "Stage 02",
      title: "Token Alignment",
      subtitle: "@theme Contract Enforcement",
      icon: Palette,
      desc: "Every color, container width, and typography size must resolve to a declared @theme utility in src/app/globals.css. Arbitrary Tailwind bracket notation (e.g. rounded-[...px], text-[...px], max-w-[...px]) is strictly rejected in PR code review.",
      command: "bg-veyro-black • text-2xs • max-w-screen-2xl",
    },
    {
      stage: "Stage 03",
      title: "Accessibility Verification",
      subtitle: "Dual A11y Quality Gate",
      icon: CheckCircle2,
      desc: "Calculate WCAG 2.1 contrast ratios against #FFFFFF (minimum 4.5:1) and #111111. Verify high-visibility keyboard focus rings (focus-visible:ring-2), screen reader status announcements (aria-live), and 44x44px touch targets.",
      command: "18.88:1 AAA on White • 44px Tap Target",
    },
    {
      stage: "Stage 04",
      title: "Living Contract Commit",
      subtitle: "Dual Repository Sync",
      icon: GitCommit,
      desc: "Any new design token, layout recipe, or component contract must be committed simultaneously to DESIGN.md in the repository root and verified on /design-guidelines before merging into branch main.",
      command: "git add DESIGN.md src/components/design-system/",
    },
  ];

  return (
    <section id="section-12" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 12 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            GOVERNANCE PROTOCOL
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          12. Transition Guidance &amp; Protocols
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          Step-by-step migration pathways for standardizing legacy storefront patterns into the canonical VEYRO design system. Every pull request must satisfy these four verification gates before merging into branch <code className="font-mono bg-neutral-100 text-neutral-900 px-1.5 py-0.5 rounded text-xs font-semibold">main</code>.
        </p>
      </div>

      {/* ── 4-Stage Feature Transition Stepper ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
            The 4-Stage PR Verification Pipeline
          </h3>
          <span className="font-mono text-2xs text-neutral-500">
            Linear Migration Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {STAGES.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.stage}
                className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4 flex flex-col justify-between hover:border-neutral-400 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-900 text-white uppercase tracking-widest">
                      {s.stage}
                    </span>
                    <span className="font-mono text-3xs text-neutral-500 font-semibold">
                      {s.subtitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Icon size={18} className="text-neutral-950 shrink-0" />
                    <h4 className="font-bold text-sm uppercase tracking-tight text-neutral-950">
                      {s.title}
                    </h4>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="font-mono text-3xs text-neutral-700 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 flex items-center justify-between">
                    <span>Protocol Rule:</span>
                    <span className="font-bold text-neutral-900">{s.command}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Deprecation Roadmap Banner ── */}
      <div className="rounded-3xl border border-amber-300 bg-amber-50/60 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-amber-900">
          <AlertTriangle size={18} className="text-amber-700 shrink-0" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest">
            Active Deprecation Notice (Legacy Anti-Patterns)
          </h4>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed max-w-3xl">
          The following legacy patterns are officially deprecated and blocked by build linter gates:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 font-mono text-2xs">
          <div className="p-3 rounded-xl bg-white/80 border border-amber-200">
            <span className="block text-rose-700 font-bold line-through">transition-all</span>
            <span className="text-neutral-600 text-3xs block mt-0.5">Use targeted transition-transform or transition-colors</span>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-amber-200">
            <span className="block text-rose-700 font-bold line-through">z-[70], z-[100], z-[150]</span>
            <span className="text-neutral-600 text-3xs block mt-0.5">Adhere strictly to canonical z-0 → z-50 ladder</span>
          </div>
          <div className="p-3 rounded-xl bg-white/80 border border-amber-200">
            <span className="block text-rose-700 font-bold line-through">max-w-[1536px], rounded-[24px]</span>
            <span className="text-neutral-600 text-3xs block mt-0.5">Use max-w-screen-2xl and rounded-3xl standard tokens</span>
          </div>
        </div>
      </div>
    </section>
  );
}
