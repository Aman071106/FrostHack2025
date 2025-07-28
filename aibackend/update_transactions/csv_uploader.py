from flask import Flask, request, jsonify
from sqlalchemy import create_engine, text
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv
from flask_cors import CORS  # Add this import

load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
# Load environment variables
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

# Create database connection
encoded_password = quote_plus(DB_PASSWORD)
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

@app.route('/upload_transactions', methods=['POST'])
def upload_transactions():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        # Read CSV content
        content = file.read().decode('utf-8')
        lines = [line for line in content.split('\n') if line.strip()]
        if not lines:
            return jsonify({"error": "Empty CSV file"}), 400
        
        # Get headers (assuming first line is header)
        headers = [h.strip() for h in lines[0].split(',')]
        
        with engine.connect() as connection:
            # 1️⃣ Drop existing transactions table
            connection.execute(text("DROP TABLE IF EXISTS transactions"))
            
            # 2️⃣ Create table dynamically (all columns as TEXT for flexibility)
            columns_sql = ', '.join([f"`{h}` TEXT" for h in headers])
            create_sql = f"CREATE TABLE transactions ({columns_sql})"
            connection.execute(text(create_sql))
            
            # 3️⃣ Prepare insert statement dynamically
            placeholders = ', '.join([f":{h}" for h in headers])
            insert_sql = f"""
                INSERT INTO transactions ({', '.join([f'`{h}`' for h in headers])})
                VALUES ({placeholders})
            """
            
            # 4️⃣ Insert rows
            row_count = 0
            for line in lines[1:]:
                values = [v.strip() for v in line.split(',')]
                if len(values) != len(headers):
                    continue  # skip malformed rows
                
                params = dict(zip(headers, values))
                connection.execute(text(insert_sql), params)
                row_count += 1
            
            connection.commit()
        
        return jsonify({"message": f"Successfully uploaded {row_count} transactions with schema {headers}"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
