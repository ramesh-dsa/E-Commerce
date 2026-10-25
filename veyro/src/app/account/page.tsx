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
    return <div className="min-h-screen bg-neutral-50" />;
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
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
        <div className="max-w-sm w-full text-center px-6">
          <h1 className="text-3xl font-bold text-veyro-black mb-3">
            My Account
          </h1>
          <p className="text-sm text-neutral-600 mb-10">
            Sign in to manage your profile and preferences.
          </p>
          <button
            onClick={demoLogin}
            className="w-full h-12 bg-veyro-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-32">
      <Container className="pt-8 md:pt-10 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
          <Link href="/" className="hover:text-veyro-black transition-colors">Home</Link>
          <ChevronRight size={14} className="opacity-60" />
          <span className="hover:text-veyro-black cursor-pointer">My Account</span>
          <ChevronRight size={14} className="opacity-60" />
          <span className="text-veyro-black font-semibold">My Profile</span>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div className="mb-8 p-3 bg-green-50 border border-green-100 text-green-700 text-sm font-medium rounded-lg flex items-center gap-2">
            <CheckCircle2 size={16} />
            Profile updated successfully.
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* LEFT CONTENT */}
          <div className="w-full lg:w-[65%]">
            <div className="mb-12">
              <h1 className="text-[32px] font-bold text-veyro-black mb-1 tracking-tight">
                My Profile
              </h1>
              <p className="text-sm text-neutral-600">
                Manage your personal information, contact details, and default delivery address.
              </p>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-12">
                {/* Edit Form: Personal Info */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-veyro-black">
                      <User size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-veyro-black">Personal Information</h2>
                      <p className="text-sm text-neutral-600">Your identity and contact details</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Full Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:border-veyro-black outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Email Address</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:border-veyro-black outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:border-veyro-black outline-none"
                      />
                    </div>
                  </div>
                </section>
                
                {/* Edit Form: Delivery Address */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-veyro-black">
                      <MapPin size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-veyro-black">Saved Delivery Address</h2>
                      <p className="text-sm text-neutral-600">Default shipping destination for a faster checkout</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Address Line 1</label>
                      <input
                        required
                        type="text"
                        value={formData.addressLine1}
                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:border-veyro-black outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">City</label>
                      <input
                        required
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:border-veyro-black outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">State</label>
                      <input
                        required
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:border-veyro-black outline-none"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Pincode</label>
                      <input
                        required
                        type="text"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full h-11 px-3 bg-white border border-neutral-200 rounded-lg text-sm focus:border-veyro-black outline-none"
                      />
                    </div>
                  </div>
                </section>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="h-10 px-6 bg-veyro-black text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="h-10 px-6 bg-white border border-neutral-200 text-veyro-black text-sm font-medium rounded-lg hover:bg-neutral-50 transition-colors"
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
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-veyro-black">
                        <User size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-veyro-black">Personal Information</h2>
                        <p className="text-sm text-neutral-600">Your identity and contact details</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-veyro-black hover:text-neutral-600 transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  </div>
                  
                  <div className="border-t border-b border-neutral-200">
                    <div className="py-4 border-b border-neutral-200">
                      <span className="block text-2xs uppercase tracking-wider font-bold text-neutral-500 mb-1">Full Name</span>
                      <span className="text-sm font-medium text-veyro-black">{user.name}</span>
                    </div>
                    <div className="py-4 border-b border-neutral-200 flex items-center justify-between">
                      <div>
                        <span className="block text-2xs uppercase tracking-wider font-bold text-neutral-500 mb-1">Email Address</span>
                        <span className="text-sm font-medium text-veyro-black">{user.email}</span>
                      </div>
                      <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded flex items-center gap-1.5 text-xs font-bold">
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                        Verified
                      </div>
                    </div>
                    <div className="py-4">
                      <span className="block text-2xs uppercase tracking-wider font-bold text-neutral-500 mb-1">Phone Number</span>
                      <span className="text-sm font-medium text-veyro-black">{user.phone || "—"}</span>
                    </div>
                  </div>
                </section>

                {/* View: Address Info */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-veyro-black">
                        <MapPin size={20} strokeWidth={1.5} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-veyro-black">Saved Delivery Address</h2>
                        <p className="text-sm text-neutral-600">Default shipping destination for a faster checkout</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-veyro-black hover:text-neutral-600 transition-colors"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                  </div>

                  {user.address && user.address.line1 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                      <div className="inline-flex items-center gap-1.5 bg-veyro-yellow text-veyro-black px-2.5 py-1 rounded text-2xs uppercase font-bold tracking-wider mb-4">
                        <Home size={12} strokeWidth={2.5} />
                        Default Address
                      </div>
                      <div className="text-sm text-veyro-black leading-[1.6]">
                        <p className="font-bold text-sm mb-1">{user.name}</p>
                        <p>{user.address.line1}</p>
                        <p>{user.address.city}, {user.address.state} — {user.address.pincode}</p>
                        <p>India</p>
                        {user.phone && (
                          <p className="mt-2">Phone: <span className="font-medium">{user.phone}</span></p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-neutral-200 rounded-xl p-6 text-center">
                      <p className="text-sm text-neutral-600 mb-4">No saved address.</p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-medium text-veyro-black underline underline-offset-4"
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
          <div className="w-full lg:w-[35%] lg:pl-12 lg:border-l border-neutral-200">
            
            <div className="flex justify-end mb-8">
              <Link 
                href="/orders" 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-veyro-black hover:bg-neutral-50 transition-colors"
              >
                <Package size={16} strokeWidth={1.5} />
                Order History
              </Link>
            </div>

            {/* Identity Profile */}
            <div className="flex flex-col items-start mb-10">
              <div className="w-20 h-20 bg-veyro-black rounded-full flex items-center justify-center mb-4">
                <span className="text-[28px] font-bold text-white tracking-widest">
                  {user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                </span>
              </div>
              <h3 className="text-xl font-bold text-veyro-black mb-1">{user.name}</h3>
              <p className="text-sm text-neutral-600 mb-4">{user.email}</p>
              <div className="bg-neutral-100 text-neutral-800 text-xs font-semibold px-3.5 py-1.5 rounded-full">
                Member Since {user.memberSince || "Sep 2026"}
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-10 pt-8 border-t border-neutral-200">
              <h4 className="text-sm font-bold text-veyro-black mb-6">Your Benefits</h4>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <Truck size={22} strokeWidth={1.5} className="text-veyro-black" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-veyro-black mb-0.5">Free Express Delivery</h5>
                    <p className="text-xs text-neutral-600">Complimentary 48-hour priority dispatch.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <Star size={22} strokeWidth={1.5} className="text-veyro-black" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-veyro-black mb-0.5">Early Access to Drops</h5>
                    <p className="text-xs text-neutral-600">Be the first to shop new collections.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    <RefreshCcw size={22} strokeWidth={1.5} className="text-veyro-black" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-veyro-black mb-0.5">Easy Returns</h5>
                    <p className="text-xs text-neutral-600">7-day pickup guarantee with instant refunds.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-neutral-200">
              <h4 className="text-sm font-bold text-veyro-black mb-4 mt-6">Account Actions</h4>
              <div className="flex flex-col border-t border-neutral-200">
                <Link 
                  href="/orders"
                  className="flex items-center justify-between py-4 border-b border-neutral-200 group"
                >
                  <div className="flex items-center gap-3">
                    <Package size={20} strokeWidth={1.5} className="text-veyro-black" />
                    <span className="text-sm font-bold text-veyro-black">View Order History</span>
                  </div>
                  <ChevronRight size={16} className="text-veyro-muted group-hover:text-veyro-black transition-colors" />
                </Link>
                
                <button
                  onClick={logout}
                  className="flex items-center justify-between py-4 border-b border-neutral-200 group"
                >
                  <div className="flex items-center gap-3">
                    <LogOut size={20} strokeWidth={1.5} className="text-veyro-black" />
                    <span className="text-sm font-bold text-veyro-black">Sign Out</span>
                  </div>
                  <ChevronRight size={16} className="text-veyro-muted group-hover:text-veyro-black transition-colors" />
                </button>
              </div>
            </div>
            
          </div>

        </div>
      </Container>
    </div>
  );
}
