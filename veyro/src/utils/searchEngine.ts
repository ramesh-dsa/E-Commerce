/**
 * VEYRO Universal Smart E-Commerce Search & Fuzzy Matching Engine
 * 
 * Provides:
 * - Hyphen, space, and punctuation normalization (e.g. "t-shirt" == "tshirt" == "t shirt")
 * - Singular / Plural English stemming (e.g. "tshirts" -> "tshirt", "watches" -> "watch")
 * - Rich E-Commerce synonym expansion (e.g. "tshirt" matches "Tee", "shoes" matches "Sneakers")
 * - Typo tolerance & Levenshtein edit distance for misspelled queries (e.g. "tshrt", "watche")
 * - Multi-word tokenization and weighted relevance scoring
 */

import type { Product, OrderRecord } from "@/types";
import type { CustomSection } from "@/context/CustomSectionsContext";

// ── 1. TEXT NORMALIZATION ────────────────────────────────────────────────────

/**
 * Strips all non-alphanumeric characters, converts to lowercase, and collapses spaces.
 * Example: "T-Shirts / Tops" -> "t shirts tops"
 */
export function normalizeSearchText(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Strips all spaces and punctuation completely for exact contiguous token comparisons.
 * Example: "T-Shirt" -> "tshirt", "Off-White" -> "offwhite", "Rose-Gold" -> "rosegold"
 */
export function stripToAlphaNumeric(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// ── 2. PLURAL / SINGULAR STEMMING ─────────────────────────────────────────────

/**
 * Basic English stemmer for e-commerce terms.
 * Handles plurals: 'ies' -> 'y', 'es' -> '', 's' -> ''
 */
export function stemWord(word: string): string {
  if (!word || word.length <= 3) return word;
  const w = word.toLowerCase();

  if (w.endsWith("ies") && w.length > 4) {
    return w.slice(0, -3) + "y";
  }
  if (w.endsWith("watches")) {
    return "watch";
  }
  if (w.endsWith("es") && (w.endsWith("shes") || w.endsWith("ches") || w.endsWith("xes"))) {
    return w.slice(0, -2);
  }
  if (w.endsWith("s") && !w.endsWith("ss")) {
    return w.slice(0, -1);
  }
  return w;
}

// ── 3. E-COMMERCE SYNONYM EXPANSION ───────────────────────────────────────────

const SYNONYM_GROUPS: string[][] = [
  // T-shirts & Tops
  [
    "tshirt",
    "tshirts",
    "t shirt",
    "t shirts",
    "tee",
    "tees",
    "t-shirt",
    "t-shirts",
    "top",
    "tops",
    "oversized tee",
    "heavyweight tee",
  ],
  // Footwear & Shoes
  [
    "shoe",
    "shoes",
    "footwear",
    "sneaker",
    "sneakers",
    "runner",
    "runners",
    "court",
    "kicks",
    "trainer",
    "trainers",
  ],
  // Watches & Horology
  [
    "watch",
    "watches",
    "timepiece",
    "timepieces",
    "chrono",
    "chronograph",
    "automatic",
    "quartz",
    "dial",
    "wristwatch",
  ],
  // Colors & Styles
  ["black", "noir", "stealth", "core black", "charcoal"],
  ["white", "triple white", "off white", "off-white", "cream"],
  ["grey", "gray", "mist", "fog", "slate"],
  ["gold", "rose gold", "rosegold", "rose-gold", "brass"],
  ["silver", "steel", "stainless steel"],
  ["oversize", "oversized", "baggy", "relaxed", "drop shoulder"],
  ["graphic", "print", "printed", "typography", "artwork"],
];

/**
 * Returns all synonym terms associated with a given search word.
 */
export function getSynonymsForWord(word: string): string[] {
  const clean = stripToAlphaNumeric(word);
  const stemmed = stemWord(clean);
  const matched = new Set<string>();

  for (const group of SYNONYM_GROUPS) {
    const groupMatches = group.some((term) => {
      const cleanTerm = stripToAlphaNumeric(term);
      return cleanTerm === clean || cleanTerm === stemmed || stemWord(cleanTerm) === stemmed;
    });

    if (groupMatches) {
      for (const t of group) {
        matched.add(t);
        matched.add(stripToAlphaNumeric(t));
      }
    }
  }

  return Array.from(matched);
}

// ── 4. LEVENSHTEIN FUZZY DISTANCE ─────────────────────────────────────────────

/**
 * Computes Levenshtein edit distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], row[j], prev) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }

  return row[b.length];
}

/**
 * Checks if query word fuzzy-matches target word with allowed typo tolerance.
 */
export function isFuzzyMatch(queryWord: string, targetWord: string): boolean {
  if (queryWord === targetWord) return true;
  if (targetWord.includes(queryWord) || queryWord.includes(targetWord)) return true;

  const maxDist = queryWord.length >= 7 ? 2 : queryWord.length >= 4 ? 1 : 0;
  if (maxDist === 0) return false;

  // Compare both raw and stemmed forms
  const dist = levenshteinDistance(queryWord, targetWord);
  if (dist <= maxDist) return true;

  const stemDist = levenshteinDistance(stemWord(queryWord), stemWord(targetWord));
  return stemDist <= maxDist;
}

// ── 5. PRODUCT SEARCH SCORING ────────────────────────────────────────────────

export interface ProductMatchResult {
  product: Product;
  score: number;
}

/**
 * Evaluates how well a single product matches a query, returning a relevance score.
 */
export function evaluateProductMatch(product: Product, rawQuery: string): number {
  const query = rawQuery.trim();
  if (!query) return 0;

  const cleanQuery = normalizeSearchText(query);
  const strippedQuery = stripToAlphaNumeric(query);
  const queryWords = cleanQuery.split(/\s+/).filter(Boolean);
  if (queryWords.length === 0) return 0;

  let score = 0;

  // Prepare product searchable fields
  const name = product.name.toLowerCase();
  const cleanName = normalizeSearchText(product.name);
  const strippedName = stripToAlphaNumeric(product.name);

  const category = (product.category || "").toLowerCase();
  const subcategory = (product.subcategory || "").toLowerCase();
  const subcategoryTag = (product.subcategoryTag || "").toLowerCase();
  const cleanSubcat = normalizeSearchText(product.subcategory);
  const strippedSubcat = stripToAlphaNumeric(product.subcategory);

  const fit = (product.fit || "").toLowerCase();
  const color = (product.colorName || "").toLowerCase();
  const material = (product.material || "").toLowerCase();
  const sku = (product.sku || "").toLowerCase();
  const id = (product.id || "").toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase());
  const cleanTags = tags.map(normalizeSearchText);
  const strippedTags = tags.map(stripToAlphaNumeric);

  // 1. Exact phrase / title matches (Highest priority)
  if (name === cleanQuery || strippedName === strippedQuery) {
    score += 400;
  } else if (name.startsWith(cleanQuery)) {
    score += 250;
  } else if (name.includes(cleanQuery) || (cleanQuery.length > 2 && strippedName.includes(strippedQuery))) {
    score += 180;
  }

  // 2. Exact or stripped category / subcategory match
  if (strippedSubcat === strippedQuery || cleanSubcat === cleanQuery) {
    score += 220;
  } else if (
    (strippedQuery.length > 2 && strippedSubcat.includes(strippedQuery)) ||
    (strippedSubcat.length > 2 && strippedQuery.includes(strippedSubcat))
  ) {
    score += 160;
  }

  if (category === cleanQuery || stripToAlphaNumeric(category) === strippedQuery) {
    score += 140;
  }

  if (sku === cleanQuery || id === cleanQuery) {
    score += 300;
  }

  // 3. Whole-query synonym evaluation (e.g. "t-shirt" or "tshirt" matching "tee")
  const fullQuerySynonyms = getSynonymsForWord(strippedQuery);
  for (const syn of fullQuerySynonyms) {
    const strippedSyn = stripToAlphaNumeric(syn);
    if (name.includes(syn) || strippedName.includes(strippedSyn)) {
      score += 120;
    }
    if (cleanSubcat.includes(syn) || strippedSubcat.includes(strippedSyn)) {
      score += 140;
    }
    if (cleanTags.some((t) => t.includes(syn)) || strippedTags.some((t) => t.includes(strippedSyn))) {
      score += 90;
    }
  }

  // 4. Multi-word & Individual Token Evaluation
  let matchedWordsCount = 0;

  for (const qWord of queryWords) {
    // Prevent single-character fragments (like 't' in 't-shirt') from matching every product with letter 't'
    if (qWord.length <= 1 && queryWords.length > 1) {
      continue;
    }

    const strippedQWord = stripToAlphaNumeric(qWord);
    const stemmedQWord = stemWord(strippedQWord);
    const synonyms = getSynonymsForWord(qWord);
    let wordMatched = false;

    // Direct matches in product fields
    if (name.includes(qWord) || (strippedQWord.length > 2 && strippedName.includes(strippedQWord))) {
      score += 70;
      wordMatched = true;
    }
    if (
      cleanSubcat.includes(qWord) ||
      (strippedQWord.length > 2 && strippedSubcat.includes(strippedQWord)) ||
      (stemmedQWord.length > 2 && strippedSubcat.includes(stemmedQWord))
    ) {
      score += 65;
      wordMatched = true;
    }
    if (subcategoryTag.includes(qWord)) {
      score += 45;
      wordMatched = true;
    }
    if (category.includes(qWord)) {
      score += 35;
      wordMatched = true;
    }
    if (color.includes(qWord)) {
      score += 30;
      wordMatched = true;
    }
    if (fit && fit.includes(qWord)) {
      score += 35;
      wordMatched = true;
    }
    if (material.includes(qWord)) {
      score += 20;
      wordMatched = true;
    }
    if (cleanTags.some((t) => t.includes(qWord)) || strippedTags.some((t) => t.includes(strippedQWord))) {
      score += 40;
      wordMatched = true;
    }
    if (sku.includes(qWord) || id.includes(qWord)) {
      score += 50;
      wordMatched = true;
    }

    // Synonym matches
    for (const syn of synonyms) {
      const strippedSyn = stripToAlphaNumeric(syn);
      if (name.includes(syn) || strippedName.includes(strippedSyn)) {
        score += 55;
        wordMatched = true;
      }
      if (cleanSubcat.includes(syn) || strippedSubcat.includes(strippedSyn)) {
        score += 60;
        wordMatched = true;
      }
      if (cleanTags.some((t) => t.includes(syn)) || strippedTags.some((t) => t.includes(strippedSyn))) {
        score += 45;
        wordMatched = true;
      }
    }

    // Fuzzy matching for typos (e.g. "tshrt", "watche", "sneker")
    if (!wordMatched && qWord.length >= 4) {
      const nameWords = cleanName.split(/\s+/);
      const isFuzzyInName = nameWords.some((nw) => isFuzzyMatch(qWord, nw));
      if (isFuzzyInName) {
        score += 35;
        wordMatched = true;
      }

      if (isFuzzyMatch(qWord, cleanSubcat)) {
        score += 40;
        wordMatched = true;
      }

      const isFuzzyInTag = cleanTags.some((t) => isFuzzyMatch(qWord, t));
      if (isFuzzyInTag) {
        score += 30;
        wordMatched = true;
      }
    }

    if (wordMatched) {
      matchedWordsCount++;
    }
  }

  // Bonus for matching all words in multi-word queries (e.g. "oversized tee", "white sneaker")
  if (queryWords.length > 1 && matchedWordsCount === queryWords.length) {
    score += 100;
  }

  return score;
}

/**
 * Searches and ranks products by query, returning matching products sorted by relevance.
 */
export function searchProducts(
  products: Product[],
  query: string,
  limit?: number
): Product[] {
  if (!query || !query.trim()) return [];

  const scored: ProductMatchResult[] = [];

  for (const product of products) {
    const score = evaluateProductMatch(product, query);
    if (score > 0) {
      scored.push({ product, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  const results = scored.map((item) => item.product);
  return typeof limit === "number" ? results.slice(0, limit) : results;
}

// ── 6. TOP PRODUCT (ADMIN LEADERBOARD) SEARCH ─────────────────────────────────

export interface TopProductSearchItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  slug?: string;
}

/**
 * Searches TopProductItem records in admin leaderboard with synonym & hyphen normalization.
 */
export function searchTopProducts<T extends TopProductSearchItem>(
  products: T[],
  query: string
): T[] {
  const q = query.trim();
  if (!q) return products;

  const cleanQuery = normalizeSearchText(q);
  const strippedQuery = stripToAlphaNumeric(q);
  const synonyms = getSynonymsForWord(q);

  return products.filter((p) => {
    const name = p.name.toLowerCase();
    const cleanName = normalizeSearchText(p.name);
    const strippedName = stripToAlphaNumeric(p.name);
    const sku = (p.sku || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    const strippedCategory = stripToAlphaNumeric(p.category);

    // Direct / normalized match
    if (
      name.includes(cleanQuery) ||
      strippedName.includes(strippedQuery) ||
      sku.includes(cleanQuery) ||
      category.includes(cleanQuery) ||
      strippedCategory.includes(strippedQuery)
    ) {
      return true;
    }

    // Synonym match (e.g. "tshirt" matches category "T-Shirts" or item "Tee")
    for (const syn of synonyms) {
      const strippedSyn = stripToAlphaNumeric(syn);
      if (
        name.includes(syn) ||
        strippedName.includes(strippedSyn) ||
        category.includes(syn) ||
        strippedCategory.includes(strippedSyn)
      ) {
        return true;
      }
    }

    // Fuzzy check for typos
    if (q.length >= 4) {
      if (isFuzzyMatch(q, cleanName) || isFuzzyMatch(q, category)) {
        return true;
      }
    }

    return false;
  });
}

// ── 7. ORDER RECORD SEARCH ───────────────────────────────────────────────────

/**
 * Searches OrderRecord items in Admin & Customer order lists.
 * Matches: Order ID, customer name, phone, address, status, item names (with synonyms & normalization).
 */
export function searchOrders(orders: OrderRecord[], query: string): OrderRecord[] {
  const q = query.trim();
  if (!q) return orders;

  const cleanQuery = normalizeSearchText(q);
  const strippedQuery = stripToAlphaNumeric(q);
  const synonyms = getSynonymsForWord(q);

  return orders.filter((o) => {
    // 1. Order ID
    if (
      o.id.toLowerCase().includes(cleanQuery) ||
      stripToAlphaNumeric(o.id).includes(strippedQuery)
    ) {
      return true;
    }

    // 2. Customer Name
    const customerName = o.shippingAddress?.name?.toLowerCase() || "";
    if (
      customerName.includes(cleanQuery) ||
      stripToAlphaNumeric(customerName).includes(strippedQuery)
    ) {
      return true;
    }

    // 3. Status
    const status = (o.status || "").toLowerCase();
    if (status.includes(cleanQuery)) {
      return true;
    }

    // 4. Phone & Address
    const phone = o.shippingAddress?.phone || "";
    if (phone.includes(q)) {
      return true;
    }
    const address = (o.shippingAddress?.address || "").toLowerCase();
    if (address.includes(cleanQuery)) {
      return true;
    }

    // 5. Line Items (with product names and synonyms)
    const itemsMatch = o.items?.some((it) => {
      const pName = it.productName.toLowerCase();
      const strippedPName = stripToAlphaNumeric(it.productName);
      const color = (it.colorName || "").toLowerCase();

      if (
        pName.includes(cleanQuery) ||
        strippedPName.includes(strippedQuery) ||
        color.includes(cleanQuery)
      ) {
        return true;
      }

      // Check synonyms on order line items
      for (const syn of synonyms) {
        if (pName.includes(syn) || strippedPName.includes(stripToAlphaNumeric(syn))) {
          return true;
        }
      }

      return false;
    });

    if (itemsMatch) return true;

    return false;
  });
}

// ── 8. UNIFIED CATALOG & CUSTOM SECTIONS AGGREGATOR ─────────────────────────

/**
 * Dynamically transforms and merges Custom Section products with standard catalogue products
 * into a single unified searchable Product pool in real time.
 */
export function getUnifiedSearchableProducts(
  products: Product[],
  sections: CustomSection[]
): Product[] {
  if (!sections || sections.length === 0) return products;

  const customProducts: Product[] = [];

  for (const sec of sections) {
    if (!sec.isActive && sec.isActive !== undefined) continue;

    for (const found of sec.products || []) {
      const discountPercent =
        found.originalPrice && found.originalPrice > found.price
          ? Math.round(((found.originalPrice - found.price) / found.originalPrice) * 100)
          : null;

      customProducts.push({
        id: found.id,
        sku: `VEY-CUST-${found.id.toUpperCase()}`,
        slug: found.slug,
        name: found.name,
        category: sec.name,
        subcategory: sec.name,
        subcategoryTag: found.tags?.[0] || sec.name,
        fit: undefined,
        colorName: found.colorName || "Default",
        colorHex: found.colorHex || "#111111",
        material: found.material || "Premium Crafted",
        price: found.price,
        originalPrice: found.originalPrice,
        discount: discountPercent ? `${discountPercent}% OFF` : undefined,
        imageUrl: found.imageUrl,
        secondaryImageUrl: found.secondaryImageUrl || found.imageUrl,
        galleryImages: found.galleryImages || [],
        badge: (found.badge || "NEW") as Product["badge"],
        sizes: found.sizes || [],
        isNewArrival: false,
        inStock: found.inStock,
        shortDescription: found.description || found.name,
        longDescription: found.description,
        features: found.tags || [],
        care: [],
        collections: [sec.name],
        tags: [sec.name.toLowerCase(), ...(found.tags || []).map((t) => t.toLowerCase())],
        relatedProducts: [],
      });
    }
  }

  const existingIds = new Set(products.map((p) => p.id));
  const uniqueCustom = customProducts.filter((p) => !existingIds.has(p.id));

  return [...products, ...uniqueCustom];
}

// ── 9. CUSTOM SECTION SEARCH ──────────────────────────────────────────────────

/**
 * Searches custom sections by name, slug, and description with typo tolerance and synonyms.
 */
export function searchSections(
  sections: CustomSection[],
  query: string
): CustomSection[] {
  const q = query.trim();
  if (!q || !sections) return [];

  const cleanQuery = normalizeSearchText(q);
  const strippedQuery = stripToAlphaNumeric(q);
  const synonyms = getSynonymsForWord(q);

  return sections.filter((sec) => {
    if (!sec.isActive && sec.isActive !== undefined) return false;

    const cleanName = normalizeSearchText(sec.name);
    const strippedName = stripToAlphaNumeric(sec.name);
    const cleanDesc = normalizeSearchText(sec.description);
    const slug = sec.slug.toLowerCase();

    // Direct / stripped matches
    if (
      cleanName.includes(cleanQuery) ||
      strippedName.includes(strippedQuery) ||
      slug.includes(cleanQuery) ||
      cleanDesc.includes(cleanQuery)
    ) {
      return true;
    }

    // Synonym match
    for (const syn of synonyms) {
      const strippedSyn = stripToAlphaNumeric(syn);
      if (
        cleanName.includes(syn) ||
        strippedName.includes(strippedSyn) ||
        slug.includes(syn)
      ) {
        return true;
      }
    }

    // Fuzzy check for typos
    if (q.length >= 4) {
      if (isFuzzyMatch(q, cleanName) || isFuzzyMatch(q, slug)) {
        return true;
      }
    }

    return false;
  });
}

