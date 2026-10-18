"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useUser } from "@/context/UserContext";
import { Logo } from "@/components/ui/Logo";
import { Toast } from "@/components/ui/Toast";
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

type AuthView = "auth" | "forgot-email" | "forgot-otp";

export function AccountModal() {
  const {
    user,
    isAccountModalOpen,
    closeAccountModal,
    login,
    demoLogin,
    updateProfile,
  } = useUser();

  const shouldReduceMotion = useReducedMotion();
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 32 : -32,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -32 : 32,
      opacity: 0,
    }),
  };

  const transitionConfig = {
    duration: shouldReduceMotion ? 0.001 : 0.24,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  // View state: "auth" (signin/register), "forgot-email" (Screen 2), "forgot-otp" (Screen 3)
  const [authView, setAuthView] = useState<AuthView>("auth");
  const [activeAuthTab, setActiveAuthTab] = useState<"signin" | "register">("signin");

  // Signin / Register form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Screen 2: Forgot Password Email state
  const [resetEmail, setResetEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Screen 3: OTP & Password Reset state
  const [otpCode, setOtpCode] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // In-memory simulation ref for unauthenticated password updates
  const tempPasswordRef = useRef<string>("");

  // Refs for 6 OTP input boxes
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Toast notification state
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    variant: "success" | "danger" | "info";
  }>({
    isOpen: false,
    message: "",
    variant: "success",
  });

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (authView !== "forgot-otp" || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [authView, timerSeconds]);

  // Auto-focus Tile 1 when entering Screen 3
  useEffect(() => {
    if (authView === "forgot-otp") {
      const timer = setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [authView]);

  // Reset and close handler
  const handleClose = useCallback(() => {
    setAuthView("auth");
    setEmailError("");
    setOtpError("");
    setIsSendingEmail(false);
    setIsSubmittingReset(false);
    setResetSuccess(false);
    closeAccountModal();
  }, [closeAccountModal]);

  // Close modal on Escape key press
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAccountModalOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isAccountModalOpen, handleClose]);

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

  // Format countdown mm:ss
  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Generate 6-digit simulated OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Switch to Screen 2 (Forgot Password)
  const handleOpenForgotPassword = () => {
    setSlideDirection(1);
    setResetEmail(formData.email.trim());
    setEmailError("");
    setAuthView("forgot-email");
  };

  // Submit Screen 2 (Email validation & transition to Screen 3)
  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToValidate = resetEmail.trim();

    if (!emailToValidate) {
      setEmailError("Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToValidate)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setEmailError("");
    setIsSendingEmail(true);
    setSlideDirection(1);

    // 1.2s realistic network simulation
    setTimeout(() => {
      const newOtp = generateOTP();
      setOtpCode(newOtp);
      setTimerSeconds(300);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpError("");
      setNewPassword("");
      setConfirmPassword("");
      setIsSendingEmail(false);
      setAuthView("forgot-otp");

      // Auto-focus first OTP digit box after mount
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 80);
    }, 1200);
  };

  // Handle individual OTP digit typing
  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const updated = [...otpDigits];

    if (!cleaned) {
      updated[index] = "";
      setOtpDigits(updated);
      return;
    }

    // Take the last character entered
    const char = cleaned.slice(-1);
    updated[index] = char;
    setOtpDigits(updated);
    if (otpError) setOtpError("");

    // Auto-advance to next input tile
    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace and arrow navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otpDigits[index] === "" && index > 0) {
        // Move back to previous box and clear it
        const updated = [...otpDigits];
        updated[index - 1] = "";
        setOtpDigits(updated);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const updated = [...otpDigits];
        updated[index] = "";
        setOtpDigits(updated);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting full 6-digit code
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasteData[i] || "";
    }
    setOtpDigits(updated);
    if (otpError) setOtpError("");

    const targetIndex = Math.min(pasteData.length, 5);
    otpInputRefs.current[targetIndex]?.focus();
  };

  // Resend OTP code
  const handleResendCode = () => {
    const freshCode = generateOTP();
    setOtpCode(freshCode);
    setTimerSeconds(300);
    setOtpDigits(["", "", "", "", "", ""]);
    setOtpError("");
    setToast({
      isOpen: true,
      message: "A new code has been sent.",
      variant: "success",
    });
    otpInputRefs.current[0]?.focus();
  };

  // Submit Screen 3: Verify OTP and save new password
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (timerSeconds <= 0) {
      setOtpError("This code has expired. Request a new one.");
      return;
    }

    const enteredOtp = otpDigits.join("");
    if (enteredOtp !== otpCode) {
      setOtpError("Invalid code. Please check and try again.");
      return;
    }

    if (newPassword.length < 8) {
      setOtpError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setOtpError("Passwords do not match.");
      return;
    }

    setOtpError("");
    setIsSubmittingReset(true);

    setTimeout(() => {
      // If user is somehow logged in, update profile; otherwise save in-memory simulation ref
      if (user) {
        updateProfile({ email: resetEmail });
      } else {
        tempPasswordRef.current = newPassword;
      }

      setToast({
        isOpen: true,
        message: "Password updated successfully.",
        variant: "success",
      });

      setIsSubmittingReset(false);
      setResetSuccess(true);

      // Auto-transition back to sign in view after 1.5s delay
      setTimeout(() => {
        setSlideDirection(-1);
        setAuthView("auth");
        setActiveAuthTab("signin");
        setResetSuccess(false);
        setFormData((prev) => ({
          ...prev,
          email: resetEmail,
          password: "",
        }));
      }, 1500);
    }, 600);
  };

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
    <>
      {/* Toast Notification Mount (Layered above modal) */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        message={toast.message}
        variant={toast.variant}
        position="top"
        duration={4000}
        className="z-[70]"
      />

      <div
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-300"
      >
        {/* Deep Frosted Scrim Backdrop */}
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
          onClick={handleClose}
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
          aria-hidden="true"
        />

        {/* Luxury Architectural 2-Column Split Modal */}
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
            <Image
              src="/hero/panel-classic-fit-highres.webp"
              alt="VEYRO High Fashion Editorial"
              fill
              quality={80}
              sizes="(max-width: 768px) 100vw, 44vw"
              className="object-cover object-center scale-105 filter brightness-90 contrast-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/55 to-black/30 z-1" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#09090b]/40 to-[#09090b]/90 z-1" />

            <div className="relative z-10">
              <Logo variant="white" height={26} />
              <div className="flex items-center gap-2 mt-2.5">
                <span className="text-[10px] font-sans font-bold tracking-[0.25em] uppercase text-[#fcd017]">
                  VAULT PRIVÉ • ED. 2026
                </span>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <div>
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
                  <span>Cross-device persistent Bag &amp; Wishlist vault</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: INTERACTIVE FORM CONTAINER                   */}
          {/* ========================================================= */}
          <div className="modal-scroll-area flex-1 md:w-[56%] bg-[#101013] flex flex-col justify-between overflow-y-auto overscroll-contain">
            {/* Top Bar with Clean Header */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-white/[0.08] bg-[#101013]/90 sticky top-0 z-20 backdrop-blur-md">
              <span className="text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-neutral-400">
                {authView === "auth"
                  ? "VEYRO ARCHIVE • EST. 2026"
                  : authView === "forgot-email"
                  ? "PASSWORD RECOVERY"
                  : "SECURITY VERIFICATION"}
              </span>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close modal"
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer hover:rotate-90 duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              >
                <X size={20} />
              </button>
            </div>

            {/* Interactive Screen Container with motion transitions */}
            <div className="relative p-6 sm:p-10 flex-1 flex flex-col justify-between overflow-hidden min-h-[540px]">
              <AnimatePresence mode="popLayout" custom={slideDirection} initial={false}>
                {/* ========================================================= */}
                {/* SCREEN 1: GUEST SIGN IN / REGISTER FORM                   */}
                {/* ========================================================= */}
                {authView === "auth" && (
                  <motion.div
                    key="view-auth"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={transitionConfig}
                    className="w-full flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Header Copy */}
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
                                  onClick={handleOpenForgotPassword}
                                  className="text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-[#fcd017] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#fcd017] rounded px-1"
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
                  </motion.div>
                )}

                {/* ========================================================= */}
                {/* SCREEN 2: EMAIL INPUT & SEND RESET LINK                   */}
                {/* ========================================================= */}
                {authView === "forgot-email" && (
                  <motion.div
                    key="view-forgot-email"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={transitionConfig}
                    className="w-full flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="mb-7">
                        <span className="font-script text-2xl sm:text-4xl text-[#fcd017] tracking-normal font-bold block -mb-1">
                          account recovery
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase mt-0.5">
                          RESET YOUR PASSWORD
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                          Enter the email linked to your VEYRO account. We&apos;ll send you a reset link.
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSendResetLink} className="space-y-5" noValidate>
                        <div>
                          <label
                            htmlFor="reset-email-input"
                            className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2"
                          >
                            EMAIL ADDRESS
                          </label>
                          <div className="relative">
                            <input
                              id="reset-email-input"
                              type="email"
                              autoFocus
                              autoComplete="email"
                              placeholder="name@example.com"
                              value={resetEmail}
                              onChange={(e) => {
                                setResetEmail(e.target.value);
                                if (emailError) setEmailError("");
                              }}
                              className={`w-full h-12 px-4 bg-white/[0.04] rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none transition-colors border ${
                                emailError
                                  ? "border-rose-500 ring-1 ring-rose-500/30"
                                  : "border-white/15 focus:border-[#fcd017]"
                              }`}
                            />
                          </div>

                          {/* Inline Error Message */}
                          {emailError && (
                            <p
                              role="alert"
                              className="mt-2 text-xs sm:text-sm text-rose-400 flex items-center gap-1.5"
                            >
                              <AlertCircle size={14} className="shrink-0 stroke-[2.2]" />
                              <span>{emailError}</span>
                            </p>
                          )}
                        </div>

                        {/* Send Reset Link Button */}
                        <button
                          type="submit"
                          disabled={isSendingEmail}
                          className="relative group overflow-hidden w-full h-12 bg-white hover:bg-[#fcd017] disabled:opacity-75 disabled:cursor-not-allowed text-[#111111] font-black text-xs sm:text-sm uppercase tracking-[0.16em] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_4px_12px_-2px_rgba(252,208,23,0.18)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                        >
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none ease-out" />
                          {isSendingEmail ? (
                            <span className="relative z-10 flex items-center gap-2">
                              <svg
                                className="animate-spin h-4 w-4 text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8H4z"
                                />
                              </svg>
                              <span>Sending…</span>
                            </span>
                          ) : (
                            <>
                              <span className="relative z-10">SEND RESET LINK</span>
                              <ArrowRight
                                size={16}
                                className="relative z-10 stroke-[2.5] group-hover:translate-x-1.5 transition-transform duration-300"
                              />
                            </>
                          )}
                        </button>

                        {/* Back to sign in link */}
                        <div className="pt-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setSlideDirection(-1);
                              setEmailError("");
                              setAuthView("auth");
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#fcd017] rounded py-1 px-2"
                          >
                            <ArrowLeft size={14} />
                            <span>Back to sign in</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Bottom Security Note */}
                    <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400">
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#fcd017]" />
                        <span>Secure Verification Gateway</span>
                      </span>
                      <span className="text-[10px] font-sans font-semibold uppercase text-neutral-500 tracking-wider">
                        VEYRO PRIVACY
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* ========================================================= */}
                {/* SCREEN 3: OTP VERIFICATION & NEW PASSWORD                 */}
                {/* ========================================================= */}
                {authView === "forgot-otp" && (
                  <motion.div
                    key="view-forgot-otp"
                    custom={slideDirection}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={transitionConfig}
                    className="w-full flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="mb-5">
                        <span className="font-script text-2xl sm:text-4xl text-[#fcd017] tracking-normal font-bold block -mb-1">
                          security verification
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase mt-0.5">
                          CHECK YOUR INBOX
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 leading-relaxed">
                          A 6-digit code was sent to{" "}
                          <span className="text-white font-medium break-all">
                            {resetEmail || "your email"}
                          </span>
                          . Enter it below to set a new password.
                        </p>
                      </div>

                      {/* Demo Callout Box */}
                      <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 sm:p-3.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-xs text-neutral-300">
                          <span className="font-semibold text-neutral-200">Demo Simulation: </span>
                          <span>Your one-time code is:</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm sm:text-base font-extrabold tracking-[0.25em] text-[#fcd017] px-2.5 py-1 bg-[#fcd017]/10 border border-[#fcd017]/30 rounded-lg">
                            {otpCode}
                          </span>
                        </div>
                      </div>

                      {/* Countdown Timer Row */}
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-neutral-400 font-medium">Verification Code</span>
                        <div
                          className={`font-mono text-xs font-semibold ${
                            timerSeconds > 60 ? "text-[#fcd017]" : "text-rose-400"
                          }`}
                        >
                          {timerSeconds > 0
                            ? `Code expires in ${formatTimer(timerSeconds)}`
                            : "Code expired (0:00)"}
                        </div>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleResetPasswordSubmit} className="space-y-4" noValidate>
                        {/* 6-Digit OTP Tile Boxes */}
                        <div>
                          <div className="grid grid-cols-6 gap-2 sm:gap-3" onPaste={handleOtpPaste}>
                            {otpDigits.map((digit, index) => (
                              <input
                                key={`otp-${index}`}
                                id={`otp-digit-${index}`}
                                name={`otp-digit-${index}`}
                                ref={(el) => {
                                  otpInputRefs.current[index] = el;
                                }}
                                autoFocus={index === 0}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                autoComplete="one-time-code"
                                data-1p-ignore="true"
                                data-lpignore="true"
                                data-form-type="other"
                                spellCheck={false}
                                autoCorrect="off"
                                autoCapitalize="off"
                                aria-label={`Digit ${index + 1}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className={`w-full h-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-bold rounded-xl text-white bg-white/[0.04] transition-colors outline-none focus:outline-none ring-0 focus:ring-0 shadow-none focus:shadow-none border ${
                                  otpError
                                    ? "border-rose-500 bg-rose-500/10 focus:border-rose-500"
                                    : digit
                                      ? "border-white/30 bg-white/[0.06] focus:border-[#fcd017]"
                                      : "border-white/15 focus:border-[#fcd017] focus:bg-white/[0.06]"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Password Fields */}
                        <div className="space-y-3 pt-1">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                              NEW PASSWORD
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Minimum 8 characters"
                                value={newPassword}
                                onChange={(e) => {
                                  setNewPassword(e.target.value);
                                  if (otpError) setOtpError("");
                                }}
                                className="w-full h-11 pl-4 pr-11 bg-white/[0.04] border border-white/15 focus:border-[#fcd017] rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                aria-label={showNewPassword ? "Hide password" : "Show password"}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                              CONFIRM NEW PASSWORD
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  if (otpError) setOtpError("");
                                }}
                                className="w-full h-11 pl-4 pr-11 bg-white/[0.04] border border-white/15 focus:border-[#fcd017] rounded-xl text-xs sm:text-sm font-medium text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                              >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Inline Error Message */}
                        {otpError && (
                          <div
                            role="alert"
                            className="text-xs sm:text-sm text-rose-400 flex items-center justify-between gap-2 pt-1"
                          >
                            <span className="flex items-center gap-1.5">
                              <AlertCircle size={14} className="shrink-0 stroke-[2.2]" />
                              <span>{otpError}</span>
                            </span>
                            {timerSeconds <= 0 && (
                              <button
                                type="button"
                                onClick={handleResendCode}
                                className="underline font-semibold text-[#fcd017] hover:text-[#e5bc05] cursor-pointer"
                              >
                                Resend
                              </button>
                            )}
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmittingReset || resetSuccess}
                          className="relative group overflow-hidden w-full h-12 bg-white hover:bg-[#fcd017] disabled:opacity-75 disabled:cursor-not-allowed text-[#111111] font-black text-xs sm:text-sm uppercase tracking-[0.16em] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer mt-3 shadow-sm hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_4px_12px_-2px_rgba(252,208,23,0.18)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                        >
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none ease-out" />
                          {isSubmittingReset ? (
                            <span className="relative z-10 flex items-center gap-2">
                              <svg
                                className="animate-spin h-4 w-4 text-current"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v8H4z"
                                />
                              </svg>
                              <span>Updating Password…</span>
                            </span>
                          ) : resetSuccess ? (
                            <span className="relative z-10 flex items-center gap-2 text-emerald-600 font-bold">
                              <CheckCircle2 size={16} />
                              <span>PASSWORD UPDATED</span>
                            </span>
                          ) : (
                            <>
                              <span className="relative z-10">SET NEW PASSWORD</span>
                              <ArrowRight
                                size={16}
                                className="relative z-10 stroke-[2.5] group-hover:translate-x-1.5 transition-transform duration-300"
                              />
                            </>
                          )}
                        </button>

                        {/* Navigation / Resend Code actions */}
                        <div className="flex items-center justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSlideDirection(-1);
                              setOtpError("");
                              setAuthView("auth");
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#fcd017] rounded py-1 px-1.5"
                          >
                            <ArrowLeft size={13} />
                            <span>Back to sign in</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleResendCode}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-[#fcd017] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#fcd017] rounded py-1 px-1.5"
                          >
                            <RefreshCw size={13} />
                            <span>Resend Code</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Bottom Security Note */}
                    <div className="pt-5 mt-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400">
                      <span className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#fcd017]" />
                        <span>Zero-Trust Architecture</span>
                      </span>
                      <span className="text-[10px] font-sans font-semibold uppercase text-neutral-500 tracking-wider">
                        VEYRO PROTOCOL
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
