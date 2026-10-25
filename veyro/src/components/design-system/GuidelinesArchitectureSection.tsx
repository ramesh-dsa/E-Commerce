import React from "react";
import { Terminal, FolderTree, Cpu, ShieldCheck, Database, Layers } from "lucide-react";

export function GuidelinesArchitectureSection() {
  const CARDINAL_LAWS = [
    {
      law: "Law 01",
      title: "Server Component Default",
      icon: Cpu,
      desc: "Every page and layout is a React Server Component by default. Add \"use client\" exclusively to leaf components requiring React hooks (useState, useEffect), browser APIs, or DOM event listeners.",
      code: "// Server Component by default\nexport default function CatalogPage() { ... }\n\n// Client leaf for interactive controls\n\"use client\";\nexport function FilterSidebar() { ... }",
    },
    {
      law: "Law 02",
      title: "Image Optimization Contract",
      icon: Layers,
      desc: "Always render images through Next.js <Image> with explicit aspect ratios, quality={80}, and responsive sizes. Never use raw unoptimized <img> tags that cause Cumulative Layout Shift.",
      code: "<Image\n  src={product.image}\n  alt={product.name}\n  fill\n  sizes=\"(max-width: 768px) 100vw, 50vw\"\n  quality={80}\n  className=\"object-cover\"\n/>",
    },
    {
      law: "Law 03",
      title: "Iconography Discipline",
      icon: ShieldCheck,
      desc: "Use lucide-react as the single canonical library for UI action icons. Use @/components/ui/Logo for official brand marks. Never install fragmented external icon dependencies.",
      code: "import { ShoppingBag, ArrowRight } from \"lucide-react\";\nimport { Logo, VeyroMark } from \"@/components/ui/Logo\";",
    },
    {
      law: "Law 04",
      title: "State & URL Synchronization",
      icon: Database,
      desc: "Ephemeral UI states (filters, search queries, active category tabs) must synchronize directly with URL search parameters for link sharing. Cart & Wishlist synchronize via optimistic client stores.",
      code: "// Filter URL sync\nconst searchParams = useSearchParams();\nconst category = searchParams.get(\"category\") || \"all\";",
    },
  ];

  return (
    <section id="section-10" className="scroll-mt-28 space-y-10">
      {/* ── Section Header ── */}
      <div className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-2xs font-bold uppercase tracking-widest text-neutral-400">
            [ 10 ]
          </span>
          <span className="h-3 w-px bg-neutral-200" />
          <span className="font-mono text-2xs uppercase tracking-wider text-neutral-500">
            ENGINEERING GOVERNANCE
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950">
          10. Architecture &amp; Code Standards
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-3xl">
          The VEYRO codebase follows strict modular architecture across Next.js 16 App Router, Tailwind CSS v4, and React 19. Designed for sub-second static generation, zero bloat, and enterprise-grade maintainability.
        </p>
      </div>

      {/* ── Visual Repository Blueprint (Code Tree) ── */}
      <div className="rounded-3xl border border-neutral-800 bg-neutral-950 text-white p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <FolderTree size={16} className="text-veyro-yellow" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-white">
              Repository Architecture Blueprint
            </h3>
          </div>
          <span className="font-mono text-2xs text-neutral-400">
            Next.js 16 App Router &bull; 64 Compiled Routes
          </span>
        </div>

        <div className="bg-neutral-900/90 rounded-2xl p-5 sm:p-6 border border-neutral-800 font-mono text-xs overflow-x-auto leading-relaxed text-neutral-300">
          <div className="text-neutral-500 mb-2 font-bold"># VEYRO Production Workspace File Topology</div>
          <div><span className="text-white font-bold">veyro/</span></div>
          <div>├── <span className="text-amber-300 font-bold">src/app/</span>                  <span className="text-neutral-500"># Next.js 16 App Router (64 compiled routes)</span></div>
          <div>│   ├── <span className="text-neutral-200">(storefront)/</span>         <span className="text-neutral-500"># High-speed static catalog, PDP, cart, checkout</span></div>
          <div>│   ├── <span className="text-neutral-200">admin/</span>                <span className="text-neutral-500"># Authenticated merchant administration</span></div>
          <div>│   └── <span className="text-emerald-400 font-semibold">design-guidelines/</span>    <span className="text-neutral-500"># Living design system specification portal</span></div>
          <div>├── <span className="text-amber-300 font-bold">src/components/</span></div>
          <div>│   ├── <span className="text-neutral-200">ui/</span>                   <span className="text-neutral-500"># Reusable atomic primitives (Badge, Skeleton, Logo, Container)</span></div>
          <div>│   ├── <span className="text-neutral-200">layout/</span>               <span className="text-neutral-500"># Global shell (Navbar, AnnouncementBar, Footer)</span></div>
          <div>│   ├── <span className="text-neutral-200">features/</span>             <span className="text-neutral-500"># Domain modules (CartDrawer, ProductCard, Hero, Reviews)</span></div>
          <div>│   └── <span className="text-emerald-400 font-semibold">design-system/</span>        <span className="text-neutral-500"># Modular guideline sections (Philosophy, Color, Z-Index)</span></div>
          <div>├── <span className="text-amber-300 font-bold">src/lib/</span>                  <span className="text-neutral-500"># Data stores, currency formatting, mock archives</span></div>
          <div>└── <span className="text-amber-300 font-bold">public/</span>                    <span className="text-neutral-500"># Vector brand marks, static assets, living DESIGN.md</span></div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 font-mono text-2xs text-neutral-400 border-t border-neutral-800">
          <span>Turbopack Engine: Enabled</span>
          <span>Zero Layout Reflow: Guaranteed</span>
          <span>Target Bundle: Pure Tree-Shaken ESM</span>
        </div>
      </div>

      {/* ── The 4 Cardinal Engineering Laws ── */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
          The Four Cardinal Engineering Laws
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CARDINAL_LAWS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.law}
                className="p-6 rounded-3xl border border-neutral-200 bg-white shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-900 text-white uppercase tracking-widest">
                      {item.law}
                    </span>
                    <span className="font-mono text-2xs text-neutral-400">
                      Engineering Rule
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Icon size={18} className="text-neutral-950 shrink-0" />
                    <h4 className="font-bold text-sm uppercase tracking-tight text-neutral-950">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2">
                  <pre className="font-mono text-3xs bg-neutral-50 p-3 rounded-xl border border-neutral-200 text-neutral-800 overflow-x-auto leading-relaxed">
                    {item.code}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dependency Integrity Callout ── */}
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-neutral-900" />
          <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-neutral-950">
            Dependency Discipline Standard
          </h4>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Before proposing or installing any third-party npm package, verify whether the existing standard library (<code className="font-mono text-neutral-900 font-bold bg-neutral-200 px-1 py-0.5 rounded">lucide-react</code>, <code className="font-mono text-neutral-900 font-bold bg-neutral-200 px-1 py-0.5 rounded">Tailwind v4</code>, <code className="font-mono text-neutral-900 font-bold bg-neutral-200 px-1 py-0.5 rounded">motion/react</code>) already fulfills the architectural need. Do not add redundant state libraries, alternative icon sets, or CSS-in-JS dependencies.
        </p>
      </div>
    </section>
  );
}
