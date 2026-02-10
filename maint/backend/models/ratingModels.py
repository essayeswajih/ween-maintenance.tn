from sqlalchemy import CheckConstraint, Column, DateTime, ForeignKey, Integer, Text, func
from db.database import Base
from sqlalchemy.orm import relationship


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)

    # Rating target: Service or Product
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="ratings")
    service = relationship("Service", back_populates="ratings")
    product = relationship("Product", back_populates="ratings")

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="rating_range"),
    )