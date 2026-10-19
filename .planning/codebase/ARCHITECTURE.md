---
last_mapped_commit: c05db5fe84dfbc4dae35469a85e21624f77866ad
last_mapped_at: 2026-10-19
---
# Architecture Overview

**Analysis Date:** 2026-10-19

## System Pattern

**Type:** Next.js 16 App Router full-stack web application with client-side React Context state persistence.

**Key Characteristics:**
- **App Router Layouts & Routing:** File-system based routing in `veyro/src/app/` leveraging Server & Client components.
- **Client State Bus via React Contexts:** A cluster of 7 specialized React Contexts wrapping the app in `veyro/src/app/layout.tsx`.
- **Hybrid Data Persistence:** In-memory seed datasets (`veyro/src/data/products.ts`) blended seamlessly with browser `localStorage` and `sessionStorage` layers, enabling dynamic product editing, custom section creation, cart preservation, review submission, and order tracking without requiring a remote database backend during prototyping.
- **Performance & Smooth Motion:** Lenis virtual scroll synchronization (`veyro/src/components/layout/SmoothScrolling.tsx`) integrated with Motion animation primitives (`veyro/src/components/ui/reactbits/`).

## Architectural Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                       │
│  Pages (`src/app/**/page.tsx`) & Root Layout (`layout.tsx`) │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Presentation Layer                       │
│  - Layout Components (`src/components/layout/`)              │
│  - Feature Sections & Catalogs (`src/components/features/`) │
│  - UI Design System Primitives (`src/components/ui/`)        │
│  - Micro-Interaction Primitives (`src/components/ui/reactbits`)│
│  - Admin Dashboard Panels (`src/components/admin/`)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                  State Management Layer                     │
│  - ProductsContext (`src/context/ProductsContext.tsx`)      │
│  - CartContext (`src/context/CartContext.tsx`)              │
│  - WishlistContext (`src/context/WishlistContext.tsx`)      │
│  - UserContext (`src/context/UserContext.tsx`)              │
│  - ReviewsContext (`src/context/ReviewsContext.tsx`)        │
│  - AdminContext (`src/context/AdminContext.tsx`)            │
│  - CustomSectionsContext (`src/context/CustomSectionsContext.tsx`)│
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│               Business Logic & Engine Layer                 │
│  - Smart Search & Fuzzy Matching (`src/utils/searchEngine.ts`)│
│  - Order Returns & Eligibility (`src/utils/orderUtils.ts`)  │
│  - Utility Helpers (`src/lib/utils.ts`)                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│             Data Sources & External API Layer               │
│  - Static Seed Catalog (`src/data/products.ts`)             │
│  - Static Seed Reviews (`src/data/reviews.ts`)              │
│  - Browser LocalStorage / SessionStorage                    │
│  - Server Route Handlers (`src/app/api/reverse-geocode/`)   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. **Initial Boot & Hydration:**
   - Next.js renders `veyro/src/app/layout.tsx` with all context providers nested.
   - Each provider initializes with seed data (`seedProducts`, `DEFAULT_DEMO_ORDERS`, etc.) to prevent SSR mismatches.
   - On `useEffect` mount, providers read from browser `localStorage` or `sessionStorage` and sync state to active client memory.
   - `ProductsContext` merges live updates with static seeds (`missingSeeds = seedProducts.filter(...)`).

2. **Catalog Browsing & Search:**
   - Catalogs (`ClothingCatalog.tsx`, `FootwearCatalog.tsx`, `WatchesCatalog.tsx`, `CollectionsCatalog.tsx`) consume `useProducts()` and `useCustomSections()`.
   - `searchEngine.ts` indexes product names, descriptions, tags, fits, and colors using tokenization, Levenshtein distance typo tolerance, and stem expansion.

3. **Cart & Commerce Actions:**
   - Adding a product taps `useCart().addToCart(product, size, qty)`.
   - Cart automatically recalculates tier discounts, 2-tee bundle deals (`teesNeededForBundle`), and free shipping thresholds (₹999).
   - Checkout at `veyro/src/app/checkout/page.tsx` creates an `OrderRecord` passed to `useUser().addOrder()`, clearing purchased items and generating tracking codes.

4. **Multi-Tab Sync:**
   - Providers listen to `window.addEventListener("storage", handleStorage)` so cart, wishlist, products, and section updates replicate across concurrent tabs in real time.

## Key Abstractions

- `Product`: Comprehensive domain entity capturing sizing, movements, materials, pricing, discounts, gallery images, badges, and stock flags (`veyro/src/types/index.ts`).
- `CartItem`: Product instance bound to specific `selectedSize` and `quantity` (`veyro/src/context/CartContext.tsx`).
- `OrderRecord`: Historical purchase receipt capturing discounts, delivery timestamps, shipping address, items, and return lifecycle status (`veyro/src/types/index.ts`).
- `CustomSection`: Dynamic storefront section created via Admin dashboard with custom filters and product selections (`veyro/src/context/CustomSectionsContext.tsx`).

## Entry Points

- **Root Application Entry:** `veyro/src/app/layout.tsx`
- **Storefront Homepage:** `veyro/src/app/page.tsx`
- **Product Detail Page (Dynamic):** `veyro/src/app/product/[slug]/page.tsx`
- **Checkout Experience:** `veyro/src/app/checkout/page.tsx`
- **Admin Control Center:** `veyro/src/app/admin/page.tsx` (protected by `AdminProvider`)
- **API Geocoding Handler:** `veyro/src/app/api/reverse-geocode/route.ts`

## Architectural Constraints & Boundaries

- **Single Root Layout:** All global wrappers, providers, font declarations, and smooth scrolling containers live strictly within `veyro/src/app/layout.tsx`.
- **Client vs. Server Boundary:** Most interactive components and context consumers are explicitly designated with `"use client"`.
- **Path Aliasing:** Absolute imports configured via `@/*` resolving to `veyro/src/*`.

## Anti-Patterns Observed

### Synchronous setState in useEffect During SSR Hydration

**What happens:** Several contexts (`AdminContext.tsx:30`, `WishlistContext.tsx:40`, `CustomSectionsContext.tsx:106`, `ProductsContext.tsx:35`, `UserContext.tsx:523`) invoke `setState` directly inside mount effects to load from `localStorage`.
**Why it's wrong:** React 19 triggers `react-hooks/set-state-in-effect` lint errors and causes cascading re-renders during hydration.
**Do this instead:** Wrap hydration state updates in `queueMicrotask()` or use an explicit initialization reducer pattern (as successfully demonstrated in `CartContext.tsx:85`).

### Mega-File Component Architecture

**What happens:** Key pages like `veyro/src/app/admin/page.tsx` (7,748 lines) and `veyro/src/app/checkout/page.tsx` (2,552 lines) contain thousands of lines of combined JSX, state, modals, and helper routines.
**Why it's wrong:** High cognitive load, difficult to test, high risk of unintended regressions during feature edits.
**Do this instead:** Refactor into modular subcomponents (e.g. `AdminMetricsCard.tsx`, `AdminOrderTable.tsx`, `CheckoutAddressStep.tsx`, `CheckoutPaymentStep.tsx`).

## Error Handling

**Strategy:** Defensive client-side error handling with fallback defaults.

**Patterns:**
- `try/catch` wrapping around all `localStorage` and `JSON.parse` operations to prevent app crashes when storage is corrupted or in private browsing mode.
- Geolocation API route (`reverse-geocode/route.ts`) implements an AbortController with 6-second timeout and 3-step fallbacks (GPS -> Nominatim -> IP Geolocation -> graceful JSON error response).

## Cross-Cutting Concerns

- **Navigation & Scrolling:** Uniform Lenis smooth scrolling with an automatic `ScrollToTop` trigger on Next.js route change (`veyro/src/components/layout/ScrollToTop.tsx`).
- **Cart & Wishlist Drawers:** Slide-over modal drawers accessible from any page via global navigation without page reload.
- **Telemetry & Auto-Location:** Address auto-population using reverse geocoding directly into the checkout form.

---

*Architecture analysis: 2026-10-19*
