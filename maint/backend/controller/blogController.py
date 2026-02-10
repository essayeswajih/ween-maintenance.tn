from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from crud import blogCrud
from schemas.blogSchemas import BlogCreate, BlogUpdate, BlogResponse

router = APIRouter()

@router.post(("/"), response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
def create_blog(blog_in: BlogCreate, db: Session = Depends(get_db)):
    # Check if slug already exists
    existing = blogCrud.get_blog_by_slug(db, blog_in.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    return blogCrud.create_blog(db, blog_in)

@router.get(("/"), response_model=List[BlogResponse])
def read_blogs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return blogCrud.get_blogs(db, skip=skip, limit=limit)

@router.get("/{blog_id}", response_model=BlogResponse)
def read_blog(blog_id: int, db: Session = Depends(get_db)):
    db_blog = blogCrud.get_blog(db, blog_id)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return db_blog

@router.get("/slug/{slug}", response_model=BlogResponse)
def read_blog_by_slug(slug: str, db: Session = Depends(get_db)):
    db_blog = blogCrud.get_blog_by_slug(db, slug)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return db_blog

@router.put("/{blog_id}", response_model=BlogResponse)
def update_blog(blog_id: int, blog_in: BlogUpdate, db: Session = Depends(get_db)):
    db_blog = blogCrud.update_blog(db, blog_id, blog_in)
    if not db_blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return db_blog

@router.delete("/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    success = blogCrud.delete_blog(db, blog_id)
    if not success:
        raise HTTPException(status_code=404, detail="Blog not found")
    return None
