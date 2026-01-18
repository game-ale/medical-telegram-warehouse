# Medical Telegram Warehouse 🏥💊

**An end-to-end data engineering pipeline for extracting, transforming, and analyzing medical business data from Ethiopian Telegram channels.**

---

## 📖 Overview

The **Medical Telegram Warehouse** is a data product designed to collect, store, and analyze real-time data from public Telegram channels focusing on the Ethiopian medical and pharmaceutical market.

The system answers key business questions such as:
- What are the trending medical products?
- How does pricing vary across channels?
- Which channels have the highest engagement?
- What are the visual trends in product marketing?

This project follows a modern **ELT (Extract, Load, Transform)** architecture:
1.  **Extract**: Scrape raw messages and images from Telegram using `Telethon`.
2.  **Load**: Store raw data in a Data Lake (JSON) and then load into `PostgreSQL`.
3.  **Transform**: Clean and model data into a Star Schema using `dbt`.
4.  **Enrich**: unique object detection on product images using `YOLOv8`.
5.  **Serve**: Expose insights via a `FastAPI` analytical interface.
6.  **Orchestrate**: Manage the entire workflow with `Dagster`.

---

## 🏗️ Architecture

```mermaid
graph LR
    TG[Telegram API] --> |Scraper| DL[Data Lake (JSON + Images)]
    DL --> |Loader| DB[(PostgreSQL DW)]
    DB --> |dbt| Marts[Data Marts (Star Schema)]
    DL --> |YOLOv8| ML[Object Detection]
    ML --> |Enrichment| DB
    Marts --> |FastAPI| API[Analytical API]
    API --> User
```

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Docker & Docker Compose**
- **PostgreSQL** (if running locally without Docker)
- **Telegram API Credentials** (Get them from [my.telegram.org](https://my.telegram.org))

### 1. Installation

Clone the repository:
```bash
git clone https://github.com/game-ale/medical-telegram-warehouse.git
cd medical-telegram-warehouse
```

Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

### 2. Configuration

Create a `.env` file from the example:
```bash
cp .env.example .env
```

**Critical Step**: Open `.env` and fill in your Telegram credentials:
```ini
TG_API_ID=12345678
TG_API_HASH=your_secret_hash_here
TG_PHONE=+251911223344
```

### 3. Running the Scraper (Task 1)

To start collecting data:
```bash
python src/scraper.py
```
*Note: On the first run, you will be prompted to enter a login code sent to your Telegram account.*

This will populate the **Data Lake**:
- Messages: `data/raw/telegram_messages/YYYY-MM-DD/channel_name.json`
- Images: `data/raw/images/channel_name/message_id.jpg`

---

## 📂 Project Structure

```
medical-telegram-warehouse/
├── data/
│   └── raw/               # The Data Lake
│       ├── images/        # Downloaded images organized by channel
│       └── telegram_messages/ # Daily JSON dumps of channel messages
├── medical_warehouse/     # dbt project (Task 2)
│   ├── models/            # Staging and Marts models
│   └── seeds/             # Static reference data
├── src/
│   ├── scraper.py         # Telegram data extraction script
│   └── ...
├── api/                   # FastAPI application (Task 4)
├── scripts/               # Helper scripts
├── tests/                 # Unit and data tests
├── docker-compose.yml     # Service orchestration
└── requirements.txt       # Python dependencies
```

## 📊 Current Status

- **[x] Task 1: Data Scraping & Collection**
    - Scraper implemented and validated.
    - Data Lake structure established.
    - Successfully extracting text, metadata, and images.
- **[ ] Task 2: Data Modeling (dbt)** (In Progress)
    - Loading JSON to Postgres.
    - Designing Star Schema (`dim_channels`, `fct_messages`).
- **[ ] Task 3: Object Detection (YOLO)**
- **[ ] Task 4: API Development**
- **[ ] Task 5: Orchestration (Dagster)**

---

## 🤝 Contribution
This project is part of the 10 Academy Weekly Challenge suitable for Portfolio Construction.
