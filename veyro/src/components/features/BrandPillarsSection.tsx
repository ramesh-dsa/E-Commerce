"use client";

import React, { useRef, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import Image from "next/image";
import { useLenis } from "lenis/react";

const pillars = [
  {
    id: "01",
    title: "240+ GSM HEAVYWEIGHT",
    desc: "100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash. Engineered to feel substantial on the body.",
    imageUrl: "/images/pillars/bg_heavyweight_1789752687341.webp",
  },
  {
    id: "02",
    title: "CRAFTED IN TIRUPUR",
    desc: "Direct partnerships with India's most respected artisanal garment mills. Every stitch is placed with precision by master craftsmen.",
    imageUrl: "/images/pillars/bg_crafted_1789752703669.webp",
  },
  {
    id: "03",
    title: "ZERO MIDDLEMEN",
    desc: "Pure direct-to-consumer model. We bypass traditional retail markups to bring you premium luxury-grade fabrics at honest, accessible prices.",
    imageUrl: "/images/pillars/bg_markup_1789752717214.webp",
  },
];

export function BrandPillarsSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const isSnappingRef = useRef(false);
  const snapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInViewRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // Cache prefers-reduced-motion once on mount (never query matchMedia in scroll path)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mq.matches;
    const handleChange = (e: MediaQueryListEvent) => { prefersReducedMotionRef.current = e.matches; };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Observe when section is nearby to avoid running timers offscreen
  useEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        if (!entry.isIntersecting && snapTimerRef.current) {
          clearTimeout(snapTimerRef.current);
        }
      },
      { rootMargin: "50px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Magnetic auto-docking when user finishes/stops scrolling gesture
  useEffect(() => {
    const handleScroll = () => {
      if (!isInViewRef.current || !stackRef.current) return;
      if (isSnappingRef.current) return;

      if (snapTimerRef.current) {
        clearTimeout(snapTimerRef.current);
      }

      snapTimerRef.current = setTimeout(() => {
        if (!stackRef.current) return;

        // Respect prefers-reduced-motion accessibility rule (cached, no matchMedia call)
        if (prefersReducedMotionRef.current) {
          return;
        }

        const vh = window.innerHeight;
        const rect = stackRef.current.getBoundingClientRect();
        const stackTop = rect.top + window.scrollY;
        const currentScroll = window.scrollY;

        // Active range where the sticky cards are sliding over each other
        const minScroll = stackTop;
        const maxScroll = stackTop + (pillars.length - 1) * vh;

        // Only snap if user stopped within the sticky transition area
        if (currentScroll >= minScroll - 20 && currentScroll <= maxScroll + 20) {
          const offset = currentScroll - minScroll;
          const progress = offset / vh;
          const targetIndex = Math.min(
            pillars.length - 1,
            Math.max(0, Math.round(progress))
          );

          const targetScroll = minScroll + targetIndex * vh;

          // Only trigger if offset by more than 5px to avoid micro-adjustments
          if (Math.abs(currentScroll - targetScroll) > 5) {
            isSnappingRef.current = true;

            if (lenis) {
              lenis.scrollTo(targetScroll, {
                duration: 0.6,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                onComplete: () => {
                  isSnappingRef.current = false;
                },
              });
            } else {
              window.scrollTo({
                top: targetScroll,
                behavior: "smooth",
              });
              setTimeout(() => {
                isSnappingRef.current = false;
              }, 600);
            }
          }
        }
      }, 220); // 220ms debounce after user stops scrolling
    };

    // User gesture cancels ongoing snap immediately so user is never locked
    const cancelSnapOnUserAction = () => {
      if (isSnappingRef.current) {
        isSnappingRef.current = false;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", cancelSnapOnUserAction, { passive: true });
    window.addEventListener("touchmove", cancelSnapOnUserAction, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", cancelSnapOnUserAction);
      window.removeEventListener("touchmove", cancelSnapOnUserAction);
      if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
    };
  }, [lenis]);

  return (
    <section className="w-full bg-[#0a0a0a] text-white">
      
      {/* Intro Hook (Normal Scroll) */}
      <div className="w-full py-24 sm:py-40 flex items-center justify-center border-b border-[#333]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-mono tracking-widest text-[#999] mb-8 block uppercase">
              [ 001 ] The Standard
            </span>
            <h2 className="text-5xl sm:text-7xl lg:text-[6rem] font-bold tracking-tighter uppercase leading-[0.9]">
              Built For<br />The Archive.
            </h2>
            <p className="mt-8 text-lg sm:text-xl text-[#999] mx-auto leading-relaxed max-w-lg">
              We reject seasonal trends. Every piece is engineered with obsessive attention to fabric weight, structural drape, and minimalist utility. 
            </p>
          </div>
        </Container>
      </div>

      {/* Sticky Scroll Stack */}
      <div ref={stackRef} className="relative w-full">
        {pillars.map((pillar, index) => (
          <div 
            key={pillar.id}
            className="sticky top-0 w-full h-[100svh] flex items-center overflow-hidden"
            style={{ zIndex: index + 10 }}
          >
            {/* Full-Screen Background Image */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={pillar.imageUrl}
                alt={pillar.title}
                fill
                className="object-cover"
              />
              {/* Heavy Cinematic Gradient Overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/60 to-black/30" />
            </div>

            {/* Massive Editorial Content Overlay */}
            <Container className="relative z-20 w-full">
              <div className="max-w-4xl pt-20">
                <div className="mb-6 sm:mb-10">
                  <span className="text-xl sm:text-3xl font-mono tracking-widest text-white/50">
                    {pillar.id}
                  </span>
                </div>
                <h3 className="text-5xl sm:text-7xl lg:text-[7rem] font-bold tracking-tighter uppercase text-white leading-[0.85] mb-6 sm:mb-10 drop-shadow-2xl break-words">
                  {pillar.title}
                </h3>
                <p className="text-lg sm:text-3xl text-white/90 font-medium leading-[1.5] max-w-2xl drop-shadow-lg">
                  {pillar.desc}
                </p>
              </div>
            </Container>
          </div>
        ))}
      </div>
    </section>
  );
}
