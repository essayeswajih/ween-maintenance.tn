from sqlalchemy.orm import Session
from typing import List, Optional
from models.servicesModels import Quotation
from schemas.quotationSchemas import QuotationCreate, QuotationUpdate, QuotationResponse

# -------------------------
# CREATE
# -------------------------
def create_quotation(db: Session, quotation_in: QuotationCreate) -> Quotation:
    quotation = Quotation(
        service_id=quotation_in.service_id,
        first_name=quotation_in.first_name,
        last_name=quotation_in.last_name,
        email=quotation_in.email,
        phone=quotation_in.phone,
        address=quotation_in.address,
        city=quotation_in.city,
        postal_code=quotation_in.postal_code,
        description=quotation_in.description,
        preferred_timeline=quotation_in.preferred_timeline
    )
    db.add(quotation)
    db.commit()
    db.refresh(quotation)
    return quotation


# -------------------------
# READ
# -------------------------
def get_quotation(db: Session, quotation_id: int) -> Optional[Quotation]:
    return db.query(Quotation).filter(Quotation.id == quotation_id).first()


def get_quotations(db: Session, skip: int = 0, limit: int = 100) -> List[Quotation]:
    return db.query(Quotation).offset(skip).limit(limit).all()


def get_quotations_by_service(db: Session, service_id: int) -> List[Quotation]:
    return db.query(Quotation).filter(Quotation.service_id == service_id).all()


# -------------------------
# UPDATE
# -------------------------
def update_quotation(db: Session, quotation_id: int, quotation_in: QuotationUpdate) -> Optional[Quotation]:
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        return None

    if quotation_in.service_id is not None:
        quotation.service_id = quotation_in.service_id
    if quotation_in.first_name is not None:
        quotation.first_name = quotation_in.first_name
    if quotation_in.last_name is not None:
        quotation.last_name = quotation_in.last_name
    if quotation_in.email is not None:
        quotation.email = quotation_in.email
    if quotation_in.phone is not None:
        quotation.phone = quotation_in.phone
    if quotation_in.address is not None:
        quotation.address = quotation_in.address
    if quotation_in.city is not None:
        quotation.city = quotation_in.city
    if quotation_in.postal_code is not None:
        quotation.postal_code = quotation_in.postal_code
    if quotation_in.description is not None:
        quotation.description = quotation_in.description
    if quotation_in.preferred_timeline is not None:
        quotation.preferred_timeline = quotation_in.preferred_timeline

    db.commit()
    db.refresh(quotation)
    return quotation


# -------------------------
# DELETE
# -------------------------
def delete_quotation(db: Session, quotation_id: int) -> bool:
    quotation = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quotation:
        return False
    db.delete(quotation)
    db.commit()
    return True
