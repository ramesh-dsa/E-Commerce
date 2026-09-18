import os
import shutil
from PIL import Image

USER_IMAGES = {
    # 1. Green Air Max 1 -> Campus Retro Runner (veyro-shoe-04)
    "shoe-04": {
        "src": "/home/santhosh/.gemini/antigravity-ide/brain/2bbcd9db-6181-4869-a027-5c5577d56295/.user_uploaded/media_1789730266495.jpg",
        "pri_dest": "public/products/shoes/veyro-shoe-04-primary.webp",
        "hov_dest": "public/products/shoes/veyro-shoe-04-hover.webp",
        "name": "Campus Retro Runner (Green Accent)",
    },
    # 2. Jordan 4 Military Black/White -> Elevate Chunky Sneaker (veyro-shoe-07)
    "shoe-07": {
        "src": "/home/santhosh/.gemini/antigravity-ide/brain/2bbcd9db-6181-4869-a027-5c5577d56295/.user_uploaded/media_1789730284816.jpg",
        "pri_dest": "public/products/shoes/veyro-shoe-07-primary.webp",
        "hov_dest": "public/products/shoes/veyro-shoe-07-hover.webp",
        "name": "Elevate Chunky Sneaker (Military Black/White)",
    },
    # 3. Jordan 4 White/Red on grass -> Accent Retro Sneaker (veyro-shoe-06)
    "shoe-06": {
        "src": "/home/santhosh/.gemini/antigravity-ide/brain/2bbcd9db-6181-4869-a027-5c5577d56295/.user_uploaded/media_1789730359415.jpg",
        "pri_dest": "public/products/shoes/veyro-shoe-06-primary.webp",
        "hov_dest": "public/products/shoes/veyro-shoe-06-hover.webp",
        "name": "Accent Retro Sneaker (White + Fire Red)",
    }
}

def process_and_save(src_path, dest_path):
    img = Image.open(src_path).convert('RGB')
    w, h = img.size
    target_ratio = 3 / 4  # 0.75 portrait
    current_ratio = w / h

    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        cropped = img.crop((offset, 0, offset + new_w, h))
    else:
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        cropped = img.crop((0, offset, w, offset + new_h))

    # Resize to high definition 1050x1400 (preserving crisp sharpness)
    resized = cropped.resize((1050, 1400), Image.Resampling.LANCZOS)
    resized.save(dest_path, 'WEBP', quality=92, method=6)
    size_kb = os.path.getsize(dest_path) / 1024
    print(f"Saved {dest_path}: 1050x1400, {size_kb:.1f} KB")

def main():
    for key, info in USER_IMAGES.items():
        # Keep previous primary as hover image if it exists
        if os.path.exists(info["pri_dest"]) and not os.path.exists(info["hov_dest"]):
            shutil.copyfile(info["pri_dest"], info["hov_dest"])
            print(f"Archived previous primary to {info['hov_dest']}")

        # Process user image to primary
        process_and_save(info["src"], info["pri_dest"])

    # Update src/data/products.ts to wire secondaryImageUrl for these 3 products
    with open('src/data/products.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    # Ensure secondaryImageUrl is added/updated for vey-ftw-ret-001, vey-ftw-ret-003, vey-ftw-chk-001
    shoe_updates = [
        ('vey-ftw-ret-001', '/products/shoes/veyro-shoe-04-hover.webp'),
        ('vey-ftw-ret-003', '/products/shoes/veyro-shoe-06-hover.webp'),
        ('vey-ftw-chk-001', '/products/shoes/veyro-shoe-07-hover.webp'),
    ]

    import re
    for pid, hov in shoe_updates:
        # Check if secondaryImageUrl already exists
        if f'id: "{pid}"' in content:
            # Match the product block
            pattern = rf'(id:\s*"{pid}",[\s\S]*?imageUrl:\s*"[^"]+",?)'
            replacement = rf'\1\n    secondaryImageUrl: "{hov}",'
            # Remove any existing secondaryImageUrl first
            clean_pattern = rf'(id:\s*"{pid}",[\s\S]*?)\n\s*secondaryImageUrl:\s*"[^"]+",?'
            content = re.sub(clean_pattern, r'\1', content)
            # Add secondaryImageUrl
            content = re.sub(pattern, replacement, content)

    with open('src/data/products.ts', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Updated products.ts with new shoe primary and hover image paths!")

if __name__ == '__main__':
    main()
