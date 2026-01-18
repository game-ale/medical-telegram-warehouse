import os
import json
import asyncio
from datetime import datetime
from telethon import TelegramClient
from telethon.tl.types import MessageMediaPhoto
from dotenv import load_dotenv
from loguru import logger

# Load environment variables
load_dotenv()

# Configuration
API_ID = os.getenv('TG_API_ID')
API_HASH = os.getenv('TG_API_HASH')
PHONE = os.getenv('TG_PHONE')
DATA_DIR = "data/raw"
LOG_DIR = "logs"

# Ensure directories exist
os.makedirs(f"{DATA_DIR}/telegram_messages", exist_ok=True)
os.makedirs(f"{DATA_DIR}/images", exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)

# Configure logging
logger.add(f"{LOG_DIR}/scraper.log", rotation="10 MB", level="INFO")

# Channels to scrape
CHANNELS = [
    'CheMed123',         # CheMed Telegram Channel (Assuming this is the username, verify)
    'lobelia4cosmetics', # Lobelia Cosmetics
    'tikvahpharma',      # Tikvah Pharma
    # Add more channels here
]

async def scrape_channel(client, channel_name):
    logger.info(f"Starting scrape for channel: {channel_name}")
    
    today_str = datetime.now().strftime('%Y-%m-%d')
    channel_msg_dir = f"{DATA_DIR}/telegram_messages/{today_str}"
    os.makedirs(channel_msg_dir, exist_ok=True)
    
    image_dir = f"{DATA_DIR}/images/{channel_name}"
    os.makedirs(image_dir, exist_ok=True)

    messages_data = []
    
    try:
        # Get entity to ensure we can access the channel
        entity = await client.get_entity(channel_name)
        
        async for message in client.iter_messages(entity, limit=100): # Limit to 100 for dev/testing, remove or increase for prod
            msg_data = {
                "message_id": message.id,
                "channel_name": channel_name,
                "date": message.date.isoformat(),
                "message_text": message.text,
                "views": message.views,
                "forwards": message.forwards,
                "has_media": False,
                "image_path": None
            }

            if message.media and isinstance(message.media, MessageMediaPhoto):
                msg_data["has_media"] = True
                image_filename = f"{message.id}.jpg"
                image_path = os.path.join(image_dir, image_filename)
                
                # Check if already downloaded
                if not os.path.exists(image_path):
                    logger.info(f"Downloading image for message {message.id} in {channel_name}")
                    await client.download_media(message, file=image_path)
                
                msg_data["image_path"] = image_path

            messages_data.append(msg_data)

        # Save to JSON
        output_file = f"{channel_msg_dir}/{channel_name}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(messages_data, f, ensure_ascii=False, indent=4)
        
        logger.info(f"Saved {len(messages_data)} messages for {channel_name} to {output_file}")

    except Exception as e:
        logger.error(f"Error scraping {channel_name}: {e}")

async def main():
    if not API_ID or not API_HASH:
        logger.error("API_ID and API_HASH must be set in .env file")
        return

    client = TelegramClient('anon', API_ID, API_HASH)
    
    await client.start(phone=PHONE)
    
    logger.info("Client started. Beginning scrape...")
    
    for channel in CHANNELS:
        await scrape_channel(client, channel)
        
    logger.info("Scraping completed.")
    await client.disconnect()

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
