from PIL import Image, ImageChops

source_path = '/Users/yashbansal/.gemini/antigravity/brain/479e7ae5-5355-4654-9efb-a58ef1a4be78/media__1778398600266.png'
dest_path = '/Users/yashbansal/Downloads/parity-foods-final-main/public/images/mustard-oil-new.png'

img = Image.open(source_path)
width, height = img.size

# The large bottle is on the left side. It occupies roughly the left 60% and top 80%.
# Let's crop to that rough area first
rough_crop = img.crop((0, 0, int(width * 0.60), int(height * 0.80)))

# Convert to grayscale and threshold to find the object
gray = rough_crop.convert("L")
# Background is off-white (around 240-255). Let's threshold at 235
# Anything darker than 235 becomes white (255), anything lighter becomes black (0)
bw = gray.point(lambda x: 255 if x < 245 else 0, '1')

# Get bounding box
bbox = bw.getbbox()

if bbox:
    # Add a small padding of 10 pixels
    padding = 10
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(rough_crop.width, bbox[2] + padding)
    bottom = min(rough_crop.height, bbox[3] + padding)
    
    final_crop = rough_crop.crop((left, top, right, bottom))
    
    # Try to make the background transparent
    # Find the background color (top left pixel)
    final_crop = final_crop.convert("RGBA")
    datas = final_crop.getdata()
    
    new_data = []
    # Use a tolerance for the background color (which is light grey/beige)
    for item in datas:
        # If pixel is very light (r, g, b all > 230), make it transparent
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    final_crop.putdata(new_data)
    final_crop.save(dest_path, "PNG")
    print("Auto-cropped and made transparent successfully!")
else:
    print("Could not find bounding box")
