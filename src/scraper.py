import os
import json
import logging
import asyncio
from datetime import datetime
from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.tl.types import MessageMediaPhoto

# Load environment variables
load_dotenv()

# Configuration
API_ID = os.getenv('TG_API_ID')
API_HASH = os.getenv('TG_API_HASH')
PHONE = os.getenv('TG_PHONE')

CHANNELS = [
    'CheMed123',           # CheMed Telegram Channel
    'lobelia4cosmetics',   # Lobelia Cosmetics
    'tikvahpharma',        # Tikvah Pharma
    'DoctorsET',           # Additional channel
    'EAHCI'                # Ethiopian Association of Health Care
]

# Paths
DATA_DIR = 'data/raw/telegram_messages'
IMAGE_DIR = 'data/raw/images'
LOG_DIR = 'logs'

# Setup Logging
os.makedirs(LOG_DIR, exist_ok=True)
timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
logging.basicConfig(
    filename=f'{LOG_DIR}/scraper_{timestamp}.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def scrape_channel(client, channel_name):
    logger.info(f"Starting scrape for channel: {channel_name}")
    print(f"Scraping {channel_name}...")
    
    try:
        entity = await client.get_entity(channel_name)
    except Exception as e:
        logger.error(f"Error getting entity for {channel_name}: {e}")
        return

    # Dictionary to hold messages grouped by date
    # Structure: { 'YYYY-MM-DD': [msg1, msg2, ...] }
    grouped_messages = {}
    
    message_count = 0
    
    async for message in client.iter_messages(entity, limit=100): # Limit for testing/initial run, remove or increase for full scrape
        msg_date_str = message.date.strftime('%Y-%m-%d')
        
        # Prepare image path
        image_path = None
        has_media = False
        
        if message.media and isinstance(message.media, MessageMediaPhoto):
            has_media = True
            # Create channel image directory
            channel_img_dir = os.path.join(IMAGE_DIR, channel_name)
            os.makedirs(channel_img_dir, exist_ok=True)
            
            img_filename = f"{message.id}.jpg"
            full_img_path = os.path.join(channel_img_dir, img_filename)
            
            # Download image if it doesn't exist
            if not os.path.exists(full_img_path):
                try:
                    await client.download_media(message, file=full_img_path)
                    image_path = full_img_path
                except Exception as e:
                    logger.error(f"Failed to download image for msg {message.id} in {channel_name}: {e}")
            else:
                image_path = full_img_path

        # Data extraction
        msg_data = {
            'message_id': message.id,
            'channel_name': channel_name,
            'message_date': message.date.isoformat(),
            'message_text': message.text,
            'views': message.views if message.views else 0,
            'forwards': message.forwards if message.forwards else 0,
            'has_media': has_media,
            'image_path': image_path
        }
        
        if msg_date_str not in grouped_messages:
            grouped_messages[msg_date_str] = []
        grouped_messages[msg_date_str].append(msg_data)
        message_count += 1

    # Save data to JSON files partitioned by date
    for date_str, messages in grouped_messages.items():
        date_dir = os.path.join(DATA_DIR, date_str)
        os.makedirs(date_dir, exist_ok=True)
        
        json_path = os.path.join(date_dir, f"{channel_name}.json")
        
        # If file exists, load it and append/update (simplified: just overwrite or append unique?)
        # For this task, let's just write the list we found. 
        # In a real incremental run, we'd need to merge. 
        # Here we just write what we fetched to ensure reproducibility of *this* run.
        
        try:
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(messages, f, ensure_ascii=False, indent=4)
        except Exception as e:
            logger.error(f"Error saving JSON for {channel_name} on {date_str}: {e}")

    logger.info(f"Finished scraping {channel_name}. Processed {message_count} messages.")
    print(f"Finished {channel_name}: {message_count} messages.")

async def main():
    if not API_ID or not API_HASH:
        logger.error("API_ID or API_HASH not found in environment variables.")
        print("Error: credentials not found.")
        return

    async with TelegramClient('medical_scraper_session', API_ID, API_HASH) as client:
        for channel in CHANNELS:
            await scrape_channel(client, channel)

if __name__ == '__main__':
    logger.info("Script started.")
    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
    logger.info("Script finished.")
