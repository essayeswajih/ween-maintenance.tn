from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserMinimal(BaseModel):
    id: int
    full_name: Optional[str] = None

    class Config:
        orm_mode = True

class RatingCreate(BaseModel):
    user_id: int
    service_id: Optional[int] = None
    product_id: Optional[int] = None
    rating: int
    comment: Optional[str] = None

class RatingUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

class RatingResponse(BaseModel):
    id: int
    user_id: int
    service_id: Optional[int]
    product_id: Optional[int]
    rating: int
    comment: Optional[str]
    created_at: datetime
    user: Optional[UserMinimal] = None

    class Config:
        orm_mode = True
