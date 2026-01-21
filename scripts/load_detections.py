import os
import csv
import psycopg2
from dotenv import load_dotenv
from loguru import logger

load_dotenv()

# Database Connection
DB_NAME = os.getenv("POSTGRES_DB", "medical_warehouse")
DB_USER = os.getenv("POSTGRES_USER", "postgres")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
DB_HOST = os.getenv("POSTGRES_HOST", "localhost")
DB_PORT = os.getenv("POSTGRES_PORT", "5432")

INPUT_FILE = "data/raw/yolo_detections.csv"

def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT
        )
        return conn
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")
        return None

def create_table(conn):
    try:
        cur = conn.cursor()
        # Drop and recreate raw schema for clean slate in validation
        cur.execute("CREATE SCHEMA IF NOT EXISTS raw;")
        
        create_query = """
        DROP TABLE IF EXISTS raw.yolo_detections;
        CREATE TABLE raw.yolo_detections (
            message_id BIGINT PRIMARY KEY,
            image_path TEXT,
            detected_class TEXT,
            confidence_score FLOAT,
            image_category TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        cur.execute(create_query)
        conn.commit()
        cur.close()
        logger.info("Table 'raw.yolo_detections' refined.")
    except Exception as e:
        logger.error(f"Error creating table: {e}")

def load_detections(conn):
    if not os.path.exists(INPUT_FILE):
        logger.error(f"Input file not found: {INPUT_FILE}")
        return

    try:
        cur = conn.cursor()
        count = 0
        
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                insert_query = """
                INSERT INTO raw.yolo_detections (message_id, image_path, detected_class, confidence_score, image_category)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (message_id) DO UPDATE 
                SET image_path = EXCLUDED.image_path,
                    detected_class = EXCLUDED.detected_class,
                    confidence_score = EXCLUDED.confidence_score,
                    image_category = EXCLUDED.image_category;
                """
                
                cur.execute(insert_query, (
                    row['message_id'], 
                    row['image_path'], 
                    row['detected_class'], 
                    row['confidence_score'], 
                    row['image_category']
                ))
                count += 1
            
        conn.commit()
        cur.close()
        logger.success(f"Successfully loaded {count} detection records from CSV to PostgreSQL.")
        
    except Exception as e:
        logger.error(f"Error loading detections: {e}")

if __name__ == "__main__":
    conn = get_db_connection()
    if conn:
        create_table(conn)
        load_detections(conn)
        conn.close()

