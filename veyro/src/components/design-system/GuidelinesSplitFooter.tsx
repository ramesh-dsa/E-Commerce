import React from "react";
import Link from "next/link";
import { VeyroMark } from "@/components/ui/Logo";
import { ExternalLink, MessageCircle } from "lucide-react";

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function GuidelinesSplitFooter() {
  return (
    <footer className="mt-24 border-t border-neutral-200 bg-neutral-50/70 pt-16 pb-12">
      <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* ── Left Asymmetrical Brand Card ── */}
          <div className="w-full lg:w-80 shrink-0 rounded-2xl bg-neutral-950 text-white p-7 sm:p-8 flex flex-col justify-between shadow-lg border border-neutral-800">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-veyro-yellow">
                  <VeyroMark className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-base tracking-widest uppercase block leading-none">
                    VEYRO
                  </span>
                  <span className="font-mono text-2xs uppercase tracking-wider text-neutral-400 block mt-1">
                    Design System
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed pt-2">
                Architectural heavyweight streetwear, crafted with 240+ GSM combed cotton in Tirupur. Built for durability, precision, and brutalist minimalism.
              </p>
            </div>

            <div className="pt-8">
              <span className="font-mono text-2xs uppercase tracking-widest text-neutral-400 block mb-3">
                Connect & Channels
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                >
                  <XIcon />
                </a>
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                >
                  <MessageCircle size={14} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>

          {/* ── Right Multi-Column Directory ── */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8 py-2">
            {/* Column 1: Storefront */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-900">
                Storefront
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600">
                <li>
                  <Link href="/shop" className="hover:text-neutral-900 transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/clothing" className="hover:text-neutral-900 transition-colors">
                    Heavyweight Cotton
                  </Link>
                </li>
                <li>
                  <Link href="/footwear" className="hover:text-neutral-900 transition-colors">
                    Vulcanized Footwear
                  </Link>
                </li>
                <li>
                  <Link href="/watches" className="hover:text-neutral-900 transition-colors">
                    Horology & Watches
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Architecture */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-900">
                Architecture
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600">
                <li>
                  <a href="#section-3" className="hover:text-neutral-900 transition-colors">
                    Color Ramp Tokens
                  </a>
                </li>
                <li>
                  <a href="#section-4" className="hover:text-neutral-900 transition-colors">
                    Fluid Typography
                  </a>
                </li>
                <li>
                  <a href="#section-8" className="hover:text-neutral-900 transition-colors">
                    Z-Index Ladder
                  </a>
                </li>
                <li>
                  <a href="#section-7" className="hover:text-neutral-900 transition-colors">
                    Physics Motion Lanes
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Components */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-900">
                Application
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600">
                <li>
                  <a href="#section-9" className="hover:text-neutral-900 transition-colors">
                    Pill Button Primitives
                  </a>
                </li>
                <li>
                  <a href="#section-10" className="hover:text-neutral-900 transition-colors">
                    Clean Architecture
                  </a>
                </li>
                <li>
                  <a href="#section-11" className="hover:text-neutral-900 transition-colors">
                    Accessibility AA
                  </a>
                </li>
                <li>
                  <a href="#section-13" className="hover:text-neutral-900 transition-colors">
                    Quick Reference Table
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Governance */}
            <div className="space-y-3">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-900">
                Governance
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600">
                <li>
                  <a
                    href="/DESIGN.md"
                    download="DESIGN.md"
                    className="inline-flex items-center gap-1 text-neutral-900 font-semibold hover:underline"
                  >
                    Download DESIGN.md <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a href="#section-12" className="hover:text-neutral-900 transition-colors">
                    Transition Strategy
                  </a>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-neutral-900 transition-colors">
                    Frequently Asked
                  </Link>
                </li>
                <li>
                  <span className="text-2xs font-mono text-neutral-400 block pt-1">
                    v1.0 (2026-10-25)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Subfooter Copyright & Legal ── */}
        <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-neutral-500 font-mono">
          <p>© 2026 VEYRO Inc. All rights reserved. Architectural Streetwear & Brand System.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-900 transition-colors cursor-pointer">Terms of System</span>
            <span className="hover:text-neutral-900 transition-colors cursor-pointer">Token License</span>
            <span className="hover:text-neutral-900 transition-colors cursor-pointer">Privacy Contract</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
