
import sqlalchemy
from sqlalchemy import create_engine, inspect

DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/maintenance_tn"

def list_columns():
    try:
        engine = create_engine(DATABASE_URL)
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"Tables: {tables}")
        
        if "blogs" in tables:
            columns = inspector.get_columns("blogs")
            print("\nColumns in 'blogs' table:")
            for column in columns:
                print(f"- {column['name']}: {column['type']}")
        else:
            print("\n'blogs' table not found.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    list_columns()
