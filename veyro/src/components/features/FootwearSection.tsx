"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLenis } from "lenis/react";
import { ProductCard } from "@/components/features/ProductCard";
import { products } from "@/data/products";

export function FootwearSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Use a Map for refs so filtering doesn't cause stale indices
  const cardsRef = useRef(new Map<string, HTMLDivElement>());
  const glowsRef = useRef(new Map<string, HTMLDivElement>());
  const indicatorsRef = useRef(new Map<string, HTMLDivElement>());

  // Cached CSSStyleDeclaration refs to avoid crossing JS→DOM bridge on every frame
  const cardStylesRef = useRef(new Map<string, CSSStyleDeclaration>());
  const glowStylesRef = useRef(new Map<string, CSSStyleDeclaration>());
  const indicatorStylesRef = useRef(new Map<string, CSSStyleDeclaration>());

  // Track previous visual state per card to skip no-op DOM writes
  const prevStateRef = useRef(new Map<string, { scale: string; opacity: string; glowOp: string; indOp: string }>());

  // Smooth scrolling & snapping state
  const isSnappingRef = useRef(false);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const currentClosestIdRef = useRef<string>("");
  const isInViewRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lenisRef = useRef<any>(null);
  // Track scrolling state transition — only schedule snap ONCE on stopped, not every frame
  const wasScrollingRef = useRef(false);
  // Cached once on mount so matchMedia is never queried in the hot scroll path
  const prefersReducedMotionRef = useRef(false);

  // Filter products
  const footwear = products.filter((p) => {
    if (p.category !== "Footwear") return false;
    if (activeFilter === "ALL") return true;
    return p.name.toUpperCase().includes(activeFilter);
  });

  const footwearRef = useRef(footwear);
  useEffect(() => {
    footwearRef.current = footwear;
  }, [footwear]);

  const cardCentersRef = useRef(new Map<string, number>());
  const containerMetricsRef = useRef({ top: 0, scrollable: 1 });
  const cachedMetricsRef = useRef({
    viewportWidth: 0,
    maxTranslate: 0,
  });

  // Update cached geometry metrics (run only when active/resized, never during per-frame scroll)
  const updateMetrics = useCallback(() => {
    if (!trackRef.current || !viewportRef.current || !containerRef.current) return;
    const vWidth = viewportRef.current.clientWidth;
    const tWidth = trackRef.current.scrollWidth;
    const maxTranslate = Math.max(tWidth - vWidth + 48, 0);

    cachedMetricsRef.current.viewportWidth = vWidth;
    cachedMetricsRef.current.maxTranslate = maxTranslate;

    const rect = containerRef.current.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    containerMetricsRef.current.top = rect.top + currentScrollY;
    containerMetricsRef.current.scrollable = Math.max(rect.height - window.innerHeight, 1);

    // Cache static center coordinates of each card relative to the track
    const newCenters = new Map<string, number>();
    footwearRef.current.forEach((product) => {
      const card = cardsRef.current.get(product.id);
      if (card) {
        newCenters.set(product.id, card.offsetLeft + card.offsetWidth / 2);
      }
    });
    cardCentersRef.current = newCenters;
  }, []);

  // Frame-locked hardware-accelerated update function (100% GPU compositor thread)
  const applyFrameTransforms = useCallback((currentScrollY: number) => {
    if (!trackRef.current || !containerRef.current) return;

    const scrollDistance = currentScrollY - containerMetricsRef.current.top;
    const scrollable = containerMetricsRef.current.scrollable;
    const maxTranslate = cachedMetricsRef.current.maxTranslate;

    const progress = Math.min(Math.max(scrollDistance / scrollable, 0), 1);
    const translateX = progress * maxTranslate;

    // Apply track horizontal translation directly in lockstep with smooth scroll
    trackRef.current.style.transform = `translate3d(-${translateX.toFixed(3)}px, 0, 0)`;

    const viewportCenter = cachedMetricsRef.current.viewportWidth / 2;
    const centers = cardCentersRef.current;

    // Find the single card closest to viewport center in this frame
    let minDistance = Infinity;
    let closestProductId = "";

    const productsList = footwearRef.current;
    for (let i = 0; i < productsList.length; i++) {
      const product = productsList[i];
      const centerInTrack = centers.get(product.id);
      if (centerInTrack === undefined) continue;
      const dist = Math.abs(centerInTrack - translateX - viewportCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestProductId = product.id;
      }
    }

    // Only update zIndex when focal card actually changes (zero compositor layer invalidations during scroll!)
    if (closestProductId !== currentClosestIdRef.current) {
      if (currentClosestIdRef.current) {
        const prevStyle = cardStylesRef.current.get(currentClosestIdRef.current);
        if (prevStyle) {
          prevStyle.zIndex = "10";
          prevStyle.willChange = "auto";
        }
      }
      if (closestProductId) {
        const newStyle = cardStylesRef.current.get(closestProductId);
        if (newStyle) {
          newStyle.zIndex = "20";
          newStyle.willChange = "transform, opacity";
        }
      }
      currentClosestIdRef.current = closestProductId;
    }

    // Update compositor-only properties with skip-if-unchanged optimization
    const prevMap = prevStateRef.current;
    for (let i = 0; i < productsList.length; i++) {
      const product = productsList[i];
      const cardStyle = cardStylesRef.current.get(product.id);
      const centerInTrack = centers.get(product.id);
      if (!cardStyle || centerInTrack === undefined) continue;

      const distance = Math.abs(centerInTrack - translateX - viewportCenter);
      const isClosest = product.id === closestProductId;

      // Smooth coverflow curve: active focal card reaches 1.08 scale
      const normalizedDist = distance / 550;
      const scaleVal = Math.max(1.08 - Math.min(normalizedDist, 1) * 0.24, 0.84);
      const scaleStr = scaleVal.toFixed(3);

      // Cinematic Depth-of-Field: active card is 100% opacity; inactive cards gently fade to 0.42
      const cardOpacity = isClosest ? 1 : Math.max(0.42, 1 - (distance / 500) * 0.58);
      const opacityStr = cardOpacity.toFixed(2);

      // Studio Spotlight Halo
      const glowStyle = glowStylesRef.current.get(product.id);
      const glowOpacity = isClosest ? Math.max(1 - distance / 300, 0.35) : 0;
      const glowOpStr = glowOpacity.toFixed(2);

      // Luxury status indicator
      const indicatorStyle = indicatorStylesRef.current.get(product.id);
      const indicatorOpacity = isClosest && distance < 200 ? 1 : 0;
      const indOpStr = indicatorOpacity.toString();

      // Skip DOM writes if values haven't changed (biggest perf win)
      const prev = prevMap.get(product.id);
      if (prev && prev.scale === scaleStr && prev.opacity === opacityStr && prev.glowOp === glowOpStr && prev.indOp === indOpStr) {
        continue;
      }
      prevMap.set(product.id, { scale: scaleStr, opacity: opacityStr, glowOp: glowOpStr, indOp: indOpStr });

      cardStyle.transform = `scale3d(${scaleStr}, ${scaleStr}, 1)`;
      cardStyle.opacity = opacityStr;

      if (glowStyle) {
        glowStyle.opacity = glowOpStr;
      }

      if (indicatorStyle) {
        indicatorStyle.opacity = indOpStr;
      }
    }
  }, []);

  // Cancel any active or pending programmatic snap immediately upon user action
  const cancelSnap = useCallback(() => {
    if (isSnappingRef.current) {
      isSnappingRef.current = false;
    }
    if (snapTimeoutRef.current) {
      clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = null;
    }
  }, []);

  // Magnetic snap to the closest card center
  const snapToClosestCard = useCallback(() => {
    if (isSnappingRef.current) return;
    if (!containerRef.current) return;

    const currentScrollY = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
    const scrollDistance = currentScrollY - containerMetricsRef.current.top;
    const progress = scrollDistance / containerMetricsRef.current.scrollable;

    // Do NOT snap if near the boundaries (guarantees totally frictionless entrance & exit)
    if (progress < 0.05 || progress > 0.95) return;

    const viewportCenter = cachedMetricsRef.current.viewportWidth / 2;
    const maxTranslate = cachedMetricsRef.current.maxTranslate;
    if (maxTranslate <= 0) return;

    const currentTranslateX = progress * maxTranslate;
    const centers = cardCentersRef.current;
    let closestDist = Infinity;
    let targetCenterInTrack = 0;

    footwearRef.current.forEach((product) => {
      const centerInTrack = centers.get(product.id);
      if (centerInTrack === undefined) return;
      const dist = Math.abs(centerInTrack - currentTranslateX - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        targetCenterInTrack = centerInTrack;
      }
    });

    if (closestDist === Infinity) return;

    const idealProgress = Math.min(
      Math.max((targetCenterInTrack - viewportCenter) / maxTranslate, 0),
      1
    );
    const targetScrollY =
      containerMetricsRef.current.top +
      idealProgress * containerMetricsRef.current.scrollable;

    // If already aligned within 15px, skip snap
    if (Math.abs(currentScrollY - targetScrollY) < 15) return;

    isSnappingRef.current = true;
    const activeLenis = lenisRef.current;
    if (activeLenis) {
      activeLenis.scrollTo(targetScrollY, {
        duration: 0.6,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          isSnappingRef.current = false;
        },
      });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
      setTimeout(() => {
        isSnappingRef.current = false;
      }, 600);
    }
  }, []);

  // Lean snap scheduler — called ONCE when scrolling transitions to stopped (never on every frame)
  const scheduleSnap = useCallback(
    (currentScrollY: number) => {
      if (isSnappingRef.current) return;
      if (prefersReducedMotionRef.current) return;

      const scrollDistance = currentScrollY - containerMetricsRef.current.top;
      const progress = scrollDistance / containerMetricsRef.current.scrollable;
      if (progress < 0.05 || progress > 0.95) return;

      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = setTimeout(snapToClosestCard, 400);
    },
    [snapToClosestCard]
  );

  // Click on any card to smoothly center it
  const scrollToProduct = useCallback((productId: string) => {
    const centerInTrack = cardCentersRef.current.get(productId);
    if (centerInTrack === undefined) return;
    const viewportCenter = cachedMetricsRef.current.viewportWidth / 2;
    const maxTranslate = cachedMetricsRef.current.maxTranslate;
    if (maxTranslate <= 0) return;

    const idealProgress = Math.min(
      Math.max((centerInTrack - viewportCenter) / maxTranslate, 0),
      1
    );
    const targetScrollY =
      containerMetricsRef.current.top +
      idealProgress * containerMetricsRef.current.scrollable;

    isSnappingRef.current = true;
    const activeLenis = lenisRef.current;
    if (activeLenis) {
      activeLenis.scrollTo(targetScrollY, {
        duration: 0.7,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        onComplete: () => {
          isSnappingRef.current = false;
        },
      });
    } else {
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });
      setTimeout(() => {
        isSnappingRef.current = false;
      }, 700);
    }
  }, []);

  // Access Lenis instance and listen to scroll events
  const lenis = useLenis((lenisInstance) => {
    lenisRef.current = lenisInstance;
    if (!isInViewRef.current) return;

    // Direct, buttery-smooth scroll lock — pure compositor-thread DOM mutation
    applyFrameTransforms(lenisInstance.scroll);

    // Only schedule snap on the scrolling→stopped transition (never on every idle frame)
    const nowScrolling = Boolean(lenisInstance.isScrolling) || Math.abs(lenisInstance.velocity) > 0.1;
    if (wasScrollingRef.current && !nowScrolling && !isSnappingRef.current) {
      scheduleSnap(lenisInstance.scroll);
    } else if (nowScrolling && snapTimeoutRef.current) {
      // Cancel any pending snap the moment user moves again
      clearTimeout(snapTimeoutRef.current);
      snapTimeoutRef.current = null;
    }
    wasScrollingRef.current = nowScrolling;
  });

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  // Observe when section enters/leaves viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          updateMetrics();
          const currentScrollY = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
          applyFrameTransforms(currentScrollY);
        } else {
          cancelSnap();
        }
      },
      { rootMargin: "250px 0px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [updateMetrics, applyFrameTransforms, cancelSnap]);

  // Recalculate metrics when filter changes or on window/container resize
  useEffect(() => {
    currentClosestIdRef.current = "";
    updateMetrics();

    const currentScrollY = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
    applyFrameTransforms(currentScrollY);

    const handleResize = () => {
      updateMetrics();
      const scrollY = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
      applyFrameTransforms(scrollY);
    };

    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      updateMetrics();
      const scrollY = lenisRef.current ? lenisRef.current.scroll : window.scrollY;
      applyFrameTransforms(scrollY);
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (trackRef.current) resizeObserver.observe(trackRef.current);

    return () => {
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [activeFilter, updateMetrics, applyFrameTransforms]);

  // Fallback native scroll listener if Lenis is not active
  useEffect(() => {
    if (lenis) return;

    let nativeScrollTimer: NodeJS.Timeout | null = null;
    const handleNativeScroll = () => {
      if (!isInViewRef.current) return;
      applyFrameTransforms(window.scrollY);
      // Simple debounce for native fallback
      if (nativeScrollTimer) clearTimeout(nativeScrollTimer);
      nativeScrollTimer = setTimeout(() => scheduleSnap(window.scrollY), 150);
    };

    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleNativeScroll);
      if (nativeScrollTimer) clearTimeout(nativeScrollTimer);
    };
  }, [lenis, applyFrameTransforms, scheduleSnap]);

  // Cache prefers-reduced-motion once on mount (never call matchMedia in hot scroll path)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mq.matches;
    const handleChange = (e: MediaQueryListEvent) => { prefersReducedMotionRef.current = e.matches; };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // User gesture cancels ongoing snap immediately so user is never locked
  useEffect(() => {
    window.addEventListener("wheel", cancelSnap, { passive: true });
    window.addEventListener("touchstart", cancelSnap, { passive: true });
    window.addEventListener("touchmove", cancelSnap, { passive: true });
    window.addEventListener("keydown", cancelSnap, { passive: true });

    return () => {
      window.removeEventListener("wheel", cancelSnap);
      window.removeEventListener("touchstart", cancelSnap);
      window.removeEventListener("touchmove", cancelSnap);
      window.removeEventListener("keydown", cancelSnap);
      if (snapTimeoutRef.current) {
        clearTimeout(snapTimeoutRef.current);
      }
    };
  }, [cancelSnap]);

  return (
    // Outer container
    <section 
      id="footwear"
      ref={containerRef} 
      className="relative w-full h-[400vh] bg-black text-white"
    >
      {/* Sticky Inner Container with Cinematic Studio Background */}
      <div 
        className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden pt-20 pb-10"
      >
        {/* Background Image — via Next.js Image for optimization, lazy loading, and WebP conversion */}
        <Image
          src="/images/sneaker_vault_3d_bg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center -z-10"
          aria-hidden="true"
          priority={false}
        />
        {/* Heavy dark gradient overlay to ensure the background looks incredibly deep and text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black/60 z-0 pointer-events-none" />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center w-full h-full max-w-[1600px] mx-auto px-6 lg:px-12">
          
          {/* Left Static Text (Takes up ~25% on desktop to give maximum space to the carousel) */}
          <div className="w-full lg:w-[25%] shrink-0 flex flex-col justify-center pr-4 xl:pr-8 z-20 mb-8 lg:mb-0">
            <p className="text-[#a3a3a3] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-1">
              FOOTWEAR ARCHIVE
            </p>
            <span className="font-script text-3xl sm:text-4xl text-[#fcd017] tracking-normal block mb-1 font-normal select-none">
              the sneaker vault
            </span>
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight mb-4 leading-[1.05]">
              VULCANIZED<br className="hidden lg:block"/> SILHOUETTES
            </h2>
            <p className="text-[#a3a3a3] text-sm leading-relaxed max-w-xs mb-6">
              Engineered for all-day comfort. Retro runners and modern vulcanized silhouettes built for Indian streetscapes.
            </p>

            {/* Direct CTA to full Footwear Catalog */}
            <Link
              href="/shoes"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#fcd017] hover:bg-white text-black font-extrabold text-[11px] uppercase tracking-[0.15em] rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(252,208,23,0.3)] hover:shadow-[0_8px_25px_rgba(255,255,255,0.4)] group/btn mb-8 w-fit"
            >
              <span>Explore Sneaker Vault (9)</span>
              <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>

            {/* Interactive Brutalist Filters */}
            <div role="tablist" className="flex flex-wrap gap-6 text-[10px] font-bold tracking-[0.2em] uppercase text-[#999]">
              {["ALL", "MINIMAL", "RETRO", "CHUNKY"].map((filter) => (
                <button 
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`hover:text-white transition-colors duration-300 ${activeFilter === filter ? "text-white" : ""}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Right Sliding Track Area (Takes up ~75% on desktop for massive 3D effect) */}
          <div 
            ref={viewportRef}
            className="w-full lg:w-[75%] h-full relative flex flex-col justify-center"
          >
            {/* 
              CSS Masking: Symmetrical fade out on both edges to enhance the 3D coverflow effect.
            */}
            <div 
              className="absolute inset-0 flex items-center w-full h-full"
              style={{ 
                maskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%)'
              }}
            >
              <div 
                ref={trackRef} 
                className="flex gap-10 sm:gap-16 items-center w-max px-[50vw] lg:px-[30vw]"
                style={{ willChange: 'transform' }}
              >
                {footwear.map((product) => {
                  return (
                    <div 
                      key={product.id} 
                      ref={(el) => {
                        if (el) {
                          cardsRef.current.set(product.id, el);
                          cardStylesRef.current.set(product.id, el.style);
                        } else {
                          cardsRef.current.delete(product.id);
                          cardStylesRef.current.delete(product.id);
                        }
                      }}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest("a") || target.closest("button")) {
                          return;
                        }
                        scrollToProduct(product.id);
                      }}
                      className="relative w-[280px] sm:w-[320px] lg:w-[360px] shrink-0 cursor-pointer select-none"
                    >
                      {/* Cinematic Studio Halo Glow behind the sneaker only */}
                      <div 
                        ref={(el) => {
                          if (el) {
                            glowsRef.current.set(product.id, el);
                            glowStylesRef.current.set(product.id, el.style);
                          } else {
                            glowsRef.current.delete(product.id);
                            glowStylesRef.current.delete(product.id);
                          }
                        }}
                        className="absolute -top-6 inset-x-0 h-[72%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_55%,transparent_75%)] blur-[45px] rounded-full pointer-events-none -z-10"
                        style={{ opacity: 0 }}
                      />

                      {/* Sleek Luxury Focal Accent (Visible only on active focal sneaker) */}
                      <div
                        ref={(el) => {
                          if (el) {
                            indicatorsRef.current.set(product.id, el);
                            indicatorStylesRef.current.set(product.id, el.style);
                          } else {
                            indicatorsRef.current.delete(product.id);
                            indicatorStylesRef.current.delete(product.id);
                          }
                        }}
                        className="absolute -top-7 left-0 flex items-center gap-1.5 pointer-events-none"
                        style={{ opacity: 0 }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/90">
                          VAULT ARCHIVE
                        </span>
                      </div>

                      <ProductCard 
                        product={product} 
                        theme="dark"
                        aspectRatio="aspect-[3/4]"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">
            Scroll to explore
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-[#a3a3a3] to-transparent"></div>
        </div>

      </div>
    </section>
  );
}

