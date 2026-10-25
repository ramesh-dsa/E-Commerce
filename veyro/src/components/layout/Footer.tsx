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
    <footer className="relative w-full bg-[#050505] text-white pt-16 sm:pt-24 pb-12 border-t border-[#1a1a1a] overflow-hidden">
      <Container>
        {/* Newsletter & Brand Statement Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 pb-16 border-b border-[#1a1a1a]">
          {/* Brand Vision */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={32} variant="white" />
              </div>
              <p className="mt-5 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-sm font-normal">
                Engineered for the modern Indian uniform. Architectural cuts, premium textiles, and brutalist silhouettes.
              </p>
            </div>

            <div className="mt-8">
              <p className="text-xs font-medium tracking-[0.2em] text-neutral-500 uppercase font-mono">
                Bengaluru • Tirupur — Made in India
              </p>
            </div>
          </div>

          {/* Newsletter / The VEYRO Club VIP Ticket Box */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-[0.2em] text-veyro-yellow uppercase mb-2 font-mono block">
              THE VEYRO CLUB
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Unlock inaugural privileges.
            </h3>
            <p className="text-sm text-neutral-300 mb-6 font-normal">
              Early access to releases. Exclusive archival cuts.
            </p>

            {!isJoined ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) {
                    setEmailJoined(true);
                  }
                }}
                className="flex flex-col sm:flex-row gap-3 w-full items-center sm:items-end"
              >
                <div className="flex-1 w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full bg-[#121214] border border-white/10 px-4 py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-veyro-yellow focus:ring-1 focus:ring-veyro-yellow transition-all rounded-lg shadow-inner"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="self-center sm:self-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-veyro-yellow hover:text-black px-8 py-3.5 text-xs sm:text-sm font-bold tracking-[0.1em] uppercase transition-all cursor-pointer shrink-0 rounded-lg shadow-md active:scale-98"
                >
                  <span>Request Pass</span>
                  <ArrowRightIcon size={14} />
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
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
                    background="#121214"
                    color="#f5f5f5"
                    border
                    borderColor="rgba(255, 255, 255, 0.12)"
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
                      {/* Holographic Liquid Foil Sweep */}
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
                        {/* Barcode Graphic */}
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

                {/* Ticket Status / Action Bar */}
                {isTorn && (
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs font-bold text-white tracking-[0.15em] uppercase">Privilege Unlocked</p>
                        <p className="text-xs text-neutral-300 font-normal mt-0.5 tracking-wide">10% inaugural discount automatically applied.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <Link
                        href="/cart"
                        className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] px-5 py-2.5 bg-veyro-yellow text-black hover:bg-white rounded-full transition-colors cursor-pointer shadow-md"
                      >
                        <span>Proceed to Bag</span>
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 text-black" />
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
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-mono">
              Shop
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
              About
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
              Support
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

          {/* Col 4: Store Info & Social Follow */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4 font-mono">
              Contact
            </h4>
            <div className="text-xs text-neutral-400 space-y-2 leading-relaxed">
              <p>VEYRO Apparel & Footwear Pvt. Ltd.</p>
              <p>Bengaluru & Tirupur, India</p>
              <p className="pt-2 text-white font-semibold hover:text-veyro-yellow transition-colors">
                <a href="mailto:support@veyro.in">support@veyro.in</a>
              </p>
              <p>Mon – Sat, 10:00 AM – 7:00 PM IST</p>
            </div>

            {/* Social Presence */}
            <div className="mt-5 pt-4 border-t border-[#1a1a1a]">
              <span className="block text-xs font-bold uppercase tracking-widest text-neutral-300 mb-2.5 font-mono">
                Follow @veyro.in
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
                      className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-black hover:bg-veyro-yellow hover:border-veyro-yellow flex items-center justify-center transition duration-200 hover:-translate-y-0.5 shadow-2xs"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} VEYRO APPAREL. ALL RIGHTS RESERVED.</p>
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
