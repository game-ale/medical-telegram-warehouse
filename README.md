# Medical Data Warehouse

## Overview
This project builds a robust data pipeline to extract, transform, and analyze data from Ethiopian medical Telegram channels.

## Project Structure
- `src/`: Source code for scraping and analysis.
- `data/raw/`: Raw data storage (Data Lake).
    - `telegram_messages/`: JSON data partitioned by date.
    - `images/`: Downloaded images organized by channel.
- `logs/`: Execution logs.
- `medical_warehouse/`: dbt project for data transformation.
- `api/`: FastAPI application.

## Prerequisites
- Python 3.8+
- Telegram API Credentials (API_ID, API_HASH)

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure `.env`:
   ```env
   TG_API_ID=your_api_id
   TG_API_HASH=your_api_hash
   TG_PHONE=your_phone
   ```

## Usage
Run the scraper:
```bash
python src/scraper.py
```

## Data Lake Structure
The scraper produces data in the following format:
- **Messages**: `data/raw/telegram_messages/YYYY-MM-DD/channel_name.json`
- **Images**: `data/raw/images/channel_name/message_id.jpg`

## Logging
Logs are stored in the `logs/` directory.
