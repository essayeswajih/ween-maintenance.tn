from sqlalchemy.orm import Session
from typing import List, Optional
from models.ratingModels import Rating
from models.Oauth2Models import User
from models.servicesModels import  Service
from models.vetrineModels import Product
from schemas.ratingSchemas import RatingCreate, RatingUpdate, RatingResponse

# -------------------------
# CREATE
# -------------------------
def create_rating(db: Session, rating_in: RatingCreate) -> Rating:
    rating = Rating(
        user_id=rating_in.user_id,
        service_id=rating_in.service_id,
        product_id=rating_in.product_id,
        rating=rating_in.rating,
        comment=rating_in.comment
    )
    db.add(rating)
    db.commit()
    db.refresh(rating)
    return rating


# -------------------------
# READ
# -------------------------
def get_rating(db: Session, rating_id: int) -> Optional[Rating]:
    return db.query(Rating).filter(Rating.id == rating_id).first()


def get_ratings(db: Session, skip: int = 0, limit: int = 100) -> List[Rating]:
    return db.query(Rating).offset(skip).limit(limit).all()


def get_ratings_by_service(db: Session, service_id: int) -> List[Rating]:
    return db.query(Rating).filter(Rating.service_id == service_id).all()


def get_ratings_by_product(db: Session, product_id: int) -> List[Rating]:
    return db.query(Rating).filter(Rating.product_id == product_id).all()


def get_ratings_by_user(db: Session, user_id: int) -> List[Rating]:
    return db.query(Rating).filter(Rating.user_id == user_id).all()


# -------------------------
# UPDATE
# -------------------------
def update_rating(db: Session, rating_id: int, rating_in: RatingUpdate) -> Optional[Rating]:
    rating = db.query(Rating).filter(Rating.id == rating_id).first()
    if not rating:
        return None
    if rating_in.rating is not None:
        rating.rating = rating_in.rating
    if rating_in.comment is not None:
        rating.comment = rating_in.comment
    db.commit()
    db.refresh(rating)
    return rating


# -------------------------
# DELETE
# -------------------------
def delete_rating(db: Session, rating_id: int) -> bool:
    rating = db.query(Rating).filter(Rating.id == rating_id).first()
    if not rating:
        return False
    db.delete(rating)
    db.commit()
    return True


# -------------------------
# UTILITY: average rating
# -------------------------
def get_average_rating_for_service(db: Session, service_id: int) -> Optional[float]:
    ratings = db.query(Rating.rating).filter(Rating.service_id == service_id).all()
    if not ratings:
        return None
    return sum(r[0] for r in ratings) / len(ratings)


def get_average_rating_for_product(db: Session, product_id: int) -> Optional[float]:
    ratings = db.query(Rating.rating).filter(Rating.product_id == product_id).all()
    if not ratings:
        return None
    return sum(r[0] for r in ratings) / len(ratings)
