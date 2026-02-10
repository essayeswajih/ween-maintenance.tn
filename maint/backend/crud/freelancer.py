from sqlalchemy.orm import Session
from models.freelancer import Freelancer
from schemas.freelancer import FreelancerCreate, FreelancerUpdate

def get_freelancer(db: Session, freelancer_id: int):
    return db.query(Freelancer).filter(Freelancer.id == freelancer_id).first()

def get_freelancer_by_username(db: Session, username: str):
    return db.query(Freelancer).filter(Freelancer.username == username).first()

def get_freelancer_by_email(db: Session, email: str):
    return db.query(Freelancer).filter(Freelancer.email == email).first()

def get_freelancers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Freelancer).offset(skip).limit(limit).all()

def create_freelancer(db: Session, freelancer: FreelancerCreate):
    db_freelancer = Freelancer(**freelancer.dict())
    db.add(db_freelancer)
    db.commit()
    db.refresh(db_freelancer)
    return db_freelancer

def update_freelancer(db: Session, freelancer_id: int, freelancer_in: FreelancerUpdate):
    db_freelancer = get_freelancer(db, freelancer_id)
    if not db_freelancer:
        return None
    
    update_data = freelancer_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_freelancer, key, value)
    
    db.add(db_freelancer)
    db.commit()
    db.refresh(db_freelancer)
    return db_freelancer

def delete_freelancer(db: Session, freelancer_id: int):
    db_freelancer = get_freelancer(db, freelancer_id)
    if db_freelancer:
        db.delete(db_freelancer)
        db.commit()
        return True
    return False
