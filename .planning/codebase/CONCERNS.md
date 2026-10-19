---
last_mapped_commit: c05db5fe84dfbc4dae35469a85e21624f77866ad
last_mapped_at: 2026-10-19
---
# Codebase Concerns

**Analysis Date:** 2026-10-19

## Tech Debt

**Monolithic Mega-Components:**
- Issue: Several mission-critical pages and components have grown into massive monolithic files exceeding 1,000 to 7,700 lines of code.
- Files:
  - `veyro/src/app/admin/page.tsx` (7,748 lines)
  - `veyro/src/app/checkout/page.tsx` (2,552 lines)
  - `veyro/src/app/admin/custom-sections/page.tsx` (2,353 lines)
  - `veyro/src/app/admin/orders/page.tsx` (1,798 lines)
  - `veyro/src/components/admin/ProductForm.tsx` (1,401 lines)
  - `veyro/src/components/features/CartDrawer.tsx` (1,316 lines)
- Impact: Extreme cognitive burden during refactoring, slow IDE analysis, high probability of regression when tweaking checkout steps or admin forms.
- Fix approach: Decompose these into focused subcomponents (e.g. split checkout into `CheckoutSummary`, `AddressStep`, `PaymentStep`, `CouponBox`).

**React 19 Hydration Lint Errors:**
- Issue: Direct synchronous calls to `setState` inside `useEffect` mount routines trigger 70 `react-hooks/set-state-in-effect` errors during `npm run lint`.
- Files:
  - `veyro/src/context/AdminContext.tsx:30`
  - `veyro/src/context/WishlistContext.tsx:40`
  - `veyro/src/context/CustomSectionsContext.tsx:106`
  - `veyro/src/context/ProductsContext.tsx:35`
  - `veyro/src/context/UserContext.tsx:523`
  - `veyro/src/components/ui/reactbits/BlurText.tsx:29`
- Impact: Potential cascading re-renders during initial client hydration and ESLint build failures.
- Fix approach: Wrap initial hydration state setters in `queueMicrotask(() => { ... })` or adopt an initialization action pattern as implemented in `CartContext.tsx:85`.

**Root Directory Script Clutter:**
- Issue: Loose python and script files reside directly in `veyro/` instead of `veyro/scripts/`.
- Files: `veyro/export_pngs.py`, `veyro/generate_logos.py`, `veyro/generate_product_images.py`, `veyro/process_shoe.py`, `veyro/process_shoe2.py`, `veyro/update_page.js`.
- Impact: `update_page.js` uses CommonJS `require()` triggering `@typescript-eslint/no-require-imports` in ESLint.
- Fix approach: Move one-off utilities into `veyro/scripts/` or add them to ESLint ignore patterns.

## Security Considerations

**Hardcoded Client-Side Admin Credentials:**
- Risk: Admin email and password are hardcoded directly into client bundle source code (`ADMIN_EMAIL = "admin@veyro.in"`, `ADMIN_PASSWORD = "veyro2026"`).
- Files: `veyro/src/context/AdminContext.tsx`
- Current mitigation: Checked on client; session token kept in `sessionStorage`.
- Recommendations: Migrate admin auth to Next.js middleware with encrypted HTTP-only session cookies and server-side verification before production deployment.

**Unauthenticated Geolocation Proxy Route:**
- Risk: Route queries third-party `http://ip-api.com` without SSL encryption and lacks rate-limiting controls.
- Files: `veyro/src/app/api/reverse-geocode/route.ts`
- Current mitigation: Has client IP loopback check and 6000ms AbortController timeout.
- Recommendations: Upgrade external API query to HTTPS and introduce an in-memory or Redis rate limiter.

## Performance Bottlenecks

**Browser LocalStorage Capacity Limits:**
- Problem: Browsers enforce a strict ~5MB quota per origin for `localStorage`.
- Files: `veyro/src/context/ProductsContext.tsx`, `veyro/src/context/CustomSectionsContext.tsx`
- Cause: If an admin adds multiple high-resolution image data URLs or large custom product catalogs, `localStorage.setItem` will throw `QuotaExceededError`.
- Improvement path: Ensure product images remain file paths or URLs, or transition persistent catalog data to IndexedDB or a backend database.

## Fragile Areas

**Static Seed vs. LocalStorage Catalog Desynchronization:**
- Files: `veyro/src/context/ProductsContext.tsx`, `veyro/src/data/products.ts`
- Why fragile: When code updates alter seed product schemas or prices, returning users who have existing `veyro_products_v1` entries in localStorage retain old data snapshots unless manual reset is triggered.
- Safe modification: Implement schema version migration (`SCHEMA_VERSION = 2`) that automatically invalidates or reconciles stale localStorage representations.

**Cart Real-Time Price Invalidation:**
- Files: `veyro/src/context/CartContext.tsx`
- Why fragile: Cart items bundle a copy of the product object. While `liveItems` reconciles against `products`, manual actions like coupon application or size availability changes must stay synchronized.

## Scaling Limits

**Client-Side In-Memory Search Engine:**
- Files: `veyro/src/utils/searchEngine.ts`
- Current capacity: ~50-200 products performs smoothly in <2ms.
- Limit: At >1,000 products, unindexed client-side string tokenization and Levenshtein matrix calculations across multiple attributes will degrade frame rates during search typing.
- Scaling path: Introduce Web Worker or server-side search (e.g. Meilisearch, Algolia, or database full-text search) if catalog expands significantly.

## Missing Critical Features

**Production Database & Backend Services:**
- Problem: All customer orders, reviews, and admin updates live exclusively in the local browser. Other users or devices cannot see updates made on another browser.
- Blocks: True multi-user e-commerce, real email notifications, order fulfillment workflows.

**Payment Gateway Integration:**
- Problem: Checkout currently simulates payment completion with dummy delay timers.
- Blocks: Collecting actual customer payments (UPI, Cards, NetBanking via Razorpay/Stripe).

## Test Coverage Gaps

**Zero Automated Test Coverage:**
- What's not tested:
  - 2-Tee bundle discount calculation & free shipping logic (`CartContext.tsx`)
  - Smart search typo tolerance and synonym expansion (`searchEngine.ts`)
  - 7-day return window eligibility logic (`orderUtils.ts`)
  - Order cancellation & return request state transitions (`UserContext.tsx`)
- Files: All files in `veyro/src/`
- Risk: Refactoring complex pricing or checkout logic can introduce silent commerce calculation bugs.
- Priority: High.

---

*Concerns audit: 2026-10-19*
