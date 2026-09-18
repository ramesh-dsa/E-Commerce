"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { ArrowRightIcon } from "@/components/ui/Icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

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

          {/* Newsletter Box (Architectural/Minimalist) */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-xs font-semibold tracking-wider text-[#888888] uppercase mb-2">
              THE VEYRO CLUB
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Unlock 10% off your inaugural order
            </h3>
            <p className="text-sm text-[#888888] mb-8 font-light">
              Be the first to access limited batch drops, fit archives, and members-only releases.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-4 w-full items-end"
            >
              <div className="flex-1 w-full">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent border-b border-[#333333] px-0 py-3 text-sm text-white placeholder-[#666666] focus:outline-none focus:border-white transition-colors rounded-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 text-xs sm:text-sm font-bold tracking-[0.1em] uppercase hover:bg-[#e0e0e0] transition-colors cursor-pointer shrink-0 rounded-[1px]"
              >
                <span>Join</span>
                <ArrowRightIcon size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-14 border-b border-[#1a1a1a]">
          {/* Col 1: Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#666666] mb-4">
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
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#666666] mb-4">
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
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#666666] mb-4">
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
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#666666] mb-4">
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
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#666666]">
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
