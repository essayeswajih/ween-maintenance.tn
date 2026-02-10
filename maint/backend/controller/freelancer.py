from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from schemas.freelancer import FreelancerCreate, FreelancerUpdate, FreelancerResponse
from crud import freelancer as crud_freelancer
from utils.auth import admin_only

router = APIRouter()

@router.post("", response_model=FreelancerResponse, status_code=status.HTTP_201_CREATED)
def create_freelancer(freelancer: FreelancerCreate, db: Session = Depends(get_db)):
    db_freelancer = crud_freelancer.get_freelancer_by_email(db, email=freelancer.email)
    if db_freelancer:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_freelancer = crud_freelancer.get_freelancer_by_username(db, username=freelancer.username)
    if db_freelancer:
        raise HTTPException(status_code=400, detail="Username already taken")
        
    return crud_freelancer.create_freelancer(db=db, freelancer=freelancer)

@router.get("", response_model=List[FreelancerResponse])
def read_freelancers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: Session = Depends(admin_only)):
    return crud_freelancer.get_freelancers(db, skip=skip, limit=limit)

@router.get("/{freelancer_id}", response_model=FreelancerResponse)
def read_freelancer(freelancer_id: int, db: Session = Depends(get_db), current_user: Session = Depends(admin_only)):
    db_freelancer = crud_freelancer.get_freelancer(db, freelancer_id=freelancer_id)
    if db_freelancer is None:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    return db_freelancer

@router.put("/{freelancer_id}", response_model=FreelancerResponse)
def update_freelancer(freelancer_id: int, freelancer: FreelancerUpdate, db: Session = Depends(get_db), current_user: Session = Depends(admin_only)):
    db_freelancer = crud_freelancer.update_freelancer(db, freelancer_id=freelancer_id, freelancer_in=freelancer)
    if db_freelancer is None:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    return db_freelancer

@router.delete("/{freelancer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_freelancer(freelancer_id: int, db: Session = Depends(get_db), current_user: Session = Depends(admin_only)):
    success = crud_freelancer.delete_freelancer(db, freelancer_id=freelancer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    return None
