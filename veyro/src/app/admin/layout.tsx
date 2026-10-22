"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MotionConfig } from "motion/react";
import { useAdmin } from "@/context/AdminContext";
import { useUser } from "@/context/UserContext";
import { plusJakarta, inter } from "./fonts";
import {
  LayoutGrid,
  Package,
  PlusCircle,
  ShoppingCart,
  RotateCcw,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Layers,
  Store,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { AdminTooltip } from "@/components/admin/AdminTooltip";
import { VeyroMark } from "@/components/ui/Logo";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/products/add", label: "Add Product", icon: PlusCircle, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: true },
  { href: "/admin/returns", label: "Returns", icon: RotateCcw, exact: false },
  { href: "/admin/custom-sections", label: "Custom Sections", icon: Layers, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isHydrated, adminLogout } = useAdmin();
  const { orders } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // SSR-safe localStorage restoration for expanded state (NO first-load animation)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("veyro_admin_sidebar_expanded");
      if (saved !== null) {
        setExpanded(saved === "true");
      }
    } catch {
      // ignore in environments without localStorage
    }
    // Enable animation only on next frame after initial render so refresh doesn't slide
    const raf = requestAnimationFrame(() => {
      setCanAnimate(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const toggleExpanded = () => {
    setIsAnimating(true);
    setExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("veyro_admin_sidebar_expanded", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const pendingReturnsCount = useMemo(() => {
    return (orders || []).filter(
      (o) => o.returnRequest && o.returnRequest.status === "pending"
    ).length;
  }, [orders]);

  // Auth guard — redirect non-admins to login safely inside useEffect
  useEffect(() => {
    if (isHydrated && !isAdmin && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [isHydrated, isAdmin, pathname, router]);

  // Ensure body inherits admin-theme for Radix/shadcn portals (Dialog, Select, Popover)
  useEffect(() => {
    document.body.classList.add("admin-theme");
    return () => {
      document.body.classList.remove("admin-theme");
    };
  }, []);

  // Login page — no sidebar, just render children
  if (pathname === "/admin/login") {
    return (
      <div
        className={`${plusJakarta.variable} ${inter.variable} admin-theme fixed inset-0 z-[9999] bg-[#0D0D11] text-white overflow-y-auto admin-scroll font-sans`}
        data-lenis-prevent
      >
        {children}
      </div>
    );
  }

  // Wait for hydration before checking auth
  if (!isHydrated) {
    return (
      <div className={`${plusJakarta.variable} ${inter.variable} admin-theme fixed inset-0 z-[9999] bg-[#0D0D11] flex items-center justify-center font-sans`}>
        <div className="text-[#71717A] text-sm font-medium">Loading...</div>
      </div>
    );
  }

  // Auth guard — render splash while useEffect performs redirect
  if (!isAdmin) {
    return (
      <div className={`${plusJakarta.variable} ${inter.variable} admin-theme fixed inset-0 z-[9999] bg-[#0D0D11] flex items-center justify-center font-sans`}>
        <div className="text-[#71717A] text-sm font-medium">Redirecting to login...</div>
      </div>
    );
  }

  const checkActive = (item: (typeof NAV_ITEMS)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href) && !pathname.includes("/add");

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`${plusJakarta.variable} ${inter.variable} admin-theme fixed inset-0 z-[9999] flex bg-[#0D0D11] text-white h-screen h-[100dvh] max-h-screen overflow-hidden select-auto font-sans`}
        data-lenis-prevent
      >
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Expandable/Collapsible Sidebar (68px <-> 240px Desktop / Slide-out Mobile) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 h-full max-h-screen bg-[#09090C] border-r border-white/5 flex flex-col flex-shrink-0 select-none overflow-hidden motion-reduce:transition-none antialiased
          ${canAnimate ? "admin-sidebar-animate" : ""}
          ${isAnimating ? "will-change-[width]" : ""}
          ${
            mobileOpen
              ? "w-64 translate-x-0"
              : `-translate-x-full lg:translate-x-0 ${expanded ? "lg:w-[240px]" : "lg:w-[68px]"}`
          }`}
        role="navigation"
        aria-label="Admin navigation"
        data-lenis-prevent
        onTransitionEnd={(e) => {
          if (e.target === e.currentTarget && e.propertyName === "width") {
            setIsAnimating(false);
          }
        }}
      >
        {/* Fixed 240px inner container ensures layout never reflows while outer width animates */}
        <div className="w-[240px] h-full flex flex-col flex-shrink-0">
          {/* Top: Logo Squircle (fixed 44px slot centered at 34px) + Expandable VEYRO Wordmark */}
          <div className="h-20 flex items-center px-3 flex-shrink-0 relative">
            <Link
              href="/admin"
              className="flex items-center group cursor-pointer"
              aria-label="VEYRO Admin Home"
            >
              {/* 44px icon slot centered at 34px (12px padding + 22px) */}
              <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                <div className="w-11 h-11 bg-[#17171C] border border-white/10 rounded-[14px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] flex items-center justify-center shrink-0 select-none">
                  <VeyroMark className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Wordmark: fades in with 60ms delay on expand, fades out immediately with 0 delay on collapse */}
              <div
                className={`ml-3 whitespace-nowrap overflow-hidden transition-opacity motion-reduce:transition-none ${
                  expanded || mobileOpen
                    ? "opacity-100 duration-200 delay-[60ms]"
                    : "opacity-0 duration-150 delay-0 pointer-events-none"
                }`}
              >
                <span className="font-heading font-extrabold text-[15px] tracking-[0.22em] uppercase text-white leading-none block">
                  VEYRO
                </span>
                <span className="text-[9.5px] font-semibold tracking-[0.25em] uppercase text-[#71717A] leading-none block mt-1">
                  ADMIN
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            {mobileOpen && (
              <button
                className="lg:hidden ml-auto p-1.5 text-[#71717A] hover:text-white rounded-lg cursor-pointer"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Center: Navigation Items */}
          <nav className="flex-1 min-h-0 py-3 px-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden admin-scroll w-full">
            {NAV_ITEMS.map((item) => {
              const active = checkActive(item);
              const isFullWidth = expanded || mobileOpen;

              return (
                <AdminTooltip
                  key={item.href}
                  content={item.label}
                  enabled={!isFullWidth && !isAnimating}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`relative flex items-center h-11 rounded-[14px] cursor-pointer motion-reduce:transition-none ${
                      canAnimate ? "admin-sidebar-item-animate" : ""
                    } ${isFullWidth ? "w-full" : "w-11"} ${
                      active
                        ? "bg-[#24242A] text-white ring-1 ring-white/10 font-bold"
                        : "text-[#71717A] hover:text-white hover:bg-white/5 font-medium"
                    }`}
                    aria-current={active ? "page" : undefined}
                    aria-label={item.label}
                  >
                    {/* 3px Violet indicator bar on left edge */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#7C3AED]" />
                    )}

                    {/* Fixed 44px icon slot centered at 34px (12px padding + 22px = 34px) */}
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center relative">
                      <item.icon
                        size={19}
                        strokeWidth={active ? 2.3 : 1.8}
                        className={`shrink-0 transition-colors ${
                          active ? "text-white" : "text-[#71717A]"
                        }`}
                      />

                      {/* Collapsed red dot: cross-fades with the expanded pill */}
                      {item.href === "/admin/returns" && pendingReturnsCount > 0 && (
                        <span
                          className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF4B55] ring-2 ring-[#09090C] pointer-events-none transition-opacity motion-reduce:transition-none ${
                            isFullWidth
                              ? "opacity-0 duration-150 delay-0"
                              : "opacity-100 duration-200 delay-[60ms]"
                          }`}
                        />
                      )}
                    </div>

                    {/* Expanded Label: fades in with 60ms delay, fades out immediately with 0 delay */}
                    <span
                      className={`text-xs tracking-tight whitespace-nowrap overflow-hidden transition-opacity motion-reduce:transition-none ${
                        isFullWidth
                          ? "opacity-100 duration-200 delay-[60ms]"
                          : "opacity-0 duration-150 delay-0 pointer-events-none"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Expanded Returns pill: cross-fades with the collapsed dot */}
                    {item.href === "/admin/returns" && pendingReturnsCount > 0 && (
                      <span
                        className={`ml-auto mr-2 px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[#FF4B55] text-white tabular-nums shrink-0 transition-opacity motion-reduce:transition-none ${
                          isFullWidth
                            ? "opacity-100 duration-200 delay-[60ms]"
                            : "opacity-0 duration-150 delay-0 pointer-events-none"
                        }`}
                      >
                        {pendingReturnsCount}
                      </span>
                    )}
                  </Link>
                </AdminTooltip>
              );
            })}
          </nav>

          {/* Bottom: Utility Actions & ONE Collapse Toggle */}
          <div className="p-3 border-t border-white/5 flex flex-col gap-1.5 flex-shrink-0 w-full overflow-hidden">
            {/* Back to store */}
            <AdminTooltip content="Back to Store" enabled={!expanded && !mobileOpen && !isAnimating}>
              <Link
                href="/"
                className={`relative flex items-center h-11 rounded-[14px] text-[#71717A] hover:text-white hover:bg-white/5 transition-colors cursor-pointer motion-reduce:transition-none ${
                  canAnimate ? "admin-sidebar-item-animate" : ""
                } ${expanded || mobileOpen ? "w-full" : "w-11"}`}
                aria-label="Back to Store"
              >
                <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                  <Store size={18} strokeWidth={1.8} className="shrink-0" />
                </div>
                <span
                  className={`text-xs font-medium text-zinc-300 whitespace-nowrap overflow-hidden transition-opacity motion-reduce:transition-none ${
                    expanded || mobileOpen
                      ? "opacity-100 duration-200 delay-[60ms]"
                      : "opacity-0 duration-150 delay-0 pointer-events-none"
                  }`}
                >
                  Back to Store
                </span>
              </Link>
            </AdminTooltip>

            {/* Logout button */}
            <AdminTooltip content="Logout" enabled={!expanded && !mobileOpen && !isAnimating}>
              <button
                type="button"
                onClick={() => {
                  adminLogout();
                  router.push("/admin/login");
                }}
                className={`relative flex items-center h-11 rounded-[14px] text-[#71717A] hover:text-[#FF4B55] hover:bg-[#FF4B55]/10 transition-colors cursor-pointer text-left motion-reduce:transition-none ${
                  canAnimate ? "admin-sidebar-item-animate" : ""
                } ${expanded || mobileOpen ? "w-full" : "w-11"}`}
                aria-label="Logout"
              >
                <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                  <LogOut size={18} strokeWidth={1.8} className="shrink-0" />
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap overflow-hidden transition-opacity motion-reduce:transition-none ${
                    expanded || mobileOpen
                      ? "opacity-100 duration-200 delay-[60ms]"
                      : "opacity-0 duration-150 delay-0 pointer-events-none"
                  }`}
                >
                  Logout
                </span>
              </button>
            </AdminTooltip>

            {/* ONE Toggle Button at the bottom (Desktop only) */}
            <div className="hidden lg:block pt-1 border-t border-white/5">
              <AdminTooltip content="Expand sidebar" enabled={!expanded && !isAnimating}>
                <button
                  type="button"
                  onClick={toggleExpanded}
                  className={`relative flex items-center h-11 rounded-[14px] text-[#71717A] hover:text-white hover:bg-white/5 cursor-pointer motion-reduce:transition-none ${
                    canAnimate ? "admin-sidebar-item-animate" : ""
                  } ${expanded ? "w-full" : "w-11"}`}
                  aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                    <ChevronsRight
                      size={18}
                      className={`shrink-0 text-zinc-400 transition-transform duration-250 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
                        expanded ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-medium text-zinc-400 whitespace-nowrap overflow-hidden transition-opacity motion-reduce:transition-none ${
                      expanded
                        ? "opacity-100 duration-200 delay-[60ms]"
                        : "opacity-0 duration-150 delay-0 pointer-events-none"
                    }`}
                  >
                    Collapse sidebar
                  </span>
                </button>
              </AdminTooltip>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full max-h-screen overflow-hidden bg-[#0D0D11]">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#09090C] text-white border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 text-white hover:text-white/80 cursor-pointer rounded-lg hover:bg-white/5"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <span className="font-heading tracking-[0.2em] text-sm text-white font-extrabold uppercase leading-none">
              VEYRO
            </span>
          </div>
        </header>

        {/* Page content with independent scrolling */}
        <main
          className="flex-1 min-h-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 overscroll-contain admin-scroll focus:outline-none bg-[#0D0D11] text-white"
          data-lenis-prevent
          tabIndex={0}
        >
          <div className="max-w-[1520px] mx-auto pb-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  </MotionConfig>
);
}
