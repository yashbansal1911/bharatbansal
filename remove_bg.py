from PIL import Image

def remove_white_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Change all white (also shades of whites)
        # to transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

if __name__ == "__main__":
    input_file = "/Users/yashbansal/.gemini/antigravity/brain/d7a03ed2-affd-4aa3-9a2b-f801e5103c15/uploaded_image_1764579962292.png"
    output_file = "/Users/yashbansal/.gemini/antigravity/scratch/parity_foods/public/images/parity-text-logo.png"
    remove_white_background(input_file, output_file)
