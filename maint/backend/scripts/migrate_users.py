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
        print("Adding full_name column...")
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR;"))
            conn.commit()
            print("Added full_name")
        except Exception as e:
            print(f"Error adding full_name: {e}")

        print("Adding phone column...")
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR;"))
            conn.commit()
            print("Added phone")
        except Exception as e:
            print(f"Error adding phone: {e}")

        print("Adding role column...")
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'client';"))
            conn.commit()
            print("Added role")
        except Exception as e:
            print(f"Error adding role: {e}")

    print("Migration complete.")

if __name__ == "__main__":
    migrate()
