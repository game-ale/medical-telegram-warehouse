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
        # Create schema 'raw' if it doesn't exist
        cur.execute("CREATE SCHEMA IF NOT EXISTS raw;")
        
        # Create table with JSONB column
        create_table_query = """
        CREATE TABLE IF NOT EXISTS raw.telegram_messages (
            id SERIAL PRIMARY KEY,
            message_id BIGINT,
            channel_name TEXT,
            date TIMESTAMP,
            message_data JSONB,
            UNIQUE(channel_name, message_id)
        );
        """
        cur.execute(create_table_query)
        conn.commit()
        cur.close()
        logger.info("Table 'raw.telegram_messages' created/verified.")
    except Exception as e:
        logger.error(f"Error creating table: {e}")

def load_data(conn, data_dir="data/raw/telegram_messages"):
    cur = conn.cursor()
    total_loaded = 0
    
    # Walk through the directory structure
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        messages = json.load(f)
                        
                    for msg in messages:
                        # Extract core fields for query optimization, store rest in JSONB
                        msg_id = msg.get('message_id')
                        channel = msg.get('channel_name')
                        res_date = msg.get('date')
                        
                        insert_query = """
                        INSERT INTO raw.telegram_messages (message_id, channel_name, date, message_data)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (channel_name, message_id) DO UPDATE 
                        SET message_data = EXCLUDED.message_data,
                            date = EXCLUDED.date;
                        """
                        
                        cur.execute(insert_query, (msg_id, channel, res_date, json.dumps(msg)))
                        
                    conn.commit()
                    logger.info(f"Loaded {len(messages)} messages from {file_path}")
                    total_loaded += len(messages)
                    
                except Exception as e:
                    logger.error(f"Error loading file {file_path}: {e}")
                    conn.rollback()
                    
    cur.close()
    logger.success(f"Total messages loaded: {total_loaded}")

if __name__ == "__main__":
    conn = get_db_connection()
    if conn:
        create_table(conn)
        load_data(conn)
        conn.close()
