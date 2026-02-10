from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

# Base Schemas


class ProductBase(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    price: float
    discounted_price: Optional[float] = None
    stock_quantity: int
    in_stock: Optional[bool] = True
    category_id: int
    image_url: Optional[str] = None
    image2_url: Optional[str] = None
    image3_url: Optional[str] = None
    image4_url: Optional[str] = None
    promo: Optional[bool] = False
    buzzent: Optional[str] = None
    rating: Optional[float] = None
    num_ratings: Optional[int] = None
    
    # Frontend extra fields
    sizes: Optional[List[str]] = None                     # e.g., ["XS", "S", "M", "L", "XL"]
    colors: Optional[List[Dict[str, str]]] = None        # e.g., [{"name": "black", "label": "Noir", "hex": "#000000"}]
    materials: Optional[List[str]] = None
    care: Optional[List[str]] = None
    features: Optional[List[str]] = None
    sku: Optional[str] = None
    slug: str
    
    class Config:
        from_attributes = True

class ProductResponse(ProductBase):
    id: int
    discounted_price: Optional[float] = None
    category_name: Optional[str] = None

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    id: Optional[int] = None 
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float
    name: Optional[str] = None
    color: Optional[str] = None
    size: Optional[str] = None

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    id: int
    total_amount: float
    status: str
    created_at: datetime
    username: str
    email: str
    telephone: str
    location: str
    payment_method: str
    payed : str
    code: str
    items: List[OrderItemBase]
    class Config:
        from_attributes = True  # This tells Pydantic to treat the SQLAlchemy models as dict-like

class CartItemBase(BaseModel):
    product_id: int
    quantity: int

    class Config:
        from_attributes = True

# Order Related Schemas
class OrderCreate(BaseModel):
    items: List[OrderItemBase]
    username: str
    email: str
    telephone: str
    location: str
    payment_method: str
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    username: str
    email: str
    telephone: str
    location: str
    payment_method: str
    payed : str
    code: str
    items: List[OrderItemBase]

    class Config:
        from_attributes = True

class OrderItemDetail(OrderItemBase):
    product: Optional[ProductResponse] = None
    class Config:
        from_attributes = True

class OrderDetail(OrderBase):
    items: List[OrderItemDetail]
    shipping_cost: float = 0.0
    tax_amount: float = 0.0
    class Config:
        from_attributes = True

class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True

class CartItemResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int

    class Config:
        from_attributes = True
        
class OrederStatus(BaseModel):
    status: str

    class Config:
        from_attributes = True
        
