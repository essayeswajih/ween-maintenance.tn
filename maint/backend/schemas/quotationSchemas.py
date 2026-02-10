from pydantic import BaseModel, EmailStr
from typing import Optional

class QuotationCreate(BaseModel):
    service_id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    postal_code: Optional[str] = None
    description: str
    preferred_timeline: Optional[str] = None

class QuotationUpdate(BaseModel):
    service_id: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    description: Optional[str] = None
    preferred_timeline: Optional[str] = None

class QuotationResponse(BaseModel):
    id: int
    service_id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    address: str
    city: str
    postal_code: Optional[str]
    description: str
    preferred_timeline: Optional[str]
    created_at: str

    class Config:
        orm_mode = True
