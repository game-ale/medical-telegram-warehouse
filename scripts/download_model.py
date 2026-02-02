import requests
import os

url = "https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8n.pt"
filename = "yolov8n.pt"

print(f"Downloading {filename} from {url}...")
try:
    if os.path.exists(filename):
        os.remove(filename)
        
    response = requests.get(url, stream=True)
    response.raise_for_status()
    
    with open(filename, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
            
    size = os.path.getsize(filename)
    print(f"Download complete. Size: {size} bytes")
    
except Exception as e:
    print(f"Download failed: {e}")
