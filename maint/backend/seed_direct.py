import os
import psycopg2
from dotenv import load_dotenv

def seed_direct():
    load_dotenv()
    url = os.getenv("DATABASE_URL")
    print(f"Connecting to {url}")
    conn = psycopg2.connect(url)
    cur = conn.cursor()
    
    updates = [
        ("plomberie-urgence", 4.8, 124),
        ("electricite-urgence", 4.9, 89),
        ("chauffage-maintenance", 4.7, 56),
        ("maintenance-chaudiere", 4.6, 42)
    ]
    
    for slug, rating, num in updates:
        cur.execute(
            "UPDATE services SET rating = %s, num_ratings = %s WHERE slug = %s",
            (rating, num, slug)
        )
        print(f"Updated {slug}: {rating} stars, {num} reviews")
    
    conn.commit()
    cur.close()
    conn.close()
    print("Direct seeding complete.")

if __name__ == "__main__":
    seed_direct()
