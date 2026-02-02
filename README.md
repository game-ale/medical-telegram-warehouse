# Medical Data Warehouse

End-to-end data pipeline for Telegram medical channel analytics, featuring data scraping, transformation, YOLO-based image enrichment, and a REST API.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technologies](#technologies)

---

## Overview

This project builds a complete data warehouse pipeline:

1. **Extract**: Scrape messages and images from Telegram medical channels
2. **Load**: Store raw data in PostgreSQL
3. **Transform**: Clean and model data using dbt (star schema)
4. **Enrich**: Classify images using YOLOv8 object detection
5. **Serve**: Expose insights via FastAPI REST endpoints

**Key Features:**
- 📊 Dimensional data modeling (fact & dimension tables)
- 🖼️ Image classification (promotional, product_display, lifestyle, other)
- 🔍 Full-text message search
- 📈 Channel activity analytics
- ✅ Data quality tests with dbt

---

## Architecture

```
Telegram Channels
      ↓
[Scraper (Telethon)] → data/raw/
      ↓
[PostgreSQL (raw schema)]
      ↓
[dbt Transformations] → public_marts schema
      ↓                    ├── dim_channels
      ↓                    ├── dim_dates
      ↓                    ├── fct_messages
      ↓                    └── fct_image_detections
[FastAPI] → REST Endpoints
```

**Data Model (Star Schema):**
- **Fact Tables**: `fct_messages`, `fct_image_detections`
- **Dimension Tables**: `dim_channels`, `dim_dates`

---

## Setup & Installation

### Prerequisites

- Python 3.8+
- Docker & Docker Compose
- Telegram API credentials ([get them here](https://my.telegram.org))

### 1. Clone & Environment Setup

```bash
cd C:\tele\medical-telegram-warehouse

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create `.env` file in project root:

```env
# Telegram API
API_ID=your_api_id
API_HASH=your_api_hash
PHONE_NUMBER=your_phone_number

# PostgreSQL
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=medical_warehouse
```

### 3. Start PostgreSQL

```bash
docker-compose up -d
```

Verify database is running:
```bash
docker exec -it medical_postgres psql -U postgres -d medical_warehouse
```

### 4. Run the Pipeline

#### Step 1: Scrape Data
```bash
python src/scraper.py
```
- Scrapes messages from configured channels
- Downloads images to `data/raw/images/`
- Saves metadata to `data/raw/telegram_messages/`

#### Step 2: Load to Database
```bash
python scripts/load_to_postgres.py
```
- Creates `raw.telegram_messages` table
- Loads JSON data into PostgreSQL

#### Step 3: Transform with dbt
```bash
python scripts/dbt_wrapper.py run
python scripts/dbt_wrapper.py test
```
- Builds staging and mart models
- Runs data quality tests

#### Step 4: YOLO Image Enrichment
```bash
# Run object detection
python src/yolo_detect.py

# Load detections to database
python scripts/load_yolo_to_postgres.py

# Rebuild dbt models with YOLO data
python scripts/dbt_wrapper.py run
```

#### Step 5: Start API
```bash
uvicorn api.main:app --reload --port 8000
```

Access Swagger UI: **http://127.0.0.1:8000/docs**

---

## Usage Guide

### Scraping New Channels

Edit `src/scraper.py` to add channels:

```python
CHANNELS = [
    'CheMed123',
    'DoctorsET',
    'your_new_channel'
]
```

### Running dbt Commands

Always use the wrapper script to load environment variables:

```bash
# Run models
python scripts/dbt_wrapper.py run

# Run tests
python scripts/dbt_wrapper.py test

# Generate documentation
python scripts/dbt_wrapper.py docs generate
python scripts/dbt_wrapper.py docs serve
```

### Querying the Warehouse

```sql
-- Connect to database
docker exec -it medical_postgres psql -U postgres -d medical_warehouse

-- Top channels by messages
SELECT channel_name, total_posts, avg_views
FROM public_marts.dim_channels
ORDER BY total_posts DESC;

-- Messages with promotional images
SELECT m.message_text, i.image_category, i.detected_object
FROM public_marts.fct_messages m
JOIN public_marts.fct_image_detections i ON m.message_id = i.message_id
WHERE i.image_category = 'promotional';
```

---

## API Documentation

### Base URL
```
http://127.0.0.1:8000
```

### Endpoints

#### 1. Top Products
```http
GET /api/reports/top-products?limit=10
```

**Response:**
```json
[
  {
    "keyword": "telegram",
    "frequency": 207
  },
  {
    "keyword": "pharmacy",
    "frequency": 116
  }
]
```

#### 2. Channel Activity
```http
GET /api/channels/{channel_name}/activity
```

**Example:**
```bash
curl http://127.0.0.1:8000/api/channels/CheMed123/activity
```

**Response:**
```json
{
  "channel_name": "CheMed123",
  "total_messages": 98,
  "avg_views": 1234.5,
  "first_post_date": "2022-12-13T00:00:00",
  "last_post_date": "2023-02-10T00:00:00"
}
```

#### 3. Message Search
```http
GET /api/search/messages?query=product&limit=20
```

**Response:**
```json
{
  "total": 2,
  "data": [
    {
      "message_id": 123,
      "channel_name": "CheMed123",
      "message_date": "2023-01-15T10:30:00",
      "message_text": "New product available...",
      "view_count": 1500
    }
  ]
}
```

#### 4. Visual Content Stats
```http
GET /api/reports/visual-content
```

**Response:**
```json
[
  {
    "channel_name": "CheMed123",
    "image_category": "product_display",
    "count": 19
  },
  {
    "channel_name": "DoctorsET",
    "image_category": "promotional",
    "count": 32
  }
]
```

### Testing the API

**Option 1: Swagger UI**
Visit http://127.0.0.1:8000/docs

**Option 2: Python Script**
```bash
python scripts/test_api.py
```

**Option 3: curl**
```bash
curl http://127.0.0.1:8000/api/reports/top-products
```

---

## Project Structure

```
medical-telegram-warehouse/
├── api/
│   ├── __init__.py
│   ├── main.py              # FastAPI app & endpoints
│   ├── database.py          # SQLAlchemy connection
│   └── schemas.py           # Pydantic models
├── data/
│   ├── raw/
│   │   ├── images/          # Downloaded images
│   │   └── telegram_messages/  # Scraped JSON
│   └── yolo/
│       └── image_detections.csv  # YOLO results
├── medical_warehouse/       # dbt project
│   ├── models/
│   │   ├── staging/
│   │   │   ├── stg_telegram_messages.sql
│   │   │   └── stg_yolo_detections.sql
│   │   └── marts/
│   │       ├── dim_channels.sql
│   │       ├── dim_dates.sql
│   │       ├── fct_messages.sql
│   │       └── fct_image_detections.sql
│   ├── dbt_project.yml
│   └── profiles.yml
├── scripts/
│   ├── dbt_wrapper.py       # dbt command wrapper
│   ├── load_to_postgres.py # Raw data loader
│   ├── load_yolo_to_postgres.py
│   ├── generate_yolo_report.py
│   └── test_api.py
├── src/
│   ├── scraper.py           # Telegram scraper
│   └── yolo_detect.py       # Image classification
├── .env                     # Environment variables (gitignored)
├── .gitignore
├── docker-compose.yml       # PostgreSQL container
├── requirements.txt
└── README.md
```

---

## Technologies

| Component | Technology |
|-----------|-----------|
| **Scraping** | Telethon (Telegram API) |
| **Database** | PostgreSQL 15 |
| **Transformation** | dbt (data build tool) |
| **ML/AI** | YOLOv8 (Ultralytics) |
| **API** | FastAPI + Uvicorn |
| **ORM** | SQLAlchemy |
| **Validation** | Pydantic |
| **Containerization** | Docker |

---

## Data Quality & Testing

The project includes comprehensive dbt tests:

```bash
# Run all tests
python scripts/dbt_wrapper.py test
```

**Tests include:**
- `not_null` checks on primary keys
- Referential integrity (foreign key relationships)
- Custom business logic (e.g., no future message dates)

---

## YOLO Image Classification

Images are classified into 4 categories based on detected objects:

| Category | Rule |
|----------|------|
| **promotional** | Person detected with confidence > 0.8 |
| **product_display** | Product-like objects (bottle, book, etc.) |
| **lifestyle** | Person detected with confidence 0.4-0.8 |
| **other** | No significant objects or low confidence |

**Example:**
```bash
# Run detection on all images
python src/yolo_detect.py

# View results
head data/yolo/image_detections.csv
```

---

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart container
docker-compose restart

# View logs
docker logs medical_postgres
```

### dbt Errors
```bash
# Always use the wrapper script
python scripts/dbt_wrapper.py run

# NOT: dbt run (this won't load .env)
```

### API Not Starting
```bash
# Check if port 8000 is available
netstat -ano | findstr :8000

# Kill process if needed
taskkill /PID <process_id> /F
```

---

## Next Steps

- [ ] Add Dagster for pipeline orchestration
- [ ] Implement incremental data loads
- [ ] Add more analytical endpoints
- [ ] Create data visualization dashboard
- [ ] Set up CI/CD pipeline

---

## License

MIT License - See LICENSE file for details

---

## Contact

For questions or issues, please open a GitHub issue or contact the maintainer.
