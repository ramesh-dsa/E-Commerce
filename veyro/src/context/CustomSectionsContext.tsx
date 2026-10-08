"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CustomSectionFilter {
  id: string;
  label: string;
  key: string; // e.g. "color", "size", "material", "price"
  type: "checkbox" | "radio" | "range";
  options: string[]; // e.g. ["Black", "White", "Red"] or ["S", "M", "L"]
}

export interface CustomSectionProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  secondaryImageUrl?: string;
  galleryImages?: string[];
  badge?: string;
  sizes: string[];
  colorName: string;
  colorHex: string;
  material: string;
  inStock: boolean;
  tags?: string[];
}

export interface CustomSection {
  id: string;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  carouselImages: {
    id: string;
    src: string;
    alt: string;
  }[];
  carouselHeight?: "compact" | "medium" | "large";
  products: CustomSectionProduct[];
  filters: CustomSectionFilter[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomSectionsContextType {
  sections: CustomSection[];
  isHydrated: boolean;
  canAddSection: boolean;
  maxSections: number;
  maxCarouselImages: number;
  addSection: (section: Omit<CustomSection, "id" | "createdAt" | "updatedAt">) => { success: boolean; message: string; id?: string };
  updateSection: (id: string, updates: Partial<Omit<CustomSection, "id" | "createdAt">>) => { success: boolean; message: string };
  deleteSection: (id: string) => void;
  getSectionById: (id: string) => CustomSection | undefined;
  getSectionBySlug: (slug: string) => CustomSection | undefined;
  addProductToSection: (sectionId: string, product: CustomSectionProduct) => { success: boolean; message: string };
  updateProductInSection: (sectionId: string, productId: string, updates: Partial<CustomSectionProduct>) => void;
  removeProductFromSection: (sectionId: string, productId: string) => void;
  addCarouselImage: (sectionId: string, image: { src: string; alt: string }) => { success: boolean; message: string };
  removeCarouselImage: (sectionId: string, imageId: string) => void;
  reorderCarouselImages: (sectionId: string, imageIds: string[]) => void;
  addFilterToSection: (sectionId: string, filter: Omit<CustomSectionFilter, "id">) => { success: boolean; message: string };
  updateFilterInSection: (sectionId: string, filterId: string, updates: Partial<CustomSectionFilter>) => void;
  removeFilterFromSection: (sectionId: string, filterId: string) => void;
}

const CustomSectionsContext = createContext<CustomSectionsContextType | undefined>(undefined);

const STORAGE_KEY = "veyro_custom_sections_v1";
const MAX_SECTIONS = 3;
const MAX_CAROUSEL_IMAGES = 6;

function generateId(): string {
  return `cs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CustomSectionsProvider({ children }: { children: React.ReactNode }) {
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount (SSR safe)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSections(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to read custom sections from localStorage", e);
    }
    setIsHydrated(true);
  }, []);

  // Multi-tab real-time sync
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setSections(parsed);
          }
        } catch (err) {
          console.warn("Failed to parse storage sync custom sections", err);
        }
      }
    };
    const handleFocus = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setSections(parsed);
          }
        }
      } catch (err) {
        console.warn("Failed to reload custom sections on focus", err);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Persist to localStorage when sections change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    } catch (e) {
      console.warn("Failed to save custom sections to localStorage", e);
      if (e instanceof DOMException && e.name === "QuotaExceededError") {
        alert("⚠️ localStorage is full! Consider removing images or sections.");
      }
    }
  }, [sections, isHydrated]);

  const canAddSection = sections.length < MAX_SECTIONS;

  const addSection = useCallback((section: Omit<CustomSection, "id" | "createdAt" | "updatedAt">) => {
    if (sections.length >= MAX_SECTIONS) {
      return { success: false, message: `Maximum ${MAX_SECTIONS} custom sections allowed.` };
    }

    // Check for duplicate slug
    const slug = slugify(section.name);
    const reservedSlugs = ["clothing", "shoes", "footwear", "watches", "collections", "admin", "cart", "checkout", "wishlist", "orders", "account", "product", "shop"];
    if (reservedSlugs.includes(slug)) {
      return { success: false, message: `"${section.name}" conflicts with an existing page. Choose a different name.` };
    }
    if (sections.some((s) => s.slug === slug)) {
      return { success: false, message: `A section with the name "${section.name}" already exists.` };
    }

    const id = generateId();
    const now = new Date().toISOString();
    const newSection: CustomSection = {
      ...section,
      id,
      slug,
      createdAt: now,
      updatedAt: now,
    };

    setSections((prev) => [...prev, newSection]);
    return { success: true, message: "Section created successfully!", id };
  }, [sections]);

  const updateSection = useCallback((id: string, updates: Partial<Omit<CustomSection, "id" | "createdAt">>) => {
    // If name is being changed, regenerate slug and check conflicts
    if (updates.name) {
      const newSlug = slugify(updates.name);
      const reservedSlugs = ["clothing", "shoes", "footwear", "watches", "collections", "admin", "cart", "checkout", "wishlist", "orders", "account", "product", "shop"];
      if (reservedSlugs.includes(newSlug)) {
        return { success: false, message: `"${updates.name}" conflicts with an existing page.` };
      }
      if (sections.some((s) => s.slug === newSlug && s.id !== id)) {
        return { success: false, message: `A section named "${updates.name}" already exists.` };
      }
      updates.slug = newSlug;
    }

    setSections((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, ...updates, updatedAt: new Date().toISOString() }
          : s
      )
    );
    return { success: true, message: "Section updated successfully!" };
  }, [sections]);

  const deleteSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const getSectionById = useCallback(
    (id: string) => sections.find((s) => s.id === id),
    [sections]
  );

  const getSectionBySlug = useCallback(
    (slug: string) => sections.find((s) => s.slug === slug && s.isActive),
    [sections]
  );

  const addProductToSection = useCallback((sectionId: string, product: CustomSectionProduct) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return { success: false, message: "Section not found." };

    if (section.products.some((p) => p.id === product.id)) {
      return { success: false, message: "Product already exists in this section." };
    }

    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, products: [...s.products, product], updatedAt: new Date().toISOString() }
          : s
      )
    );
    return { success: true, message: "Product added successfully!" };
  }, [sections]);

  const updateProductInSection = useCallback((sectionId: string, productId: string, updates: Partial<CustomSectionProduct>) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              products: s.products.map((p) =>
                p.id === productId ? { ...p, ...updates } : p
              ),
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  }, []);

  const removeProductFromSection = useCallback((sectionId: string, productId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              products: s.products.filter((p) => p.id !== productId),
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  }, []);

  const addCarouselImage = useCallback((sectionId: string, image: { src: string; alt: string }) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return { success: false, message: "Section not found." };
    if (section.carouselImages.length >= MAX_CAROUSEL_IMAGES) {
      return { success: false, message: `Maximum ${MAX_CAROUSEL_IMAGES} carousel images allowed.` };
    }

    const id = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              carouselImages: [...s.carouselImages, { id, ...image }],
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
    return { success: true, message: "Image added!" };
  }, [sections]);

  const removeCarouselImage = useCallback((sectionId: string, imageId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              carouselImages: s.carouselImages.filter((img) => img.id !== imageId),
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  }, []);

  const reorderCarouselImages = useCallback((sectionId: string, imageIds: string[]) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        const reordered = imageIds
          .map((id) => s.carouselImages.find((img) => img.id === id))
          .filter(Boolean) as CustomSection["carouselImages"];
        return { ...s, carouselImages: reordered, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const addFilterToSection = useCallback((sectionId: string, filter: Omit<CustomSectionFilter, "id">) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return { success: false, message: "Section not found." };

    if (section.filters.some((f) => f.key === filter.key)) {
      return { success: false, message: `A filter with key "${filter.key}" already exists.` };
    }

    const id = `flt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              filters: [...s.filters, { id, ...filter }],
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
    return { success: true, message: "Filter added!" };
  }, [sections]);

  const updateFilterInSection = useCallback((sectionId: string, filterId: string, updates: Partial<CustomSectionFilter>) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              filters: s.filters.map((f) =>
                f.id === filterId ? { ...f, ...updates } : f
              ),
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  }, []);

  const removeFilterFromSection = useCallback((sectionId: string, filterId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              filters: s.filters.filter((f) => f.id !== filterId),
              updatedAt: new Date().toISOString(),
            }
          : s
      )
    );
  }, []);

  const value = useMemo<CustomSectionsContextType>(
    () => ({
      sections,
      isHydrated,
      canAddSection,
      maxSections: MAX_SECTIONS,
      maxCarouselImages: MAX_CAROUSEL_IMAGES,
      addSection,
      updateSection,
      deleteSection,
      getSectionById,
      getSectionBySlug,
      addProductToSection,
      updateProductInSection,
      removeProductFromSection,
      addCarouselImage,
      removeCarouselImage,
      reorderCarouselImages,
      addFilterToSection,
      updateFilterInSection,
      removeFilterFromSection,
    }),
    [
      sections, isHydrated, canAddSection,
      addSection, updateSection, deleteSection, getSectionById, getSectionBySlug,
      addProductToSection, updateProductInSection, removeProductFromSection,
      addCarouselImage, removeCarouselImage, reorderCarouselImages,
      addFilterToSection, updateFilterInSection, removeFilterFromSection,
    ]
  );

  return (
    <CustomSectionsContext.Provider value={value}>
      {children}
    </CustomSectionsContext.Provider>
  );
}

export function useCustomSections() {
  const context = useContext(CustomSectionsContext);
  if (!context) {
    throw new Error("useCustomSections must be used within a CustomSectionsProvider");
  }
  return context;
}
