import pandas as pd
import os
import pymysql
from flask import Flask, request, jsonify
from sqlalchemy import create_engine, text
import dotenv

dotenv.load_dotenv()

# Load database credentials
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = "financial_data"

# SQLAlchemy engine for database connection
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

app = Flask(__name__)

# Ensure the table exists
TABLE_NAME = "transactions"

def append_to_db(df):
    """Insert data into MySQL while skipping duplicates."""
    try:
        with engine.connect() as conn:
            for _, row in df.iterrows():
                query = text(f"""
                    INSERT INTO {TABLE_NAME} (userId, date, time, amount, category, location, mode)
                    VALUES (:userId, :date, :time, :amount, :category, :location, :mode)
                    ON DUPLICATE KEY UPDATE userId = userId;  -- Do nothing on duplicate
                """)
                conn.execute(query, row.to_dict())
            conn.commit()
        return {"message": "Non-duplicate data inserted successfully."}
    except Exception as e:
        return {"error": str(e)}

@app.route('/update_vector_store', methods=['POST'])
def update_vector_store():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty file provided"}), 400

    temp_path = "temp_upload.csv"
    file.save(temp_path)

    try:
        df = pd.read_csv(temp_path, dtype={"userId": str})
        os.remove(temp_path)
        response = append_to_db(df)
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
