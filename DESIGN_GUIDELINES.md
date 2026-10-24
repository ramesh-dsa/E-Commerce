# VEYRO Design Guidelines and Brand System

Version 1.0 — 2026-10-24  
Documentation of the active VEYRO storefront codebase on branch `main`.

---

## Table of Contents

1. [Brand Overview](#1-brand-overview)
2. [Logo](#2-logo)
3. [Colour](#3-colour)
4. [Typography](#4-typography)
5. [Layout and Spacing](#5-layout-and-spacing)
6. [Shape and Elevation](#6-shape-and-elevation)
7. [Components](#7-components)
8. [Iconography and Imagery](#8-iconography-and-imagery)
9. [Motion](#9-motion)
10. [Layering](#10-layering)
11. [Page Templates](#11-page-templates)
12. [Accessibility and Responsive Behaviour](#12-accessibility-and-responsive-behaviour)
13. [Do and Don't](#13-do-and-dont)
14. [Known Inconsistencies](#14-known-inconsistencies)
15. [Maintenance](#15-maintenance)

---

## 1. Brand Overview

VEYRO is a contemporary men's fashion and footwear brand based in India, specializing in heavyweight streetwear, vulcanized retro footwear, architectural tailoring, and precision horology.

### The Three Value Pillars

Defined in `src/components/features/BrandPillarsSection.tsx`:

| Pillar ID | Pillar Title | Code Description |
| :--- | :--- | :--- |
| `01` | 240+ GSM HEAVYWEIGHT | 100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash. Engineered to feel substantial on the body. |
| `02` | CRAFTED IN TIRUPUR | Direct partnerships with India's most respected artisanal garment mills. Every stitch is placed with precision by master craftsmen. |
| `03` | ZERO MIDDLEMEN | Pure direct-to-consumer model. We bypass traditional retail markups to bring you premium luxury-grade fabrics at honest, accessible prices. |

### Brand Personality

- **Architectural**: Rigid silhouettes, structured 240+ GSM cotton, boxy drop-shoulders.
- **Brutalist**: Monochromatic high-contrast surfaces, razor-sharp dividers, monospaced metadata.
- **Artisanal**: Long-staple cotton milled in Tirupur, vulcanized Italian rubber soles, sapphire crystal.
- **Understated**: Confident minimalism, quiet luxury, zero gaudy branding or seasonal gimmicks.

### Voice and Tone

- Confident, technical, and declarative.
- Never use hype-driven marketing fluff or hyperbolic discounts.
- State fabric specifications, weights, mill origins, and hardware engineering directly.

Real copy examples from the storefront:
- "Built For The Archive. We reject seasonal trends. Every piece is engineered with obsessive attention to fabric weight, structural drape, and minimalist utility." (`BrandPillarsSection.tsx`)
- "Engineered for the modern Indian uniform. Architectural cuts, premium textiles, and brutalist silhouettes." (`Footer.tsx`)
- "MADE IN INDIA • GLOBAL STANDARD" (`Footer.tsx`)
- "Clean slate. Retro-inspired. Designed for now." (`Hero.tsx`)
- "Combed cotton jersey · Zero-sag ribbed collars · Boxy drop-shoulder" (`ClothingCatalog.tsx`)
- "FREE SHIPPING ON ORDERS ABOVE ₹999" (`AnnouncementBar.tsx`)

### Capitalisation Rules

- Rule: The brand wordmark is always written in full capitals as `VEYRO`. Never write `Veyro` or `veyro` in body text.
- Rule: Navigation links, action buttons, category filter tags, metadata identifiers (`[ 001 ]`), and status badges are rendered in `uppercase` with tracking `tracking-wider` or `tracking-widest`.
- Rule: Long-form descriptions, fabric specifications, customer reviews, and body text use standard sentence case.
- Rule: Script accent titles rendered in Dancing Script use lowercase cursive (for example: `clean slate`, `breeze easy`, `the signature vault`, `The Limited Drop`).

---

## 2. Logo

The VEYRO visual identity is defined in `src/components/ui/Logo.tsx` with two exported vector primitives: the full geometric wordmark (`Logo`) and the standalone glyph mark (`VeyroMark`).

### Logo Specifications

| Property | Wordmark (`Logo`) | Glyph (`VeyroMark`) |
| :--- | :--- | :--- |
| ViewBox | `160 55 658 140` | `170 65 115 121` |
| Vector Geometry | Letter paths V, E, Y, R, O with modern squircle O | Exact letter V path: `VEYRO_V_PATH` |
| Default Height | `28px` (`height={28}`) | `20px` (`w-5 h-5`) |
| Minimum Height | `26px` (used in mobile navigation & AccountModal) | `16px` (`w-4 h-4`) |
| Fill Mode | Geometric vector fill (`fill="#0B0B0B"` or `#FFFFFF`) | `fill="currentColor"` |
| Clear Space | Minimum 50% glyph height on all four sides | Minimum 8px clear boundary |

### Variants in Code

- `black` (default): Fills letterforms with `#0B0B0B`. Used on white storefront backgrounds.
- `white`: Fills letterforms with `#FFFFFF`. Used on dark footers, banners, and modals.
- `accent`: Includes a 5px gold top accent bar (`<rect fill="#FFD400" height="5" rx="2.5" />`) positioned above the wordmark.

### Where the Logo Appears

- `src/components/layout/Navbar.tsx` (Desktop): `<Logo height={29} className="sm:h-[31px] lg:h-[33px]" />` (variant `black`).
- `src/components/layout/Navbar.tsx` (Mobile Menu): `<Logo height={26} />` (variant `black`).
- `src/components/layout/Footer.tsx`: `<Logo height={32} variant="white" />`.
- `src/components/features/AccountModal.tsx`: `<Logo variant="white" height={26} />`.

### Logo Do and Don't

- Rule: Do use `variant="white"` whenever placing the logo over `#050505`, `#0A0A0A`, `#111111`, or photographic campaign overlays.
- Rule: Do preserve aspect ratio with `w-auto shrink-0`.
- Rule: Don't recreate the logo with text fonts. Always render the SVG component from `src/components/ui/Logo.tsx`.
- Rule: Don't render the logo smaller than 26px in height on any storefront viewport.

---

## 3. Colour

The VEYRO palette is built upon high-contrast brutalist neutrals, pure white canvas, dark architectural stages, and a signature gold accent.

### Canonical Rule

| Hex | Token Name | Usage Rule | Contrast on #FFFFFF | Contrast on #111111 |
| :--- | :--- | :--- | :--- | :--- |
| `#111111` | `--color-veyro-black` | Primary text ink, primary button backgrounds, header typography (559 code occurrences) | 18.88:1 (AAA) | 1.00:1 (None) |
| `#FCD017` | `--color-veyro-yellow` | Brand gold accent: badges, notification dots, active underlines, focus accents (170 code occurrences) | 1.48:1 (Fail) | 12.74:1 (AAA) |
| `#E5BC05` | `--color-veyro-yellow-dark` | Hover state for gold accent buttons and badges | 1.82:1 (Fail) | 10.37:1 (AAA) |
| `#FFD400` | `--veyro-accent` | Secondary gold literal in globals `:root` and Logo accent bar | 1.43:1 (Fail) | 13.19:1 (AAA) |
| `#1F1F1F` | `--color-veyro-charcoal` | Dark surface elevation, hover state for black buttons (`hover:bg-veyro-charcoal`) | 16.48:1 (AAA) | 1.15:1 (Fail) |
| `#999999` | `--color-veyro-muted` | Secondary product metadata, inactive indicators, micro copy | 2.85:1 (Fail) | 6.63:1 (AA) |
| `#8E8E8E` | `--color-veyro-subtle` | Subtle metadata borders, filter tags, secondary label copy | 3.28:1 (Fail) | 5.76:1 (AA) |
| `#E8E8E5` | `--color-veyro-border` | Canonical storefront surface border token (27 literals; Tailwind `neutral-200` has 286 occurrences) | 1.23:1 (Fail) | 15.38:1 (AAA) |
| `#F0F0ED` | `--color-veyro-border-light` | Light horizontal divider, table row separator, sub-bar border | 1.14:1 (Fail) | 16.54:1 (AAA) |
| `#F8F8F6` | `--color-veyro-surface` | Section background surface, skeleton card loader base | 1.06:1 (Fail) | 17.76:1 (AAA) |
| `#F3F3F0` | `--color-veyro-surface-alt` | Alternate section surface, secondary button background | 1.11:1 (Fail) | 16.99:1 (AAA) |
| `#FFFFFF` | `--color-veyro-card` | Clean canvas background, card face, light modal background (766 occurrences) | 1.00:1 (None) | 18.88:1 (AAA) |
| `#C44D25` | `--color-veyro-accent` | Terracotta warm accent in `@theme`: discount tags, sale badges | 4.73:1 (AA) | 3.99:1 (Fail) |
| `#A33C1A` | `--color-veyro-accent-hover` | Terracotta hover state | 6.52:1 (AAA) | 2.89:1 (Fail) |
| `#FDF3EF` | `--color-veyro-accent-light` | Terracotta tinted background for promotional notices | 1.09:1 (Fail) | 17.30:1 (AAA) |
| `#0A0A0A` | Not defined | Cinematic dark canvas in `BrandPillarsSection.tsx` | 19.80:1 (AAA) | 1.05:1 (Fail) |
| `#050505` | Not defined | Pure luxury brutalist canvas in `Footer.tsx` | 20.38:1 (AAA) | 1.08:1 (Fail) |
| `#09090B` | Not defined (Zinc-950) | Dark overlay and modal canvas in `AccountModal.tsx` | 19.90:1 (AAA) | 1.05:1 (Fail) |
| `#10B981` | Not defined (Emerald-500) | Live delivery tracking, optical QR beam, success toast icon | 2.54:1 (Fail) | 7.44:1 (AA) |
| `#EF4444` | Not defined (Red-500) | Form validation error, danger toast icon, sold out dot | 3.76:1 (Fail) | 5.02:1 (AA) |
| `#F59E0B` | Not defined (Amber-500) | Warning notice, low stock alert pill | 2.15:1 (Fail) | 8.79:1 (AA) |
| `#101828` | Not defined (FAQ Navy) | FAQ page primary text, heading color, and accordion titles (15 occurrences in `app/faq/page.tsx`) | 16.14:1 (AAA) | 1.17:1 (Fail) |

### Page Backgrounds and Text Colours (15 Storefront Screens)

A complete audit of the base background and base text colour established for every storefront route.

| Screen / Route | Source File | Base Background | Hex / Tint | Base Text Colour | Role & Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Homepage (`/`)** | `src/app/page.tsx` | `bg-white` (layout root) | `#FFFFFF` | `#111111` (`text-veyro-black`) | **Canonical Base Background** (Pure White) |
| **Clothing (`/clothing`)** | `src/app/clothing/page.tsx` | `bg-white` (`ClothingCatalog.tsx:360`) | `#FFFFFF` | `#111111` (`text-[#111111]`) | Canonical Base Background |
| **Shoes (`/shoes`)** | `src/app/shoes/page.tsx` | `bg-white` (`FootwearCatalog.tsx:377`) | `#FFFFFF` | `#111111` (`text-[#111111]`) | Canonical Base Background |
| **Watches (`/watches`)** | `src/app/watches/page.tsx` | `bg-white` (`WatchesCatalog.tsx:522`) | `#FFFFFF` | `#111111` (`text-[#111111]`) | Canonical Base Background |
| **Collections (`/collections`)** | `src/app/collections/page.tsx` | `bg-[#fbfbf9]` (`main:10`) | `#FBFBF9` | `#111111` (`text-[#111111]`) | Variation: Capsule curation warm off-white tint |
| **Product Detail (`/product/[slug]`)** | `src/app/product/[slug]/page.tsx` | `bg-white` (layout root) | `#FFFFFF` | `#111111` (`text-veyro-black`) | Canonical Base Background |
| **Shopping Bag (`/cart`)** | `src/app/cart/page.tsx` | `bg-neutral-50/70` (`div:35`) | `#FAFAFA` (70%) | `#111111` / `text-neutral-900` | Variation: Utility workflow neutral tint |
| **Checkout (`/checkout`)** | `src/app/checkout/page.tsx` | `bg-neutral-50` (`div:302`) | `#FAFAFA` | `#111111` / `text-neutral-900` | Variation: Utility workflow neutral tint |
| **Wishlist (`/wishlist`)** | `src/app/wishlist/page.tsx` | `bg-neutral-50/60` (`div:58`) | `#FAFAFA` (60%) | `#111111` / `text-neutral-900` | Variation: Utility workflow neutral tint |
| **Orders Hub (`/orders`)** | `src/app/orders/page.tsx` | `bg-neutral-50/60` (`div:101`) | `#FAFAFA` (60%) | `#111111` / `text-neutral-900` | Variation: Utility workflow neutral tint |
| **Order Details (`/orders/[id]`)** | `src/app/orders/[id]/page.tsx` | `bg-[#FAFAFA]` (`div:85`) | `#FAFAFA` | `#111111` / `text-neutral-900` | Variation: Utility workflow neutral tint |
| **Order Return (`/orders/[id]/return`)** | `src/app/orders/[id]/return/page.tsx` | `bg-neutral-50` (`div:74`) | `#FAFAFA` | `#111111` / `text-neutral-900` | Variation: Utility workflow neutral tint |
| **Account (`/account`)** | `src/app/account/page.tsx` | `bg-[#FAFAFA]` (`div:30`) | `#FAFAFA` | `#111111` / `text-neutral-900` | Variation: Utility workflow neutral tint |
| **Customer Care & FAQ (`/faq`)** | `src/app/faq/page.tsx` | `bg-white` (`div:19`) | `#FFFFFF` | **`#101828`** (Deep Navy) | Canonical Background + Unique Deep Navy text palette |
| **Member Login Modal (`AccountModal`)** | `src/components/features/AccountModal.tsx` | `bg-[#0c0c0e]` (`div:412`) | `#0C0C0E` | `text-white` (`#FFFFFF`) | Variation: Dark brutalist modal surface (`bg-black/85` backdrop) |

#### Count of Distinct Background Tints
There are **4 distinct background tints** across the 15 storefront screens:
1. **`#FFFFFF` (`bg-white`)**: 6 screens (`/`, `/clothing`, `/shoes`, `/watches`, `/product/[slug]`, `/faq`) — **Canonical rule (most-used value)**.
2. **`#FAFAFA` / `bg-neutral-50`** (including 60% and 70% opacity variants): 7 screens (`/cart`, `/checkout`, `/wishlist`, `/orders`, `/orders/[id]`, `/orders/[id]/return`, `/account`) — Variation for dedicated utility workflows.
3. **`#FBFBF9` (`bg-[#fbfbf9]`)**: 1 screen (`/collections`) — Variation for archival collections curation.
4. **`#0C0C0E` (`bg-[#0c0c0e]`)**: 1 screen (`AccountModal`) — Variation for dark architectural member portal.

#### FAQ Navy Text Palette
While the storefront universally standardizes on `#111111` (`text-veyro-black`) for primary copy, `src/app/faq/page.tsx` introduces an isolated deep navy / slate typography system:
- **`#101828`** (`text-[#101828]`): Primary headings, category tab active states, and concierge card headers (contrast on `#FFFFFF`: **16.14:1 AAA**).
- **`#344054`** (`text-[#344054]`): Question titles in accordion headers (**9.51:1 AAA**).
- **`#475467`** (`text-[#475467]`): Category tab inactive labels (**6.97:1 AA**).
- **`#667085`** (`text-[#667085]`): Accordion answer body copy (**4.58:1 AA**).
- **`#98A2B3`** (`text-[#98a2b3]`): Concierge subtitle metadata and search icon placeholder (**2.58:1 Fail**).

---

## 4. Typography

VEYRO uses Next.js Google Fonts loaded in `src/app/layout.tsx` to drive a geometric, monospaced, and luxury serif hierarchy.

### Canonical Rule

| Font Family | CSS Variable | Fallback Stack | Role in Code | Storefront Occurrences |
| :--- | :--- | :--- | :--- | :--- |
| Geist Sans | `--font-geist-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | Default body, primary headings, navigation, form inputs | Applied universally to `<html>` and `<body>` across 178 storefront files (23 explicit `font-sans`) |
| Geist Mono | `--font-geist-mono` | `monospace` | Technical metadata, section tags (`[ 001 ]`), SKU identifiers, coupon codes | 157 occurrences (`font-mono`) |
| Dancing Script | `--font-dancing-script` | `cursive, sans-serif` | Artistic calligraphic subheadings (`.font-script`) | 19 occurrences |
| Montserrat | `--font-montserrat` | `system-ui, -apple-system, sans-serif` | Luxury typography system (`.font-luxury`) | 19 occurrences in 5 files |
| Outfit | `--font-outfit` | `sans-serif` | Feature showcase typography in `CollectionsShowcase.tsx` | 23 occurrences in 5 files |

### Type Scale in Code

Defined in `src/app/globals.css`:

| Class Name | Font Size | Weight | Line Height | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `.text-display` | `clamp(2.25rem, 5vw, 3.75rem)` | 700 Bold | 1.05 | `-0.03em` | Massive hero headlines and campaign headers |
| `.text-section-heading` | `clamp(1.5rem, 3vw, 2.25rem)` | 600 Semibold | 1.15 | `-0.02em` | Catalog category titles, collection headers |
| `.text-body` | `0.9375rem` (15px) | 400 Regular | 1.6 | Normal | Standard body copy and product descriptions |
| `.text-nav` | `0.8125rem` (13px) | 600 Semibold | Normal | `0.05em` | Navbar links, drawer tabs (uppercase) |
| `.text-product-name` | `0.875rem` (14px) | 500 Medium | 1.35 | Normal | Product card titles |
| `.text-product-price` | `0.9375rem` (15px) | 600 Semibold | Normal | `-0.01em` | Active selling price |
| `.text-product-meta` | `0.75rem` (12px) | 400 Regular | Normal | Normal | Subcategory tags, fabric composition |
| `.text-label-small` | `0.6875rem` (11px) | 600 Semibold | Normal | `0.08em` | Filter labels, tag pills, status indicators |

---

## 5. Layout and Spacing

VEYRO uses a disciplined grid and container architecture centered on a custom 1540px container.

### Canonical Rule

| Dimension | Canonical Value | Code Source | Purpose |
| :--- | :--- | :--- | :--- |
| Desktop Container Max-Width | `max-w-[1540px]` | `Container.tsx:17` | Full storefront section wrapper |
| Mobile Horizontal Padding | `px-4` (16px) | `Container.tsx:25` | Viewports under 640px |
| Tablet Horizontal Padding | `sm:px-8` (32px) | `Container.tsx:25` | Viewports 640px to 1279px |
| Desktop Horizontal Padding | `xl:px-10` (40px) | `Container.tsx:25` | Viewports 1280px and wider |
| Navbar Horizontal Padding | `px-5 sm:px-8 lg:px-12 xl:px-14` | `Navbar.tsx:254` | Edge-to-edge chrome horizontal padding |
| Standard Section Padding | `py-12 sm:py-16 lg:py-24` | `page.tsx`, `BrandPillarsSection.tsx` | Vertical separation between major storefront sections |
| Standard Grid Gap | `gap-4 sm:gap-6 lg:gap-8` | `NewArrivalsSection.tsx`, `ClothingCatalog.tsx` | Product catalog grid spacing |

---

## 6. Shape and Elevation

Corner radiuses across the storefront are split between card containers, form elements, buttons, and status pills.

### Canonical Rule

| Element Type | Canonical Radius | Canonical Border | Canonical Shadow | Code Evidence & Counts |
| :--- | :--- | :--- | :--- | :--- |
| **Card Containers** | `rounded-xl` (12px) | None (light) / `1px solid rgba(255,255,255,0.08)` (dark) | `hover:-translate-y-1.5` lift | **111 card occurrences** (`rounded-xl`) vs 74 (`rounded-2xl`) |
| **Action Buttons** | `rounded-lg` (8px) | None (or `1px solid #111111` for outline) | None | **40 button/link occurrences** (`rounded-lg`); `ui/Button.tsx` (`rounded-[2px]`) is unused |
| **Status Badges & Pills** | `rounded-full` | `1px solid rgba(255,255,255,0.2)` | `shadow-2xs` | **388 occurrences** in `Badge.tsx`, filter chips, rating pills |
| **Form Inputs** | `rounded-lg` (8px) | `1px solid #E8E8E5` | None | **187 occurrences** across checkout, account, and auth forms |
| **Slide-out Drawers** | `rounded-none` | `border-l border-neutral-200` | `shadow-2xl` | `CartDrawer.tsx`, `WishlistDrawer.tsx` |
| **Center Modals** | `rounded-2xl` / `rounded-3xl` | `1px solid rgba(255,255,255,0.12)` | `shadow-[0_35px_100px_rgba(0,0,0,0.95)]` | `AccountModal.tsx` |
| **Toast Notifications** | `rounded-xl sm:rounded-2xl` | `1px solid rgba(255,255,255,0.1)` | `shadow-[0_16px_40px_rgba(0,0,0,0.5)]` | `Toast.tsx:77` |
| **Skeleton Loaders** | `rounded-sm` (2px-4px) | None | None | `Skeleton.tsx:16` |

---

## 7. Components

A complete specification of all reusable and domain components present in the VEYRO storefront.

### 7.1 Announcement Bar
- **File**: `src/components/layout/AnnouncementBar.tsx`
- **Purpose**: Global marquee communicating free shipping thresholds, drop releases, and return guarantees.
- **Classes**: `relative z-40 w-full bg-[#fcd017] text-[#111111] select-none flex items-center overflow-hidden h-[36px]`

### 7.2 Navbar
- **File**: `src/components/layout/Navbar.tsx`
- **Purpose**: Primary application header providing navigation, brand anchor, search trigger, account access, wishlist counter, and cart drawer launcher.
- **Classes**: `sticky top-0 z-50 w-full bg-white flex items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-14`

### 7.3 Hero Panels
- **Files**: `src/components/features/Hero.tsx`, `src/components/features/HeroPanel.tsx`
- **Purpose**: Full-bleed campaign slider showcasing seasonal collections across an auto-advancing 3-panel viewport.

### 7.4 Buttons
- **Files**: Authored inline as raw `<button>` elements (312 occurrences); `src/components/ui/Button.tsx` is imported in 6 files but **rendered 0 times** in the storefront.
- **Dominant Real Classes**: Primary Action: `bg-[#111111] text-white hover:bg-neutral-800 rounded-lg text-sm font-semibold tracking-wide py-3 px-6`.
- **Focus Coverage**: 16 buttons (5.1%) have explicit focus styles; 296 buttons (94.9%) rely on browser defaults.

### 7.5 Product Card
- **File**: `src/components/features/ProductCard.tsx`
- **Classes**: `group flex flex-col isolate transition-transform duration-300 ease-out hover:-translate-y-1.5 rounded-xl sm:rounded-2xl`

---

## 8. Iconography and Imagery

VEYRO combines sharp technical line iconography with editorial, high-contrast studio photography.

### Icon Libraries in Code

| Library | Primary Usages | Sizes in Use | Example Files |
| :--- | :--- | :--- | :--- |
| `src/components/ui/Icons.tsx` | Core shopping chrome: Search, User, Heart, ShoppingCart, Menu, Close, ArrowRight | 14px, 16px, 20px, 24px | `Navbar.tsx`, `Footer.tsx` |
| `lucide-react` | Functional domain indicators: Star, Truck, Package, ShieldCheck, Check, Trash2, SlidersHorizontal | 12px, 14px, 16px, 18px, 20px | `ProductCard.tsx`, `orders/page.tsx` |
| Custom SVG Elements | Brand glyph `VeyroMark`, social icons (Instagram, X, YouTube, Spotify), delivery truck | 14px, 16px, 20px, 32px | `Logo.tsx`, `Footer.tsx` |

---

## 9. Motion

Storefront motion is strictly hardware-accelerated, animating only `transform` and `opacity` to maintain 120fps performance on mobile and desktop.

### Canonical Rule

| Motion Target | Duration | Easing Curve | Code Implementation |
| :--- | :--- | :--- | :--- |
| Interactive Transition | 200ms (`duration-200`) | `ease-out` / `ease-in-out` | 131 occurrences (canonical duration) |
| Structural / Modal Lift | 300ms (`duration-300`) | `cubic-bezier(0.16, 1, 0.3, 1)` | 113 occurrences |
| Button Active Press | 150ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `globals.css:392` (`.filter-btn-press:active`) |
| Announcement Marquee | 40s | `linear infinite` | `globals.css:165` (`.animate-marquee`) |

---

## 10. Layering

A comprehensive recount of every `z-*` class across the VEYRO storefront, classifying canonical values by purpose alongside one-off and ad-hoc overrides.

### Canonical Z-Index Scale (By Majority Purpose)

The canonical scale consists exclusively of standard Tailwind z-index tokens that represent the dominant value for their respective architectural purpose:

| Canonical Token | Occurrences | Purpose in Code | Dominant Element Types & Files |
| :--- | :--- | :--- | :--- |
| **`z-10`** | **99** | Badges, card media controls, rating pills, active panel content | Sold out pill, ratings, WishlistButton (`ProductCard.tsx`), slide panels (`Hero.tsx`) |
| **`z-20`** | **25** | Interactive overlays, photo nav arrows, ambient illumination | Bento spotlight border (`SpotlightBentoCard.tsx`), gallery arrows (`ProductGallery.tsx`), pillar sticky cards (`BrandPillarsSection.tsx`) |
| **`z-30`** | **11** | Sticky catalog filter toolbars, active dropdown menus | Category filter sub-bar (`ClothingCatalog.tsx:409`, `WatchesCatalog.tsx:581`, `FootwearCatalog.tsx:428`, `AllProductsCatalog.tsx:194`), sort dropdown (`SortDropdown.tsx:56`) |
| **`z-40`** | **7** | Secondary sticky headers, announcement marquee | Announcement marquee (`AnnouncementBar.tsx:23`), sticky checkout summary bar (`checkout/page.tsx:968`), sticky return nav (`orders/[id]/page.tsx:239`) |
| **`z-50`** | **22** | Primary global headers, slide-over drawers, modals, toasts | Sticky Navbar (`Navbar.tsx:252`), `CartDrawer.tsx:527`, `WishlistDrawer.tsx:182`, `AccountModal.tsx:396`, `CancelOrderModal.tsx:85`, `Toast.tsx:71` |

### One-Off and Ad-Hoc Z-Index Values

The following non-standard and bracketed values exist in the codebase as isolated, one-off overrides. They are excluded from the canonical scale:

| Value | Occurrences | Element Description | File Path & Line | Status & Classification |
| :--- | :--- | :--- | :--- | :--- |
| **`z-1`** | 9 | Directional dark gradient scrims and vignette overlays over campaign banners | `FootwearCatalog.tsx:393, 610, 611`, `ClothingCatalog.tsx:376, 582, 583`, `CollectionsCatalog.tsx:355`, `AccountModal.tsx:427, 428` | **Ad-hoc sub-layer**: Non-standard utility used between base (`z-0`) and content (`z-10`). |
| **`z-0`** | 8 | Return stepper track lines, decorative gradient lines, inactive slider backgrounds | `app/orders/[id]/return/page.tsx:255, 259, 420, 720`, `WatchesCatalog.tsx:531`, `FootwearSection.tsx:465, 466`, `CollectionsCatalog.tsx:340` | **Base layer**: Standard background utility, not an overlay. |
| **`z-[70]`** | 1 | Toast notification container mount inside AccountModal dialog | `components/features/AccountModal.tsx:390` | **One-off override**: Elevates toast notifications above the `z-50` modal backdrop. |
| **`z-[100]`** | 2 | Mobile navigation menu slide-out drawer; mobile catalog filter drawer | `components/layout/Navbar.tsx:497`, `src/app/section/[slug]/page.tsx:222` | **One-off override**: Ad-hoc drawer elevation that bypasses canonical `z-50`. |
| **`z-[150]`** | 1 | Fullscreen mobile search takeover overlay | `components/features/ProductSearch.tsx:243` | **One-off override**: Extreme elevation ensuring search covers headers, drawers, and toasts. |

### Complete Table of All Z-Index Values in Code

| Z-Index Value | Total Count | Purpose & Elements Using It | Exact Files in Storefront |
| :--- | :--- | :--- | :--- |
| `z-10` | 99 | Product card badges, rating pills, WishlistButton, active slide wrappers, modal text lockups | 31 files (`ProductCard.tsx`, `HeroPanel.tsx`, `Hero.tsx`, `AccountModal.tsx`, `CancelOrderModal.tsx`, `y-axis.tsx`, etc.) |
| `z-20` | 25 | Spotlight bento borders, photo nav buttons, clickable full-panel links, flip sneaker cutout graphic, pillar sticky text | 15 files (`SpotlightBentoCard.tsx`, `ProductGallery.tsx`, `HeroPanel.tsx`, `BrandPillarsSection.tsx`, `PromoFlipBanner.tsx`) |
| `z-50` | 22 | Primary sticky Navbar, CartDrawer, WishlistDrawer, AccountModal, CancelOrderModal, sidebar filter drawers, search popover, toasts | 19 files (`Navbar.tsx`, `CartDrawer.tsx`, `WishlistDrawer.tsx`, `AccountModal.tsx`, `CancelOrderModal.tsx`, `Toast.tsx`, `SortDropdown.tsx`) |
| `z-30` | 11 | Sticky catalog filter toolbars, sort dropdown menu container, TearTicket holographic foil, ScrollArea scroll thumb | 10 files (`ClothingCatalog.tsx`, `WatchesCatalog.tsx`, `FootwearCatalog.tsx`, `AllProductsCatalog.tsx`, `PromoFlipBanner.tsx`, `TearTicket.tsx`, `SortDropdown.tsx`, `ScrollArea.tsx`) |
| `z-1` | 9 | Directional dark gradient scrims over banner photos, radial vignette masks | 4 files (`ClothingCatalog.tsx`, `FootwearCatalog.tsx`, `CollectionsCatalog.tsx`, `AccountModal.tsx`) |
| `z-0` | 8 | Stepper connector lines, inactive slider slides, background scrim tracks | 4 files (`orders/[id]/return/page.tsx`, `WatchesCatalog.tsx`, `FootwearSection.tsx`, `CollectionsCatalog.tsx`) |
| `z-40` | 7 | Announcement marquee bar, sticky checkout summary header, order details sticky return bar, review sort popover | 6 files (`AnnouncementBar.tsx`, `checkout/page.tsx`, `orders/page.tsx`, `orders/[id]/page.tsx`, `ProductReviewsSection.tsx`, `CollectionsInteractiveShowcase.tsx`) |
| `z-[100]` | 2 | Mobile navigation slide-out drawer, mobile section filter drawer | 2 files (`Navbar.tsx:497`, `section/[slug]/page.tsx:222`) |
| `z-[150]` | 1 | Fullscreen mobile search modal takeover | 1 file (`ProductSearch.tsx:243`) |
| `z-[70]` | 1 | Toast notification container mount inside AccountModal dialog | 1 file (`AccountModal.tsx:390`) |

### How to Use

- Rule: Limit all standard layering to the 5 canonical tokens: `z-10` (badges/cards), `z-20` (overlays/controls), `z-30` (toolbars), `z-40` (secondary sticky chrome), `z-50` (drawers/modals/toasts).
- Rule: Avoid introducing arbitrary bracketed z-index values like `z-[100]` or `z-[150]`; use canonical `z-50` for application drawers and modals.
- Rule: When mounting toasts within modal dialogs, use canonical toast stacking rather than ad-hoc `z-[70]`.

---

## 11. Page Templates

The structural blueprint and section ordering for all storefront pages.

### 11.1 Homepage (`/`)
1. **Announcement Bar**: Infinite marquee banner (`h-[36px] bg-[#fcd017]`).
2. **Navbar**: Sticky brand header (`h-[74px] sm:h-[82px]`).
3. **Hero**: Multi-panel sliding campaign showcase (5 panels, auto-advancing).
4. **PromoFlipBanner**: 3D interactive toggle between t-shirt and sneaker promo offers.
5. **NewArrivalsSection**: Latest drops grid with category tabs (All, Clothing, Footwear, Watches).
6. **BrandPillarsSection**: 3 sticky full-viewport cards (240+ GSM, Tirupur, Zero Middlemen).
7. **TshirtsSection**: Dedicated apparel archive with fit filters (Oversized, Relaxed, Graphic).
8. **FootwearSection**: Vulcanized sneaker and retro runner lineup.
9. **Footer**: Luxury black brutalist directory and TearTicket VIP pass.

### 11.2 Clothing Catalog (`/clothing`)
1. **Archive Campaign Banner**: Full-width 2K hero banner ("ARCHIVE SALE - UP TO 50% OFF").
2. **Sticky Sub-Bar Toolbar**: Breadcrumbs, mobile filter trigger, active filter chips, sort dropdown, grid density toggle (2 vs 4 cols).
3. **Catalog Body (Sidebar + Grid)**: Desktop `ClothingFilterSidebar` + Responsive `ProductCard` grid.
4. **Bundle Promotion Banner**: In-page promotional lockup for multi-tee discounts.
5. **Fit & Fabric Guide Modal**: Garment measurement charts.

### 11.3 Shoes / Footwear Catalog (`/shoes` & `/footwear`)
1. **Sneaker Vault Hero Banner**: Full-width campaign visual for vulcanized footwear.
2. **Sticky Sub-Bar Toolbar**: Breadcrumbs, filter trigger, active chips, and sort dropdown.
3. **Catalog Body**: `FootwearFilterSidebar` + 4-column sneaker product card grid.
4. **Sneaker Promo Banner**: ₹500 instant discount banner on retro runners.

### 11.4 Watches Catalog (`/watches`)
1. **Horology Archive Hero Banner**: Widescreen editorial showcasing automatic mechanical watches.
2. **Sticky Sub-Bar Toolbar**: Horology breadcrumbs, movement filters, active chips, and sort dropdown.
3. **Catalog Body**: `WatchFilterSidebar` + 4-column watch product card grid.

### 11.5 Collections Showcase (`/collections`)
1. **Interactive Collections Hero**: Fan Deck → Rail → Detail interactive showcase.
2. **Curated Capsule Volumes Catalog**: Grid of seasonal volumes and capsule drops.

### 11.6 Product Detail Page (`/product/[slug]`)
1. **Back Navigation**: `ProductBackButton` linking to the source category.
2. **Product Showcase Grid (2 columns on lg)**: `ProductGallery` (7 cols) + `ProductBuyBox` (5 cols).
3. **ProductReviewsSection**: Customer reviews, star breakdown bars, write review modal.
4. **Dynamic Recommendation Carousels**: Similar Products (`[ 002 ]`), Pair With Clothing (`[ 003 ]`), Pair With Shoes (`[ 004 ]`), Accessorize With Watches (`[ 005 ]`).

### 11.7 Cart Page (`/cart`)
1. **Breadcrumbs**: `HOME > SHOPPING BAG`.
2. **Split Shopping Grid (12 cols on lg)**: Free shipping progress bar + cart items (8 cols) + Order summary card (4 cols).
3. **Recommendation Carousel**: "YOU MAY ALSO LIKE" suggestions.

### 11.8 Checkout Page (`/checkout`)
1. **Checkout Chrome**: Minimal security-focused header with lock icon.
2. **Progress Stepper**: Shipping Address → Delivery Method → Payment Method (UPI QR / Card / COD).
3. **Sticky Order Review Ledger**: Items summary, coupon code, delivery truck animation, "PLACE ORDER" CTA.

### 11.9 Wishlist Page (`/wishlist`)
1. **Breadcrumbs**: `HOME > WISHLIST`.
2. **Wishlist Header**: Title, saved item count, "Move All to Bag", "Clear All" batch actions.
3. **Product Grid**: Saved cards with size selector pill and instant Add to Bag CTA.

### 11.10 Orders Hub (`/orders`)
1. **Breadcrumbs**: `HOME > ORDERS`.
2. **Header Bar**: Title, live order search, status filter chips, sort dropdown.
3. **Orders Card List**: Order ID, placement date, status pill, item thumbnails, live status bar.

### 11.11 Order Details (`/orders/[id]`)
1. **Sticky Header**: `← BACK TO ALL ORDERS`.
2. **Order Meta Strip**: Order ID, placement timestamp, estimated delivery date, status badge.
3. **Live Fulfillment Stepper**: Visual stepper tracking Confirmed → Packed → Shipped → Out for Delivery → Delivered.
4. **Ordered Items & Ledger Breakdown**: Items breakdown, shipping/payment cards, totals, cancel/return action hub.

### 11.12 Order Return Portal (`/orders/[id]/return`)
1. **Header Bar**: Return portal navigation and order item selection.
2. **Return Reasons & Method Stepper**: Item inspection, pickup address confirmation, refund destination (UPI / Bank / Store Credit).

### 11.13 Account Page (`/account`)
1. **Account Profile Banner**: User name, email, member since date, "Sign Out" button.
2. **Quick Access Cards**: Orders Hub, Saved Addresses, Wishlist.
3. **Profile Editor**: Editable form for full name, phone number, and default delivery address.

### 11.14 Customer Care & FAQ (`/faq`)
1. **Breadcrumbs**: `HOME > CUSTOMER CARE & FAQ`.
2. **Concierge Search**: Real-time keyword filter across support questions.
3. **Category Tabs & Accordion Q&A**: Orders & Delivery, Shipping, Returns, Fabrics & Sizing, Account.
4. **Deep Navy Typography**: Headings and accordion titles rendered in `#101828`.

### 11.15 Member Login Modal (`AccountModal`)
1. **Two-Column Split Dialog**: Dark campaign photo with white Logo on left (`bg-[#0c0c0e]`) + Phone/OTP authentication form on right.

---

## 12. Accessibility and Responsive Behaviour

### Colour Contrast Compliance

- Primary text `#111111` on `#FFFFFF` yields **18.88:1**, far exceeding the WCAG AAA requirement (7.0:1).
- Gold accent `#FCD017` on `#111111` yields **12.74:1**, exceeding WCAG AAA.
- Gold accent `#FCD017` on `#FFFFFF` yields **1.48:1** and fails WCAG AA. It is strictly forbidden to use `#FCD017` as text on light surfaces.
- FAQ Deep Navy `#101828` on `#FFFFFF` yields **16.14:1 AAA**.
- Secondary body text on white uses `#555555` (**7.46:1** AAA) or `#666666` (**5.74:1** AA).

### Focus Styles and Keyboard Navigation

- **Empirical Focus Coverage**: Across 312 raw `<button>` elements, only **16 buttons (5.1%)** currently declare explicit `focus-visible:` or `focus:` styles. **296 buttons (94.9%)** lack explicit keyboard focus styles and rely on browser defaults.
- All new and refactored controls must implement visible focus rings: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-veyro-black focus-visible:ring-offset-2` or `focus-visible:ring-[#fcd017]`.

---

## 13. Do and Don't

Ten mandatory rules to follow and ten critical violations to avoid.

### 10 Do Rules

1. **Do** use `Container` with default `max-w-[1540px]` on all storefront sections to maintain unified alignment.
2. **Do** set primary text to `#111111` (`text-veyro-black`) on white surfaces for 18.88:1 AAA contrast.
3. **Do** pair the gold accent `#FCD017` with `#111111` text, or use it as text only against dark backgrounds (`#111111` or `#050505`).
4. **Do** use `rounded-xl` (12px) for card containers based on the storefront majority count (111 card occurrences).
5. **Do** use `rounded-lg` (8px) for action buttons and `rounded-full` for icon/pill buttons across storefront forms and catalogs.
6. **Do** limit z-index layering to the 5 canonical tokens: `z-10`, `z-20`, `z-30`, `z-40`, `z-50`.
7. **Do** animate only `transform` and `opacity` to maintain 120fps GPU execution.
8. **Do** provide clear `alt` descriptions on all Next.js `Image` components and `aria-label` on icon-only buttons.
9. **Do** include `motion-reduce:animate-none` or `prefers-reduced-motion` guards on every animation.
10. **Do** format navigation links, badges, button CTAs, and section tags in `uppercase` with tracking `tracking-wider`.

### 10 Don't Rules

1. **Don't** use gold `#FCD017` as text on white backgrounds (fails WCAG contrast at 1.48:1).
2. **Don't** introduce one-off z-index overrides like `z-[70]`, `z-[100]`, or `z-[150]`; use canonical `z-50` for drawers and modals.
3. **Don't** claim `ui/Button.tsx` defines canonical button rules while using raw `<button>` elements inline across the storefront.
4. **Don't** invent external font families (do not use Archivo or Inter in storefront code).
5. **Don't** hardcode random pixel values for containers; use the canonical `max-w-[1540px]`.
6. **Don't** animate `top`, `left`, `width`, `height`, or `margin` for transitions.
7. **Don't** write the brand name as `Veyro` or `veyro`; always write `VEYRO`.
8. **Don't** omit `quality={80}` or responsive `sizes` on Next.js images.
9. **Don't** use `#999999` for body copy on white surfaces.
10. **Don't** use hype-driven marketing fluff or hyperbolic discount slogans in brand copy.

---

## 14. Known Inconsistencies

### How Counts Were Measured

- **File Scope**: Exactly 178 storefront source files in `veyro/src/` (including `src/app/globals.css`, layout, storefront pages, features, and UI components). Excluded: `src/app/admin/**`, `src/components/admin/**`, and the documentation page `src/app/design-guidelines/**`.
- **Parsing Method**: Static AST extraction and regex token analysis across source text. Class name tokens (`className="..."`, `className={`...`}`), inline style declarations (`style={{ ... }}`), and CSS rules in `globals.css` were parsed.
- **Literal Color Count Note**: Storefront source files contain 559 literal occurrences of `#111111` and 170 literal occurrences of `#fcd017`; the broader counts of 583 and 205 reported in earlier audits included `src/app/admin/**` files and `public/` vector assets.

### Comprehensive Inconsistency Audit Table

| Inconsistency Area | Existing Variations in Code | Occurrences | Canonical Rule for New Work | Remediation Effort |
| :--- | :--- | :--- | :--- | :--- |
| **Colour Literals vs Tokens** | Hardcoded `#111111` used instead of `veyro-black` (559); hardcoded `#fcd017` instead of `veyro-yellow` (170) | 729 across 41 files | Use `@theme` tokens `text-veyro-black`, `bg-veyro-black`, `bg-veyro-yellow` | Low |
| **Card Corner Radius** | `rounded-xl` (12px) with 111 card occurrences vs `rounded-2xl` (16px) with 74 card occurrences | 111 vs 74 on cards (113 vs 76 total) | Standard card containers must use canonical `rounded-xl` (12px) | Low |
| **Button Radius & Component Adoption** | `ui/Button.tsx` (`rounded-[2px]`) imported in 6 files but rendered **0 times**. Raw `<button>` tags (312): `no_explicit_radius` (218), `rounded-lg` (40 with links), `rounded-full` (33 with links), `rounded` (21), `rounded-xl` (16), `rounded-[2px]` (0) | 312 raw `<button>` tags across 45 files | Standardize action buttons on `rounded-lg` (8px) and icon/pill buttons on `rounded-full` | High |
| **Primary Button Styles** | 8 distinct inline primary button combinations: `bg-black + rounded-lg` (7), `bg-[#111111] + rounded-[2px]` (7), `bg-[#111111] + rounded-lg` (4), `bg-[#111111] + rounded-full` (4), `bg-neutral-900 + rounded-xl` (2), `bg-black + rounded-xl` (2), others (2) | 28 primary action buttons across 14 screens | Unify primary CTA buttons on `bg-veyro-black text-white rounded-lg px-6 py-3 font-semibold` | Medium |
| **Button Focus-Visible Coverage** | Buttons with explicit focus styling (`focus-visible:` or `focus:`): 16 (5.1%). Buttons lacking focus styling: 296 (94.9%) | 16 with focus vs 296 without | Add mandatory `focus-visible:ring-2 focus-visible:ring-veyro-black focus-visible:ring-offset-2` | Medium |
| **Font Families & Roles** | 5 families loaded in `layout.tsx`: `Geist Sans` (default across all 178 files; 23 explicit `font-sans`), `Geist Mono` (`font-mono`, 157), `Dancing Script` (`.font-script`, 19), `Montserrat` (`.font-luxury`, 19 in 5 files), `Outfit` (`--font-outfit`, 23 in 5 files) | 5 families across 178 files | Default to `Geist Sans` for general UI; `Geist Mono` for SKUs/metadata; reserve `Dancing Script` and `Montserrat` for editorial accents | Low |
| **Arbitrary Text Sizes (`text-[Npx]`)** | 42 distinct arbitrary text sizes across 799 usages. Top 3: `text-[11px]` (312), `text-[10px]` (178), `text-[13px]` (54) (plus `text-[14px]`: 45, `text-[9px]`: 37) | 42 distinct sizes, 799 occurrences | Consolidate onto standard Tailwind scale (`text-xs` 12px, `text-sm` 14px) or `@theme` micro-tokens (`text-label-small`: 11px) | Medium |
| **Grey Families & Hardcoded Hexes** | Tailwind `neutral` (2,103 occurrences) dominates, with minor `zinc` (8) and `slate` (5). Hardcoded greys: `#111111` (559), `#666666` (40), `#888888` (37), `#E8E8E5` (27), `#555555` (23), `#999999` (20), `#8E8E8E` (20), `#333333` (19) | 2,116 Tailwind tokens; 745 hex literals | Use Tailwind `neutral` for general neutrals; use `@theme` tokens (`veyro-border`, `veyro-muted`, `veyro-subtle`) for brand borders/meta | Medium |
| **Shadow Token Fragmentation** | 49 distinct shadow definitions (10 standard utilities + 39 custom bracketed `shadow-[...]` definitions). Standard: `shadow-xs` (118), `shadow-sm` (75), `shadow-md` (55), `shadow-2xs` (47), `shadow` (39), `shadow-lg` (21), `shadow-2xl` (19) | 49 distinct values, 421 occurrences | Restrict shadow usage to canonical scale: `shadow-xs` for cards/pills, `shadow-md` for hover states, `shadow-2xl` for modals | Low |
| **Container Max Widths** | Canonical `max-w-[1540px]` (`Container.tsx`) vs `max-w-7xl` (1280px, 2 files), `max-w-[1300px]` (3 promo banners), `max-w-[1536px]` (2 catalog sub-bars), `max-w-2xl` (13 editorial texts), `max-w-md` (19 dialogs) | 8 variations across 39 files | Standard storefront page sections use `<Container>` with default `max-w-[1540px]` | Low |
| **Page Background Tints** | Canonical canvas is `bg-white` (`#FFFFFF`, 6 screens), but 7 utility screens use `bg-neutral-50`/`#FAFAFA`, 1 screen uses `bg-[#fbfbf9]`, and 1 dialog uses `bg-[#0c0c0e]` (4 distinct tints total) | 4 distinct background tints across 15 screens | Standardize standard pages on canonical `bg-white`; keep `bg-neutral-50` consistently for utility workflows | Low |
| **FAQ Navy Text Color** | FAQ page uses isolated Deep Navy text (`#101828`) and slate neutrals (`#344054`, `#475467`, `#667085`), diverging from universal `#111111` | 15 occurrences in `app/faq/page.tsx` | Align FAQ headings and body with canonical `#111111` (`text-veyro-black`) and `#555555` | Low |
| **Z-Index Layering Scale** | 5 canonical values (`z-10`, `z-20`, `z-30`, `z-40`, `z-50`) alongside 5 non-standard / one-off values: `z-1` (9 scrims), `z-0` (8 lines/tracks), `z-[70]` (1 in `AccountModal.tsx`), `z-[100]` (2 in `Navbar.tsx` & `section/[slug]`), `z-[150]` (1 in `ProductSearch.tsx`) | 185 total z-index occurrences across 10 distinct values | Restrict layering to the 5 canonical tokens (`z-10` to `z-50`); eliminate arbitrary one-offs (`z-[70]`, `z-[100]`, `z-[150]`) | Low |
| **Transitions & Animation Libraries** | 223 occurrences of `transition-all`. Duration values: `duration-200` (131), `duration-300` (113), `duration-150` (41), `duration-500` (21), `duration-700` (19). Two animation libraries: `motion/react` in 35 files vs `framer-motion` in 7 files | 223 `transition-all`; 325 durations; 2 libraries | Use specific transitions (`transition-transform`, `transition-opacity`, `transition-colors`); standardize on `duration-200`/`duration-300`; consolidate on `motion/react` | Medium |

---

## 15. Maintenance

### How to Update These Guidelines

1. **Inspect Before Changing**: Scan the storefront code first using ripgrep or ast-grep to verify whether a proposed value already exists.
2. **Verify Against Tokens**: When adding a color, declare it in `src/app/globals.css` `@theme` block before utilizing it in markup.
3. **Calculate WCAG Contrast**: For every new color combination, calculate relative luminance and contrast ratio against `#FFFFFF` and `#111111` using the WCAG 2.1 formula.
4. **Enforce Motion Discipline**: Any new animated element must animate only `transform` and `opacity` and include `prefers-reduced-motion` overrides.
5. **Dual Documentation Sync**: Whenever modifying `DESIGN_GUIDELINES.md`, update the read-only page `src/app/design-guidelines/page.tsx` simultaneously.

### Ownership

- **Custodian**: VEYRO Design System Team
- **Version**: 1.0
- **Effective Date**: 2026-10-24
