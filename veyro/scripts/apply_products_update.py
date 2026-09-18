import re

def update_products():
    with open('src/data/products.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Image mapping for T-shirts
    tee_mappings = {
        "vey-tsh-ovr-001": ("/products/tshirts/veyro-tee-01-primary.webp", "/products/tshirts/veyro-tee-01-hover.webp"),
        "vey-tsh-ovr-002": ("/products/tshirts/veyro-tee-02-primary.webp", "/products/tshirts/veyro-tee-02-hover.webp"),
        "vey-tsh-ovr-003": ("/products/tshirts/veyro-tee-03-primary.webp", None),
        "vey-tsh-ovr-004": ("/products/tshirts/veyro-tee-04-primary.webp", "/products/tshirts/veyro-tee-04-hover.webp"),
        "vey-tsh-reg-001": ("/products/tshirts/veyro-tee-05-primary.webp", None),
        "vey-tsh-reg-002": ("/products/tshirts/veyro-tee-06-primary.webp", None),
        "vey-tsh-reg-003": ("/products/tshirts/veyro-tee-07-primary.webp", None),
        "vey-tsh-rlx-001": ("/products/tshirts/veyro-tee-08-primary.webp", None),
        "vey-tsh-rlx-002": ("/products/tshirts/veyro-tee-09-primary.webp", None),
        "vey-tsh-gfx-001": ("/products/tshirts/veyro-tee-10-primary.webp", None),
        "vey-tsh-gfx-002": ("/products/tshirts/veyro-tee-11-primary.webp", None),
        "vey-tsh-txr-001": ("/products/tshirts/veyro-tee-12-primary.webp", None),
        "vey-tsh-txr-002": ("/products/tshirts/veyro-tee-13-primary.webp", None),
        "vey-tsh-txr-003": ("/products/tshirts/veyro-tee-14-primary.webp", None),
    }

    # Image mapping for Shoes
    shoe_mappings = {
        "vey-ftw-min-001": "/products/shoes/veyro-shoe-01-primary.webp",
        "vey-ftw-min-002": "/products/shoes/veyro-shoe-02-primary.webp",
        "vey-ftw-min-003": "/products/shoes/veyro-shoe-03-primary.webp",
        "vey-ftw-ret-001": "/products/shoes/veyro-shoe-04-primary.webp",
        "vey-ftw-ret-002": "/products/shoes/veyro-shoe-05-primary.webp",
        "vey-ftw-ret-003": "/products/shoes/veyro-shoe-06-primary.webp",
        "vey-ftw-chk-001": "/products/shoes/veyro-shoe-07-primary.webp",
        "vey-ftw-chk-002": "/products/shoes/veyro-shoe-08-primary.webp",
        "vey-ftw-chk-003": "/products/shoes/veyro-shoe-09-primary.webp",
    }

    # 1. Update t-shirts
    for pid, (pri, hov) in tee_mappings.items():
        # Match the block for this product
        pattern = rf'(id:\s*"{pid}",[\s\S]*?imageUrl:\s*)"[^"]+"'
        content = re.sub(pattern, rf'\1"{pri}"', content)
        
        if hov:
            # Update or ensure secondaryImageUrl
            sec_pattern = rf'(id:\s*"{pid}",[\s\S]*?secondaryImageUrl:\s*)"[^"]+"'
            content = re.sub(sec_pattern, rf'\1"{hov}"', content)
        else:
            # Remove secondaryImageUrl if any
            sec_pattern = rf'(id:\s*"{pid}",[\s\S]*?)\n\s*secondaryImageUrl:\s*"[^"]+",?'
            content = re.sub(sec_pattern, r'\1', content)

    # 2. Remove vey-tsh-gfx-003 to make exactly 14 t-shirts
    gfx03_pattern = r'\{\s*id:\s*"vey-tsh-gfx-003",[\s\S]*?\n\s*\},?\n'
    content = re.sub(gfx03_pattern, '', content)

    # 3. Update shoes
    for pid, pri in shoe_mappings.items():
        pattern = rf'(id:\s*"{pid}",[\s\S]*?imageUrl:\s*)"[^"]+"'
        content = re.sub(pattern, rf'\1"{pri}"', content)
        # remove secondaryImageUrl for shoes as we use primary
        sec_pattern = rf'(id:\s*"{pid}",[\s\S]*?)\n\s*secondaryImageUrl:\s*"[^"]+",?'
        content = re.sub(sec_pattern, r'\1', content)

    # 4. Add 10th shoe: Studio Everyday Low-Top
    tenth_shoe = '''
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
'''

    # Insert before the end of footwear array: `];` before `export const products`
    content = content.replace('// ────────────────────────────────────────────────────────────────────────────\n// COMBINED CATALOGUE EXPORT', tenth_shoe + '\n// ────────────────────────────────────────────────────────────────────────────\n// COMBINED CATALOGUE EXPORT')

    with open('src/data/products.ts', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Updated src/data/products.ts successfully!")

if __name__ == '__main__':
    update_products()
