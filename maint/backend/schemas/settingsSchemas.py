from pydantic import BaseModel
from typing import Optional

class SettingsBase(BaseModel):
    store_name: str
    email: str
    phone: str
    address: str
    shipping_cost: float
    free_shipping_threshold: float
    tax_rate: float
    currency: str

class SettingsUpdate(BaseModel):
    store_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    shipping_cost: Optional[float] = None
    free_shipping_threshold: Optional[float] = None
    tax_rate: Optional[float] = None
    currency: Optional[str] = None

class SettingsResponse(SettingsBase):
    id: int

    class Config:
        from_attributes = True
