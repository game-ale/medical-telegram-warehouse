# Medical Data Warehouse & Analytical API

An end-to-end data pipeline for Telegram, leveraging dbt for transformation, Dagster for orchestration, and YOLOv8 for data enrichment.

## Project Overview
This project builds a robust data platform to generate actionable insights about Ethiopian medical businesses using data scraped from public Telegram channels.

## Key Features
- **Data Scraping**: Extracts messages and images from Telegram using Telethon.
- **Data Lake**: Stores raw data in a structured JSON/Image format.
- **Data Warehouse**: Transforms and models data into a Star Schema using dbt.
- **Data Enrichment**: Uses YOLOv8 for object detection on product images.
- **Analytical API**: Exposes insights via FastAPI.
- **Orchestration**: Manages the pipeline using Dagster.

## Structure
```
medical-telegram-warehouse/
├── data/               # Raw and processed data
├── medical_warehouse/  # dbt project
├── src/                # Python source code (scraper, yolo, etc.)
├── api/                # FastAPI application
├── scripts/            # Helper scripts
└── ...
```

## Setup
1. **Clone the repository**
2. **Install dependencies**: `pip install -r requirements.txt`
3. **Configure Environment**: Copy `.env` and add your Telegram API credentials.
4. **Run Scraper**: `python src/scraper.py`
