---
last_mapped_commit: c05db5fe84dfbc4dae35469a85e21624f77866ad
last_mapped_at: 2026-10-19
---
# Testing Patterns

**Analysis Date:** 2026-10-19

## Test Framework

**Runner:**
- No automated test runner is currently installed in `veyro/package.json` (no Jest, Vitest, or Playwright).
- Testing currently relies on static type validation (`tsc`), ESLint verification, and manual browser testing.

**Assertion Library:**
- None installed.

**Run Commands:**

```bash
npm --prefix veyro run lint        # Run ESLint across TypeScript & Next.js codebase
npm --prefix veyro run build       # Next.js production build and TypeScript type check
npm --prefix veyro run dev         # Launch local development server at http://localhost:3000
```

## Test File Organization

**Location:**
- No test suites or `.test.ts` / `.spec.ts` files currently exist in `veyro/src/`.

**Recommended Structure for Future Testing:**

```
veyro/
├── src/
│   ├── utils/__tests__/           # Unit tests for pure algorithmic logic
│   │   ├── searchEngine.test.ts
│   │   └── orderUtils.test.ts
│   ├── context/__tests__/         # Integration tests for state providers
│   │   ├── CartContext.test.tsx
│   │   └── ProductsContext.test.tsx
│   └── components/**/__tests__/   # Component render & interaction tests
```

## Recommended Test Implementation

### 1. Pure Algorithm Testing (Search Engine & Order Utils)

Target: `veyro/src/utils/searchEngine.ts` and `veyro/src/utils/orderUtils.ts`

**Proposed Vitest Suite:**

```typescript
import { describe, it, expect } from "vitest";
import { normalizeSearchText, stemWord, searchProducts } from "@/utils/searchEngine";
import { getReturnEligibility } from "@/utils/orderUtils";

describe("Search Engine", () => {
  it("normalizes punctuation and case", () => {
    expect(normalizeSearchText("T-Shirt / Tops")).toBe("t shirts tops");
  });

  it("handles plural stemming", () => {
    expect(stemWord("watches")).toBe("watch");
    expect(stemWord("tshirts")).toBe("tshirt");
  });
});

describe("Order Utils", () => {
  it("evaluates return eligibility within 7 days", () => {
    const deliveredOrder = {
      id: "TEST-01",
      status: "Delivered",
      deliveredDate: new Date().toISOString(),
      // ...other fields
    };
    expect(getReturnEligibility(deliveredOrder as any).isEligible).toBe(true);
  });
});
```

### 2. Context State Testing (Cart Discounts & Bundling)

Target: `veyro/src/context/CartContext.tsx`
- Verifying the 2-Tee bundle discount calculation
- Verifying the ₹999 free shipping threshold
- Verifying coupon application and state persistence

## Mocking Guidelines

**What to Mock:**
- `window.localStorage` and `window.sessionStorage` in Node/JSDOM test environments.
- Browser `fetch` calls targeting OpenStreetMap Nominatim or IP-API endpoints (`veyro/src/app/api/reverse-geocode/route.ts`).
- `window.scrollTo` and `requestAnimationFrame` used by Lenis smooth scrolling.

**What NOT to Mock:**
- Pure search matching logic in `veyro/src/utils/searchEngine.ts`.
- Seed product data structures in `veyro/src/data/products.ts`.

## Coverage

**Requirements:**
- No automated coverage enforcement currently in place.

## Test Types & Roadmap

**Unit Tests:**
- Needed: `searchEngine.ts`, `orderUtils.ts`, bundle discount calculators in `CartContext.tsx`.

**Integration Tests:**
- Needed: Context providers with localStorage mock synchronization.

**E2E Tests:**
- Needed: Playwright tests covering:
  1. Add to cart -> Slide-over drawer opening -> Item count update
  2. Multi-step checkout flow -> Address entry -> Simulated order placement
  3. Admin product creation & editing workflow

---

*Testing analysis: 2026-10-19*
