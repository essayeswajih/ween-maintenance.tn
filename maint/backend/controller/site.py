from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from crud.site import *
from schemas.site import SiteCreate, SiteUpdate, SiteResponse

router = APIRouter()

# GET site parameters
@router.get(("/"), response_model=SiteResponse)
def read_site(db: Session = Depends(get_db)):
    site = get_site(db)
    if not site:
        raise HTTPException(status_code=404, detail="Site parameters not found")
    return site

# UPDATE site parameters
@router.put(("/"), response_model=SiteResponse)
def update_site(site_in: SiteUpdate, db: Session = Depends(get_db)):
    site = update_site(db, site_id=1, site_in=site_in)
    if not site:
        raise HTTPException(status_code=404, detail="Site parameters not found")
    return site

# INIT site parameters (optional, only once)
@router.post(("/"), response_model=SiteResponse, status_code=201)
def create_site(site_in: SiteCreate, db: Session = Depends(get_db)):
    existing = get_site(db)
    if existing:
        raise HTTPException(status_code=400, detail="Site parameters already exist")
    return create_site(db, site_in)
