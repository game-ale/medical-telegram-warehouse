import os
import requests

def setup_sample_data():
    img_dir = "data/raw/images/sample_channel"
    os.makedirs(img_dir, exist_ok=True)
    
    img_url = "https://raw.githubusercontent.com/ultralytics/ultralytics/main/ultralytics/assets/bus.jpg"
    img_path = os.path.join(img_dir, "sample_msg_1.jpg")
    
    try:
        print(f"Attempting to download {img_url}")
        response = requests.get(img_url, timeout=10)
        response.raise_for_status()
        with open(img_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded sample image to {img_path}")
    except Exception as e:
        print(f"Failed to download image: {e}")

if __name__ == "__main__":
    setup_sample_data()
