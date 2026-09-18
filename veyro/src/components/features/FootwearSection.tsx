"use client";

import React, { useState, useRef, useEffect } from "react";
import { ProductCard } from "@/components/features/ProductCard";
import { products } from "@/data/products";

export function FootwearSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Smooth scrolling state
  const targetX = useRef(0);
  const currentX = useRef(0);
  const [translateX, setTranslateX] = useState(0);
  const [focalPoint, setFocalPoint] = useState(0);
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Filter products
  const footwear = products.filter((p) => {
    if (p.category !== "Footwear") return false;
    if (activeFilter === "ALL") return true;
    return p.name.toUpperCase().includes(activeFilter);
  });

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
      // Factor 0.08 is the sweet spot for smooth, luxurious momentum
      currentX.current = currentX.current + (targetX.current - currentX.current) * 0.08;
      
      // Only trigger a state update if the difference is noticeable (saves re-renders when idle)
      if (Math.abs(targetX.current - currentX.current) > 0.1) {
        setTranslateX(currentX.current);
        if (viewportRef.current) {
          setFocalPoint(currentX.current + viewportRef.current.clientWidth * 0.25);
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
        style={{ backgroundImage: 'url("/images/sneaker-vault-studio-bg.jpg")' }}
      >
        {/* Subtle dark overlay so text stays perfectly crisp */}
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center w-full h-full max-w-[1600px] mx-auto px-6 lg:px-12">
          
          {/* Left Static Text (Takes up ~35% on desktop) */}
          <div className="w-full lg:w-[35%] shrink-0 flex flex-col justify-center pr-8 z-20 mb-8 lg:mb-0">
            <p className="text-[#a3a3a3] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-2">
              FOOTWEAR ARCHIVE
            </p>
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
              THE<br className="hidden lg:block"/> SNEAKER<br className="hidden lg:block"/> VAULT
            </h2>
            <p className="text-[#a3a3a3] text-sm leading-relaxed max-w-sm mb-10">
              Engineered for all-day comfort. Retro runners and modern vulcanized silhouettes built for Indian streetscapes.
            </p>

            {/* Interactive Brutalist Filters */}
            <div className="flex flex-wrap gap-6 text-[10px] font-bold tracking-[0.2em] uppercase text-[#666]">
              {["ALL", "MINIMAL", "RETRO", "CHUNKY"].map((filter) => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`hover:text-white transition-colors duration-300 ${activeFilter === filter ? "text-white" : ""}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Right Sliding Track Area (Takes up ~65% on desktop) */}
          <div 
            ref={viewportRef}
            className="w-full lg:w-[65%] h-full relative flex flex-col justify-center"
          >
            {/* 
              CSS Masking: Fades out the left edge (and right edge slightly) 
              so the cards smoothly disappear before hitting the text. 
            */}
            <div 
              className="absolute inset-0 flex items-center w-full h-full"
              style={{ 
                maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
              }}
            >
              <div 
                ref={trackRef} 
                className="flex gap-10 sm:gap-16 items-center w-max px-10 sm:px-20"
                style={{ 
                  transform: `translate3d(-${translateX}px, 0, 0)`,
                  willChange: 'transform' // Hardware acceleration
                }}
              >
                {footwear.map((product, index) => {
                  // Cover Flow Physics Math
                  const itemWidth = 360; // Perfect luxury proportion width
                  const gap = 64; // Matches gap-16 (64px) for more breathing room
                  const itemCenter = index * (itemWidth + gap) + (itemWidth / 2);
                  
                  // Calculate distance from the current focal point
                  const distance = Math.abs(itemCenter - focalPoint);
                  
                  // Smoother scaling: 1 down to 0.9
                  const scale = Math.max(1 - (distance / 1200) * 0.1, 0.9);
                  // Smoother opacity: 1 down to 0.5
                  const opacity = Math.max(1 - (distance / 800) * 0.5, 0.5);
                  
                  // Active state for spotlight glow
                  const isActive = distance < 200;

                  return (
                    <div 
                      key={product.id} 
                      className="relative w-[280px] sm:w-[320px] lg:w-[360px] shrink-0"
                      style={{
                        transform: `scale(${scale})`,
                        opacity: opacity,
                        transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
                        willChange: 'transform, opacity'
                      }}
                    >
                      {/* Cinematic Glow behind the active shoe */}
                      <div 
                        className={`absolute inset-0 bg-white/10 blur-[80px] rounded-full transition-opacity duration-500 pointer-events-none -z-10 ${isActive ? 'opacity-100' : 'opacity-0'}`}
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
