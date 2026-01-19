import os
import json
from ultralytics import YOLO
from loguru import logger

# Configuration
IMAGE_DIR = "data/raw/images"
OUTPUT_FILE = "data/raw/yolo_detections.json"
MODEL_PATH = "yolov8n.pt"  # Will download automatically if not present
CONF_THRESHOLD = 0.50 # Filter weak detections

def run_inference():
    logger.info("Initializing YOLO model...")
    try:
        model = YOLO(MODEL_PATH)
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return

    detections_data = []
    
    # Iterate through channel directories
    if not os.path.exists(IMAGE_DIR):
        logger.error(f"Image directory not found: {IMAGE_DIR}")
        return

    logger.info(f"Scanning images in {IMAGE_DIR}...")
    
    total_images = 0
    processed_images = 0

    for channel_name in os.listdir(IMAGE_DIR):
        channel_path = os.path.join(IMAGE_DIR, channel_name)
        if not os.path.isdir(channel_path):
            continue
            
        for img_file in os.listdir(channel_path):
            if not img_file.endswith(('.jpg', '.jpeg', '.png')):
                continue
                
            img_path = os.path.join(channel_path, img_file)
            message_id = img_file.split('.')[0] # Filename is message_id.jpg
            
            try:
                # Run inference
                results = model(img_path, verbose=False, conf=CONF_THRESHOLD)
                
                # Parse results
                detected_objects = []
                for result in results:
                    for box in result.boxes:
                        class_id = int(box.cls[0])
                        class_name = model.names[class_id]
                        confidence = float(box.conf[0])
                        
                        # We can filter for specific classes here if needed (e.g. 'bottle')
                        # For now, we keep all confident detections
                        detected_objects.append({
                            "class": class_name,
                            "confidence": round(confidence, 2),
                            "bbox": [round(x, 2) for x in box.xyxy[0].tolist()]
                        })
                
                if detected_objects:
                    record = {
                        "message_id": int(message_id) if message_id.isdigit() else None,
                        "channel_name": channel_name,
                        "image_path": img_path,
                        "detections": detected_objects
                    }
                    if record["message_id"] is not None:
                        detections_data.append(record)
                        
                processed_images += 1
                if processed_images % 10 == 0:
                    logger.info(f"Processed {processed_images} images...")

            except Exception as e:
                logger.warning(f"Error processing {img_path}: {e}")
                
    # Save results
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(detections_data, f, ensure_ascii=False, indent=4)
        
    logger.success(f"Inference complete. Processed {processed_images} images. Results saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    run_inference()
