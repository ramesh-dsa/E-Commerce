import subprocess
from PIL import Image

cairosvg_bin = "/home/santhosh/.local/bin/cairosvg"

tasks = [
    # 2048x512 transparent
    ("public/logo/veyro-logo.svg", "public/logo/veyro-logo-2048x512.png", 2048, 512),
    ("public/logo/veyro-logo-white.svg", "public/logo/veyro-logo-white-2048x512.png", 2048, 512),
    ("public/logo/veyro-logo-accent.svg", "public/logo/veyro-logo-accent-2048x512.png", 2048, 512),
    # 2048x512 with solid backgrounds
    ("public/logo/veyro-logo-on-white.svg", "public/logo/veyro-logo-on-white-2048x512.png", 2048, 512),
    ("public/logo/veyro-logo-on-black.svg", "public/logo/veyro-logo-on-black-2048x512.png", 2048, 512),
    # 1024x256 web header
    ("public/logo/veyro-logo.svg", "public/logo/veyro-logo-1024x256.png", 1024, 256),
    ("public/logo/veyro-logo-white.svg", "public/logo/veyro-logo-white-1024x256.png", 1024, 256),
    ("public/logo/veyro-logo-on-white.svg", "public/logo/veyro-logo-on-white-1024x256.png", 1024, 256),
    ("public/logo/veyro-logo-accent.svg", "public/logo/veyro-logo-accent-1024x256.png", 1024, 256),
]

for src, dst, w, h in tasks:
    cmd = [cairosvg_bin, src, "-o", dst, "-W", str(w), "-H", str(h)]
    subprocess.run(cmd, check=True)
    print(f"Generated {dst} ({w}x{h})")

# Generate favicon 32x32:
# For favicon, we crop the square aspect or create a square icon version
# First let's render a crisp V mark or compact VEYRO favicon
cmd_fav = [cairosvg_bin, "public/logo/veyro-logo-on-black.svg", "-o", "public/logo/temp_fav.png", "-W", "512", "-H", "128"]
subprocess.run(cmd_fav, check=True)

# Generate favicon.png (32x32) with a bold V monogram or compact VEYRO
# Let's create an exact 32x32 VEYRO monogram / favicon SVG:
favicon_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="12" fill="#0B0B0B"/>
  <path d="M 14,16 L 24,16 L 32,44 L 40,16 L 50,16 L 37,50 C 35,53 29,53 27,50 Z" fill="#FCD017"/>
</svg>"""

with open("public/logo/favicon-source.svg", "w") as f:
    f.write(favicon_svg)

cmd_favicon = [cairosvg_bin, "public/logo/favicon-source.svg", "-o", "public/logo/favicon-32x32.png", "-W", "32", "-H", "32"]
subprocess.run(cmd_favicon, check=True)
print("Generated public/logo/favicon-32x32.png (32x32)")

# Also copy favicon to public/favicon.ico / public/favicon.png
cmd_favicon_main = [cairosvg_bin, "public/logo/favicon-source.svg", "-o", "public/favicon.png", "-W", "32", "-H", "32"]
subprocess.run(cmd_favicon_main, check=True)

print("All PNG exports complete!")
