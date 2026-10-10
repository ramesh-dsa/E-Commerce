"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import { Logo } from "@/components/ui/Logo";
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";

export function AccountModal() {
  const {
    user,
    isAccountModalOpen,
    closeAccountModal,
    login,
    demoLogin,
  } = useUser();

  // Guest view form state
  const [activeAuthTab, setActiveAuthTab] = useState<"signin" | "register">("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAccountModalOpen) {
        closeAccountModal();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAccountModalOpen, closeAccountModal]);

  // Lock both documentElement and body scroll when modal is open so website never scrolls
  useEffect(() => {
    if (isAccountModalOpen && !user) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyPaddingRight = document.body.style.paddingRight;

      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.paddingRight = originalBodyPaddingRight;
      };
    }
  }, [isAccountModalOpen, user]);

  // Guard: Never render if closed or if user is already authenticated
  if (!isAccountModalOpen || user) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: formData.name.trim() || formData.email.split("@")[0] || "Valued Member",
      email: formData.email.trim(),
      phone: "+91 98765 43210",
    });
    closeAccountModal();
  };

  const handleDemoLogin = () => {
    demoLogin();
    closeAccountModal();
  };

  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-300"
    >
      {/* Deep Frosted Scrim Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
        onClick={closeAccountModal}
        onWheel={(e) => e.preventDefault()}
        onTouchMove={(e) => e.preventDefault()}
        aria-hidden="true"
      />

      {/* Luxury Architectural 2-Column Split Modal (Center of Screen - Smooth Rounded Edges) */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="VEYRO Member Portal"
        className="relative w-full max-w-5xl bg-[#0c0c0e] text-white rounded-2xl sm:rounded-3xl shadow-[0_35px_100px_rgba(0,0,0,0.95)] overflow-hidden z-10 border border-white/[0.12] animate-in zoom-in-95 duration-250 flex flex-col md:flex-row md:min-h-[640px] max-h-[92vh]"
      >
        {/* ========================================================= */}
        {/* LEFT COLUMN: EDITORIAL CAMPAIGN VISUAL (Desktop/Tablet)   */}
        {/* ========================================================= */}
        <div className="relative hidden md:flex md:w-[44%] flex-col justify-between p-8 sm:p-10 overflow-hidden border-r border-white/[0.08]">
          {/* High-Fashion Editorial Photography Background */}
          <Image
            src="/hero/panel-classic-fit-highres.webp"
            alt="VEYRO High Fashion Editorial"
            fill
            quality={80}
            sizes="(max-width: 768px) 100vw, 44vw"
            className="object-cover object-center scale-105 filter brightness-90 contrast-110"
          />

          {/* Luxury Scrim Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/55 to-black/30 z-1" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#09090b]/40 to-[#09090b]/90 z-1" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <Logo variant="white" height={26} />
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#fcd017]">
                VAULT PRIVÉ • ED. 2026
              </span>
            </div>
          </div>

          {/* Bottom Editorial Content with Fancy Cursive Typography */}
          <div className="relative z-10 space-y-4">
            <div>
              {/* Elegant Calligraphy Accent */}
              <span className="font-script text-3xl sm:text-5xl text-[#fcd017] tracking-normal font-bold block -mb-1 drop-shadow-md">
                the signature vault
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight uppercase leading-none text-white font-sans mt-1">
                THE INNER CIRCLE
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2.5 leading-relaxed font-light">
                Architectural 240+ GSM heavyweight drapes, vulcanized sneakers, and secret drop links reserved exclusively for account holders.
              </p>
            </div>

            {/* Exclusive Perks Bullets */}
            <div className="space-y-2.5 pt-3 border-t border-white/10 text-xs text-neutral-300 font-medium">
              <div className="flex items-center gap-2.5">
                <span className="text-[#fcd017] text-sm">✦</span>
                <span>Secret drop access 2 hours prior to public drops</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#fcd017] text-sm">✦</span>
                <span>Complimentary 48H courier priority dispatch</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[#fcd017] text-sm">✦</span>
                <span>Cross-device persistent Bag & Wishlist vault</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE FORM & PROFILE DASHBOARD        */}
        {/* ========================================================= */}
        <div className="modal-scroll-area flex-1 md:w-[56%] bg-[#101013] flex flex-col justify-between overflow-y-auto overscroll-contain">
          {/* Top Bar with Clean Header (No Dot, Neat Branding) */}
          <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/[0.08] bg-[#101013]/90 sticky top-0 z-20 backdrop-blur-md">
            <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-neutral-400">
              VEYRO ARCHIVE • EST. 2026
            </span>

            <button
              type="button"
              onClick={closeAccountModal}
              aria-label="Close modal"
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer hover:rotate-90 duration-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* GUEST MODE: SLEEK HIGH-FASHION AUTH */}
          <div className="p-6 sm:p-10 flex-1 flex flex-col justify-between">
            <div>
              {/* Header Copy with Elegant Cursive Script Accent */}
              <div className="mb-7">
                <span className="font-script text-2xl sm:text-4xl text-[#fcd017] tracking-normal font-bold block -mb-1">
                  crafted for modern men
                </span>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase mt-0.5">
                  ENTER THE ARCHIVE
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                  Sign in to track orders in real-time, view reserved drops, and access VIP pricing.
                </p>
              </div>

              {/* Symmetrical Luxury Architectural Tabs */}
              <div className="grid grid-cols-2 border-b border-white/10 mb-8">
                <button
                  type="button"
                  onClick={() => setActiveAuthTab("signin")}
                  className={`pb-4 text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.14em] transition-all relative cursor-pointer text-center ${
                    activeAuthTab === "signin"
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-300 font-medium"
                  }`}
                >
                  <span>SIGN IN</span>
                  {activeAuthTab === "signin" && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#fcd017]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveAuthTab("register")}
                  className={`pb-4 text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.14em] transition-all relative cursor-pointer text-center ${
                    activeAuthTab === "register"
                      ? "text-white"
                      : "text-neutral-500 hover:text-neutral-300 font-medium"
                  }`}
                >
                  <span>CREATE ACCOUNT</span>
                  {activeAuthTab === "register" && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#fcd017]" />
                  )}
                </button>
              </div>

              {/* Input Fields */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {activeAuthTab === "signin" ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full h-12 px-4 bg-white/[0.04] border border-white/15 focus:border-[#fcd017] rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                          PASSWORD
                        </label>
                        <button
                          type="button"
                          onClick={() => alert("Password reset link sent to your registered email.")}
                          className="text-xs font-medium text-neutral-400 hover:text-[#fcd017] transition-colors cursor-pointer"
                        >
                          FORGOT?
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          className="w-full h-12 pl-4 pr-11 bg-white/[0.04] border border-white/15 focus:border-[#fcd017] rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Santhosh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full h-12 px-4 bg-white/[0.04] border border-white/15 focus:border-[#fcd017] rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full h-12 px-4 bg-white/[0.04] border border-white/15 focus:border-[#fcd017] rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
                        PASSWORD
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 6 characters"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          minLength={6}
                          className="w-full h-12 pl-4 pr-11 bg-white/[0.04] border border-white/15 focus:border-[#fcd017] rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="relative group overflow-hidden w-full h-12 bg-white hover:bg-[#fcd017] text-[#111111] font-black text-xs sm:text-sm uppercase tracking-[0.16em] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer mt-6 shadow-sm hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_4px_12px_-2px_rgba(252,208,23,0.18)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none ease-out" />
                  <span className="relative z-10 transition-colors duration-300">
                    {activeAuthTab === "signin" ? "SIGN IN TO VAULT" : "CREATE & ACTIVATE ACCOUNT"}
                  </span>
                  <ArrowRight
                    size={16}
                    className="relative z-10 stroke-[2.5] group-hover:translate-x-1.5 transition-transform duration-300"
                  />
                </button>

                {/* 1-Click Fast Demo VIP Sign In Button */}
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full h-11 mt-2 border border-[#fcd017]/30 bg-[#fcd017]/10 hover:bg-[#fcd017]/20 text-[#fcd017] font-sans text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} className="stroke-[2.5]" />
                  <span>DEMO VIP SIGN IN</span>
                </button>
              </form>
            </div>

            {/* Bottom Guarantee */}
            <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#fcd017]" />
                <span>256-Bit Encrypted Telemetry</span>
              </span>
              <span className="text-[10px] font-sans font-semibold uppercase text-neutral-500 tracking-wider">
                VEYRO SECURITY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
