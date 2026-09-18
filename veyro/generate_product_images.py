import os
import json
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    if len(hex_str) == 3:
        hex_str = ''.join([c*2 for c in hex_str])
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def blend_color(c1, c2, factor):
    """Blend two RGB colors by factor (0 = c1, 1 = c2)"""
    return tuple(int(c1[i] + (c2[i] - c1[i]) * factor) for i in range(3))

def create_studio_background(width, height):
    """Creates a premium editorial studio background with subtle radial/vertical gradient"""
    bg = Image.new("RGB", (width, height), (247, 246, 243))
    draw = ImageDraw.Draw(bg)
    
    # Soft vertical lighting gradient
    top_color = (248, 247, 245)
    bottom_color = (235, 233, 229)
    for y in range(height):
        t = y / height
        # Slightly darker towards bottom
        color = blend_color(top_color, bottom_color, t * 0.85)
        draw.line([(0, y), (width, y)], fill=color)
        
    return bg

def draw_tshirt(draw, width, height, color_rgb, is_back=False, is_graphic=False):
    # Center of garment
    cx = width // 2
    cy = height // 2 - 20
    
    # Shadow underneath
    shadow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.ellipse([cx - 260, cy + 330, cx + 260, cy + 410], fill=(0, 0, 0, 35))
    shadow = shadow.filter(ImageFilter.GaussianBlur(35))
    
    # Check if color is very light (like white / off-white)
    brightness = (color_rgb[0] * 299 + color_rgb[1] * 587 + color_rgb[2] * 114) / 1000
    is_light = brightness > 220
    border_color = (210, 208, 204) if is_light else blend_color(color_rgb, (0, 0, 0), 0.25)
    
    # Main T-Shirt Body Polygon (Boxy oversized / modern streetwear fit)
    # Coordinates relative to center
    body_pts = [
        (cx - 95, cy - 260),   # Left collar
        (cx - 280, cy - 190),  # Left shoulder drop
        (cx - 360, cy - 40),   # Left sleeve end
        (cx - 275, cy + 30),   # Left sleeve underarm
        (cx - 225, cy + 290),  # Left hem bottom
        (cx + 225, cy + 290),  # Right hem bottom
        (cx + 275, cy + 30),   # Right sleeve underarm
        (cx + 360, cy - 40),   # Right sleeve end
        (cx + 280, cy - 190),  # Right shoulder drop
        (cx + 95, cy - 260),   # Right collar
    ]
    
    return shadow, body_pts, border_color, is_light, cx, cy

def render_tshirt_image(prod, is_back=False):
    width, height = 900, 1200
    bg = create_studio_background(width, height)
    
    color_rgb = hex_to_rgb(prod.get('colorHex', '#111111'))
    is_graphic = "Graphic" in prod.get('subcategoryTag', '') or "Graphic" in prod.get('name', '')
    
    shadow, body_pts, border_color, is_light, cx, cy = draw_tshirt(
        None, width, height, color_rgb, is_back=is_back, is_graphic=is_graphic
    )
    
    # Paste shadow
    bg.paste(shadow, (0, 0), shadow)
    draw = ImageDraw.Draw(bg)
    
    # Draw body
    draw.polygon(body_pts, fill=color_rgb, outline=border_color, width=2)
    
    # Collar curve
    collar_drop = 45 if not is_back else 18
    collar_box = [cx - 95, cy - 275, cx + 95, cy - 250 + collar_drop]
    
    # Inner neck opening
    inner_neck_color = blend_color(color_rgb, (0, 0, 0), 0.35) if not is_back else (235, 233, 229)
    draw.chord(collar_box, 0, 180, fill=inner_neck_color, outline=border_color, width=2)
    
    # Collar ribbing band
    rib_box = [cx - 102, cy - 280, cx + 102, cy - 245 + collar_drop]
    draw.arc(rib_box, 0, 180, fill=border_color, width=4)
    
    # Sleeve hem fold lines
    draw.line([(cx - 360, cy - 40), (cx - 275, cy + 30)], fill=border_color, width=2)
    draw.line([(cx + 360, cy - 40), (cx + 275, cy + 30)], fill=border_color, width=2)
    # Bottom hem fold line
    draw.line([(cx - 225, cy + 280), (cx + 225, cy + 280)], fill=border_color, width=1)
    
    # Graphic print on chest if graphic tee
    if is_graphic and not is_back:
        # Editorial typographic graphic box
        contrast_color = (255, 255, 255) if not is_light else (20, 20, 20)
        accent_color = (255, 212, 0) # VEYRO yellow
        
        # Subtle architectural geometric graphic
        gx = cx - 110
        gy = cy - 80
        draw.rectangle([gx, gy, gx + 220, gy + 140], outline=contrast_color, width=2)
        draw.line([gx, gy + 35, gx + 220, gy + 35], fill=contrast_color, width=1)
        draw.rectangle([gx + 15, gy + 15, gx + 35, gy + 25], fill=accent_color)
        draw.text((gx + 45, gy + 12), "VEYRO / SYSTEM", fill=contrast_color)
        draw.text((gx + 15, gy + 55), "240 GSM HEAVYWEIGHT", fill=contrast_color)
        draw.text((gx + 15, gy + 80), "FORM & PROPORTION", fill=contrast_color)
        draw.text((gx + 15, gy + 105), "EDITION 01 • INDIA", fill=contrast_color)
    elif is_back:
        # Back nape micro-stamp
        contrast_color = (255, 255, 255) if not is_light else (30, 30, 30)
        draw.text((cx - 35, cy - 190), "VEYRO", fill=contrast_color)
        draw.rectangle([cx - 4, cy - 170, cx + 4, cy - 166], fill=(255, 212, 0))
    else:
        # Clean tonal micro-chest logo
        contrast_color = (255, 255, 255, 120) if not is_light else (40, 40, 40)
        draw.text((cx - 140, cy - 90), "V E Y R O", fill=contrast_color)
    
    # Add sleek minimal brand header & footer text overlay
    # Top brand watermark
    draw.text((cx - 45, 55), "V E Y R O", fill=(170, 168, 164))
    
    # Bottom product badge & specs
    view_label = "REAR PERSPECTIVE" if is_back else "STUDIO FRONT"
    draw.text((60, height - 70), f"{prod['name'].upper()} • {prod.get('fit', 'OVERSIZED').upper()}", fill=(60, 60, 60))
    draw.text((60, height - 48), f"{prod['colorName'].upper()} • {view_label}", fill=(130, 130, 130))
    
    # Color swatch circle in bottom right
    draw.ellipse([width - 95, height - 72, width - 65, height - 42], fill=color_rgb, outline=(200, 198, 194), width=1)
    
    return bg

def render_footwear_image(prod, is_secondary=False):
    width, height = 900, 1200
    bg = create_studio_background(width, height)
    
    color_rgb = hex_to_rgb(prod.get('colorHex', '#FFFFFF'))
    cx = width // 2
    cy = height // 2 + 30
    
    # Soft ambient drop shadow
    shadow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.ellipse([cx - 320, cy + 180, cx + 320, cy + 270], fill=(0, 0, 0, 40))
    shadow = shadow.filter(ImageFilter.GaussianBlur(30))
    bg.paste(shadow, (0, 0), shadow)
    
    draw = ImageDraw.Draw(bg)
    
    brightness = (color_rgb[0] * 299 + color_rgb[1] * 587 + color_rgb[2] * 114) / 1000
    is_light = brightness > 210
    border_color = (200, 198, 192) if is_light else blend_color(color_rgb, (0, 0, 0), 0.3)
    
    # Sneaker sole color (crisp off-white / gum / cream)
    sole_color = (248, 246, 240) if color_rgb != (255, 255, 255) else (238, 235, 228)
    sole_edge = (215, 212, 206)
    
    # Sneaker profile coordinates (side view)
    # Sole:
    sole_pts = [
        (cx - 280, cy + 140), # Heel bottom
        (cx + 280, cy + 150), # Toe bottom curve
        (cx + 310, cy + 130), # Toe tip
        (cx + 300, cy + 85),  # Toe top curve
        (cx - 280, cy + 85),  # Heel top of sole
    ]
    draw.polygon(sole_pts, fill=sole_color, outline=sole_edge, width=2)
    # Midsole tread line
    draw.line([(cx - 280, cy + 115), (cx + 295, cy + 115)], fill=sole_edge, width=2)
    
    # Sneaker upper:
    upper_pts = [
        (cx - 280, cy + 85),  # Heel bottom
        (cx - 270, cy - 60),  # Heel counter top
        (cx - 220, cy - 65),  # Collar back
        (cx - 150, cy - 20),  # Collar opening bottom
        (cx - 80, cy - 70),   # Tongue top
        (cx + 120, cy - 10),  # Eyestay to toe box
        (cx + 260, cy + 20),  # Toe box slope
        (cx + 300, cy + 85),  # Toe front bottom
    ]
    draw.polygon(upper_pts, fill=color_rgb, outline=border_color, width=2)
    
    # Sneaker collar cushion
    collar_pts = [(cx - 220, cy - 65), (cx - 150, cy - 20), (cx - 130, cy - 50), (cx - 180, cy - 75)]
    draw.polygon(collar_pts, fill=(240, 238, 234), outline=border_color, width=1)
    
    # Tongue & Lacing System
    lace_color = (255, 255, 255) if not is_light else (220, 218, 214)
    # Draw criss-cross laces
    lace_y = cy - 50
    for i in range(5):
        y_pos = lace_y + i * 18
        draw.line([(cx - 70 + i*30, y_pos), (cx - 50 + i*30, y_pos + 10)], fill=lace_color, width=4)
        draw.line([(cx - 50 + i*30, y_pos), (cx - 70 + i*30, y_pos + 10)], fill=lace_color, width=4)
        
    # VEYRO side architectural accent wave/stripe
    accent_pts = [
        (cx - 160, cy + 50),
        (cx - 30, cy + 10),
        (cx + 110, cy + 45),
        (cx + 100, cy + 65),
        (cx - 40, cy + 35),
        (cx - 160, cy + 70),
    ]
    accent_fill = (255, 212, 0) if "Retro" in prod.get('subcategoryTag', '') else blend_color(color_rgb, (0, 0, 0), 0.25)
    draw.polygon(accent_pts, fill=accent_fill)
    
    # Heel counter cap
    heel_pts = [
        (cx - 280, cy + 85),
        (cx - 270, cy - 10),
        (cx - 220, cy + 15),
        (cx - 220, cy + 85),
    ]
    draw.polygon(heel_pts, fill=blend_color(color_rgb, (0, 0, 0), 0.15), outline=border_color, width=1)
    
    # Brand text & labels
    draw.text((cx - 45, 55), "V E Y R O", fill=(170, 168, 164))
    
    view_label = "LATERAL ELEVATION" if not is_secondary else "MEDIAL DETAIL"
    draw.text((60, height - 70), f"{prod['name'].upper()} • {prod.get('subcategoryTag', 'SNEAKER').upper()}", fill=(60, 60, 60))
    draw.text((60, height - 48), f"{prod['colorName'].upper()} • {view_label}", fill=(130, 130, 130))
    
    # Color swatch
    draw.ellipse([width - 95, height - 72, width - 65, height - 42], fill=color_rgb, outline=(200, 198, 194), width=1)
    
    return bg

def main():
    with open('scratch_products.json') as f:
        products = json.load(f)
        
    os.makedirs('public/products/tshirts', exist_ok=True)
    os.makedirs('public/products/footwear', exist_ok=True)
    
    count = 0
    for p in products:
        category = p.get('category', 'Clothing')
        # Generate primary image
        img_path = p['imageUrl'].lstrip('/')
        sec_path = p.get('secondaryImageUrl', '').lstrip('/')
        
        full_img_path = os.path.join('public', img_path.replace('public/', ''))
        full_sec_path = os.path.join('public', sec_path.replace('public/', '')) if sec_path else None
        
        os.makedirs(os.path.dirname(full_img_path), exist_ok=True)
        
        if category == 'Footwear':
            img1 = render_footwear_image(p, is_secondary=False)
            img1.save(full_img_path, 'WEBP', quality=88)
            count += 1
            if full_sec_path:
                img2 = render_footwear_image(p, is_secondary=True)
                img2.save(full_sec_path, 'WEBP', quality=88)
                count += 1
        else:
            img1 = render_tshirt_image(p, is_back=False)
            img1.save(full_img_path, 'WEBP', quality=88)
            count += 1
            if full_sec_path:
                img2 = render_tshirt_image(p, is_back=True)
                img2.save(full_sec_path, 'WEBP', quality=88)
                count += 1
                
    print(f"Successfully generated {count} high-definition studio product images in public/products!")

if __name__ == '__main__':
    main()
