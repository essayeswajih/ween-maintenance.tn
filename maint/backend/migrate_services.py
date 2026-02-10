import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    print("DATABASE_URL not found in environment")
    exit(1)

engine = create_engine(DATABASE_URL)

def run_migration():
    with engine.connect() as conn:
        print("Checking for missing columns in 'services' table...")
        
        # Add rating column if it doesn't exist
        try:
            conn.execute(text("ALTER TABLE services ADD COLUMN rating FLOAT DEFAULT 0.0"))
            print("Added 'rating' column to 'services' table.")
        except Exception as e:
            if "already exists" in str(e):
                print("'rating' column already exists.")
            else:
                print(f"Error adding 'rating' column: {e}")
        
        # Add num_ratings column if it doesn't exist
        try:
            conn.execute(text("ALTER TABLE services ADD COLUMN num_ratings INTEGER DEFAULT 0"))
            print("Added 'num_ratings' column to 'services' table.")
        except Exception as e:
            if "already exists" in str(e):
                print("'num_ratings' column already exists.")
            else:
                print(f"Error adding 'num_ratings' column: {e}")

        conn.commit()
        print("Migration complete.")

if __name__ == "__main__":
    run_migration()
