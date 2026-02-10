from sqlalchemy import Column, Integer, String, Float, Text
from db.database import Base

class Site(Base):
    __tablename__ = "site"

    id = Column(Integer, primary_key=True, index=True)

    # Basic info
    name = Column(String, nullable=False, default="Maintenance.com.tn")
    email = Column(String, nullable=False, default="info@maintenance.com.tn")
    phone = Column(String, nullable=True,default="+216 27 553 981")
    address = Column(Text, nullable=True)
    city = Column(String, nullable=True, default="Tunis")
    country = Column(String, nullable=True, default="Tunisie")

    # Delivery
    shipping_cost = Column(Float, nullable=False, default=15)        # Coût de livraison
    free_shipping_threshold = Column(Float, nullable=False, default=150)  # Livraison gratuite à partir de

    # Tax
    tax_rate = Column(Float, nullable=False, default=19)             # Taux de taxe (%)

    # Currency
    currency = Column(String, nullable=False, default="DT")
