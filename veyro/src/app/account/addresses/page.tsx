"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Container } from "@/components/ui/Container";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Check,
  ShieldCheck,
  ArrowRight,
  Truck,
  ChevronRight,
  Copy,
  CheckCheck,
  Edit3,
  X,
  Package,
  LogOut,
  Sparkles,
} from "lucide-react";

export default function MyProfilePage() {
  const { user, openAccountModal, orders, updateProfile, logout } = useUser();

  // ── FORM STATE ─────────────────────────────────────────────────────────────
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Personal form values
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Address form values
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  // Feedback states
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize local form inputs when user context loads or updates
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");

      if (user.address) {
        setLine1(user.address.line1 || "");
        setCity(user.address.city || "");
        setState(user.address.state || "");
        setPincode(user.address.pincode || "");
      }
    }
  }, [user]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3000);
  };

  // ── GUEST GATE ─────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-neutral-50/70">
        <div className="text-center max-w-md mx-auto bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
          <div className="w-14 h-14 bg-neutral-100 text-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon size={24} />
          </div>
          <h1 className="text-xl font-bold text-neutral-900 mb-2">
            Sign In to View Your Profile
          </h1>
          <p className="text-xs text-neutral-500 leading-relaxed mb-6 max-w-xs mx-auto">
            Please sign in to manage your profile details, contact information, and default delivery address.
          </p>
          <button
            type="button"
            onClick={openAccountModal}
            className="inline-flex items-center justify-center gap-2 w-full bg-neutral-900 text-white px-6 py-3 text-xs font-semibold rounded-lg hover:bg-black transition-colors cursor-pointer"
          >
            <span>Sign In to Your Account</span>
            <ArrowRight size={14} />
          </button>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-neutral-400">
            <ShieldCheck size={13} className="text-neutral-500" />
            <span>Secure 256-Bit SSL Encrypted Profile</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback defaults for user address
  const activeAddress = user.address || {
    line1: "42, Richmond Road, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
  };

  const formattedAddressString = `${activeAddress.line1}, ${activeAddress.city}, ${activeAddress.state} - ${activeAddress.pincode}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${user.name}, ${user.phone}\n${formattedAddressString}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── SAVE HANDLERS ──────────────────────────────────────────────────────────
  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
    });

    setIsEditingPersonal(false);
    showToast("Profile details updated successfully");
  };

  const handleCancelPersonal = () => {
    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setIsEditingPersonal(false);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!line1.trim() || !city.trim() || !pincode.trim()) return;

    updateProfile({
      address: {
        line1: line1.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      },
    });

    setIsEditingAddress(false);
    showToast("Delivery address updated successfully");
  };

  const handleCancelAddress = () => {
    setLine1(activeAddress.line1 || "");
    setCity(activeAddress.city || "");
    setState(activeAddress.state || "");
    setPincode(activeAddress.pincode || "");
    setIsEditingAddress(false);
  };

  const activeOrdersCount = orders.filter((o) => o.status !== "Delivered").length;

  // Initials for avatar
  const initials = user.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="bg-neutral-50/70 min-h-screen pb-20">
      {/* Top Banner / Breadcrumbs */}
      <div className="border-b border-neutral-200/80 bg-white">
        <Container>
          <div className="py-3.5 flex items-center justify-between text-xs text-neutral-500">
            <div className="flex items-center gap-2 text-xs">
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} className="text-neutral-400" />
              <Link href="/orders" className="hover:text-neutral-900 transition-colors">
                My Account
              </Link>
              <ChevronRight size={12} className="text-neutral-400" />
              <span className="text-neutral-900 font-semibold">
                My Profile
              </span>
            </div>

            {activeOrdersCount > 0 && (
              <Link
                href="/orders"
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:text-black transition-colors"
              >
                <Truck size={14} className="text-neutral-700" />
                <span>{activeOrdersCount} Active Order{activeOrdersCount > 1 ? "s" : ""}</span>
                <ArrowRight size={11} className="text-neutral-400" />
              </Link>
            )}
          </div>
        </Container>
      </div>

      <Container className="pt-8 sm:pt-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                  My Profile
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500">
                Manage your personal info, contact details, and default delivery address.
              </p>
            </div>

            {/* Quick Switch to Orders */}
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 bg-white border border-neutral-200/80 px-3.5 py-2 rounded-lg hover:border-neutral-300 transition-colors shadow-2xs self-start sm:self-auto"
            >
              <Package size={14} />
              <span>Order History</span>
            </Link>
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-neutral-900 text-white px-4 py-3 rounded-lg text-xs font-medium flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <CheckCheck size={16} className="text-emerald-400" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column: Personal Info + Delivery Address */}
          <div className="lg:col-span-7 space-y-6">

            {/* ── CARD 1: PERSONAL INFORMATION ── */}
            <div className="bg-white border border-neutral-200/90 rounded-xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
                    <UserIcon size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900">
                      Personal Information
                    </h2>
                    <p className="text-[11px] text-neutral-500">
                      Your identity and contact credentials
                    </p>
                  </div>
                </div>

                {!isEditingPersonal ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingPersonal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded-md hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancelPersonal}
                    className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <X size={13} />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              {!isEditingPersonal ? (
                /* View Mode */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                      Full Name
                    </span>
                    <p className="text-sm font-semibold text-neutral-900">
                      {user.name || "—"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                      Email Address
                    </span>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-neutral-900 truncate">
                        {user.email || "—"}
                      </p>
                      <span className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2 pt-1 border-t border-neutral-50">
                    <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                      Phone Number
                    </span>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-neutral-400" />
                      <p className="text-sm font-semibold text-neutral-900">
                        {user.phone || "+91 98765 43210"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <form onSubmit={handleSavePersonal} className="space-y-4">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="block text-xs font-semibold text-neutral-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Santhosh Kumar"
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="profile-email"
                        className="block text-xs font-semibold text-neutral-700 mb-1"
                      >
                        Email Address
                      </label>
                      <input
                        id="profile-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="profile-phone"
                        className="block text-xs font-semibold text-neutral-700 mb-1"
                      >
                        Phone Number
                      </label>
                      <input
                        id="profile-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-black transition-colors cursor-pointer"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPersonal}
                      className="bg-neutral-100 text-neutral-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ── CARD 2: SAVED DELIVERY ADDRESS ── */}
            <div className="bg-white border border-neutral-200/90 rounded-xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900">
                      Saved Delivery Address
                    </h2>
                    <p className="text-[11px] text-neutral-500">
                      Default shipping destination for 1-click checkout
                    </p>
                  </div>
                </div>

                {!isEditingAddress ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded-md hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancelAddress}
                    className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    <X size={13} />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              {!isEditingAddress ? (
                /* View Mode */
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-neutral-900 text-white px-2 py-0.5 rounded">
                        <Check size={11} /> Default Address
                      </span>
                      <span className="text-[11px] text-neutral-500 font-medium px-2 py-0.5 bg-neutral-100 rounded">
                        Home
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyAddress}
                      aria-label="Copy address text"
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 px-2.5 py-1 rounded-md hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <CheckCheck size={13} className="text-emerald-600" />
                          <span className="text-emerald-600 font-semibold text-xs">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-lg bg-neutral-50/80 border border-neutral-200/70 space-y-1.5">
                    <div className="text-xs font-bold text-neutral-900">
                      {user.name}
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {activeAddress.line1}
                    </p>
                    <p className="text-xs text-neutral-600">
                      {activeAddress.city}, {activeAddress.state} —{" "}
                      <span className="font-semibold text-neutral-900">
                        {activeAddress.pincode}
                      </span>
                    </p>
                    <p className="text-[11px] text-neutral-500 pt-1">
                      Phone: <span className="text-neutral-800 font-medium">{user.phone || "+91 98765 43210"}</span>
                    </p>
                  </div>
                </div>
              ) : (
                /* Edit Mode */
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  <div>
                    <label
                      htmlFor="addr-line1"
                      className="block text-xs font-semibold text-neutral-700 mb-1"
                    >
                      Flat / House No. / Building / Street
                    </label>
                    <input
                      id="addr-line1"
                      type="text"
                      required
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="42, Richmond Road, Indiranagar"
                      className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="addr-city"
                        className="block text-xs font-semibold text-neutral-700 mb-1"
                      >
                        City
                      </label>
                      <input
                        id="addr-city"
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="addr-state"
                        className="block text-xs font-semibold text-neutral-700 mb-1"
                      >
                        State
                      </label>
                      <input
                        id="addr-state"
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Karnataka"
                        className="w-full text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="addr-pincode"
                      className="block text-xs font-semibold text-neutral-700 mb-1"
                    >
                      Postal Code / PIN Code
                    </label>
                    <input
                      id="addr-pincode"
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="560038"
                      className="w-full sm:w-1/2 text-xs sm:text-sm px-3 py-2 border border-neutral-300 rounded-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-black transition-colors cursor-pointer"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAddress}
                      className="bg-neutral-100 text-neutral-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Sidebar: Profile Snapshot & Perks */}
          <div className="lg:col-span-5 space-y-6">
            {/* Account Card */}
            <div className="bg-white border border-neutral-200/90 rounded-xl p-6 shadow-xs">
              <div className="flex flex-col items-center text-center pb-6 border-b border-neutral-100">
                <div className="w-16 h-16 rounded-full bg-neutral-900 text-white font-bold text-xl flex items-center justify-center shadow-md mb-3 ring-4 ring-neutral-50">
                  {initials}
                </div>
                <div className="text-base font-bold text-neutral-900">
                  {user.name}
                </div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {user.email}
                </div>
                <div className="inline-block mt-3 bg-neutral-100/80 px-3 py-1 rounded-full border border-neutral-200/60">
                  <span className="text-[10px] font-semibold text-neutral-500 tracking-wide uppercase">
                    Member since {user.memberSince || "Sep 2026"}
                  </span>
                </div>
              </div>

              {/* VIP Perks */}
              <div className="pt-4 space-y-3.5">
                <div className="text-xs font-bold text-neutral-900">
                  Member Privileges
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Truck size={13} />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Free Express Delivery</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Complimentary 48-hour priority dispatch.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles size={13} />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">VIP Early Drops</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">Private early links before general releases.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck size={13} />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">Hassle-Free Returns</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">7-day pickup guarantee with instant refunds.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-4 border-t border-neutral-100 space-y-2">
                <Link
                  href="/orders"
                  className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-neutral-800 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Package size={14} className="text-neutral-600" />
                    <span>View All Orders</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">→</span>
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-neutral-600 hover:text-red-600 hover:bg-red-50/70 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>

            {/* Security Guarantee Card */}
            <div className="border border-neutral-200/80 bg-white rounded-xl p-4 shadow-2xs flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-neutral-900 block">
                  Encrypted & Secure
                </span>
                <span className="text-neutral-500 text-[11px]">
                  Your credentials and addresses are stored securely on your local device.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
