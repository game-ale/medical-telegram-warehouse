import os
import subprocess
from dagster import asset, AssetExecutionContext
from loguru import logger

@asset(group_name="extraction")
def telegram_messages(context: AssetExecutionContext):
    """
    Scrapes messages and images from Telegram channels.
    """
    context.log.info("Starting Telegram scraping...")
    result = subprocess.run(["python", "src/scraper.py"], capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"Scraper failed: {result.stderr}")
    context.log.info(result.stdout)
    return "data/raw/telegram_messages"

@asset(deps=[telegram_messages], group_name="enrichment")
def yolo_detections(context: AssetExecutionContext):
    """
    Performs object detection on scraped images using YOLOv8.
    """
    context.log.info("Starting YOLO detection...")
    result = subprocess.run(["python", "src/yolo_detect.py"], capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"YOLO detection failed: {result.stderr}")
    context.log.info(result.stdout)
    return "data/raw/yolo_detections.csv"

@asset(deps=[telegram_messages], group_name="ingestion")
def postgres_raw_messages(context: AssetExecutionContext):
    """
    Loads raw telegram JSON data into PostgreSQL raw schema.
    """
    context.log.info("Loading messages to Postgres...")
    result = subprocess.run(["python", "scripts/load_to_postgres.py"], capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"Postgres loading failed: {result.stderr}")
    context.log.info(result.stdout)
    return "raw.telegram_messages"

@asset(deps=[yolo_detections], group_name="ingestion")
def postgres_yolo_detections(context: AssetExecutionContext):
    """
    Loads YOLO detection CSV results into PostgreSQL raw schema.
    """
    context.log.info("Loading YOLO detections to Postgres...")
    result = subprocess.run(["python", "scripts/load_detections.py"], capture_output=True, text=True)
    if result.returncode != 0:
        raise Exception(f"YOLO loading failed: {result.stderr}")
    context.log.info(result.stdout)
    return "raw.yolo_detections"

@asset(deps=[postgres_raw_messages, postgres_yolo_detections], group_name="transformation")
def dbt_marts(context: AssetExecutionContext):
    """
    Runs dbt build to transform raw data into star schema marts.
    """
    context.log.info("Running dbt build...")
    # Change directory to project root where profiles.yml is or use --profiles-dir
    result = subprocess.run(["dbt", "build", "--profiles-dir", "."], capture_output=True, text=True)
    if result.returncode != 0:
         context.log.error(result.stderr)
         raise Exception(f"dbt build failed: {result.stderr}")
    context.log.info(result.stdout)
    return "public.marts"
