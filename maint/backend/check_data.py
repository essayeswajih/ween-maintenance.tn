from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.database import DATABASE_URL
# Import all models to ensure registry is populated
from models.servicesModels import Service, Quotation, QuotationProposal
from models.freelancer import Freelancer
from models.Oauth2Models import User

def check_data():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        services = db.query(Service).all()
        print(f"Found {len(services)} services.")
        for s in services:
            print(f"ID: {s.id}, Name: {s.name}, Slug: {s.slug}")
            if s.slug is None:
                print(f"  [WARNING] Slug is None for Service ID {s.id}")
                # Optional: Fix it
                # s.slug = s.name.lower().replace(" ", "-")
                # db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    check_data()
