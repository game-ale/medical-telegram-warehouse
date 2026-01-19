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
2.  **Load**: Store raw data in a Data Lake (JSON) and then load into `PostgreSQL` (Raw Layer).
3.  **Transform**: Clean and model data into a Star Schema using `dbt` (Staging & Marts).
4.  **Enrich**: unique object detection on product images using `YOLOv8`.
5.  **Serve**: Expose insights via a `FastAPI` analytical interface.
6.  **Orchestrate**: Manage the entire workflow with `Dagster`.

---

## 🏗️ Architecture

```mermaid
graph LR
    TG[Telegram API] --> |Scraper| DL[Data Lake (JSON + Images)]
    DL --> |Loader| RawDB[(PostgreSQL Raw)]
    RawDB --> |dbt| Staging[Staging Views]
    Staging --> |dbt| Marts[Star Schema DW]
    DL --> |YOLOv8| ML[Object Detection]
    ML --> |Enrichment| Marts
    Marts --> |FastAPI| API[Analytical API]
    API --> User
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Docker & Docker Compose** (or local PostgreSQL)
- **Telegram API Credentials** (Get them from [my.telegram.org](https://my.telegram.org))
- **dbt-postgres**

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
Fill in your Telegram credentials (`TG_API_ID`, `TG_API_HASH`, `TG_PHONE`) and Database connection details.

---

## 🛠️ Usage

### Task 1: Data Scraping (Extract)

Run the scraper to collect data from channels like `CheMed123`, `DoctorsET`, `MohEthiopia`, etc.
```bash
python src/scraper.py
```
This saves JSON files to `data/raw/telegram_messages/` and images to `data/raw/images/`.

### Task 2: Data Transformation (ELT with dbt)

**1. Load Raw Data to Database:**
Ingest the JSON files into the `raw.telegram_messages` table in PostgreSQL.
```bash
python scripts/load_to_postgres.py
```

**2. Run dbt Models:**
Transformation happens in the `medical_warehouse` directory.
```bash
cd medical_warehouse
dbt deps      # Install dependencies (dbt_utils)
dbt build     # Run models and tests
```

**3. Generate Documentation:**
Visualize the lineage and schema.
```bash
dbt docs generate
dbt docs serve
```

---

## 📊 Data Model (Star Schema)

Our Data Warehouse is organized into a Star Schema optimized for analytics:

### Fact Table
-   **`fct_messages`**: Central table containing individual messages, view counts, and metrics.

### Dimension Tables
-   **`dim_channels`**: Channel metadata, including calculated metrics like `total_posts` and `avg_views`.
-   **`dim_dates`**: Date dimension with `day`, `month`, `year`, `quarter`, and `is_weekend` flags.

---

## � Current Status

- **[x] Task 1: Data Scraping & Collection**
    - Scraper implemented and validated.
    - Successfully extracting from 5+ major Ethiopian medical channels.
- **[x] Task 2: Data Modeling (dbt)**
    - Raw data loading pipeline (JSON -> Postgres).
    - Star Schema implemented (`dim_channels`, `dim_dates`, `fct_messages`).
    - Comprehensive data quality tests (Unique, Not Null, Relationships).
- **[ ] Task 3: Object Detection (YOLO)** (Next)
- **[ ] Task 4: API Development**
- **[ ] Task 5: Orchestration**

---

## 🤝 Contribution
This project is part of the 10 Academy Weekly Challenge suitable for Portfolio Construction.
