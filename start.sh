#!/bin/bash

# Start both agents in background
cd aibackend/agents
python rag.py &
python user.py &

# Start the transaction uploader
cd ../update_transactions
python csv_uploader.py &

# Start Streamlit (keeps container running)
cd ../app
streamlit run app.py
