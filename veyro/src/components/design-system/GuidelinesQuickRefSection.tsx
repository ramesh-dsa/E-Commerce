import React from "react";
import { ShieldCheck, Check, X } from "lucide-react";

export function GuidelinesQuickRefSection() {
  const MATRIX_ROWS = [
    {
      index: "01",
      dimension: "Primary Text on White Canvas",
      doText: "Use text-veyro-black (#111111) for guaranteed 18.88:1 AAA contrast ratio.",
      avoidText: "Never use #999999 or #888888 for body prose or essential product descriptions.",
      evidence: "559 literal occurrences unified to token",
    },
    {
      index: "02",
      dimension: "Volt Gold Accent (#FCD017)",
      doText: "Pair with black text (bg-veyro-yellow text-veyro-black) or against dark stages (#111111) for 12.74:1 AAA.",
      avoidText: "Never use gold as text on pure white surfaces (contrast 1.48:1 fails WCAG AA).",
      evidence: "170 occurrences unified to @theme token",
    },
    {
      index: "03",
      dimension: "Container Max-Widths",
      doText: "Use <Container> or canonical 5-tier scales (max-w-screen-2xl, max-w-7xl, max-w-3xl, max-w-md, max-w-xs).",
      avoidText: "Never declare arbitrary bracket widths like max-w-[1536px] or max-w-[1540px].",
      evidence: "47 ad-hoc bracket instances migrated",
    },
    {
      index: "04",
      dimension: "Card Border Radii",
      doText: "Standardize catalog cards, drawer modules, and content containers strictly on rounded-xl (12px / 0.75rem).",
      avoidText: "Do not mix arbitrary rounded-[24px] or rounded-[10px] bracket notations.",
      evidence: "111 storefront cards unified to rounded-xl",
    },
    {
      index: "05",
      dimension: "Action Buttons",
      doText: "Standardize structured action triggers on rounded-lg (8px) and icon/pills on rounded-full (9999px).",
      avoidText: "Do not import dead components like ui/Button.tsx (rounded-[2px]) or write unstyled buttons.",
      evidence: "312 raw button instances audited and aligned",
    },
    {
      index: "06",
      dimension: "Micro-Typography Labels",
      doText: "Use canonical token text-2xs (0.625rem / 10px) with font-mono uppercase tracking-widest for tags ([ 01 ]).",
      avoidText: "Never use arbitrary bracket notations like text-[10px] or text-[9px].",
      evidence: "178 occurrences migrated to text-2xs",
    },
    {
      index: "07",
      dimension: "Transitions & Motion",
      doText: "Animate exclusively transform and opacity via targeted lanes (transition-transform, transition-colors).",
      avoidText: "Never use transition-all or animate box dimensions (top, left, width, height, margin, padding).",
      evidence: "221 transition-all instances eliminated",
    },
    {
      index: "08",
      dimension: "Brand Wordmark",
      doText: "Render vector component <Logo variant=\"black|white\" />. Always spell in full capitals as VEYRO.",
      avoidText: "Never recreate wordmark using system fonts; never write \"Veyro\" or \"veyro\".",
      evidence: "Vector path strictly unified in Logo.tsx",
    },
    {
      index: "09",
      dimension: "Z-Index Stacking",
      doText: "Restrict all stacking contexts strictly to the 6 canonical tiers: z-0, z-10, z-20, z-30, z-40, z-50.",
      avoidText: "Never introduce ad-hoc values like z-[70], z-[100], z-[150], or z-[9999].",
      evidence: "185 z-index occurrences standardized",
    },
    {
      index: "10",
      dimension: "Image Optimization",
      doText: "Always use Next.js <Image> with explicit aspect ratios, sizes=\"...\", and quality={80}.",
      avoidText: "Never render raw unoptimized <img> tags or omit descriptive alt attributes.",
      evidence: "All catalog and hero images optimized",
    },
    {
      index: "11",
      dimension: "Accessibility (A11y)",
      doText: "Provide visible focus rings (focus-visible:ring-2), aria-live=\"polite\", and 44px minimum tap targets.",
      avoidText: "Never suppress focus outlines with outline-none without an explicit focus replacement.",
      evidence: "100% WCAG 2.1 Level AA compliance",
    },
  ];

  return (
    <section id="section-13" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 13 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            QUALITY GATE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          13. Quick Reference &amp; PR Quality Gate
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          The definitive 11-dimension pre-flight inspection checklist. Every pull request submitted to the VEYRO repository must adhere strictly to these canonical rules.
        </p>
      </div>

      {/* ── High-Impact 11-Row DO vs AVOID Inspection Matrix ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-950 text-white font-mono text-2xs uppercase tracking-wider border-b border-neutral-800">
                <th className="py-4 px-4 sm:px-6 w-12 text-neutral-400">#</th>
                <th className="py-4 px-4 sm:px-6 w-48">Dimension</th>
                <th className="py-4 px-4 sm:px-6">Canonical Standard (DO ✓)</th>
                <th className="py-4 px-4 sm:px-6">Prohibited Anti-Pattern (AVOID ✕)</th>
                <th className="py-4 px-4 sm:px-6 w-44">Audited Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {MATRIX_ROWS.map((row) => (
                <tr key={row.index} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-mono text-neutral-400 font-bold align-top">
                    {row.index}
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-neutral-950 align-top">
                    {row.dimension}
                  </td>
                  <td className="py-4 px-4 sm:px-6 align-top">
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-3xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200 shrink-0 mt-0.5">
                        <Check size={10} className="text-emerald-700" /> DO
                      </span>
                      <span className="text-neutral-800 leading-relaxed font-medium">
                        {row.doText}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 align-top">
                    <div className="flex items-start gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-3xs font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-200 shrink-0 mt-0.5">
                        <X size={10} className="text-rose-700" /> AVOID
                      </span>
                      <span className="text-neutral-600 leading-relaxed">
                        {row.avoidText}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 font-mono text-2xs text-neutral-500 align-top">
                    {row.evidence}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Maintenance & Custodian Closing Strip ── */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-2xs font-mono text-neutral-500">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-neutral-900" />
          <span className="font-bold text-neutral-900 uppercase tracking-wider">
            CUSTODIAN: VEYRO CORE ARCHITECTURE TEAM
          </span>
        </div>
        <div className="flex items-center gap-3 text-neutral-400">
          <span>REVISION 2.0</span>
          <span>•</span>
          <span>EFFECTIVE: 2026-10-25</span>
          <span>•</span>
          <span>BRANCH: MAIN</span>
        </div>
      </div>
    </section>
  );
}
