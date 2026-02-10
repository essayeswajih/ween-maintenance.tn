from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr
from sqlalchemy import CheckConstraint, Column, Integer, String, Float, ForeignKey, DateTime, Enum, Text, Boolean, JSON, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from db.database import Base

# Product Model
class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)

    specialties = Column(String, nullable=True)
    disponiblity = Column(Text, nullable=True,default="Lun-Dim 7h-20h")
    moyDuration = Column(Float, nullable=False,default="2") #2 heures

    category_id = Column(Integer, ForeignKey("categories_service.id"), nullable=True)

    image_url = Column(Text, nullable=True)
    slug = Column(String, nullable=False, unique=True)
    
    price_unit = Column(String, nullable=True, default="intervention")
    features = Column(JSON, nullable=True)
    process = Column(JSON, nullable=True)
    
    rating = Column(Float, default=0.0)
    num_ratings = Column(Integer, default=0)

    # Relationships
    category = relationship("CategoryService", back_populates="services")
    quotations = relationship("Quotation", back_populates="service")
    ratings = relationship("Rating", back_populates="service", cascade="all, delete-orphan")


# Category Model
class CategoryService(Base):
    __tablename__ = "categories_service"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    image_url = Column(Text, nullable=True)
    slug = Column(String, nullable=False, unique=True)

    services = relationship("Service", back_populates="category")


# Order Model
class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)

    # Service selected
    service_id = Column(
        Integer,
        ForeignKey("services.id"),
        nullable=False
    )

    # User who requested the quotation (optional if guest)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Personal info
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(30), nullable=False)

    # Location
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    postal_code = Column(String(20), nullable=True)

    # Project details
    description = Column(Text, nullable=False)
    preferred_timeline = Column(String(50), nullable=True)

    # Status
    status = Column(String(50), default="PENDING") # PENDING, OPEN, ASSIGNED, COMPLETED, CANCELLED
    
    # Admin selection
    selected_proposal_id = Column(
        Integer, 
        ForeignKey("quotation_proposals.id", use_alter=True, name="fk_quotation_proposal"), 
        nullable=True
    )

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    service = relationship("Service", back_populates="quotations")
    proposals = relationship(
        "QuotationProposal", 
        back_populates="quotation", 
        cascade="all, delete-orphan",
        foreign_keys="[QuotationProposal.quotation_id]"
    )
    selected_proposal = relationship("QuotationProposal", foreign_keys=[selected_proposal_id])


class QuotationProposal(Base):
    __tablename__ = "quotation_proposals"

    id = Column(Integer, primary_key=True, index=True)
    
    quotation_id = Column(Integer, ForeignKey("quotations.id"), nullable=False)
    freelancer_id = Column(Integer, ForeignKey("freelancers.id"), nullable=False)
    
    price = Column(Float, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String(50), default="PENDING") # PENDING, ACCEPTED, REJECTED
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    quotation = relationship("Quotation", foreign_keys=[quotation_id], back_populates="proposals")
    freelancer = relationship("Freelancer")

