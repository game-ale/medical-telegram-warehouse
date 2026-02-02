# Medical Telegram Warehouse
**An End-to-End Data Pipeline for Ethiopian Medical Businesses**

## 📋 Project Overview
This project builds a robust data platform that generates actionable insights about Ethiopian medical businesses using data scraped from public Telegram channels. The pipeline implements a modern ELT (Extract, Load, Transform) architecture with the following components:

- **Task 1**: Data Scraping & Collection (Extract & Load) ✅ **COMPLETED**
- **Task 2**: Data Modeling & Transformation (dbt + PostgreSQL)
- **Task 3**: Data Enrichment with YOLO Object Detection
- **Task 4**: Analytical API with FastAPI
- **Task 5**: Pipeline Orchestration with Dagster

---

## ✅ Task 1: Data Scraping and Collection

### Overview
Task 1 implements a **Telegram scraper** that extracts messages and images from Ethiopian medical channels and stores them in a structured **Data Lake**. The scraper preserves raw data in its original form for downstream processing.

### Channels Scraped
- **CheMed123** - Medical products
- **lobelia4cosmetics** - Cosmetics and health products
- **tikvahpharma** - Pharmaceuticals
- **DoctorsET** - Medical professionals community
- **EAHCI** - Ethiopian Association of Health Care

### Key Features
✅ **Incremental data collection** from Telegram API  
✅ **Automated image downloading** with organized storage  
✅ **Date-partitioned JSON storage** for efficient querying  
✅ **Comprehensive logging** for observability  
✅ **Error handling** for network issues and rate limits  
✅ **Session-based authentication** (one-time OTP login)

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Telegram account
- API credentials from [my.telegram.org](https://my.telegram.org)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd medical-telegram-warehouse
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Linux/Mac
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   
   Create or edit `.env` file:
   ```env
   TG_API_ID=your_api_id_here
   TG_API_HASH=your_api_hash_here
   TG_PHONE=+251900000000  # Optional
   ```

   **⚠️ IMPORTANT**: Never commit `.env` or `*.session` files to git!

### Running the Scraper

**First-time run** (requires interactive login):
```bash
python src/scraper.py
```

You'll be prompted to:
1. Enter your phone number
2. Enter the OTP code sent to Telegram

After successful authentication, a `medical_scraper_session.session` file is created for future non-interactive runs.

**Subsequent runs** (automated):
```bash
python src/scraper.py
```

---

## 📁 Data Lake Structure

The scraper produces a **strict folder hierarchy** for organized data storage:

```
data/raw/
├── telegram_messages/
│   └── YYYY-MM-DD/              # Date partition
│       ├── CheMed123.json       # Channel-specific JSON
│       ├── lobelia4cosmetics.json
│       └── tikvahpharma.json
└── images/
    ├── CheMed123/               # Channel-specific folder
    │   ├── 123456.jpg          # message_id.jpg
    │   └── 123457.jpg
    ├── lobelia4cosmetics/
    └── tikvahpharma/
```

### JSON Schema

Each JSON file contains an **array of message objects** with the following structure:

```json
[
  {
    "message_id": 189986,
    "channel_name": "tikvahpharma",
    "message_date": "2026-02-02T05:25:08+00:00",
    "message_text": "TO BE SOLD PHARMACY...",
    "views": 117,
    "forwards": 0,
    "has_media": true,
    "image_path": "data/raw/images\\tikvahpharma\\189986.jpg"
  }
]
```

**Field Descriptions**:
- `message_id`: Unique Telegram message identifier (integer)
- `channel_name`: Channel username (string)
- `message_date`: ISO 8601 timestamp with timezone (string)
- `message_text`: Full message content, preserved as-is (string or null)
- `views`: Number of views on the message (integer, 0 if unavailable)
- `forwards`: Number of times the message was forwarded (integer, 0 if unavailable)
- `has_media`: Boolean indicating if message contains media (boolean)
- `image_path`: Relative path to downloaded image, or `null` if no image (string or null)

---

## 🪵 Logging

Logs are stored in the `logs/` directory with timestamps:

```
logs/
└── scraper_20260202_093549.log
```

**Log contents include**:
- Script start/end times
- Channel scraping progress
- Message counts per channel
- Error messages (rate limits, network failures, etc.)

**Example log output**:
```
2026-02-02 09:35:49,123 - INFO - Script started.
2026-02-02 09:35:51,456 - INFO - Starting scrape for channel: CheMed123
2026-02-02 09:36:02,789 - INFO - Finished scraping CheMed123. Processed 76 messages.
2026-02-02 09:36:45,012 - INFO - Script finished.
```

---

## 🧪 Data Quality & Validation

### Self-Test Checklist
Before considering Task 1 complete, verify:

- ✅ **Raw data is unchanged**: No transformations applied
- ✅ **dbt can load JSON easily**: Flat structure, consistent schema
- ✅ **YOLO can find images**: Images stored in predictable paths
- ✅ **Folder navigation is intuitive**: 10-second rule for reviewers

### Known Limitations

1. **Rate Limiting**: Telegram API has rate limits; the scraper handles basic retry logic but may pause on heavy usage.
2. **Message Limit**: Current implementation limits to 100 messages per channel (configurable in code).
3. **Media Types**: Only downloads photos (`.jpg`); videos and documents are not downloaded.
4. **Text Encoding**: Some special characters may appear with markdown formatting.

---

## 🔧 Technical Implementation

### Architecture
- **Library**: [Telethon](https://docs.telethon.dev/) - Async Python client for Telegram
- **Storage Format**: JSON (human-readable, dbt-compatible)
- **Image Format**: JPEG (compressed)
- **Logging**: Python `logging` module

### Error Handling
- **Network errors**: Logged and skipped
- **Missing fields**: Defaults to `0` (views/forwards) or `null` (image_path)
- **Empty messages**: Handled gracefully (text stored as `null` or empty string)
- **Rate limits**: Basic exception catching (future: exponential backoff)

### Code Organization
```
src/
└── scraper.py          # Main scraper logic
    ├── scrape_channel()    # Per-channel scraping
    ├── main()              # Orchestrates all channels
    └── Logging setup       # Configures log files
```

---

## 🔐 Security Best Practices

### Secrets Management
- **Never commit** `.env` or `*.session` files
- **Use environment variables** for all credentials
- **Review `.gitignore`** before committing

### Gitignore Coverage
```
.env
*.session
*.session-journal
venv/
__pycache__/
*.log
```

---

## 📊 Sample Output

After running the scraper:

```bash
Scraping CheMed123...
Finished CheMed123: 76 messages.
Scraping lobelia4cosmetics...
Finished lobelia4cosmetics: 100 messages.
Scraping tikvahpharma...
Finished tikvahpharma: 100 messages.
Scraping DoctorsET...
Finished DoctorsET: 100 messages.
Scraping EAHCI...
Finished EAHCI: 100 messages.
```

**Data collected**:
- 476+ messages across 5 channels
- 148+ date partitions (2022-2026)
- Images downloaded and organized by channel

---

## 🔄 Reproducibility

### Single-Command Execution
```bash
python src/scraper.py
```

### Re-running the Scraper
The scraper is **idempotent** for a given run. Re-running will:
- Overwrite JSON files for the same date/channel
- Re-download images (if already exist, they're skipped in current implementation)
- Append to the log file

**Best Practice**: For incremental updates, modify the `limit` parameter in `client.iter_messages()` or implement date-based filtering.

---

## 🎯 Next Steps

With Task 1 complete, the raw data is ready for:

### Task 2: Data Modeling & Transformation
- Load JSON into PostgreSQL (`raw.telegram_messages` table)
- Design Star Schema (Fact + Dimension tables)
- Use dbt to transform raw → staging → marts
- Implement data quality tests

### Task 3: YOLO Object Detection
- Analyze images downloaded in Task 1
- Classify images (promotional, product_display, etc.)
- Store detection results in the warehouse

### Task 4: FastAPI Analytical API
- Expose insights via REST endpoints
- Query the transformed data marts

### Task 5: Dagster Orchestration
- Automate the entire pipeline
- Schedule daily scraping runs

---

## 📞 Support & Contributing

For questions or issues:
- Review logs in `logs/`
- Check `.env` configuration
- Verify Telegram API credentials
- Ensure network connectivity

---

## 📄 License

This project is part of the Kara Solutions Data Engineering challenge.

---

**Status**: Task 1 ✅ Complete | Last Updated: 2026-02-02
