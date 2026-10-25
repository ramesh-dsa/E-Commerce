import React from "react";
import { ChevronsUpDown, ShieldAlert, CheckCircle2 } from "lucide-react";

export function GuidelinesZIndexSection() {
  const TIERS = [
    {
      tier: "Tier 5: Modals & Dialogs",
      token: "z-50",
      accent: "border-l-rose-500 bg-rose-500/5",
      badge: "bg-rose-100 text-rose-800 border-rose-200",
      role: "Active full overlays, authentication modal (AccountModal), system toasts (Toast.tsx), cancel order dialog",
      files: "AccountModal.tsx, CancelOrderModal.tsx, Toast.tsx",
    },
    {
      tier: "Tier 4: Scrims & Drawers",
      token: "z-40",
      accent: "border-l-purple-500 bg-purple-500/5",
      badge: "bg-purple-100 text-purple-800 border-purple-200",
      role: "Dark backdrop scrims (bg-black/85), cart slide-over drawer backdrop, wishlist panel backdrop",
      files: "CartDrawer.tsx, WishlistDrawer.tsx, ProductSearch.tsx",
    },
    {
      tier: "Tier 3: Sticky Application Shell",
      token: "z-30",
      accent: "border-l-amber-500 bg-amber-500/5",
      badge: "bg-amber-100 text-amber-800 border-amber-200",
      role: "Global sticky navigation bar (Navbar.tsx), global announcement marquee (AnnouncementBar.tsx), checkout progress header",
      files: "Navbar.tsx, AnnouncementBar.tsx, checkout/page.tsx",
    },
    {
      tier: "Tier 2: Popovers & Dropdowns",
      token: "z-20",
      accent: "border-l-blue-500 bg-blue-500/5",
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      role: "Fuzzy search autocomplete suggestions, account dropdown popovers, filter trays, color selector tooltips",
      files: "ProductSearch.tsx, Navbar.tsx, ArchiveFilterSidebar.tsx",
    },
    {
      tier: "Tier 1: Floating Chips & Badges",
      token: "z-10",
      accent: "border-l-emerald-500 bg-emerald-500/5",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      role: "Product card status badges (NEW DROP, SAVE ₹500), quick-add buttons, sticky tab bars, carousel navigation arrows",
      files: "ProductCard.tsx, Badge.tsx, HeroPanel.tsx",
    },
    {
      tier: "Base: Document Canvas",
      token: "z-0",
      accent: "border-l-neutral-400 bg-neutral-500/5",
      badge: "bg-neutral-100 text-neutral-800 border-neutral-200",
      role: "Standard document flow, catalog grid items, decorative backdrop ambient glows, watermark graphics",
      files: "page.tsx, Footer.tsx, Container.tsx",
    },
  ];

  return (
    <section id="section-8" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 08 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            STACKING CONTEXT
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          8. Z-Index Ladder &amp; Stacking Context
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          All stacking layers in the VEYRO storefront are locked to 6 strict canonical tiers (<code className="font-mono bg-neutral-100 text-neutral-900 px-1 py-0.5 rounded text-xs">z-0, z-10, z-20, z-30, z-40, z-50</code>). All ad-hoc bracketed values like <code className="font-mono text-rose-700 bg-rose-50 px-1 py-0.5 rounded text-xs line-through">z-[70]</code>, <code className="font-mono text-rose-700 bg-rose-50 px-1 py-0.5 rounded text-xs line-through">z-[100]</code>, and <code className="font-mono text-rose-700 bg-rose-50 px-1 py-0.5 rounded text-xs line-through">z-[150]</code> are strictly prohibited.
        </p>
      </div>

      {/* ── Visual Isometric / Stacked Ladder Diagram ── */}
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-2">
            <ChevronsUpDown size={16} className="text-neutral-900" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
              The 6-Tier Isometric Layering Ladder
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-500">
            Top → Bottom Stacking Hierarchy
          </span>
        </div>

        <div className="space-y-3">
          {TIERS.map((tier) => (
            <div
              key={tier.token}
              className={`p-5 rounded-2xl border border-neutral-200 border-l-4 ${tier.accent} transition-transform hover:translate-x-1 duration-200 space-y-2`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${tier.badge}`}
                  >
                    {tier.token}
                  </span>
                  <span className="font-bold text-xs uppercase tracking-wide text-neutral-950">
                    {tier.tier}
                  </span>
                </div>
                <span className="font-mono text-3xs text-neutral-400">
                  {tier.files}
                </span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {tier.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Strict Anti-Pattern Governance ── */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-rose-600" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
            Stacking Escalation Anti-Pattern Rule
          </h4>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Never inflate z-index values to solve stacking context issues caused by missing <code className="font-mono bg-neutral-200 px-1 py-0.5 rounded text-neutral-900">relative</code> positioning or uncontained parent overflow. If a child component cannot appear above a sibling, verify its parent&apos;s CSS stacking context rather than declaring arbitrary values like <code className="font-mono text-rose-700 font-bold">z-[9999]</code>.
        </p>
      </div>
    </section>
  );
}
