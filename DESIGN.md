# VEYRO Brand & Design Guidelines

**Version 1.0 — Updated October 2026**  
**The Single Source of Truth for the VEYRO Storefront**

All user interface development, refactoring, and component creation across the storefront, modals, and drawers must strictly adhere to this document. When a rule and existing code disagree, the rule wins and the code is scheduled for migration.

---

## Foundations

### 01 Brand Essence

The VEYRO brand system is anchored by five fundamental principles:

1. **One Brand Colour Story**: A unified, high-contrast palette centered on Ink (`#111111`), disciplined Gold (`#FCD017`) accents, and clean off-white surfaces (`#FFFFFF`, `#F8F8F6`, `#F3F3F0`).
2. **One Neutral Family**: Exclusively use the Tailwind **neutral** palette (`neutral-50` through `neutral-950`). Mixing grey families (`gray`, `zinc`, `stone`, `slate`) is prohibited.
3. **Tokens Before Literals**: No hardcoded hex values or arbitrary utility classes (such as `[#111111]`, `text-[15px]`, or `rounded-[2px]`) in JSX or styles. Every colour, spacing, radius, and typography value must reference defined design tokens.
4. **Motion is Intentional**: Continuous and frequent animations must animate **only `transform` and `opacity`** to preserve 60fps execution and prevent layout reflows. Never animate geometry (`top`, `left`, `width`, `height`, `margin`).
5. **Shared Component Architecture**: All UI elements must use shared primitives (`ui/Button`, `ui/Input`, `ui/Card`, `ui/Modal`, `ui/Drawer`, `ui/Container`). Inline ad-hoc components and raw buttons for primary actions are prohibited.

When a rule in this specification and existing code disagree, the rule wins and the code is scheduled for migration.

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

The VEYRO palette is disciplined and luminous. Light surfaces dominate every screen, contrasted with authoritative Ink and focused Gold highlights.

#### Core Brand Tokens

| Token | Hex | Name / Class | Role & Usage | Contrast on White | WCAG Rating |
|---|---|---|---|---|---|
| Ink | `#111111` | `--color-veyro-black` | Primary text, high-contrast UI elements, primary logos | 18.88:1 | AAA |
| Gold | `#FCD017` | `--color-veyro-yellow` | Primary CTAs, active badges, focus accents. **Never text on light surfaces.** | 1.48:1 | Fail (Use as background only) |
| Gold Hover | `#E5BC05` | `--color-veyro-yellow-dark` | Hover and active state for Gold buttons | 1.82:1 | Fail (Use as background only) |
| Gold Tint | `#FFF8E7` | `--color-veyro-yellow-tint` | Background tint for high-priority status chips | — | — |

#### Surface & Border Scale

| Token | Hex | Class | Role & Usage |
|---|---|---|---|
| Page White | `#FFFFFF` | `bg-white` | Universal application background canvas |
| Section Surface | `#F8F8F6` | `bg-veyro-surface` | Default alternating section background |
| Alternate Surface | `#F3F3F0` | `bg-veyro-surface-alt` | Card backgrounds, table headers, secondary surfaces |
| Border | `#E8E8E5` | `border-veyro-border` | Standard card borders, section dividers |
| Light Border | `#F0F0ED` | `border-veyro-border-light` | Subtle dividers, nested list borders |

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
Gold (`#FCD017`) is exclusively an accent and background colour for primary buttons, notification dots, and active badges. Gold text on light surfaces produces an unacceptable 1.48:1 contrast ratio and is strictly prohibited. When Gold is used as a background, pair it with Ink (`#111111`) text for an authoritative 12.74:1 contrast ratio.

#### Prohibited Colours
The colour families `gray`, `zinc`, `stone`, `slate`, `terracotta`, `cyan`, `indigo`, `rose`, `teal`, and any ad-hoc hex literals are not part of the system and must be replaced with defined tokens.

#### Theme & Surfaces Rule
- **Light Everywhere**: Pure light mode is enforced across the entire application — storefront, catalog, product details, cart, checkout, account, modals, drawers, login, and admin views.
- **No Dark Islands**: Inverted dark cards, dark sections, or dark popover islands are strictly forbidden. All surfaces remain luminous and consistent.

---

### 04 Typography

The typography system uses two distinct typefaces: **Archivo** for architectural headings and **Inter** for readable body and interface elements.

#### Families & Roles

1. **Heading Font: Archivo**
   - **Weights**: `500` (Medium), `600` (SemiBold), `700` (Bold)
   - **Usage**: `h1` through `h6`, hero display titles, section titles, product names.
   - **Styling**: Rendered in uppercase with `tracking-tight` on major section titles.
   - **CSS Variable**: `var(--font-archivo)` (`font-heading`)

2. **Body & UI Font: Inter**
   - **Weights**: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
   - **Usage**: Body copy, descriptions, buttons, inputs, prices, tables, labels, and metadata.
   - **CSS Variable**: `var(--font-inter)` (`font-body`, default `font-sans`)

3. **Eyebrows & Micro Labels**
   - **Specification**: `Inter`, `text-xs`, `font-semibold`, `uppercase`, `tracking-wider`, `text-neutral-500`.

#### Type Scale & Usage

| Token | Size | Line Height | Usage |
|---|---|---|---|
| `text-2xs` | 11px | 16px | Micro badges, status indicators, fine metadata only |
| `text-xs` | 12px | 16px | Eyebrows, uppercase tags, compact labels |
| `text-sm` | 14px | 20px | Secondary copy, input text, table cells |
| `text-base` | 16px | 24px | Default body copy, standard buttons |
| `text-lg` | 18px | 28px | Sub-headings, emphasized copy, pricing callouts |
| `text-xl` | 20px | 28px | Card titles, compact section headings |
| `text-2xl` | 24px | 32px | Modal titles, sub-section headers |
| `text-3xl` | 30px | 36px | Major section titles, category headings |
| `text-4xl` | 36px | 40px | High-level page headers |
| `text-5xl` | 48px | 48px | Display titles |
| `text-6xl` | 60px | 60px | Hero display headings only |

*Arbitrary font sizes like `text-[11px]`, `text-[10px]`, or `text-[15px]` are outside the system and prohibited.*

#### Allowed Font Weights
- `font-normal` (400) — Body text and secondary descriptions.
- `font-medium` (500) — Interactive labels and input content.
- `font-semibold` (600) — Buttons, navigation items, subheadings.
- `font-bold` (700) — Headings (`h1` - `h6`), major display titles.
- *Prohibited*: `font-light`, `font-extrabold`, and `font-black`.

#### Letter Spacing (Tracking)
- `tracking-tight`: Hero display and large heading titles.
- `tracking-wide`, `tracking-wider`: Eyebrows, uppercase tags, button text.
- `tracking-widest`: Reserved for micro-spaced badges.
- *Prohibited*: Arbitrary tracking classes (e.g. `tracking-[0.15em]`).

#### Prohibited Fonts
Geist, Geist Mono, Dancing Script, Montserrat, Outfit, serif fonts (`font-serif`), monospace fonts (`font-mono`), or decorative script fonts are outside the standard and scheduled for migration.

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

To maintain a clean geometric rhythm, only 4 corner radii and 3 shadow levels are permitted.

#### Corner Radius Scale

| Token | Value | Application |
|---|---|---|
| `rounded-full` | 9999px | Action buttons, pill chips, icon buttons, status badges |
| `rounded-xl` | 12px | Product cards, feature cards, modal dialogs |
| `rounded-lg` | 8px | Form inputs, select dropdowns, image display frames |
| `rounded-md` | 6px | Small toggles, micro switches |

*Prohibited*: `rounded-none` (permitted only for full-bleed containers), `rounded-xs`, `rounded-sm`, plain `rounded`, `rounded-2xl` (16px), `rounded-3xl` (24px), and arbitrary pixel radii like `rounded-[2px]`.

#### Elevation & Shadows

| Token | Class | Application |
|---|---|---|
| Subtle | `shadow-sm` | Card elevation at rest |
| Interactive | `shadow-lg` | Hovered interactive cards, popovers, navigation dropdowns |
| Overlay | `shadow-2xl` | Modal dialogs, slide-over sheets, full cart drawers |

*Prohibited*: `shadow-xs`, `shadow-md`, `shadow-xl`, `shadow-inner`, or custom bracketed shadows like `shadow-[0_4px_20px_rgba(0,0,0,0.1)]`.

---

### 07 Motion

Animations must feel precise, confident, and lightweight.

#### Durations & Easings
- `duration-200`: Micro-interactions, hover states, toggles.
- `duration-300`: Standard card shifts, tab transitions, dropdown reveals.
- `duration-500`: Modal entrances, page reveals, hero animations.
- **Easing**: `ease-out` for entrances; `ease-in` for exits. Standard curve: `cubic-bezier(0.16, 1, 0.3, 1)`.

#### What Animates
- Animate **only `transform` and `opacity`** properties.
- **Never use `transition-all`**. Always explicitly declare `transition-colors`, `transition-transform`, or `transition-opacity`.
- Never animate geometry properties (`top`, `left`, `width`, `height`, `margin`) as they trigger continuous layout reflows.

#### The Accordion Exception
Smooth height expansion is permitted only when using CSS grid `grid-template-rows: 0fr -> 1fr` transitions or Radix accordion primitives with `overflow-hidden`.

#### Motion Library
Standardize on `"motion"` (`import { motion } from "motion/react"`). Deprecate and remove `framer-motion`.

#### Reduced Motion
Every animation and transition must respect `prefers-reduced-motion` using Tailwind's `motion-reduce:transition-none` and `motion-reduce:animate-none` classes.

---

### 08 Z-Index Ladder

All stacking contexts must strictly follow this canonical 7-tier ladder:

| Token / Class | Z-Index | Layer Name | Stacking Elements |
|---|---|---|---|
| `z-0` | 0 | Canvas | Deep canvas, background patterns, grid lines |
| `z-10` | 10 | Content | Standard page content, text, media, card grids |
| `z-20` | 20 | Sub-Navigation | In-section sticky filter bars, sub-nav bars |
| `z-30` | 30 | Popovers | Dropdown menus, autocomplete lists, tooltips |
| `z-40` (`z-header`) | 40 | Navigation | Announcement bar, primary navigation navbar |
| `z-50` (`z-overlay`) | 50 | Overlays | Drawers, cart sheet, modal dialogs, backdrop overlays |
| `z-60` (`z-toast`) | 60 | Notifications | Global notification toasts, urgent alert banners |

*Strict Rule: No arbitrary z-index values (e.g. `z-1`, `z-[70]`, `z-[100]`, `z-[150]`, `z-[9999]`) may be used.*

---

## Application

### 09 Components

All user interface development must use shared primitives rather than ad-hoc inline elements.

#### Button Primitives (`ui/Button`)
- **Primary**: Background Gold (`#FCD017`), text Ink (`#111111`), `rounded-full`, `font-semibold`.
- **Secondary**: Background Ink (`#111111`), text White (`#FFFFFF`), `rounded-full`, `hover:bg-neutral-800`.
- **Outline / Ghost**: Border `border-neutral-300`, text Ink (`#111111`), `rounded-full`, `hover:border-neutral-900`.
- **Sizes**: `sm` (px-4 py-1.5 text-xs), `md` (px-6 py-2.5 text-sm), `lg` (px-8 py-3.5 text-base).
- **Focus State**: Universal 2px focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]`).

#### Form Inputs (`ui/Input`)
- Clean light background (`bg-white`), border `border-[#E8E8E5]`, `rounded-lg`, padding `px-4 py-2.5 text-sm text-neutral-900`.
- Focus state: `focus-visible:border-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900`.
- Label: `text-xs font-semibold uppercase tracking-wider text-neutral-700`.

#### Cards (`ui/Card`)
- Container: `bg-white`, border `border-[#E8E8E5]`, `rounded-xl`, `shadow-sm`.
- Hover state: `hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ease-out`.

#### Badges (`ui/Badge`)
- Geometry: `rounded-full`, uppercase font, tracking `tracking-wider`.
- Variants: Standard Neutral (`bg-neutral-100 text-neutral-800`), Gold Tint (`bg-[#FFF8E7] text-neutral-900 border border-[#FCD017]/30`), Success (`bg-emerald-50 text-emerald-700 border border-emerald-200`).

#### Modals & Drawers
- **Modals (`ui/Modal`)**: Centered dialogs with `rounded-xl`, `shadow-2xl`, white surface, and backdrop blur (`backdrop-blur-sm bg-black/40`).
- **Drawers (`ui/Drawer`)**: Right-side slide-over sheet with full viewport height, `shadow-2xl`, white surface, `z-50`.

#### Media & Icons
- **Images**: Always use `next/image` with explicit width/height or `fill`, defined aspect ratio container, `quality={80}`, and descriptive `alt` text.
- **Icons**: Exclusively use `lucide-react` (with 1.5px stroke width) and curated vector glyphs from `ui/Logo.tsx` and `ui/Icons.tsx`.
- **Photo Overlays**: When rendering text over photography, always use the overlay sandwich: photo bottom layer, dark gradient scrim (`bg-gradient-to-t from-black/80 via-black/40 to-transparent`), text top layer.

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
│   ├── ui/               # Shared design system primitives (Logo, Button, Container, Badge, etc.)
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
- **Reduced Motion**: Respect `prefers-reduced-motion` at all times.
- **Heading Order**: Exactly one `h1` per page; follow strict logical hierarchy (`h2` -> `h3` -> `h4`) without skipping levels.

---

## Governance

### 12 Transition Guidance

An honest audit of the gaps between this standard and the current code on this branch, listed in order of impact:

| Priority & Area | Current Code Measurements | Standard to Adopt | Remediation Effort |
|---|---|---|---|
| **1. Colour Consolidation** | 553 hardcoded `#111111` occurrences across 38 files; 170 hardcoded `#fcd017` occurrences across 29 files; 13 prohibited grey tokens (8 `zinc`, 5 `slate`); non-standard hexes (`#666666`, `#888888`, `#E8E8E5`, `#555555`). | Consolidate onto `@theme` tokens (`text-veyro-black`, `bg-veyro-black`, `bg-veyro-yellow`) and the canonical Tailwind `neutral` ramp (`neutral-900` to `neutral-400`). Eliminate all raw hex literals. | Medium |
| **2. Typography (Fonts & Arbitrary Sizes)** | 5 font families loaded in `layout.tsx` (Geist Sans, Geist Mono, Dancing Script, Montserrat, Outfit); 796 arbitrary text sizes (`text-[0-9.]+px`) across 39 distinct sizes (led by `text-[11px]`: 312, `text-[10px]`: 178, `text-[13px]`: 54). | Consolidate onto 2 fonts: Archivo for headings and Inter for body/UI. Replace all arbitrary sizes with standard Tailwind scale tokens (`text-2xs` through `text-6xl`). | Medium |
| **3. Shared Button Primitive & UI Primitives** | Shared `ui/Button.tsx` imported in index but rendered **0 times** across the storefront; 312 raw `<button>` tags across 44 files with inconsistent styles; lack of shared `Input`, `Card`, and `Modal` primitives. | Adopt `ui/Button` universally across all interactive actions (Primary Gold, Secondary Ink, Ghost/Outline with `rounded-full`). Build shared `Input` (`rounded-lg`), `Card` (`rounded-xl`), and `Modal` (`rounded-xl`). | High |
| **4. Section Rhythm & Containers** | `Container.tsx` defines non-standard `max-w-[1540px]` with arbitrary padding `px-4 sm:px-8 xl:px-10`; irregular section paddings across pages. | Adopt the 4 standard container recipes (Wide `1440px`, Standard `7xl`, Reading `3xl`, Form `md`) with universal padding `px-4 sm:px-6 lg:px-8` and standardized section rhythm (`py-16 sm:py-20 lg:py-24`). | Medium |
| **5. Scale Leaks: Radius, Shadows, Z-Index, Motion** | 277 non-standard radii (110 arbitrary `rounded-[...]`, 84 `rounded-2xl`, 52 plain `rounded`, 14 `rounded-xs`, 14 `rounded-3xl`, 3 `rounded-sm`); 49 distinct shadow definitions (118 `shadow-xs`, 55 `shadow-md`, 47 `shadow-2xs`); arbitrary z-indices (`z-[70]`, `z-[100]`, `z-[150]`, `z-1`); 223 occurrences of `transition-all`; 2 animation libraries (35 files with `motion/react` vs 7 files with `framer-motion`). | Restrict to 4 radii (`rounded-full`, `rounded-xl`, `rounded-lg`, `rounded-md`), 3 shadows (`shadow-sm`, `shadow-lg`, `shadow-2xl`), and the canonical 7-tier z-index ladder. Eliminate `transition-all` in favor of specific transitions. Consolidate exclusively on `motion/react`. | Medium |
| **6. Theme Consistency & Accessibility** | Dark islands in storefront: `AccountModal` (modal shell `bg-[#0c0c0e]` on line 412, inner panel `bg-[#101013]` on line 472), `BrandPillarsSection` (`bg-[#0a0a0a]` on line 150), `Footer` (`bg-[#050505]` on line 164); only 16 buttons (5.1%) have explicit focus styling, while 296 buttons (94.9%) lack focus rings. | Enforce light theme across all storefront views and modals ("Light Everywhere, No Dark Islands"). Apply universal 2px focus ring to all 312 interactive buttons. | Medium |

#### How Counts Were Measured
All storefront counts were measured across the exactly 178 storefront source files in `veyro/src/` (including `src/app/globals.css`, storefront layouts, pages, feature modules, context providers, and UI primitives). Excluded from the audit: `src/app/admin/**`, `src/components/admin/**`, and the documentation page `src/app/design-guidelines/**`. Static AST analysis and regex pattern matching were used to parse class tokens, style attributes, and imports:

- **Colors & Greys**:
  - Raw hex values: `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "#[0-9a-fA-F]{3,8}" src/app src/components src/context src/lib` (`#111111`: 553 in 38 files, `#fcd017`: 170 in 29 files).
  - Grey ramps: `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "(text|bg|border)-(neutral|zinc|slate)-[0-9]+" src/app src/components src/context src/lib` (`neutral`: 2,104, `zinc`: 8, `slate`: 5).
- **Arbitrary text sizes (796 occurrences, 39 distinct sizes)**:
  `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "text-\[[0-9.]+px\]" src/app src/components src/context src/lib | wc -l`
  Top 3 sizes: `text-[11px]` (312), `text-[10px]` (178), `text-[13px]` (54).
- **Standard text sizes (1,083 occurrences)**:
  `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b" src/app src/components src/context src/lib | wc -l`
- **Font weights & tracking**:
  - Weights: `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\bfont-(light|normal|medium|semibold|bold|extrabold|black)\b" src/app src/components src/context src/lib | wc -l` (1,342 occurrences).
  - Tracking: `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\btracking-(tight|normal|wide|wider|widest)\b" src/app src/components src/context src/lib | wc -l` (451 occurrences).
- **Layout widths & paddings**:
  - Max-widths: `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\bmax-w-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|full|\[[^]]+\])\b" src/app src/components src/context src/lib`
  - Horizontal paddings: `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\bpx-(4|6|8|10|12|\[[^]]+\])\b" src/app src/components src/context src/lib`
- **Allowed radii (733 occurrences)**:
  `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\brounded-(full|xl|lg|md|none)\b" src/app src/components src/context src/lib | wc -l`
- **Non-standard radii (277 total outside canonical scale)**:
  - `rounded-2xl` (84): `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\brounded-2xl\b" src/app src/components src/context src/lib | wc -l`
  - `rounded-3xl` (14): `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\brounded-3xl\b" src/app src/components src/context src/lib | wc -l`
  - plain `rounded` (52): `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "(^|[^a-zA-Z0-9_-])rounded([^a-zA-Z0-9_-]|$)" src/app src/components src/context src/lib | wc -l`
  - `rounded-sm` (3): `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\brounded-sm\b" src/app src/components src/context src/lib | wc -l`
  - `rounded-xs` (14): `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\brounded-xs\b" src/app src/components src/context src/lib | wc -l`
  - arbitrary `rounded-[...]` (110): `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "rounded-\[[^]]+\]" src/app src/components src/context src/lib | wc -l`
- **Shadows (115 standard vs 282 non-standard)**:
  `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\bshadow-(2xs|xs|sm|md|lg|xl|2xl|inner|none|\[[^]]+\])\b" src/app src/components src/context src/lib`
- **Motion & transitions**:
  - `transition-all` (223 occurrences): `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\btransition-all\b" src/app src/components src/context src/lib | wc -l`
  - Animation libraries: `motion/react` in 35 files, `framer-motion` in 7 files.
  - Geometry-animating files (5 files animating height, width, left, top, or margin).
- **Z-Index ladder**:
  - Canonical tiers: `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "\bz-(0|10|20|30|40|50)\b" src/app src/components src/context src/lib | wc -l` (172 occurrences).
  - Arbitrary & non-standard: `z-[100]` (2), `z-[70]` (1), `z-[150]` (1), `z-1` (9).
- **Components**:
  - Raw `<button>` tags (312 occurrences in 44 files): `grep -roE --exclude-dir=admin --exclude-dir=design-guidelines "<button\b" src/app src/components src/context src/lib | wc -l`
  - Shared `ui/Button` renders (0): `grep -rE --exclude-dir=admin --exclude-dir=design-guidelines "<Button\b" src/app src/components src/context src/lib`
- **Dark islands identified in code**:
  - `AccountModal.tsx`: modal shell `bg-[#0c0c0e]` (line 412), inner panel `bg-[#101013]` (line 472)
  - `BrandPillarsSection.tsx`: section `bg-[#0a0a0a]` (line 150)
  - `Footer.tsx`: footer `bg-[#050505]` (line 164)

A prototype of these migrations exists on the `design-system` branch.

---

### 13 Quick Reference

A concise 12-row summary of canonical standards versus anti-patterns:

| Category | Follow (The Standard) | Avoid (Anti-Pattern) |
|---|---|---|
| **1. Primary Text** | `text-neutral-900` or `text-veyro-black` | Inline `#111111`, `#000000`, or deep navy `#101828` |
| **2. Primary Action / CTA** | `bg-veyro-yellow text-neutral-900 hover:bg-veyro-yellow-dark` | `bg-black`, `bg-[#111111]`, or terracotta literals |
| **3. Gold Accent Usage** | Gold as background (`bg-[#FCD017]`) or accent bar with Ink text | Gold text on white surfaces (`text-[#FCD017]` fails at 1.48:1) |
| **4. Neutral Greys** | Tailwind `neutral` scale (`neutral-50` through `neutral-950`) | `zinc`, `slate`, `gray`, `stone`, or hardcoded grey hexes |
| **5. Heading Typography** | Archivo (`font-heading`, `font-bold uppercase tracking-tight`) | Geist Sans headings, Montserrat, Dancing Script, serif fonts |
| **6. Font Sizes** | Standard Tailwind scale (`text-2xs` through `text-6xl`) | Arbitrary pixel sizes (`text-[11px]`, `text-[10px]`, `text-[13px]`) |
| **7. Corner Radii** | Canonical 4 tokens: `rounded-full`, `rounded-xl`, `rounded-lg`, `rounded-md` | `rounded-2xl`, `rounded-3xl`, `rounded-none`, `rounded-[2px]` |
| **8. Elevation & Shadows** | Canonical 3 tokens: `shadow-sm`, `shadow-lg`, `shadow-2xl` | `shadow-xs`, `shadow-md`, `shadow-xl`, custom `shadow-[...]` |
| **9. Transitions** | Specific transitions (`transition-transform`, `transition-opacity`, `duration-200/300`) | `transition-all`, animating `width`, `height`, `top`, `left` |
| **10. Motion Library** | `import { motion } from "motion/react"` | `import { motion } from "framer-motion"` |
| **11. Z-Index Ladder** | Canonical 7 tiers: `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`, `z-60` | Arbitrary numbers: `z-[70]`, `z-[100]`, `z-[150]`, `z-[9999]`, `z-1` |
| **12. Components** | Shared primitives: `<Button variant="primary" />` (`rounded-full`), `<Input />` (`rounded-lg`) | Raw `<button>` or `<input>` elements without shared styling or focus rings |

---

## Appendix: Current state on main (measured)

This appendix provides a full, measured baseline of the storefront codebase on the `main` branch across all 178 storefront source files (`src/app`, `src/components`, `src/context`, `src/lib`, excluding admin and design-guidelines).

### 03 Color Baseline

| Metric / Dimension | Current in code (main) | Standard Required |
|---|---|---|
| **Declared `@theme` Tokens** | 14 tokens in `globals.css` (`--color-veyro-yellow: #fcd017;`, `--color-veyro-black: #111111;`, etc.) | Full palette mapped to CSS theme tokens |
| **Top Hardcoded Hex Values** | `#111111` (553 in 38 files), `#FCD017` (170 in 29 files), `#666666` (39), `#FFFFFF` (34), `#101828` (34 in FAQ), `#888888` (34), `#E8E8E5` (27), `#555555` (23), `#FAFAFA` (21), `#8E8E8E` (20), `#EAEAEA` (20), `#F0F0F0` (20) | Zero raw hex literals in component files; use semantic theme tokens |
| **Grey Families in Use** | `neutral` (2,104 occurrences), `zinc` (8 occurrences), `slate` (5 occurrences) | Exclusively Tailwind `neutral` scale (`neutral-50` through `neutral-950`) |
| **Dark Surfaces in Storefront** | `AccountModal.tsx` (`bg-[#0c0c0e]` line 412, `bg-[#101013]` line 472), `BrandPillarsSection.tsx` (`bg-[#0a0a0a]` line 150), `Footer.tsx` (`bg-[#050505]` line 164) | 100% Light surfaces throughout storefront ("Light Everywhere, No Dark Islands") |
| **Standard Adoption** | Grey ramp: 2,104 of 2,117 (99.4% neutral) | See [Section 12 Transition Guidance](#12-transition-guidance) |

### 04 Typography Baseline

| Metric / Dimension | Current in code (main) | Standard Required |
|---|---|---|
| **Loaded Font Families** | 5 families in `layout.tsx`: `Geist Sans` (`--font-geist-sans`, default UI across 178 files), `Geist Mono` (`--font-geist-mono`, 157 uses), `Dancing Script` (`--font-dancing-script`, 19 uses for script tags), `Montserrat` (`--font-montserrat`, 17 uses), `Outfit` (`--font-outfit`, 12 uses) | 2 families: Archivo (`font-heading`, Display/Headings) and Inter (`font-sans`, Body/UI) |
| **Standard Font Sizes** | 1,083 occurrences: `text-xs` (578), `text-sm` (219), `text-3xl` (67), `text-2xl` (65), `text-4xl` (37), `text-base` (32), `text-xl` (31), `text-lg` (27), `text-5xl` (14), `text-6xl` (8), `text-7xl` (5) | Standard Tailwind typography scale (`text-2xs` through `text-6xl`) |
| **Arbitrary Font Sizes** | 796 occurrences across 39 distinct sizes. Top 8: `text-[11px]` (312), `text-[10px]` (178), `text-[13px]` (54), `text-[14px]` (45), `text-[9px]` (37), `text-[12px]` (20), `text-[15px]` (18), `text-[10.5px]` (17) | 0 arbitrary font sizes; use canonical tokens |
| **Font Weights** | `font-bold` (587), `font-semibold` (295), `font-medium` (215), `font-black` (141), `font-normal` (55), `font-extrabold` (31), `font-light` (18) | 4 weights: `normal` (400), `medium` (500), `semibold` (600), `bold` (700) |
| **Letter Spacing (Tracking)** | `tracking-wider` (241), `tracking-tight` (107), `tracking-widest` (59), `tracking-wide` (44), arbitrary bracketed (65) | Canonical tokens: `tight`, `wide`, `wider`, `widest` |
| **Standard Adoption** | Standard text sizes: 1,083 of 1,879 (57.6%) | See [Section 12 Transition Guidance](#12-transition-guidance) |

### 05 Layout and Spacing Baseline

| Metric / Dimension | Current in code (main) | Standard Required |
|---|---|---|
| **Container Widths** | `Container.tsx`: default `max-w-[1540px]`, wide `max-w-[1600px]`, narrow `max-w-[1200px]`, full `max-w-full`. Storefront classes: `max-w-md` (19), `max-w-full` (15), `max-w-2xl` (13), `max-w-sm` (11), `max-w-xl` (10), `max-w-xs` (10), `max-w-6xl` (8), `max-w-lg` (6), `max-w-7xl` (2), `max-w-[1300px]` (3), `max-w-[1536px]` (2) | 4 recipes: Wide `max-w-[1440px]`, Standard `max-w-7xl`, Reading `max-w-3xl`, Form `max-w-md` |
| **Horizontal Paddings** | `Container.tsx`: `px-4 sm:px-8 xl:px-10`. Widely used elsewhere: `px-4 sm:px-6 lg:px-8` | Universal container gutter: `px-4 sm:px-6 lg:px-8` |
| **Section Padding Patterns** | Non-standard paddings: `py-24 sm:py-40` (`BrandPillarsSection.tsx:153`), `py-16 sm:py-24` (`Footer.tsx:164`), `py-14` (`Footer.tsx:372`), `py-8 sm:py-12` (catalog pages) | Standard: `py-16 sm:py-20 lg:py-24`; Compact: `py-10 sm:py-14` |
| **Product Grid Breakpoints** | `grid-cols-2` (mobile), `sm:grid-cols-3` (tablet), `xl:grid-cols-4` (desktop) | `grid-cols-2` (mobile), `grid-cols-3` (tablet), `grid-cols-4` (desktop) |
| **Standard Adoption** | Grid columns: 100% compliant with standard responsive column rhythm | See [Section 12 Transition Guidance](#12-transition-guidance) |

### 06 Shape and Elevation Baseline

| Metric / Dimension | Current in code (main) | Standard Required |
|---|---|---|
| **Corner Radius Classes** | Standard: `rounded-full` (395), `rounded-lg` (187), `rounded-xl` (135), `rounded-md` (14), `rounded-none` (2) = 733. Non-standard: arbitrary `rounded-[...]` (110), `rounded-2xl` (84), plain `rounded` (52), `rounded-xs` (14), `rounded-3xl` (14), `rounded-sm` (3) = 277 | 4 canonical tokens: `rounded-full`, `rounded-xl`, `rounded-lg`, `rounded-md` (`rounded-none` only full-bleed) |
| **Elevation & Shadow Classes** | Standard: `shadow-sm` (75), `shadow-lg` (21), `shadow-2xl` (19) = 115. Non-standard: `shadow-xs` (118), `shadow-md` (55), `shadow-2xs` (47), arbitrary `shadow-[...]` (39), `shadow-xl` (11), `shadow-inner` (7), `shadow-none` (5) = 282 | 3 levels: `shadow-sm` (subtle), `shadow-lg` (interactive), `shadow-2xl` (overlay) |
| **Most-Used by Element Type** | Cards: `rounded-xl` (111) vs `rounded-2xl` (74); Buttons: no radius (218), `rounded-full` (33), `rounded-lg` (40), `rounded-xl` (16), `rounded` (21); Inputs: `rounded-lg` (catalogs), `rounded-xl` (`AccountModal.tsx`); Modals: `rounded-2xl sm:rounded-3xl` | Cards: `rounded-xl`; Buttons: `rounded-full`; Inputs: `rounded-lg`; Modals: `rounded-xl` |
| **Standard Adoption** | Allowed corner radii: 733 of 1,010 (72.6%) | See [Section 12 Transition Guidance](#12-transition-guidance) |

### 07 Motion Baseline

| Metric / Dimension | Current in code (main) | Standard Required |
|---|---|---|
| **Durations** | `duration-200` (131), `duration-300` (113), `duration-150` (41), `duration-500` (21), `duration-700` (19), `duration-100` (4), `duration-1000` (2), `duration-260` (1) | Micro: `duration-150`; Standard: `duration-200`; Moderate: `duration-300` |
| **Easings** | `ease-out` (105), `ease-in` (18) | Standard: `ease-out`; Micro: `ease-in-out` |
| **Transition Properties** | `transition-all` (223 occurrences), specific transitions (`transition-colors`, `transition-transform`, `transition-opacity`: 108 occurrences) | Specific property transitions only; `transition-all` is prohibited |
| **Animation Libraries** | `motion/react` in 35 files; `framer-motion` in 7 files | Single library: `motion/react` |
| **Geometry Animating Files** | 5 files animate `height`, `width`, `left`, `top`, or `margin`: `src/app/faq/page.tsx`, `src/components/features/CartDrawer.tsx`, `src/app/orders/[id]/page.tsx`, `src/app/orders/[id]/return/page.tsx`, `src/components/charts/chart-reveal-clip.tsx` | GPU-accelerated `transform` and `opacity` only; never animate layout geometry |
| **Standard Adoption** | Specific property transitions: 108 of 331 (32.6%) | See [Section 12 Transition Guidance](#12-transition-guidance) |

### 08 Z-Index Ladder Baseline

| Metric / Dimension | Current in code (main) | Standard Required |
|---|---|---|
| **Canonical Tiers in Use** | `z-10` (99), `z-20` (25), `z-50` (22), `z-30` (11), `z-0` (8), `z-40` (7) = 172 uses | Canonical 7 tiers: `z-0` (0), `z-10` (10), `z-20` (20), `z-30` (30), `z-40` (40), `z-50` (50), `z-60` (60) |
| **Non-Standard & Arbitrary** | `z-1` (9 uses); arbitrary: `z-[100]` (2 uses in `Navbar.tsx:497`, `section/[slug]/page.tsx:222`), `z-[70]` (1 use in `AccountModal.tsx:390`), `z-[150]` (1 use in `ProductSearch.tsx:243`) = 13 uses | 0 non-standard or arbitrary bracketed z-index values |
| **Standard Adoption** | Canonical z-index tokens: 172 of 185 (93.0%) | See [Section 12 Transition Guidance](#12-transition-guidance) |

### 09 Components Baseline

| Metric / Dimension | Current in code (main) | Standard Required |
|---|---|---|
| **Raw `<button>` Elements** | 312 raw `<button>` elements across 44 files | 0 raw buttons; all interactive actions use shared `ui/Button` primitive |
| **Shared `ui/Button` Renders** | Rendered **0 times** across the storefront (only declared in `ui/Button.tsx` and exported) | 100% of storefront buttons rendered through `ui/Button` |
| **Primary Button Styles** | 8 distinct styling variations in active use (e.g. `bg-black`, `bg-[#111111]`, `bg-[#fcd017]`, `bg-neutral-900` with varying radii from no radius to `rounded-full`) | Unified Primary CTA: `bg-veyro-yellow text-neutral-900 rounded-full font-semibold` |
| **Input Style Variations** | 3 distinct styling recipes across catalog filters, login modal, and newsletter forms | Shared `ui/Input` with `rounded-lg border-neutral-300 focus-visible:outline-2` |
| **Card Style Variations** | 5 distinct card containers with mixed radii (`rounded-xl` vs `rounded-2xl`) and varying shadows | Shared `ui/Card` with `rounded-xl border border-neutral-200 shadow-sm` |
| **Modals & Drawers** | `AccountModal.tsx` (`bg-[#0c0c0e]`, `z-[70]`, `rounded-2xl sm:rounded-3xl`), `CartDrawer.tsx` (`bg-white`, `z-50`), `ProductSearch.tsx` (`bg-white`, `z-[150]`), `WatchFilterSidebar.tsx` (`bg-white`, `z-50`) | Standard `rounded-xl` modal shell, `bg-white`, overlay `z-50` (`shadow-2xl`) |
| **Standard Adoption** | Shared `ui/Button` adoption: 0 of 312 action buttons (0.0%) | See [Section 12 Transition Guidance](#12-transition-guidance) |

---

### The Living Source

These guidelines are maintained as `DESIGN.md` in the repository and rendered here.

[Download DESIGN.md](/DESIGN.md)
