from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import crud, schemas, database
from .config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Analytical API for Medical Telegram Warehouse insights.",
    version=settings.VERSION
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Medical Telegram Warehouse Analytical API", "docs": "/docs"}

@app.get("/api/reports/top-products", response_model=schemas.TopProductsResponse)
def get_top_products(
    limit: int = Query(10, description="Number of top products to return", gt=0, le=100),
    db: Session = Depends(database.get_db)
):
    """
    Returns the most frequently mentioned medical products/terms extracted from messages.
    """
    data = crud.get_top_products(db, limit)
    return {"data": data}

@app.get("/api/channels/{channel_name}/activity", response_model=schemas.ChannelActivityResponse)
def get_channel_activity(
    channel_name: str,
    db: Session = Depends(database.get_db)
):
    """
    Returns posting activity, average views, and trends for a specific channel.
    """
    data = crud.get_channel_activity(db, channel_name)
    if data is None:
        raise HTTPException(status_code=404, detail="Channel not found")
    return data

@app.get("/api/search/messages", response_model=schemas.MessageSearchResponse)
def search_messages(
    query: str = Query(..., min_length=1, description="Keyword to search in messages"),
    limit: int = Query(20, description="Max results to return", gt=0, le=100),
    db: Session = Depends(database.get_db)
):
    """
    Search for messages containing a specific keyword.
    """
    results = crud.search_messages(db, query, limit)
    return {"query": query, "results": results}

@app.get("/api/reports/visual-content", response_model=schemas.VisualContentResponse)
def get_visual_stats(db: Session = Depends(database.get_db)):
    """
    Analyze image usage and classification (YOLO) across all channels.
    """
    return crud.get_visual_stats(db)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
