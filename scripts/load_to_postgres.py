import os
import json
import logging
import psycopg2
from psycopg2 import sql, extras
from dotenv import load_dotenv

# Setup logging to file
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
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

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

def init_raw_schema(conn):
    """
    Creates the 'raw' schema and 'telegram_messages' table.
    Drops existing table to ensure schema match.
    """
    with conn.cursor() as cur:
        cur.execute("CREATE SCHEMA IF NOT EXISTS raw;")
        cur.execute("DROP TABLE IF EXISTS raw.telegram_messages CASCADE;")
        cur.execute("""
            CREATE TABLE raw.telegram_messages (
                id SERIAL PRIMARY KEY,
                message_id BIGINT,
                channel_name TEXT,
                message_date TIMESTAMP WITH TIME ZONE,
                message_text TEXT,
                views INTEGER,
                forwards INTEGER,
                has_media BOOLEAN,
                image_path TEXT,
                loaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    logger.info("Schema 'raw' and table 'raw.telegram_messages' initialized.")

def load_data(conn, data_dir='data/raw/telegram_messages'):
    """
    Walks through the data directory, reads JSON files, and loads them into DB.
    """
    all_rows = []
    
    # Columns matching the CREATE TABLE 
    # (excluding id, loaded_at which are auto)
    columns = [
        'message_id', 'channel_name', 'message_date', 'message_text', 
        'views', 'forwards', 'has_media', 'image_path'
    ]

    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        msg_list = data if isinstance(data, list) else [data]
                        
                        for msg in msg_list:
                            # Prepare row tuple
                            row = (
                                msg.get('message_id'),
                                msg.get('channel_name'),
                                msg.get('message_date'),
                                msg.get('message_text'),
                                msg.get('views', 0),
                                msg.get('forwards', 0),
                                msg.get('has_media', False),
                                msg.get('image_path')
                            )
                            all_rows.append(row)
                except Exception as e:
                    logger.error(f"Error reading file {file_path}: {e}")

    if not all_rows:
        logger.warning("No data found to load.")
        return

    # Insert data
    try:
        with conn.cursor() as cur:
            # Prepare SQL
            query = sql.SQL("INSERT INTO raw.telegram_messages ({}) VALUES %s").format(
                sql.SQL(', ').join(map(sql.Identifier, columns))
            )
            
            extras.execute_values(cur, query, all_rows, page_size=1000)
            conn.commit()
            
        logger.info(f"Successfully loaded {len(all_rows)} rows into raw.telegram_messages.")
        # Safe print for success status to file or minimal stdout
        # Avoid printing weird chars to stdout
        with open("scripts/loader_status.txt", "w") as f:
            f.write(f"SUCCESS: Loaded {len(all_rows)} rows.")
            
    except Exception as e:
        logger.error(f"Error executing insert: {e}")
        with open("scripts/loader_status.txt", "w") as f:
            f.write(f"ERROR: {e}")

if __name__ == "__main__":
    try:
        conn = get_db_connection()
        init_raw_schema(conn)
        load_data(conn)
        conn.close()
    except Exception as e:
        logger.error(f"Script failed: {e}")
