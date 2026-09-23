export interface Product {
  /** Unique product identifier (kebab-case SKU) */
  id: string;
  /** Internal SKU code, e.g. "VEY-TSH-OVR-001" */
  sku: string;
  /** URL-friendly slug, e.g. "core-oversized-tee-black" */
  slug: string;
  /** Display name, e.g. "Core Oversized Tee" */
  name: string;
  /** Top-level category: "Clothing" | "Footwear" */
  category: string;
  /** Subcategory label: "T-Shirts" | "Shoes" */
  subcategory: string;
  /** Filter-chip subcategory tag: "Oversized" | "Regular" | "Relaxed" | "Graphic" | "Textured" | "Minimal" | "Retro" | "Chunky" */
  subcategoryTag: string;
  /** Garment fit (T-shirts only): "Oversized" | "Regular" | "Relaxed" */
  fit?: string;
  /** Watch movement type: "Automatic" | "Quartz" | "Solar" | "Digital" */
  movement?: "Automatic" | "Quartz" | "Solar" | "Digital";
  /** Watch strap material e.g. "Full-Grain Leather", "Milanese Mesh Steel" */
  strapMaterial?: string;
  /** Watch case diameter e.g. "38mm", "40mm", "42mm" */
  caseDiameter?: string;
  /** Watch gender classification */
  gender?: "Men" | "Women" | "Unisex";
  /** Water resistance rating e.g. "50M / 5ATM", "200M / 20ATM" */
  waterResistance?: string;
  /** Display color name, e.g. "Black" */
  colorName: string;
  /** Color hex value for swatches, e.g. "#111111" */
  colorHex: string;
  /** Material description, e.g. "100% Combed Cotton, 240gsm" */
  material: string;
  /** Current selling price in INR */
  price: number;
  /** Original MRP before discount (if applicable) */
  originalPrice?: number;
  /** Discount label, e.g. "15% OFF" */
  discount?: string;
  /** Product card primary image path */
  imageUrl: string;
  /** Product card hover image path */
  secondaryImageUrl?: string;
  /** Additional PDP gallery images */
  galleryImages?: string[];
  /** Merchandising badge */
  badge?: "NEW" | "SALE" | "BESTSELLER" | "LIMITED" | "TRENDING" | "PREMIUM" | "EXCLUSIVE" | "NEW ARRIVAL";
  /** Available sizes */
  sizes: string[];
  /** Whether this product appears in New Arrivals */
  isNewArrival: boolean;
  /** Stock availability */
  inStock: boolean;
  /** 1–2 sentence above-fold description */
  shortDescription: string;
  /** 3–5 sentence detailed description */
  longDescription?: string;
  /** Feature bullet points */
  features: string[];
  /** Care instruction bullets */
  care: string[];
  /** Fit/size guidance note */
  sizeGuide?: string;
  /** Collection names this product belongs to */
  collections: string[];
  /** Searchable/filterable tags */
  tags?: string[];
  /** Related product IDs for PDP cross-sells */
  relatedProducts: string[];

  // Legacy fields kept for backward compatibility
  colors?: string[];
  rating?: number;
  reviewsCount?: number;
}

// ── CUSTOMER REVIEW TYPES ───────────────────────────────────────────────────

export type ReviewFit = "Runs Small" | "True to Size" | "Runs Large";

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1 to 5
  title: string;
  content: string;
  date: string; // ISO date format e.g. "2026-08-14"
  verified: boolean;
  fit: ReviewFit;
  sizePurchased?: string;
  helpfulCount: number;
  unhelpfulCount: number;
}

export interface ReviewStats {
  averageRating: number;
  totalCount: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recommendationPercentage: number;
  fitBreakdown: {
    runsSmall: number;
    trueToSize: number;
    runsLarge: number;
  };
}

export interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
  isFeatured?: boolean;
  theme?: "light" | "dark";
  aspectRatio?: string;
  onWishlistToggle?: (productId: string) => void;
  className?: string;
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export type BadgeVariant = "default" | "dark" | "sale" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "default" | "wide" | "narrow" | "full";
  children: React.ReactNode;
}

export interface SectionHeadingProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  actionText?: string;
  actionHref?: string;
  align?: "left" | "center";
  className?: string;
}

// ── ORDER MANAGEMENT TYPES ───────────────────────────────────────────────────

export type OrderStatus = "Confirmed" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered";

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  colorName: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  description: string;
}

export interface OrderAddress {
  name: string;
  phone: string;
  address: string;
  pincode: string;
}

export interface OrderRecord {
  id: string;
  date: string;
  total: number;
  subtotal: number;
  bundleDiscount: number;
  couponDiscount: number;
  couponCode: string | null;
  shippingCost: number;
  itemsCount: number;
  items: OrderItem[];
  status: OrderStatus;
  estimatedDelivery: string;
  timeline: OrderTimeline[];
  shippingAddress: OrderAddress;
  paymentMethod: string;
  /** @deprecated Legacy compat — use items[] instead */
  itemNames: string[];
}
