"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";
import { Squares } from "@/components/ui/reactbits/Squares";
import { ShinyText } from "@/components/ui/reactbits/ShinyText";
import { SplitText } from "@/components/ui/reactbits/SplitText";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Check,
  ExternalLink,
  Compass,
  Box,
  Layers,
  Clock,
} from "lucide-react";

export default function AdminLoginPage() {
  const { adminLogin, isAdmin } = useAdmin();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [timeString, setTimeString] = useState("");

  // Live real-time operational clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAdmin) router.replace("/admin");
  }, [isAdmin, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      const result = adminLogin(email, password);
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    }, 450);
  };

  const handleAutofillDemo = () => {
    setEmail("admin@veyro.in");
    setPassword("veyro2026");
    setError("");
    setDemoLoaded(true);
    setTimeout(() => setDemoLoaded(false), 2400);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#070709] text-white overflow-x-hidden overflow-y-auto select-none">
      {/* ─── 1. REACT BITS SQUARES INTERACTIVE CANVAS BACKGROUND ─── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <Squares
          direction="diagonal"
          speed={0.25}
          borderColor="rgba(255, 255, 255, 0.03)"
          squareSize={50}
          hoverFillColor="rgba(252, 208, 23, 0.16)"
          className="opacity-75"
        />
      </div>

      {/* ─── 2. ATMOSPHERIC WARM AMBER & GOLD VOLUMETRIC GLOWS ─── */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[820px] bg-[#fcd017]/[0.045] rounded-full blur-[190px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-1/4 translate-x-1/4 w-[760px] h-[760px] bg-[#ffd400]/[0.035] rounded-full blur-[180px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* ─── 3. TOP REFINED GLOBAL HEADER BAR ─── */}
      <header className="absolute top-0 inset-x-0 z-20 px-8 sm:px-12 lg:px-16 xl:px-20 py-5 sm:py-6 flex items-center justify-between border-b border-white/[0.04] backdrop-blur-md bg-[#070709]/70">
        {/* Brand Atelier Identity */}
        <div className="flex items-center gap-3">
          <Link href="/" className="group flex items-center gap-2.5 focus:outline-none">
            <span className="font-serif text-xl tracking-[0.32em] text-white uppercase group-hover:text-[#fcd017] transition-colors font-medium">
              VEYRO
            </span>
            <span className="text-white/20 text-xs font-light">/</span>
            <span className="text-[11px] font-mono tracking-[0.22em] text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase font-medium">
              BACKSTAGE CONTROL
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          {/* Clean Real Live UTC Operational Clock */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-neutral-400 text-[11px] tracking-wider tabular-nums font-mono">
              UTC {timeString || "LIVE"}
            </span>
          </div>

          {/* Clean, Refined Luxury Storefront Action */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.09] hover:border-white/25 transition-all duration-200 group"
          >
            <span className="tracking-wide">Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </Link>
        </div>
      </header>

      {/* ─── 4. MASTER COHESIVE STAGE CONTAINER (BALANCED VERTICAL ALIGNMENT) ─── */}
      <div className="relative z-10 w-full max-w-[1520px] 2xl:max-w-[1680px] mx-auto min-h-screen flex items-center justify-center px-6 sm:px-10 lg:px-14 xl:px-18 pt-28 pb-16 xl:pt-32 xl:pb-20">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 2xl:gap-20 items-center">
          
          {/* ══════════════════════════════════════════════════════════
              LEFT WING: EDITORIAL ATELIER IDENTITY (SPAN 7)
          ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 xl:space-y-10">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.035] border border-white/[0.09] backdrop-blur-xl w-fit">
              <span className="h-2 w-2 rounded-full bg-[#fcd017] animate-pulse" />
              <ShinyText
                text="CENTRAL STORE MANAGEMENT"
                speed={3.5}
                color="gold"
                className="text-[11px] tracking-[0.26em] uppercase font-bold"
              />
              <span className="text-[10px] font-mono text-neutral-400 border-l border-white/10 pl-2.5">
                SS/26
              </span>
            </div>

            {/* Headline Section: MASS "ADMIN PANEL" */}
            <div className="space-y-4">
              <div className="relative">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[88px] font-serif text-white tracking-[0.12em] xl:tracking-[0.15em] uppercase leading-[1.0] drop-shadow-[0_15px_45px_rgba(0,0,0,0.95)]">
                  <SplitText
                    text="ADMIN PANEL"
                    delay={35}
                    enableHoverSpring={true}
                    className="font-serif text-white tracking-[0.12em] xl:tracking-[0.15em] whitespace-nowrap"
                  />
                </h1>

                {/* Golden Laser Horizon Accent */}
                <div className="relative w-full max-w-xl h-[2.5px] bg-gradient-to-r from-[#fcd017]/85 via-white/25 to-transparent overflow-hidden rounded-full mt-4.5">
                  <div className="absolute inset-y-0 w-36 bg-gradient-to-r from-transparent via-[#fcd017] to-transparent animate-laser-beam" />
                </div>
              </div>

              <p className="text-base sm:text-[17px] xl:text-[18px] text-neutral-400 font-light leading-relaxed max-w-2xl pt-1.5">
                The authoritative command center for Veyro Luxury Apparel. Oversee catalog releases, track customer orders, manage global inventory, and process customer returns.
              </p>
            </div>

            {/* Editorial Atelier Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4.5 max-w-2xl xl:max-w-3xl pt-2">
              
              {/* Pillar 1 */}
              <div className="bg-[#101013]/70 border border-white/[0.08] hover:border-white/20 rounded-2xl sm:rounded-3xl p-5.5 xl:p-6 backdrop-blur-xl transition-all duration-300 group hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.85)]">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-mono text-neutral-400">01 // CATALOG</span>
                  <Layers className="w-4.5 h-4.5 text-[#fcd017] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-base font-semibold text-white tracking-wide">
                  Product Matrix
                </div>
                <p className="text-xs sm:text-[12.5px] text-neutral-400 mt-1.5 leading-relaxed font-light">
                  Apparel drops, pricing tiers, and size stock.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-[#101013]/70 border border-white/[0.08] hover:border-white/20 rounded-2xl sm:rounded-3xl p-5.5 xl:p-6 backdrop-blur-xl transition-all duration-300 group hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.85)]">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-mono text-neutral-400">02 // ORDERS</span>
                  <Box className="w-4.5 h-4.5 text-[#fcd017] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-base font-semibold text-white tracking-wide">
                  Order Dispatch
                </div>
                <p className="text-xs sm:text-[12.5px] text-neutral-400 mt-1.5 leading-relaxed font-light">
                  Live fulfillment, tracking, and delivery routing.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-[#101013]/70 border border-white/[0.08] hover:border-white/20 rounded-2xl sm:rounded-3xl p-5.5 xl:p-6 backdrop-blur-xl transition-all duration-300 group hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.85)]">
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-mono text-neutral-400">03 // RETURNS</span>
                  <Compass className="w-4.5 h-4.5 text-[#fcd017] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-base font-semibold text-white tracking-wide">
                  Return Approvals
                </div>
                <p className="text-xs sm:text-[12.5px] text-neutral-400 mt-1.5 leading-relaxed font-light">
                  QC verification, refunds, and restock claims.
                </p>
              </div>

            </div>

            {/* Bottom Brand Credential Note */}
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 pt-2 border-t border-white/[0.05] max-w-2xl xl:max-w-3xl">
              <span className="text-[#fcd017]">●</span>
              <span>RESTRICTED ACCESS PORTAL</span>
              <span className="text-white/20">•</span>
              <span>MANAGEMENT & STAFF ONLY</span>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════
              RIGHT WING: COMMANDING LUXURY VAULT (SPAN 5)
              (OPTICALLY LOWERED FOR BALANCED BREATHING ROOM)
          ══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end w-full lg:translate-y-5 xl:translate-y-5 2xl:translate-y-6">
            <div className="w-full max-w-[510px] xl:max-w-[550px] 2xl:max-w-[570px]">
              
              {/* Rock-solid, commanding luxury vault console */}
              <div className="rounded-3xl sm:rounded-[32px] border border-white/[0.1] border-t-white/[0.28] bg-[#0c0c0f]/95 backdrop-blur-2xl p-9 sm:p-12 xl:p-14 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.99),0_0_0_1px_rgba(255,255,255,0.03)] transition-all duration-300 hover:border-white/[0.17] hover:shadow-[0_45px_100px_-20px_rgba(0,0,0,1)]">
                
                {/* Card Header */}
                <div className="text-center mb-8">
                  <Link href="/" className="inline-block group focus:outline-none">
                    <h2 className="text-4xl sm:text-5xl font-serif tracking-[0.38em] text-white uppercase group-hover:text-amber-200 transition-colors leading-none">
                      VEYRO
                    </h2>
                  </Link>

                  <div className="flex items-center justify-center gap-2.5 mt-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#fcd017]" />
                    <span className="text-xs sm:text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#fcd017]">
                      ADMINISTRATOR LOGIN
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#fcd017]" />
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 font-light">
                    Please enter your administrator credentials to proceed.
                  </p>
                </div>

                {/* 1-Click Demo Credentials VIP Pill */}
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className={`group w-full mb-6 flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    demoLoaded
                      ? "bg-white/[0.04] border-white/20 text-white"
                      : "bg-white/[0.025] border-white/10 hover:border-white/20 hover:bg-white/[0.045] text-neutral-300"
                  }`}
                  title="Click to automatically load demo credentials"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Sparkles className="w-4 h-4 text-[#fcd017] shrink-0" />
                    <div className="text-xs sm:text-[13px] font-medium truncate text-left">
                      <span className="text-neutral-400 font-normal">Demo Account:</span>{" "}
                      <span className="text-neutral-200 font-mono">admin@veyro.in</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    {demoLoaded ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-medium tracking-wider uppercase text-neutral-200 bg-white/[0.06] border border-white/20 px-2.5 py-1 rounded-lg">
                        <Check className="w-3.5 h-3.5 text-[#fcd017] stroke-[2.5]" /> Loaded
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-medium tracking-wider uppercase px-2.5 py-1 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] text-neutral-400 group-hover:text-neutral-200 border border-white/10 group-hover:border-white/20 transition-colors">
                        1-Click Autofill
                      </span>
                    )}
                  </div>
                </button>

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 sm:space-y-6"
                  aria-label="Admin authentication portal"
                >
                  {/* Email Input */}
                  <div className="space-y-2.5">
                    <label
                      htmlFor="admin-email"
                      className="block text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400"
                    >
                      Email Address
                    </label>
                    <div className="relative flex items-center bg-[#070709] rounded-xl sm:rounded-2xl border border-white/10 transition-all duration-200 focus-within:border-[#fcd017]/80">
                      <div className="pl-4.5 text-neutral-500 pointer-events-none">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="admin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        placeholder="admin@veyro.in"
                        className="w-full bg-transparent text-white px-4 py-4 text-sm sm:text-base placeholder:text-neutral-600 focus:outline-none input-dark-autofill font-sans"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2.5">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs uppercase tracking-[0.2em] font-semibold text-neutral-400"
                    >
                      Password
                    </label>
                    <div className="relative flex items-center bg-[#070709] rounded-xl sm:rounded-2xl border border-white/10 transition-all duration-200 focus-within:border-[#fcd017]/80">
                      <div className="pl-4.5 text-neutral-500 pointer-events-none">
                        <Lock className="w-4.5 h-4.5" />
                      </div>
                      <input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        className="w-full bg-transparent text-white px-4 py-4 text-sm sm:text-base placeholder:text-neutral-600 focus:outline-none input-dark-autofill font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="pr-4.5 text-neutral-500 hover:text-white transition-colors focus:outline-none cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4.5 h-4.5" />
                        ) : (
                          <Eye className="w-4.5 h-4.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Banner */}
                  {error && (
                    <div
                      className="bg-red-500/10 border border-red-500/25 text-red-200 text-xs sm:text-sm px-4.5 py-3.5 rounded-xl flex items-center gap-3 shadow-sm"
                      role="alert"
                    >
                      <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
                      <span className="font-medium leading-relaxed">{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full mt-3 overflow-hidden bg-gradient-to-r from-[#fcd017] via-[#ffd526] to-[#fcd017] hover:from-[#ffe043] hover:via-[#ffe869] hover:to-[#ffd526] text-black font-extrabold text-xs sm:text-[13px] tracking-[0.24em] uppercase py-4.5 rounded-xl sm:rounded-2xl border border-yellow-200/40 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.45)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer group"
                  >
                    {/* Elegant specular light sweep on hover */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out pointer-events-none" />

                    {isLoading ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin text-black stroke-[2.5]" />
                        <span>AUTHENTICATING...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">SIGN IN TO ADMIN PANEL</span>
                        <ArrowRight className="relative z-10 w-4.5 h-4.5 stroke-[2.5] group-hover:translate-x-1.5 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                </form>

              </div>

              {/* Navigation Footer */}
              <div className="mt-6.5 text-center space-y-2.5">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-white transition-colors group py-1"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                  <span>Return to Storefront</span>
                </Link>

                <p className="text-xs text-neutral-500 tracking-wider uppercase flex items-center justify-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4 text-neutral-500 shrink-0" />
                  <span>Authorized Personnel Only</span>
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Laser Beam Animation Keyframes */}
      <style jsx global>{`
        @keyframes laser-beam {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(450%);
          }
        }
        .animate-laser-beam {
          animation: laser-beam 3.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
