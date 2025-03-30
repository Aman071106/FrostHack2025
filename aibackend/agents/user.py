from uagents import Agent, Context, Field, Model
from typing import List


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

url = "user123"
user_query = ["what are the amount spend give me the table?"]

agent = Agent(name="bob", seed="YOUR NEW PHRASE hahahaha", port=8080, endpoint=["http://localhost:8080/submit"])

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
        None: Logs the response asynchronously.
    """
    ctx.logger.info(f"Received response: {msg.response}")

print("Starting script...")  # Add at the start
agent.run()
print("Agent is running...")  # Add after running the agent