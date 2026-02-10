from sqlalchemy.orm import Session
from typing import List, Optional
from models.servicesModels import Service, CategoryService
from schemas.serviceSchemas import ServiceCreate, ServiceUpdate, ServiceResponse, CategoryServiceCreate, CategoryServiceUpdate, CategoryServiceResponse

# -------------------------
# CATEGORY SERVICE CRUD
# -------------------------

# CREATE
def create_category(db: Session, category_in: CategoryServiceCreate) -> CategoryService:
    category = CategoryService(
        name=category_in.name,
        description=category_in.description,
        image_url=category_in.image_url,
        slug=category_in.slug
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

# READ single
def get_category(db: Session, category_id: int) -> Optional[CategoryService]:
    return db.query(CategoryService).filter(CategoryService.id == category_id).first()

# READ all
def get_categories(db: Session, skip: int = 0, limit: int = 100) -> List[CategoryService]:
    return db.query(CategoryService).offset(skip).limit(limit).all()

# UPDATE
def update_category(db: Session, category_id: int, category_in: CategoryServiceUpdate) -> Optional[CategoryService]:
    category = db.query(CategoryService).filter(CategoryService.id == category_id).first()
    if not category:
        return None
    if category_in.name is not None:
        category.name = category_in.name
    if category_in.description is not None:
        category.description = category_in.description
    if category_in.image_url is not None:
        category.image_url = category_in.image_url
    if category_in.slug is not None:
        category.slug = category_in.slug
    db.commit()
    db.refresh(category)
    return category

# DELETE
def delete_category(db: Session, category_id: int) -> bool:
    category = db.query(CategoryService).filter(CategoryService.id == category_id).first()
    if not category:
        return False
    db.delete(category)
    db.commit()
    return True


# -------------------------
# SERVICE CRUD
# -------------------------

# CREATE
def create_service(db: Session, service_in: ServiceCreate) -> Service:
    service = Service(
        name=service_in.name,
        description=service_in.description,
        price=service_in.price,
        price_unit=service_in.price_unit,
        features=service_in.features,
        process=service_in.process,
        specialties=service_in.specialties,
        disponiblity=service_in.disponiblity,
        moyDuration=service_in.moyDuration,
        category_id=service_in.category_id,
        image_url=service_in.image_url,
        slug=service_in.slug
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service

# READ single by ID
def get_service(db: Session, service_id: int) -> Optional[Service]:
    return db.query(Service).filter(Service.id == service_id).first()

# READ single by Slug
def get_service_by_slug(db: Session, slug: str) -> Optional[Service]:
    return db.query(Service).filter(Service.slug == slug).first()

# READ all
def get_services(db: Session, skip: int = 0, limit: int = 100) -> List[Service]:
    return db.query(Service).offset(skip).limit(limit).all()

# READ by category
def get_services_by_category(db: Session, category_id: int) -> List[Service]:
    return db.query(Service).filter(Service.category_id == category_id).all()

# UPDATE
def update_service(db: Session, service_id: int, service_in: ServiceUpdate) -> Optional[Service]:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        return None
    if service_in.name is not None:
        service.name = service_in.name
    if service_in.description is not None:
        service.description = service_in.description
    if service_in.price is not None:
        service.price = service_in.price
    if service_in.price_unit is not None:
        service.price_unit = service_in.price_unit
    if service_in.features is not None:
        service.features = service_in.features
    if service_in.process is not None:
        service.process = service_in.process
    if service_in.specialties is not None:
        service.specialties = service_in.specialties
    if service_in.disponiblity is not None:
        service.disponiblity = service_in.disponiblity
    if service_in.moyDuration is not None:
        service.moyDuration = service_in.moyDuration
    if service_in.category_id is not None:
        service.category_id = service_in.category_id
    if service_in.image_url is not None:
        service.image_url = service_in.image_url
    if service_in.slug is not None:
        service.slug = service_in.slug
    db.commit()
    db.refresh(service)
    return service

# DELETE
def delete_service(db: Session, service_id: int) -> bool:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        return False
    db.delete(service)
    db.commit()
    return True
