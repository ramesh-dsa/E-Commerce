---
last_mapped_commit: c05db5fe84dfbc4dae35469a85e21624f77866ad
last_mapped_at: 2026-10-19
---
# Codebase Structure

**Analysis Date:** 2026-10-19

## Directory Layout

```
/home/santhosh/Music/E-Commerce/
├── .agents/                        # Agent configurations and project rules
│   └── rules/                      # System working rules and behavioral guidelines
├── .planning/                      # GSD planning and memory system
│   └── codebase/                   # Codebase map and analysis artifacts
└── veyro/                          # Main Next.js application workspace
    ├── public/                     # Static media and brand assets
    │   ├── images/                 # Product photography, banners, textures
    │   └── logos/                  # Brand vectors and typography marks
    ├── scripts/                    # Image download and optimization automation
    ├── src/                        # Main application source code
    │   ├── app/                    # Next.js App Router (pages, layouts, routes)
    │   │   ├── account/            # User account & address management pages
    │   │   ├── admin/              # Merchant management dashboard & tools
    │   │   ├── api/                # Next.js Server Route Handlers
    │   │   ├── cart/               # Dedicated full cart page
    │   │   ├── checkout/           # Multi-step checkout experience
    │   │   ├── clothing/           # Clothing & T-Shirt category catalog
    │   │   ├── collections/        # Seasonal & curated collections catalog
    │   │   ├── faq/                # Help & customer support FAQ page
    │   │   ├── footwear/           # Footwear category catalog
    │   │   ├── orders/             # Order tracking, detail, and return portal
    │   │   ├── product/[slug]/     # Dynamic Product Detail Page (PDP)
    │   │   ├── section/[slug]/     # Dynamic Custom Admin Section view
    │   │   ├── shoes/              # Dedicated footwear redirect/alias page
    │   │   ├── shop/[section]/     # Subcategory landing pages
    │   │   ├── watches/            # Luxury & Everyday timepiece catalog
    │   │   ├── wishlist/           # Dedicated wishlist page
    │   │   ├── globals.css         # Global styles & Tailwind v4 `@theme` tokens
    │   │   ├── layout.tsx          # Root layout with providers & shell
    │   │   └── page.tsx            # Storefront homepage with curated hero & pillars
    │   ├── components/             # Reusable UI component modules
    │   │   ├── admin/              # Admin form controls, image cropper, date picker
    │   │   ├── features/           # Domain feature components (catalogs, drawers, cards)
    │   │   ├── layout/             # Application chrome (Navbar, Footer, AnnouncementBar)
    │   │   └── ui/                 # Atomic design primitives (Button, Badge, Skeleton)
    │   │       └── reactbits/      # Dynamic micro-animations (StarBorder, BlurText, etc.)
    │   ├── context/                # React Context state providers (Cart, User, Products)
    │   ├── data/                   # Default seed datasets (products.ts, reviews.ts)
    │   ├── hooks/                  # Custom React hooks directory
    │   ├── lib/                    # Core library helper functions (utils.ts)
    │   ├── types/                  # TypeScript interface definitions (index.ts)
    │   └── utils/                  # Domain algorithms (searchEngine.ts, orderUtils.ts)
    ├── eslint.config.mjs           # ESLint 9 configuration
    ├── next.config.ts              # Next.js framework configuration
    ├── package.json                # Project dependencies and script runner
    ├── postcss.config.mjs          # PostCSS configuration for Tailwind CSS v4
    └── tsconfig.json               # TypeScript compiler options & paths
```

## Directory Purposes

**`veyro/src/app/`:**
- Purpose: File-system App Router definitions handling URL routing, SSR/SSG rendering, and layout trees.
- Key files:
  - `veyro/src/app/layout.tsx`: Root HTML envelope, Google font bindings, provider stack.
  - `veyro/src/app/page.tsx`: Homepage showcasing hero sliders, new arrivals, promotional banners, category pillars.
  - `veyro/src/app/globals.css`: Tailwind v4 theme definitions and typography utilities.

**`veyro/src/components/features/`:**
- Purpose: High-level interactive commerce features and catalog views.
- Key files:
  - `ProductCard.tsx`: Standard card with hover secondary image, quick add, and wishlist toggle.
  - `CartDrawer.tsx` & `WishlistDrawer.tsx`: Global slide-over drawers for real-time commerce.
  - `ProductBuyBox.tsx`: Product detail purchase box with size picker, sticky CTA, and stock status.
  - `ProductReviewsSection.tsx`: Review breakdown, customer review submissions, and helpfulness voting.
  - `ProductSearch.tsx`: Real-time fuzzy search overlay with category pill suggestions.

**`veyro/src/components/ui/`:**
- Purpose: Reusable, accessible atomic design system elements.
- Key files:
  - `Button.tsx`, `Badge.tsx`, `Skeleton.tsx`, `Container.tsx`, `TearTicket.tsx`, `SortDropdown.tsx`.
  - `reactbits/`: Animation modules (`BlurText.tsx`, `DecryptedText.tsx`, `ShinyText.tsx`, `StarBorder.tsx`, `Squares.tsx`).

**`veyro/src/context/`:**
- Purpose: Reactive state stores managing client hydration, multi-tab sync, and business actions.
- Key files:
  - `CartContext.tsx`: Item quantities, coupon discounts, 2-tee bundle deal calculations, shipping thresholds.
  - `ProductsContext.tsx`: Live catalog state, seed merging, dynamic product mutations.
  - `UserContext.tsx`: Active customer profile, saved addresses, order history, and return tracking.
  - `WishlistContext.tsx`: Saved wishlist items and selected size preferences.
  - `AdminContext.tsx`: Session-scoped admin access control and credentials verification.
  - `ReviewsContext.tsx`: Customer review submission and rating metrics calculation.
  - `CustomSectionsContext.tsx`: Dynamic merchant custom showcase sections.

**`veyro/src/data/`:**
- Purpose: Initial static seed catalog ensuring full offline usability.
- Key files:
  - `products.ts`: 36+ detailed products with images, variants, descriptions, tags, and SKUs.
  - `reviews.ts`: Seed customer reviews and rating distribution generators.

**`veyro/src/utils/`:**
- Purpose: Pure algorithmic business logic without React dependencies.
- Key files:
  - `searchEngine.ts`: Tokenizer, typo tolerance (Levenshtein), synonym mapping, and fuzzy scoring.
  - `orderUtils.ts`: Return window eligibility checks (7-day post-delivery constraint).

## Key File Locations

**Entry Points:**
- `veyro/src/app/layout.tsx`: Root HTML and context wrapper.
- `veyro/src/app/page.tsx`: Storefront home page.
- `veyro/src/app/admin/page.tsx`: Admin dashboard entry point.

**Configuration:**
- `veyro/next.config.ts`: Next.js image optimization and compiler options.
- `veyro/tsconfig.json`: TypeScript compiler options and alias `@/*`.
- `veyro/eslint.config.mjs`: ESLint rules and ignore patterns.
- `veyro/postcss.config.mjs`: PostCSS pipeline for Tailwind v4.

**Domain Types:**
- `veyro/src/types/index.ts`: Central domain schema definitions.

## Naming Conventions

**Files:**
- React Components: PascalCase (e.g., `ProductCard.tsx`, `Navbar.tsx`, `CartDrawer.tsx`)
- Context Providers: PascalCase ending in `Context.tsx` (e.g., `CartContext.tsx`)
- Utilities & Helpers: camelCase (e.g., `searchEngine.ts`, `orderUtils.ts`, `utils.ts`)
- App Router Pages: lowercase `page.tsx` or `layout.tsx` inside kebab-case or bracketed route folders (`[slug]/page.tsx`)

**Directories:**
- Component groupings: lowercase nouns (`layout/`, `features/`, `ui/`, `admin/`)
- Dynamic routes: bracketed params (e.g., `[slug]/`, `[id]/`)

## Where to Add New Code

**New Storefront Feature / Page:**
- Create new App Router folder in `veyro/src/app/<feature-name>/page.tsx`.
- Create feature components in `veyro/src/components/features/<FeatureName>.tsx`.
- Add any domain models to `veyro/src/types/index.ts`.

**New UI Primitive:**
- Place in `veyro/src/components/ui/<Component>.tsx` and export from `veyro/src/components/ui/index.ts`.

**New Business Helper / Algorithm:**
- Place in `veyro/src/utils/<featureUtils>.ts`.

**New Global State Provider:**
- Place in `veyro/src/context/<Name>Context.tsx`.
- Wrap within `veyro/src/app/layout.tsx` provider tree.

## Special Directories

**`veyro/.next/`:**
- Purpose: Next.js build output and compiler cache.
- Generated: Yes.
- Committed: No (in `.gitignore`).

**`veyro/public/`:**
- Purpose: Static assets directly served from root URL.
- Generated: Partially (manual assets + generated by python scripts).
- Committed: Yes.

---

*Structure analysis: 2026-10-19*
