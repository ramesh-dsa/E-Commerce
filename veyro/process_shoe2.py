from PIL import Image

def remove_black_background(input_path, output_path, threshold=40):
    print("Opening image...")
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    print("Processing pixels...")
    newData = []
    for item in datas:
        # Check if the pixel is dark (black background)
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            newData.append((255, 255, 255, 0)) # Transparent
        else:
            newData.append(item)
            
    print("Updating image data...")
    img.putdata(newData)
    
    print("Saving image...")
    img.save(output_path, "WEBP")
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    in_path = "/home/santhosh/.gemini/antigravity-ide/brain/2bbcd9db-6181-4869-a027-5c5577d56295/.user_uploaded/media_1789805489728.jpg"
    out_path = "/home/santhosh/Music/E-Commerce/veyro/public/products/shoes/premium_floating_sneaker_v4.webp"
    remove_black_background(in_path, out_path)
