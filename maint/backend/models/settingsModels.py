from sqlalchemy import Column, Integer, String, Float
from db.database import Base

class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    store_name = Column(String, default="Ween-Maintenance.tn")
    email = Column(String, default="info@ween-maintenance.tn")
    phone = Column(String, default="+216 27 553 981")
    address = Column(String, default="Tunis, Tunisie")
    shipping_cost = Column(Float, default=12.0)
    free_shipping_threshold = Column(Float, default=100.0)
    tax_rate = Column(Float, default=19.0)
    currency = Column(String, default="DT")
