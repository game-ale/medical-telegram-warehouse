import os
import csv
import logging
from datetime import datetime
from ultralytics import YOLO

# Setup Model
# 'yolov8n.pt' will download automatically if not present
model = YOLO("yolov8n.pt")

# Paths
IMAGE_DIR = 'data/raw/images'
OUTPUT_CSV = 'data/yolo/image_detections.csv'
LOG_DIR = 'logs'

# Logging
os.makedirs(LOG_DIR, exist_ok=True)
logging.basicConfig(
    filename=f'{LOG_DIR}/yolo_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def classify_image(detections):
    """
    Classify based on detected objects.
    Promotional: Person + Product
    Product Display: Product only
    Lifestyle: Person only
    Other: None
    """
    has_person = False
    has_product = False
    
    # Generic "product" classes in COCO dataset (approximate)
    product_classes = [
        'bottle', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
        'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut',
        'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table', 'toilet',
        'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave',
        'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase',
        'scissors', 'teddy bear', 'hair drier', 'toothbrush'
    ]

    for det in detections:
        cls_name = det['class_name']
        if cls_name == 'person':
            has_person = True
        if cls_name in product_classes:
            has_product = True

    if has_person and has_product:
        return 'promotional'
    elif has_product:
        return 'product_display'
    elif has_person:
        return 'lifestyle'
    else:
        return 'other'

def process_images():
    logger.info("Starting YOLO detection...")
    
    # Prepare CSV
    os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
    
    total_images = 0
    all_rows = []

    # Recursively scan for images
    # Directory structure: data/raw/images/{channel_name}/{message_id}.jpg
    
    for root, dirs, files in os.walk(IMAGE_DIR):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                total_images += 1
                image_path = os.path.join(root, file)
                
                # Metadata
                # Check root folder name for channel
                # Path: data/raw/images/channel_name/msg_id.jpg
                rel_path = os.path.relpath(image_path, IMAGE_DIR)
                parts = rel_path.split(os.sep)
                
                if len(parts) >= 2:
                    channel_name = parts[0]
                    # message_id might be 12345.jpg
                    msg_id_str = os.path.splitext(parts[-1])[0]
                    
                    try:
                        message_id = int(msg_id_str)
                    except ValueError:
                        logger.warning(f"Could not parse message_id from {file}")
                        message_id = None
                else:
                    logger.warning(f"Unexpected path structure: {rel_path}")
                    continue

                try:
                    # Run Inference
                    results = model(image_path, verbose=False) # verbose=False specific to ultralytics
                    result = results[0] # First image
                    
                    detections = []
                    
                    # Iterate detections
                    for box in result.boxes:
                        cls_id = int(box.cls[0])
                        cls_name = model.names[cls_id]
                        conf = float(box.conf[0])
                        
                        detections.append({
                            'class_name': cls_name,
                            'confidence': conf
                        })
                    
                    # Determine classification
                    category = classify_image(detections)
                    
                    # If empty detections, detected_object is 'none'
                    det_classes = [d['class_name'] for d in detections]
                    primary_detection = det_classes[0] if det_classes else 'none'
                    max_conf = max([d['confidence'] for d in detections]) if detections else 0.0

                    row = {
                        'message_id': message_id,
                        'channel_name': channel_name,
                        'image_path': image_path.replace("\\", "/"), # Normalize path
                        'detected_object': primary_detection,
                        'confidence_score': round(max_conf, 4),
                        'image_category': category
                    }
                    all_rows.append(row)
                    
                    if total_images % 10 == 0:
                        print(f"Processed {total_images} images...", end='\r')
                        
                except Exception as e:
                    logger.error(f"Error processing {image_path}: {e}")

    # Save to CSV
    if all_rows:
        keys = all_rows[0].keys()
        with open(OUTPUT_CSV, 'w', newline='', encoding='utf-8') as f:
            dict_writer = csv.DictWriter(f, keys)
            dict_writer.writeheader()
            dict_writer.writerows(all_rows)
            
    logger.info(f"Finished. Processed {total_images} images.")
    print(f"\nDone! Results saved to {OUTPUT_CSV}")

if __name__ == "__main__":
    process_images()
