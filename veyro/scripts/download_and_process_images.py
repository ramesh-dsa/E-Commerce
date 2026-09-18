import os
import io
import urllib.request
from PIL import Image, ImageOps

ASSET_MAP = [
    # ── T-SHIRTS (14 products) ──────────────────────────────────────────
    {
        "id": "veyro-tee-01",
        "name": "Core Oversized Tee",
        "category": "tshirts",
        "color": "Black",
        "primary_url": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-tee-01-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1600&q=90",
        "hover_file": "veyro-tee-01-hover.webp",
        "hover_source": "Unsplash",
        "notes": "Sharp cotton drop-shoulder drape, clean portrait styling, zero branding."
    },
    {
        "id": "veyro-tee-02",
        "name": "Ease Oversized Tee",
        "category": "tshirts",
        "color": "Off-White",
        "primary_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-tee-02-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1600&q=90",
        "hover_file": "veyro-tee-02-hover.webp",
        "hover_source": "Unsplash",
        "notes": "Minimal neutral studio background, realistic collar ribbing detail."
    },
    {
        "id": "veyro-tee-03",
        "name": "Range Oversized Tee",
        "category": "tshirts",
        "color": "Olive",
        "primary_url": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-tee-03-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Earth tone, crisp lighting, natural posture, no background clutter."
    },
    {
        "id": "veyro-tee-04",
        "name": "Mark Graphic Oversized Tee",
        "category": "tshirts",
        "color": "Charcoal",
        "primary_url": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-tee-04-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1600&q=90",
        "hover_file": "veyro-tee-04-hover.webp",
        "hover_source": "Unsplash",
        "notes": "Urban minimal aesthetic, subtle abstract graphic, zero branded logos."
    },
    {
        "id": "veyro-tee-05",
        "name": "Daily Crewneck Tee",
        "category": "tshirts",
        "color": "White",
        "primary_url": "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-tee-05-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Pristine product-focused shot, crisp neckline, unbranded."
    },
    {
        "id": "veyro-tee-06",
        "name": "Classic Crewneck Tee",
        "category": "tshirts",
        "color": "Muted Blue",
        "primary_url": "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-tee-06-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Editorial lighting, clean fit, neutral grey backdrop."
    },
    {
        "id": "veyro-tee-07",
        "name": "Essential Crewneck Tee",
        "category": "tshirts",
        "color": "Forest Green",
        "primary_url": "https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-tee-07-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "High definition, rich deep green, authentic fabric texture."
    },
    {
        "id": "veyro-tee-08",
        "name": "Relaxed Minimal Tee",
        "category": "tshirts",
        "color": "Stone",
        "primary_url": "https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-tee-08-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Neutral warm lighting, modern Indian D2C aesthetic, centered."
    },
    {
        "id": "veyro-tee-09",
        "name": "Heavyweight Relaxed Tee",
        "category": "tshirts",
        "color": "Navy",
        "primary_url": "https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-tee-09-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Architectural boxy drape, unbranded, high-contrast clarity."
    },
    {
        "id": "veyro-tee-10",
        "name": "Typo Graphic Tee",
        "category": "tshirts",
        "color": "Washed Black",
        "primary_url": "https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-tee-10-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Contemporary typographic back/front composition, sharp edges."
    },
    {
        "id": "veyro-tee-11",
        "name": "Arch Graphic Tee",
        "category": "tshirts",
        "color": "Off-White",
        "primary_url": "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-tee-11-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Artistic minimal streetwear, high contrast, clean subject isolation."
    },
    {
        "id": "veyro-tee-12",
        "name": "Textured Waffle Tee",
        "category": "tshirts",
        "color": "Beige",
        "primary_url": "https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-tee-12-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Waffle micro-weave clearly discernible, soft natural studio light."
    },
    {
        "id": "veyro-tee-13",
        "name": "Textured Ribbed Tee",
        "category": "tshirts",
        "color": "Coffee Brown",
        "primary_url": "https://images.pexels.com/photos/4066295/pexels-photo-4066295.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-tee-13-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Rich tonal depth, tactile fabric ribs, clean vertical crop."
    },
    {
        "id": "veyro-tee-14",
        "name": "Washed Vintage Tee",
        "category": "tshirts",
        "color": "Charcoal Slate",
        "primary_url": "https://images.pexels.com/photos/2896840/pexels-photo-2896840.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-tee-14-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Premium washed patina, structured collar, centered subject."
    },

    # ── FOOTWEAR (10 products) ──────────────────────────────────────────
    {
        "id": "veyro-shoe-01",
        "name": "Blanc Court Sneaker",
        "category": "shoes",
        "color": "Triple White",
        "primary_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-shoe-01-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Unbranded clean court sneaker profile, crisp cupsole, studio lighting."
    },
    {
        "id": "veyro-shoe-02",
        "name": "Mono Low-Top Sneaker",
        "category": "shoes",
        "color": "Triple Black",
        "primary_url": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-shoe-02-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Sharp leather texture, minimal branding, excellent lateral perspective."
    },
    {
        "id": "veyro-shoe-03",
        "name": "Ivory Court Sneaker",
        "category": "shoes",
        "color": "Light Grey / Suede",
        "primary_url": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-shoe-03-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Soft neutral suede panels, clean background, sharp laces detail."
    },
    {
        "id": "veyro-shoe-04",
        "name": "Campus Retro Runner",
        "category": "shoes",
        "color": "Off-White & Green",
        "primary_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-shoe-04-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Vintage terrace runner look, gum outsole accent, crisp silhouette."
    },
    {
        "id": "veyro-shoe-05",
        "name": "Terrace Gum Runner",
        "category": "shoes",
        "color": "Navy & Gum",
        "primary_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=90",
        "primary_file": "veyro-shoe-05-primary.webp",
        "primary_source": "Unsplash",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Iconic low-profile silhouette, clean sole tread, studio lit."
    },
    {
        "id": "veyro-shoe-06",
        "name": "Apex Heritage Runner",
        "category": "shoes",
        "color": "Grey & Burgundy",
        "primary_url": "https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-shoe-06-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Multi-panel suede construction, heritage running profile, razor-sharp."
    },
    {
        "id": "veyro-shoe-07",
        "name": "Elevate Chunky Sneaker",
        "category": "shoes",
        "color": "Monochrome White/Black",
        "primary_url": "https://images.pexels.com/photos/1478442/pexels-photo-1478442.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-shoe-07-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Sculpted chunky midsole, bold street geometry, no unwanted logos."
    },
    {
        "id": "veyro-shoe-08",
        "name": "Orbit Chunky Sneaker",
        "category": "shoes",
        "color": "Sand Dune",
        "primary_url": "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-shoe-08-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Modern warm sand palette, layered upper, studio floor shadows."
    },
    {
        "id": "veyro-shoe-09",
        "name": "Stride Chunky Trainer",
        "category": "shoes",
        "color": "Dark Olive & Black",
        "primary_url": "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-shoe-09-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Technical street silhouette, rugged tread, unbranded and sharp."
    },
    {
        "id": "veyro-shoe-10",
        "name": "Studio Everyday Low-Top",
        "category": "shoes",
        "color": "Clay / Warm Grey",
        "primary_url": "https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "primary_file": "veyro-shoe-10-primary.webp",
        "primary_source": "Pexels",
        "hover_url": None,
        "hover_file": None,
        "hover_source": None,
        "notes": "Clean casual lifestyle sneaker, soft daylight, perfectly centered."
    },
]

def fetch_and_process_image(url, target_path, target_ratio=(3, 4)):
    """
    Downloads image from url, crops/pads to target_ratio (e.g. 3:4 portrait)
    with breathing room, ensures long edge >= 1400px, and saves as pristine WebP.
    """
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    with urllib.request.urlopen(req) as resp:
        raw_data = resp.read()
    
    img = Image.open(io.BytesIO(raw_data)).convert('RGB')
    orig_w, orig_h = img.size
    
    # Target aspect ratio: width / height = 3 / 4 = 0.75
    target_aspect = target_ratio[0] / target_ratio[1]
    current_aspect = orig_w / orig_h
    
    if current_aspect > target_aspect:
        # Image is wider than 3:4 -> crop sides centered
        new_w = int(orig_h * target_aspect)
        offset = (orig_w - new_w) // 2
        img = img.crop((offset, 0, offset + new_w, orig_h))
    else:
        # Image is taller than 3:4 -> crop top/bottom with slight bias towards upper center
        new_h = int(orig_w / target_aspect)
        offset = (orig_h - new_h) // 3  # slight bias to keep head/collar in frame
        img = img.crop((0, max(0, offset), orig_w, max(0, offset) + new_h))
        
    # Resize so long edge is at least 1400px (e.g. 1050x1400)
    w, h = img.size
    if h < 1400:
        new_h = 1400
        new_w = int(1400 * (w / h))
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    elif h > 2000:
        new_h = 1800
        new_w = int(1800 * (w / h))
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
    # Ensure parent dir exists
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    
    # Save as high-fidelity WebP (quality=90 ensures zero compression artifacts, sharp fabric detail)
    img.save(target_path, 'WEBP', quality=90, method=6)
    
    file_size_kb = os.path.getsize(target_path) / 1024
    return img.size, file_size_kb

def main():
    print("Beginning acquisition of VEYRO catalogue product assets...")
    
    manifest_rows = []
    total_downloaded = 0
    
    for item in ASSET_MAP:
        cat_dir = os.path.join("public", "products", item["category"])
        
        # 1. Primary image
        pri_path = os.path.join(cat_dir, item["primary_file"])
        print(f"Downloading {item['id']} Primary: {item['name']}...")
        size, kb = fetch_and_process_image(item["primary_url"], pri_path)
        print(f"  -> Saved {item['primary_file']}: {size[0]}x{size[1]}px, {kb:.1f} KB")
        total_downloaded += 1
        
        manifest_rows.append({
            "product_id": item["id"],
            "name": item["name"],
            "image_type": "primary",
            "file": f"/products/{item['category']}/{item['primary_file']}",
            "source": item["primary_source"],
            "url": item["primary_url"],
            "license": f"{item['primary_source']} Free Commercial Use License",
            "notes": item["notes"]
        })
        
        # 2. Hover image (if provided)
        if item.get("hover_url") and item.get("hover_file"):
            hov_path = os.path.join(cat_dir, item["hover_file"])
            print(f"Downloading {item['id']} Hover...")
            size_h, kb_h = fetch_and_process_image(item["hover_url"], hov_path)
            print(f"  -> Saved {item['hover_file']}: {size_h[0]}x{size_h[1]}px, {kb_h:.1f} KB")
            total_downloaded += 1
            
            manifest_rows.append({
                "product_id": item["id"],
                "name": item["name"],
                "image_type": "hover",
                "file": f"/products/{item['category']}/{item['hover_file']}",
                "source": item["hover_source"],
                "url": item["hover_url"],
                "license": f"{item['hover_source']} Free Commercial Use License",
                "notes": f"Secondary/Alternate view: {item['notes']}"
            })

    print(f"\nAsset collection complete: {total_downloaded} files generated.")
    
    # Write source manifest (Section 44)
    manifest_path = "product-image-sources.md"
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write("# VEYRO PRODUCT IMAGE SOURCES & ASSET MANIFEST\n\n")
        f.write("> Internal project reference documenting the licensing, source URLs, and aesthetic notes for all locally hosted catalogue assets.\n\n")
        f.write("| Product ID | Image Type | Local Path | Source | Original URL | License | Quality Notes |\n")
        f.write("|---|---|---|---|---|---|---|\n")
        for row in manifest_rows:
            f.write(f"| `{row['product_id']}` | **{row['image_type']}** | `{row['file']}` | {row['source']} | [Source Link]({row['url']}) | {row['license']} | {row['notes']} |\n")
            
    print(f"Source manifest successfully generated at {manifest_path}")

if __name__ == '__main__':
    main()
