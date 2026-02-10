import os
import bcrypt
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

def create_admin():
    load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    if not DATABASE_URL:
        print("DATABASE_URL not found")
        return

    engine = create_engine(DATABASE_URL)
    Session = sessionmaker(bind=engine)
    db = Session()

    email = "wajihsayes@gmail.com"
    password = "wajihsayes@gmail.com"
    username = email  # Using email as username as per project convention
    
    print(f"Checking for user: {email}")
    
    # Using raw SQL to avoid model import issues in case of environment differences
    # but since I know the model, I'll use text() for safety
    try:
        # Check if user exists
        check_query = text("SELECT id FROM users WHERE email = :email")
        existing_user = db.execute(check_query, {"email": email}).fetchone()

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        if existing_user:
            print(f"User {email} exists. Updating to admin and setting password...")
            update_query = text("""
                UPDATE users 
                SET hashed_password = :password, role = 'admin', full_name = 'Admin Wajih'
                WHERE email = :email
            """)
            db.execute(update_query, {"password": hashed_password, "email": email})
        else:
            print(f"Creating new admin user: {email}...")
            insert_query = text("""
                INSERT INTO users (username, email, hashed_password, role, full_name)
                VALUES (:username, :email, :password, 'admin', 'Admin Wajih')
            """)
            db.execute(insert_query, {
                "username": username,
                "email": email,
                "password": hashed_password
            })
        
        db.commit()
        print("Success: Admin account is ready.")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
