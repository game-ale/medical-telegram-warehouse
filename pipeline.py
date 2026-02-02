"""
Medical Data Warehouse Pipeline - Dagster Orchestration

This pipeline orchestrates the entire data flow:
1. Scrape Telegram channels
2. Load raw data to PostgreSQL
3. Run dbt transformations
4. Enrich with YOLO image detection
"""

import os
import subprocess
from dagster import op, job, schedule, ScheduleDefinition, get_dagster_logger

# ===== OPERATIONS (OPS) =====

@op
def scrape_telegram_data():
    """
    Op 1: Scrape messages and images from Telegram channels.
    Calls: src/scraper.py
    """
    logger = get_dagster_logger()
    logger.info("Starting Telegram data scraping...")
    
    try:
        result = subprocess.run(
            ["python", "src/scraper.py"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info(f"Scraping completed successfully")
        logger.info(f"Output: {result.stdout[:200]}")
        return "scrape_complete"
    except subprocess.CalledProcessError as e:
        logger.error(f"Scraping failed: {e.stderr}")
        raise


@op
def load_raw_to_postgres(context, scrape_status):
    """
    Op 2: Load scraped JSON data into PostgreSQL raw schema.
    Calls: scripts/load_to_postgres.py
    """
    logger = get_dagster_logger()
    logger.info("Loading raw data to PostgreSQL...")
    
    try:
        result = subprocess.run(
            ["python", "scripts/load_to_postgres.py"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info("Data loaded to raw.telegram_messages")
        logger.info(f"Output: {result.stdout[:200]}")
        return "load_complete"
    except subprocess.CalledProcessError as e:
        logger.error(f"Loading failed: {e.stderr}")
        raise


@op
def run_dbt_transformations(context, load_status):
    """
    Op 3: Run dbt models to transform raw data into marts.
    Calls: scripts/dbt_wrapper.py run
    """
    logger = get_dagster_logger()
    logger.info("Running dbt transformations...")
    
    try:
        # Run dbt models
        result = subprocess.run(
            ["python", "scripts/dbt_wrapper.py", "run"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info("dbt models built successfully")
        
        # Run dbt tests
        test_result = subprocess.run(
            ["python", "scripts/dbt_wrapper.py", "test"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info("dbt tests passed")
        return "dbt_complete"
    except subprocess.CalledProcessError as e:
        logger.error(f"dbt failed: {e.stderr}")
        raise


@op
def run_yolo_enrichment(context, dbt_status):
    """
    Op 4: Run YOLO object detection and load results.
    Calls: src/yolo_detect.py -> scripts/load_yolo_to_postgres.py
    """
    logger = get_dagster_logger()
    logger.info("Running YOLO image detection...")
    
    try:
        # Run YOLO detection
        result = subprocess.run(
            ["python", "src/yolo_detect.py"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info("YOLO detection completed")
        
        # Load detections to database
        load_result = subprocess.run(
            ["python", "scripts/load_yolo_to_postgres.py"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info("YOLO detections loaded to database")
        
        # Rebuild dbt models with YOLO data
        dbt_result = subprocess.run(
            ["python", "scripts/dbt_wrapper.py", "run", "--select", "+fct_image_detections"],
            capture_output=True,
            text=True,
            check=True
        )
        logger.info("dbt models updated with YOLO data")
        return "yolo_complete"
    except subprocess.CalledProcessError as e:
        logger.error(f"YOLO enrichment failed: {e.stderr}")
        raise


# ===== JOB DEFINITION =====

@job(description="End-to-end medical data warehouse pipeline")
def medical_data_pipeline():
    """
    Main pipeline job that orchestrates all operations in sequence.
    
    Flow:
    scrape_telegram_data → load_raw_to_postgres → run_dbt_transformations → run_yolo_enrichment
    """
    scrape_status = scrape_telegram_data()
    load_status = load_raw_to_postgres(scrape_status)
    dbt_status = run_dbt_transformations(load_status)
    run_yolo_enrichment(dbt_status)


# ===== SCHEDULING =====

@schedule(
    cron_schedule="0 2 * * *",  # Daily at 2:00 AM
    job=medical_data_pipeline,
    execution_timezone="Africa/Addis_Ababa"  # Ethiopia timezone (EAT, UTC+3)
)
def daily_pipeline_schedule(context):
    """
    Schedule the pipeline to run daily at 2 AM.
    """
    return {}


# ===== ALTERNATIVE: Manual Trigger Schedule =====

# Uncomment this for testing (runs every 5 minutes)
# @schedule(
#     cron_schedule="*/5 * * * *",
#     job=medical_data_pipeline,
# )
# def test_pipeline_schedule(context):
#     return {}
