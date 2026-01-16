import os
import json
import logging
from datetime import datetime
from telethon import TelegramClient
from telethon.tl.types import MessageMediaPhoto
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='../medical-telegram-warehouse/.env')

API_ID = os.getenv('TG_API_ID')
API_HASH = os.getenv('TG_API_HASH')
SESSION_NAME = 'medical_scraper_session'

# Channels to scrape
CHANNELS = [
    'https://t.me/CheMed123', # Placeholder - verify actual handle from description or search
    'https://t.me/lobelia4cosmetics',
    'https://t.me/tikvahpharma',
    # Add more channels here
]

# Set up logging
LOG_DIR = '../medical-telegram-warehouse/logs'
os.makedirs(LOG_DIR, exist_ok=True)
logging.basicConfig(
    filename=os.path.join(LOG_DIR, 'scraper.log'),
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Data directories
RAW_DATA_DIR = '../medical-telegram-warehouse/data/raw/telegram_messages'
IMAGE_DIR = '../medical-telegram-warehouse/data/raw/images'

async def scrape_channel(client: TelegramClient, channel_url: str):
    try:
        logging.info(f"Starting scrape for {channel_url}")
        entity = await client.get_entity(channel_url)
        channel_name = entity.username or entity.id
        
        # Prepare directories
        today = datetime.now().strftime('%Y-%m-%d')
        channel_img_dir = os.path.join(IMAGE_DIR, str(channel_name))
        os.makedirs(channel_img_dir, exist_ok=True)
        
        json_dir = os.path.join(RAW_DATA_DIR, today)
        os.makedirs(json_dir, exist_ok=True)
        
        messages_data = []
        
        async for message in client.iter_messages(entity, limit=100): # Limit for initial testing
            msg_data = {
                'id': message.id,
                'date': message.date.isoformat(),
                'message': message.message,
                'views': message.views,
                'forwards': message.forwards,
                'media_path': None
            }
            
            if message.media and isinstance(message.media, MessageMediaPhoto):
                # Download image
                img_filename = f"{message.id}.jpg"
                img_path = os.path.join(channel_img_dir, img_filename)
                await client.download_media(message, file=img_path)
                msg_data['media_path'] = img_path
            
            messages_data.append(msg_data)
            
        # Save JSON
        json_file = os.path.join(json_dir, f"{channel_name}.json")
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(messages_data, f, ensure_ascii=False, indent=4)
            
        logging.info(f"Successfully scraped {len(messages_data)} messages from {channel_name}")
        
    except Exception as e:
        logging.error(f"Error scraping {channel_url}: {e}")

async def main():
    if not API_ID or not API_HASH:
        print("Error: TG_API_ID or TG_API_HASH not found in .env")
        return

    async with TelegramClient(SESSION_NAME, API_ID, API_HASH) as client:
        for channel in CHANNELS:
            await scrape_channel(client, channel)

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())
