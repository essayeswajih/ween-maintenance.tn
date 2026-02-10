from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BlogBase(BaseModel):
    title: str
    content: str
    category: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    slug: str
    excerpt: Optional[str] = None
    read_time: Optional[str] = "5 min"
    status: Optional[str] = "Publié"

class BlogCreate(BlogBase):
    pass

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    read_time: Optional[str] = None
    status: Optional[str] = None

class BlogResponse(BlogBase):
    id: int
    views: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
