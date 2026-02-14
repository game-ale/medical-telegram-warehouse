import os
import pandas as pd
import psycopg2
from dotenv import load_dotenv
import matplotlib.pyplot as plt

load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT') or "5432"
DB_NAME = os.getenv('DB_NAME')

def get_db_connection():
    return psycopg2.connect(
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        client_encoding='utf8'
    )

def run_analysis():
    conn = get_db_connection()
    
    print("--- YOLO ANALYSIS REPORT ---\n")

    # 1. Total Detections and Coverage
    query_overview = """
    SELECT 
        count(*) as total_detections,
        count(distinct message_id) as messages_with_images
    FROM raw.yolo_detections;
    """
    df_overview = pd.read_sql(query_overview, conn)
    print(f"Total Object Detections: {df_overview['total_detections'][0]}")
    print(f"Messages Enriched with Visual Data: {df_overview['messages_with_images'][0]}\n")

    # 2. Category Distribution per Channel
    print("--- Image Category Distribution by Channel ---")
    query_cats = """
    SELECT 
        d.channel_name,
        y.image_category,
        count(*) as count
    FROM models.marts.fct_image_detections y
    JOIN models.marts.dim_channels d ON y.channel_key = d.channel_key
    GROUP BY 1, 2
    ORDER BY 1, 3 DESC;
    """
    # Note: dbt creates tables in 'marts' schema or 'public_marts' depending on config. 
    # profiles.yml sets schema='public', so likely 'public_marts' or just 'marts' 
    # if I used custom schema config.
    # Checking logs: "created sql table model public_marts.fct_image_detections"
    # So schema is individual per folder? Or prefix? 
    # Default dbt generates 'target_schema_folder_name'. 
    # Let's try selecting from public_marts.fct_image_detections based on logs.
    
    query_cats = """
    SELECT 
        c.channel_name,
        f.image_category,
        count(*) as img_count
    FROM public_marts.fct_image_detections f
    JOIN public_marts.dim_channels c ON f.channel_key = c.channel_key
    GROUP BY 1, 2
    ORDER BY 1, 3 DESC;
    """
    try:
        df_cats = pd.read_sql(query_cats, conn)
        print(df_cats.to_string(index=False))
    except Exception as e:
        print(f"Error querying marts: {e}")
        print("Trying 'marts' schema...")
        query_cats = query_cats.replace("public_marts", "marts")
        try:
            df_cats = pd.read_sql(query_cats, conn)
            print(df_cats.to_string(index=False))
        except:
             print("Could not query marts. Ensure dbt run finished successfully.")

    print("\n")

    # 3. Impact of Viz Type on Engagement (Views)
    # Joining fct_image_detections back to fct_messages to get views?
    # fct_messages already has views. fct_image_detections links to it.
    print("--- Average Views by Image Category ---")
    query_views = """
    SELECT 
        img.image_category,
        AVG(msg.view_count) as avg_views,
        COUNT(*) as sample_size
    FROM public_marts.fct_messages msg
    JOIN public_marts.fct_image_detections img ON msg.message_id = img.message_id
    GROUP BY 1
    ORDER BY 2 DESC;
    """
    try:
        df_views = pd.read_sql(query_views, conn)
        print(df_views.to_string(index=False))
    except:
        pass

    conn.close()

if __name__ == "__main__":
    run_analysis()
