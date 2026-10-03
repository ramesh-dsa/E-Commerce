"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import type Lenis from "lenis";

interface SmoothScrollingProps {
  children: React.ReactNode;
}

function ScrollRestorationHandler() {
  const pathname = usePathname();
  const lenis = useLenis();
  const lenisRef = useRef<Lenis | undefined>(lenis);
  const isNavigatingRef = useRef(false);

  // Keep lenis reference fresh without re-triggering navigation effects
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // 1. Configure browser scroll restoration once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.history.scrollRestoration = "manual";

    const handlePopState = () => {
      sessionStorage.setItem("veyro_is_back_nav", "true");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // 2. Intercept product clicks on catalog pages to immediately capture exact scroll position
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isCatalog =
      pathname === "/shoes" ||
      pathname === "/footwear" ||
      pathname === "/clothing" ||
      pathname === "/watches" ||
      pathname === "/collections";

    const handleGlobalClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;

      if (isCatalog && href.startsWith("/product/")) {
        isNavigatingRef.current = true;
        const currentY =
          window.scrollY || (lenisRef.current ? lenisRef.current.scroll : 0);
        if (currentY > 0) {
          sessionStorage.setItem(
            `veyro_scroll_${pathname}`,
            Math.round(currentY).toString()
          );
        }
        sessionStorage.setItem("veyro_last_catalog", pathname);
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () =>
      document.removeEventListener("click", handleGlobalClick, {
        capture: true,
      });
  }, [pathname]);

  // 3. Keep track of current scroll position for catalog pages while scrolling
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isCatalog =
      pathname === "/shoes" ||
      pathname === "/footwear" ||
      pathname === "/clothing" ||
      pathname === "/watches" ||
      pathname === "/collections";

    if (!isCatalog) return;

    let scrollTimer: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      if (isNavigatingRef.current) return;

      // 🛑 Zero synchronous disk writes while the user is scrolling!
      // We only save the position 150ms AFTER they stop scrolling.
      if (scrollTimer) clearTimeout(scrollTimer);
      
      scrollTimer = setTimeout(() => {
        // If they clicked a product link while scrolling, the click handler already saved the position.
        if (!isNavigatingRef.current) {
          sessionStorage.setItem(
            `veyro_scroll_${pathname}`,
            Math.round(window.scrollY).toString()
          );
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // 4. Deterministic scroll handler on route change
  // Note: Only depends on [pathname] - NOT [lenis] - to prevent double-firing and wiping scroll!
  useEffect(() => {
    if (typeof window === "undefined") return;

    isNavigatingRef.current = false;

    const isCatalog =
      pathname === "/shoes" ||
      pathname === "/footwear" ||
      pathname === "/clothing" ||
      pathname === "/watches" ||
      pathname === "/collections";

    const isBackNav = sessionStorage.getItem("veyro_is_back_nav") === "true";

    // Consume the flag right away
    if (isBackNav) {
      sessionStorage.removeItem("veyro_is_back_nav");
    }

    // CASE A: Back navigation to a catalog page -> RESTORE PREVIOUS SCROLL POSITION
    if (isBackNav && isCatalog) {
      const savedYStr = sessionStorage.getItem(`veyro_scroll_${pathname}`);
      const targetY = savedYStr ? parseFloat(savedYStr) : 0;

      if (targetY > 0) {
        let isCancelled = false;
        let rafId = 0;
        let retryCount = 0;
        const MAX_RETRIES = 8;

        const cancelOnUserInteraction = () => {
          isCancelled = true;
          window.removeEventListener("wheel", cancelOnUserInteraction);
          window.removeEventListener("touchstart", cancelOnUserInteraction);
          window.removeEventListener("keydown", cancelOnUserInteraction);
        };

        window.addEventListener("wheel", cancelOnUserInteraction, {
          passive: true,
          once: true,
        });
        window.addEventListener("touchstart", cancelOnUserInteraction, {
          passive: true,
          once: true,
        });
        window.addEventListener("keydown", cancelOnUserInteraction, {
          passive: true,
          once: true,
        });

        // Single RAF loop replaces the 7-step setTimeout cascade.
        // Checks the cancelled flag each iteration so user input instantly wins.
        const restoreLoop = () => {
          if (isCancelled || retryCount >= MAX_RETRIES) return;
          retryCount++;

          const l = lenisRef.current;
          if (l) {
            try {
              l.resize();
              l.scrollTo(targetY, { immediate: true, force: true });
            } catch {
              // Ignore if lenis is between transitions
            }
          }
          window.scrollTo({ top: targetY, left: 0, behavior: "instant" });
          document.documentElement.scrollTop = targetY;
          document.body.scrollTop = targetY;

          rafId = requestAnimationFrame(restoreLoop);
        };

        restoreLoop();

        return () => {
          isCancelled = true;
          cancelAnimationFrame(rafId);
          window.removeEventListener("wheel", cancelOnUserInteraction);
          window.removeEventListener("touchstart", cancelOnUserInteraction);
          window.removeEventListener("keydown", cancelOnUserInteraction);
        };
      }
    }

    // CASE B: Fresh navigation or product page navigation -> START AT TOP (0, 0)
    const performReset = () => {
      const l = lenisRef.current;
      if (l) {
        try {
          l.stop();
          l.scrollTo(0, { immediate: true, force: true });
          l.start();
        } catch {
          // Ignore
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    performReset();
    const rafReset = requestAnimationFrame(performReset);

    return () => {
      cancelAnimationFrame(rafReset);
    };
  }, [pathname]);

  return null;
}

export function SmoothScrolling({ children }: SmoothScrollingProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const lenisRef = useRef<LenisRef>(null);

  // Deep fix: Completely bypass smooth wheel hijacking on admin panel so native scrolling works cleanly
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.18,
        smoothWheel: true,
        prevent: (node) => {
          return (
            Boolean(node?.hasAttribute?.("data-lenis-prevent")) ||
            Boolean(node?.closest?.("[data-lenis-prevent]"))
          );
        },
      }}
    >
      <ScrollRestorationHandler />
      {children}
    </ReactLenis>
  );
}
