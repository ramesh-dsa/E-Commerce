"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  ShoppingCartIcon,
  MenuIcon,
  CloseIcon,
} from "@/components/ui/Icons";
import {
  Package,
  MapPin,
  Heart,
  LogOut,
  ChevronRight,
  Check,
  User as LucideUser,
  Shield,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Toast } from "@/components/ui/Toast";
import { AnnouncementBar } from "./AnnouncementBar";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/context/UserContext";
import { useProducts } from "@/context/ProductsContext";
import { useCustomSections } from "@/context/CustomSectionsContext";
import { ProductSearch } from "@/components/features/ProductSearch";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("HOME");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [signOutNotice, setSignOutNotice] = useState<string | null>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const { totalItems, openCart } = useCart();
  const { totalWishlistItems, openWishlist } = useWishlist();
  const { user, orders, openAccountModal, logout } = useUser();
  const { products } = useProducts();
  const { sections: customSections } = useCustomSections();
  const activeCustomSections = customSections.filter((s) => s.isActive);

  const activeOrdersCount = orders ? orders.filter((o) => o.status !== "Delivered").length : 0;

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    if (!isProfileDropdownOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileDropdownOpen]);

  // Auto-close dropdown & mobile menu on route change
  useEffect(() => {
    setIsProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  // Lock background website scrolling when mobile drawer or mobile search is open
  useEffect(() => {
    if (mobileMenuOpen || mobileSearchOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalDocOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
      };
    }
  }, [mobileMenuOpen, mobileSearchOpen]);

  const handleSignOut = () => {
    setIsProfileDropdownOpen(false);
    logout();
    setSignOutNotice("Signed out of VEYRO Vault");
    setTimeout(() => {
      setSignOutNotice(null);
    }, 2500);
  };

  // Detect product category when on a PDP (/product/[slug])
  const productSlug = pathname.startsWith("/product/")
    ? decodeURIComponent(pathname.split("/product/")[1]?.split("?")[0]?.replace(/\/$/, "") || "")
    : null;
  const currentProduct = productSlug ? products.find((p) => p.slug === productSlug || p.id === productSlug) : null;

  // Detect if current PDP product belongs to any dynamic custom section (e.g. BAGS, ACCESSORIES)
  const matchingCustomSection = useMemo(() => {
    if (!productSlug) return null;

    // 1. Direct search inside active custom section products
    for (const sec of activeCustomSections) {
      const hasProduct = sec.products?.some(
        (p) =>
          p.slug === productSlug ||
          p.id === productSlug ||
          p.slug.toLowerCase() === productSlug.toLowerCase() ||
          p.id.toLowerCase() === productSlug.toLowerCase()
      );
      if (hasProduct) return sec;
    }

    // 2. Fallback check: If product is also in ProductsContext with matching category/collections
    if (currentProduct) {
      for (const sec of activeCustomSections) {
        const nameLower = sec.name.trim().toLowerCase();
        const slugLower = sec.slug.trim().toLowerCase();
        if (
          currentProduct.category?.trim().toLowerCase() === nameLower ||
          currentProduct.subcategory?.trim().toLowerCase() === nameLower ||
          currentProduct.category?.trim().toLowerCase() === slugLower ||
          currentProduct.collections?.some((c) => c.trim().toLowerCase() === nameLower)
        ) {
          return sec;
        }
      }
    }

    return null;
  }, [productSlug, activeCustomSections, currentProduct]);

  const isShoeProduct =
    Boolean(!matchingCustomSection && currentProduct && (
      currentProduct.category?.toLowerCase() === "footwear" ||
      currentProduct.subcategory?.toLowerCase() === "shoes" ||
      currentProduct.id.startsWith("vey-ftw")
    ));
  const isClothingProduct =
    Boolean(!matchingCustomSection && currentProduct && (
      currentProduct.category?.toLowerCase() === "clothing" ||
      currentProduct.subcategory?.toLowerCase() === "t-shirts" ||
      currentProduct.id.startsWith("vey-tsh")
    ));
  const isWatchProduct =
    Boolean(!matchingCustomSection && currentProduct && (
      currentProduct.category?.toLowerCase() === "watches" ||
      currentProduct.subcategory?.toLowerCase() === "timepieces" ||
      currentProduct.id.startsWith("vey-wat")
    ));

  useEffect(() => {
    if (pathname === "/") {
      setActiveNav("HOME");
    } else if (matchingCustomSection) {
      setActiveNav(matchingCustomSection.name.toUpperCase());
    } else if (pathname === "/clothing" || isClothingProduct) {
      setActiveNav("CLOTHING");
    } else if (pathname === "/shoes" || pathname === "/footwear" || isShoeProduct) {
      setActiveNav("SHOES");
    } else if (pathname === "/watches" || isWatchProduct) {
      setActiveNav("WATCHES");
    } else if (pathname === "/collections") {
      setActiveNav("COLLECTIONS");
    } else {
      // Check custom sections catalog page (/section/[slug])
      const matchedCustom = activeCustomSections.find((s) => pathname === `/section/${s.slug}`);
      if (matchedCustom) {
        setActiveNav(matchedCustom.name.toUpperCase());
      }
    }
  }, [
    pathname,
    matchingCustomSection,
    isClothingProduct,
    isShoeProduct,
    isWatchProduct,
    activeCustomSections,
  ]);

  const navLinks = [
    {
      label: "HOME",
      href: "/",
      isActive: pathname === "/" && activeNav === "HOME",
    },
    {
      label: "CLOTHING",
      href: "/clothing",
      isActive:
        !matchingCustomSection &&
        (pathname === "/clothing" || isClothingProduct || (pathname === "/" && activeNav === "CLOTHING")),
    },
    {
      label: "SHOES",
      href: "/shoes",
      isActive:
        !matchingCustomSection &&
        (pathname === "/shoes" || pathname === "/footwear" || isShoeProduct || (pathname === "/" && activeNav === "SHOES")),
    },
    {
      label: "WATCHES",
      href: "/watches",
      isActive:
        !matchingCustomSection &&
        (pathname === "/watches" || isWatchProduct || (pathname === "/" && activeNav === "WATCHES")),
    },
    // Dynamic custom section links (e.g. BAGS, ACCESSORIES)
    ...activeCustomSections.map((section) => ({
      label: section.name.toUpperCase(),
      href: `/section/${section.slug}`,
      isActive:
        pathname === `/section/${section.slug}` ||
        matchingCustomSection?.id === section.id ||
        (pathname === "/" && activeNav === section.name.toUpperCase()),
    })),
    // COLLECTIONS is ALWAYS LAST as requested
    {
      label: "COLLECTIONS",
      href: "/collections",
      isActive:
        !matchingCustomSection &&
        (pathname === "/collections" || (pathname === "/" && activeNav === "COLLECTIONS")),
    },
  ];

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-50 w-full bg-white">
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
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("veyro_is_back_nav");
              }
            }}
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
              const isActive = link.isActive;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActiveNav(link.label);
                    if (typeof window !== "undefined") {
                      sessionStorage.removeItem("veyro_is_back_nav");
                      if (link.href === "/shoes" || link.href === "/footwear") {
                        sessionStorage.removeItem("veyro_scroll_/shoes");
                        sessionStorage.removeItem("veyro_scroll_/footwear");
                      } else if (link.href === "/clothing") {
                        sessionStorage.removeItem("veyro_scroll_/clothing");
                      } else if (link.href === "/watches") {
                        sessionStorage.removeItem("veyro_scroll_/watches");
                      } else if (link.href === "/collections") {
                        sessionStorage.removeItem("veyro_scroll_/collections");
                      }
                    }
                    if (link.href === "/" && pathname === "/") {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
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
          <div className="hidden md:block w-[270px] lg:w-[320px] xl:w-[360px]">
            <ProductSearch />
          </div>

          {/* Mobile Search Toggle Icon */}
          <button
            type="button"
            aria-label="Search"
            onClick={() => setMobileSearchOpen(true)}
            className="flex md:hidden p-1.5 text-[#111111] hover:text-[#555555] transition-colors cursor-pointer"
          >
            <SearchIcon size={21} />
          </button>

          {/* Outline Icons Group with 20-24px spacing */}
          <div className="flex items-center gap-5 xl:gap-[24px]">
            {/* Account Icon Button & Floating Dropdown */}
            <div className="relative hidden sm:flex items-center" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  if (user) {
                    setIsProfileDropdownOpen((prev) => !prev);
                  } else {
                    openAccountModal();
                  }
                }}
                aria-expanded={user ? isProfileDropdownOpen : undefined}
                aria-haspopup={user ? "menu" : undefined}
                aria-label={user ? `Account menu for ${user.name}` : "My Account / Sign In"}
                className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer hover:bg-neutral-100 ${
                  user && isProfileDropdownOpen ? "bg-neutral-100 text-black" : "text-[#111111] hover:text-black"
                }`}
              >
                <UserIcon size={21} />
              </button>

              {/* Authenticated Profile Dropdown Popup */}
              {user && isProfileDropdownOpen && (
                <div
                  role="menu"
                  aria-label="User account menu"
                  className="absolute right-0 top-full mt-2.5 w-72 rounded-xl bg-white border border-neutral-200/80 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.12),0_4px_12px_-2px_rgba(0,0,0,0.04)] z-50 p-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
                >
                  {/* User Header */}
                  <div className="px-3.5 py-3 border-b border-neutral-100 mb-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-neutral-900 truncate">
                        {user.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Item 1: My Orders */}
                  <Link
                    href="/orders"
                    role="menuitem"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
                        <Package size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-neutral-900">
                          My Orders
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {activeOrdersCount > 0
                            ? `${activeOrdersCount} active order${activeOrdersCount > 1 ? "s" : ""}`
                            : "Track & view history"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </Link>

                  {/* Menu Item 2: My Profile */}
                  <Link
                    href="/account/addresses"
                    role="menuitem"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors shrink-0">
                        <LucideUser size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-neutral-900">
                          My Profile
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate">
                          Personal info & address
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </Link>

                  {/* Menu Item 3: Admin Portal */}
                  <Link
                    href="/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    role="menuitem"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#fcd017]/20 flex items-center justify-center text-neutral-900 group-hover:bg-[#fcd017] transition-colors shrink-0">
                        <Shield size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          Admin Portal
                          <span className="text-[9px] bg-neutral-900 text-[#fcd017] px-1.5 py-0.2 rounded font-mono font-bold">
                            STAFF
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 truncate">
                          Manage products, orders & sales
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-neutral-400 group-hover:text-neutral-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </Link>

                  {/* Divider */}
                  <div className="my-1 border-t border-neutral-100" />

                  {/* Menu Item 3: Sign Out */}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-neutral-600 hover:text-red-600 hover:bg-red-50/70 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${totalWishlistItems} items)`}
              className="group relative flex items-center text-[#111111] hover:text-black p-1 cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black motion-reduce:transform-none"
            >
              <HeartIcon size={21} className="transition-transform duration-200 ease-out group-hover:scale-105 motion-reduce:transform-none" />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fcd017] text-[#111111] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs ring-1.5 ring-white">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              href="/cart"
              aria-label={`Shopping Cart (${totalItems} items)`}
              className="group relative flex items-center text-[#111111] hover:text-black p-1 cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-0.5 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black motion-reduce:transform-none"
            >
              <ShoppingCartIcon size={21} className="transition-transform duration-200 ease-out group-hover:scale-105 motion-reduce:transform-none" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fcd017] text-[#111111] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs ring-1.5 ring-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      </header>

      {/* Full-Screen Mobile Search Modal (< 768px) */}
      {mobileSearchOpen && (
        <ProductSearch
          isMobile
          autoFocus
          onClose={() => setMobileSearchOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity overscroll-contain touch-none"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu (Pinned 3-row layout fitting 100dvh viewport) */}
          <div className="relative flex w-4/5 max-w-sm h-[100dvh] max-h-[100dvh] flex-col justify-between bg-white px-5 py-4 sm:p-6 shadow-xl z-10 overscroll-contain select-none">
            {/* 1. Pinned Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-200 shrink-0">
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

            {/* 2. Proportional Navigation Links */}
            <nav className="flex-1 flex flex-col justify-start min-h-0 pt-4 sm:pt-5 pb-2 divide-y divide-neutral-100 overflow-y-auto">
              {navLinks.map((link) => {
                const isActive = link.isActive;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      setActiveNav(link.label);
                      if (typeof window !== "undefined") {
                        sessionStorage.removeItem("veyro_is_back_nav");
                        if (link.href === "/shoes" || link.href === "/footwear") {
                          sessionStorage.removeItem("veyro_scroll_/shoes");
                          sessionStorage.removeItem("veyro_scroll_/footwear");
                        } else if (link.href === "/clothing") {
                          sessionStorage.removeItem("veyro_scroll_/clothing");
                        } else if (link.href === "/watches") {
                          sessionStorage.removeItem("veyro_scroll_/watches");
                        } else if (link.href === "/collections") {
                          sessionStorage.removeItem("veyro_scroll_/collections");
                        }
                      }
                      if (link.href === "/" && pathname === "/") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 sm:py-3 text-sm font-semibold tracking-wider uppercase text-[#111111] hover:text-neutral-500 transition-colors flex items-center justify-between"
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

            {/* 3. Pinned Bottom Account & Wishlist Row */}
            <div className="shrink-0 border-t border-neutral-200 pt-3 space-y-0.5">
              {user ? (
                <div className="space-y-0.5">
                  {/* User Profile Summary */}
                  <div className="p-2.5 bg-neutral-50 border border-neutral-200/80 rounded-lg flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-veyro-black text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {user.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-veyro-black uppercase truncate">{user.name}</div>
                        <div className="text-[10px] text-veyro-muted font-mono truncate">{user.email}</div>
                      </div>
                    </div>
                  </div>

                  {/* 1. My Orders */}
                  <Link
                    href="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between w-full text-sm font-medium text-veyro-black py-2 hover:text-black cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Package size={17} className="text-veyro-black" />
                      <span>My Orders</span>
                    </div>
                    <span className="text-xs font-mono text-veyro-muted">
                      {activeOrdersCount > 0 ? `${activeOrdersCount} active` : "→"}
                    </span>
                  </Link>

                  {/* 2. My Profile */}
                  <Link
                    href="/account/addresses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between w-full text-sm font-medium text-veyro-black py-2 hover:text-black cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <LucideUser size={17} className="text-veyro-black" />
                      <span>My Profile</span>
                    </div>
                    <span className="text-xs text-veyro-muted">→</span>
                  </Link>

                  {/* 3. My Wishlist */}
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between w-full text-sm font-medium text-veyro-black py-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <HeartIcon size={17} />
                      <span>My Wishlist</span>
                    </div>
                    {totalWishlistItems > 0 && (
                      <span className="bg-veyro-yellow text-veyro-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        {totalWishlistItems}
                      </span>
                    )}
                  </Link>

                  {/* 4. Sign Out */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-3 w-full text-xs font-semibold text-neutral-600 hover:text-red-600 py-1.5 cursor-pointer pt-2 border-t border-neutral-150 mt-1"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between w-full text-sm font-medium text-veyro-black py-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <HeartIcon size={18} />
                      <span>My Wishlist</span>
                    </div>
                    {totalWishlistItems > 0 && (
                      <span className="bg-veyro-yellow text-veyro-black text-[10px] font-black px-2 py-0.5 rounded-full">
                        {totalWishlistItems}
                      </span>
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAccountModal();
                    }}
                    className="flex items-center justify-between w-full text-sm font-medium text-veyro-black py-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <UserIcon size={18} />
                      <span>My Account / Sign In</span>
                    </div>
                    <span className="text-xs text-veyro-muted">→</span>
                  </button>
                </>
              )}

              {/* Admin Portal Shortcut (Opens in new tab) */}
              <div className="pt-2 mt-2 border-t border-neutral-100">
                <Link
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-neutral-600 hover:text-neutral-900 py-1.5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#fcd017]" />
                    <span>Admin Portal</span>
                    <span className="text-[9px] bg-neutral-900 text-[#fcd017] px-1.5 py-0.2 rounded font-mono font-bold">
                      STAFF
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Open ↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sign Out Feedback */}
      <Toast
        isOpen={Boolean(signOutNotice)}
        onClose={() => setSignOutNotice(null)}
        variant="success"
        position="top"
        message={<span>{signOutNotice}</span>}
      />
    </>
  );
}
