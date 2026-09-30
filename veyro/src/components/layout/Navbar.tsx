"use client";

import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { AnnouncementBar } from "./AnnouncementBar";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useUser } from "@/context/UserContext";
import { ProductSearch } from "@/components/features/ProductSearch";
import { products } from "@/data/products";

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

  // Auto-close dropdown on route change
  useEffect(() => {
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    setIsProfileDropdownOpen(false);
    logout();
    setSignOutNotice("Signed out of VEYRO Vault");
    setTimeout(() => {
      setSignOutNotice(null);
    }, 2500);
  };

  // Detect product category when on a PDP (/product/[slug])
  const productSlug = pathname.startsWith("/product/") ? pathname.split("/product/")[1]?.split("?")[0] : null;
  const currentProduct = productSlug ? products.find((p) => p.slug === productSlug) : null;
  const isShoeProduct =
    Boolean(currentProduct && (
      currentProduct.category?.toLowerCase() === "footwear" ||
      currentProduct.subcategory?.toLowerCase() === "shoes" ||
      currentProduct.id.startsWith("vey-ftw")
    ));
  const isClothingProduct =
    Boolean(currentProduct && (
      currentProduct.category?.toLowerCase() === "clothing" ||
      currentProduct.subcategory?.toLowerCase() === "t-shirts" ||
      currentProduct.id.startsWith("vey-tsh")
    ));
  const isWatchProduct =
    Boolean(currentProduct && (
      currentProduct.category?.toLowerCase() === "watches" ||
      currentProduct.subcategory?.toLowerCase() === "timepieces" ||
      currentProduct.id.startsWith("vey-wat")
    ));

  useEffect(() => {
    if (pathname === "/") {
      setActiveNav("HOME");
    } else if (pathname === "/clothing" || isClothingProduct) {
      setActiveNav("CLOTHING");
    } else if (pathname === "/shoes" || pathname === "/footwear" || isShoeProduct) {
      setActiveNav("SHOES");
    } else if (pathname === "/watches" || isWatchProduct) {
      setActiveNav("WATCHES");
    } else if (pathname === "/collections") {
      setActiveNav("COLLECTIONS");
    }
  }, [pathname, isClothingProduct, isShoeProduct, isWatchProduct]);

  const navLinks = [
    {
      label: "HOME",
      href: "/",
      isActive: pathname === "/" && activeNav === "HOME",
    },
    {
      label: "CLOTHING",
      href: "/clothing",
      isActive: pathname === "/clothing" || isClothingProduct || (pathname === "/" && activeNav === "CLOTHING"),
    },
    {
      label: "SHOES",
      href: "/shoes",
      isActive: pathname === "/shoes" || pathname === "/footwear" || isShoeProduct || (pathname === "/" && activeNav === "SHOES"),
    },
    {
      label: "WATCHES",
      href: "/watches",
      isActive: pathname === "/watches" || isWatchProduct || (pathname === "/" && activeNav === "WATCHES"),
    },
    {
      label: "COLLECTIONS",
      href: "/collections",
      isActive: pathname === "/collections" || (pathname === "/" && activeNav === "COLLECTIONS"),
    },
  ];

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-30 w-full bg-white">
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
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
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

      {/* Mobile Search Dropdown Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-[#f0f0ed] bg-[#fafafa] px-4 py-3 transition-all">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ProductSearch
                autoFocus
                isMobile
                onClose={() => setMobileSearchOpen(false)}
                inputClassName="bg-white border-neutral-300"
              />
            </div>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-neutral-500 hover:text-black cursor-pointer shrink-0"
            >
              <CloseIcon size={20} />
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

            {/* Bottom Account & Wishlist Row */}
            <div className="border-t border-neutral-200 pt-4 space-y-1">
              {user ? (
                <div className="space-y-1">
                  {/* User Profile Summary */}
                  <div className="p-3 bg-veyro-surface border border-veyro-border rounded-[2px] flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[2px] bg-veyro-black text-white text-[11px] font-mono font-bold flex items-center justify-center">
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
                      <Package size={18} className="text-veyro-black" />
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
                      <LucideUser size={18} className="text-veyro-black" />
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
                      <HeartIcon size={18} />
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
                    className="flex items-center gap-3 w-full text-xs font-semibold text-neutral-600 hover:text-red-600 py-2 cursor-pointer pt-2.5 border-t border-neutral-200"
                  >
                    <LogOut size={15} />
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
                      <HeartIcon size={19} />
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
                      <UserIcon size={19} />
                      <span>My Account / Sign In</span>
                    </div>
                    <span className="text-xs text-veyro-muted">→</span>
                  </button>
                </>
              )}

              <div className="mt-4 p-3 bg-veyro-yellow/20 border border-veyro-yellow rounded-[2px] text-xs font-medium text-veyro-black">
                Enjoy Free Shipping on orders above ₹999
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Sign Out Feedback Pill */}
      {signOutNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-24 right-6 z-50 bg-neutral-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200 motion-reduce:animate-none"
        >
          <Check size={14} className="text-emerald-400" />
          <span>{signOutNotice}</span>
        </div>
      )}
      </header>
    </>
  );
}
