#!/bin/bash

# Run rag.py first
echo "Starting rag.py..."
python rag.py &

# Wait for rag.py to start properly (adjust the sleep time if needed)
sleep 5

# Run user.py
echo "Starting user.py..."
python user.py &

# Wait for user.py to start properly (adjust the sleep time if needed)
sleep 5

# Run csv_uploader.py
echo "Starting csv_uploader.py..."
python csv_uploader.py

# Keep the container running
tail -f /dev/null
