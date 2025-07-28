from uagents import Agent, Field, Model, Context
from bs4 import BeautifulSoup
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import ChatPromptTemplate
import pymysql
from sqlalchemy import create_engine, text

import dotenv
import os
from typing import List
import pandas as pd
from urllib.parse import quote_plus
# Load environment variables
dotenv.load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT=os.getenv('DB_PORT')
DB_NAME=os.getenv('DB_NAME')
# Database connection
from urllib.parse import quote_plus

encoded_password = quote_plus(DB_PASSWORD)

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GEMINI_API_KEY)

def read_past_transactions(url):
    """Fetch past transactions of a user from MySQL database."""
    try:
        query = text("""
                        SELECT * FROM transactions
                    """)


        with engine.connect() as conn:
            df = pd.read_sql(query, conn)

        if df.empty:
            return "No financial data found"
        
        return df.to_string(index=False)
    except Exception as e:
        return f"Error loading data: {str(e)}"

class RAGRequest(Model):
    """
    Defines the structure for incoming RAG (Retrieval-Augmented Generation) requests.
    
    Attributes:
        url (str): The website URL to scrape.
        user_query (List[str]): The user's queries related to the website content.
    """
    url: str = Field(description="The website URL to scrape.")
    user_query: List[str] = Field(description="The user's queries related to the website content.")

class RAGResponse(Model):
    """
    Defines the structure for responses generated from the RAG system.
    
    Attributes:
        response (str): The AI-generated answer based on scraped content.
    """
    response: str = Field(description="The AI-generated answer based on scraped content.")

def generate_gemini_response(query, context):
    """Generate response using Gemini AI."""
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", """1) You are an expert in financial analysis and future advice and predictions.
        2) Provide insights about the spendings and expenses. 
        3) Give future advice so that the spendings and expenses can be minimized if asked.
        4) Give a concise details about the transactions.
        5) Keep the answer short and to the point.
         """),
        ("user", "{query}")
    ])
    full_response = llm.invoke(prompt_template.format(query=query + "Context:" + context))
    return extract_answer(full_response)

def extract_answer(full_response):
    """Extract the AI-generated response."""
    return full_response.content.strip() if hasattr(full_response, "content") else "No response generated."

agent = Agent(name="alice", seed="YOUR NEW PHRASE", port=8000, endpoint=["http://localhost:8000/submit"])

@agent.on_message(model=RAGRequest, replies=RAGResponse)
async def handle_rag_request(ctx: Context, sender: str, msg: RAGRequest):
    """Handles incoming RAG requests."""
    ctx.logger.info(f"Retrieving data for user: {msg.url}")
    user_data = read_past_transactions(msg.url)

    if "Error" in user_data or "No financial data" in user_data:
        await ctx.send(sender, RAGResponse(response=user_data))
        return

    documents = [user_data]
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001", google_api_key=GEMINI_API_KEY)
    vector_store = FAISS.from_texts(documents, embeddings)
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 10})

    for question in msg.user_query:
        retrieved_docs = retriever.invoke(question)
        context = "".join([doc.page_content for doc in retrieved_docs])
        response = generate_gemini_response(question, context)
        
        await ctx.send(sender, RAGResponse(response=response))

print("Starting script...")
agent.run()
print("Agent is running...")
