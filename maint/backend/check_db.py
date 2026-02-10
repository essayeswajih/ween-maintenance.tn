from sqlalchemy import create_engine, inspect
from db.database import DATABASE_URL

def check_db():
    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    
    tables = inspector.get_table_names()
    print(f"Tables found: {tables}")
    
    for table in ['services']:
        if table in tables:
            print(f"\nColumns in {table}:")
            columns = inspector.get_columns(table)
            found_slug = False
            for col in columns:
                print(f"  - {col['name']} ({col['type']})")
                if col['name'] == 'slug':
                    found_slug = True
            
            if not found_slug:
                print(f"\n[WARNING] 'slug' column MISSING in {table}!")
        else:
            print(f"\n[ERROR] Table '{table}' NOT FOUND!")

if __name__ == "__main__":
    check_db()
