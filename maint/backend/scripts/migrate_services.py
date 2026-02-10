import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

def migrate():
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found")
        return

    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        print("Adding price_unit column...")
        try:
            conn.execute(text("ALTER TABLE services ADD COLUMN price_unit VARCHAR DEFAULT 'intervention';"))
            conn.commit()
            print("Added price_unit")
        except Exception as e:
            print(f"Error adding price_unit: {e}")

        print("Adding features column...")
        try:
            conn.execute(text("ALTER TABLE services ADD COLUMN features JSON;"))
            conn.commit()
            print("Added features")
        except Exception as e:
            print(f"Error adding features: {e}")

        print("Adding process column...")
        try:
            conn.execute(text("ALTER TABLE services ADD COLUMN process JSON;"))
            conn.commit()
            print("Added process")
        except Exception as e:
            print(f"Error adding process: {e}")

    print("Migration complete.")

if __name__ == "__main__":
    migrate()
