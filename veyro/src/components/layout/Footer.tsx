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
    <footer className="w-full bg-[#0d0d0d] text-white pt-16 sm:pt-20 pb-12 border-t border-[#222222]">
      <Container>
        {/* Newsletter & Brand Statement Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 pb-16 border-b border-[#222222]">
          {/* Brand Vision */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Logo height={32} className="text-white brightness-200 invert" />
              </div>
              <p className="mt-5 text-sm sm:text-base text-[#999999] leading-relaxed max-w-md font-light">
                Modern Indian men&apos;s D2C fashion. Engineered with architectural cuts,
                durable 240+ GSM combed cotton, and vulcanized footwear silhouettes built
                for the daily uniform.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <span className="text-xs font-semibold tracking-widest text-veyro-accent uppercase">
                MADE IN INDIA • GLOBAL STANDARD
              </span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 flex flex-col justify-center bg-[#161616] p-6 sm:p-8 rounded-[2px] border border-[#262626]">
            <span className="text-xs font-semibold tracking-wider text-veyro-accent uppercase">
              THE VEYRO CLUB
            </span>
            <h3 className="mt-1 text-lg sm:text-xl font-semibold tracking-tight text-white">
              Unlock 10% off your inaugural order
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#888888]">
              Be the first to access limited batch drops, fit archives, and members-only releases.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex flex-col sm:flex-row gap-2.5 w-full"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-[#202020] border border-[#333333] px-4 py-3 text-sm text-white placeholder-[#666666] rounded-[2px] focus:outline-none focus:border-veyro-accent transition-colors"
                required
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-veyro-accent text-[#111111] px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-[2px] hover:bg-yellow-300 transition-colors cursor-pointer shrink-0"
              >
                <span>Join Club</span>
                <ArrowRightIcon size={14} />
              </button>
            </form>
            <span className="mt-3 text-[11px] text-[#555555]">
              Zero spam. Unsubscribe anytime.
            </span>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 py-14 border-b border-[#222222]">
          {/* Col 1: Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#666666] mb-4">
              Shop Catalogue
            </h4>
            <ul className="space-y-2.5 text-sm text-[#aaaaaa]">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-veyro-accent hover:translate-x-0.5 inline-block transition-transform duration-150"
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
              The Brand
            </h4>
            <ul className="space-y-2.5 text-sm text-[#aaaaaa]">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-veyro-accent hover:translate-x-0.5 inline-block transition-transform duration-150"
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
              Assistance
            </h4>
            <ul className="space-y-2.5 text-sm text-[#aaaaaa]">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-veyro-accent hover:translate-x-0.5 inline-block transition-transform duration-150"
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
              Headquarters
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
