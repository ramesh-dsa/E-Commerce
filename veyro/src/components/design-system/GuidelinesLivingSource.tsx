import React from "react";
import Link from "next/link";
import { Download, ArrowRight, GitBranch, Sparkles } from "lucide-react";

export function GuidelinesLivingSource() {
  return (
    <section className="mt-20 sm:mt-24 w-full">
      <div className="relative rounded-3xl bg-neutral-950 text-white p-8 sm:p-12 md:p-14 overflow-hidden border border-neutral-800 shadow-2xl">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-veyro-yellow/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left Column: Heading & Copy */}
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-veyro-yellow text-2xs font-mono font-bold tracking-widest uppercase">
              <Sparkles size={11} />
              <span>LIVING SPECIFICATION • BRANCH MAIN</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-none">
              The Living Source
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
              These guidelines are maintained in the repository as{" "}
              <code className="font-mono bg-white/10 text-white px-2 py-0.5 rounded text-xs">
                DESIGN.md
              </code>{" "}
              and rendered here in real time. Any updates to tokens, layout recipes, or component contracts must be committed to the living contract.
            </p>

            <div className="flex items-center gap-4 text-neutral-400 font-mono text-2xs pt-1">
              <span className="flex items-center gap-1">
                <GitBranch size={13} className="text-veyro-yellow" /> main:cac3bb8
              </span>
              <span>•</span>
              <span>WCAG 2.1 AA Compliant</span>
              <span>•</span>
              <span>Tailwind CSS v4</span>
            </div>
          </div>

          {/* Right Column: Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
            <a
              href="/DESIGN.md"
              download="DESIGN.md"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-colors shadow-xs group"
            >
              <Download size={15} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>Download DESIGN.md</span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-veyro-yellow hover:bg-yellow-400 text-veyro-black text-xs font-bold uppercase tracking-wider transition-colors shadow-md group"
            >
              <span>Explore Storefront</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
