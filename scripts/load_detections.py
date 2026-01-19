import os
import json
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

INPUT_FILE = "data/raw/yolo_detections.json"

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
        create_query = """
        CREATE TABLE IF NOT EXISTS raw.yolo_detections (
            id SERIAL PRIMARY KEY,
            message_id BIGINT,
            channel_name TEXT,
            detection_data JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(channel_name, message_id)
        );
        """
        cur.execute(create_query)
        conn.commit()
        cur.close()
        logger.info("Table 'raw.yolo_detections' created/verified.")
    except Exception as e:
        logger.error(f"Error creating table: {e}")

def load_detections(conn):
    if not os.path.exists(INPUT_FILE):
        logger.error(f"Input file not found: {INPUT_FILE}")
        return

    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        cur = conn.cursor()
        count = 0
        
        for item in data:
            msg_id = item.get('message_id')
            channel = item.get('channel_name')
            
            insert_query = """
            INSERT INTO raw.yolo_detections (message_id, channel_name, detection_data)
            VALUES (%s, %s, %s)
            ON CONFLICT (channel_name, message_id) DO UPDATE 
            SET detection_data = EXCLUDED.detection_data;
            """
            
            cur.execute(insert_query, (msg_id, channel, json.dumps(item['detections'])))
            count += 1
            
        conn.commit()
        cur.close()
        logger.success(f"Successfully loaded {count} detection records to PostgreSQL.")
        
    except Exception as e:
        logger.error(f"Error loading detections: {e}")

if __name__ == "__main__":
    conn = get_db_connection()
    if conn:
        create_table(conn)
        load_detections(conn)
        conn.close()
