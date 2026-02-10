from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from db.database import Base
from sqlalchemy.orm import relationship

# SQLAlchemy Model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String, nullable=True)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="client") # client, freelancer, admin
    two_factor_enabled = Column(Integer, default=0) # 0: disabled, 1: enabled (using Integer for SQLite compatibility if needed, else Boolean)
    
    # Relationships
    ratings = relationship("Rating", back_populates="user", cascade="all, delete-orphan")
    freelancer = relationship("Freelancer", back_populates="user", uselist=False)

# Pydantic Models
class UserSchema(BaseModel):
    id: int
    username: str
    full_name: str | None = None
    email: str
    phone: str | None = None
    role: str = "client"
    two_factor_enabled: int = 0

    class Config:
        from_attributes = True  # Enable ORM mode for SQLAlchemy

class UserCreateSchema(BaseModel):
    username: str
    full_name: str | None = None
    email: str
    phone: str | None = None
    password: str

class UserInDBSchema(UserSchema):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class PasswordChangeSchema(BaseModel):
    current_password: str
    new_password: str