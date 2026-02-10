from sqlalchemy.orm import Session
from models.blogModels import Blog
from schemas.blogSchemas import BlogCreate, BlogUpdate
from typing import List, Optional

def get_blogs(db: Session, skip: int = 0, limit: int = 100) -> List[Blog]:
    return db.query(Blog).offset(skip).limit(limit).all()

def get_blog(db: Session, blog_id: int) -> Optional[Blog]:
    return db.query(Blog).filter(Blog.id == blog_id).first()

def get_blog_by_slug(db: Session, slug: str) -> Optional[Blog]:
    return db.query(Blog).filter(Blog.slug == slug).first()

def create_blog(db: Session, blog_in: BlogCreate) -> Blog:
    db_blog = Blog(
        title=blog_in.title,
        content=blog_in.content,
        category=blog_in.category,
        author=blog_in.author,
        image_url=blog_in.image_url,
        slug=blog_in.slug,
        excerpt=blog_in.excerpt,
        read_time=blog_in.read_time,
        status=blog_in.status
    )
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)
    return db_blog

def update_blog(db: Session, blog_id: int, blog_in: BlogUpdate) -> Optional[Blog]:
    db_blog = get_blog(db, blog_id)
    if not db_blog:
        return None
    
    update_data = blog_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_blog, key, value)
    
    db.commit()
    db.refresh(db_blog)
    return db_blog

def delete_blog(db: Session, blog_id: int) -> bool:
    db_blog = get_blog(db, blog_id)
    if not db_blog:
        return False
    db.delete(db_blog)
    db.commit()
    return True
