from sqlalchemy import Boolean, Column, Integer, String, Float, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.database import Base

class Freelancer(Base):
    __tablename__ = "freelancers"

    id = Column(Integer, primary_key=True, index=True)

    # Identity
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Link to Auth User
    first_name = Column(String(100), nullable=False, index=True)
    last_name = Column(String(100), nullable=False, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    
    user = relationship("User", back_populates="freelancer")

    # Contact
    email = Column(String(255), unique=True, index=True, nullable=False)
    tel = Column(String(20), unique=True, index=True, nullable=True)
    website = Column(String(255), nullable=True)

    # Professional info
    title = Column(String(255), nullable=True)  # e.g. "Plombier", "Développeur Web"
    bio = Column(Text, nullable=True)
    skills = Column(JSON, nullable=True)        # ["Angular", "FastAPI", "Docker"]
    services = Column(JSON, nullable=True)      # ["Installation", "Maintenance"]

    experience_years = Column(Integer, default=0)
    hourly_rate = Column(Float, nullable=True)

    # Location
    address = Column(String(255), nullable=True)
    city = Column(String(100), index=True)
    country = Column(String(100), default="Tunisia")

    # Legal (optional but important)
    matricule_fiscale = Column(String(100), nullable=True)
    cin = Column(String(20), nullable=True)

    # Trust & status
    verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    rating = Column(Float, default=0)
    reviews_count = Column(Integer, default=0)

    # Media
    avatar = Column(String(255), nullable=True)
    cover_image = Column(String(255), nullable=True)

    # Admin
    notes = Column(Text, nullable=True)
    blocked_reason = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
