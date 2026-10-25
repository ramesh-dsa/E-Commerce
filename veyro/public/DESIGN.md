# VEYRO Brand & Design Guidelines

**Version 2.0 — Updated October 2026**  
**The Single Source of Truth for the VEYRO Storefront**

All user interface development, refactoring, and component creation across the storefront, catalog pages, product details, modals, and slide-over drawers must strictly adhere to this document. When an existing component and this specification disagree, this specification is the single source of truth and the component is scheduled for alignment.

---

## Foundations

### 01 Brand Essence

The VEYRO brand system is anchored by five fundamental principles:

1. **One Brand Colour Story**: A unified, high-contrast palette centered on Ink (`#111111`, `--color-veyro-black`), disciplined Gold (`#FCD017`, `--color-veyro-yellow`), clean off-white surfaces (`#FFFFFF`, `#F8F8F6`, `#F3F3F0`), and intentional deep obsidian surfaces (`#050505` Footer, `#0C0C0E` AccountModal) for luxury streetwear contrast.
2. **One Neutral Family**: Exclusively use the Tailwind **neutral** palette (`neutral-50` through `neutral-950`). Mixing grey families (`gray`, `zinc`, `stone`, `slate`) is prohibited.
3. **Tokens Before Literals**: Consolidate hardcoded hex values onto Tailwind v4 `@theme` tokens declared in `globals.css` (`veyro-black`, `veyro-yellow`, `veyro-surface`, `veyro-border`, etc.). Storefront shell elements (Navbar, Footer, CartDrawer) are 100% unified.
4. **Motion is Intentional**: Continuous and frequent animations must animate **only `transform` and `opacity`** with `transform-gpu` and `motion/react` to preserve 60fps execution and prevent layout reflows. Never animate geometry (`top`, `left`, `width`, `height`, `margin`).
5. **Shared Component Architecture**: All UI elements must use shared primitives (`ui/Button`, `ui/Badge`, `ui/WishlistButton`, `ui/SpotlightBentoCard`, `ui/Toast`, `features/ProductCard`, `ui/Logo`). Inline ad-hoc components and unstyled raw buttons for primary actions are prohibited.

#### The Studio Voice

The studio voice is architectural, brutalist, and declarative:  
*"Built For The Archive. We reject seasonal trends. Every piece is engineered with obsessive attention to fabric weight, structural drape, and minimalist utility."* (`src/components/features/BrandPillarsSection.tsx:163`)  
*"Engineered for the modern Indian uniform. Architectural cuts, premium textiles, and brutalist silhouettes."* (`src/components/layout/Footer.tsx:181`)

#### The Three Value Pillars

Defined in `src/components/features/BrandPillarsSection.tsx`:

| Pillar ID | Pillar Title | Code Description |
|---|---|---|
| `01` | 240+ GSM HEAVYWEIGHT | 100% long-staple Indian combed cotton. Architectural drape that retains shape wash after wash. Engineered to feel substantial on the body. |
| `02` | CRAFTED IN TIRUPUR | Direct partnerships with India's most respected artisanal garment mills. Every stitch is placed with precision by master craftsmen. |
| `03` | ZERO MIDDLEMEN | Pure direct-to-consumer model. We bypass traditional retail markups to bring you premium luxury-grade fabrics at honest, accessible prices. |

---

### 02 Logo

The VEYRO visual identity is defined in `src/components/ui/Logo.tsx` with two exported vector primitives: the full geometric wordmark (`Logo`) and the standalone glyph mark (`VeyroMark`).

#### Logo Specifications

| Property | Wordmark (`Logo`) | Glyph (`VeyroMark`) |
|---|---|---|
| ViewBox | `160 55 658 140` | `170 65 115 121` |
| Vector Geometry | Letter paths V, E, Y, R, O with modern squircle O | Exact letter V path: `VEYRO_V_PATH` |
| Default Height | `28px` (`height={28}`) | `20px` (`w-5 h-5`) |
| Minimum Height | `26px` (used in mobile navigation & AccountModal) | `16px` (`w-4 h-4`) |
| Fill Mode | Geometric vector fill (`fill="#0B0B0B"` or `#FFFFFF`) | `fill="currentColor"` |
| Clear Space | Minimum 50% glyph height on all four sides | Minimum 8px clear boundary |

#### Variants in Code

- `black` (default): Fills letterforms with `#0B0B0B`. Used on white storefront backgrounds.
- `white`: Fills letterforms with `#FFFFFF`. Used on dark backgrounds, modals, and footers.
- `accent`: Includes a 5px gold top accent bar (`<rect fill="#FFD400" height="5" rx="2.5" />`) positioned above the wordmark.

#### Where the Logo Appears

- `src/components/layout/Navbar.tsx` (Desktop): `<Logo height={29} className="sm:h-[31px] lg:h-[33px]" />` (variant `black`).
- `src/components/layout/Navbar.tsx` (Mobile Menu): `<Logo height={26} />` (variant `black`).
- `src/components/layout/Footer.tsx`: `<Logo height={32} variant="white" />`.
- `src/components/features/AccountModal.tsx`: `<Logo variant="white" height={26} />`.

#### Logo Do and Don't

- **Do** maintain the 50% clear space boundary around the wordmark at all times.
- **Do** render the `black` variant on pure white backgrounds and the `white` variant on dark surfaces.
- **Don't** compress, stretch, tilt, or alter the vector aspect ratio of the wordmark.
- **Don't** apply gradients, drop shadows, or outlines to the letterforms.
- **Don't** render the wordmark smaller than 26px in height.

---

### 03 Color

The VEYRO palette is disciplined and luminous. Crisp light surfaces dominate the storefront canvas, contrasted with authoritative Ink, focused Gold highlights, and intentional deep obsidian surfaces for prestige streetwear presence.

#### Core Brand Tokens

| Token | Hex | Name / Class | Role & Usage | Contrast on White | WCAG Rating |
|---|---|---|---|---|---|
| Ink | `#111111` | `--color-veyro-black` | Primary text, high-contrast UI elements, primary logos | 18.88:1 | AAA |
| Gold | `#FCD017` | `--color-veyro-yellow` | Primary CTAs, active badges, focus accents. **Never text on light surfaces.** | 1.48:1 | Fail (Use as background only) |
| Gold Hover | `#E5BC05` | `--color-veyro-yellow-dark` | Hover and active state for Gold buttons | 1.82:1 | Fail (Use as background only) |
| Gold Tint | `#FFF8E7` | `--color-veyro-yellow-tint` | Background tint for high-priority status chips | — | — |
| Charcoal | `#1F1F1F` | `--color-veyro-charcoal` | Deep secondary surface, input backgrounds | 16.5:1 | AAA |
| Muted Grey | `#999999` | `--color-veyro-muted` | Secondary icons, inactive indicators | 2.84:1 | Non-text |
| Subtle Grey | `#8E8E8E` | `--color-veyro-subtle` | Subtle helper text, SKU chips | 3.42:1 | AA Large |
| Terracotta Accent | `#C44D25` | `--color-veyro-accent` | Urgent sale tags, return alerts, discount chips | 4.88:1 | AA |
| Accent Hover | `#A33C1A` | `--color-veyro-accent-hover` | Hover state for urgent action buttons | 6.52:1 | AAA |
| Accent Light | `#FDF3EF` | `--color-veyro-accent-light` | Subtle wash for discount tags and return notices | — | — |

#### Surface & Border Scale

| Token | Hex | Class | Role & Usage |
|---|---|---|---|
| Page White | `#FFFFFF` | `bg-white` | Universal application background canvas |
| Section Surface | `#F8F8F6` | `bg-veyro-surface` | Default alternating section background |
| Alternate Surface | `#F3F3F0` | `bg-veyro-surface-alt` | Card backgrounds, table headers, secondary surfaces |
| Border | `#E8E8E5` | `border-veyro-border` | Standard card borders, section dividers |
| Light Border | `#F0F0ED` | `border-veyro-border-light` | Subtle dividers, nested list borders |
| Deep Obsidian | `#050505` | `bg-[#050505]` | Global footer anchor surface (`Footer.tsx:164`) |
| Auth Obsidian | `#0C0C0E` | `bg-[#0C0C0E]` | Luxury authentication modal container (`AccountModal.tsx:412`) |
| Auth Card | `#101013` | `bg-[#101013]` | Inner credentials and profile cards (`AccountModal.tsx:472`) |
| Brand Dark | `#0A0A0A` | `bg-[#0A0A0A]` | Heavyweight cotton architectural statement (`BrandPillarsSection.tsx:150`) |

#### Text Hierarchy (Tailwind Neutral Ramp)

| Token | Hex | Class | Purpose | Contrast on White | WCAG Rating |
|---|---|---|---|---|---|
| Primary Text | `#171717` | `text-neutral-900` | Headings, titles, primary body copy | 17.93:1 | AAA |
| Secondary Text | `#525252` | `text-neutral-600` | Subtitles, supporting copy, table headers | 7.81:1 | AAA |
| Muted Text | `#737373` | `text-neutral-500` | Metadata, timestamps, SKU numbers, eyebrows | 4.74:1 | AA |
| Placeholder | `#A3A3A3` | `text-neutral-400` | Form input placeholders, decorative icons only | 2.52:1 | Fail (Restricted to non-text) |

#### Status Colours (Strict Functional Set Only)

| State | Text Class | Background Class | Border Class | Contrast on White | WCAG Rating |
|---|---|---|---|---|---|
| Success | `text-emerald-600` | `bg-emerald-50` | `border-emerald-200` | 3.77:1 | AA Large |
| Error | `text-red-600` | `bg-red-50` | `border-red-200` | 4.83:1 | AA |
| Warning | `text-amber-600` | `bg-amber-50` | `border-amber-200` | 3.19:1 | AA Large |
| Info | `text-blue-600` | `bg-blue-50` | `border-blue-200` | 5.17:1 | AA |

#### Gold Usage Rule
Gold (`#FCD017`, `bg-veyro-yellow`) is exclusively an accent and background colour for primary buttons, notification dots, and active badges. Gold text on light surfaces produces an unacceptable 1.48:1 contrast ratio and is strictly prohibited. When Gold is used as a background, pair it with Ink (`#111111`, `text-veyro-black`) text for an authoritative 12.74:1 contrast ratio.

#### Prohibited Colours
The colour families `gray`, `zinc`, `stone`, `slate`, `cyan`, `indigo`, `rose`, `teal`, and arbitrary random hex literals are not part of the system and must be replaced with defined `@theme` tokens.

---

### 04 Typography

The storefront typography system is powered by Google Fonts loaded via Next.js Font Optimization in `src/app/layout.tsx`.

#### Loaded Font Families & Roles

1. **Universal Storefront Default: Geist Sans**
   - **Variable**: `--font-geist-sans` (`font-sans`)
   - **Weights**: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold), `900` (Black)
   - **Role**: Default base typeface across all 178 storefront files — headings, body copy, navigation, buttons, and product descriptions.
   - **Styling**: Upper-case with `tracking-tight` on titles; clean `tracking-normal` on body paragraphs.

2. **Data & Metrics: Geist Mono**
   - **Variable**: `--font-geist-mono` (`font-mono`)
   - **Weights**: `400` (Regular), `500` (Medium), `700` (Bold)
   - **Role**: Product SKUs, currency amounts (₹), measurement specs, technical parameters, and tabular data alignment (157 occurrences across the codebase).

3. **Luxury Editorial: Montserrat**
   - **Variable**: `--font-montserrat` (`.font-luxury`)
   - **Weights**: `400`, `500`, `600`, `700`, `800`
   - **Role**: Luxury editorial banners, high-fashion statement headlines, lookbook showcases, and uppercase price badges in `CollectionsShowcase.tsx`.

4. **Contemporary Display: Outfit**
   - **Variable**: `--font-outfit`
   - **Weights**: `400`, `500`, `600`, `700`, `800`
   - **Role**: Contemporary display headings, category hero headlines, and collection showcases in `CollectionsCatalog.tsx`.

5. **Specialty Script: Dancing Script**
   - **Variable**: `--font-dancing-script` (`.font-script`)
   - **Weights**: `700` (Bold)
   - **Role**: Calligraphic boutique touches, artisanal signature stamps, and curated promotional taglines.

#### Type Scale & Usage

| Token | Size | Line Height | Usage |
|---|---|---|---|
| `text-2xs` | 10-11px | 16px | Micro badges, status indicators, SKU tags, fine metadata |
| `text-xs` | 12px | 16px | Eyebrows, uppercase tags, compact labels, secondary dates |
| `text-sm` | 14px | 20px | Secondary copy, input text, table cells, review descriptions |
| `text-base` | 16px | 24px | Default body copy, lead intro copy, standard action buttons |
| `text-lg` | 18px | 28px | Sub-headings, emphasized copy, pricing callouts |
| `text-xl` | 20px | 28px | Card titles, compact section headings, drawer titles |
| `text-2xl` | 24px | 32px | Modal titles, sub-section headers, feature headlines |
| `text-3xl` | 30px | 36px | Major section titles, category headings, H1 page titles |
| `text-4xl` | 36px | 40px | High-level page headers, lookbook banners |
| `text-5xl` | 48px | 48px | Display titles, campaign headlines |
| `text-6xl` | 60px | 60px | Hero display headings only |
| `.text-display` | `clamp(2.25rem, 5vw, 3.75rem)` | 1.05 | Fluid hero display headlines with `-0.03em` tracking |

*Arbitrary pixel sizes (such as `text-[11px]`, `text-[10px]`, `text-[13px]`) are consolidated onto standard scale tokens (`text-2xs` through `text-6xl`).*

#### Allowed Font Weights
- `font-normal` (400) — Body text and secondary descriptions.
- `font-medium` (500) — Interactive labels, table cells, and input content.
- `font-semibold` (600) — Buttons, navigation items, subheadings.
- `font-bold` (700) — Headings (`h1` - `h6`), major display titles, brand marks.
- `font-black` (800/900) — Impact statement display titles in lookbooks.

#### Letter Spacing (Tracking)
- `tracking-tight`: Hero display and large heading titles.
- `tracking-normal`: Standard body copy and paragraphs.
- `tracking-wide`, `tracking-wider`: Eyebrows, uppercase tags, button text.
- `tracking-widest`: Micro-spaced badges, technical SKU tags.

---

## System

### 05 Layout and Spacing

Layout geometry is governed by four container recipes, unified padding gutters, and consistent vertical section rhythm.

#### Container Max-Width Scale

| Recipe | Max Width | Purpose |
|---|---|---|
| **Wide** | `max-w-[1440px]` | Home page layouts, hero banners, wide catalog showcases |
| **Standard** | `max-w-7xl` (1280px) | Shopping cart, checkout, account dashboard, order history |
| **Reading** | `max-w-3xl` (768px) | Policies, articles, FAQs, rich documentation |
| **Form** | `max-w-md` (448px) | Authentication, login dialogs, single-column forms |

#### Horizontal Padding
Universal container horizontal gutter across all views: `px-4 sm:px-6 lg:px-8`.

#### Section Spacing & Rhythm
- **Standard Section**: `py-16 sm:py-20 lg:py-24`
- **Compact Section**: `py-10 sm:py-14`

#### Flexbox & Grid Gaps
Permitted gap tokens: `gap-4` (16px), `gap-6` (24px), `gap-8` (32px). Arbitrary spacing values (e.g. `gap-[18px]`) are prohibited.

#### Responsive Breakpoints
Standard Tailwind breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).

---

### 06 Shape and Elevation

Corner radii and elevation levels follow a clear, intentional hierarchy aligned with the live storefront components.

#### Corner Radius Scale

| Token | Value | Application | Verified In Code |
|---|---|---|---|
| `rounded-full` | 9999px | Action buttons, pill chips, icon buttons, status badges | `ProductBuyBox.tsx:362`, `Button.tsx:28` |
| `rounded-2xl` | 16px | **Storefront Card Standard**: Product cards, catalog grids, review blocks, modals | `ProductCard.tsx:45`, `FootwearCatalog.tsx:647` |
| `rounded-xl` | 12px | Component Sub-containers: Spotlight bento cards, product thumbnails, toast alerts, drawers | `SpotlightBentoCard.tsx:79`, `Toast.tsx:77` |
| `rounded-lg` | 8px | Controls & Inputs: Form inputs, size selection buttons, quantity pickers | `ProductBuyBox.tsx:715`, `ProductSearch.tsx:300` |
| `rounded-md` | 6px | Micro Insets: Tag chips, active color swatch indicators, tooltip popovers | `ProductReviewsSection.tsx`, `SortDropdown.tsx` |

*Prohibited*: Arbitrary bracketed radii like `rounded-[2px]`, `rounded-[14px]`.

#### Elevation & Shadows

| Token | Class | Application | Verified In Code |
|---|---|---|---|
| Resting Surface | `shadow-2xs` / `shadow-xs` | Default catalog cards, subtle section dividers & resting state borders | `ProductCard.tsx:45`, `ClothingCatalog.tsx` |
| Interactive Lift | `shadow-sm` / `shadow-md` | Card hover states, floating 'Add to Bag' buttons & sticky navigation | `ProductBuyBox.tsx:526`, `ProductReviewsSection.tsx` |
| Floating Overlays | `shadow-xl` / `shadow-2xl` | Search autocomplete overlay, CartDrawer, AccountModal & modal sheets | `ProductSearch.tsx:559`, `AccountModal.tsx:412` |

*Prohibited*: Ad-hoc inline shadow strings like `shadow-[0_4px_20px_rgba(0,0,0,0.1)]`.

---

### 07 Motion

Animations must feel precise, confident, and lightweight.

#### Durations & Easings
- `duration-150`: Micro-interactions, swatch selections, badge updates.
- `duration-200`: Standard hover states, toggles, button shifts.
- `duration-300`: Card transforms, tab transitions, dropdown reveals.
- `duration-500`: Modal entrances, page reveals, hero animations.
- **Easing**: `ease-out` for entrances; `ease-in` for exits. Standard curve: `cubic-bezier(0.16, 1, 0.3, 1)`.

#### What Animates
- Animate **only `transform` and `opacity`** properties with `transform-gpu`.
- **Never use `transition-all`** on complex containers. Explicitly declare `transition-colors`, `transition-transform`, or `transition-opacity`.
- Never animate geometry properties (`top`, `left`, `width`, `height`, `margin`) as they trigger continuous layout reflows.

#### The Accordion Exception
Smooth height expansion is permitted only when using CSS grid `grid-template-rows: 0fr -> 1fr` transitions or Radix accordion primitives with `overflow-hidden`.

#### Motion Library
Standardize on `"motion"` (`import { motion } from "motion/react"`). Deprecate legacy `framer-motion` imports.

#### Reduced Motion
Every animation and transition must respect `prefers-reduced-motion` using Tailwind's `motion-reduce:transition-none` and `motion-reduce:animate-none` classes.

---

### 08 Z-Index Ladder

All 185 stacking contexts across the storefront strictly follow this verified **10-Tier Ladder**:

| Token / Class | Z-Index | Layer Name | Stacking Elements & Role | Verified In Code |
|---|---|---|---|---|
| `z-[150]` | 150 | Fullscreen Search Takeover | Full-viewport search takeover modal covering all page elements and browser toolbars | `ProductSearch.tsx:243` |
| `z-[100]` | 100 | Mobile Navigation Drawers | Mobile navigation slide-over menu and section filter drawers on handheld screens | `Navbar.tsx:497`, `section/[slug]/page.tsx:222` |
| `z-[70]` | 70 | Account Modal Toast Wrapper | In-modal alert toast wrapper floating above login & profile authentication forms | `AccountModal.tsx:390` |
| `z-50` | 50 | Modals, Drawers & Sticky Header | Sticky desktop Navbar, CartDrawer slide-over, WishlistDrawer & global Toast notifications | `Navbar.tsx:252`, `CartDrawer.tsx:527`, `Toast.tsx:71` |
| `z-40` | 40 | Announcement Bar & Checkout Header | Top yellow ticker announcement bar, sticky checkout navigation & order status headers | `AnnouncementBar.tsx:23`, `checkout/page.tsx:968` |
| `z-30` | 30 | Catalog Sticky Filter Bars & Subnav | In-page sticky sub-nav category filter bars on Footwear & Watches catalog pages | `FootwearCatalog.tsx:428`, `WatchesCatalog.tsx:581` |
| `z-20` | 20 | Interactive Buttons & Overlays | Product gallery zoom pills, category carousel arrows, QR checkout optical sweep | `ProductGallery.tsx:164`, `checkout/page.tsx:2349` |
| `z-10` | 10 | Standard Catalog & Content Cards | Product cards, editorial banners, footwear grids, hero slides & interactive tiles | `ProductCard.tsx:87`, `HeroPanel.tsx:141` |
| `z-1` | 1 | Image Readability Scrims | Dark linear & radial gradient underlays ensuring white text contrast over photos | `FootwearCatalog.tsx:393`, `AccountModal.tsx:427` |
| `z-0` | 0 | Canvas Backgrounds & Track Rails | Background canvas fills, progress timeline tracks, watermark grids & aura layers | `orders/[id]/return/page.tsx:259`, `CollectionsCatalog.tsx:340` |

*Strict Rule: Unmapped arbitrary z-indices (e.g. `z-[9999]`, `z-[999]`) are prohibited.*

---

## Application

### 09 Components

All user interface development uses shared primitives rather than ad-hoc inline elements.

#### Button Primitives (`src/components/ui/Button.tsx`)
- **Primary**: Background Gold (`bg-veyro-yellow text-veyro-black hover:bg-veyro-yellow-dark`), `rounded-full`, `font-semibold`.
- **Secondary**: Background Ink (`bg-veyro-black text-white hover:bg-neutral-800`), `rounded-full`.
- **Outline**: Border `border-neutral-300`, text `text-veyro-black`, `rounded-full`, `hover:border-neutral-900`.
- **Ghost**: Transparent background, text `text-neutral-700 hover:text-veyro-black`, `rounded-full`.
- **Sizes**: `sm` (px-4 py-1.5 text-xs), `md` (px-6 py-2.5 text-sm), `lg` (px-8 py-3.5 text-base).
- **Focus State**: Universal 2px focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]`).

#### Badges & Chips (`src/components/ui/Badge.tsx`)
- **Geometry**: `rounded-full`, uppercase typography, `tracking-wider`.
- **Variants**: Standard Neutral (`bg-neutral-100 text-neutral-800`), Gold Tint (`bg-veyro-yellow-tint text-neutral-900 border border-veyro-yellow/30`), Success (`bg-emerald-50 text-emerald-700 border border-emerald-200`), Sale/Urgent (`bg-veyro-accent-light text-veyro-accent border border-veyro-accent/20`).

#### Wishlist Action (`src/components/ui/WishlistButton.tsx`)
- Pill or circular floating button with spring-animated heart icon (`scale-110 active:scale-95`).
- Integrated directly into `ProductCard.tsx` and `ProductBuyBox.tsx` with unified `WishlistContext`.

#### Spotlight Bento Container (`src/components/ui/SpotlightBentoCard.tsx`)
- Mouse-tracking spotlight gradient canvas with `rounded-2xl` geometry, `bg-white`, and `border-veyro-border`.
- Highlights features and architectural specifications on desktop displays.

#### Storefront Product Card (`src/components/features/ProductCard.tsx`)
- **Container**: `rounded-2xl`, border `border-veyro-border`, `bg-white`, `shadow-2xs hover:shadow-sm`.
- **Image Viewport**: Aspect `aspect-3/4`, background `bg-veyro-surface`, hover zoom with `transition-transform duration-500 ease-out`.
- **Metadata**: Product title in Geist Sans, price in Geist Mono with INR (`₹`) formatting, size availability indicator.

#### Feedback & Notifications (`src/components/ui/Toast.tsx`)
- Floating notification alert at `z-50` with slide-in spring entrance.
- Variants: `success`, `error`, `info`.

#### Media & Icons
- **Images**: Always use `next/image` with explicit width/height or `fill`, defined aspect ratio container, `quality={80}`, and descriptive `alt` text.
- **Icons**: Exclusively use `lucide-react` (with 1.5px to 2px stroke width) and curated vector glyphs from `ui/Logo.tsx` and `ui/Icons.tsx`.
- **Photo Overlays**: When rendering text over photography, always use the overlay sandwich: photo bottom layer, dark gradient scrim (`z-1`, `bg-gradient-to-t from-black/80 via-black/40 to-transparent`), text top layer.

---

### 10 Architecture

The repository adheres to a clean, domain-separated modular architecture.

#### Directory Structure

```
veyro/src/
├── app/                  # Next.js App Router (storefront routes, layouts, API endpoints)
├── components/
│   ├── layout/           # Global shell (Navbar, Footer, AnnouncementBar, SmoothScrolling)
│   ├── features/         # Feature modules (Catalog, Cart, ProductDetail, BrandPillars, AccountModal)
│   ├── ui/               # Shared design system primitives (Logo, Button, Container, Badge, Toast, etc.)
│   └── charts/           # Admin data visualizations (excluded from storefront)
├── context/              # React Context state providers (Cart, Wishlist, User, Reviews)
├── lib/                  # Utilities, formatters, class merging (utils.ts)
├── types/                # Global TypeScript declarations
└── data/                 # Static catalog data and products
```

#### Naming Conventions
- Component files use PascalCase: `ProductCard.tsx`, `SortDropdown.tsx`.
- Utilities, hooks, and helpers use camelCase: `formatPrice.ts`, `useCart.ts`.

#### Client Component Boundaries
Mark files with `"use client"` only when interactive state, browser events, or window APIs are required. Push client boundaries as far down the component tree as possible.

#### Class Merging (`cn()`)
Use `cn()` defined in `src/lib/utils.ts` (combining `clsx` and `tailwind-merge`) whenever combining dynamic and static class names.

---

### 11 Accessibility (a11y)

Accessibility is mandatory across every component:

- **Focus Rings**: Every interactive element must display a visible 2px outline with 2px offset: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]`.
- **Icon-Only Buttons**: Every button without visible text must have an explicit, descriptive `aria-label`.
- **Contrast**: Text contrast must meet or exceed WCAG 2.1 AA (minimum 4.5:1 against light surfaces for normal text, 3:1 for large headings).
- **Touch Targets**: Minimum tap target size on mobile devices is 44px x 44px.
- **Reduced Motion**: Respect `prefers-reduced-motion` at all times (`motion-reduce:transition-none`).
- **Heading Order**: Exactly one `h1` per page; follow strict logical hierarchy (`h2` -> `h3` -> `h4`) without skipping levels.

---

## Governance

### 12 Transition Guidance

The transition strategy is organized around six concrete architectural pillars, directly reflected in the `/design-guidelines` interactive specimen:

| Pillar | Title & Target | Source Files | Architectural Implementation |
|---|---|---|---|
| **01** | Brand design token consolidation | `src/app/globals.css` | Legacy hex literals (`#111111` dark ink, `#fcd017` brand gold, `#f8f8f6` surface) migrate to Tailwind v4 `@theme` tokens (`veyro-black`, `veyro-yellow`, `veyro-surface`, `veyro-border`). Global shell components (`Navbar.tsx`, `Footer.tsx`, `CartDrawer.tsx`) are 100% unified. |
| **02** | Shared action & badge primitives | `src/components/ui/Button.tsx` | Divergent raw `<button>` tags across product catalog pages consolidate onto `ui/Button.tsx` (Primary Gold CTA, Secondary Ink, Ghost/Outline) and `ui/Badge.tsx`, ensuring universal keyboard focus rings and active states. |
| **03** | Product card & bento surface standard | `src/components/features/ProductCard.tsx` | Clothing, footwear, and watch catalog cards strictly adhere to `rounded-2xl` geometry, `bg-veyro-surface` image viewports, liquid wishlist spring animations, and standardized INR currency formatting. |
| **04** | 10-Tier Z-Index ladder governance | `src/app/design-guidelines/ZIndexSpecimen.tsx` | All 185 stacking contexts across the storefront align to the verified 10-tier scale — from `z-0` canvas, `z-40` Navbar, `z-50` CartDrawer, `z-[70]` Toasts, up to `z-[150]` Fullscreen Lightbox — preventing stacking leaks. |
| **05** | Hardware-accelerated GPU motion | `src/components/ui/SpotlightBentoCard.tsx` | Continuous interactive motion is restricted strictly to `transform` and `opacity` with `motion/react` and `transform-gpu`. Geometry-animating transitions (`width`, `height`, `top`) are replaced to guarantee smooth 60fps renders on mobile. |
| **06** | Storefront typography ramp alignment | `src/app/layout.tsx` | Arbitrary `text-[11px]` and `text-[13px]` pixel overrides consolidate onto canonical Tailwind scale tokens (`text-xs` through `text-6xl`), harmonized across the verified storefront fonts: Geist Sans, Montserrat, and Outfit. |

---

### 13 Quick Reference

A concise 12-row summary of canonical standards versus code anti-patterns:

| Category | Follow (The Standard) | Avoid (Anti-Pattern) |
|---|---|---|
| **1. Primary Text** | `text-neutral-900` or `text-veyro-black` | Inline `#111111`, `#000000`, or deep navy `#101828` |
| **2. Primary Action / CTA** | `bg-veyro-yellow text-neutral-900 hover:bg-veyro-yellow-dark` | `bg-black`, `bg-[#111111]`, or terracotta literals |
| **3. Gold Accent Usage** | Gold as background (`bg-[#FCD017]`) or accent bar with Ink text | Gold text on white surfaces (`text-[#FCD017]` fails at 1.48:1) |
| **4. Neutral Greys** | Tailwind `neutral` scale (`neutral-50` through `neutral-950`) | `zinc`, `slate`, `gray`, `stone`, or hardcoded grey hexes |
| **5. Heading Typography** | Geist Sans, Montserrat, Outfit (`uppercase tracking-tight`) | Unloaded external fonts, serif fonts, unoptimized web fonts |
| **6. Font Sizes** | Standard Tailwind scale (`text-2xs` through `text-6xl`) | Arbitrary pixel sizes (`text-[11px]`, `text-[10px]`, `text-[13px]`) |
| **7. Corner Radii** | Canonical 5 tokens: `rounded-full`, `rounded-2xl`, `rounded-xl`, `rounded-lg`, `rounded-md` | Arbitrary bracketed radii (`rounded-[2px]`, `rounded-[14px]`) |
| **8. Elevation & Shadows** | Tailwind scale: `shadow-2xs`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-2xl` | Ad-hoc inline shadow strings `shadow-[0_4px_20px_...]` |
| **9. Transitions** | Specific transitions (`transition-transform`, `transition-opacity`, `duration-200/300`) | `transition-all`, animating `width`, `height`, `top`, `left` |
| **10. Motion Library** | `import { motion } from "motion/react"` | `import { motion } from "framer-motion"` |
| **11. Z-Index Ladder** | Canonical 10 tiers: `z-0` through `z-[150]` (Navbar `z-40`, Modal `z-50`, Toast `z-[70]`) | Unmapped arbitrary z-indices: `z-[9999]`, `z-[999]` |
| **12. Components** | Shared primitives: `<Button variant="primary" />` (`rounded-full`), `<Input />` (`rounded-lg`) | Raw `<button>` or `<input>` elements without shared styling or focus rings |

---

## Appendix: Current Storefront Architecture (Measured)

This appendix provides a full, measured baseline of the storefront codebase across all 178 storefront source files (`src/app`, `src/components`, `src/context`, `src/lib`, excluding admin and design-guidelines).

### 03 Color Baseline

| Metric / Dimension | Current in Code | Architecture Direction |
|---|---|---|
| **Declared `@theme` Tokens** | 14 tokens in `globals.css` (`--color-veyro-yellow`, `--color-veyro-black`, `--color-veyro-surface`, `--color-veyro-border`, etc.) | Storefront shell components (`Navbar`, `Footer`, `CartDrawer`) fully consolidated |
| **Grey Families in Use** | `neutral` (2,104 occurrences), `zinc` (8 occurrences), `slate` (5 occurrences) | 99.4% standard Tailwind `neutral` ramp |
| **Intentional Dark Luxury Surfaces** | `Footer.tsx` (`bg-[#050505]`), `AccountModal.tsx` (`bg-[#0c0c0e]`), `BrandPillarsSection.tsx` (`bg-[#0a0a0a]`) | Preserved as intentional brutalist streetwear luxury contrast anchors |

### 04 Typography Baseline

| Metric / Dimension | Current in Code | Architecture Direction |
|---|---|---|
| **Loaded Font Families** | 5 families in `layout.tsx`: `Geist Sans` (`--font-geist-sans`), `Geist Mono` (`--font-geist-mono`), `Montserrat` (`--font-montserrat`), `Outfit` (`--font-outfit`), `Dancing Script` (`--font-dancing-script`) | Fully supported and optimized via `next/font/google` |
| **Standard Font Sizes** | 1,083 occurrences across standard Tailwind scale (`text-xs` through `text-7xl`) | Primary standard for all new components |
| **Arbitrary Font Sizes** | 796 occurrences across 39 distinct sizes (`text-[11px]`: 312, `text-[10px]`: 178, `text-[13px]`: 54) | Scheduled for consolidation onto `text-2xs`, `text-xs`, and `text-sm` |
| **Font Weights** | `font-bold` (587), `font-semibold` (295), `font-medium` (215), `font-black` (141), `font-normal` (55) | 5 standard weights across display and body hierarchy |

### 05 Layout and Spacing Baseline

| Metric / Dimension | Current in Code | Architecture Direction |
|---|---|---|
| **Container Widths** | Wide `max-w-[1440px]`, Standard `max-w-7xl`, Reading `max-w-3xl`, Form `max-w-md` | Unified container recipe scale |
| **Horizontal Paddings** | Universal gutter `px-4 sm:px-6 lg:px-8` | Applied across all page layouts |
| **Product Grid Breakpoints** | `grid-cols-2` (mobile), `sm:grid-cols-3` (tablet), `xl:grid-cols-4` (desktop) | Standard responsive column rhythm |

### 06 Shape and Elevation Baseline

| Metric / Dimension | Current in Code | Architecture Direction |
|---|---|---|
| **Corner Radius Classes** | `rounded-full` (395), `rounded-lg` (187), `rounded-xl` (135), `rounded-2xl` (84), `rounded-md` (14) | 5 canonical tokens (`rounded-2xl` is the storefront card standard) |
| **Elevation & Shadow Classes** | Tailwind scale: `shadow-2xs` (47), `shadow-xs` (118), `shadow-sm` (75), `shadow-md` (55), `shadow-lg` (21), `shadow-2xl` (19) | 3 functional tiers (Resting, Interactive, Overlay) |

### 07 Motion Baseline

| Metric / Dimension | Current in Code | Architecture Direction |
|---|---|---|
| **Animation Library** | `motion/react` in 35 files; legacy `framer-motion` in 7 files | Consolidating universally onto `motion/react` |
| **Transitions** | Specific transitions (`transition-transform`, `transition-opacity`, `transition-colors`) | Restricting continuous animations to GPU-accelerated `transform` and `opacity` |

### 08 Z-Index Ladder Baseline

| Metric / Dimension | Current in Code | Architecture Direction |
|---|---|---|
| **Stacking Tiers (185 uses)** | `z-10` (99), `z-20` (25), `z-50` (22), `z-30` (11), `z-1` (9), `z-0` (8), `z-40` (7), `z-[100]` (2), `z-[70]` (1), `z-[150]` (1) | 100% mapped onto the verified 10-tier ladder |

### 09 Components Baseline

| Metric / Dimension | Current in Code | Architecture Direction |
|---|---|---|
| **Shared Primitives** | `Button.tsx`, `Badge.tsx`, `WishlistButton.tsx`, `SpotlightBentoCard.tsx`, `ProductCard.tsx`, `Toast.tsx`, `Logo.tsx` | Active primitives verified in `/design-guidelines` specimens |

---

### The Living Source

These guidelines are maintained as `DESIGN.md` in the repository and rendered interactively at `/design-guidelines`.

[Download DESIGN.md](/DESIGN.md)
