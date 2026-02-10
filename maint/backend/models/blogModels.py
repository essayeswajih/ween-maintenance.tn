from sqlalchemy import Column, Integer, String, Text, DateTime, func
from db.database import Base

class Blog(Base):
    __tablename__ = "blogs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=True)
    author = Column(String, nullable=True)
    image_url = Column(Text, nullable=True)
    slug = Column(String, nullable=False, unique=True)
    excerpt = Column(Text, nullable=True)
    read_time = Column(String, nullable=True, default="5 min")
    views = Column(Integer, default=0)
    status = Column(String, default="Publié") # Publié, Brouillon
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
