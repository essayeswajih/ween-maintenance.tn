from pydantic import BaseModel
from typing import Optional, List

# CATEGORY SERVICE SCHEMAS
class CategoryServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    slug: str

class CategoryServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None

class CategoryServiceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    image_url: Optional[str]
    slug: str

    class Config:
        orm_mode = True

# SERVICE SCHEMAS
class ServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    price_unit: Optional[str] = "intervention"
    features: Optional[List[str]] = None
    process: Optional[List[dict]] = None
    specialties: Optional[str] = None
    disponiblity: Optional[str] = "Lun-Dim 7h-20h"
    moyDuration: Optional[float] = 2
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    slug: str

class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    price_unit: Optional[str] = None
    features: Optional[List[str]] = None
    process: Optional[List[dict]] = None
    specialties: Optional[str] = None
    disponiblity: Optional[str] = None
    moyDuration: Optional[float] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None
    slug: Optional[str] = None

class ServiceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    price_unit: Optional[str]
    features: Optional[List[str]]
    process: Optional[List[dict]]
    specialties: Optional[str]
    disponiblity: Optional[str]
    moyDuration: float
    category_id: Optional[int]
    image_url: Optional[str]
    slug: str
    rating: Optional[float] = 0.0
    num_ratings: Optional[int] = 0

    class Config:
        orm_mode = True
