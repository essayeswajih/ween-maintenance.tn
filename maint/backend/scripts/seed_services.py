import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in environment")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
from models.servicesModels import Service, CategoryService
from crud.serviceCrud import create_category, create_service
from schemas.serviceSchemas import CategoryServiceCreate, ServiceCreate

def seed_services():
    db = SessionLocal()
    print("Connected to database.")
    try:
        # 1. Create Categories
        categories_data = [
            {
                "name": "Plomberie",
                "slug": "plumbing",
                "description": "Installation, réparation et maintenance de systèmes de plomberie résidentiels et commerciaux.",
                "image_url": "🚰"
            },
            {
                "name": "Électricité",
                "slug": "electrical",
                "description": "Services électriques professionnels incluant installation, réparation et mise aux normes.",
                "image_url": "⚡"
            },
            {
                "name": "Chauffage",
                "slug": "heating",
                "description": "Installation et maintenance de systèmes de chauffage pour votre confort thermique.",
                "image_url": "🔥"
            },
            {
                "name": "Chaudières",
                "slug": "boilers",
                "description": "Expertise complète en installation et maintenance de chaudières.",
                "image_url": "🔧"
            }
        ]

        created_categories = {}
        for cat in categories_data:
            existing = db.query(CategoryService).filter(CategoryService.slug == cat["slug"]).first()
            if not existing:
                new_cat = create_category(db, CategoryServiceCreate(**cat))
                created_categories[cat["slug"]] = new_cat.id
                print(f"Created category: {cat['name']}")
            else:
                created_categories[cat["slug"]] = existing.id
                print(f"Category already exists: {cat['name']}")

        # 2. Create Services
        services_data = [
            {
                "name": "Service de Plomberie",
                "slug": "plumbing",
                "description": "Services complèts de plomberie incluant installation, réparation et maintenance de systèmes de plomberie résidentiels et commerciaux.",
                "price": 150.0,
                "price_unit": "intervention",
                "image_url": "💧",
                "moyDuration": 2.5,
                "disponiblity": "Lun-Dim 7h-20h",
                "specialties": "Installation tuyauterie, Réparation fuites, Débouchage",
                "category_id": created_categories["plumbing"],
                "features": [
                    "Techniciens certifiés et expérimentés",
                    "Travaux garantis 2 ans minimum",
                    "Devis gratuit sans engagement",
                    "Intervention rapide (24-48h)",
                    "Respect des normes de sécurité",
                    "Transparence tarifaire totale"
                ],
                "process": [
                    {"step": 1, "title": "Demande de devis", "description": "Remplissez le formulaire avec les détails de votre projet"},
                    {"step": 2, "title": "Évaluation", "description": "Nos experts évaluent votre demande et proposent un devis"},
                    {"step": 3, "title": "Planification", "description": "Choisissez une date et heure qui vous convient"},
                    {"step": 4, "title": "Intervention", "description": "Notre technicien effectue le travail avec profesionnalisme"},
                    {"step": 5, "title": "Suivi", "description": "Nous assurons le suivi post-intervention et la satisfaction"}
                ],
                "rating": 4.8,
                "num_ratings": 124
            },
            {
                "name": "Service Électricité",
                "slug": "electrical",
                "description": "Services électriques professionnels incluant installation, réparation et mise aux normes de sécurité de votre installation électrique.",
                "price": 120.0,
                "price_unit": "intervention",
                "image_url": "⚡",
                "moyDuration": 1.5,
                "disponiblity": "Lun-Sam 8h-19h",
                "specialties": "Installation électrique, Diagnostique électrique, Mise aux normes",
                "category_id": created_categories["electrical"],
                "features": [
                    "Interventions d'urgence 24/7",
                    "Mise en conformité NFC 15-100",
                    "Matériel de haute qualité",
                    "Garantie décennale",
                    "Devis transparent"
                ],
                "process": [
                    {"step": 1, "title": "Contact", "description": "Contactez-nous pour votre besoin électrique"},
                    {"step": 2, "title": "Diagnostic", "description": "Visite technique et devis détaillé"},
                    {"step": 3, "title": "Réalisation", "description": "Travaux réalisés par nos experts"},
                    {"step": 4, "title": "Validation", "description": "Contrôle et mise en service"}
                ],
                "rating": 4.9,
                "num_ratings": 89
            },
            {
                "name": "Service Chauffage",
                "slug": "heating",
                "description": "Installation et maintenance de systèmes de chauffage modernes pour assurer votre confort thermique toute l'année.",
                "price": 200.0,
                "price_unit": "intervention",
                "image_url": "🔥",
                "moyDuration": 3.5,
                "disponiblity": "Lun-Dim 7h-20h",
                "specialties": "Installation radiateurs, Maintenance chaudière, Diagnostic thermique",
                "category_id": created_categories["heating"],
                "features": [
                    "Optimisation énergétique",
                    "Contrats d'entretien",
                    "Dépannage toutes marques",
                    "Économies d'énergie garanties"
                ],
                "process": [
                    {"step": 1, "title": "Étude", "description": "Analyse de vos besoins thermiques"},
                    {"step": 2, "title": "Proposition", "description": "Solution adaptée et devis"},
                    {"step": 3, "title": "Installation", "description": "Mise en place par nos chauffagistes"},
                    {"step": 4, "title": "Maintenance", "description": "Suivi et entretien régulier"}
                ],
                "rating": 4.7,
                "num_ratings": 56
            },
            {
                "name": "Service Chaudierès",
                "slug": "boilers",
                "description": "Expertise complète en installation, maintenance et dépannage de chaudières haute performance et économes en énergie.",
                "price": 300.0,
                "price_unit": "intervention",
                "image_url": "🔧",
                "moyDuration": 5.0,
                "disponiblity": "Lun-Sam 8h-18h",
                "specialties": "Installation chaudière, Révision annuelle, Ramonage",
                "category_id": created_categories["boilers"],
                "features": [
                    "Certifié qualigaz",
                    "Intervention rapide",
                    "Pièces d'origine",
                    "Conseils personnalisés"
                ],
                "process": [
                    {"step": 1, "title": "Analyse", "description": "Vérification de l'ancienne installation"},
                    {"step": 2, "title": "Choix", "description": "Aide au choix du nouveau modèle"},
                    {"step": 3, "title": "Pose", "description": "Installation et raccordements"},
                    {"step": 4, "title": "Tests", "description": "Mise en eau et tests de sécurité"}
                ],
                "rating": 4.6,
                "num_ratings": 42
            }
        ]

        for svc in services_data:
            existing = db.query(Service).filter(Service.slug == svc["slug"]).first()
            if not existing:
                create_service(db, ServiceCreate(**svc))
                print(f"Created service: {svc['name']}")
            else:
                # Update existing service with new fields
                for key, value in svc.items():
                    setattr(existing, key, value)
                db.commit()
                print(f"Updated service: {svc['name']}")

    finally:
        db.close()
        print("Database connection closed.")

if __name__ == "__main__":
    seed_services()
