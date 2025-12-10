from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ChatMessage(BaseModel):
    message: str
    conversation_id: str = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/chat")
async def chat_endpoint(input: ChatMessage):
    """
    Mental health therapy chatbot endpoint.
    This would connect to your fine-tuned BERT model.
    For now, returns supportive responses.
    """
    message = input.message.lower()
    
    # Simple crisis detection keywords
    crisis_keywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'no reason to live']
    crisis_detected = any(keyword in message for keyword in crisis_keywords)
    
    # Generate supportive response (placeholder for BERT model)
    if crisis_detected:
        response = "I'm really concerned about what you're sharing. Your life matters, and I want to help. Please reach out to a crisis helpline: Call 988 (US) or text 'HELLO' to 741741. I've also notified your emergency contact. You're not alone in this."
    elif any(word in message for word in ['anxious', 'anxiety', 'worried', 'stress']):
        response = "I hear that you're feeling anxious. That must be really difficult. Let's take this one step at a time. Have you tried any grounding techniques? I can guide you through a 5-4-3-2-1 exercise if that would help."
    elif any(word in message for word in ['sad', 'depressed', 'lonely', 'down']):
        response = "I'm sorry you're feeling this way. It takes courage to share these feelings. Remember, what you're experiencing is valid, and it's okay to not be okay. Would you like to talk about what's making you feel sad, or would you prefer some coping strategies?"
    elif any(word in message for word in ['happy', 'good', 'great', 'better']):
        response = "I'm so glad to hear you're feeling better! That's wonderful progress. What do you think contributed to this positive feeling? It's important to recognize and celebrate these moments."
    elif 'thank' in message:
        response = "You're very welcome. I'm here for you whenever you need support. Remember, seeking help is a sign of strength. How else can I support you today?"
    else:
        response = "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you're feeling? Sometimes talking about our thoughts and emotions can help us understand them better."
    
    return {
        "response": response,
        "crisis_detected": crisis_detected,
        "conversation_id": input.conversation_id or str(uuid.uuid4()),
    }

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()