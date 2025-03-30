from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import asyncio
from typing import List, Optional
import json
import multiprocessing

# Import your agent modules
from agents.rag import RAGRequest as AgentRAGRequest, RAGResponse, start_agent
from agents.user import url as default_user_id  # Getting the default user_id

app = FastAPI()

# Add CORS middleware to allow requests from your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js dev server URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store responses in memory for retrieval
response_store = {}

class QueryRequest(BaseModel):
    query: str
    user_id: str = default_user_id  # Default value if not provided

class QueryResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    error: Optional[str] = None

# Function to run the user agent and get the response
async def run_user_agent_and_get_response(query: str, user_id: str, task_id: str):
    try:
        # Import the agent here to avoid circular imports
        from agents.user import agent, user_query
        
        # Modify the user_query list in the user module
        user_query.clear()
        user_query.append(query)
        
        # This is a workaround - we're using a global variable to capture the response
        # from the agent's on_message handler
        global response_store
        response_store[task_id] = {"status": "processing", "response": None}
        
        # Start the agent in a separate thread/process
        # We're not actually running the agent here as it should be running separately
        # This is just to simulate sending a request to the agent
        
        # We'll wait for a response for a maximum of 30 seconds
        max_retries = 30
        for i in range(max_retries):
            await asyncio.sleep(1)
            if response_store[task_id]["status"] == "completed":
                return response_store[task_id]["response"]
        
        return "Timed out waiting for a response from the RAG system."
    
    except Exception as e:
        return f"Error processing query: {str(e)}"

@app.post("/api/process-query")
async def process_query(request: QueryRequest, background_tasks: BackgroundTasks):
    try:
        # Generate a unique task ID
        task_id = f"{request.user_id}_{hash(request.query)}_{hash(asyncio.get_event_loop())}"
        
        # In a real implementation, you would send the query to your user agent
        # and get the response back. For now, we'll simulate this process.
        
        # Run the agent processing in the background
        response_future = asyncio.create_task(
            run_user_agent_and_get_response(request.query, request.user_id, task_id)
        )
        
        # Wait for the response with a timeout
        try:
            response = await asyncio.wait_for(response_future, timeout=10.0)
            return QueryResponse(success=True, response=response)
        except asyncio.TimeoutError:
            # If it takes too long, return a pending status
            return QueryResponse(
                success=False, 
                error="Request is taking longer than expected. Please try again later."
            )
            
    except Exception as e:
        return QueryResponse(success=False, error=str(e))

# Webhook endpoint for the user agent to send responses back
@app.post("/api/agent-response/{task_id}")
async def agent_response(task_id: str, response: RAGResponse):
    global response_store
    if task_id in response_store:
        response_store[task_id] = {
            "status": "completed",
            "response": response.response
        }
        return {"status": "success"}
    return {"status": "error", "message": "Task ID not found"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Add a utility endpoint to simulate RAG responses for testing
@app.post("/api/simulate-rag-response")
async def simulate_rag_response(task_id: str, response: str):
    global response_store
    if task_id in response_store:
        response_store[task_id] = {
            "status": "completed",
            "response": response
        }
        return {"status": "success"}
    return {"status": "error", "message": "Task ID not found"}

# Function to run the agent in a separate process
def run_agent_process():
    asyncio.run(start_agent())

if __name__ == "__main__":
    # Start the agent in a separate process
    agent_process = multiprocessing.Process(target=run_agent_process)
    agent_process.start()
    
    # Start the FastAPI app
    uvicorn.run(app, host="0.0.0.0", port=8000)