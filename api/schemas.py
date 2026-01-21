from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime

# Endpoint 1: Top Products
class TopProduct(BaseModel):
    product_name: str
    mention_count: int

class TopProductsResponse(BaseModel):
    data: List[TopProduct]

# Endpoint 2: Channel Activity
class DailyTrend(BaseModel):
    date: date
    post_count: int

class WeeklyTrend(BaseModel):
    week: int
    post_count: int

class ChannelActivityResponse(BaseModel):
    channel_name: str
    total_posts: int
    avg_views: float
    daily_trend: List[DailyTrend]
    weekly_trend: List[WeeklyTrend]

# Endpoint 3: Message Search
class MessageSearchItem(BaseModel):
    message_id: int
    channel_name: str
    date: datetime
    text: Optional[str]
    views: Optional[int]

class MessageSearchResponse(BaseModel):
    query: str
    results: List[MessageSearchItem]

# Endpoint 4: Visual Content Statistics
class ImageCategoryDistribution(BaseModel):
    category: str
    count: int

class ChannelVisualStats(BaseModel):
    channel_name: str
    visual_posts: int
    total_posts: int
    visual_percentage: float

class VisualContentResponse(BaseModel):
    image_category_distribution: List[ImageCategoryDistribution]
    channel_visual_stats: List[ChannelVisualStats]
