"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ArrowRightIcon } from "@/components/ui/Icons";
import { TearTicket } from "@/components/ui/TearTicket";
import { useCart } from "@/context/CartContext";
import { ArrowRight } from "lucide-react";

function DecryptCode({
  target = "VEYRO10",
  active = false,
}: {
  target?: string;
  active?: boolean;
}) {
  const [displayed, setDisplayed] = useState("••••••••");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789!#$*";

  useEffect(() => {
    if (!active) {
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
    <span className="font-mono text-sm sm:text-base font-black tracking-widest text-veyro-yellow drop-shadow-[0_0_10px_rgba(252,208,23,0.6)] inline-block">
      {active ? displayed : "••••••••"}
    </span>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function XIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function SpotifyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.485 17.291c-.216.353-.675.467-1.028.252-2.817-1.722-6.363-2.111-10.54-1.157-.403.092-.806-.162-.898-.565-.092-.404.162-.806.565-.898 4.575-1.045 8.492-.598 11.649 1.339.353.216.467.676.252 1.029zm1.464-3.26c-.272.443-.852.584-1.295.312-3.224-1.982-8.14-2.556-11.954-1.398-.498.151-1.028-.135-1.179-.633-.151-.498.135-1.028.633-1.179 4.364-1.325 9.782-.686 13.483 1.593.443.272.584.852.312 1.305zm.126-3.41c-3.865-2.296-10.239-2.508-13.916-1.392-.593.18-1.221-.157-1.401-.75-.18-.593.157-1.221.75-1.401 4.231-1.284 11.272-1.034 15.727 1.61.533.316.708 1.008.392 1.541-.316.533-1.008.708-1.541.392z" />
    </svg>
  );
}

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const { appliedCoupon, applyCoupon } = useCart();

  const [email, setEmail] = useState("");
  const hasVipCoupon = appliedCoupon === "VEYRO10" || appliedCoupon === "VEYRO-VIP10";
  const [emailJoined, setEmailJoined] = useState(false);
  const [ticketTorn, setTicketTorn] = useState(false);

  const isJoined = emailJoined || hasVipCoupon;
  const isTorn = ticketTorn || hasVipCoupon;

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const socialLinks = [
    {
      label: "Instagram",
      handle: "@veyro.in",
      href: "https://instagram.com/veyro.in",
      icon: InstagramIcon,
    },
    {
      label: "X (Twitter)",
      handle: "@veyroapparel",
      href: "https://x.com/veyroapparel",
      icon: XIcon,
    },
    {
      label: "YouTube",
      handle: "VEYRO Atelier",
      href: "https://youtube.com/@veyroapparel",
      icon: YouTubeIcon,
    },
    {
      label: "Spotify",
      handle: "Runway Soundtracks",
      href: "https://spotify.com",
      icon: SpotifyIcon,
    },
  ];

  const footerLinks = {
    shop: [
      { label: "New Arrivals", href: "/collections" },
      { label: "Oversized T-Shirts", href: "/clothing" },
      { label: "Heavyweight 240 GSM", href: "/clothing" },
      { label: "Graphic & Textured", href: "/clothing" },
      { label: "Minimal Sneakers", href: "/shoes" },
      { label: "Retro Runners", href: "/shoes" },
    ],
    about: [
      { label: "Our Story", href: "/faq" },
      { label: "Indian Craftsmanship", href: "/faq" },
      { label: "Fabric & Fit Guide", href: "/faq#products" },
      { label: "Sustainability", href: "/faq#products" },
      { label: "Careers", href: "mailto:careers@veyro.in" },
    ],
    help: [
      { label: "Track Your Order", href: "/orders" },
      { label: "Shipping Policy", href: "/faq#shipping" },
      { label: "7-Day Free Returns", href: "/faq#returns" },
      { label: "Terms of Service", href: "/faq#terms" },
      { label: "Contact Support", href: "/faq#contact" },
    ],
  };

  return (
    <footer className="relative w-full bg-veyro-black text-white pt-16 sm:pt-20 pb-8 border-t border-neutral-800 overflow-hidden">
      <Container>
        {/* Row 1: Brand Ethos (Left) & The VEYRO Club Newsletter / VIP Pass (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pb-16 items-start">
          {/* Brand Ethos (Col 1 to 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={30} variant="white" />
              </div>
              <p className="mt-4 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-sm font-normal">
                Engineered for the modern Indian uniform. Heavyweight 240 GSM architectural cuts, handcrafted Horology calibres, and vulcanized footwear silhouettes.
              </p>
            </div>

            <div className="space-y-2 border-l border-neutral-800 pl-4 py-1">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-veyro-yellow animate-pulse" />
                <span className="text-2xs font-semibold tracking-widest text-neutral-300 uppercase font-mono">
                  BENGALURU & TIRUPUR • MADE IN INDIA
                </span>
              </div>
              <p className="text-2xs text-neutral-400 font-mono tracking-wider uppercase">
                ARCHIVAL RUNS ONLY • NO MASS RESTOCKS
              </p>
            </div>

            {/* Social Presence */}
            <div className="pt-1">
              <span className="block text-2xs font-bold uppercase tracking-widest text-neutral-400 mb-2.5 font-mono">
                Connect @veyro.in
              </span>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow VEYRO on ${social.label}`}
                      className="w-8 h-8 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:border-white hover:bg-neutral-900 flex items-center justify-center transition-colors duration-200"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* The VEYRO Club: Clean Newsletter or Unlocked VIP Pass (Col 6 to 12) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {!isJoined ? (
              /* State A: Clean Editorial Newsletter Form (Before email submission) */
              <div className="space-y-4">
                <span className="text-xs font-bold tracking-widest text-veyro-yellow uppercase font-mono flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-veyro-yellow" />
                  THE VEYRO CLUB
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Unlock inaugural privileges.
                </h3>
                <p className="text-sm text-neutral-300 font-normal leading-relaxed max-w-md">
                  Join the archival registry for early drop notifications, private capsule releases, and claim an immediate 10% inaugural membership pass.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) {
                      setEmailJoined(true);
                    }
                  }}
                  className="flex flex-col sm:flex-row gap-3 pt-3 max-w-md"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 bg-neutral-900 border border-neutral-700 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-white transition-colors"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-veyro-yellow hover:text-black px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase transition-colors cursor-pointer shrink-0"
                  >
                    <span>Request Pass</span>
                    <ArrowRightIcon size={14} />
                  </button>
                </form>
                <p className="text-2xs text-neutral-400 font-mono tracking-wider uppercase">
                  VIP Pass issued upon subscription • No spam
                </p>
              </div>
            ) : (
              /* State B: Unlocked VIP Tear Pass (After user submits email) */
              <div className="border border-neutral-800 bg-neutral-950 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-neutral-800">
                  <div>
                    <span className="text-2xs font-mono font-bold uppercase tracking-widest text-veyro-yellow flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-veyro-yellow" />
                      Privilege Issued
                    </span>
                    <h4 className="text-lg font-bold text-white mt-0.5">Your Inaugural VIP Pass</h4>
                  </div>
                  {!isTorn && (
                    <span className="text-2xs text-neutral-400 font-mono">
                      Drag or tap right stub to tear →
                    </span>
                  )}
                </div>

                <div className="w-full overflow-visible flex items-center justify-center py-2 relative min-h-[240px]">
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
                    rotate={1.2}
                    tilt
                    tiltMax={8}
                    tiltReach={240}
                    parallax={5}
                    perspective={1000}
                    background="#121214"
                    color="#f5f5f5"
                    border
                    borderColor="rgba(255, 255, 255, 0.15)"
                    borderWidth={1}
                    recenter
                    torn={isTorn}
                    onTear={() => {
                      setTicketTorn(true);
                      applyCoupon("VEYRO10");
                    }}
                    stub={
                      <div className="h-full flex flex-col justify-between p-3.5 text-right font-serif select-none bg-neutral-950 border-l border-dashed border-white/15">
                        <div>
                          <h4 className="text-sm text-white tracking-widest font-light italic">
                            Admit One
                          </h4>
                          <p className="text-[8px] text-neutral-300 tracking-[0.2em] mt-1.5 uppercase font-sans">
                            Tear to reveal
                          </p>
                        </div>
                        <div className="pt-2 border-t border-white/15">
                          <span className="text-xs font-light text-veyro-yellow italic tracking-wider block">
                            10% Privileged
                          </span>
                        </div>
                      </div>
                    }
                  >
                    <div className="absolute inset-0 flex flex-col justify-between p-4 font-mono select-none pointer-events-none overflow-hidden">
                      {isTorn && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20 animate-ticket-shimmer" />
                      )}

                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] font-semibold tracking-[0.3em] text-neutral-300 uppercase mb-1 font-sans">
                            Atelier Collection
                          </p>
                          <h3 className="text-lg sm:text-xl font-serif tracking-wide text-white font-light italic">
                            Inaugural Pass
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] text-neutral-300 tracking-[0.2em] uppercase font-sans">
                            Edition 01
                          </span>
                          {isTorn && (
                            <span className="text-2xs font-serif italic tracking-widest text-veyro-yellow animate-in fade-in duration-700">
                              Unlocked
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-end justify-between pt-2 border-t border-white/15 relative z-10">
                        <div>
                          <span className="text-[8px] text-neutral-300 uppercase tracking-[0.2em] block font-sans mb-1 font-light">
                            Signature Code
                          </span>
                          <DecryptCode target="VEYRO10" active={isTorn} />
                        </div>
                        <div className="flex items-center gap-0.5 h-6 opacity-85">
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

                {isTorn && (
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 border-t border-neutral-800 pt-4">
                    <div>
                      <p className="text-xs font-bold text-white tracking-[0.15em] uppercase">10% Inaugural Privilege Unlocked</p>
                      <p className="text-xs text-neutral-300 font-normal mt-0.5 tracking-wide">Code VEYRO10 has been automatically applied to your bag.</p>
                    </div>
                    <Link
                      href="/cart"
                      className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] px-5 py-2.5 bg-veyro-yellow text-black hover:bg-white transition-colors cursor-pointer shrink-0"
                    >
                      <span>Proceed to Bag</span>
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 text-black" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Links Navigation Grid (Clean black background, zero clutter) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-16 border-t border-neutral-800">
          {/* Col 1: Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-mono">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
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
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-mono">
              The Atelier
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
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
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-mono">
              Client Service
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
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

          {/* Col 4: Store Info & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-mono">
              Flagship Contact
            </h4>
            <div className="text-xs text-neutral-400 space-y-2 leading-relaxed">
              <p className="text-white font-medium">VEYRO Apparel & Footwear Pvt. Ltd.</p>
              <p>Bengaluru & Tirupur, India</p>
              <p className="pt-2 text-white font-semibold hover:text-veyro-yellow transition-colors">
                <a href="mailto:support@veyro.in">support@veyro.in</a>
              </p>
              <p>Mon – Sat, 10:00 AM – 7:00 PM IST</p>
              <p className="pt-1 text-2xs text-neutral-400 font-mono">Fast Track Dispatch Across India</p>
            </div>
          </div>
        </div>

        {/* Row 3: Grand Monumental VEYRO Brand Signature (Cleanly below links, no overlap) */}
        <div className="border-t border-neutral-800/80 pt-10 sm:pt-14 pb-4 overflow-hidden select-none pointer-events-none text-center">
          <span className="font-sans font-black text-[15vw] tracking-[-0.04em] text-neutral-800/60 uppercase leading-none block whitespace-nowrap">
            VEYRO
          </span>
        </div>

        {/* Row 4: Bottom Legal & Copyright Bar */}
        <div className="pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {currentYear} VEYRO APPAREL & FOOTWEAR. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <Link href="/faq#terms" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq#terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/collections" className="hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
