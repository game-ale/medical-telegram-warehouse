import os
import csv
import logging
import psycopg2
from psycopg2 import sql, extras
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(
    filename='scripts/loader.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT') or "5432"
DB_NAME = os.getenv('DB_NAME')

CSV_FILE = 'data/yolo/image_detections.csv'

def get_db_connection():
    try:
        conn = psycopg2.connect(
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            client_encoding='utf8'
        )
        return conn
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        raise

def init_yolo_schema(conn):
    """
    Creates 'raw.yolo_detections' table.
    """
    with conn.cursor() as cur:
        cur.execute("CREATE SCHEMA IF NOT EXISTS raw;")
        cur.execute("DROP TABLE IF EXISTS raw.yolo_detections CASCADE;")
        cur.execute("""
            CREATE TABLE raw.yolo_detections (
                id SERIAL PRIMARY KEY,
                message_id BIGINT,
                channel_name TEXT,
                image_path TEXT,
                detected_object TEXT,
                confidence_score DOUBLE PRECISION,
                image_category TEXT,
                loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    logger.info("Table 'raw.yolo_detections' initialized.")

def load_detections(conn):
    """
    Reads CSV and loads into DB.
    """
    if not os.path.exists(CSV_FILE):
        logger.error(f"CSV file not found: {CSV_FILE}")
        return

    all_rows = []
    
    try:
        with open(CSV_FILE, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Handle potential empty message_id if image parsing failed
                try:
                    mid = int(row['message_id']) if row['message_id'] else None
                except ValueError:
                    mid = None
                
                try:
                    conf = float(row['confidence_score'])
                except ValueError:
                    conf = 0.0

                all_rows.append((
                    mid,
                    row['channel_name'],
                    row['image_path'],
                    row['detected_object'],
                    conf,
                    row['image_category']
                ))
    except Exception as e:
        logger.error(f"Error reading CSV: {e}")
        return

    if not all_rows:
        logger.warning("No rows to load.")
        return

    columns = [
        'message_id', 'channel_name', 'image_path', 
        'detected_object', 'confidence_score', 'image_category'
    ]

    try:
        with conn.cursor() as cur:
            query = sql.SQL("INSERT INTO raw.yolo_detections ({}) VALUES %s").format(
                sql.SQL(', ').join(map(sql.Identifier, columns))
            )
            extras.execute_values(cur, query, all_rows, page_size=1000)
            conn.commit()
            
        logger.info(f"Successfully loaded {len(all_rows)} detections.")
        print(f"SUCCESS: Loaded {len(all_rows)} detection records.")
            
    except Exception as e:
        logger.error(f"Error loading to DB: {e}")
        print(f"ERROR: {e}")

if __name__ == "__main__":
    try:
        conn = get_db_connection()
        init_yolo_schema(conn)
        load_detections(conn)
        conn.close()
    except Exception as e:
        logger.error(f"Script failed: {e}")
