from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from . import database, schemas

app = FastAPI(
    title="Medical Data Warehouse API",
    description="API for accessing analyzed Telegram medical data.",
    version="1.0.0"
)

# Dependency
get_db = database.get_db

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to the Medical Data Warehouse API. Go to /docs for testing."}

# --- 1. Top Products ---
@app.get("/api/reports/top-products", response_model=List[schemas.ProductStatSchema], tags=["Reports"])
def get_top_products(limit: int = 10, db: Session = Depends(get_db)):
    """
    Returns top frequently mentioned medical keywords/products.
    Simplified Logic: Tokenizes message text to find common words.
    """
    # Note: In a real scenario, we'd have a pre-computed table or more complex NLP.
    # This is a basic demo using Postgres full text or simple split.
    # We'll simulate by aggregating simple keywords from a known list or just frequent words.
    
    # Let's try to extract words that look like products (simple split)
    sql = text("""
        SELECT lower(word) as keyword, count(*) as frequency
        FROM (
            SELECT regexp_split_to_table(message_text, '\s+') as word
            FROM public_marts.fct_messages
            WHERE message_text IS NOT NULL
        ) t
        WHERE length(word) > 4
        GROUP BY 1
        ORDER BY 2 DESC
        LIMIT :limit
    """)
    
    try:
        result = db.execute(sql, {"limit": limit}).fetchall()
        return [{"keyword": row[0], "frequency": row[1]} for row in result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 2. Channel Activity ---
@app.get("/api/channels/{channel_name}/activity", response_model=schemas.ChannelActivitySchema, tags=["Channels"])
def get_channel_activity(channel_name: str, db: Session = Depends(get_db)):
    """
    Get aggregated stats for a specific channel.
    """
    sql = text("""
        SELECT 
            channel_name,
            total_posts,
            avg_views,
            first_post_date,
            last_post_date
        FROM public_marts.dim_channels
        WHERE channel_name = :channel_name
    """)
    
    result = db.execute(sql, {"channel_name": channel_name}).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Channel not found")
    
    return {
        "channel_name": result[0],
        "total_messages": result[1],
        "avg_views": result[2],
        "first_post_date": result[3],
        "last_post_date": result[4]
    }

# --- 3. Message Search ---
@app.get("/api/search/messages", response_model=schemas.SearchResponse, tags=["Search"])
def search_messages(
    query: str = Query(..., min_length=1),
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Search messages by keyword (case-insensitive).
    """
    try:
        # Use lower() for broad compatibility instead of ILIKE
        sql = text("""
            SELECT 
                message_id,
                channel_name,
                message_date,
                message_text,
                view_count
            FROM public_marts.fct_messages
            WHERE lower(message_text) LIKE lower(:query)
            ORDER BY message_date DESC
            LIMIT :limit
        """)
        
        result = db.execute(sql, {"query": f"%{query}%", "limit": limit}).fetchall()
        
        data = []
        for row in result:
            data.append({
                "message_id": row[0],
                "channel_name": row[1],
                "message_date": row[2],
                "message_text": row[3],
                "view_count": row[4]
            })
            
        return {"total": len(data), "data": data}
    except Exception as e:
        print(f"Search API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- 4. Visual Content Stats ---
@app.get("/api/reports/visual-content", response_model=List[schemas.VisualStatsSchema], tags=["Reports"])
def get_visual_content_stats(db: Session = Depends(get_db)):
    """
    Get distribution of image categories per channel (YOLO).
    """
    sql = text("""
        SELECT 
            c.channel_name,
            f.image_category,
            count(*) as count
        FROM public_marts.fct_image_detections f
        JOIN public_marts.dim_channels c ON f.channel_key = c.channel_key
        GROUP BY 1, 2
        ORDER BY 1, 3 DESC
    """)
    
    try:
        result = db.execute(sql).fetchall()
        return [{"channel_name": row[0], "image_category": row[1], "count": row[2]} for row in result]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
