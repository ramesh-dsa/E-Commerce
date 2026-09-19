import os
from PIL import Image

try:
    from rembg import remove
except ImportError:
    print("rembg not installed")
    exit(1)

input_path = "/home/santhosh/.gemini/antigravity-ide/brain/2bbcd9db-6181-4869-a027-5c5577d56295/.user_uploaded/media_1789805489728.jpg"
output_path = "/home/santhosh/Music/E-Commerce/veyro/public/products/shoes/premium_floating_sneaker_v4.webp"

print("Opening image...")
input_image = Image.open(input_path)
print("Removing background...")
output_image = remove(input_image)
print("Saving image...")
output_image.save(output_path, "webp")
print(f"Saved to {output_path}")
