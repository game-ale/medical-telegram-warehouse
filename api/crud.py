from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from . import schemas

def get_top_products(db: Session, limit: int = 10):
    # Endpoint 1: Extract terms from message_text (splitting by spaces and filtering basic medical keywords)
    # We use a regex based split on the database side for efficiency
    query = text("""
        WITH words AS (
            SELECT lower(regexp_split_to_table(message_text, '\s+')) as word
            FROM public.fct_messages
            WHERE message_text IS NOT NULL AND message_text != ''
        )
        SELECT word as product_name, count(*) as mention_count
        FROM words
        WHERE length(word) > 4 -- Filter out small words/stop-words
        AND word ~ '^[a-z]+$' -- Only alphabetic terms
        GROUP BY word
        ORDER BY mention_count DESC
        LIMIT :limit
    """)
    result = db.execute(query, {"limit": limit})
    return [{"product_name": row[0], "mention_count": row[1]} for row in result]

def get_channel_activity(db: Session, channel_name: str):
    # Check if channel exists in dim_channels
    channel_query = text("SELECT channel_key FROM public.dim_channels WHERE channel_name = :name")
    channel = db.execute(channel_query, {"name": channel_name}).fetchone()
    
    if not channel:
        return None
        
    # Metrics
    metrics_query = text("""
        SELECT 
            count(*) as total_posts,
            coalesce(avg(view_count), 0) as avg_views
        FROM public.fct_messages f
        JOIN public.dim_channels c ON f.channel_key = c.channel_key
        WHERE c.channel_name = :name
    """)
    metrics = db.execute(metrics_query, {"name": channel_name}).fetchone()
    
    # Daily Trend
    daily_query = text("""
        SELECT d.full_date, count(f.message_id) 
        FROM public.fct_messages f
        JOIN public.dim_dates d ON f.date_key = d.date_key
        JOIN public.dim_channels c ON f.channel_key = c.channel_key
        WHERE c.channel_name = :name
        GROUP BY d.full_date
        ORDER BY d.full_date DESC
        LIMIT 30
    """)
    daily_trend = db.execute(daily_query, {"name": channel_name}).fetchall()
    
    # Weekly Trend
    weekly_query = text("""
        SELECT d.week_of_year, count(f.message_id)
        FROM public.fct_messages f
        JOIN public.dim_dates d ON f.date_key = d.date_key
        JOIN public.dim_channels c ON f.channel_key = c.channel_key
        WHERE c.channel_name = :name
        GROUP BY d.week_of_year
        ORDER BY d.week_of_year DESC
    """)
    weekly_trend = db.execute(weekly_query, {"name": channel_name}).fetchall()
    
    return {
        "channel_name": channel_name,
        "total_posts": metrics[0],
        "avg_views": round(metrics[1], 2),
        "daily_trend": [{"date": row[0], "post_count": row[1]} for row in daily_trend],
        "weekly_trend": [{"week": row[0], "post_count": row[1]} for row in weekly_trend]
    }

def search_messages(db: Session, query_str: str, limit: int = 20):
    query = text("""
        SELECT 
            f.message_id, 
            c.channel_name, 
            d.full_date, 
            f.message_text, 
            f.view_count
        FROM public.fct_messages f
        JOIN public.dim_channels c ON f.channel_key = c.channel_key
        JOIN public.dim_dates d ON f.date_key = d.date_key
        WHERE f.message_text ILIKE :q
        ORDER BY d.full_date DESC
        LIMIT :limit
    """)
    result = db.execute(query, {"q": f"%{query_str}%", "limit": limit})
    return [
        {
            "message_id": row[0],
            "channel_name": row[1],
            "date": row[2],
            "text": row[3],
            "views": row[4]
        } for row in result
    ]

def get_visual_stats(db: Session):
    # Distribution of image categories
    dist_query = text("""
        SELECT image_category, count(*) 
        FROM public.fct_image_detections
        GROUP BY image_category
    """)
    distribution = db.execute(dist_query).fetchall()
    
    # Visual usage by channel
    channel_query = text("""
        SELECT 
            c.channel_name,
            count(f.message_id) filter (where f.has_media = true) as visual_posts,
            count(f.message_id) as total_posts
        FROM public.fct_messages f
        JOIN public.dim_channels c ON f.channel_key = c.channel_key
        GROUP BY c.channel_name
    """)
    channel_stats = db.execute(channel_query).fetchall()
    
    return {
        "image_category_distribution": [{"category": row[0], "count": row[1]} for row in distribution],
        "channel_visual_stats": [
            {
                "channel_name": row[0],
                "visual_posts": row[1],
                "total_posts": row[2],
                "visual_percentage": round((row[1] / row[2] * 100), 2) if row[2] > 0 else 0
            } for row in channel_stats
        ]
    }
