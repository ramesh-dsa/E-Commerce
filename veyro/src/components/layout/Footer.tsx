"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { TearTicket } from "@/components/ui/TearTicket";
import { useCart } from "@/context/CartContext";
import { Check, ArrowRight } from "lucide-react";

function DecryptCode({
  target = "VEYRO10",
  active = false,
}: {
  target?: string;
  active?: boolean;
}) {
  const [displayed, setDisplayed] = useState(active ? target : "••••••••");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789!#$*";

  useEffect(() => {
    if (!active) {
      setDisplayed("••••••••");
      return;
    }

    let iteration = 0;
    const maxIterations = 14;
    const interval = setInterval(() => {
      setDisplayed(() =>
        target
          .split("")
          .map((letter, index) => {
            if (index < iteration / 2) {
              return target[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iteration += 1;
      if (iteration >= maxIterations) {
        setDisplayed(target);
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [active, target]);

  return (
    <span className="font-mono text-sm sm:text-base font-black tracking-widest text-[#fcd017] drop-shadow-[0_0_10px_rgba(252,208,23,0.6)] inline-block">
      {displayed}
    </span>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { appliedCoupon, applyCoupon, openCart } = useCart();

  const [email, setEmail] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isTorn, setIsTorn] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Sync if coupon is already active
  useEffect(() => {
    if (appliedCoupon === "VEYRO10" || appliedCoupon === "VEYRO-VIP10") {
      setIsJoined(true);
      setIsTorn(true);
    }
  }, [appliedCoupon]);

  const footerLinks = {
    shop: [
      { label: "New Arrivals", href: "#" },
      { label: "Oversized T-Shirts", href: "#" },
      { label: "Heavyweight 240 GSM", href: "#" },
      { label: "Graphic & Textured", href: "#" },
      { label: "Minimal Sneakers", href: "#" },
      { label: "Retro Runners", href: "#" },
    ],
    about: [
      { label: "Our Story", href: "#" },
      { label: "Indian Craftsmanship", href: "#" },
      { label: "Fabric & Fit Guide", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Careers", href: "#" },
    ],
    help: [
      { label: "Track Your Order", href: "#" },
      { label: "Shipping Policy", href: "#" },
      { label: "7-Day Free Returns", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact Support", href: "#" },
    ],
  };

  return (
    <footer className="w-full bg-[#050505] text-white pt-16 sm:pt-24 pb-12 border-t border-[#1a1a1a]">
      <Container>
        {/* Newsletter & Brand Statement Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 pb-16 border-b border-[#222222]">
          {/* Brand Vision */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={32} className="text-white brightness-200 invert" />
              </div>
              <p className="mt-5 text-sm sm:text-base text-[#999999] leading-relaxed max-w-sm font-light">
                Engineered for the modern Indian uniform. Architectural cuts, premium textiles, and brutalist silhouettes.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <span className="text-xs font-semibold tracking-widest text-[#888888] uppercase">
                MADE IN INDIA • GLOBAL STANDARD
              </span>
            </div>
          </div>

          {/* Newsletter / The VEYRO Club VIP Ticket Box */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-wider text-[#888888] uppercase mb-2">
              THE VEYRO CLUB
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Unlock inaugural privileges.
            </h3>
            <p className="text-sm text-[#888888] mb-6 font-light">
              Early access to releases. Exclusive archival cuts.
            </p>

            {!isJoined ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) {
                    setIsJoined(true);
                  }
                }}
                className="flex flex-col sm:flex-row gap-4 w-full items-end"
              >
                <div className="flex-1 w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-transparent border-b border-[#333333] px-0 py-3 text-sm text-white placeholder-[#999999] focus:outline-none focus:border-white transition-colors rounded-none input-dark-autofill"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 text-xs sm:text-sm font-bold tracking-[0.1em] uppercase hover:bg-[#e0e0e0] transition-colors cursor-pointer shrink-0 rounded-[1px]"
                >
                  <span>Request Pass</span>
                  <ArrowRightIcon size={14} />
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                {!isTorn && (
                  <div className="flex items-center justify-end text-xs">
                    <span className="text-[11px] text-neutral-400 font-mono">
                      Drag or tap right stub to tear →
                    </span>
                  </div>
                )}

                {/* The Luxury Tear Ticket */}
                <div className="w-full overflow-visible flex justify-center py-4 relative min-h-[260px]">
                  <TearTicket
                    image="/images/veyro-vip-pass-artwork.jpg"
                    imageAlt="VEYRO Luxury Atelier VIP Pass"
                    width={460}
                    height={235}
                    stubSize={140}
                    radius={14}
                    holes={11}
                    holeSize={6}
                    notch={4}
                    roughness={0}
                    tearAngle={45}
                    stretch={45}
                    resistance={0.65}
                    rotate={1.5}
                    tilt
                    tiltMax={8}
                    tiltReach={240}
                    parallax={5}
                    perspective={1000}
                    background="#0c0c0e"
                    color="#f5f5f5"
                    border
                    borderColor="rgba(255, 255, 255, 0.18)"
                    borderWidth={1}
                    recenter
                    torn={isTorn}
                    onTear={() => {
                      setIsTorn(true);
                      applyCoupon("VEYRO10");
                    }}
                    stub={
                      <div className="h-full flex flex-col justify-between p-3.5 text-right font-serif select-none bg-[#0a0a0c] border-l border-dashed border-white/10">
                        <div>
                          <h4 className="text-[13px] text-white tracking-widest font-light italic">
                            Admit One
                          </h4>
                          <p className="text-[8px] text-[#666666] tracking-[0.2em] mt-1.5 uppercase font-sans">
                            Tear to reveal
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/10">
                          <span className="text-[11px] font-light text-[#fcd017] italic tracking-wider block">
                            10% Privileged
                          </span>
                        </div>
                      </div>
                    }
                  >
                    <div className="absolute inset-0 flex flex-col justify-between p-4 font-mono select-none pointer-events-none overflow-hidden">
                      {/* Holographic Liquid Foil Sweep */}
                      {isTorn && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20 animate-ticket-shimmer" />
                      )}

                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] font-light tracking-[0.3em] text-[#888888] uppercase mb-1 font-sans">
                            Atelier Collection
                          </p>
                          <h3 className="text-lg sm:text-xl font-serif tracking-wide text-[#ffffff] font-light italic">
                            Inaugural Pass
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] text-[#555555] tracking-[0.2em] uppercase font-sans">
                            Edition 01
                          </span>
                          {isTorn && (
                            <span className="text-[10px] font-serif italic tracking-widest text-[#fcd017] animate-in fade-in duration-700">
                              Unlocked
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-end justify-between pt-2 border-t border-white/10 relative z-10">
                        <div>
                          <span className="text-[8px] text-[#777777] uppercase tracking-[0.2em] block font-sans mb-1 font-light">
                            Signature Code
                          </span>
                          <DecryptCode target="VEYRO10" active={isTorn} />
                        </div>
                        {/* Barcode Graphic */}
                        <div className="flex items-center gap-0.5 h-6 opacity-75">
                          <span className="w-0.5 h-full bg-white block" />
                          <span className="w-1.5 h-full bg-white block" />
                          <span className="w-0.5 h-full bg-white block" />
                          <span className="w-1 h-full bg-white block" />
                          <span className="w-0.5 h-full bg-white block" />
                          <span className="w-2 h-full bg-white block" />
                          <span className="w-0.5 h-full bg-white block" />
                          <span className="w-1.5 h-full bg-white block" />
                        </div>
                      </div>
                    </div>
                  </TearTicket>
                </div>

                {/* Ticket Status / Action Bar */}
                {isTorn && (
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 border-t border-[#1a1a1a] pt-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[11px] font-bold text-white tracking-[0.15em] uppercase">Privilege Unlocked</p>
                        <p className="text-[11px] text-[#777777] font-light mt-0.5 tracking-wide">10% inaugural discount automatically applied.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <Link
                        href="/cart"
                        className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white hover:text-[#fcd017] transition-colors cursor-pointer"
                      >
                        <span className="relative pb-0.5 after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#fcd017] after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">Proceed to Bag</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-14 border-b border-[#1a1a1a]">
          {/* Col 1: Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#999999] mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-sm text-[#aaaaaa]">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-0.5 inline-block transition-transform transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Brand Ethos */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#999999] mb-4">
              About
            </h4>
            <ul className="space-y-2.5 text-sm text-[#aaaaaa]">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-0.5 inline-block transition-transform transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#999999] mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-sm text-[#aaaaaa]">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:translate-x-0.5 inline-block transition-transform transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Store Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#999999] mb-4">
              Contact
            </h4>
            <div className="text-xs text-[#888888] space-y-2 leading-relaxed">
              <p>VEYRO Apparel & Footwear Pvt. Ltd.</p>
              <p>Bengaluru & Tirupur, India</p>
              <p className="pt-2 text-white font-medium">support@veyro.in</p>
              <p>Mon – Sat, 10:00 AM – 7:00 PM IST</p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#999999]">
          <p>© {currentYear} VEYRO APPAREL. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
