from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.vetrineModels import Product
from models.servicesModels import Service
from models.blogModels import Blog

router = APIRouter()

@router.get("/products")
async def get_seo_products(db: Session = Depends(get_db)):
    products = db.query(Product.slug).all()
    return [{"slug": p.slug, "updated_at": None} for p in products]

@router.get("/services")
async def get_seo_services(db: Session = Depends(get_db)):
    # Note: Service model doesn't have updated_at in the provided snippet, 
    # but I'll query it anyway if it exists or use None
    services = db.query(Service.slug).all()
    return [{"slug": s.slug, "updated_at": None} for s in services]

@router.get("/blogs")
async def get_seo_blogs(db: Session = Depends(get_db)):
    blogs = db.query(Blog.slug, Blog.updated_at).all()
    return [{"slug": b.slug, "updated_at": b.updated_at} for b in blogs]
