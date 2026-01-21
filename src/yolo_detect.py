import os
import csv
import torch
# Safety fix for PyTorch 2.6+ when loading Ultralytics models
# This allows the unpickling of DetectionModel which is considered "unsafe" by default now
from ultralytics import YOLO
from loguru import logger

# Configuration
IMAGE_DIR = "data/raw/images"
OUTPUT_FILE = "data/raw/yolo_detections.csv"
MODEL_PATH = "yolov8n.pt"
CONF_THRESHOLD = 0.50

def classify_image(detected_classes):
    """
    Classifies image based on detected objects:
    - promotional: person + bottle/product
    - product_display: product (bottle/cup/etc), no person
    - lifestyle: person, no product
    - other: none of the above
    """
    has_person = "person" in detected_classes
    # Product-like classes in YOLOv8 COCO model
    product_classes = {"bottle", "cup", "wine glass", "bowl", "apple", "sandwich", "orange", "broccoli", "carrot"}
    has_product = any(cls in product_classes for cls in detected_classes)

    if has_person and has_product:
        return "promotional"
    elif has_product:
        return "product_display"
    elif has_person:
        return "lifestyle"
    else:
        return "other"

def run_detection():
    logger.info("Initializing YOLO model...")
    try:
        # Workaround for PyTorch 2.6 weights_only issue
        # We manually load it with weights_only=False if the generic way fails
        # but Ultralytics usually handles its own loading. 
        # However, a global monkeypatch is more effective for buried loads.
        original_load = torch.load
        def patched_load(*args, **kwargs):
            if 'weights_only' not in kwargs:
                kwargs['weights_only'] = False
            return original_load(*args, **kwargs)
        torch.load = patched_load
        
        model = YOLO(MODEL_PATH)
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        return

    if not os.path.exists(IMAGE_DIR):
        logger.error(f"Image directory not found: {IMAGE_DIR}")
        return

    logger.info(f"Scanning images in {IMAGE_DIR}...")
    
    results_list = []
    processed_images = 0

    for channel_name in os.listdir(IMAGE_DIR):
        channel_path = os.path.join(IMAGE_DIR, channel_name)
        if not os.path.isdir(channel_path):
            continue
            
        for img_file in os.listdir(channel_path):
            if not img_file.endswith(('.jpg', '.jpeg', '.png', '.webp')):
                continue
                
            img_path = os.path.join(channel_path, img_file)
            message_id = img_file.split('.')[0]
            
            try:
                # Run inference
                prediction = model(img_path, verbose=False, conf=CONF_THRESHOLD)
                
                detected_classes = []
                confidences = []
                
                for res in prediction:
                    for box in res.boxes:
                        cls_name = model.names[int(box.cls[0])]
                        conf = float(box.conf[0])
                        detected_classes.append(cls_name)
                        confidences.append(conf)
                
                # Determine category
                category = classify_image(detected_classes)
                
                # Aligning with required columns: message_id, image_path, detected_class, confidence_score, image_category
                results_list.append({
                    "message_id": message_id,
                    "image_path": img_path,
                    "detected_class": ", ".join(set(detected_classes)) if detected_classes else "none",
                    "confidence_score": round(max(confidences), 2) if confidences else 0.0,
                    "image_category": category
                })
                        
                processed_images += 1

            except Exception as e:
                logger.warning(f"Error processing {img_path}: {e}")
                
    # Save results to CSV
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    keys = ["message_id", "image_path", "detected_class", "confidence_score", "image_category"]
    
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as f:
        dict_writer = csv.DictWriter(f, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(results_list)
        
    logger.success(f"Detection complete. Results saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    run_detection()

