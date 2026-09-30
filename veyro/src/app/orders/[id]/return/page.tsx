"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import {
  ArrowLeft,
  Package,
  CheckCircle2,
  Check,
  ArrowRight,
  AlertTriangle,
  Maximize,
  Minimize,
  PackageX,
  RotateCcw,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  Box,
} from "lucide-react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { getReturnEligibility } from "@/utils/orderUtils";
import { motion, AnimatePresence } from "framer-motion";

const REASONS = [
  { id: "Size is too small", title: "Size is too small", description: "The fit is smaller than expected.", icon: Maximize },
  { id: "Size is too large", title: "Size is too large", description: "The fit is larger than expected.", icon: Minimize },
  { id: "Item defective / Damaged", title: "Item defective / Damaged", description: "Received a damaged or faulty product.", icon: PackageX },
  { id: "Received wrong item", title: "Received wrong item", description: "The item received is different from what I ordered.", icon: Package },
  { id: "Changed my mind", title: "Changed my mind", description: "I no longer want this item.", icon: RotateCcw },
  { id: "Other", title: "Other", description: "Please specify your reason.", icon: MessageSquare },
];

export default function ReturnPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, orders, openAccountModal, requestReturn } = useUser();
  const orderId = typeof id === "string" ? decodeURIComponent(id) : "";
  const order = orders.find((o) => o.id === orderId);

  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  
  // Custom dropdown state
  const [reason, setReason] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [details, setDetails] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── GUEST GATE ───────────────────────────────────────────────────────────
  if (!order && !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-neutral-50">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-white border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-3">
            Sign In To Proceed
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            Please sign in to request a return.
          </p>
          <button
            type="button"
            onClick={openAccountModal}
            className="inline-flex items-center gap-2 bg-[#fcd017] text-black px-8 py-3.5 text-sm font-bold rounded-xl hover:bg-[#e6bd15] transition-all cursor-pointer"
          >
            <span>SIGN IN</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ── ORDER NOT FOUND ──────────────────────────────────────────────────────
  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-neutral-50">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-3">
            Order Not Found
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            We couldn't find order #{orderId}.
          </p>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 text-sm font-bold rounded-xl hover:bg-neutral-800 transition-all"
          >
            <ArrowLeft size={16} />
            <span>BACK TO ORDERS</span>
          </Link>
        </div>
      </div>
    );
  }

  // ── ELIGIBILITY CHECK ────────────────────────────────────────────────────
  const { isEligible, reason: ineligibilityReason } = getReturnEligibility(order);

  if (!isEligible && !isSubmitted) {
    return (
      <Container className="py-12 md:py-16 px-4 md:px-6 bg-neutral-50 min-h-screen">
        <div className="max-w-xl mx-auto text-center mt-12">
          <div className="w-20 h-20 bg-white border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AlertTriangle size={32} className="text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-3">
            Not Eligible
          </h1>
          <p className="text-sm text-neutral-500 mb-8">{ineligibilityReason}</p>
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 text-sm font-bold rounded-xl hover:bg-neutral-800 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Back to Order</span>
          </Link>
        </div>
      </Container>
    );
  }

  // ── SUBMISSION HANDLER ───────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndices.length === 0 || !reason) return;

    requestReturn(order.id, selectedIndices, reason, details);
    setIsSubmitted(true);
  };

  const toggleItemSelection = (index: number) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
      // Auto-clear reason if no items selected
      if (selectedIndices.length === 1) setReason("");
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  if (isSubmitted) {
    return (
      <Container className="py-12 md:py-24 px-4 md:px-6 bg-neutral-50 min-h-screen">
        <div className="max-w-xl mx-auto text-center animate-in fade-in zoom-in duration-500 mt-12">
          <div className="w-24 h-24 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
            <CheckCircle2 size={40} className="text-green-600 stroke-[2]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-4">
            Request Received
          </h1>
          <p className="text-neutral-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Your return request for Order #{order.id} has been submitted successfully. Our team will review it and notify you via email.
          </p>
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex items-center justify-center bg-[#fcd017] text-black px-8 py-4 text-sm font-bold rounded-xl hover:bg-[#e6bd15] transition-colors w-full sm:w-auto"
          >
            Return to Order
          </Link>
        </div>
      </Container>
    );
  }

  const selectedReasonData = REASONS.find(r => r.id === reason);

  // Calculate refund estimate for summary
  const estimatedRefund = selectedIndices.reduce((sum, idx) => {
    const item = order.items?.[idx];
    return sum + (item ? item.unitPrice * item.quantity : 0);
  }, 0);

  // Dynamic progress calculation for Stepper
  let currentStep = 1; // Step 1 is "Return Method" (always complete)
  if (selectedIndices.length > 0) currentStep = 2; // Step 2 is "Select Items"
  if (selectedIndices.length > 0 && reason !== "") currentStep = 3; // Step 3 is "Provide Details"
  
  // Calculate width for the connecting yellow line
  // Total 3 segments. 1->2 is 16% to 50%. 2->3 is 50% to 83%.
  let lineWidth = "16%";
  if (currentStep === 2) lineWidth = "50%";
  if (currentStep === 3) lineWidth = "83%";

  const isFormValid = selectedIndices.length > 0 && reason !== "";

  return (
    <div className="bg-[#fafafa] min-h-screen pb-24 font-sans text-neutral-900 overflow-x-hidden">
      <Container className="px-4 sm:px-8 max-w-[1200px] mx-auto py-8">
        
        {/* BREADCRUMBS */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 md:gap-4 text-sm text-neutral-500 mb-8"
        >
          <Link href={`/orders/${order.id}`} className="group flex items-center gap-1.5 hover:text-[#111111] transition-colors font-medium">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </Link>
          <span className="text-neutral-300 px-1 md:px-2">|</span>
          <Link href="/" className="hover:text-[#111111] transition-colors">Home</Link>
          <span className="text-neutral-400 text-[10px] px-0.5">&gt;</span>
          <Link href="/orders" className="hover:text-[#111111] transition-colors">Orders</Link>
          <span className="text-neutral-400 text-[10px] px-0.5">&gt;</span>
          <span className="text-[#111111] font-bold">Return Request</span>
        </motion.div>

        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Request a Return
          </h1>
          <p className="text-neutral-500 text-sm md:text-base">
            Follow the steps below to request a return for your item.
          </p>
        </motion.div>

        {/* DYNAMIC STEPPER */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, delay: 0.2 }}
          className="hidden sm:flex items-center justify-between max-w-3xl mx-auto mb-12 relative w-full"
        >
          {/* Background Gray Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-neutral-200 z-0 rounded-full"></div>
          
          {/* Animated Yellow Progress Line */}
          <motion.div 
             className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#fcd017] z-0 rounded-full"
             initial={{ width: "16%" }}
             animate={{ width: lineWidth }}
             transition={{ duration: 0.5, ease: "easeInOut" }}
          />

          {[
            { id: 1, label: "Return Method" },
            { id: 2, label: "Select Items" },
            { id: 3, label: "Provide Details" },
            { id: 4, label: "Review & Submit" }
          ].map((step) => {
             const isUnlocked = step.id === 4 ? isFormValid : currentStep >= step.id;
             let isActive = false;
             if (isFormValid) isActive = step.id === 4;
             else if (currentStep === 3) isActive = step.id === 3;
             else if (currentStep === 2) isActive = step.id === 2;
             else isActive = step.id === 1;

             const isCompleted = isUnlocked && !isActive;

             return (
               <div key={step.id} className="relative z-10 flex flex-col items-center bg-[#fafafa] px-2 transition-all">
                  
                  <div className="relative flex items-center justify-center">
                    {/* The actual circle */}
                    <motion.div 
                      layout
                      animate={{ 
                         scale: isActive ? 1.15 : 1,
                         backgroundColor: isUnlocked ? "#fcd017" : "#e5e5e5",
                         color: isUnlocked ? "#000000" : "#737373"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="relative z-10 w-8 h-8 rounded-full font-bold flex items-center justify-center text-sm"
                    >
                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div 
                            key="check" 
                            initial={{ scale: 0, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          >
                            <Check size={16} className="stroke-[3]" />
                          </motion.div>
                        ) : (
                          <motion.span 
                            key="number" 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                          >
                            {step.id}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  <span className={`text-[11px] mt-2 transition-colors duration-300 ${isUnlocked ? 'font-bold text-neutral-900' : 'font-medium text-neutral-400'}`}>
                    {step.label}
                  </span>
               </div>
             );
          })}
        </motion.div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN: FORM CARDS */}
          <div className="col-span-1 lg:col-span-8 space-y-6">
            
            {/* STEP 1: RETURN METHOD CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-1">
                  1. What would you like to do?
                </h2>
                <p className="text-sm text-neutral-500">
                  Choose how you'd like to proceed.
                </p>
              </div>
              
              <div className="bg-white border-2 border-neutral-900 rounded-lg p-5 flex items-center justify-between">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center shrink-0">
                     <Package size={24} className="text-neutral-900 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">Return Item(s)</h3>
                    <p className="text-sm text-neutral-600 mt-0.5">Refund to original payment method</p>
                  </div>
                </div>
                {/* Standard Clean Radio (Pre-selected) */}
                <div className="w-5 h-5 rounded-full border-[5px] border-neutral-900 bg-white ring-1 ring-neutral-900 flex items-center justify-center shrink-0 relative z-10">
                   <div className="w-1.5 h-1.5 rounded-full bg-neutral-900"></div>
                </div>
              </div>
            </motion.div>

            {/* STEP 2: SELECT ITEMS CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-1">
                    2. Select item(s)
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Choose the item(s) you want to return.
                  </p>
                </div>
                <AnimatePresence mode="popLayout">
                  {selectedIndices.length > 0 && (
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-sm font-bold text-neutral-900 bg-neutral-100 px-3 py-1 rounded-full hidden sm:block"
                    >
                      {selectedIndices.length} item{selectedIndices.length !== 1 ? 's' : ''} selected
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="space-y-4">
                {order.items?.map((item, idx) => {
                  const isSelected = selectedIndices.includes(idx);
                  return (
                    <motion.label
                      layout
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      key={idx}
                      className={`relative overflow-hidden flex items-start md:items-center gap-4 p-4 rounded-lg border cursor-pointer ${
                        isSelected ? "border-transparent shadow-md bg-white" : "border-neutral-200 hover:border-neutral-300 bg-white"
                      }`}
                    >
                      {/* Elegant Selected State Border & Background */}
                      {isSelected && (
                         <>
                           <motion.div
                             className="absolute inset-0 border-2 border-neutral-900 rounded-lg pointer-events-none z-10"
                             initial={{ opacity: 0, scale: 0.98 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ duration: 0.2, ease: "easeOut" }}
                           />
                           <motion.div
                             className="absolute inset-0 bg-neutral-900/[0.02] pointer-events-none z-0"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ duration: 0.3 }}
                           />
                         </>
                      )}

                      {/* Clean Square Checkbox */}
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={isSelected} 
                        onChange={() => toggleItemSelection(idx)}
                      />
                      <div className="flex flex-col items-center justify-center pt-2 md:pt-0 shrink-0 pl-1 z-10 relative">
                        <motion.div 
                          layout
                          className={`w-5 h-5 rounded-[4px] border flex items-center justify-center transition-colors duration-300 ${
                            isSelected ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-300 bg-white text-transparent"
                          }`}
                        >
                          <motion.div
                            initial={false}
                            animate={{ scale: isSelected ? 1 : 0.5, opacity: isSelected ? 1 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check size={14} className="stroke-[3]" />
                          </motion.div>
                        </motion.div>
                      </div>
                      
                      {/* Image */}
                      {item.imageUrl && (
                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/50 z-10 relative">
                          <motion.div 
                            animate={{ scale: isSelected ? 1.08 : 1 }} 
                            transition={{ duration: 0.4, ease: "easeOut" }} 
                            className="w-full h-full relative"
                          >
                            <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                          </motion.div>
                        </div>
                      )}
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
                        <div>
                          <motion.h3 layout className="text-sm font-bold text-neutral-900 truncate">{item.productName}</motion.h3>
                          <motion.p layout className="text-xs text-neutral-500 mt-1">{item.colorName} • Size {item.selectedSize}</motion.p>
                          <motion.p layout className="text-sm font-bold text-neutral-900 mt-2">{formatPrice(item.unitPrice)}</motion.p>
                        </div>
                        
                        {/* Eligibility Tags */}
                        <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                           <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-green-100 text-green-800">
                             Eligible for return
                           </span>
                           <span className="text-[11px] text-neutral-500">
                             Return valid until {new Date(order.deliveredDate || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                           </span>
                        </div>
                      </div>
                    </motion.label>
                  );
                })}
              </div>
            </motion.div>

            {/* STEP 3: PROVIDE DETAILS CARD (PROGRESSIVE DISCLOSURE) */}
            <AnimatePresence>
              {selectedIndices.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }} 
                  exit={{ opacity: 0, height: 0, marginTop: 0, overflow: "hidden" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm relative z-10"
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-1">
                      3. Provide details
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Let us know why you're returning this item.
                    </p>
                  </div>
                  
                  <div className="space-y-6 max-w-2xl">
                    <div ref={dropdownRef} className="relative">
                      <label className="block text-xs font-bold text-neutral-900 mb-2">
                        Reason for return <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Dropdown Trigger */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`w-full flex items-center justify-between bg-white border ${isDropdownOpen ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-300 hover:border-neutral-400'} text-sm rounded-lg px-4 py-3.5 transition-all outline-none shadow-sm`}
                      >
                        <div className="flex items-center gap-3">
                          <AnimatePresence mode="wait">
                            {selectedReasonData ? (
                              <motion.div 
                                key="selected"
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                                className="flex items-center gap-3"
                              >
                                <selectedReasonData.icon size={18} className="text-neutral-900" />
                                <span className="font-bold text-neutral-900">{selectedReasonData.title}</span>
                              </motion.div>
                            ) : (
                              <motion.div 
                                key="placeholder"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-3"
                              >
                                 <Box size={18} className="text-neutral-400" />
                                <span className="text-neutral-400 font-medium">Select a reason...</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {isDropdownOpen ? (
                          <ChevronUp size={18} className="text-neutral-500" />
                        ) : (
                          <ChevronDown size={18} className="text-neutral-500" />
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -5, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-xl overflow-hidden"
                          >
                            <div className="py-1 max-h-60 overflow-y-auto">
                              {REASONS.map((r) => {
                                const isSelected = reason === r.id;
                                return (
                                  <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => {
                                      setReason(r.id);
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-neutral-50 ${isSelected ? 'bg-neutral-50 font-medium' : ''}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <r.icon size={16} className={isSelected ? 'text-neutral-900' : 'text-neutral-400'} />
                                      <span className={`text-sm ${isSelected ? 'font-bold text-neutral-900' : 'text-neutral-700'}`}>{r.title}</span>
                                    </div>
                                    {isSelected && <Check size={16} className="text-neutral-900 stroke-[3]" />}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: 0.2 }}
                    >
                      <label className="block text-xs font-bold text-neutral-900 mb-2">
                        Additional details (optional)
                      </label>
                      <div className="relative">
                        <textarea
                          value={details}
                          onChange={(e) => setDetails(e.target.value.slice(0, 500))}
                          placeholder="Any other feedback? (e.g. fit, quality, packaging)"
                          rows={4}
                          className="w-full bg-white border border-neutral-300 text-sm rounded-lg px-4 py-3.5 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 resize-none transition-all shadow-sm"
                        />
                        <span className="absolute bottom-3 right-3 text-[11px] text-neutral-400">
                          {details.length}/500
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* RIGHT COLUMN: STICKY SUMMARY */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.4, delay: 0.5 }}
            className="col-span-1 lg:col-span-4"
          >
            <div className="sticky top-24 bg-white border border-neutral-200 rounded-xl p-6 shadow-sm overflow-hidden">
              <h3 className="text-base font-bold text-neutral-900 mb-6">
                Return Summary
              </h3>
              
              {/* Product Preview Miniature */}
              <AnimatePresence mode="popLayout">
                {selectedIndices.length > 0 ? (
                   <motion.div 
                      key="selected-preview"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex items-start gap-3 p-3 bg-[#fafafa] border border-neutral-100 rounded-lg mb-6"
                    >
                      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-white shrink-0 shadow-sm border border-neutral-200/50">
                         {order.items?.[selectedIndices[0]]?.imageUrl && (
                            <Image src={order.items[selectedIndices[0]].imageUrl} alt="" fill className="object-cover" />
                         )}
                      </div>
                      <div className="flex-1 min-w-0 py-0.5">
                         <h4 className="text-[13px] font-bold text-neutral-900 leading-tight line-clamp-2 pr-2">{order.items?.[selectedIndices[0]]?.productName}</h4>
                         <p className="text-[11px] text-neutral-500 mt-1 truncate">{order.items?.[selectedIndices[0]]?.colorName} • Size {order.items?.[selectedIndices[0]]?.selectedSize} • Qty 1</p>
                      </div>
                      <div className="text-[13px] font-bold text-neutral-900 py-0.5">
                         {formatPrice(order.items?.[selectedIndices[0]]?.unitPrice || 0)}
                      </div>
                   </motion.div>
                ) : (
                   <motion.div 
                      key="empty-preview"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-center p-6 bg-neutral-50 rounded-lg border border-dashed border-neutral-200 mb-6"
                   >
                     <Package size={24} className="text-neutral-300 mx-auto mb-2" />
                     <p className="text-xs text-neutral-500 font-medium">Select items to return</p>
                   </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-start text-sm">
                  <span className="text-neutral-500">Order ID</span>
                  <span className="font-bold text-neutral-900">#{order.id}</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-neutral-500">Action</span>
                  <span className="font-medium text-neutral-900">Return</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <span className="text-neutral-500">Items Selected</span>
                  <span className="font-medium text-neutral-900">
                    {selectedIndices.length}
                  </span>
                </div>
              </div>

              <div className="pt-5 border-t border-neutral-200 border-dashed mb-6">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-neutral-900">
                      Estimated Refund
                    </span>
                    <Info size={14} className="text-neutral-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-neutral-900">
                    {formatPrice(estimatedRefund)}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500">Refund to original payment method.</p>
              </div>

              {/* Timeline Box */}
              <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-4 flex gap-3 mb-6">
                 <Calendar size={18} className="text-neutral-700 shrink-0 mt-0.5" />
                 <div>
                    <h4 className="text-[12px] font-bold text-neutral-900 mb-1">Refund Timeline</h4>
                    <p className="text-[11px] text-neutral-500 leading-snug">
                      Estimated within 5-7 business days<br/>
                      You'll receive an update via email once processed.
                    </p>
                 </div>
              </div>

              <motion.button
                layout
                whileHover={isFormValid ? { scale: 1.02, y: -2, boxShadow: "0 10px 25px -5px rgba(252, 208, 23, 0.4)" } : {}}
                whileTap={isFormValid ? { scale: 0.98, y: 0 } : {}}
                type="submit"
                disabled={!isFormValid}
                className="relative overflow-hidden w-full bg-[#fcd017] text-black px-6 py-4 text-sm font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {/* Shimmer Effect */}
                {isFormValid && (
                  <motion.div
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-0"
                    animate={{ translateX: ["-100%", "200%"] }}
                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2.5 }}
                  />
                )}
                <span className="relative z-10">Submit Request</span>
                <ArrowRight size={16} className="stroke-[2.5] group-hover:translate-x-1.5 transition-transform duration-300 relative z-10" />
              </motion.button>
            </div>
          </motion.div>

        </form>
      </Container>
    </div>
  );
}
