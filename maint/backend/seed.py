import sys
import os
from sqlalchemy.orm import Session
from db.database import SessionLocal, engine, Base

# Import models - ALL of them to ensure relationships map correctly
from models.vetrineModels import Product, Category, Order, OrderItem, CartItem
from models.servicesModels import Service, CategoryService, Quotation
from models.freelancer import Freelancer
from models.ratingModels import Rating
from models.Oauth2Models import User
from models.fournisseur import Supplier
# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        # Clear existing data in correct order
        db.query(Rating).delete()
        db.query(User).delete() # Users might be linked
        db.query(Freelancer).delete()
        db.query(Service).delete()
        db.query(CategoryService).delete()
        db.query(Product).delete()
        db.query(Category).delete()
        db.commit()

        print("Seeding Categories...")
        cat_heating = Category(name="Chauffage", description="Équipements de chauffage", image_url="heating.jpg")
        cat_plumbing = Category(name="Plomberie", description="Matériel de plomberie", image_url="plumbing.jpg")
        cat_elec = Category(name="Électricité", description="Matériel électrique", image_url="electric.jpg")
        
        db.add_all([cat_heating, cat_plumbing, cat_elec])
        db.commit()

        print("Seeding Products...")
        products = [
            Product(
                name="Radiateur Aluminium Premium",
                description="Radiateur haute performance pour une chaleur douce.",
                price=149.99,
                stock_quantity=50,
                category_id=cat_heating.id,
                rating=4.8,
                num_ratings=128,
                image_url="radiateur_alu.jpg",
                slug="radiateur-aluminium-premium",
                sizes=["Standard"],
                colors=[{"name": "white", "label": "Blanc", "hex": "#FFF"}]
            ),
            Product(
                name="Tuyauterie Cuivre 22mm",
                description="Tuyau en cuivre haute qualité pour plomberie.",
                price=89.50,
                stock_quantity=100,
                category_id=cat_plumbing.id,
                rating=4.9,
                num_ratings=95,
                image_url="tuyau_cuivre.jpg",
                slug="tuyauterie-cuivre-22mm"
            ),
            Product(
                name="Câble Électrique 2.5mm²",
                description="Rouleau de 100m de câble électrique standard.",
                price=59.99,
                stock_quantity=200,
                category_id=cat_elec.id,
                rating=4.7,
                num_ratings=156,
                image_url="cable_elec.jpg",
                slug="cable-electrique-2-5mm"
            ),
             Product(
                name="Thermostat Intelligent WiFi",
                description="Contrôlez votre chauffage depuis votre smartphone.",
                price=199.99,
                stock_quantity=30,
                category_id=cat_heating.id,
                rating=4.9,
                num_ratings=203,
                image_url="thermostat_wifi.jpg",
                slug="thermostat-intelligent-wifi"
            ),
        ]
        db.add_all(products)
        db.commit()

        print("Seeding Service Categories...")
        cat_srv_repair = CategoryService(name="Réparation", description="Services de réparation", slug="reparation")
        cat_srv_install = CategoryService(name="Installation", description="Services d'installation", slug="installation")
        db.add_all([cat_srv_repair, cat_srv_install])
        db.commit()

        print("Seeding Services...")
        services = [
            Service(
                name="Plomberie d'Urgence",
                description="Intervention rapide pour fuites et débouchage.",
                price=50.0,
                category_id=cat_srv_repair.id,
                slug="plomberie-urgence",
                image_url="plumber_emergency.jpg",
                specialties="Fuites, Débouchage",
                moyDuration=1
            ),
            Service(
                name="Installation Électrique",
                description="Installation complète ou rénovation électrique.",
                price=100.0,
                category_id=cat_srv_install.id,
                slug="installation-electrique",
                image_url="elec_install.jpg",
                specialties="Rénovation, Neuf",
                moyDuration=5
            ),
            Service(
                name="Maintenance Chaudière",
                description="Entretien annuel et dépannage chaudière.",
                price=80.0,
                category_id=cat_srv_repair.id,
                slug="maintenance-chaudiere",
                image_url="boiler_maintenance.jpg",
                specialties="Gaz, Fioul",
                moyDuration=2
            )
        ]
        db.add_all(services)
        db.commit()

        print("Seeding Freelancers...")
        # Check if freelancer exists to avoid unique constraint error if re-running without clean
        if not db.query(Freelancer).filter_by(email="mario@example.com").first():
            freelancer = Freelancer(
                first_name="Mario",
                last_name="Rossi",
                username="mario_plumber",
                email="mario@example.com",
                tel="20123456",
                title="Plombier Expert",
                bio="10 ans d'expérience en plomberie résidentielle.",
                skills=["Plomberie", "Chauffage"],
                services=["Dépannage", "Installation sanitaire"],
                city="Tunis",
                rating=4.9,
                reviews_count=15,
                verified=True
            )
            db.add(freelancer)
            db.commit()
        
        print("Data seeded successfully!")

    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
