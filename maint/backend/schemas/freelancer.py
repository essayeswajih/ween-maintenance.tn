from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime

class FreelancerBase(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    tel: Optional[str] = None
    website: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    services: Optional[List[str]] = None
    experience_years: Optional[int] = 0
    hourly_rate: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = "Tunisia"
    matricule_fiscale: Optional[str] = None
    cin: Optional[str] = None
    avatar: Optional[str] = None
    cover_image: Optional[str] = None

class FreelancerCreate(FreelancerBase):
    pass

class FreelancerUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    tel: Optional[str] = None
    website: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    services: Optional[List[str]] = None
    experience_years: Optional[int] = None
    hourly_rate: Optional[float] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    matricule_fiscale: Optional[str] = None
    cin: Optional[str] = None
    verified: Optional[bool] = None
    is_active: Optional[bool] = None
    avatar: Optional[str] = None
    cover_image: Optional[str] = None
    notes: Optional[str] = None
    blocked_reason: Optional[str] = None

class FreelancerResponse(FreelancerBase):
    id: int
    verified: bool
    is_active: bool
    rating: float
    reviews_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
