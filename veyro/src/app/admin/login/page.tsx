"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLoginPage() {
  const { adminLogin, isAdmin } = useAdmin();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already admin, redirect to dashboard
  useEffect(() => {
    if (isAdmin) router.replace("/admin");
  }, [isAdmin, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate brief auth delay for UX
    setTimeout(() => {
      const result = adminLogin(email, password);
      if (result.success) {
        router.push("/admin");
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white tracking-wider">VEYRO</h1>
          <p className="text-veyro-yellow text-[11px] tracking-[0.2em] mt-1.5 font-semibold uppercase">
            Admin Access
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleSubmit}
          className="bg-veyro-charcoal rounded-2xl p-8 space-y-5"
          aria-label="Admin login form"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="block text-[11px] text-veyro-muted mb-2 uppercase tracking-widest font-semibold"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-veyro-black text-white px-4 py-3 rounded-lg border border-white/10
                focus:border-veyro-yellow focus:outline-none text-sm placeholder:text-white/20
                transition-colors"
              placeholder="admin@veyro.in"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-[11px] text-veyro-muted mb-2 uppercase tracking-widest font-semibold"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-veyro-black text-white px-4 py-3 rounded-lg border border-white/10
                focus:border-veyro-yellow focus:outline-none text-sm placeholder:text-white/20
                transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-veyro-yellow text-veyro-black py-3 rounded-lg font-bold text-sm
              tracking-wider hover:bg-veyro-yellow-dark transition-colors
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "AUTHENTICATING..." : "LOGIN"}
          </button>

          <p className="text-[11px] text-veyro-muted/60 text-center mt-4">
            Demo credentials: admin@veyro.in / veyro2026
          </p>
        </form>

        {/* Back to store */}
        <p className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-veyro-muted hover:text-white transition-colors"
          >
            ← Back to Store
          </a>
        </p>
      </div>
    </div>
  );
}
