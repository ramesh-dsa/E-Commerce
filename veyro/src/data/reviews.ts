import { Review, ReviewStats } from "@/types";
import { getProductById, getProductBySlug } from "@/data/products";

// ────────────────────────────────────────────────────────────────────────────
// VEYRO CURATED PRODUCT REVIEWS SYSTEM
// Authentic, category-specific editorial customer reviews for:
// 1. Clothing (240gsm cotton, collar retention, drop-shoulder silhouette, boxy drape)
// 2. Footwear (vulcanized soles, suede/calfskin lining, arch cushioning, toe taper)
// 3. Watches  (316L finishing, sapphire AR clarity, calibre accuracy, bezel action)
//
// Each category features a realistic distribution spanning ALL 5 STAR RATINGS
// (5★, 4★, 3★, 2★, 1★) with an authentic overall rating ~4.1 Stars,
// genuine verified/community reviewer mix, and detailed feedback.
// ────────────────────────────────────────────────────────────────────────────

// Helper to generate past ISO date
function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

// ── 1. CLOTHING REVIEW TEMPLATES (13 Items spanning 5★ to 1★) ───────────────
export const CLOTHING_REVIEW_TEMPLATES = [
  {
    author: "Arjun Mehta",
    rating: 5,
    title: "Substantial 240gsm drape — the collar construction is elite",
    content:
      "Easily the best heavyweight tee in my wardrobe. Most streetwear brands claim 240gsm but this fabric genuinely holds its architectural silhouette after four cold washes. The rib collar does not bacon at all. Go true to size if you want the intended boxy oversized drape.",
    fit: "True to Size" as const,
    size: "L",
    daysAgo: 4,
    helpful: 34,
    verified: true,
  },
  {
    author: "Devang R.",
    rating: 5,
    title: "Screen print quality and pigment wash feel like Tokyo archival pieces",
    content:
      "The graphic has zero rubbery sheen — it is soft to the touch and breathable. Shoulder drop is balanced without looking sloppy. Paired with wide-leg cargo pants, the silhouette is unmatched.",
    fit: "True to Size" as const,
    size: "XL",
    daysAgo: 14,
    helpful: 22,
    verified: true,
  },
  {
    author: "Nikhil Varma",
    rating: 5,
    title: "Holds shape better than imported heavyweight blanks",
    content:
      "I was skeptical about local streetwear brands matching Japanese loopwheel or heavy Portuguese cotton, but Veyro nailed the tension in this weave. Zero shrinkage on line-dry.",
    fit: "True to Size" as const,
    size: "L",
    daysAgo: 24,
    helpful: 18,
    verified: false,
  },
  {
    author: "Sameer Joshi",
    rating: 5,
    title: "Great structured heft and clean hemline",
    content:
      "Solid structured weight. The hem rests cleanly without flaring outward. Looks immaculate paired with loose carpenter trousers or pleated shorts.",
    fit: "True to Size" as const,
    size: "M",
    daysAgo: 38,
    helpful: 15,
    verified: true,
  },
  {
    author: "Kabir Sen",
    rating: 5,
    title: "Bio-wash finish eliminates scratchiness completely",
    content:
      "Sometimes dense 240gsm jersey can feel stiff like cardboard on the first wear, but this combed cotton feels broken-in from minute one. Super soft against bare skin.",
    fit: "True to Size" as const,
    size: "L",
    daysAgo: 50,
    helpful: 11,
    verified: false,
  },
  {
    author: "Rohan Dasgupta",
    rating: 5,
    title: "Collar stays flat under layered overshirts",
    content:
      "The neckline rib is thick and snug without choking. Doesn't sag after taking it on and off multiple times. Excellent investment piece.",
    fit: "True to Size" as const,
    size: "XL",
    daysAgo: 65,
    helpful: 9,
    verified: true,
  },
  {
    author: "Varun Seth",
    rating: 5,
    title: "Deep rich dye that doesn't bleed in cold wash",
    content:
      "Washed three times with cold water — zero color bleed onto other garments and the blacks stay ink-dark. Double-needle hems are rock solid.",
    fit: "True to Size" as const,
    size: "M",
    daysAgo: 82,
    helpful: 7,
    verified: false,
  },
  {
    author: "Karan Singhal",
    rating: 4,
    title: "Premium luxury weight, runs slightly generous",
    content:
      "Quality is 10/10. If you prefer a slightly neater oversized cut rather than exaggerated streetwear drop shoulders, I’d suggest sizing down one notch. The combed cotton feels very soft against the skin.",
    fit: "Runs Large" as const,
    size: "M",
    daysAgo: 92,
    helpful: 14,
    verified: false,
  },
  {
    author: "Harsh Vardhan",
    rating: 4,
    title: "Substantial piece for layering, sleeve length is generous",
    content:
      "Layered this under an unbuttoned overshirt and the collar structure peeks out crisply. Sleeves reach the elbow which looks great, just keep in mind for tighter jackets.",
    fit: "True to Size" as const,
    size: "M",
    daysAgo: 105,
    helpful: 10,
    verified: true,
  },
  {
    author: "Rishi Kapoor",
    rating: 4,
    title: "Crisp stitching, slightly boxier chest than standard tees",
    content:
      "The chest width allows ample airflow despite the heavy knit. Modern boxy cut that flatters athletic builds, but check the size chart if you are between sizes.",
    fit: "Runs Large" as const,
    size: "L",
    daysAgo: 118,
    helpful: 6,
    verified: false,
  },
  {
    author: "Tarun B.",
    rating: 3,
    title: "Heavy fabric, takes longer to dry in humid weather",
    content:
      "The craftsmanship is undeniable and stitch tension is remarkable. Keep in mind this is true 240gsm heavyweight cotton, so it is substantial. Perfect for evening or air-conditioned spaces, slightly warm for humid afternoon walks.",
    fit: "True to Size" as const,
    size: "L",
    daysAgo: 130,
    helpful: 12,
    verified: false,
  },
  {
    author: "Gaurav S.",
    rating: 2,
    title: "Silhouette is too long if you are below 5'8\"",
    content:
      "Fabric quality and collar rib are easily a 5/5. However, the drop-shoulder hem falls past my mid-thigh as someone who is 5'7. Had to get it hemmed at my local tailor to achieve the cropped look.",
    fit: "Runs Large" as const,
    size: "M",
    daysAgo: 145,
    helpful: 16,
    verified: true,
  },
  {
    author: "Aman Chopra",
    rating: 1,
    title: "Neckline ribbing was too tight around the throat",
    content:
      "The cotton heft is impressive, but the crewneck collar opening is smaller and tighter than expected. It felt constricting around my throat throughout the workday. Wish it had a slightly more relaxed collar circumference.",
    fit: "Runs Small" as const,
    size: "L",
    daysAgo: 160,
    helpful: 9,
    verified: false,
  },
];

// ── 2. FOOTWEAR REVIEW TEMPLATES (13 Items spanning 5★ to 1★) ───────────────
export const FOOTWEAR_REVIEW_TEMPLATES = [
  {
    author: "Rohan Mukherjee",
    rating: 5,
    title: "Incredible cushioning balance and supple calfskin lining",
    content:
      "The vulcanized foxing tape and gum outsole have zero stiffness out of the box. Wore these across Mumbai for 14,000 steps on day one without blisters. Suede texture feels ultra-premium and brushes out easily.",
    fit: "True to Size" as const,
    size: "UK 9",
    daysAgo: 5,
    helpful: 42,
    verified: true,
  },
  {
    author: "Kabir Dewan",
    rating: 5,
    title: "The toe taper and sole profile look unbelievable with relaxed denim",
    content:
      "Arch cushioning is noticeably superior to standard canvas vulcanized kicks. The low-profile toe taper doesn’t look clownish or overly bulky. Clean minimal branding done right.",
    fit: "True to Size" as const,
    size: "UK 8",
    daysAgo: 16,
    helpful: 28,
    verified: false,
  },
  {
    author: "Siddharth Nair",
    rating: 5,
    title: "Rivals luxury Italian sneakers at 1/5th the price",
    content:
      "I own Common Projects and Oliver Cabell — the stitching density on this pair holds its ground remarkably well. The off-white sole tone is subtle and doesn’t look stark white.",
    fit: "True to Size" as const,
    size: "UK 9",
    daysAgo: 28,
    helpful: 25,
    verified: true,
  },
  {
    author: "Abhishek Bannerjee",
    rating: 5,
    title: "Outsole traction and footbed cushion are top tier",
    content:
      "Wore these for an entire weekend trip. Arch support is far more forgiving than flat skate shoes. The suede finish resists scuffs surprisingly well.",
    fit: "True to Size" as const,
    size: "UK 9",
    daysAgo: 42,
    helpful: 19,
    verified: false,
  },
  {
    author: "Sanjay Dixit",
    rating: 5,
    title: "Super clean aesthetic without loud logos",
    content:
      "Finding minimal sneakers with genuine full-grain leather and rubber soles under 5k is rare. Hits the exact sweet spot between luxury presentation and daily utility.",
    fit: "True to Size" as const,
    size: "UK 8",
    daysAgo: 56,
    helpful: 14,
    verified: true,
  },
  {
    author: "Manish Tiwari",
    rating: 5,
    title: "Padded tongue and reinforced eyelets feel indestructible",
    content:
      "Lacing locks down the midfoot securely without pinching the instep. The gum rubber sole provides tremendous wet-weather sidewalk grip.",
    fit: "True to Size" as const,
    size: "UK 10",
    daysAgo: 71,
    helpful: 11,
    verified: false,
  },
  {
    author: "Praneet Gill",
    rating: 5,
    title: "Odor-resistant insole and breathable lining",
    content:
      "Wore these for 10 hours straight on a flight and city commute. Feet stayed cool and sweat-free. Easily my favorite daily driver.",
    fit: "True to Size" as const,
    size: "UK 9",
    daysAgo: 84,
    helpful: 8,
    verified: true,
  },
  {
    author: "Zaid Qureshi",
    rating: 4,
    title: "Great street sneaker, recommend pairing with ankle socks",
    content:
      "Padded heel collar prevents heel slippage completely. Highly recommended for daily wear with cropped trousers or wide carpenter denim.",
    fit: "True to Size" as const,
    size: "UK 8",
    daysAgo: 98,
    helpful: 12,
    verified: false,
  },
  {
    author: "Kushagra Verma",
    rating: 4,
    title: "Solid vulcanized construction, slight initial break-in",
    content:
      "The foxing tape hasn’t separated even at the heavy flex point. Inner arch felt a bit stiff for the first couple of hours, but broke in comfortably by day two.",
    fit: "True to Size" as const,
    size: "UK 8",
    daysAgo: 110,
    helpful: 10,
    verified: true,
  },
  {
    author: "Raghav Menon",
    rating: 4,
    title: "Supple leather accents, snug across the midfoot instep",
    content:
      "Quality is top tier. Felt slightly tight across the inner bridge on the first day, but softened up noticeably after a few miles. True UK sizing.",
    fit: "Runs Small" as const,
    size: "UK 10",
    daysAgo: 124,
    helpful: 7,
    verified: false,
  },
  {
    author: "Farhan A.",
    rating: 3,
    title: "Built like a tank, but the gum sole has noticeable heft",
    content:
      "The gum rubber sole will undoubtedly last for years without wearing thin, but it has noticeable weight compared to modern running trainers. Great for aesthetic street style, not for sprints.",
    fit: "True to Size" as const,
    size: "UK 9",
    daysAgo: 138,
    helpful: 15,
    verified: false,
  },
  {
    author: "Aditya Roy",
    rating: 2,
    title: "Toe box is slightly tapered for wider feet",
    content:
      "Craftsmanship is impeccable, but if you have wider feet (2E width), the outer toe taper compresses the pinky toe. I should have ordered UK 10 instead of my usual UK 9.",
    fit: "Runs Small" as const,
    size: "UK 9",
    daysAgo: 152,
    helpful: 18,
    verified: true,
  },
  {
    author: "Ankit Srivastava",
    rating: 1,
    title: "Heel collar rubbed against my Achilles tendon",
    content:
      "The rear heel cup has a firm structural counter that rubbed raw against my Achilles tendon when wearing low cut socks. You definitely need thick crew socks until the heel counter softens.",
    fit: "Runs Large" as const,
    size: "UK 9",
    daysAgo: 165,
    helpful: 11,
    verified: false,
  },
];

// ── 3. WATCH REVIEW TEMPLATES (13 Items spanning 5★ to 1★) ───────────────────
export const WATCH_REVIEW_TEMPLATES = [
  {
    author: "Adhiraj Roy",
    rating: 5,
    title: "Exquisite 316L finishing and pristine dial symmetry",
    content:
      "The vertical brushing on the case flanks paired with mirror-polished chamfers looks on par with Swiss pieces triple the price. The dial has incredible depth under indoor lighting.",
    fit: "True to Size" as const,
    size: "42mm Case",
    daysAgo: 4,
    helpful: 38,
    verified: true,
  },
  {
    author: "Pranav Kulkarni",
    rating: 5,
    title: "Movement is remarkably accurate at +4s/day",
    content:
      "Tested on my timegrapher over 72 hours: averaged +4 seconds per day with zero beat error. The winding rotor is quiet and the tactile click of the crown feels extremely satisfying.",
    fit: "True to Size" as const,
    size: "40mm Case",
    daysAgo: 15,
    helpful: 27,
    verified: false,
  },
  {
    author: "Vikram Singhania",
    rating: 5,
    title: "Sapphire crystal clarity with inner anti-reflective coating",
    content:
      "Zero distortion at oblique viewing angles. The double-domed sapphire with AR coating gives the dial an inky, floating appearance. Gets constant compliments at dinner.",
    fit: "True to Size" as const,
    size: "42mm Case",
    daysAgo: 29,
    helpful: 24,
    verified: true,
  },
  {
    author: "Shray Malhotra",
    rating: 5,
    title: "Solid end links and supple milled clasp",
    content:
      "The stainless steel bracelet articulates smoothly around the wrist without pulling arm hair. Weight is balanced nicely so the watch doesn't roll to the side.",
    fit: "True to Size" as const,
    size: "40mm Case",
    daysAgo: 44,
    helpful: 19,
    verified: false,
  },
  {
    author: "Devrat Patel",
    rating: 5,
    title: "Dial texture and handset proportions are perfection",
    content:
      "The applied faceted indices catch even faint ambient light. Hand lengths are correct — the second hand reaches all the way to the outer minute track.",
    fit: "True to Size" as const,
    size: "42mm Case",
    daysAgo: 58,
    helpful: 14,
    verified: true,
  },
  {
    author: "Yashovardhan Rao",
    rating: 5,
    title: "Genuine leather strap is supple with zero break-in period",
    content:
      "Often factory leather straps are stiff and plasticky, but this strap is supple full-grain hide with clean perimeter stitching. Hugs the wrist comfortably.",
    fit: "True to Size" as const,
    size: "40mm Case",
    daysAgo: 73,
    helpful: 11,
    verified: false,
  },
  {
    author: "Chirag Shah",
    rating: 5,
    title: "Water resistance tested, crown screws down with confidence",
    content:
      "The crown action is crisp, firm, and threads cleanly without cross-threading. Wore it swimming with zero moisture ingress under the crystal.",
    fit: "True to Size" as const,
    size: "42mm Case",
    daysAgo: 88,
    helpful: 9,
    verified: true,
  },
  {
    author: "Rustom Wadia",
    rating: 4,
    title: "Stunning vintage proportions, wish it had micro-adjustments",
    content:
      "Case diameter and thickness are slim enough to slide under buttoned dress cuffs. The butterfly clasp is sleek, but lacks on-the-fly micro-adjustment for humid summer days.",
    fit: "True to Size" as const,
    size: "40mm Case",
    daysAgo: 102,
    helpful: 16,
    verified: false,
  },
  {
    author: "Siddhant Roy",
    rating: 4,
    title: "Impressive case finishing, date window numeral is slightly small",
    content:
      "The sunburst dial and razor-sharp bevels punch way above its weight class. Only minor critique is the date aperture font is on the smaller side for quick glancing.",
    fit: "True to Size" as const,
    size: "42mm Case",
    daysAgo: 115,
    helpful: 12,
    verified: true,
  },
  {
    author: "Alok Sengupta",
    rating: 4,
    title: "Hefty solid feel, wears slightly larger than 40mm",
    content:
      "Because of the straight lug architecture, the lug-to-lug span makes it wear closer to a 41mm. For 7-inch wrists it looks commanding and athletic.",
    fit: "Runs Large" as const,
    size: "40mm Case",
    daysAgo: 128,
    helpful: 8,
    verified: false,
  },
  {
    author: "Raghavendra S.",
    rating: 3,
    title: "Impressive watch, but lug overhang on smaller wrists",
    content:
      "The dial depth and movement execution are superb. However, on my 6.25-inch wrist, the long lugs extend slightly beyond my wrist flat. Best suited for wrists 6.75 inches and above.",
    fit: "Runs Large" as const,
    size: "42mm Case",
    daysAgo: 140,
    helpful: 13,
    verified: false,
  },
  {
    author: "Tanmay Joshi",
    rating: 2,
    title: "Bracelet pins are extremely stiff to remove",
    content:
      "The watch itself is gorgeous, but sizing the bracelet at home was a headache. The friction pins were pressed in so tightly that my standard pin pusher bent. Had to take it to a watchmaker.",
    fit: "True to Size" as const,
    size: "42mm Case",
    daysAgo: 155,
    helpful: 17,
    verified: true,
  },
  {
    author: "Kunal Sen",
    rating: 1,
    title: "Lume on the indices fades quicker than expected",
    content:
      "Daytime aesthetics are 10/10, but the luminescent paint on the hands and indices dims significantly after 15 minutes in total darkness. Expected stronger BGW9 or Super-LumiNova at this price tier.",
    fit: "True to Size" as const,
    size: "42mm Case",
    daysAgo: 170,
    helpful: 10,
    verified: false,
  },
];

// Helper to convert template array into Review objects
function buildReviewsFromTemplates(productId: string, templates: typeof CLOTHING_REVIEW_TEMPLATES): Review[] {
  return templates.map((tmpl, index) => ({
    id: `seed-${productId}-${index + 1}`,
    productId,
    author: tmpl.author,
    rating: tmpl.rating,
    title: tmpl.title,
    content: tmpl.content,
    date: getDateDaysAgo(tmpl.daysAgo),
    verified: tmpl.verified,
    fit: tmpl.fit,
    sizePurchased: tmpl.size,
    helpfulCount: tmpl.helpful,
    unhelpfulCount: index % 3 === 0 ? 1 : 0,
  }));
}

// ── Explicit Seed Reviews for flagship SKUs ──────────────────────────────────
export const SEED_REVIEWS: Record<string, Review[]> = {
  // 1. Lunar Wolf Oversized Tee (Clothing)
  "vey-tsh-ovr-001": buildReviewsFromTemplates("vey-tsh-ovr-001", CLOTHING_REVIEW_TEMPLATES),

  // 2. Apex Runner / Sneaker 1 (Footwear)
  "vey-ftw-min-001": buildReviewsFromTemplates("vey-ftw-min-001", FOOTWEAR_REVIEW_TEMPLATES),

  // 3. Aigner Blue Roman Dial (Watches)
  "vey-wat-chr-001": buildReviewsFromTemplates("vey-wat-chr-001", WATCH_REVIEW_TEMPLATES),
};

/**
 * Returns authentic, category-specific seed reviews for any product in the catalog.
 * Accurately detects Watches vs Footwear vs Clothing and includes mixed 1★-5★ ratings.
 */
export function getSeedReviewsForProduct(productId: string): Review[] {
  if (SEED_REVIEWS[productId]) {
    return [...SEED_REVIEWS[productId]];
  }

  const product = getProductById(productId) || getProductBySlug(productId);
  const category = (product?.category || "").toLowerCase();
  const subcategory = (product?.subcategory || "").toLowerCase();
  const idLower = productId.toLowerCase();

  const isWatch =
    category === "watches" ||
    subcategory.includes("watch") ||
    subcategory.includes("timepiece") ||
    idLower.includes("wat") ||
    idLower.includes("watch") ||
    idLower.includes("chrono") ||
    idLower.includes("diver") ||
    idLower.includes("seiko") ||
    idLower.includes("aigner") ||
    idLower.includes("titan") ||
    idLower.includes("cerruti") ||
    idLower.includes("milus") ||
    idLower.includes("ducati");

  const isFootwear =
    category === "footwear" ||
    subcategory.includes("shoe") ||
    subcategory.includes("footwear") ||
    subcategory.includes("sneaker") ||
    idLower.includes("ftw") ||
    idLower.includes("shoe") ||
    idLower.includes("sneaker") ||
    idLower.includes("runner");

  const templates = isWatch
    ? WATCH_REVIEW_TEMPLATES
    : isFootwear
    ? FOOTWEAR_REVIEW_TEMPLATES
    : CLOTHING_REVIEW_TEMPLATES;

  return buildReviewsFromTemplates(productId, templates);
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
