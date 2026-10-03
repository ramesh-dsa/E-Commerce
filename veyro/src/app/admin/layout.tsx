"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/products/add", label: "Add Product", icon: PlusCircle, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, isHydrated, adminLogout } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <div className="p-5 border-b border-white/10 flex items-center justify-between flex-shrink-0">
          <div>
            <div className="text-xl font-bold tracking-wider">VEYRO</div>
            <div className="text-[11px] text-veyro-yellow font-semibold tracking-widest mt-0.5">
              ADMIN PANEL
            </div>
          </div>
          <button
            className="lg:hidden p-1 text-veyro-muted hover:text-white"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 min-h-0 p-3 space-y-1 overflow-y-auto admin-scroll-container">
          {NAV_ITEMS.map((item) => {
            const active = checkActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${active
                    ? "bg-veyro-charcoal text-veyro-yellow"
                    : "text-veyro-muted hover:text-white hover:bg-white/5"
                  }`}
                aria-current={active ? "page" : undefined}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-3 border-t border-white/10 space-y-1 flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-xs text-veyro-muted hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Store
          </Link>
          <button
            onClick={() => {
              adminLogout();
              router.push("/admin/login");
            }}
            className="flex items-center gap-3 px-3 py-2 text-xs text-veyro-muted hover:text-white transition-colors w-full text-left"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-full max-h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 p-4 bg-white border-b border-veyro-border flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1 text-veyro-black"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold tracking-wider text-sm">VEYRO ADMIN</span>
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
