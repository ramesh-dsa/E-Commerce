"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  ShoppingBagIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { AnnouncementBar } from "./AnnouncementBar";

const searchPhrases = [
  "Search for products...",
  "Search for t-shirts...",
  "Search for shoes...",
  "Search for oversized tees...",
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("NEW ARRIVALS");

  const navLinks = [
    { label: "NEW ARRIVALS", href: "#" },
    { label: "CLOTHING", href: "#" },
    { label: "SHOES", href: "#" },
    { label: "COLLECTIONS", href: "#" },
  ];


  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typeSpeed = 80;
    const deleteSpeed = 40;
    const pauseTime = 2000;

    const currentPhrase = searchPhrases[currentPhraseIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentPhrase.substring(0, currentText.length - 1));
        }, deleteSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % searchPhrases.length);
        }, deleteSpeed);
      }
    } else {
      if (currentText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setCurrentText(currentPhrase.substring(0, currentText.length + 1));
        }, typeSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPhraseIndex, searchPhrases]);

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-30 w-full bg-white transition-all border-b border-[#f0f0ed]/70">
        {/* 100% Full-width Navbar with 48-56px desktop horizontal padding */}
      <div className="flex h-[74px] sm:h-[78px] lg:h-[82px] w-full items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-14">
        {/* Left: Brand Wordmark & Main Nav Links */}
        <div className="flex items-center">
          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex lg:hidden p-1.5 mr-3 text-[#111111] hover:text-[#555555] transition-colors cursor-pointer"
          >
            <MenuIcon size={24} />
          </button>

          {/* VEYRO Wordmark Logo Component - Pixel-perfect geometric vector matching reference */}
          <Link
            href="/"
            className="flex items-center select-none hover:opacity-95 transition-opacity shrink-0 py-1"
            aria-label="VEYRO Home"
          >
            <Logo height={29} className="sm:h-[31px] lg:h-[33px]" />
          </Link>

          {/* Desktop Navigation Links - positioned with 60-75px gap from logo */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-7 xl:gap-9 ml-12 xl:ml-16"
          >
            {navLinks.map((link) => {
              const isActive = activeNav === link.label;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveNav(link.label)}
                  aria-current={isActive ? "page" : undefined}
                  className="relative group inline-flex flex-col items-center pt-1 pb-[8px] text-[13.5px] xl:text-[14px] font-semibold tracking-[0.05em] uppercase text-[#111111] whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-[#fcd017] focus-visible:ring-offset-4 rounded-xs"
                >
                  <span>{link.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 w-full h-[2.5px] bg-[#fcd017] origin-left transition-transform duration-500 ease-out motion-reduce:transition-none pointer-events-none ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Large Pill Search Bar & Outline Icons */}
        <div className="flex items-center gap-6 xl:gap-7">
          {/* Large Pill Search Field (350-360px on large desktop, 44-46px height) */}
          <div className="hidden md:flex relative items-center w-[270px] lg:w-[320px] xl:w-[360px]">
            <span className="absolute left-4 text-[#888888] pointer-events-none">
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              aria-label="Search products"
              placeholder={currentText || " "}
              className="h-[44px] xl:h-[46px] w-full rounded-full bg-[#f0f0ee] pl-11 pr-5 text-[13px] font-normal text-[#111111] placeholder:text-[#999999] focus:bg-white focus:outline-none focus:ring-1 focus:ring-black/20 border-0 transition-all"
            />
          </div>

          {/* Mobile Search Toggle Icon */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="flex md:hidden p-1.5 text-[#111111] hover:text-[#555555] transition-colors cursor-pointer"
          >
            <SearchIcon size={21} />
          </button>

          {/* Outline Icons Group with 20-24px spacing */}
          <div className="flex items-center gap-5 xl:gap-[24px]">
            {/* Account Icon */}
            <Link
              href="#"
              aria-label="My Account"
              className="hidden sm:flex text-[#111111] hover:text-[#555555] transition-colors p-0.5"
            >
              <UserIcon size={21} />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="#"
              aria-label="Wishlist"
              className="flex text-[#111111] hover:text-[#555555] transition-colors p-0.5"
            >
              <HeartIcon size={21} />
            </Link>

            {/* Cart Icon */}
            <Link
              href="#"
              aria-label="Shopping Cart"
              className="flex text-[#111111] hover:text-[#555555] transition-colors p-0.5"
            >
              <ShoppingBagIcon size={21} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Search Dropdown Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-[#f0f0ed] bg-[#fafafa] px-4 py-3 transition-all">
          <div className="relative flex items-center">
            <span className="absolute left-4 text-[#888888]">
              <SearchIcon size={17} />
            </span>
            <input
              type="text"
              autoFocus
              placeholder={currentText || " "}
              className="h-11 w-full rounded-full bg-white pl-11 pr-10 text-xs text-[#111111] placeholder:text-[#999999] focus:outline-none border border-neutral-300 shadow-xs"
            />
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="absolute right-3.5 p-1 text-neutral-500 cursor-pointer"
            >
              <CloseIcon size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative flex w-4/5 max-w-sm flex-col bg-white p-6 shadow-xl z-10 justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-neutral-200">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="VEYRO Home"
                >
                  <Logo height={26} />
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-[#111111] hover:text-neutral-500 cursor-pointer"
                >
                  <CloseIcon size={22} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col py-6 divide-y divide-neutral-100">
                {navLinks.map((link) => {
                  const isActive = activeNav === link.label;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => {
                        setActiveNav(link.label);
                        setMobileMenuOpen(false);
                      }}
                      className="py-3.5 text-sm font-semibold tracking-wider uppercase text-[#111111] hover:text-neutral-500 transition-colors flex items-center justify-between"
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span className="relative">
                        {link.label}
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#fcd017]"
                          />
                        )}
                      </span>
                      <span className="text-xs text-neutral-400">→</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Account Row */}
            <div className="border-t border-neutral-200 pt-4">
              <Link
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-medium text-[#111111] py-2"
              >
                <UserIcon size={19} />
                <span>My Account / Sign In</span>
              </Link>
              <div className="mt-4 p-3 bg-[#fcd017]/25 border border-[#fcd017] rounded-[2px] text-xs font-medium text-[#111111]">
                Enjoy Free Shipping on orders above ₹999
              </div>
            </div>
          </div>
        </div>
      )}
      </header>
    </>
  );
}
