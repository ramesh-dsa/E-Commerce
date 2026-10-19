---
last_mapped_commit: c05db5fe84dfbc4dae35469a85e21624f77866ad
last_mapped_at: 2026-10-19
---
# Technology Stack

**Analysis Date:** 2026-10-19

## Languages

**Primary:**
- TypeScript 5.x - App logic, components, types, contexts, and API routes located in `veyro/src/` (`veyro/tsconfig.json`)

**Secondary:**
- Python 3.12 - Media automation, catalog asset generation, image transformation scripts in `veyro/scripts/` and root (`veyro/generate_product_images.py`, `veyro/generate_logos.py`, `veyro/export_pngs.py`)
- JavaScript (ESM/CJS) - Configuration and build scripts (`veyro/eslint.config.mjs`, `veyro/postcss.config.mjs`, `veyro/update_page.js`)
- CSS3 - Modern CSS with `@theme` token definitions, custom utilities, and animations (`veyro/src/app/globals.css`)

## Runtime

**Environment:**
- Node.js (v20+ recommended, engine types `@types/node` ^20.x in `veyro/package.json`)
- Python 3.12 Virtual Environment (`veyro/venv/`)

**Package Manager:**
- npm
- Lockfile: `veyro/package-lock.json` (present and synchronized)

## Frameworks

**Core:**
- Next.js 16.3.5 - App Router full-stack web application framework with React Server Components support (`veyro/package.json`, `veyro/next.config.ts`)
- React 19.2.8 & React DOM 19.2.8 - Component runtime with modern hooks (`veyro/package.json`)

**Styling & UI:**
- Tailwind CSS v4 (`tailwindcss` ^4, `@tailwindcss/postcss` ^4) - Utility-first styling with `@theme` in `veyro/src/app/globals.css`
- Motion (formerly Framer Motion) 13.4.0 - Fluid animations, micro-interactions, page transitions (`veyro/src/components/ui/reactbits/`)
- Lenis 1.3.26 - High-performance smooth scrolling engine (`veyro/src/components/layout/SmoothScrolling.tsx`)
- Lucide React 1.47.0 - Vector icon suite (`veyro/src/components/ui/Icons.tsx`)
- Next Google Fonts (`next/font/google`) - Optimized font loading for `Geist`, `Geist_Mono`, `Dancing_Script`, `Montserrat` (`veyro/src/app/layout.tsx`)

**Testing:**
- Not configured - No automated test runner (Jest, Vitest, Playwright, or Cypress) installed in `veyro/package.json`

**Build/Dev:**
- Next CLI (`next dev`, `next build`, `next start`) - Turbo/Webpack bundler with Turbopack dev indicators configured in `veyro/next.config.ts`
- PostCSS (`@tailwindcss/postcss` in `veyro/postcss.config.mjs`)
- TypeScript compiler (`tsc --noEmit` via Next.js build pipeline)
- ESLint 9 (`eslint` ^9, `eslint-config-next` 16.3.5 in `veyro/eslint.config.mjs`)

## Key Dependencies

**Critical:**
- `next` (16.3.5) - Core framework driving server components, routing, image optimization, API routes
- `react` / `react-dom` (19.2.8) - Core UI library
- `motion` (^13.4.0) - Provides animated UI components (`BlurText.tsx`, `DecryptedText.tsx`, `StarBorder.tsx`, `CartDrawer.tsx`, `ProductGallery.tsx`)
- `lenis` (^1.3.26) - Powers smooth scroll experience across all catalog pages

**Infrastructure:**
- `@tailwindcss/postcss` (^4) - Next-generation CSS compiler engine for Tailwind CSS v4
- `lucide-react` (^1.47.0) - Comprehensive iconography across navigation, filters, product details, admin panels

## Configuration

**Environment:**
- Client-side and server-side environment variables via Next.js convention (`.env`, `.env.local`)
- Seed data fallback: If environment or storage is uninitialized, default mock data loads from `veyro/src/data/products.ts` and `veyro/src/data/reviews.ts`

**Build & Compilation:**
- Next.js Config: `veyro/next.config.ts` (configured for AVIF/WebP image formats, responsive device sizes, bottom-right dev indicators)
- TypeScript Config: `veyro/tsconfig.json` (target: ES2017, moduleResolution: bundler, path alias: `@/*` -> `./src/*`)
- PostCSS Config: `veyro/postcss.config.mjs`
- ESLint Config: `veyro/eslint.config.mjs` (flat config extending `core-web-vitals` and `typescript`)

## Platform Requirements

**Development:**
- Node.js 20+ with npm
- Modern evergreen browser with WebP/AVIF and CSS `@theme` support
- Optional: Python 3.12 for local catalog image generation scripts

**Production:**
- Vercel / Node.js Server container capable of running `next start`
- Static asset serving for optimized WebP images located in `veyro/public/`

---

*Stack analysis: 2026-10-19*
