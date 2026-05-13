from PIL import Image
import os

source_path = '/Users/yashbansal/.gemini/antigravity/brain/479e7ae5-5355-4654-9efb-a58ef1a4be78/media__1778398600266.png'
dest_path = '/Users/yashbansal/Downloads/parity-foods-final-main/public/images/mustard-oil-new.png'

img = Image.open(source_path)
width, height = img.size

# The large bottle is on the left side. It occupies roughly the left 60% and top 80%.
# Let's crop it.
left = int(width * 0.05)
top = int(height * 0.05)
right = int(width * 0.60)
bottom = int(height * 0.75)

cropped = img.crop((left, top, right, bottom))
cropped.save(dest_path)
print(f"Cropped image saved to {dest_path}")
