from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ---------- Base ----------
class SupplierBase(BaseModel):
    owner_name: Optional[str]
    company_name: str

    matricule_fiscale: Optional[str]
    forme_juridique: Optional[str]

    site: Optional[str]
    email: Optional[EmailStr]
    tel: Optional[str]

    main_category: Optional[str]
    services: Optional[List[str]]

    address: Optional[str]
    city: Optional[str]
    country: Optional[str] = "Tunisia"


# ---------- Create ----------
class SupplierCreate(SupplierBase):
    email: EmailStr
    tel: str


# ---------- Update ----------
class SupplierUpdate(BaseModel):
    owner_name: Optional[str]
    company_name: Optional[str]
    matricule_fiscale: Optional[str]
    forme_juridique: Optional[str]
    site: Optional[str]
    email: Optional[EmailStr]
    tel: Optional[str]
    main_category: Optional[str]
    services: Optional[List[str]]
    address: Optional[str]
    city: Optional[str]
    country: Optional[str]

    verified: Optional[bool]
    is_active: Optional[bool]

    notes: Optional[str]
    blocked_reason: Optional[str]


# ---------- Product (light version for supplier response) ----------
class SupplierProduct(BaseModel):
    id: int
    name: str
    price: float
    slug: str
    in_stock: bool

    class Config:
        from_attributes = True


# ---------- Response ----------
class SupplierResponse(SupplierBase):
    id: int
    verified: bool
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]

    products: List[SupplierProduct] = []

    class Config:
        from_attributes = True
