import csv
import requests
from uagents import Agent, Context
import os

agent = Agent(name="jerry", seed="YOUR NEW PHRASE_HAHAHA", port=8060, endpoint=["http://localhost:8060/submit"])

NEXTJS_CSV_API = "http://localhost:3000/api/upload-csv"  # Next.js API URL
LOCAL_CSV_FILE = "vectorStore.csv"

def fetch_latest_csv_url():
    """Fetch the latest uploaded CSV file URL from Next.js API"""
    response = requests.get(NEXTJS_CSV_API)
    if response.status_code == 200:
        data = response.json()
        if "fileUrl" in data:
            return f"http://localhost:3000{data['fileUrl']}"  # Append base URL
    return None

def download_csv(file_url):
    """Download CSV file from the given URL"""
    response = requests.get(file_url)
    if response.status_code == 200:
        return response.text
    return None

def append_to_local_csv(csv_data):
    """Append fetched CSV data to local file"""
    new_rows = csv.reader(csv_data.splitlines())
    
    # Check if file exists and is non-empty
    file_exists = os.path.exists(LOCAL_CSV_FILE) and os.path.getsize(LOCAL_CSV_FILE) > 0

    with open(LOCAL_CSV_FILE, "a", newline="") as file:
        writer = csv.writer(file)

        if not file_exists:
            writer.writerow(["Date", "Description", "Category", "Amount"])  # Write header if new file

        writer.writerows(new_rows)

@agent.on_interval(period=3)  # Runs every 3 seconds
async def fetch_and_update_csv(ctx: Context):
    """Fetch CSV from Next.js API and append to local file"""
    file_url = fetch_latest_csv_url()
    
    if file_url:
        ctx.logger.info(f"Downloading CSV from {file_url}")
        csv_content = download_csv(file_url)
        if csv_content:
            append_to_local_csv(csv_content)
            ctx.logger.info("New data appended to vectorStore.csv")
        else:
            ctx.logger.warning("Failed to download CSV file")
    else:
        ctx.logger.info("No new CSV file detected")

if __name__ == "__main__":
    agent.run()
