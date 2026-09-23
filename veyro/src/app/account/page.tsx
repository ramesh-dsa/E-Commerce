"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import {
  UserCircle,
  MapPin,
  Package,
  LogOut,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

export default function AccountPage() {
  const { user, demoLogin, logout, updateProfile, orders } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Sync user data to form when user changes or edit mode is toggled
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        addressLine1: user.address?.line1 || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        pincode: user.address?.pincode || "",
      });
    }
  }, [user, isEditing]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f6]">
        <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: {
        line1: formData.addressLine1,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    });
    setIsEditing(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f8f6] py-20 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-xl text-center border border-[#e8e8e5]">
          <div className="w-16 h-16 bg-[#f4f2ee] rounded-full flex items-center justify-center mx-auto mb-6 text-[#111111]">
            <UserCircle size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#111111] mb-2">
            My Account
          </h1>
          <p className="text-sm text-[#777777] mb-8">
            Access your order history, saved addresses, and manage your VEYRO profile.
          </p>
          <button
            onClick={demoLogin}
            className="w-full h-12 bg-[#111111] text-white text-xs font-bold uppercase tracking-[0.15em] rounded-xs hover:bg-[#333333] transition-colors shadow-lg"
          >
            Sign In Securely
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] pb-24">
      {/* Editorial Header */}
      <div className="bg-[#111111] text-white pt-24 pb-16 px-5 sm:px-8">
        <Container>
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shrink-0 shadow-2xl">
                <span className="text-2xl font-black uppercase tracking-widest text-[#fcd017]">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-1">
                  {user.name}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <span className="text-sm text-neutral-400 font-mono">
                    {user.email}
                  </span>
                  {user.isVIP && (
                    <span className="px-2 py-0.5 bg-[#fcd017] text-[#111111] text-[9px] font-black uppercase tracking-widest rounded-xs flex items-center gap-1 shadow-md">
                      <ShieldCheck size={10} /> VIP MEMBER
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xs transition-colors flex items-center gap-2 border border-white/10"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </Container>
      </div>

      <Container className="mt-[-2rem] relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-0">
          
          {/* Left Sidebar Navigation */}
          <div className="lg:col-span-3 space-y-2 hidden sm:block">
            <div className="bg-white rounded-[2px] shadow-sm border border-[#e8e8e5] overflow-hidden">
              <div className="p-4 border-b border-[#f0f0ed] bg-[#f8f8f6]">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e8e8e]">
                  Dashboard Menu
                </span>
              </div>
              <nav className="flex flex-col">
                <Link
                  href="/account"
                  className="flex items-center justify-between p-4 bg-[#f4f2ee] text-[#111111] font-bold border-l-2 border-[#111111] transition-colors"
                >
                  <div className="flex items-center gap-3 text-sm">
                    <UserCircle size={18} />
                    My Profile
                  </div>
                  <ChevronRight size={16} className="text-[#8e8e8e]" />
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center justify-between p-4 text-[#555555] hover:bg-[#fafaf8] hover:text-[#111111] font-semibold border-l-2 border-transparent transition-colors"
                >
                  <div className="flex items-center gap-3 text-sm">
                    <Package size={18} />
                    My Orders
                  </div>
                </Link>
              </nav>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* Success Toast */}
            {isSuccess && (
              <div className="bg-[#fcd017] text-[#111111] p-4 rounded-xs shadow-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <CheckCircle2 size={20} />
                <span className="text-sm font-bold uppercase tracking-wide">
                  Profile updated successfully.
                </span>
              </div>
            )}

            {/* Profile & Address Editor */}
            <div className="bg-white rounded-[2px] shadow-xl border border-[#e8e8e5] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#111111]" />
              
              <div className="p-6 sm:p-8 flex items-center justify-between border-b border-[#f0f0ed]">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-[#111111]">
                    Account Details
                  </h2>
                  <p className="text-xs text-[#777777] mt-1">
                    Manage your personal information and default shipping address.
                  </p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="h-10 px-4 bg-[#f8f8f6] hover:bg-[#111111] hover:text-white text-[#111111] text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 rounded-xs border border-[#e8e8e5] hover:border-[#111111]"
                  >
                    <Edit2 size={14} />
                    Edit Details
                  </button>
                )}
              </div>

              <div className="p-6 sm:p-8">
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-8">
                    {/* Personal Info */}
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8e8e8e] mb-4 pb-2 border-b border-[#f0f0ed]">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                            Full Name
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-11 bg-white border border-[#cccccc] px-4 text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-colors rounded-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                            Email Address
                          </label>
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-11 bg-white border border-[#cccccc] px-4 text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-colors rounded-xs"
                          />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full h-11 bg-white border border-[#cccccc] px-4 text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-colors rounded-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address Info */}
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8e8e8e] mb-4 pb-2 border-b border-[#f0f0ed]">
                        Default Shipping Address
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                            Address Line 1
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.addressLine1}
                            onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                            className="w-full h-11 bg-white border border-[#cccccc] px-4 text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-colors rounded-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                            City
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full h-11 bg-white border border-[#cccccc] px-4 text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-colors rounded-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                            State
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full h-11 bg-white border border-[#cccccc] px-4 text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-colors rounded-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-[#555555]">
                            Pincode
                          </label>
                          <input
                            required
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            className="w-full h-11 bg-white border border-[#cccccc] px-4 text-sm focus:border-[#111111] focus:ring-1 focus:ring-[#111111] outline-none transition-colors rounded-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-[#f0f0ed]">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 sm:flex-none h-12 px-8 bg-white border border-[#111111] text-[#111111] text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#f8f8f6] transition-colors rounded-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 sm:flex-none h-12 px-8 bg-[#111111] text-white text-xs font-bold uppercase tracking-[0.1em] hover:bg-[#333333] transition-colors shadow-lg rounded-xs cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                    {/* Read-only Personal Info */}
                    <div className="space-y-6">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8e8e8e] pb-2 border-b border-[#f0f0ed] flex items-center gap-2">
                        <UserCircle size={14} /> Personal Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="block text-[10px] uppercase text-[#8e8e8e] mb-1">Name</span>
                          <span className="text-sm font-semibold text-[#111111]">{user.name}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-[#8e8e8e] mb-1">Email Address</span>
                          <span className="text-sm font-mono text-[#333333]">{user.email}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-[#8e8e8e] mb-1">Phone Number</span>
                          <span className="text-sm font-mono text-[#333333]">{user.phone || "—"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read-only Address Info */}
                    <div className="space-y-6">
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8e8e8e] pb-2 border-b border-[#f0f0ed] flex items-center gap-2">
                        <MapPin size={14} /> Default Delivery Address
                      </h3>
                      {user.address && user.address.line1 ? (
                        <div className="bg-[#f8f8f6] p-5 rounded-xs border border-[#e8e8e5]">
                          <p className="text-sm font-semibold text-[#111111] mb-1">{user.name}</p>
                          <p className="text-sm text-[#555555] leading-relaxed">
                            {user.address.line1}<br />
                            {user.address.city}, {user.address.state}<br />
                            {user.address.pincode}
                          </p>
                          {user.phone && (
                            <p className="text-xs text-[#555555] mt-3 pt-3 border-t border-[#e8e8e5] font-mono">
                              Contact: {user.phone}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[#f4f2ee] p-5 rounded-xs border border-dashed border-[#cccccc] text-center">
                          <p className="text-sm text-[#777777] italic mb-3">No default address saved.</p>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="text-xs font-bold uppercase text-[#111111] underline hover:text-[#555555]"
                          >
                            Add Address Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Order Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-[2px] shadow-sm border border-[#e8e8e5] flex items-center gap-4">
                <div className="w-12 h-12 bg-[#111111] text-white flex items-center justify-center rounded-xs shrink-0 shadow-lg">
                  <Package size={20} />
                </div>
                <div>
                  <span className="text-2xl font-black text-[#111111]">{orders.length}</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8e8e8e]">Total Orders</p>
                </div>
              </div>
              <div className="bg-[#09090b] text-white p-6 rounded-[2px] shadow-xl border border-white/10 flex items-center gap-4 relative overflow-hidden">
                <div className="w-12 h-12 bg-[#fcd017] text-[#111111] flex items-center justify-center rounded-xs shrink-0 shadow-lg relative z-10">
                  <ShieldCheck size={20} />
                </div>
                <div className="relative z-10">
                  <span className="text-lg font-black text-[#fcd017]">VEYRO VIP</span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Since {user.memberSince || "2026"}</p>
                </div>
                <div className="absolute -right-4 -top-4 text-white/5 pointer-events-none">
                  <ShieldCheck size={120} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
