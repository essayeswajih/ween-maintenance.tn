from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from db.database import get_db
from models.ratingModels import Rating
from crud import ratingCrud as crud_rating
from schemas.ratingSchemas import RatingCreate, RatingUpdate, RatingResponse

router = APIRouter(
)

# -------------------------
# CREATE RATING
# -------------------------
@router.post(("/"), response_model=RatingResponse, status_code=status.HTTP_201_CREATED)
def create_rating(rating_in: RatingCreate, db: Session = Depends(get_db)):
    if not rating_in.service_id and not rating_in.product_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be linked to either a service or a product."
        )
    rating = crud_rating.create_rating(db=db, rating_in=rating_in)
    return rating


# -------------------------
# GET ALL RATINGS
# -------------------------
@router.get(("/"), response_model=List[RatingResponse])
def read_ratings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_rating.get_ratings(db, skip=skip, limit=limit)


# -------------------------
# GET RATING BY ID
# -------------------------
@router.get("/{rating_id}", response_model=RatingResponse)
def read_rating(rating_id: int, db: Session = Depends(get_db)):
    rating = crud_rating.get_rating(db, rating_id)
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    return rating


# -------------------------
# GET RATINGS BY SERVICE
# -------------------------
@router.get("/service/{service_id}", response_model=List[RatingResponse])
def read_ratings_by_service(service_id: int, db: Session = Depends(get_db)):
    return crud_rating.get_ratings_by_service(db, service_id)


# -------------------------
# GET RATINGS BY PRODUCT
# -------------------------
@router.get("/product/{product_id}", response_model=List[RatingResponse])
def read_ratings_by_product(product_id: int, db: Session = Depends(get_db)):
    return crud_rating.get_ratings_by_product(db, product_id)


# -------------------------
# UPDATE RATING
# -------------------------
@router.put("/{rating_id}", response_model=RatingResponse)
def update_rating(rating_id: int, rating_in: RatingUpdate, db: Session = Depends(get_db)):
    rating = crud_rating.update_rating(db, rating_id, rating_in)
    if not rating:
        raise HTTPException(status_code=404, detail="Rating not found")
    return rating


# -------------------------
# DELETE RATING
# -------------------------
@router.delete("/{rating_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rating(rating_id: int, db: Session = Depends(get_db)):
    success = crud_rating.delete_rating(db, rating_id)
    if not success:
        raise HTTPException(status_code=404, detail="Rating not found")
    return None


# -------------------------
# GET AVERAGE RATING
# -------------------------
@router.get("/service/{service_id}/average")
def service_average_rating(service_id: int, db: Session = Depends(get_db)):
    avg = crud_rating.get_average_rating_for_service(db, service_id)
    if avg is None:
        raise HTTPException(status_code=404, detail="No ratings for this service")
    return {"service_id": service_id, "average_rating": avg}


@router.get("/product/{product_id}/average")
def product_average_rating(product_id: int, db: Session = Depends(get_db)):
    avg = crud_rating.get_average_rating_for_product(db, product_id)
    if avg is None:
        raise HTTPException(status_code=404, detail="No ratings for this product")
    return {"product_id": product_id, "average_rating": avg}
