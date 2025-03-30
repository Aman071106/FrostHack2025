from uagents import Agent, Field, Model, Context
from bs4 import BeautifulSoup
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import ChatPromptTemplate
import requests
from typing import List
import dotenv
import os
import pandas as pd


# Load environment variables from .env file
dotenv.load_dotenv()
# Retrieve the API key from environment variables   
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=GEMINI_API_KEY)

def read_past_transactions(url):
    try:
        df = pd.read_csv("vectorStore.csv", dtype={"userId": str})  # Ensure userId is string
        expected_columns = {"userId", "date", "time", "amount", "category", "location", "mode"}
        if not expected_columns.issubset(df.columns):
            return "CSV file format is incorrect."

        user_data = df[df["userId"] == url]
        if user_data.empty:
            return "No financial data found for this user."

        return user_data.to_string(index=False)
    except FileNotFoundError:
        return "Vector store file not found."
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
    """
    Generates a response using Gemini AI model based on the provided queries and context.
    
    Args:
        query (str): The user's queries.
        context (str): Relevant text retrieved from the scraped website.
    
    Returns:
        str: AI-generated response based on the queries and context.
    """
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", """You are an expert in financial advice and anaysis. Your task is to read and analyze deeply the behaviour of user based on his past transactions
        ### User Question:
        "{query}"

        ### Database Schema:
        The database table contains the following columns:
        - date : The transaction date in YYYY-MM-DD format.
        - amount : The amount of the transaction.
        - category : The type of transaction (e.g., Expense, Income).
        - location : Describing where the transaction was performed.
        - mode : Which mode was employed for the transaction(debit card,UPI etc..).

        ### Output Rules:
        1. **Do include explanations, comments, or descriptions outside these sections.**
        2. **If the question asks for total expenses, use `SUM(amount) AS total_expense`.**
        3. **If the question asks for individual transactions, select `name, date, amount, transaction_type, description` and DO NOT use `SUM()` or `GROUP BY`.**
        4. **If the question asks for "top" or "largest" or "smallest" or "lowest" transactions, use `ORDER BY amount DESC LIMIT X`.**
        5. **If filtering by a specific month, use `EXTRACT(MONTH FROM date) = MM` instead of checking `month_year = 'YYYY-MM'`.**
        6. **Do NOT include unnecessary placeholders or variable names—use real column names directly.**
        7. **Be precise and to the point.
        """),
        ("user", "{query}")
    ])
    full_response = llm.invoke(prompt_template.format(query=query + "Context:" + context))
    return extract_answer(full_response)

def extract_answer(full_response):
    """
    Extracts and returns the relevant content from Gemini's response.
    
    Args:
        full_response (obj): The full response from Gemini.
    
    Returns:
        str: The extracted response text or a default message if no content is found.
    """
    return full_response.content.strip() if hasattr(full_response, "content") else "No response generated."

agent = Agent(name="alice", seed="YOUR NEW PHRASE", port=8000, endpoint=["http://localhost:8000/submit"])

# Updated function with the fix
@agent.on_message(model=RAGRequest, replies=RAGResponse)
async def handle_rag_request(ctx: Context, sender: str, msg: RAGRequest):
    """
    Handles incoming RAG requests, scrapes the website, retrieves relevant content,
    and generates a response using Gemini AI model.
    
    Args:
        ctx (Context): The context object for handling requests.
        sender (str): The sender of the request.
        msg (RAGRequest): The request message containing the URL and user query.
    
    Returns:
        None: Sends a response back to the sender asynchronously.
    """
    ctx.logger.info(f"Scraping URL: {msg.url}")
    scraped_text = read_past_transactions(msg.url)
    
    if "Failed to retrieve content" in scraped_text:
        await ctx.send(sender, RAGResponse(response=scraped_text))
        return

    documents = [scraped_text]
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",  # Added required model parameter
        google_api_key=GEMINI_API_KEY
    )
    vector_store = FAISS.from_texts(documents, embeddings)
    retriever = vector_store.as_retriever(search_type="similarity", search_kwargs={"k": 3})

    for question in msg.user_query:
        retrieved_docs = retriever.invoke(question)
        context = "".join([doc.page_content for doc in retrieved_docs])
        
        response = generate_gemini_response(question, context)
        
        await ctx.send(sender, RAGResponse(response=response))

print("Starting script...")
agent.run()
print("Agent is running...")