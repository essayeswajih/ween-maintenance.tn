from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models.Oauth2Models import User
from typing import List

from db.database import get_db
from crud import serviceCrud as service_crud
from schemas.serviceSchemas import (
    ServiceCreate, ServiceUpdate, ServiceResponse,
    CategoryServiceCreate, CategoryServiceUpdate, CategoryServiceResponse
)
from utils.auth import admin_only

router = APIRouter()

# -------------------------
# CATEGORY SERVICE ENDPOINTS
# -------------------------

@router.post("/categories", response_model=CategoryServiceResponse, status_code=status.HTTP_201_CREATED)
def create_category(category_in: CategoryServiceCreate, db: Session = Depends(get_db), current_user: User = Depends(admin_only)):
    return service_crud.create_category(db, category_in)

@router.get("/categories", response_model=List[CategoryServiceResponse])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return service_crud.get_categories(db, skip, limit)

@router.get("/categories/{category_id}", response_model=CategoryServiceResponse)
def read_category(category_id: int, db: Session = Depends(get_db)):
    category = service_crud.get_category(db, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.put("/categories/{category_id}", response_model=CategoryServiceResponse)
def update_category(category_id: int, category_in: CategoryServiceUpdate, db: Session = Depends(get_db), current_user: User = Depends(admin_only)):
    category = service_crud.update_category(db, category_id, category_in)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db), current_user: User = Depends(admin_only)):
    success = service_crud.delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return None


# -------------------------
# SERVICE ENDPOINTS
# -------------------------

@router.post(("/"), response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(service_in: ServiceCreate, db: Session = Depends(get_db), current_user: User = Depends(admin_only)):
    return service_crud.create_service(db, service_in)

@router.get(("/"), response_model=List[ServiceResponse])
def read_services(skip: int = 0, limit: int = 100, city: str = None, db: Session = Depends(get_db)):
    # TODO: Implement city filtering logic (requires joining with Freelancers or adding city to Service)
    # For now, we return all services, but the signature supports the query param.
    return service_crud.get_services(db, skip, limit)

@router.get("/slug/{slug}", response_model=ServiceResponse)
def read_service_by_slug(slug: str, db: Session = Depends(get_db)):
    service = service_crud.get_service_by_slug(db, slug)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.get("/{service_id}", response_model=ServiceResponse)
def read_service(service_id: int, db: Session = Depends(get_db)):
    service = service_crud.get_service(db, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.get("/category/{category_id}", response_model=List[ServiceResponse])
def read_services_by_category(category_id: int, db: Session = Depends(get_db)):
    return service_crud.get_services_by_category(db, category_id)

@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(service_id: int, service_in: ServiceUpdate, db: Session = Depends(get_db), current_user: User = Depends(admin_only)):
    service = service_crud.update_service(db, service_id, service_in)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(service_id: int, db: Session = Depends(get_db), current_user: User = Depends(admin_only)):
    success = service_crud.delete_service(db, service_id)
    if not success:
        raise HTTPException(status_code=404, detail="Service not found")
    return None
