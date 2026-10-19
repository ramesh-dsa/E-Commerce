---
last_mapped_commit: c05db5fe84dfbc4dae35469a85e21624f77866ad
last_mapped_at: 2026-10-19
---
# External Integrations

**Analysis Date:** 2026-10-19

## APIs & External Services

**Geolocation & Address Resolution:**
- OpenStreetMap Nominatim - Reverse geocoding latitude/longitude coordinates to street, city, state, and pincode
  - Endpoint: `https://nominatim.openstreetmap.org/reverse`
  - Implemented in: `veyro/src/app/api/reverse-geocode/route.ts`
  - User-Agent: `VeyroEcommerce/2.0 (support@veyro.in)`
  - Auth: None (free tier with strict rate limit respect and 6000ms timeout controller)
- IP-API - Client IP-based geolocation fallback when browser GPS is blocked or unavailable
  - Endpoint: `http://ip-api.com/json/{candidateIp}`
  - Implemented in: `veyro/src/app/api/reverse-geocode/route.ts`
  - Auth: None (free non-commercial tier)

**Font CDN:**
- Google Fonts (`next/font/google`) - Optimized build-time font fetching and zero-layout-shift injection for Geist, Geist Mono, Dancing Script, and Montserrat (`veyro/src/app/layout.tsx`)

## Data Storage

**Databases:**
- None (currently brownfield in-memory / client-side storage architecture)
  - Default product seed catalog: `veyro/src/data/products.ts` (36+ curated products across Clothing, Footwear, Watches)
  - Default review seed data: `veyro/src/data/reviews.ts`

**Browser Storage (Client-Side Persistence):**
- Browser `localStorage`:
  - `veyro_cart_v1`: Cart item array with SKU, sizes, quantity (`veyro/src/context/CartContext.tsx`)
  - `veyro_applied_coupon`: Active promo coupon code string (`veyro/src/context/CartContext.tsx`)
  - `veyro_wishlist_v1`: Wishlist product items (`veyro/src/context/WishlistContext.tsx`)
  - `veyro_wishlist_sizes_v1`: Selected size mappings for wishlisted items (`veyro/src/context/WishlistContext.tsx`)
  - `veyro_products_v1`: Dynamic admin product catalog overrides & updates (`veyro/src/context/ProductsContext.tsx`)
  - `veyro_custom_sections_v1`: Admin custom curated storefront sections (`veyro/src/context/CustomSectionsContext.tsx`)
  - `veyro_user_v1`: User profile, addresses, VIP status (`veyro/src/context/UserContext.tsx`)
  - `veyro_orders_v6`: Customer order history, return statuses, tracking records (`veyro/src/context/UserContext.tsx`)
  - `veyro_custom_reviews_v1`: User submitted product reviews (`veyro/src/context/ReviewsContext.tsx`)
  - `veyro_review_votes_v1`: Helpful/unhelpful vote tracking (`veyro/src/context/ReviewsContext.tsx`)
- Browser `sessionStorage`:
  - `veyro_admin_session_v1`: Session-scoped admin authentication token (`veyro/src/context/AdminContext.tsx`)

**File Storage:**
- Local static file system in `veyro/public/`
  - `veyro/public/images/`: Catalog product images, banners, lookbooks, shoe textures
  - `veyro/public/logos/`: Brand mark SVG/PNG assets

**Caching:**
- Next.js Server Cache & image optimization cache (`.next/cache/images`)
- Client-side React context state with `useMemo` caching (e.g. fuzzy search engine token index in `veyro/src/utils/searchEngine.ts`)

## Authentication & Identity

**Customer Authentication:**
- Client-side mock user profile state in `veyro/src/context/UserContext.tsx`
- Features demo login helper (`demoLogin()`) creating simulated VIP user profiles, address management, and persistent order histories

**Admin Authentication:**
- Role-based gatekeeper in `veyro/src/context/AdminContext.tsx` protecting `/admin/*` routes
- Credentials verified against configured admin session (`admin@veyro.in` / `veyro2026`)
- Auto-invalidates on browser tab close via `sessionStorage`

## Monitoring & Observability

**Error Tracking:**
- None configured (no Sentry, Datadog, or LogRocket)
- Client-side error boundaries and try/catch blocks with `console.warn` / `console.error`

**Performance Metrics:**
- Next.js Core Web Vitals reported via `next/font` and Next.js built-in performance marks

## CI/CD & Deployment

**Hosting:**
- Targeted for Vercel or containerized Node.js runtime

**CI Pipeline:**
- None currently configured in `.github/workflows`

## Environment Configuration

**Required env vars:**
- Standard Next.js runtime environment variables (no mandatory external secret keys required for base development)
- Optional future production variables: Payment gateway API keys (Razorpay/Stripe), Database connection string (PostgreSQL/Supabase)

**Secrets location:**
- `.env.local` (git-ignored, local development only)

## Webhooks & Callbacks

**Incoming:**
- None (payment callbacks are currently simulated client-side during checkout in `veyro/src/app/checkout/page.tsx`)

**Outgoing:**
- None

---

*Integration audit: 2026-10-19*
