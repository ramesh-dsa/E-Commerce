"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { useUser } from "@/context/UserContext";
import {
  Home,
  Package,
  PlusCircle,
  ShoppingCart,
  RotateCcw,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: Home, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/products/add", label: "Add Product", icon: PlusCircle, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: true },
  { href: "/admin/returns", label: "Returns", icon: RotateCcw, exact: false },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isHydrated, adminLogout } = useAdmin();
  const { orders } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const pendingReturnsCount = useMemo(() => {
    return (orders || []).filter(
      (o) => o.returnRequest && o.returnRequest.status === "pending"
    ).length;
  }, [orders]);

  // Login page — no sidebar, just render children
  if (pathname === "/admin/login") {
    return (
      <div
        className="fixed inset-0 z-[9999] bg-veyro-black overflow-y-auto admin-scroll-container"
        data-lenis-prevent
      >
        {children}
      </div>
    );
  }

  // Wait for hydration before checking auth
  if (!isHydrated) {
    return (
      <div className="fixed inset-0 z-[9999] bg-veyro-black flex items-center justify-center">
        <div className="text-veyro-muted text-sm">Loading...</div>
      </div>
    );
  }

  // Auth guard — redirect non-admins to login
  if (!isAdmin) {
    if (typeof window !== "undefined") router.replace("/admin/login");
    return (
      <div className="fixed inset-0 z-[9999] bg-veyro-black flex items-center justify-center">
        <div className="text-veyro-muted text-sm">Redirecting to login...</div>
      </div>
    );
  }

  const checkActive = (item: (typeof NAV_ITEMS)[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href) && !pathname.includes("/add");

  return (
    <div
      className="fixed inset-0 z-[9999] flex bg-veyro-surface h-screen h-[100dvh] max-h-screen overflow-hidden select-auto"
      data-lenis-prevent
    >
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[260px] h-full max-h-screen bg-veyro-black text-white flex flex-col flex-shrink-0
          transform transition-transform duration-200 ease-out lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="navigation"
        aria-label="Admin navigation"
        data-lenis-prevent
      >
        {/* Logo */}
        <div className="pt-7 pb-6 px-5 border-b border-white/[0.08] relative flex flex-col items-center justify-center flex-shrink-0 text-center">
          <Link href="/admin" className="group flex flex-col items-center justify-center py-1">
            <span className="text-xl sm:text-2xl font-serif tracking-[0.28em] text-white font-normal uppercase leading-none group-hover:text-amber-200 transition-colors">
              VEYRO
            </span>
          </Link>
          <button
            className="lg:hidden absolute right-4 top-7 p-1 text-neutral-400 hover:text-white cursor-pointer"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 min-h-0 p-3.5 space-y-2 overflow-y-auto admin-scroll-container">
          {NAV_ITEMS.map((item) => {
            const active = checkActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-[14px] text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[#fde047] text-black shadow-[0_0_24px_rgba(253,224,71,0.42)] font-bold scale-[1.01]"
                    : "text-neutral-400 hover:text-white hover:bg-white/[0.06] font-medium"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <item.icon
                  size={19}
                  strokeWidth={active ? 2.4 : 2}
                  className={active ? "text-black shrink-0" : "text-neutral-400 group-hover:text-white shrink-0 transition-colors"}
                />
                <span className={active ? "text-black tracking-tight" : "tracking-tight"}>
                  {item.label}
                </span>
                {item.href === "/admin/returns" && pendingReturnsCount > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-full text-[10.5px] font-extrabold ${
                      active
                        ? "bg-black text-[#fde047]"
                        : "bg-amber-400 text-black shadow-xs"
                    }`}
                  >
                    {pendingReturnsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3.5 border-t border-white/[0.08] space-y-1.5 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.06] rounded-xl transition-all"
          >
            <ArrowLeft size={15} />
            <span>Back to Store</span>
          </Link>
          <button
            onClick={() => {
              adminLogout();
              router.push("/admin/login");
            }}
            className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all w-full text-left cursor-pointer"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full max-h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#0d0d0d] text-white border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1 text-white hover:text-amber-300 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <div className="flex flex-col">
              <span className="font-serif tracking-[0.25em] text-sm text-white font-normal uppercase leading-none">
                VEYRO
              </span>
            </div>
          </div>
        </header>

        {/* Page content with independent scrolling */}
        <main
          className="flex-1 min-h-0 h-full overflow-y-auto overflow-x-hidden p-4 lg:p-8 overscroll-contain admin-scroll-container focus:outline-none bg-[#f8f9fa]"
          data-lenis-prevent
          tabIndex={0}
        >
          <div className="max-w-7xl mx-auto pb-24">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
