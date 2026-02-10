from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.database import DATABASE_URL
from models.blogModels import Blog

def check_blogs():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        blogs = db.query(Blog).all()
        print(f"Found {len(blogs)} blogs.")
        for b in blogs:
            print(f"ID: {b.id}, Title: {b.title}, Slug: {b.slug}")
    finally:
        db.close()

if __name__ == "__main__":
    check_blogs()
