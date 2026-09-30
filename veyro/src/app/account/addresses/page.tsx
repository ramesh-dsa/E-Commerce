"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Container } from "@/components/ui/Container";
import { 
  User, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  Star, 
  RefreshCcw, 
  Package, 
  LogOut, 
  ChevronRight,
  Pencil,
  Home
} from "lucide-react";

export default function AccountPage() {
  const { user, demoLogin, logout, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

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
    return <div className="min-h-screen bg-[#FAFAFA]" />;
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
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
        <div className="max-w-sm w-full text-center px-6">
          <h1 className="text-3xl font-bold text-[#111111] mb-3">
            My Account
          </h1>
          <p className="text-[15px] text-[#666666] mb-10">
            Sign in to manage your profile and preferences.
          </p>
          <button
            onClick={demoLogin}
            className="w-full h-12 bg-[#111111] text-white text-[14px] font-medium rounded-lg hover:bg-[#333333] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-32">
      <Container className="pt-8 md:pt-10 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#666666] mb-8">
          <Link href="/" className="hover:text-[#111111] transition-colors">Home</Link>
          <ChevronRight size={14} className="opacity-60" />
          <span className="hover:text-[#111111] cursor-pointer">My Account</span>
          <ChevronRight size={14} className="opacity-60" />
          <span className="text-[#111111] font-semibold">My Profile</span>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div className="mb-8 p-3 bg-green-50 border border-green-100 text-green-700 text-[13px] font-medium rounded-lg flex items-center gap-2">
            <CheckCircle2 size={16} />
            Profile updated successfully.
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-[65%]">
            <div className="mb-12">
              <h1 className="text-[32px] font-bold text-[#111111] mb-1 tracking-tight">
                My Profile
              </h1>
              <p className="text-[14px] text-[#666666]">
                Manage your personal information, contact details, and default delivery address.
              </p>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-12">
                {/* Edit Form: Personal Info */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#FFF4C2] flex items-center justify-center text-[#111111]">
                      <User size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-bold text-[#111111]">Personal Information</h2>
                      <p className="text-[13px] text-[#666666]">Your identity and contact details</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#888888]">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-[#EAEAEA] rounded-lg text-[14px] focus:border-[#111111] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#888888]">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-[#EAEAEA] rounded-lg text-[14px] focus:border-[#111111] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#888888]">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-[#EAEAEA] rounded-lg text-[14px] focus:border-[#111111] outline-none"
                      />
                    </div>
                  </div>
                </section>
                
                {/* Edit Form: Delivery Address */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#FFF4C2] flex items-center justify-center text-[#111111]">
                      <MapPin size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-[18px] font-bold text-[#111111]">Saved Delivery Address</h2>
                      <p className="text-[13px] text-[#666666]">Default shipping destination for a faster checkout</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#888888]">Address Line 1</label>
                      <input
                        required
                        type="text"
                        value={formData.addressLine1}
                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-[#EAEAEA] rounded-lg text-[14px] focus:border-[#111111] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#888888]">City</label>
                      <input
                        required
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-[#EAEAEA] rounded-lg text-[14px] focus:border-[#111111] outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#888888]">State</label>
                      <input
                        required
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-[#EAEAEA] rounded-lg text-[14px] focus:border-[#111111] outline-none"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-[11px] uppercase tracking-wider font-semibold text-[#888888]">Pincode</label>
                      <input
                        required
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-[#EAEAEA] rounded-lg text-[14px] focus:border-[#111111] outline-none"
                      />
                    </div>
                  </div>
                </section>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="h-10 px-6 bg-[#111111] text-white text-[13px] font-medium rounded-lg hover:bg-[#333333] transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="h-10 px-6 bg-white border border-[#EAEAEA] text-[#111111] text-[13px] font-medium rounded-lg hover:bg-[#F9F9F9] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-12">
                {/* View: Personal Info */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FFF4C2] flex items-center justify-center text-[#111111]">
                        <User size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h2 className="text-[18px] font-bold text-[#111111]">Personal Information</h2>
                        <p className="text-[13px] text-[#666666]">Your identity and contact details</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-[13px] font-semibold text-[#111111] hover:text-[#666666] transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  </div>
                  
                  <div className="border-t border-b border-[#F0F0F0]">
                    <div className="py-4 border-b border-[#F0F0F0]">
                      <span className="block text-[10px] uppercase tracking-wider font-bold text-[#888888] mb-1">Full Name</span>
                      <span className="text-[15px] font-medium text-[#111111]">{user.name}</span>
                    </div>
                    <div className="py-4 border-b border-[#F0F0F0] flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider font-bold text-[#888888] mb-1">Email Address</span>
                        <span className="text-[15px] font-medium text-[#111111]">{user.email}</span>
                      </div>
                      <div className="bg-[#EBF7EF] text-[#228646] px-2.5 py-1 rounded flex items-center gap-1.5 text-[11px] font-bold">
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                        Verified
                      </div>
                    </div>
                    <div className="py-4">
                      <span className="block text-[10px] uppercase tracking-wider font-bold text-[#888888] mb-1">Phone Number</span>
                      <span className="text-[15px] font-medium text-[#111111]">{user.phone || "—"}</span>
                    </div>
                  </div>
                </section>

                {/* View: Address Info */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#FFF4C2] flex items-center justify-center text-[#111111]">
                        <MapPin size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h2 className="text-[18px] font-bold text-[#111111]">Saved Delivery Address</h2>
                        <p className="text-[13px] text-[#666666]">Default shipping destination for a faster checkout</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-[13px] font-semibold text-[#111111] hover:text-[#666666] transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  </div>

                  {user.address && user.address.line1 ? (
                    <div className="bg-[#FFF9D6] border border-[#F3EBB2] rounded-xl p-5">
                      <div className="inline-flex items-center gap-1.5 bg-[#FFD400] text-[#111111] px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider mb-4">
                        <Home size={12} strokeWidth={2.5} />
                        Default Address
                      </div>
                      <div className="text-[15px] text-[#111111] leading-[1.6]">
                        <p className="font-bold text-[15px] mb-1">{user.name}</p>
                        <p>{user.address.line1}</p>
                        <p>{user.address.city}, {user.address.state} — {user.address.pincode}</p>
                        <p>India</p>
                        {user.phone && (
                          <p className="mt-2">Phone: <span className="font-medium">{user.phone}</span></p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#EAEAEA] rounded-xl p-6 text-center">
                      <p className="text-[14px] text-[#666666] mb-4">No saved address.</p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[14px] font-medium text-[#111111] underline underline-offset-4"
                      >
                        Add Address
                      </button>
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>

          {/* RIGHT CONTENT (Sidebar) */}
          <div className="w-full lg:w-[35%] lg:pl-12 lg:border-l border-[#F0F0F0]">
            
            <div className="flex justify-end mb-8">
              <Link 
                href="/orders" 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EAEAEA] rounded-lg text-[13px] font-medium text-[#111111] hover:bg-[#F9F9F9] transition-colors"
              >
                <Package size={16} strokeWidth={1.5} />
                Order History
              </Link>
            </div>

            {/* Identity Profile */}
            <div className="flex flex-col items-start mb-10">
              <div className="w-20 h-20 bg-[#111111] rounded-full flex items-center justify-center mb-4">
                <span className="text-[28px] font-bold text-white tracking-widest">
                  {user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                </span>
              </div>
              <h3 className="text-[20px] font-bold text-[#111111] mb-1">{user.name}</h3>
              <p className="text-[14px] text-[#666666] mb-4">{user.email}</p>
              <div className="bg-[#F0F0F0] text-[#444444] text-[11px] font-semibold px-3.5 py-1.5 rounded-full">
                Member Since {user.memberSince || "Sep 2026"}
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-10 pt-8 border-t border-[#F0F0F0]">
              <h4 className="text-[14px] font-bold text-[#111111] mb-6">Your Benefits</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <Truck size={22} strokeWidth={1.5} className="text-[#111111]" />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-[#111111] mb-0.5">Free Express Delivery</h5>
                    <p className="text-[12px] text-[#666666]">Complimentary 48-hour priority dispatch.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <Star size={22} strokeWidth={1.5} className="text-[#111111]" />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-[#111111] mb-0.5">Early Access to Drops</h5>
                    <p className="text-[12px] text-[#666666]">Be the first to shop new collections.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <RefreshCcw size={22} strokeWidth={1.5} className="text-[#111111]" />
                  </div>
                  <div>
                    <h5 className="text-[14px] font-bold text-[#111111] mb-0.5">Easy Returns</h5>
                    <p className="text-[12px] text-[#666666]">7-day pickup guarantee with instant refunds.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-[#F0F0F0]">
              <h4 className="text-[14px] font-bold text-[#111111] mb-4 mt-6">Account Actions</h4>
              <div className="flex flex-col border-t border-[#F0F0F0]">
                <Link 
                  href="/orders"
                  className="flex items-center justify-between py-4 border-b border-[#F0F0F0] group"
                >
                  <div className="flex items-center gap-3">
                    <Package size={20} strokeWidth={1.5} className="text-[#111111]" />
                    <span className="text-[14px] font-bold text-[#111111]">View Order History</span>
                  </div>
                  <ChevronRight size={16} className="text-[#999999] group-hover:text-[#111111] transition-colors" />
                </Link>
                
                <button
                  onClick={logout}
                  className="flex items-center justify-between py-4 border-b border-[#F0F0F0] group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={20} strokeWidth={1.5} className="text-[#111111]" />
                    <span className="text-[14px] font-bold text-[#111111]">Sign Out</span>
                  </div>
                  <ChevronRight size={16} className="text-[#999999] group-hover:text-[#111111] transition-colors" />
                </button>
              </div>
            </div>
            
          </div>

        </div>
      </Container>
    </div>
  );
}
