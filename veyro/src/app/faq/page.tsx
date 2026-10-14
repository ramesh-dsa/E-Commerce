"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import {
  Search,
  X,
  ChevronDown,
  Package,
  Truck,
  RotateCcw,
  Shirt,
  CreditCard,
  HelpCircle,
  Mail,
  MessageSquare,
  ArrowRight,
  Clock,
  MapPin,
  UserCheck,
  Gift,
  Globe,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  Palette,
  Ruler,
  Sparkles,
  BadgeCheck,
  Droplets,
  Banknote,
  KeyRound,
  Lock,
  FileText,
} from "lucide-react";

type FaqCategory = "orders" | "shipping" | "returns" | "products" | "account";

type FaqItem = {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  icon: React.ElementType;
  actionHref?: string;
  actionLabel?: string;
};

const FAQ_DATA: FaqItem[] = [
  // ── ORDERS ──────────────────────────────────────────────────────────
  {
    id: "orders-1",
    category: "orders",
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking link via SMS and email. You can also visit your Order History page at /orders — every order features a live status timeline tracking Confirmed → Packed → Shipped → Delivered.",
    icon: Package,
    actionLabel: "Track My Order",
    actionHref: "/orders",
  },
  {
    id: "orders-2",
    category: "orders",
    question: "Can I cancel my order after placing it?",
    answer:
      "Yes, you can cancel an order as long as it has not been marked as shipped yet. Navigate to Orders → select the order → tap 'Cancel Order'. You'll be prompted to choose a cancellation reason. Refunds are automatically initiated within 3–5 business days to your original payment method.",
    icon: Clock,
    actionLabel: "Cancel Order",
    actionHref: "/orders",
  },
  {
    id: "orders-3",
    category: "orders",
    question: "Why is my order delayed?",
    answer:
      "Most orders arrive strictly within their estimated delivery window. Occasional delays may happen due to severe weather, high seasonal volume, or remote pin codes. If your delivery exceeds 7 business days, reach out directly to our team via WhatsApp or email.",
    icon: AlertTriangle,
  },
  {
    id: "orders-4",
    category: "orders",
    question: "Can I change the delivery address after placing an order?",
    answer:
      "Address changes are only possible before your order is packed and dispatched. Reach out immediately via WhatsApp or email with your order ID and corrected shipping address.",
    icon: MapPin,
  },
  {
    id: "orders-5",
    category: "orders",
    question: "What happens if I'm not available to receive the delivery?",
    answer:
      "Our courier partners will attempt delivery up to 3 times before returning the package to our hub. You will receive an SMS prior to each attempt to coordinate a convenient time.",
    icon: UserCheck,
  },

  // ── SHIPPING ─────────────────────────────────────────────────────────
  {
    id: "shipping-1",
    category: "shipping",
    question: "How long does standard shipping take?",
    answer:
      "Standard shipping takes 4–7 business days nationwide. Express shipping delivers within 1–3 business days across all metropolitan areas.",
    icon: Truck,
  },
  {
    id: "shipping-2",
    category: "shipping",
    question: "Do you offer free shipping?",
    answer:
      "Yes! Free standard delivery is automatically applied to all orders above ₹999. Orders below ₹999 incur a flat ₹79 delivery fee. Express shipping is available at ₹149 regardless of cart total.",
    icon: Gift,
  },
  {
    id: "shipping-3",
    category: "shipping",
    question: "Do you ship internationally?",
    answer:
      "Currently, VEYRO ships exclusively within India. International shipping to North America, the UAE, and Europe is currently in beta testing and will be unveiled soon.",
    icon: Globe,
  },
  {
    id: "shipping-4",
    category: "shipping",
    question: "Which courier partners do you use?",
    answer:
      "We partner with tier-one logistics networks including Delhivery, BlueDart, and Shiprocket. Your tracking link will reflect the exact courier assigned to your shipment.",
    icon: ShieldCheck,
  },

  // ── RETURNS & REFUNDS ────────────────────────────────────────────────
  {
    id: "returns-1",
    category: "returns",
    question: "What is your return policy?",
    answer:
      "We provide a 7-day complimentary return policy starting from the delivery timestamp. Items must remain unworn, unwashed, and in their original packaging with all security tags intact.",
    icon: RotateCcw,
    actionLabel: "Start a Return",
    actionHref: "/orders",
  },
  {
    id: "returns-2",
    category: "returns",
    question: "How do I initiate a return or exchange?",
    answer:
      "Visit your Orders page at /orders, locate the delivered order, and select 'Request Return or Exchange'. Choose the eligible item(s), specify a reason, and choose between an exchange or direct refund.",
    icon: RefreshCw,
    actionLabel: "Go to Orders",
    actionHref: "/orders",
  },
  {
    id: "returns-3",
    category: "returns",
    question: "How long does the refund take?",
    answer:
      "Once our warehouse receives and inspects the return, refunds are credited within 3–5 business days. UPI and wallet refunds typically reflect within 24–48 hours, while credit cards may take up to 5 banking days.",
    icon: CreditCard,
  },
  {
    id: "returns-4",
    category: "returns",
    question: "What if I received a damaged or wrong item?",
    answer:
      "If you receive an incorrect or damaged item, please contact us within 48 hours of delivery with photos and your order ID. We will prioritize an immediate priority replacement or complete refund.",
    icon: AlertTriangle,
  },
  {
    id: "returns-5",
    category: "returns",
    question: "Can I exchange for a different size or colour?",
    answer:
      "Yes, size and colour exchanges are free of charge, subject to stock availability. If your desired size is out of stock, a full refund will be processed immediately upon inspection.",
    icon: Palette,
  },

  // ── PRODUCTS & SIZING ────────────────────────────────────────────────
  {
    id: "products-1",
    category: "products",
    question: "How do I find the right size?",
    answer:
      "Every product page features a Size Guide modal with exact chest, shoulder, and length measurements for apparel, as well as UK, US, and EU conversions for footwear. If you prefer a relaxed streetwear drape, we suggest taking your standard size.",
    icon: Ruler,
    actionLabel: "View Size Guide",
    actionHref: "/clothing",
  },
  {
    id: "products-2",
    category: "products",
    question: "What fabric do your t-shirts use?",
    answer:
      "Our t-shirts are crafted from 100% combed ring-spun cotton (180 GSM for everyday drape, and 240 GSM for our signature Heavyweight drop-shoulder silhouettes). All textiles are pre-shrunk and OEKO-TEX certified.",
    icon: Shirt,
  },
  {
    id: "products-3",
    category: "products",
    question: "Are VEYRO sneakers true to size?",
    answer:
      "Yes, our footwear line is engineered to true UK sizing. If you have a wider foot profile, we recommend sizing up one half-size for optimal comfort.",
    icon: Sparkles,
  },
  {
    id: "products-4",
    category: "products",
    question: "Are your products authentic?",
    answer:
      "Every single garment and shoe is designed, sampled, and produced under strict proprietary quality control in India. We do not white-label. Each piece comes with a numbered authenticity certificate.",
    icon: BadgeCheck,
  },
  {
    id: "products-5",
    category: "products",
    question: "How do I care for my VEYRO garments?",
    answer:
      "Machine wash inside-out with cold water (30°C max). Hang dry in the shade to preserve garment dye richness and graphic longevity. Avoid ironing directly on silicone or puff prints.",
    icon: Droplets,
  },

  // ── ACCOUNT & PAYMENT ────────────────────────────────────────────────
  {
    id: "account-1",
    category: "account",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major UPI providers (Google Pay, PhonePe, Paytm), Visa, Mastercard, RuPay, Net Banking across all Indian banks, and Cash on Delivery (COD) for supported pin codes.",
    icon: CreditCard,
  },
  {
    id: "account-2",
    category: "account",
    question: "Is Cash on Delivery available?",
    answer:
      "Yes, Cash on Delivery is enabled for over 19,000 pin codes across India for orders up to ₹5,000. A standard convenience verification fee of ₹39 applies to COD shipments.",
    icon: Banknote,
  },
  {
    id: "account-3",
    category: "account",
    question: "How do I reset my password?",
    answer:
      "Click the Account icon in the navigation header, select 'Sign In', and click 'Forgot Password'. Enter your registered email address to receive a secure password reset token valid for 30 minutes.",
    icon: KeyRound,
  },
  {
    id: "account-4",
    category: "account",
    question: "Is my personal and payment data secure?",
    answer:
      "Absolutely. We utilize bank-grade 256-bit SSL encryption. We do not store raw credit/debit card numbers on our infrastructure. All transactions route through PCI-DSS Level 1 certified payment gateways.",
    icon: Lock,
  },
  {
    id: "account-5",
    category: "account",
    question: "What are your Terms of Service and Privacy Policy?",
    answer:
      "By using VEYRO, you agree to our standard terms governing purchases, account security, intellectual property, and fair return policies. We uphold strict data privacy: your data is never sold or rented to external marketing vendors.",
    icon: FileText,
  },
];

const CATEGORIES: { id: "all" | FaqCategory; label: string }[] = [
  { id: "all", label: "All questions" },
  { id: "orders", label: "Orders" },
  { id: "shipping", label: "Shipping" },
  { id: "returns", label: "Returns" },
  { id: "products", label: "Sizing" },
  { id: "account", label: "Payments" },
];

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState<"all" | FaqCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>("orders-1");
  const shouldReduceMotion = useReducedMotion();

  // Handle URL hash on mount and hash changes (e.g. /faq#shipping, /faq#contact)
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#shipping") {
        setActiveTab("shipping");
        setOpenId("shipping-1");
      } else if (hash === "#returns") {
        setActiveTab("returns");
        setOpenId("returns-1");
      } else if (hash === "#orders") {
        setActiveTab("orders");
        setOpenId("orders-1");
      } else if (hash === "#products") {
        setActiveTab("products");
        setOpenId("products-1");
      } else if (hash === "#account" || hash === "#terms") {
        setActiveTab("account");
        setOpenId("account-5");
      } else if (hash === "#contact" || hash === "#team" || hash === "#contact-team") {
        const contactEl = document.getElementById("contact-team");
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  // Filter FAQs based on active category tab and live search query
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FAQ_DATA.filter((item) => {
      const matchesCategory = activeTab === "all" || item.category === activeTab;
      const matchesSearch =
        q === "" ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-white text-[#101828] relative overflow-hidden"
    >
      {/* ── CRISP ARCHITECTURAL GRID (Hero area only, smoothly fading into clean white canvas) ── */}
      <div
        className="absolute top-0 inset-x-0 h-[460px] sm:h-[500px] pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 24, 40, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 24, 40, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          maskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10 pt-16 sm:pt-24 pb-24">
        {/* ── 1. HEADER (Curved Astroid Star + Bold Title + Subtitle) ────── */}
        <div className="max-w-2xl mx-auto text-center flex flex-col items-center">
          {/* Elegant Couture 4-Point Star (Exact match to Image 1) */}
          <div className="mb-5 flex items-center justify-center text-[#101828]" aria-hidden="true">
            <svg
              viewBox="0 0 32 32"
              fill="currentColor"
              className="w-7 h-7 sm:w-8 sm:h-8 transition-transform hover:scale-105 duration-300"
            >
              <path d="M16 3 Q12.2 12.2 3 16 Q12.2 19.8 16 29 Q19.8 19.8 29 16 Q19.8 12.2 16 3 Z" />
            </svg>
          </div>

          {/* Bold Heading (Exact styling from Image 1) */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#101828]">
            Frequently asked questions
          </h1>

          {/* Subtitle (Clean, balanced 2-line alignment) */}
          <p className="mt-4 text-base sm:text-[17px] text-[#475467] leading-relaxed max-w-xl sm:max-w-2xl mx-auto text-center">
            <span className="block sm:inline">
              These are the most commonly asked questions about VEYRO orders and services.
            </span>
            <br className="hidden sm:inline" />
            <span className="block sm:inline sm:ml-1 mt-1 sm:mt-0">
              Can&apos;t find what you&apos;re looking for?{" "}
              <motion.a
                href="#contact-team"
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById("contact-team");
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "center" });
                    window.history.pushState(null, "", "#contact-team");
                  }
                }}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="group/hero-link inline-block relative font-semibold text-[#101828] hover:text-veyro-accent transition-colors cursor-pointer"
              >
                <span>Chat to our friendly team!</span>
                {/* Elegant Hand-drawn Curved Wave Flourish */}
                <svg
                  viewBox="0 0 120 12"
                  fill="none"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 w-full h-2.5 pointer-events-none text-veyro-accent overflow-visible"
                  aria-hidden="true"
                >
                  <motion.path
                    d="M 2 7.5 C 32 2.5, 82 11, 118 5.5"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    variants={{
                      rest: {
                        pathLength: 0,
                        opacity: 0,
                        transition: {
                          pathLength: { duration: 0.3, ease: "easeOut" },
                          opacity: { duration: 0.2 },
                        },
                      },
                      hover: {
                        pathLength: 1,
                        opacity: 1,
                        transition: {
                          pathLength: shouldReduceMotion
                            ? { duration: 0 }
                            : { duration: 0.68, ease: [0.22, 1, 0.36, 1] },
                          opacity: { duration: 0.15 },
                        },
                      },
                    }}
                  />
                </svg>
              </motion.a>
            </span>
          </p>

          {/* Sleek Minimal Search Input */}
          <div className="relative mt-8 max-w-md w-full mx-auto">
            <Search
              size={18}
              strokeWidth={2}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none z-10"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions or keywords..."
              aria-label="Search questions"
              className="w-full bg-white/90 backdrop-blur-xs border border-[#d0d5dd] text-[#101828] placeholder:text-[#667085] pl-11 pr-10 py-2.5 sm:py-3 text-sm rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#101828] focus:border-[#101828] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#101828] p-1 transition-colors cursor-pointer z-10"
              >
                <X size={16} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Balanced Single-Line Category Tabs with Smooth Sliding Spring Indicator */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mt-6">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    if (activeTab !== cat.id) {
                      setActiveTab(cat.id);
                      setOpenId(null);
                    }
                  }}
                  className={`relative px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-medium transition-colors duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101828] focus-visible:ring-offset-2 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-[#475467] hover:text-[#101828]"
                  }`}
                >
                  {/* Inactive Tab Base Border/Background */}
                  <div
                    className={`absolute inset-0 rounded-full border transition-colors duration-200 pointer-events-none ${
                      isActive
                        ? "border-transparent bg-transparent"
                        : "border-[#e4e7ec] bg-white/90 hover:border-[#d0d5dd]"
                    }`}
                    aria-hidden="true"
                  />

                  {/* Active Sliding Dark Pill (Snappy tactile spring glide) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFaqTab"
                      className="absolute inset-0 bg-[#101828] rounded-full shadow-xs pointer-events-none"
                      style={{ zIndex: 1 }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              type: "spring",
                              stiffness: 460,
                              damping: 34,
                              mass: 0.8,
                            }
                      }
                    />
                  )}

                  <span className="relative z-10 block whitespace-nowrap">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. ACCORDION STREAM (Compact max-w-[740px] matching Image 1) ── */}
        <div className="max-w-[740px] mx-auto mt-12 sm:mt-14 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="divide-y divide-[#eaecf0]"
            >
              {filteredFaqs.map((item) => {
                const isOpen = openId === item.id;
                const IconComponent = item.icon;

                return (
                  <div
                    key={item.id}
                    className="py-5 sm:py-6 group"
                  >
                    {/* Trigger Row */}
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      id={`faq-question-${item.id}`}
                      className="w-full flex items-center justify-between gap-4 text-left cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101828] rounded-lg"
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                        {/* Rounded Icon Box (Exact match to Image 1) */}
                        <div
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-200 ${
                            isOpen
                              ? "bg-[#101828] text-white border-[#101828] shadow-xs"
                              : "bg-white text-[#344054] border-[#eaecf0] shadow-2xs group-hover:border-[#d0d5dd] group-hover:bg-[#fafafa]"
                          }`}
                        >
                          <IconComponent size={18} strokeWidth={1.8} />
                        </div>

                        {/* Question Text */}
                        <span className="text-base sm:text-[17px] font-semibold text-[#101828] leading-snug">
                          {item.question}
                        </span>
                      </div>

                      {/* Right Chevron Toggle */}
                      <span className="p-1 text-[#667085] group-hover:text-[#101828] transition-colors shrink-0">
                        <ChevronDown
                          size={18}
                          strokeWidth={2}
                          className={`transition-transform duration-300 ease-out ${
                            isOpen ? "rotate-180 text-[#101828]" : "rotate-0"
                          }`}
                        />
                      </span>
                    </button>

                    {/* Smooth Expandable Answer Panel */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${item.id}`}
                          role="region"
                          aria-labelledby={`faq-question-${item.id}`}
                          key="answer"
                          initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 pl-0 sm:pl-[60px] pr-2 pb-1">
                            <p className="text-sm sm:text-base text-[#475467] leading-relaxed">
                              {item.answer}
                            </p>
                            {item.actionHref && item.actionLabel && (
                              <Link
                                href={item.actionHref}
                                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#101828] hover:text-veyro-accent transition-colors group/link cursor-pointer"
                              >
                                <span className="relative">
                                  {item.actionLabel}
                                  <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-veyro-accent transition-all duration-200 ease-out group-hover/link:w-full" />
                                </span>
                                <ArrowRight
                                  size={14}
                                  className="transition-transform duration-200 group-hover/link:translate-x-1 shrink-0"
                                />
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Empty State */}
              {filteredFaqs.length === 0 && (
                <div className="py-16 text-center">
                  <HelpCircle size={32} className="mx-auto text-[#98a2b3] mb-3" />
                  <h3 className="text-base font-semibold text-[#101828]">No questions found</h3>
                  <p className="text-sm text-[#475467] mt-1">
                    We couldn&apos;t find any answers matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                    }}
                    className="mt-4 group inline-flex items-center text-sm font-semibold text-[#101828] hover:text-veyro-accent cursor-pointer transition-colors"
                  >
                    <span className="relative">
                      Clear search and reset
                      <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-veyro-accent transition-all duration-200 ease-out group-hover:w-full" />
                    </span>
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── 3. DIRECT CONCIERGE (Matches crisp architectural light aesthetic) ─────── */}
        <div
          id="contact-team"
          className="mt-20 sm:mt-24 max-w-[740px] mx-auto pt-14 border-t border-[#eaecf0] text-center scroll-mt-20 sm:scroll-mt-24"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#101828]">
            Still have questions?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#475467] max-w-lg mx-auto leading-relaxed">
            Can&apos;t find what you&apos;re looking for? Reach out directly to our concierge team for custom sizing, order updates, or styling advice.
          </p>

          {/* 2-Column Luxury Assistance Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {/* Card 1: WhatsApp */}
            <a
              href="https://wa.me/917305000000?text=Hi%20VEYRO%20Support,%20I%20have%20a%20question%20regarding%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl border border-[#eaecf0] bg-white hover:border-[#101828] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 ease-out flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl border border-[#eaecf0] bg-[#fafafa] group-hover:bg-[#101828] group-hover:text-white group-hover:scale-105 transition-all duration-300 ease-out flex items-center justify-center text-[#101828] mb-4 shadow-2xs">
                  <MessageSquare size={18} strokeWidth={1.8} />
                </div>
                <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider mb-1">
                  Fastest Response &bull; ~5 mins
                </div>
                <h3 className="text-base sm:text-[17px] font-bold text-[#101828]">
                  Chat on WhatsApp
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#475467] leading-relaxed">
                  Direct line to our stylists for sizing consultations, urgent address corrections, and dispatch expediting.
                </p>
              </div>

              <div className="mt-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#101828] group-hover:text-veyro-accent transition-colors">
                <span className="relative">
                  Open WhatsApp
                  <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-veyro-accent transition-all duration-200 ease-out group-hover:w-full" />
                </span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1.5 shrink-0"
                />
              </div>
            </a>

            {/* Card 2: Email Desk */}
            <a
              href="mailto:support@veyro.in"
              className="group p-6 rounded-2xl border border-[#eaecf0] bg-white hover:border-[#101828] hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 ease-out flex flex-col justify-between"
            >
              <div>
                <div className="w-11 h-11 rounded-xl border border-[#eaecf0] bg-[#fafafa] group-hover:bg-[#101828] group-hover:text-white group-hover:scale-105 transition-all duration-300 ease-out flex items-center justify-center text-[#101828] mb-4 shadow-2xs">
                  <Mail size={18} strokeWidth={1.8} />
                </div>
                <div className="text-[11px] font-semibold text-[#667085] uppercase tracking-wider mb-1">
                  Email Desk &bull; 2–4 hours
                </div>
                <h3 className="text-base sm:text-[17px] font-bold text-[#101828]">
                  Send us an Email
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm text-[#475467] leading-relaxed">
                  Formal inquiries, invoice requests, returns authorization, and collaborative brand partnerships.
                </p>
              </div>

              <div className="mt-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#101828] group-hover:text-veyro-accent transition-colors">
                <span className="relative">
                  support@veyro.in
                  <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-veyro-accent transition-all duration-200 ease-out group-hover:w-full" />
                </span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1.5 shrink-0"
                />
              </div>
            </a>
          </div>

          {/* Self-Service Order Link */}
          <div className="mt-8 pt-6 border-t border-[#f2f4f7] flex items-center justify-center">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#475467] hover:text-[#101828] font-medium transition-colors group cursor-pointer"
            >
              <Package
                size={16}
                className="text-[#667085] group-hover:text-[#101828] transition-transform duration-200 group-hover:scale-110"
              />
              <span>Looking for an existing package?</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#101828] group-hover:text-veyro-accent transition-colors">
                <span className="relative">
                  Track live order status
                  <span className="absolute left-0 -bottom-0.5 w-0 h-[1.5px] bg-veyro-accent transition-all duration-200 ease-out group-hover:w-full" />
                </span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1.5 shrink-0"
                />
              </span>
            </Link>
          </div>
        </div>
      </Container>
    </motion.div>
  );
}
