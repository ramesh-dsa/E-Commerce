"use client";

import React, { useState, useRef, useEffect } from "react";
import { ProductCard } from "@/components/features/ProductCard";
import { products } from "@/data/products";

export function FootwearSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Use a Map for refs so filtering doesn't cause stale indices
  const cardsRef = useRef(new Map<string, HTMLDivElement>());
  
  // Smooth scrolling state
  const targetX = useRef(0);
  const currentX = useRef(0);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Filter products
  const footwear = products.filter((p) => {
    if (p.category !== "Footwear") return false;
    if (activeFilter === "ALL") return true;
    return p.name.toUpperCase().includes(activeFilter);
  });

  // The rAF loop runs once on mount, so it closes over the initial `footwear` array.
  // We use a ref to always give the rAF loop the freshest filtered array.
  const footwearRef = useRef(footwear);
  useEffect(() => {
    footwearRef.current = footwear;
  }, [footwear]);

  // Boundary clamp on filter change
  useEffect(() => {
    // Wait for the next layout frame so scrollWidth is accurately updated
    requestAnimationFrame(() => {
      if (!trackRef.current || !viewportRef.current) return;
      
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = viewportRef.current.clientWidth;
      const maxTranslate = Math.max(trackWidth - viewportWidth + 48, 0);
      
      if (targetX.current > maxTranslate) {
        targetX.current = maxTranslate;
        // We don't snap currentX to maxTranslate, letting the existing LERP loop 
        // smoothly glide the user back to the new boundary
      }
    });
  }, [activeFilter]);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current || !viewportRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1) inside the massive container
      const scrollDistance = -top;
      const scrollableDistance = height - windowHeight;
      const progress = Math.min(Math.max(scrollDistance / scrollableDistance, 0), 1);

      // Max translate is track width minus viewport width (plus a little padding at the end)
      const trackWidth = trackRef.current.scrollWidth;
      const viewportWidth = viewportRef.current.clientWidth;
      const maxTranslate = Math.max(trackWidth - viewportWidth + 48, 0);

      // Update target instead of state for LERP physics
      targetX.current = progress * maxTranslate;
    };

    const render = () => {
      // LERP (Linear Interpolation) for that "buttery smooth" heavy feel
      currentX.current = currentX.current + (targetX.current - currentX.current) * 0.08;
      
      if (Math.abs(targetX.current - currentX.current) > 0.1) {
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(-${currentX.current}px, 0, 0)`;
        }
        
        if (viewportRef.current) {
          const viewportRect = viewportRef.current.getBoundingClientRect();
          const viewportCenter = viewportRect.left + viewportRect.width / 2;
          
          // Phase 1: READ DOM (prevents layout thrashing)
          const measurements = footwearRef.current.map((product) => {
            const card = cardsRef.current.get(product.id);
            if (!card) return null;
            const rect = card.getBoundingClientRect();
            return {
              card,
              distance: Math.abs((rect.left + rect.width / 2) - viewportCenter)
            };
          });

          // Phase 2: WRITE DOM
          measurements.forEach((m) => {
            if (!m) return;
            const { card, distance } = m;
            
            // Dramatic coverflow calculations for that "wow" effect
            // Center card scales to 1.1 for extra "pop"
            const scale = Math.max(1.1 - (distance / 700) * 0.45, 0.65);
            
            // Instead of opacity (which makes cards see-through/glassmorphic), 
            // we use brightness. This keeps the cards completely solid while fading them into shadows.
            const brightness = Math.max(1 - (distance / 600) * 0.7, 0.25);
            
            const isActive = distance < 150;
            
            card.style.transform = `scale(${scale})`;
            card.style.filter = `brightness(${brightness})`;
            card.style.opacity = '1'; // Ensure fully opaque so background never shows through
            
            // Dynamic Z-Index so the center card is always smoothly on top
            card.style.zIndex = Math.floor(1000 - distance).toString();
            
            // Dynamic premium shadow for the center card
            card.style.boxShadow = isActive 
              ? '0 40px 80px -20px rgba(0,0,0,0.9)' 
              : 'none';
            
            const glow = card.firstChild as HTMLElement;
            if (glow) {
              glow.style.opacity = isActive ? '1' : '0';
            }
          });
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();
    render();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    // Outer container
    <section 
      ref={containerRef} 
      className="relative w-full h-[400vh] bg-black text-white"
    >
      {/* Sticky Inner Container with Cinematic Studio Background */}
      <div 
        className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden pt-20 pb-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/sneaker_vault_3d_bg.jpg")' }}
      >
        {/* Heavy dark gradient overlay to ensure the background looks incredibly deep and text stays legible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-black/60 z-0 pointer-events-none" />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center w-full h-full max-w-[1600px] mx-auto px-6 lg:px-12">
          
          {/* Left Static Text (Takes up ~25% on desktop to give maximum space to the carousel) */}
          <div className="w-full lg:w-[25%] shrink-0 flex flex-col justify-center pr-4 xl:pr-8 z-20 mb-8 lg:mb-0">
            <p className="text-[#a3a3a3] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-2">
              FOOTWEAR ARCHIVE
            </p>
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
              THE<br className="hidden lg:block"/> SNEAKER<br className="hidden lg:block"/> VAULT
            </h2>
            <p className="text-[#a3a3a3] text-sm leading-relaxed max-w-xs mb-10">
              Engineered for all-day comfort. Retro runners and modern vulcanized silhouettes built for Indian streetscapes.
            </p>

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
                {footwear.map((product, index) => {
                  return (
                    <div 
                      key={product.id} 
                      ref={(el) => {
                        if (el) cardsRef.current.set(product.id, el);
                        else cardsRef.current.delete(product.id);
                      }}
                      className="relative w-[280px] sm:w-[320px] lg:w-[360px] shrink-0"
                      style={{ willChange: 'transform, opacity' }}
                    >
                      {/* Cinematic Glow behind the active shoe */}
                      <div 
                        className="absolute inset-0 bg-white/10 blur-[80px] rounded-full pointer-events-none -z-10 opacity-0 transition-opacity duration-500"
                      />
                      <ProductCard 
                        product={product} 
                        theme="dark"
                        aspectRatio="aspect-[3/4]"
                        isWishlisted={index % 3 === 0}
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
