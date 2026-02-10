from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from db.database import get_db
from schemas.fournisseur import (
    SupplierCreate,
    SupplierUpdate,
    SupplierResponse
)
from crud.fournisseur import (
    create_supplier,
    get_supplier_by_id,
    get_suppliers,
    update_supplier,
    disable_supplier
)

from utils.auth import admin_only

router = APIRouter(dependencies=[Depends(admin_only)])


@router.post("", response_model=SupplierResponse, dependencies=[Depends(admin_only)])
def create_supplier_api(
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):
    return create_supplier(db, supplier)


@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier_api(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    supplier = get_supplier_by_id(db, supplier_id)
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier


@router.get("", response_model=List[SupplierResponse])
def list_suppliers_api(
    skip: int = 0,
    limit: int = 20,
    city: str | None = Query(None),
    category: str | None = Query(None),
    db: Session = Depends(get_db)
):
    return get_suppliers(db, skip, limit, city, category)


@router.put("/{supplier_id}", response_model=SupplierResponse, dependencies=[Depends(admin_only)])
def update_supplier_api(
    supplier_id: int,
    supplier: SupplierUpdate,
    db: Session = Depends(get_db)
):
    updated = update_supplier(db, supplier_id, supplier)
    if not updated:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return updated


@router.delete("/{supplier_id}", dependencies=[Depends(admin_only)])
def disable_supplier_api(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    deleted = disable_supplier(db, supplier_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Supplier not found")

    return {"message": "Supplier disabled successfully"}
