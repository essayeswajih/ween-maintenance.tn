from sqlalchemy import Column, DateTime, Integer, String, Text, Boolean, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from db.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)

    owner_name = Column(String, index=True)
    company_name = Column(String(255), nullable=False, index=True)

    matricule_fiscale = Column(String, nullable=True)
    forme_juridique = Column(String, nullable=True)

    site = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True)
    tel = Column(String(20), unique=True, index=True)

    main_category = Column(String(100), index=True)
    services = Column(JSON, nullable=True)

    address = Column(String(255))
    city = Column(String(100), index=True)
    country = Column(String(100), default="Tunisia")

    verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

    notes = Column(Text, nullable=True)
    blocked_reason = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    products = relationship(
        "Product",
        back_populates="supplier",
        cascade="all, delete-orphan"
    )