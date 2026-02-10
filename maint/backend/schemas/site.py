from pydantic import BaseModel, EmailStr
from typing import Optional

class SiteCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = "Tunis"
    country: Optional[str] = "Tunisie"
    shipping_cost: float = 15
    free_shipping_threshold: float = 100
    tax_rate: float = 19
    currency: str = "DT"

class SiteUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    shipping_cost: Optional[float] = None
    free_shipping_threshold: Optional[float] = None
    tax_rate: Optional[float] = None
    currency: Optional[str] = None

class SiteResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    address: Optional[str]
    city: Optional[str]
    country: Optional[str]
    shipping_cost: float
    free_shipping_threshold: float
    tax_rate: float
    currency: str

    class Config:
        orm_mode = True
