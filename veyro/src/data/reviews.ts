import { Review, ReviewStats } from "@/types";

// ────────────────────────────────────────────────────────────────────────────
// VEYRO CURATED PRODUCT REVIEWS SEED DATA
// Authentic, text-only editorial customer reviews for luxury streetwear & footwear
// ────────────────────────────────────────────────────────────────────────────

export const SEED_REVIEWS: Record<string, Review[]> = {
  // 1. Lunar Wolf Oversized Tee
  "vey-tsh-ovr-001": [
    {
      id: "rev-tsh-001-1",
      productId: "vey-tsh-ovr-001",
      author: "Arjun Mehta",
      rating: 5,
      title: "Substantial 240gsm drape — the collar construction is elite",
      content:
        "Easily the best heavyweight tee in my wardrobe. Most streetwear brands claim 240gsm but this fabric genuinely holds its architectural silhouette after four cold washes. The rib collar does not bacon at all. Go true to size if you want the intended boxy oversized drape.",
      date: "2026-03-04",
      verified: true,
      fit: "True to Size",
      sizePurchased: "L",
      helpfulCount: 34,
      unhelpfulCount: 1,
    },
    {
      id: "rev-tsh-001-2",
      productId: "vey-tsh-ovr-001",
      author: "Devang R.",
      rating: 5,
      title: "Screen print quality and pigment wash feel like Tokyo archival pieces",
      content:
        "The Lunar graphic has zero rubbery sheen — it is soft to the touch and breathable. Shoulder drop is balanced without looking sloppy. Paired with wide-leg cargo pants, the silhouette is unmatched.",
      date: "2026-02-18",
      verified: true,
      fit: "True to Size",
      sizePurchased: "XL",
      helpfulCount: 19,
      unhelpfulCount: 0,
    },
    {
      id: "rev-tsh-001-3",
      productId: "vey-tsh-ovr-001",
      author: "Karan Singhal",
      rating: 4,
      title: "Premium luxury weight, runs slightly generous",
      content:
        "Quality is 10/10. If you prefer a slightly neater oversized cut rather than exaggerated streetwear drop shoulders, I’d suggest sizing down one notch. The combed cotton feels very soft against the skin.",
      date: "2026-01-29",
      verified: true,
      fit: "Runs Large",
      sizePurchased: "M",
      helpfulCount: 12,
      unhelpfulCount: 2,
    },
    {
      id: "rev-tsh-001-4",
      productId: "vey-tsh-ovr-001",
      author: "Nikhil Varma",
      rating: 5,
      title: "Holds shape better than imported blanks",
      content:
        "I was skeptical about local streetwear brands matching Japanese loopwheel or heavy Portuguese cotton, but Veyro nailed the tension in this weave. Zero shrinkage on line-dry.",
      date: "2025-12-14",
      verified: true,
      fit: "True to Size",
      sizePurchased: "L",
      helpfulCount: 8,
      unhelpfulCount: 0,
    },
    {
      id: "rev-tsh-001-5",
      productId: "vey-tsh-ovr-001",
      author: "Sameer Joshi",
      rating: 4,
      title: "Great heft and clean hemline",
      content:
        "Solid structured weight. The hem rests cleanly without flaring outward. Would love to see this exact cut in washed olive or vintage stone.",
      date: "2025-11-20",
      verified: true,
      fit: "True to Size",
      sizePurchased: "M",
      helpfulCount: 5,
      unhelpfulCount: 1,
    },
    {
      id: "rev-tsh-001-6",
      productId: "vey-tsh-ovr-001",
      author: "Tarun B.",
      rating: 3,
      title: "Heavy fabric, might be warm in peak summer",
      content:
        "The craftsmanship is undeniable and stitch tension is remarkable. Keep in mind this is true 240gsm heavyweight cotton, so it is substantial. Perfect for evening or air-conditioned spaces, slightly warm for humid afternoon walks.",
      date: "2025-10-08",
      verified: true,
      fit: "True to Size",
      sizePurchased: "L",
      helpfulCount: 7,
      unhelpfulCount: 2,
    },
  ],

  // 2. Apex Runner / Sneaker 1
  "vey-ftw-min-001": [
    {
      id: "rev-ftw-001-1",
      productId: "vey-ftw-min-001",
      author: "Rohan Mukherjee",
      rating: 5,
      title: "Incredible cushioning balance and supple calfskin lining",
      content:
        "The vulcanized foxing tape and gum outsole have zero stiffness out of the box. Wore these across Mumbai for 14,000 steps on day one without blisters. Suede texture feels ultra-premium and brushes out easily.",
      date: "2026-03-01",
      verified: true,
      fit: "True to Size",
      sizePurchased: "UK 9",
      helpfulCount: 42,
      unhelpfulCount: 1,
    },
    {
      id: "rev-ftw-001-2",
      productId: "vey-ftw-min-001",
      author: "Kabir Dewan",
      rating: 5,
      title: "The toe taper and sole profile look unbelievable with relaxed denim",
      content:
        "Arch cushioning is noticeably superior to standard canvas vulcanized kicks. The low-profile toe taper doesn’t look clownish or overly bulky. Clean minimal branding done right.",
      date: "2026-02-12",
      verified: true,
      fit: "True to Size",
      sizePurchased: "UK 8",
      helpfulCount: 28,
      unhelpfulCount: 0,
    },
    {
      id: "rev-ftw-001-3",
      productId: "vey-ftw-min-001",
      author: "Aditya Roy",
      rating: 4,
      title: "Luxury minimal aesthetic, snug around midfoot first day",
      content:
        "Took about half a day of break-in around the inner arch. Once the memory-foam footbed shaped to my feet, they felt like gloves. Finish and leather edges are pristine.",
      date: "2026-01-15",
      verified: true,
      fit: "Runs Small",
      sizePurchased: "UK 10",
      helpfulCount: 15,
      unhelpfulCount: 1,
    },
    {
      id: "rev-ftw-001-4",
      productId: "vey-ftw-min-001",
      author: "Siddharth Nair",
      rating: 5,
      title: "Rivals luxury Italian sneakers at 1/5th the price",
      content:
        "I own Common Projects and Oliver Cabell — the stitching density on this pair holds its ground remarkably well. The off-white sole tone is subtle and doesn’t look stark white.",
      date: "2025-12-28",
      verified: true,
      fit: "True to Size",
      sizePurchased: "UK 9",
      helpfulCount: 21,
      unhelpfulCount: 0,
    },
    {
      id: "rev-ftw-001-5",
      productId: "vey-ftw-min-001",
      author: "Zaid Qureshi",
      rating: 4,
      title: "Great street sneaker, recommend ankle socks",
      content:
        "Padded heel collar prevents heel slippage completely. Highly recommended for daily wear with cropped or wide trousers.",
      date: "2025-11-19",
      verified: true,
      fit: "True to Size",
      sizePurchased: "UK 8",
      helpfulCount: 9,
      unhelpfulCount: 1,
    },
  ],
};

// Realistic templates for dynamically generating cohesive, authentic reviews
// for any catalog SKU that does not yet have explicit seed items
const CLOTHING_REVIEW_TEMPLATES = [
  {
    author: "Vikram Sen",
    rating: 5,
    title: "Exceptional weight and drop shoulder silhouette",
    content:
      "The fabric feels ultra-dense yet breathable. The seam allowances and double-needle collar are built to withstand dozens of washes. Truly high-end streetwear engineering.",
    fit: "True to Size" as const,
    size: "L",
    daysAgo: 5,
    helpful: 24,
  },
  {
    author: "Pranav Rao",
    rating: 5,
    title: "Exactly what heavyweight cotton should feel like",
    content:
      "Drapes naturally without clinging. Colorfast dye has stayed deep black without fading. Worth every rupee.",
    fit: "True to Size" as const,
    size: "XL",
    daysAgo: 16,
    helpful: 18,
  },
  {
    author: "Aman Chopra",
    rating: 4,
    title: "Cut is intentionally relaxed and boxy",
    content:
      "Chest room is generous with a nice structured drape. If you like classic trim fits, size down. For modern oversized streetwear style, go true to size.",
    fit: "Runs Large" as const,
    size: "M",
    daysAgo: 32,
    helpful: 11,
  },
  {
    author: "Rishi Kapoor",
    rating: 5,
    title: "Subtle texture and sturdy collar line",
    content:
      "The neckline remains flat and rigid after wearing it through a full weekend festival. Clean minimalist design at its peak.",
    fit: "True to Size" as const,
    size: "L",
    daysAgo: 48,
    helpful: 7,
  },
  {
    author: "Harsh Vardhan",
    rating: 4,
    title: "Substantial piece for layering",
    content:
      "Layered this under an unbuttoned overshirt and the collar structure peeks out crisply. Premium cotton handfeel.",
    fit: "True to Size" as const,
    size: "M",
    daysAgo: 70,
    helpful: 4,
  },
  {
    author: "Gaurav S.",
    rating: 3,
    title: "Heavy knit, takes longer to dry",
    content:
      "Because of the 240gsm density, air-drying takes almost a day in rainy weather. But the construction is top notch and fabric is buttery soft.",
    fit: "True to Size" as const,
    size: "L",
    daysAgo: 95,
    helpful: 6,
  },
];

const FOOTWEAR_REVIEW_TEMPLATES = [
  {
    author: "Abhishek Bannerjee",
    rating: 5,
    title: "Outsole traction and footbed cushion are top tier",
    content:
      "Wore these for an entire city trip. Arch support is far more forgiving than flat vulcanized skate shoes. The suede finish resists scuffs well.",
    fit: "True to Size" as const,
    size: "UK 9",
    daysAgo: 8,
    helpful: 31,
  },
  {
    author: "Manish Tiwari",
    rating: 5,
    title: "Sleek low-profile shape that elevates any outfit",
    content:
      "The tongue doesn’t bite into the top of the foot and the eyelet reinforcement is solid. Looks great with cuffed raw denim.",
    fit: "True to Size" as const,
    size: "UK 8",
    daysAgo: 22,
    helpful: 20,
  },
  {
    author: "Raghav Menon",
    rating: 4,
    title: "Premium leather accents and solid heel lockdown",
    content:
      "Felt slightly snug across the instep for the first hour, but broke in effortlessly by the evening. True UK sneaker sizing.",
    fit: "Runs Small" as const,
    size: "UK 10",
    daysAgo: 40,
    helpful: 14,
  },
  {
    author: "Sanjay Dixit",
    rating: 5,
    title: "Super clean aesthetic without loud logos",
    content:
      "Finding minimal sneakers with good materials under 4k is rare. This hits the sweet spot between luxury presentation and daily utility.",
    fit: "True to Size" as const,
    size: "UK 9",
    daysAgo: 65,
    helpful: 9,
  },
  {
    author: "Kushagra Verma",
    rating: 4,
    title: "Solid vulcanized construction",
    content:
      "The foxing tape hasn’t separated even at the flex point. Very clean lines and supportive insole.",
    fit: "True to Size" as const,
    size: "UK 8",
    daysAgo: 88,
    helpful: 5,
  },
  {
    author: "Farhan A.",
    rating: 3,
    title: "Good comfort, slightly heavy sole",
    content:
      "Built like a tank. The sole has a little weight to it, but that also means the gum rubber won’t wear down in a couple of months.",
    fit: "True to Size" as const,
    size: "UK 9",
    daysAgo: 110,
    helpful: 8,
  },
];

/**
 * Generates an ISO date string for N days in the past
 */
function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

/**
 * Returns seed reviews for any given product ID, creating an authentic,
 * consistent set if not explicitly listed in SEED_REVIEWS.
 */
export function getSeedReviewsForProduct(productId: string): Review[] {
  if (SEED_REVIEWS[productId]) {
    return [...SEED_REVIEWS[productId]];
  }

  const isFootwear =
    productId.includes("ftw") ||
    productId.includes("shoe") ||
    productId.includes("sneaker");

  const templates = isFootwear
    ? FOOTWEAR_REVIEW_TEMPLATES
    : CLOTHING_REVIEW_TEMPLATES;

  return templates.map((tmpl, index) => ({
    id: `seed-${productId}-${index + 1}`,
    productId,
    author: tmpl.author,
    rating: tmpl.rating,
    title: tmpl.title,
    content: tmpl.content,
    date: getDateDaysAgo(tmpl.daysAgo),
    verified: true,
    fit: tmpl.fit,
    sizePurchased: tmpl.size,
    helpfulCount: tmpl.helpful,
    unhelpfulCount: index % 2 === 0 ? 0 : 1,
  }));
}

/**
 * Calculate all review stats and rating distribution from a list of reviews
 */
export function calculateReviewStats(reviews: Review[]): ReviewStats {
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 5.0,
      totalCount: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      recommendationPercentage: 100,
      fitBreakdown: { runsSmall: 0, trueToSize: 100, runsLarge: 0 },
    };
  }

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let ratingSum = 0;
  let recommendedCount = 0;

  const fitCounts = {
    runsSmall: 0,
    trueToSize: 0,
    runsLarge: 0,
  };

  reviews.forEach((r) => {
    const star = Math.min(Math.max(Math.round(r.rating), 1), 5) as 1 | 2 | 3 | 4 | 5;
    distribution[star] = (distribution[star] || 0) + 1;
    ratingSum += r.rating;

    // 4 and 5 stars are counted as recommending the product
    if (r.rating >= 4) {
      recommendedCount++;
    }

    if (r.fit === "Runs Small") fitCounts.runsSmall++;
    else if (r.fit === "Runs Large") fitCounts.runsLarge++;
    else fitCounts.trueToSize++;
  });

  const total = reviews.length;
  const averageRating = Math.round((ratingSum / total) * 10) / 10;
  const recommendationPercentage = Math.round((recommendedCount / total) * 100);

  return {
    averageRating,
    totalCount: total,
    distribution,
    recommendationPercentage,
    fitBreakdown: {
      runsSmall: Math.round((fitCounts.runsSmall / total) * 100),
      trueToSize: Math.round((fitCounts.trueToSize / total) * 100),
      runsLarge: Math.round((fitCounts.runsLarge / total) * 100),
    },
  };
}
