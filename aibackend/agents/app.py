import streamlit as st
import requests
import json
from typing import List

def send_rag_request(url: str, user_queries: List[str]) -> str:
    """
    Sends a RAG request to the agent's REST API endpoint.
    
    Args:
        url (str): Website URL to scrape
        user_queries (List[str]): List of user queries
        
    Returns:
        str: Response from the RAG agent
    """
    endpoint = "http://localhost:8080/askAI"
    payload = {
        "url": url,
        "user_query": user_queries
    }
    
    try:
        response = requests.post(endpoint, json=payload)
        if response.status_code == 200:
            return response.json().get("text", "No response text found")
        else:
            return f"Error: Received status code {response.status_code}"
    except requests.exceptions.RequestException as e:
        return f"Connection error: {str(e)}"

# Set up the Streamlit UI
st.title("RAG Query System")
st.subheader("Retrieval-Augmented Generation Interface")

# Input fields
url = st.text_input("Enter website URL:", value="user123")

# Create a container for queries
query_container = st.container()
queries = []

# Default first query
with query_container:
    queries = st.text_area(
        "Enter your queries (one per line):", 
        value="what are the amount spend give me the table?",
        height=150
    ).split('\n')
    # Remove empty queries
    queries = [q.strip() for q in queries if q.strip()]

# Button to submit the request
if st.button("Submit RAG Request"):
    if url and queries:
        with st.spinner("Waiting for response..."):
            response = send_rag_request(url, queries)
            
        # Display results
        st.subheader("RAG Agent Response")
        st.markdown(response)
        
        # Show the raw request for debugging
        with st.expander("Show request details"):
            st.json({
                "url": url,
                "user_queries": queries
            })
    else:
        st.error("Please provide both URL and at least one query")

# Display information about the system
with st.sidebar:
    st.header("About this app")
    st.markdown("""
    This application interfaces with a uAgents-based RAG system.
    
    **How it works:**
    1. Enter a website URL to analyze
    2. Add one or more questions about the website content
    3. Submit the request to the agent
    4. View the AI-generated response
    
    The agent will retrieve content from the specified URL and generate answers based on the content using AI.
    
    **Note:** Make sure the agent is running on port 8080 before submitting requests.
    """)
    
    st.header("Agent Status")
    
    # Check if agent is running
    try:
        status_check = requests.get("http://localhost:8080/")
        running = status_check.status_code == 200
    except:
        running = False
        
    if running:
        st.success("✅ Agent is running")
    else:
        st.error("❌ Agent not detected. Please start the agent before using this app.")