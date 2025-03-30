from uagents import Agent, Context, Field, Model
from typing import List
import asyncio

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

class Request(Model):
    url: str
    user_query: List[str]
 
class Response(Model):
    text: str

url = "user123"
user_query = ["what are the amount spend give me the table?"]

agent = Agent(name="bob", seed="YOUR NEW PHRASE hahahaha", port=8080, endpoint=["http://localhost:8080/submit"])

# Storage for the latest RAG response
latest_response = None
response_event = asyncio.Event()

@agent.on_event("startup")
async def start_interaction(ctx: Context):
    """
    Sends an initial RAG request to the agent on startup.
    
    Args:
        ctx (Context): The context object for handling events.
    
    Returns:
        None: Sends a message asynchronously to the specified agent.
    """
    await ctx.send('agent1qdk2022qz7v6e7zqtyqdqgg3axgsavlte087uc9wrv5rw77dfp5nqdcd6h0', RAGRequest(url=url, user_query=user_query))

@agent.on_message(model=RAGResponse)
async def receive_rag_response(ctx: Context, sender: str, msg: RAGResponse):
    """
    Handles incoming RAG responses and logs the AI-generated answer.
    
    Args:
        ctx (Context): The context object for handling messages.
        sender (str): The sender of the response.
        msg (RAGResponse): The response message containing the AI-generated answer.
    
    Returns:
        None: Logs the response and updates the latest response.
    """
    global latest_response
    ctx.logger.info(f"Received response: {msg.response}")
    latest_response = msg.response
    response_event.set()  # Signal that a response has been received

@agent.on_rest_post("/askAI", Request, Response)
async def handle_post(ctx: Context, req: Request) -> Response:
    """
    Handles POST requests to /askAI endpoint and returns the RAG response.
    
    Args:
        ctx (Context): The context object for handling requests
        req (Request): The incoming request with url and user_query
    
    Returns:
        Response: The RAG response from the agent
    """
    global latest_response
    ctx.logger.info("Received POST request")
    
    # Reset the event and response before sending new request
    response_event.clear()
    latest_response = None
    
    # Send the RAG request
    await ctx.send(
        "agent1qdk2022qz7v6e7zqtyqdqgg3axgsavlte087uc9wrv5rw77dfp5nqdcd6h0",
        RAGRequest(url=req.url, user_query=req.user_query)
    )
    
    # Wait for response with timeout (e.g., 10 seconds)
    try:
        await asyncio.wait_for(response_event.wait(), timeout=60.0)
        if latest_response is not None:
            return Response(text=latest_response)
        return Response(text="No response received from RAG agent")
    except asyncio.TimeoutError:
        return Response(text="Timeout waiting for RAG response")

print("Starting script...")
agent.run()
print("Agent is running...")