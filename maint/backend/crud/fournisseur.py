from sqlalchemy.orm import Session
from models.fournisseur import Supplier
from schemas.fournisseur import SupplierCreate, SupplierUpdate


def create_supplier(db: Session, data: SupplierCreate):
    supplier = Supplier(**data.model_dump())
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier


def get_supplier_by_id(db: Session, supplier_id: int):
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()


def get_suppliers(
    db: Session,
    skip: int = 0,
    limit: int = 20,
    city: str | None = None,
    category: str | None = None,
    active_only: bool = True
):
    query = db.query(Supplier)

    if active_only:
        query = query.filter(Supplier.is_active == True)

    if city:
        query = query.filter(Supplier.city == city)

    if category:
        query = query.filter(Supplier.main_category == category)

    return query.offset(skip).limit(limit).all()


def update_supplier(db: Session, supplier_id: int, data: SupplierUpdate):
    supplier = get_supplier_by_id(db, supplier_id)
    if not supplier:
        return None

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(supplier, key, value)

    db.commit()
    db.refresh(supplier)
    return supplier


def disable_supplier(db: Session, supplier_id: int):
    supplier = get_supplier_by_id(db, supplier_id)
    if not supplier:
        return None

    supplier.is_active = False
    db.commit()
    return supplier
