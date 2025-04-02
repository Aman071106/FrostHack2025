import requests

url = "http://127.0.0.1:5000/update_vector_store"  # Change this to your Flask API URL
file_path = "/Users/harshyadav/Documents/Frosthack 2025/frosthack2025/FrostHack2025/aibackend/agents/user125.csv"

files = {'file': open(file_path, 'rb')}  # 'file' must match request.files['file'] in Flask
response = requests.post(url, files=files)

print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")
