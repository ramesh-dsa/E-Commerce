import { Product } from "@/types";

// ────────────────────────────────────────────────────────────────────────────
// VEYRO PRODUCT CATALOGUE — 24 SKUs
// 15 T-Shirts (Oversized 4 · Regular 3 · Relaxed 2 · Graphic 3 · Textured 3)
// 9 Footwear  (Minimal 3 · Retro 3 · Chunky 3)
// ────────────────────────────────────────────────────────────────────────────

/** T-Shirt size range */
const TEE_SIZES = ["S", "M", "L", "XL", "XXL"];

/** Footwear size range (UK/India) */
const SHOE_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"];

/** Standard T-shirt care instructions */
const TEE_CARE = [
  "Machine wash cold",
  "Tumble dry low",
  "Do not bleach",
  "Iron on low if needed",
];

/** Standard footwear care instructions */
const SHOE_CARE = [
  "Wipe clean with damp cloth",
  "Air dry away from direct heat",
  "Use shoe trees to maintain shape",
  "Apply protector spray for longevity",
];

// ────────────────────────────────────────────────────────────────────────────
// T-SHIRT PRODUCTS
// ────────────────────────────────────────────────────────────────────────────

const tshirts: Product[] = [
  // ── OVERSIZED ──────────────────────────────────────────────────────────

  {
    id: "vey-tsh-ovr-001",
    sku: "VEY-TSH-OVR-001",
    slug: "core-oversized-tee-black",
    name: "Core Oversized Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Oversized",
    fit: "Oversized",
    colorName: "Black",
    colorHex: "#111111",
    material: "100% Combed Cotton, 240gsm",
    price: 1199,
    imageUrl: "/products/tshirts/veyro-tee-01-primary.webp",
    secondaryImageUrl: "/products/tshirts/veyro-tee-01-hover.webp",
    galleryImages: [
      "/products/tshirts/VEY-TSH-OVR-001__lifestyle__black.webp",
    ],
    badge: "BESTSELLER",
    sizes: TEE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "Built from 240gsm combed cotton with a relaxed drop-shoulder silhouette. The one tee you'll reach for every morning.",
    longDescription:
      "The Core Oversized Tee is VEYRO's foundational piece — designed for daily wear without compromise. Cut with a generous drop-shoulder and a slightly extended body, it drapes naturally for that effortlessly confident look. The 240gsm combed cotton feels substantial without being heavy, and it's pre-shrunk to hold its shape through unlimited washes.",
    features: [
      "Heavyweight 240gsm combed cotton — substantial feel, holds structure all day",
      "Drop-shoulder seam — relaxed silhouette, effortless proportions",
      "Ribbed crewneck — retains shape wash after wash",
      "Pre-shrunk — no surprise shrinkage, true-to-size fit",
      "Side-seamed construction — cleaner drape, no twisting",
    ],
    care: TEE_CARE,
    sizeGuide: "Oversized fit — size down one for a more fitted feel",
    collections: ["Essentials", "Mono Tones"],
    tags: ["oversized", "black", "essential", "heavyweight", "cotton"],
    relatedProducts: [
      "vey-tsh-ovr-002",
      "vey-tsh-ovr-003",
      "vey-tsh-gfx-001",
      "vey-ftw-min-002",
    ],
  },

  {
    id: "vey-tsh-ovr-002",
    sku: "VEY-TSH-OVR-002",
    slug: "ease-oversized-tee-off-white",
    name: "Ease Oversized Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Oversized",
    fit: "Oversized",
    colorName: "Off-White",
    colorHex: "#F5F0EB",
    material: "100% Combed Cotton, 240gsm",
    price: 1199,
    imageUrl: "/products/tshirts/veyro-tee-02-primary.webp",
    secondaryImageUrl:
      "/products/tshirts/veyro-tee-02-hover.webp",
    sizes: TEE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "The same heavyweight drop-shoulder silhouette as the Core, in a warm off-white that pairs with everything.",
    longDescription:
      "The Ease Oversized Tee brings VEYRO's signature oversized cut into a versatile off-white colourway. The warm, slightly cream tone avoids the clinical look of pure white while staying completely neutral. Same 240gsm combed cotton construction, same confident drop-shoulder — just a lighter palette for warmer days and layered fits.",
    features: [
      "Heavyweight 240gsm combed cotton — same quality as the Core",
      "Warm off-white tone — not clinical, not cream, perfectly neutral",
      "Drop-shoulder seam — signature oversized proportions",
      "Ribbed crewneck — structured collar, relaxed body",
      "Pre-shrunk — true-to-size after every wash",
    ],
    care: TEE_CARE,
    sizeGuide: "Oversized fit — size down one for a more fitted feel",
    collections: ["Essentials", "Weekend Edit"],
    tags: ["oversized", "off-white", "essential", "heavyweight", "cotton"],
    relatedProducts: [
      "vey-tsh-ovr-001",
      "vey-tsh-ovr-003",
      "vey-tsh-rlx-001",
      "vey-ftw-min-001",
    ],
  },

  {
    id: "vey-tsh-ovr-003",
    sku: "VEY-TSH-OVR-003",
    slug: "range-oversized-tee-olive",
    name: "Range Oversized Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Oversized",
    fit: "Oversized",
    colorName: "Olive",
    colorHex: "#5C6B4F",
    material: "100% Combed Cotton, 240gsm",
    price: 1099,
    originalPrice: 1299,
    discount: "15% OFF",
    imageUrl: "/products/tshirts/veyro-tee-03-primary.webp",
    sizes: TEE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "Muted olive in the heavyweight oversized cut. A utility-inspired neutral that works season after season.",
    longDescription:
      "The Range Oversized Tee introduces an earthy olive into VEYRO's oversized lineup. The muted, slightly desaturated green reads as a masculine neutral — equally at home with dark denim, khaki cargos, or layered under a light jacket. The same 240gsm combed cotton and drop-shoulder silhouette you expect, in a colour that adds depth to your rotation.",
    features: [
      "Heavyweight 240gsm combed cotton — structured, substantial weight",
      "Muted olive colourway — earthy neutral, incredibly versatile",
      "Drop-shoulder seam — relaxed, contemporary silhouette",
      "Ribbed crewneck — holds its shape, no stretch-out",
      "Side-seamed — clean drape, no body twist",
    ],
    care: TEE_CARE,
    sizeGuide: "Oversized fit — size down one for a more fitted feel",
    collections: ["Weekend Edit"],
    tags: ["oversized", "olive", "earth-tone", "heavyweight", "cotton"],
    relatedProducts: [
      "vey-tsh-ovr-001",
      "vey-tsh-ovr-004",
      "vey-tsh-rlx-002",
      "vey-ftw-chk-003",
    ],
  },

  {
    id: "vey-tsh-ovr-004",
    sku: "VEY-TSH-OVR-004",
    slug: "mark-graphic-oversized-tee-charcoal",
    name: "Mark Graphic Oversized Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Graphic",
    fit: "Oversized",
    colorName: "Charcoal",
    colorHex: "#3A3A3A",
    material: "Cotton Blend (80/20), 220gsm",
    price: 1399,
    badge: "NEW",
    imageUrl: "/products/tshirts/veyro-tee-04-primary.webp",
    secondaryImageUrl:
      "/products/tshirts/veyro-tee-04-hover.webp",
    sizes: TEE_SIZES,
    isNewArrival: true,
    inStock: true,
    shortDescription:
      "A subtle chest graphic on VEYRO's oversized silhouette. Dark charcoal with a tonal print that rewards a closer look.",
    longDescription:
      "The Mark Graphic Oversized Tee adds a design element to the oversized foundation. A tonal graphic sits across the chest — visible up close, understated from a distance. The charcoal base keeps it dark and versatile while the 220gsm cotton blend drapes slightly softer than the pure cotton heavyweights. Statement without shouting.",
    features: [
      "Tonal chest graphic — subtle design, not overpowering",
      "220gsm cotton blend — smooth drape, great print surface",
      "Drop-shoulder oversized cut — confident, modern proportions",
      "Dark charcoal base — darker than grey, lighter than black",
      "Ribbed crewneck — clean, structured collar",
    ],
    care: [
      "Machine wash cold inside-out to protect print",
      "Tumble dry low",
      "Do not iron directly on print",
      "Do not bleach",
    ],
    sizeGuide: "Oversized fit — true to size for intended oversized drape",
    collections: ["New Season"],
    tags: ["oversized", "charcoal", "graphic", "print", "new-arrival"],
    relatedProducts: [
      "vey-tsh-gfx-001",
      "vey-tsh-gfx-002",
      "vey-tsh-ovr-001",
      "vey-ftw-ret-001",
    ],
  },

  // ── REGULAR FIT ────────────────────────────────────────────────────────

  {
    id: "vey-tsh-reg-001",
    sku: "VEY-TSH-REG-001",
    slug: "daily-crewneck-tee-white",
    name: "Daily Crewneck Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Regular",
    fit: "Regular",
    colorName: "White",
    colorHex: "#FFFFFF",
    material: "100% Cotton Jersey, 180gsm",
    price: 799,
    imageUrl: "/products/tshirts/veyro-tee-05-primary.webp",
    sizes: TEE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "The white tee, done right. Clean regular fit in soft 180gsm cotton jersey — your most-worn piece.",
    longDescription:
      "Every wardrobe starts with a white tee. The Daily Crewneck is VEYRO's take on the essential — cut in a classic regular fit that works tucked, untucked, or layered. The 180gsm cotton jersey is light enough for Indian summers but weighty enough to avoid being see-through. Simple, purposeful, endlessly versatile.",
    features: [
      "180gsm cotton jersey — breathable, opaque, comfortable",
      "Classic regular fit — set-in shoulders, slightly tapered body",
      "Double-stitched hem — durability without bulk",
      "Reinforced collar — no stretching, no sagging",
      "Pre-washed — soft from day one, no shrinkage surprises",
    ],
    care: TEE_CARE,
    sizeGuide: "Regular fit — true to size",
    collections: ["Essentials", "Mono Tones"],
    tags: ["regular", "white", "essential", "basic", "cotton"],
    relatedProducts: [
      "vey-tsh-reg-002",
      "vey-tsh-reg-003",
      "vey-tsh-rlx-001",
      "vey-ftw-min-001",
    ],
  },

  {
    id: "vey-tsh-reg-002",
    sku: "VEY-TSH-REG-002",
    slug: "drift-regular-tee-muted-blue",
    name: "Drift Regular Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Regular",
    fit: "Regular",
    colorName: "Muted Blue",
    colorHex: "#5B7B95",
    material: "100% Cotton Jersey, 180gsm",
    price: 999,
    imageUrl: "/products/tshirts/veyro-tee-06-primary.webp",
    sizes: TEE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "A desaturated blue that feels calm and intentional. Regular fit in soft cotton jersey.",
    longDescription:
      "The Drift Regular Tee brings a cool, muted blue into VEYRO's regular fit lineup. It's not navy, not sky — it's a deliberately desaturated tone that reads as effortlessly stylish. The 180gsm cotton jersey keeps things light and easy while the regular fit provides clean proportions that work for everything from office-casual to weekend errands.",
    features: [
      "Muted blue colourway — calm, versatile, modern",
      "180gsm cotton jersey — lightweight, breathable comfort",
      "Regular fit — structured without being tight",
      "Reinforced crewneck — holds shape over time",
      "Side-seamed construction — clean lines, no twisting",
    ],
    care: TEE_CARE,
    sizeGuide: "Regular fit — true to size",
    collections: ["Essentials"],
    tags: ["regular", "blue", "muted", "cotton", "essential"],
    relatedProducts: [
      "vey-tsh-reg-001",
      "vey-tsh-reg-003",
      "vey-tsh-rlx-002",
      "vey-ftw-min-003",
    ],
  },

  {
    id: "vey-tsh-reg-003",
    sku: "VEY-TSH-REG-003",
    slug: "grove-regular-tee-forest-green",
    name: "Grove Regular Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Regular",
    fit: "Regular",
    colorName: "Forest Green",
    colorHex: "#2D5A3D",
    material: "100% Cotton, 200gsm",
    price: 1099,
    badge: "NEW",
    imageUrl: "/products/tshirts/veyro-tee-07-primary.webp",
    sizes: TEE_SIZES,
    isNewArrival: true,
    inStock: true,
    shortDescription:
      "Deep forest green in a clean regular fit. A colour with presence that still plays well with neutrals.",
    longDescription:
      "The Grove Regular Tee is VEYRO's colour statement in regular fit. The deep forest green is rich without being loud — it pairs beautifully with khaki, black, and grey bottoms. Slightly heavier at 200gsm than the Daily and Drift, giving it a touch more structure and visual weight. A wardrobe upgrade from the usual black-and-white rotation.",
    features: [
      "Deep forest green — rich, earthy, masculine colour",
      "200gsm cotton — slightly heavier than standard jersey for added substance",
      "Regular fit — clean proportions, set-in shoulders",
      "Reinforced crewneck — structured collar, no sagging",
      "Garment-dyed — subtle tonal variation for a lived-in feel",
    ],
    care: TEE_CARE,
    sizeGuide: "Regular fit — true to size",
    collections: ["New Season"],
    tags: ["regular", "forest-green", "earth-tone", "new-arrival", "cotton"],
    relatedProducts: [
      "vey-tsh-reg-001",
      "vey-tsh-gfx-003",
      "vey-tsh-txr-002",
      "vey-ftw-ret-001",
    ],
  },

  // ── RELAXED FIT ────────────────────────────────────────────────────────

  {
    id: "vey-tsh-rlx-001",
    sku: "VEY-TSH-RLX-001",
    slug: "form-relaxed-tee-stone",
    name: "Form Relaxed Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Relaxed",
    fit: "Relaxed",
    colorName: "Stone",
    colorHex: "#C4B9A8",
    material: "100% Cotton, 200gsm",
    price: 899,
    originalPrice: 1099,
    discount: "18% OFF",
    badge: "SALE",
    imageUrl: "/products/tshirts/veyro-tee-08-primary.webp",
    sizes: TEE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "A warm stone neutral in VEYRO's relaxed cut. The bridge between oversized and regular — comfortable without being baggy.",
    longDescription:
      "The Form Relaxed Tee sits in the sweet spot between structured and loose. The relaxed fit gives you room through the body without the exaggerated proportions of oversized. The warm stone colourway is one of those rare neutrals that works with practically every colour in your wardrobe. At 200gsm cotton, it has just enough weight to drape properly.",
    features: [
      "Relaxed fit — room without bulk, intentional proportions",
      "Warm stone colourway — a modern neutral, pairs with everything",
      "200gsm cotton — balanced weight, good drape",
      "Natural shoulder seam — not dropped, not set-in tight",
      "Clean finished hem — no rolled or raw edges",
    ],
    care: TEE_CARE,
    sizeGuide: "Relaxed fit — true to size for a comfortable, easy fit",
    collections: ["Essentials", "Weekend Edit"],
    tags: ["relaxed", "stone", "neutral", "sale", "cotton"],
    relatedProducts: [
      "vey-tsh-rlx-002",
      "vey-tsh-ovr-002",
      "vey-tsh-reg-001",
      "vey-ftw-min-001",
    ],
  },

  {
    id: "vey-tsh-rlx-002",
    sku: "VEY-TSH-RLX-002",
    slug: "depth-relaxed-tee-navy",
    name: "Depth Relaxed Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Relaxed",
    fit: "Relaxed",
    colorName: "Navy",
    colorHex: "#1E2A3A",
    material: "100% Cotton, 200gsm",
    price: 999,
    imageUrl: "/products/tshirts/veyro-tee-09-primary.webp",
    sizes: TEE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "Deep navy in the relaxed silhouette. Dark enough to dress up, comfortable enough for every day.",
    longDescription:
      "The Depth Relaxed Tee brings VEYRO's navy into the relaxed fit family. The deep, almost-midnight navy works as a dark neutral — versatile enough for casual Fridays and weekend plans alike. The relaxed body allows natural movement while the 200gsm cotton maintains a clean, put-together appearance. Navy done with intention.",
    features: [
      "Deep navy colourway — dark neutral, incredibly versatile",
      "200gsm cotton — mid-weight comfort, holds shape well",
      "Relaxed fit — easy proportions, works tucked or untucked",
      "Ribbed crewneck — structured neckline on a relaxed body",
      "Pre-washed — soft from the first wear",
    ],
    care: TEE_CARE,
    sizeGuide: "Relaxed fit — true to size for a comfortable, easy fit",
    collections: ["Weekend Edit"],
    tags: ["relaxed", "navy", "dark-neutral", "cotton", "versatile"],
    relatedProducts: [
      "vey-tsh-rlx-001",
      "vey-tsh-ovr-001",
      "vey-tsh-reg-002",
      "vey-ftw-ret-002",
    ],
  },

  // ── GRAPHIC & TYPOGRAPHY ───────────────────────────────────────────────

  {
    id: "vey-tsh-gfx-001",
    sku: "VEY-TSH-GFX-001",
    slug: "motto-typography-tee-black",
    name: "Motto Typography Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Graphic",
    fit: "Relaxed",
    colorName: "Black",
    colorHex: "#111111",
    material: "Cotton Blend (80/20), 200gsm",
    price: 1299,
    badge: "NEW",
    imageUrl: "/products/tshirts/veyro-tee-10-primary.webp",
    sizes: TEE_SIZES,
    isNewArrival: true,
    inStock: true,
    shortDescription:
      "Typography as design. A bold lettering statement across the chest in a relaxed black tee.",
    longDescription:
      "The Motto Typography Tee lets the letters do the talking. A bold typographic treatment spans the chest — modern sans-serif lettering that feels graphic without being loud. The black base keeps it wearable for any occasion while the relaxed fit and 200gsm cotton blend give it easy, all-day comfort. For when you want your tee to say something without saying too much.",
    features: [
      "Bold chest typography — modern lettering, not a logo tee",
      "200gsm cotton blend — smooth surface for crisp print",
      "Relaxed fit — easy, comfortable proportions",
      "High-density print — raised texture, premium feel",
      "Black base — the most versatile canvas",
    ],
    care: [
      "Machine wash cold inside-out to protect print",
      "Tumble dry low",
      "Do not iron directly on print",
      "Do not bleach",
    ],
    sizeGuide:
      "Relaxed fit — true to size for an easy, comfortable drape",
    collections: ["New Season"],
    tags: ["graphic", "typography", "black", "new-arrival", "statement"],
    relatedProducts: [
      "vey-tsh-gfx-002",
      "vey-tsh-gfx-003",
      "vey-tsh-ovr-004",
      "vey-ftw-chk-001",
    ],
  },

  {
    id: "vey-tsh-gfx-002",
    sku: "VEY-TSH-GFX-002",
    slug: "echo-back-print-tee-off-white",
    name: "Echo Back-Print Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Graphic",
    fit: "Oversized",
    colorName: "Off-White",
    colorHex: "#F5F0EB",
    material: "Cotton Blend (80/20), 220gsm",
    price: 1499,
    badge: "NEW",
    imageUrl: "/products/tshirts/veyro-tee-11-primary.webp",
    galleryImages: [
      "/products/tshirts/VEY-TSH-GFX-002__lifestyle__off-white.webp",
    ],
    sizes: TEE_SIZES,
    isNewArrival: true,
    inStock: true,
    shortDescription:
      "Clean front, statement back. A large-scale tonal graphic across the back makes this oversized tee a quiet conversation starter.",
    longDescription:
      "The Echo Back-Print Tee is designed for the double-take. From the front, it's a clean oversized off-white tee — understated and easy. Turn around, and a bold graphic print spans the entire back panel. The print uses a tonal dark-on-light palette that stays sophisticated rather than loud. Cut in an oversized silhouette from 220gsm cotton blend, it's substantial enough to let the print sit flat and crisp.",
    features: [
      "Large-scale back graphic — tonal print, sophisticated not shouty",
      "220gsm cotton blend — mid-heavyweight, smooth print surface",
      "Oversized drop-shoulder — relaxed, contemporary proportions",
      "Clean front — minimal, no chest graphic, versatile",
      "Pre-washed — soft hand-feel from day one",
    ],
    care: [
      "Machine wash cold inside-out to protect print",
      "Tumble dry low",
      "Do not iron directly on print",
      "Do not bleach",
    ],
    sizeGuide: "Oversized fit — true to size for intended oversized drape",
    collections: ["New Season"],
    tags: [
      "graphic",
      "back-print",
      "off-white",
      "oversized",
      "new-arrival",
      "statement",
    ],
    relatedProducts: [
      "vey-tsh-gfx-001",
      "vey-tsh-gfx-003",
      "vey-tsh-ovr-002",
      "vey-ftw-ret-001",
    ],
  },

  
  // ── TEXTURED & PREMIUM ────────────────────────────────────────────────

  {
    id: "vey-tsh-txr-001",
    sku: "VEY-TSH-TXR-001",
    slug: "grid-waffle-tee-beige",
    name: "Grid Waffle Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Textured",
    fit: "Relaxed",
    colorName: "Beige",
    colorHex: "#D4C8B0",
    material: "100% Cotton Waffle Knit, 210gsm",
    price: 1599,
    badge: "NEW",
    imageUrl: "/products/tshirts/veyro-tee-12-primary.webp",
    galleryImages: [
      "/products/tshirts/VEY-TSH-TXR-001__detail__beige.webp",
    ],
    sizes: TEE_SIZES,
    isNewArrival: true,
    inStock: true,
    shortDescription:
      "The fabric is the design. Waffle-knit cotton in a warm beige — textured, tactile, elevated.",
    longDescription:
      "The Grid Waffle Tee lets material speak louder than graphics. The signature waffle-knit weave creates a visible grid pattern across the entire garment — adding visual depth and tactile interest that no plain tee can match. In a warm beige colourway and a relaxed fit, it feels like a deliberate upgrade from standard cotton jersey. This is where comfort meets intention.",
    features: [
      "Waffle-knit construction — distinctive grid texture, visible from across the room",
      "210gsm cotton — breathable waffle structure, thermal regulation",
      "Warm beige colourway — sophisticated neutral, premium feel",
      "Relaxed fit — easy proportions, works alone or layered",
      "Reinforced seams — durability matched to the premium fabric",
    ],
    care: [
      "Machine wash cold on gentle cycle",
      "Lay flat to dry to preserve waffle texture",
      "Do not bleach",
      "Iron on low, avoid pressing flat on texture",
    ],
    sizeGuide: "Relaxed fit — true to size for a comfortable, easy fit",
    collections: ["New Season"],
    tags: ["textured", "waffle-knit", "beige", "premium", "new-arrival"],
    relatedProducts: [
      "vey-tsh-txr-002",
      "vey-tsh-txr-003",
      "vey-tsh-rlx-001",
      "vey-ftw-chk-002",
    ],
  },

  {
    id: "vey-tsh-txr-002",
    sku: "VEY-TSH-TXR-002",
    slug: "ridge-ribbed-tee-coffee-brown",
    name: "Ridge Ribbed Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Textured",
    fit: "Regular",
    colorName: "Coffee Brown",
    colorHex: "#6B4A3A",
    material: "100% Cotton Rib Knit, 200gsm",
    price: 1299,
    originalPrice: 1499,
    discount: "13% OFF",
    imageUrl: "/products/tshirts/veyro-tee-13-primary.webp",
    sizes: TEE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "Ribbed cotton in a rich coffee brown. The vertical texture adds structure and visual interest to a regular fit tee.",
    longDescription:
      "The Ridge Ribbed Tee uses vertical rib knitting to create a tee with built-in texture and structure. The ribbed construction adds visual lines that make the garment look sharper and more intentional than flat jersey. In a warm coffee brown, it bridges casual and smart-casual effortlessly. The regular fit and 200gsm weight keep it practical for daily wear while the texture elevates it above the ordinary.",
    features: [
      "Rib-knit construction — vertical texture, slim visual effect",
      "200gsm cotton — mid-weight with natural stretch from ribbing",
      "Coffee brown colourway — warm, rich, pairs with any neutral",
      "Regular fit — clean lines accentuated by the ribbed texture",
      "Soft hand-feel — pre-washed for comfort from first wear",
    ],
    care: [
      "Machine wash cold on gentle cycle",
      "Reshape while damp, lay flat to dry",
      "Do not bleach",
      "Iron on low if needed",
    ],
    sizeGuide: "Regular fit — may feel slightly more fitted due to ribbed knit",
    collections: [],
    tags: ["textured", "ribbed", "coffee-brown", "warm-neutral", "premium"],
    relatedProducts: [
      "vey-tsh-txr-001",
      "vey-tsh-txr-003",
      "vey-tsh-reg-003",
      "vey-ftw-chk-002",
    ],
  },

  {
    id: "vey-tsh-txr-003",
    sku: "VEY-TSH-TXR-003",
    slug: "forge-heavyweight-tee-charcoal",
    name: "Forge Heavyweight Tee",
    category: "Clothing",
    subcategory: "T-Shirts",
    subcategoryTag: "Textured",
    fit: "Relaxed",
    colorName: "Charcoal",
    colorHex: "#3A3A3A",
    material: "100% Slub Cotton, 280gsm",
    price: 1799,
    badge: "LIMITED",
    imageUrl: "/products/tshirts/veyro-tee-14-primary.webp",
    galleryImages: [
      "/products/tshirts/VEY-TSH-TXR-003__lifestyle__charcoal.webp",
    ],
    sizes: TEE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "The heaviest tee in the VEYRO lineup. 280gsm slub cotton in charcoal — substantial, textured, built to last.",
    longDescription:
      "The Forge Heavyweight Tee is VEYRO's most premium T-shirt. At 280gsm, the slub cotton feels like a completely different category from standard tees — thick, weighty, and substantial in your hands. The slub texture creates subtle surface irregularities that catch the light and give the fabric a handcrafted, artisanal quality. In deep charcoal with a relaxed fit, it's the tee equivalent of a well-worn leather jacket — better with age.",
    features: [
      "280gsm slub cotton — the heaviest tee in the collection",
      "Slub texture — subtle surface grain, artisanal character",
      "Dark charcoal — deep, moody, sophisticated",
      "Relaxed fit — proportions that match the fabric's weight",
      "Flatlock seams — smooth interior, no irritation on heavy fabric",
    ],
    care: [
      "Machine wash cold",
      "Tumble dry low — heavyweight fabric takes longer to dry",
      "Do not bleach",
      "Improves with each wash — develops character over time",
    ],
    sizeGuide:
      "Relaxed fit — true to size. Fabric weight creates natural drape.",
    collections: ["Mono Tones"],
    tags: [
      "textured",
      "heavyweight",
      "charcoal",
      "slub",
      "premium",
      "limited",
    ],
    relatedProducts: [
      "vey-tsh-txr-001",
      "vey-tsh-txr-002",
      "vey-tsh-ovr-001",
      "vey-ftw-chk-001",
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// FOOTWEAR PRODUCTS
// ────────────────────────────────────────────────────────────────────────────

const footwear: Product[] = [
  // ── MINIMAL / CLEAN ────────────────────────────────────────────────────

  {
    id: "vey-ftw-min-001",
    sku: "VEY-FTW-MIN-001",
    slug: "blanc-court-sneaker-white",
    name: "Blanc Court Sneaker",
    category: "Footwear",
    subcategory: "Shoes",
    subcategoryTag: "Minimal",
    colorName: "Triple White",
    colorHex: "#FFFFFF",
    material: "Premium Synthetic Leather Upper, Vulcanized Rubber Outsole",
    price: 2699,
    badge: "BESTSELLER",
    imageUrl: "/products/shoes/veyro-shoe-01-primary.webp",
    secondaryImageUrl: "/products/shoes/vey-ftw-min-001-macro.jpg",
    galleryImages: [
      "/products/footwear/VEY-FTW-MIN-001__lifestyle__white.webp",
    ],
    sizes: SHOE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "Clean lines, vulcanized sole, smooth leather upper. The white sneaker that works with literally everything.",
    longDescription:
      "The Blanc Court is VEYRO's signature white sneaker — engineered for versatility. The smooth leather upper keeps things sharp, while the slim vulcanized sole adds that classic court silhouette. Minimal branding, clean stitching, and a tonal white palette make this the most flexible shoe in your rotation. Dress it up with chinos or keep it casual with joggers.",
    features: [
      "Smooth leather upper — clean, easy to maintain",
      "Vulcanized rubber sole — slim profile, classic court look",
      "Tonal flat laces — minimal, no-distraction styling",
      "Cushioned footbed — all-day comfort without bulk",
      "Reinforced heel counter — structured support, keeps shape",
    ],
    care: SHOE_CARE,
    sizeGuide: "True to size — order your regular UK size",
    collections: ["Essentials", "Mono Tones"],
    tags: ["minimal", "white", "court", "essential", "leather", "bestseller"],
    relatedProducts: [
      "vey-ftw-min-002",
      "vey-ftw-min-003",
      "vey-ftw-ret-001",
      "vey-tsh-ovr-001",
    ],
  },

  {
    id: "vey-ftw-min-002",
    sku: "VEY-FTW-MIN-002",
    slug: "mono-low-sneaker-black",
    name: "Mono Low Sneaker",
    category: "Footwear",
    subcategory: "Shoes",
    subcategoryTag: "Minimal",
    colorName: "Core Black",
    colorHex: "#111111",
    material: "Premium Synthetic Leather Upper, Rubber Cupsole",
    price: 2799,
    imageUrl: "/products/shoes/veyro-shoe-02-primary.webp",
    secondaryImageUrl: "/products/shoes/vey-ftw-min-002-macro.jpg",
    sizes: SHOE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "All-black minimal sneaker with a clean cupsole. Tonal lacing, dark outsole — sharp and understated.",
    longDescription:
      "The Mono Low takes the clean sneaker formula and turns the lights down. An all-black upper sits on a tonal dark rubber cupsole — everything matches, nothing distracts. The cupsole provides slightly more cushioning than a vulcanized sole while maintaining a slim profile. For when you want a sneaker that disappears into the outfit and lets everything else speak.",
    features: [
      "Tonal all-black construction — upper, sole, laces all matched",
      "Rubber cupsole — subtle cushioning, clean profile",
      "Smooth leather upper — sleek, easy to clean",
      "Padded collar — comfort without bulk",
      "Tonal branding — minimal, nearly invisible",
    ],
    care: SHOE_CARE,
    sizeGuide: "True to size — order your regular UK size",
    collections: ["Essentials", "Mono Tones"],
    tags: ["minimal", "black", "tonal", "essential", "leather"],
    relatedProducts: [
      "vey-ftw-min-001",
      "vey-ftw-min-003",
      "vey-ftw-chk-001",
      "vey-tsh-ovr-001",
    ],
  },

  {
    id: "vey-ftw-min-003",
    sku: "VEY-FTW-MIN-003",
    slug: "fog-low-sneaker-light-grey",
    name: "Fog Low Sneaker",
    category: "Footwear",
    subcategory: "Shoes",
    subcategoryTag: "Minimal",
    colorName: "Light Grey",
    colorHex: "#B8B8B8",
    material: "Leather + Suede Upper, Rubber Cupsole",
    price: 2499,
    badge: "NEW",
    imageUrl: "/products/shoes/veyro-shoe-03-primary.webp",
    secondaryImageUrl: "/products/shoes/vey-ftw-min-003-macro.jpg",
    sizes: SHOE_SIZES,
    isNewArrival: true,
    inStock: true,
    shortDescription:
      "A soft, misty grey that sits between white and black. Mixed leather and suede upper adds subtle texture.",
    longDescription:
      "The Fog Low fills the gap between white and black in VEYRO's minimal range. The light grey colourway is understated and modern — it doesn't demand attention but always looks considered. The mixed leather-and-suede upper adds material variation that keeps the shoe interesting without being complex. Sitting on a slightly lighter cupsole, it's the quietly confident sneaker pick.",
    features: [
      "Light grey colourway — the perfect neutral between white and black",
      "Mixed leather + suede upper — subtle material contrast",
      "Rubber cupsole — comfortable, low-profile",
      "Off-white sole — creates gentle contrast with grey upper",
      "Cushioned insole — lightweight comfort for all-day wear",
    ],
    care: [
      "Brush suede panels with soft brush",
      "Wipe leather panels with damp cloth",
      "Apply suede protector spray before first wear",
      "Air dry away from direct heat",
    ],
    sizeGuide: "True to size — order your regular UK size",
    collections: ["New Season", "Essentials", "Mono Tones"],
    tags: ["minimal", "grey", "neutral", "new-arrival", "suede", "leather"],
    relatedProducts: [
      "vey-ftw-min-001",
      "vey-ftw-min-002",
      "vey-ftw-ret-002",
      "vey-tsh-rlx-001",
    ],
  },

  // ── RETRO / COLOR-BLOCK ───────────────────────────────────────────────

  {
    id: "vey-ftw-ret-001",
    sku: "VEY-FTW-RET-001",
    slug: "campus-retro-sneaker-off-white-green",
    name: "Campus Retro Sneaker",
    category: "Footwear",
    subcategory: "Shoes",
    subcategoryTag: "Retro",
    colorName: "Off-White + Green",
    colorHex: "#F5F0EB",
    material: "Suede Upper, Gum Rubber Outsole",
    price: 3199,
    badge: "NEW",
    imageUrl:
      "/products/shoes/veyro-shoe-04-primary.webp",
    secondaryImageUrl: "/products/shoes/vey-ftw-ret-001-macro.jpg",
    galleryImages: [
      "/products/footwear/VEY-FTW-RET-001__lifestyle__off-white-green.webp",
    ],
    sizes: SHOE_SIZES,
    isNewArrival: true,
    inStock: true,
    shortDescription:
      "Heritage campus vibes. Off-white suede with forest green accents on a warm gum sole.",
    longDescription:
      "The Campus Retro brings vintage university sneaker energy into the present. An off-white suede upper sits against forest green accent panels, creating a colour combination that feels both nostalgic and fresh. The gum rubber sole adds warmth and completes the heritage look. Suede gives the shoe a tactile, lived-in quality that leather can't match — it gets better with every wear.",
    features: [
      "Suede upper — tactile, develops character with wear",
      "Off-white + forest green colour blocking — heritage-inspired palette",
      "Gum rubber outsole — warm, retro aesthetic, excellent grip",
      "Padded tongue and collar — retro comfort",
      "Metal eyelets — durable, classic detailing",
    ],
    care: [
      "Brush with soft suede brush after each wear",
      "Apply suede protector spray before first wear",
      "Spot clean with suede eraser",
      "Air dry naturally — never use direct heat",
    ],
    sizeGuide: "True to size — order your regular UK size",
    collections: ["New Season"],
    tags: [
      "retro",
      "suede",
      "off-white",
      "green",
      "gum-sole",
      "new-arrival",
      "campus",
    ],
    relatedProducts: [
      "vey-ftw-ret-002",
      "vey-ftw-ret-003",
      "vey-ftw-min-001",
      "vey-tsh-gfx-002",
    ],
  },

  {
    id: "vey-ftw-ret-002",
    sku: "VEY-FTW-RET-002",
    slug: "archive-retro-sneaker-navy-gum",
    name: "Archive Retro Sneaker",
    category: "Footwear",
    subcategory: "Shoes",
    subcategoryTag: "Retro",
    colorName: "Navy + Gum",
    colorHex: "#1E2A3A",
    material: "Suede + Canvas Upper, Gum Rubber Outsole",
    price: 2799,
    originalPrice: 3299,
    discount: "15% OFF",
    imageUrl: "/products/shoes/veyro-shoe-05-primary.webp",
    secondaryImageUrl: "/products/shoes/vey-ftw-ret-002-macro.jpg",
    sizes: SHOE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "Navy suede and canvas on a classic gum sole. Pulled from the archive — a timeless combination.",
    longDescription:
      "The Archive Retro takes the best of 1970s sneaker design and rebuilds it for today. A navy suede upper is complemented by canvas side panels, creating a two-material composition that adds depth and visual interest. The gum rubber sole grounds the whole design in retro authenticity. Navy and gum is one of those combinations that never dates — it looked good in 1975 and it'll look good in 2035.",
    features: [
      "Mixed suede + canvas upper — two textures, one cohesive design",
      "Deep navy colourway — rich, versatile, pairs with everything",
      "Gum rubber outsole — classic retro foundation, warm tone",
      "Reinforced toe cap — durability where you need it",
      "Cushioned footbed — modern comfort in a vintage shape",
    ],
    care: [
      "Brush suede panels with soft brush",
      "Spot clean canvas with mild soap and water",
      "Apply protector spray to suede panels",
      "Air dry away from direct heat",
    ],
    sizeGuide: "True to size — order your regular UK size",
    collections: ["Weekend Edit"],
    tags: ["retro", "navy", "suede", "canvas", "gum-sole", "archive"],
    relatedProducts: [
      "vey-ftw-ret-001",
      "vey-ftw-ret-003",
      "vey-ftw-min-002",
      "vey-tsh-rlx-002",
    ],
  },

  {
    id: "vey-ftw-ret-003",
    sku: "VEY-FTW-RET-003",
    slug: "accent-retro-sneaker-grey-burgundy",
    name: "Accent Retro Sneaker",
    category: "Footwear",
    subcategory: "Shoes",
    subcategoryTag: "Retro",
    colorName: "Grey + Burgundy",
    colorHex: "#888888",
    material: "Suede Upper, Vulcanized Rubber Outsole",
    price: 3299,
    imageUrl:
      "/products/shoes/veyro-shoe-06-primary.webp",
    secondaryImageUrl: "/products/shoes/vey-ftw-ret-003-macro.jpg",
    sizes: SHOE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "Grey suede with burgundy accent panels. Bold contrast that still knows when to stop.",
    longDescription:
      "The Accent Retro earns its name with a deliberate colour play — medium grey suede forms the base while deep burgundy panels add concentrated moments of colour. It's bold without being loud, confident without being flashy. The vulcanized sole keeps the profile slim and classic while the suede construction adds that premium tactile quality. For when grey and black aren't enough, but you're not ready for neon.",
    features: [
      "Grey + burgundy colour blocking — bold, sophisticated contrast",
      "Full suede upper — premium feel, develops patina with wear",
      "Vulcanized rubber sole — slim, classic, lightweight",
      "Contrast stitching — subtle design detail",
      "Cushioned insole — all-day wearability",
    ],
    care: [
      "Brush with soft suede brush regularly",
      "Apply suede protector spray before first wear",
      "Clean burgundy panels with suede eraser",
      "Store with shoe trees to maintain shape",
    ],
    sizeGuide: "True to size — order your regular UK size",
    collections: [],
    tags: ["retro", "grey", "burgundy", "suede", "contrast", "statement"],
    relatedProducts: [
      "vey-ftw-ret-001",
      "vey-ftw-ret-002",
      "vey-ftw-chk-001",
      "vey-tsh-gfx-003",
    ],
  },

  // ── CHUNKY / STATEMENT ────────────────────────────────────────────────

  {
    id: "vey-ftw-chk-001",
    sku: "VEY-FTW-CHK-001",
    slug: "elevate-chunky-sneaker-black",
    name: "Elevate Chunky Sneaker",
    category: "Footwear",
    subcategory: "Shoes",
    subcategoryTag: "Chunky",
    colorName: "Black + White Sole",
    colorHex: "#111111",
    material: "Mesh + Leather Upper, Chunky EVA Outsole",
    price: 3699,
    badge: "TRENDING",
    imageUrl:
      "/products/shoes/veyro-shoe-07-primary.webp",
    secondaryImageUrl: "/products/shoes/vey-ftw-chk-001-macro.jpg",
    galleryImages: [
      "/products/footwear/VEY-FTW-CHK-001__lifestyle__black-white.webp",
    ],
    sizes: SHOE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "Black upper, contrast white chunky sole. The platform sneaker that turns heads without trying.",
    longDescription:
      "The Elevate Chunky is VEYRO's statement footwear piece. A mixed mesh-and-leather black upper sits on an exaggerated white EVA sole that adds visible height and undeniable presence. The chunky sole isn't just about aesthetics — the EVA foam provides exceptional cushioning that makes this one of the most comfortable shoes in the lineup. It's streetwear confidence meets everyday practicality.",
    features: [
      "Chunky EVA outsole — lightweight despite the volume, exceptional cushioning",
      "Mixed mesh + leather upper — breathable, structured, layered construction",
      "Black + white contrast — the most iconic chunky sneaker colourway",
      "Pull-tab heel — easy on-off, branded detailing",
      "Padded sock-like collar — secure, comfortable fit",
    ],
    care: SHOE_CARE,
    sizeGuide:
      "True to size — the chunky sole adds height but doesn't affect fit",
    collections: ["Mono Tones"],
    tags: [
      "chunky",
      "black",
      "platform",
      "statement",
      "trending",
      "mesh",
      "leather",
    ],
    relatedProducts: [
      "vey-ftw-chk-002",
      "vey-ftw-chk-003",
      "vey-ftw-ret-003",
      "vey-tsh-gfx-001",
    ],
  },



  {
    id: "vey-ftw-chk-003",
    sku: "VEY-FTW-CHK-003",
    slug: "terrain-chunky-sneaker-dark-olive",
    name: "Terrain Chunky Sneaker",
    category: "Footwear",
    subcategory: "Shoes",
    subcategoryTag: "Chunky",
    colorName: "Dark Olive",
    colorHex: "#3D4A35",
    material: "Leather + Mesh Upper, Chunky EVA Outsole",
    price: 3499,
    originalPrice: 3999,
    discount: "12% OFF",
    badge: "LIMITED",
    imageUrl:
      "/products/shoes/veyro-shoe-09-primary.webp",
    secondaryImageUrl: "/products/shoes/vey-ftw-chk-003-macro.jpg",
    sizes: SHOE_SIZES,
    isNewArrival: false,
    inStock: true,
    shortDescription:
      "Dark olive on a chunky sole with dark gum detailing. Earthy, rugged, limited availability.",
    longDescription:
      "The Terrain Chunky closes the footwear range with its most rugged entry. Dark olive leather and mesh panels create a military-adjacent palette while the chunky EVA sole with dark gum accents adds outdoor utility vibes. This isn't a hiking shoe, but it borrows just enough from that world to feel adventurous. Limited production keeps it exclusive — once this run is done, it's done.",
    features: [
      "Dark olive colourway — earthy, masculine, trail-inspired",
      "Leather + mesh upper — durable, breathable, layered texture",
      "Chunky EVA sole with dark gum accent — rugged profile, outdoor energy",
      "Reinforced toe and heel — built for wear",
      "Heavy-duty lacing — round waxed laces, secure fit",
    ],
    care: SHOE_CARE,
    sizeGuide: "True to size — order your regular UK size",
    collections: [],
    tags: [
      "chunky",
      "olive",
      "limited",
      "platform",
      "leather",
      "mesh",
      "rugged",
    ],
    relatedProducts: [
      "vey-ftw-chk-001",
      "vey-ftw-chk-002",
      "vey-ftw-ret-003",
      "vey-tsh-ovr-003",
    ],
  },
  {
    id: "vey-ftw-std-001",
    sku: "VEY-FTW-STD-001",
    slug: "studio-everyday-low-top-clay",
    name: "Studio Everyday Low-Top",
    category: "Footwear",
    subcategory: "Shoes",
    subcategoryTag: "Minimal",
    colorName: "Clay Warm Grey",
    colorHex: "#B5AEA4",
    material: "Nubuck & Synthetic Leather Upper, Cushioned EVA Midsole",
    price: 2899,
    originalPrice: 3299,
    discount: "12% OFF",
    imageUrl: "/products/shoes/veyro-shoe-10-primary.webp",
    secondaryImageUrl: "/products/shoes/vey-ftw-std-001-macro.jpg",
    sizes: SHOE_SIZES,
    isNewArrival: true,
    inStock: true,
    shortDescription:
      "A versatile low-top in soft warm clay grey. Engineered for daily rotation with subtle nubuck paneling.",
    longDescription:
      "The Studio Everyday Low-Top is designed to seamlessly slot into any neutral wardrobe. Combining soft clay tones with structured synthetic leather and subtle nubuck paneling, it delivers understated luxury for everyday wear.",
    features: [
      "Warm clay grey tone — neutral, effortlessly versatile",
      "Nubuck & leather upper — premium tactile finish",
      "Ergonomic footbed — all-day walking comfort",
      "Padded collar and tongue — blister-free wear",
    ],
    care: SHOE_CARE,
    sizeGuide: "True to size — order your regular UK size",
    collections: ["Essentials"],
    tags: ["minimal", "low-top", "clay", "grey", "everyday", "sneakers"],
    relatedProducts: [
      "vey-ftw-min-001",
      "vey-ftw-min-003",
      "vey-ftw-ret-001",
      "vey-tsh-rlx-001",
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// COMBINED CATALOGUE EXPORT
// ────────────────────────────────────────────────────────────────────────────

/** Complete VEYRO product catalogue — 24 products (15 T-Shirts + 9 Footwear) */
export const products: Product[] = [...tshirts, ...footwear];

// ────────────────────────────────────────────────────────────────────────────
// CATALOGUE UTILITY FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────

/** Get a single product by its ID */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Get a single product by its slug */
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

/** Get all products in a specific category */
export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

/** Get all products with a specific subcategory tag */
export function getProductsBySubcategoryTag(tag: string): Product[] {
  return products.filter((p) => p.subcategoryTag === tag);
}

/** Get all products in a named collection */
export function getProductsByCollection(collection: string): Product[] {
  return products.filter((p) => p.collections.includes(collection));
}

/** Get all new arrival products */
export function getNewArrivals(): Product[] {
  return products.filter((p) => p.isNewArrival);
}

/** Get related products for a given product ID */
export function getRelatedProducts(productId: string): Product[] {
  const product = getProductById(productId);
  if (!product) return [];
  return product.relatedProducts
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}

/** Get all unique subcategory tags for a given category */
export function getSubcategoryTags(category: string): string[] {
  const tags = products
    .filter((p) => p.category === category)
    .map((p) => p.subcategoryTag);
  return [...new Set(tags)];
}

/** Get all unique collection names */
export function getCollectionNames(): string[] {
  const names = products.flatMap((p) => p.collections);
  return [...new Set(names)];
}
