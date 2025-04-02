from sqlalchemy import create_engine
import pandas as pd

# MySQL Database Configuration
DB_USER = "myuser"  # or your MySQL username
DB_PASS = "mypassword"
DB_HOST = "localhost"
DB_PORT = "3306"  # MySQL default port
DB_NAME = "financial_data"

# Use pymysql driver
engine = create_engine(f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

# Read the CSV
df = pd.read_csv("/Users/harshyadav/Documents/Frosthack 2025/frosthack2025/FrostHack2025/aibackend/agents/vectorStore.csv", dtype={"userId": str})

# Migrate data
df.to_sql("transactions", con=engine, if_exists="append", index=False)

print("Data migration complete!")
