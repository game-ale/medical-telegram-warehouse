from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# --- Responses ---

class MessageSchema(BaseModel):
    message_id: int
    channel_name: str
    message_date: datetime
    message_text: Optional[str]
    view_count: Optional[int]
    
    class Config:
        from_attributes = True

class ChannelActivitySchema(BaseModel):
    channel_name: str
    total_messages: int
    avg_views: float
    first_post_date: datetime
    last_post_date: datetime

class VisualStatsSchema(BaseModel):
    channel_name: str
    image_category: str
    count: int

class SearchResponse(BaseModel):
    total: int
    data: List[MessageSchema]

class ProductStatSchema(BaseModel):
    keyword: str
    frequency: int

class BusinessStatsSchema(BaseModel):
    total_posts: int
    active_channels: int
    products_mentioned: int
    visual_content_rate: int
    total_posts_growth: float
    active_channels_growth: float
    products_growth: float
    visual_rate_growth: float

class ActivityPoint(BaseModel):
    date: str
    count: int

class ActivitySeriesSchema(BaseModel):
    daily: List[ActivityPoint]
