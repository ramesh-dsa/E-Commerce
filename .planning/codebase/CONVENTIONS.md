---
last_mapped_commit: c05db5fe84dfbc4dae35469a85e21624f77866ad
last_mapped_at: 2026-10-19
---
# Coding Conventions

**Analysis Date:** 2026-10-19

## Naming Patterns

**Files:**
- React components: PascalCase with `.tsx` extension (e.g., `ProductCard.tsx`, `WishlistDrawer.tsx`)
- Context providers: PascalCase ending in `Context.tsx` (e.g., `CartContext.tsx`, `UserContext.tsx`)
- Utilities & algorithms: camelCase with `.ts` extension (e.g., `searchEngine.ts`, `orderUtils.ts`)
- App Router pages & layouts: lowercase `page.tsx` and `layout.tsx`
- Type definition files: lowercase `index.ts` in `types/`

**Functions:**
- React functional components: PascalCase named exports (e.g., `export function ProductCard(...)` or `export default function PDP(...)`)
- Custom React hooks: camelCase starting with `use` (e.g., `useCart`, `useProducts`, `useAdmin`)
- Event handlers & callbacks: camelCase prefixed with `handle` or action verbs (e.g., `handleAddToCart`, `handleApplyCoupon`, `openModal`)
- Pure utility functions: camelCase with descriptive verbs (e.g., `normalizeSearchText`, `getReturnEligibility`)

**Variables & State:**
- State variables: camelCase (e.g., `isCartOpen`, `appliedCoupon`, `subtotal`)
- State setters: camelCase prefixed with `set` (e.g., `setIsCartOpen`, `setAppliedCoupon`)
- Storage & Config constants: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY`, `ADMIN_STORAGE_KEY`, `FREE_SHIPPING_THRESHOLD`)

**Types & Interfaces:**
- Interfaces: PascalCase without prefixing with 'I' (e.g., `Product`, `CartItem`, `OrderRecord`, `Review`)
- Type unions: PascalCase (e.g., `CartViewMode`, `ReviewFit`, `OrderStatus`)

## Code Style

**Formatting & Typography:**
- 2-space indentation across all TS/TSX and CSS files
- Single/double quote normalization with ESLint 9 flat configuration
- Modern CSS theme variables using Tailwind CSS v4 `@theme` block in `veyro/src/app/globals.css`

**Linting:**
- Config: `veyro/eslint.config.mjs`
- Extends: `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`
- Strict rules: No unused variables (`@typescript-eslint/no-unused-vars`), no forbidden `require()` imports (`@typescript-eslint/no-require-imports`), strict React 19 rules-of-hooks (`react-hooks/set-state-in-effect`)

## Import Organization

**Order:**
1. React core imports (`import React, { useState, useEffect, useMemo, useCallback } from "react";`)
2. Framework & Next.js imports (`import Link from "next/link";`, `import Image from "next/image";`, `import type { Metadata } from "next";`)
3. Third-party UI & animation libraries (`import { motion, AnimatePresence } from "motion/react";`, `import { ShoppingBag, Heart } from "lucide-react";`)
4. Internal domain types (`import type { Product, OrderRecord } from "@/types";`)
5. Internal context hooks (`import { useCart } from "@/context/CartContext";`)
6. Internal UI primitives and components (`import { Button } from "@/components/ui";`)
7. Internal utilities and helpers (`import { cn } from "@/lib/utils";`)

**Path Aliases:**
- Standard path alias `@/*` maps directly to `./src/*` (`veyro/tsconfig.json`)
- Relative imports (`./` or `../`) are used strictly within local component folders for helper submodules.

## Error Handling

**Patterns:**
- LocalStorage operations are guarded with `try / catch` blocks to gracefully absorb `QuotaExceededError` or blocked storage in incognito windows.
- Network API requests utilize `AbortController` timeouts and response status validations.
- JSON parsing (`JSON.parse`) is wrapped with fallback default empty arrays or default seed configurations.

## Logging

**Framework:** Standard browser console (`console.warn`, `console.error`)
**Patterns:**
- `console.warn`: Storage parse failures or non-fatal geolocation fallback events.
- Avoid leaving raw `console.log` debug statements in production components.

## Function & Component Design

**Size & Modularity:**
- Standard UI primitives adhere to focused, reusable single-responsibility files (50-200 lines).
- Note: Large pages (`admin/page.tsx`, `checkout/page.tsx`) currently exceed recommended sizes and are flagged for refactoring into modular sub-panels.

**Parameters & Props:**
- Explicit TypeScript interfaces for all component props (e.g., `interface ProductCardProps { product: Product; priority?: boolean; }`).
- Destructuring with safe default values for optional flags (e.g., `priority = false`, `autoOpen = true`).

## Module Design

**Exports:**
- Named exports are preferred for components and utilities to improve refactoring agility and IDE autocomplete.
- Default exports are used strictly for Next.js App Router entry pages (`page.tsx`) and layouts (`layout.tsx`).

**Barrel Files:**
- Barrel files (`index.ts`) provide clean consumer import surfaces in:
  - `veyro/src/components/layout/index.ts`
  - `veyro/src/components/features/index.ts`
  - `veyro/src/components/ui/index.ts`
  - `veyro/src/data/index.ts`

---

*Convention analysis: 2026-10-19*
