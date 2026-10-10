"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AdminContextType {
  isAdmin: boolean;
  isHydrated: boolean;
  adminLogin: (email: string, password: string) => { success: boolean; message: string };
  adminLogout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = "veyro_admin_session_v1";
const ADMIN_EMAIL = "admin@veyro.in";
const ADMIN_PASSWORD = "veyro2026";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate admin session from sessionStorage on mount (SSR safe)
  useEffect(() => {
    try {
      // Clear legacy localStorage key to prevent past sessions from auto-logging in
      localStorage.removeItem(ADMIN_STORAGE_KEY);

      const saved = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (saved === "true") {
        setIsAdmin(true);
      }
    } catch (e) {
      console.warn("Failed to read admin session from sessionStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Persist admin session to sessionStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (isAdmin) {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      } else {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    } catch (e) {
      console.warn("Failed to save admin session to sessionStorage", e);
    }
  }, [isAdmin, isHydrated]);

  const adminLogin = useCallback((email: string, password: string) => {
    const trimmedEmail = email.toLowerCase().trim();
    if (trimmedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return { success: true, message: "Welcome, Admin!" };
    }
    return { success: false, message: "Invalid admin credentials. Try admin@veyro.in / veyro2026" };
  }, []);

  const adminLogout = useCallback(() => {
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, isHydrated, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
