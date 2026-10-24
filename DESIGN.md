# VEYRO Design System

> **Single Source of Truth**  
> All user interface development, refactoring, and component creation across storefront, modals, login, and admin must strictly adhere to this document.

---

## 1. Core Principles

1. **One Brand Colour Story**: A unified, premium brand aesthetic centered on high-contrast Ink with disciplined Gold accents.
2. **One Neutral Family**: Exclusively use the Tailwind **neutral** palette (`neutral-50` through `neutral-950`). Do not mix neutral families.
3. **Tokens Before Literals**: No hardcoded hex values or arbitrary hex classes (e.g. `[#111111]`) in JSX or styles. Every colour, spacing, and typography value must reference defined design tokens.
4. **Performance-First Motion**: Continuous and frequent animations must animate **only `transform` and `opacity`** to maintain 60fps and avoid layout reflows.
5. **Shared Component Architecture**: All UI elements must use shared primitives (`ui/Button`, `ui/Input`, `ui/Card`, `ui/Modal`, `ui/Drawer`, `ui/Container`).

---

## 2. Theme & Surfaces

- **Light Everywhere**: Pure light mode is enforced across the entire application — storefront, catalog, product details, cart, checkout, account, modals, drawers, login, and admin views.
- **No Dark Islands**: Inverted dark cards, dark sections, or dark popover islands are strictly forbidden. All surfaces remain luminous and consistent.

---

## 3. Colour Tokens

### Brand Palette
- **Ink (`#111111`)**: Primary text, deep solid contrast elements, logos, and authoritative accents.
- **Gold (`#fcd017`)**: Primary action colour. **Restricted exclusively** to primary CTAs, critical highlights, and focus accents.
  - **Gold Hover (`#e5bc05`)**: Hover and active state for Gold elements.
  - **Gold Tint (`#fff8e7`)**: Subtle gold tinted background for high-priority badges and active accent badges.

### Surface & Border Scale
- **Page Background**: `#ffffff` (`bg-white`)
- **Section Surface**: `#f8f8f6` (`bg-veyro-surface`)
- **Alternate Surface**: `#f3f3f0` (`bg-veyro-surface-alt`)
- **Border**: `#e8e8e5` (`border-veyro-border`)
- **Light Border**: `#f0f0ed` (`border-veyro-border-light`)

### Text Hierarchy
- **Primary Text**: `text-neutral-900`
- **Secondary Text**: `text-neutral-600`
- **Muted Text**: `text-neutral-500` *(Never use lighter tints for readable copy)*
- **Decorative / Placeholder**: `text-neutral-400`

### Status Colours (Strict Functional Set Only)
- **Success**: Emerald (`text-emerald-600`, `bg-emerald-50`, `border-emerald-200`)
- **Error**: Red (`text-red-600`, `bg-red-50`, `border-red-200`)
- **Warning**: Amber (`text-amber-600`, `bg-amber-50`, `border-amber-200`)
- **Info**: Blue (`text-blue-600`, `bg-blue-50`, `border-blue-200`)

### Prohibited Colours
The following colour families and ad-hoc hex values are **strictly forbidden**:
- `gray`, `zinc`, `stone`, `slate`, `terracotta`, `cyan`, `indigo`, `rose`, `teal`, and any un-tokenized hex literals.

---

## 4. Typography

### Families (Two Families Only)

1. **Heading Font: Archivo**
   - **Weights**: `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold)
   - **Usage**: `h1` through `h6`, hero display titles, section titles, product names.
   - **Styling**: Rendered in uppercase with `tracking-tight` where existing headings use uppercase.
   - **CSS Variable**: `var(--font-archivo)` (`font-heading`)

2. **Body & UI Font: Inter**
   - **Weights**: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
   - **Usage**: Body copy, descriptions, buttons, inputs, prices, tables, labels, and metadata.
   - **CSS Variable**: `var(--font-inter)` (`font-body`, default `font-sans`)

3. **Eyebrows & Micro Labels**
   - **Specification**: `Inter`, `text-xs`, `font-semibold`, `uppercase`, `tracking-wider`, `text-neutral-500`.

### Prohibited Fonts
- Geist, Geist Mono, Dancing Script, Montserrat, Outfit, serif fonts (`font-serif`), monospace fonts (`font-mono`), or decorative/script fonts.

---

## 5. Type Scale & Weights

### Font Sizes
| Token | Size | Line Height | Purpose |
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

*Note: Arbitrary font sizes like `text-[15px]` are prohibited.*

### Allowed Font Weights
- `font-normal` (400) — Body text and secondary descriptions.
- `font-medium` (500) — Interactive labels and input content.
- `font-semibold` (600) — Buttons, navigation items, subheadings.
- `font-bold` (700) — Headings (`h1` - `h6`), major display titles.
- *Prohibited*: `font-light`, `font-extrabold`, and `font-black`.

### Letter Spacing (Tracking)
- `tracking-tight`: Hero display and large heading titles.
- `tracking-wide`, `tracking-wider`: Eyebrows, uppercase tags, button text.
- `tracking-widest`: Reserved for micro-spaced badges.
- *Prohibited*: Arbitrary tracking classes (e.g. `tracking-[0.15em]`).

---

## 6. Containers & Layout

### Container Max-Width Scale
- **Wide (`max-w-[1440px]`)**: Home page layouts, hero banners, wide catalog showcases.
- **Standard (`max-w-7xl`)**: Shopping cart, checkout, account dashboard, order history, admin panel.
- **Reading (`max-w-3xl`)**: Policies, articles, FAQs, rich documentation.
- **Form (`max-w-md`)**: Authentication, login, single-column dialog forms.

### Horizontal Padding
- Universal container horizontal gutter: `px-4 sm:px-6 lg:px-8`.

---

## 7. Section Spacing & Gaps

### Vertical Spacing
- **Standard Section**: `py-16 sm:py-20 lg:py-24`
- **Compact Section**: `py-10 sm:py-14`

### Flexbox & Grid Gaps
- Permitted gap tokens: `gap-4`, `gap-6`, `gap-8`.
- Arbitrary spacing values (e.g. `gap-[18px]`) are prohibited.

---

## 8. Radius Scale

To maintain a clean geometric rhythm, only 4 radius tokens are permitted:
- `rounded-full`: Buttons, pill chips, icon buttons, status badges.
- `rounded-xl`: Product cards, feature cards, modal dialogs.
- `rounded-lg`: Form inputs, selects, image display frames.
- `rounded-md`: Small toggles, micro switches.
- *Prohibited*: `rounded-none`, `rounded-sm`, `rounded-2xl`, `rounded-3xl`.

---

## 9. Elevation & Shadows

- `shadow-sm`: Subtle card elevation at rest.
- `shadow-lg`: Hovered interactive cards, popovers, navigation dropdowns.
- `shadow-2xl`: Modals, slide-over sheets, full drawers.
- *Prohibited*: `shadow-md`, `shadow-xl`, `shadow-inner`, or custom shadow definitions.

---

## 10. Motion & Animation

- **Standard Durations**:
  - `duration-200`: Micro-interactions, hover states, toggles.
  - `duration-300`: Standard card shifts, tab transitions, dropdown reveals.
  - `duration-500`: Modal entrances, page reveals, hero animations.
- **Easing**:
  - `ease-out` for element entrance transitions.
  - `ease-in` for element exit transitions.
- **Transitions**:
  - **Never use `transition-all`**. Always explicitly declare `transition-colors`, `transition-transform`, or `transition-opacity`.
  - Only animate `transform` and `opacity` properties.
- **Motion Library**:
  - Use `"motion"` (`import { motion } from "motion/react"`). `framer-motion` is deprecated.
- **Accessibility**:
  - Must respect `prefers-reduced-motion` at all times.

---

## 11. Z-Index Ladder

All stacking contexts must strictly follow this ladder:

| Token / Class | Z-Index | Purpose |
|---|---|---|
| `z-0` | 0 | Canvas, deep background elements |
| `z-10` | 10 | Standard page content, text, media |
| `z-20` | 20 | In-section sticky filter bars, sub-nav bars |
| `z-30` | 30 | Dropdown menus, autocomplete, popovers |
| `z-40` (`z-header`) | 40 | Announcement bar, primary navigation navbar |
| `z-50` (`z-overlay`) | 50 | Drawers, cart sheet, modals, backdrop overlays |
| `z-60` (`z-toast`) | 60 | Global notification toasts, alert banners |

*No arbitrary z-index values (e.g. `z-999`, `z-[100]`) may be used.*

---

## 12. Component Primitives

All UI development must use the shared primitives:
- **Buttons**: `ui/Button` (Primary Gold, Secondary Ink, Ghost/Outline). No raw `<button>` elements for primary or secondary actions.
- **Inputs & Controls**: `ui/Input`, `ui/Select`, `ui/Checkbox`.
- **Cards**: `ui/Card` for consistent padding, border, and hover elevation.
- **Overlays**: `ui/Modal` for centered dialogs, `ui/Drawer` for side drawers.
- **Layout Containers**: `ui/Container` for centralized max-width and gutter management.

---

## 13. Accessibility (a11y) Standards

- **Focus Ring**: Every interactive element must display a visible 2px outline with 2px offset (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111111]`).
- **Icon Buttons**: Every icon-only button must have an explicit `aria-label`.
- **Contrast**: Text contrast must meet or exceed WCAG 2.1 AA (minimum 4.5:1 against light surfaces).
- **Touch Targets**: Mobile tap targets must be at least 44px x 44px.
- **Reduced Motion**: All animations and transitions must be suppressed or collapsed to instantaneous states under `@media (prefers-reduced-motion: reduce)`.

---

## 14. Media & Icons

- **Images**: Always use `next/image` with explicit width/height or `fill`, proper aspect ratio container, and meaningful `alt` text.
- **Icons**: Exclusively use `lucide-react` and curated vectors from `ui/Icons.tsx`. No third-party icon packs.
