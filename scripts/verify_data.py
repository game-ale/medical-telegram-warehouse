import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    host=os.getenv('DB_HOST'),
    port=os.getenv('DB_PORT'),
    dbname=os.getenv('DB_NAME')
)

cursor = conn.cursor()
cursor.execute("SELECT count(*) FROM raw.telegram_messages;")
count = cursor.fetchall()[0][0]
print(f"Total rows in raw.telegram_messages: {count}")
conn.close()
