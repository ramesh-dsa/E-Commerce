import React from "react";
import Link from "next/link";
import { Download, ArrowRight, GitBranch, Sparkles } from "lucide-react";

export function GuidelinesHeader() {
  return (
    <header className="border-b border-neutral-200 bg-neutral-50/70 pt-14 pb-12 sm:pt-16 sm:pb-14">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          {/* Left: Eyebrow + Display Title + Editorial Subcopy */}
          <div className="max-w-3xl space-y-3.5">
            {/* Monospace Eyebrow Badge */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white font-mono text-2xs font-bold uppercase tracking-widest">
                <Sparkles size={11} className="text-veyro-yellow" />
                <span>VEYRO DESIGN SYSTEM</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-600 font-mono text-2xs font-medium">
                <GitBranch size={11} className="text-neutral-500" />
                <span>branch: main</span>
              </span>

              <span className="font-mono text-2xs text-neutral-500 uppercase tracking-wider hidden sm:inline">
                • Updated 2026-10-25
              </span>
            </div>

            {/* Brutalist Display Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-950 leading-[0.95]">
              Design Guidelines <br className="hidden sm:inline" />
              <span className="text-neutral-500">&amp; Architecture</span>
            </h1>

            {/* Editorial Subcopy */}
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed pt-1 max-w-2xl">
              The single source of truth for VEYRO storefront engineering and design. Maintained in the repository as{" "}
              <code className="font-mono bg-neutral-200 text-neutral-900 px-1.5 py-0.5 rounded text-xs font-semibold">
                DESIGN.md
              </code>{" "}
              and compiled here in real time with living design tokens and interactive component contracts.
            </p>
          </div>

          {/* Right: Stadium Action Pills */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/DESIGN.md"
              download="DESIGN.md"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs group"
            >
              <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>Download DESIGN.md</span>
            </a>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md group"
            >
              <span>Storefront Preview</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
