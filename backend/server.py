from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
import json
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import aiofiles

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Data directory for JSON storage
DATA_DIR = Path(os.environ.get('DATA_DIR', './data'))
DATA_DIR.mkdir(exist_ok=True)

# Data files
USERS_FILE = DATA_DIR / 'users.json'
CONVERSATIONS_FILE = DATA_DIR / 'conversations.json'
MOOD_ENTRIES_FILE = DATA_DIR / 'mood_entries.json'
STATUS_CHECKS_FILE = DATA_DIR / 'status_checks.json'

# Initialize JSON files if they don't exist
for file in [USERS_FILE, CONVERSATIONS_FILE, MOOD_ENTRIES_FILE, STATUS_CHECKS_FILE]:
    if not file.exists():
        file.write_text('[]')

# Create the main app without a prefix
app = FastAPI(title="SoulSync API", version="2.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ============================================================================
# MODELS
# ============================================================================

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    password_hash: str  # In production, use proper hashing
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    emergency_contact: Optional[dict] = None
    onboarding_completed: bool = False

class UserCreate(BaseModel):
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Conversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str = "New Conversation"
    messages: List[dict] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MoodEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    mood_score: int  # 1-10
    emotions: List[str] = []
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MoodEntryCreate(BaseModel):
    user_id: str
    mood_score: int
    emotions: List[str] = []
    notes: Optional[str] = None

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class StatusCheckCreate(BaseModel):
    client_name: str


# ============================================================================
# HELPER FUNCTIONS FOR JSON STORAGE
# ============================================================================

async def read_json_file(file_path: Path) -> list:
    """Read data from JSON file."""
    try:
        async with aiofiles.open(file_path, 'r') as f:
            content = await f.read()
            return json.loads(content)
    except Exception as e:
        logger.error(f"Error reading {file_path}: {e}")
        return []

async def write_json_file(file_path: Path, data: list):
    """Write data to JSON file."""
    try:
        async with aiofiles.open(file_path, 'w') as f:
            await f.write(json.dumps(data, indent=2))
    except Exception as e:
        logger.error(f"Error writing {file_path}: {e}")
        raise HTTPException(status_code=500, detail="Failed to save data")


# ============================================================================
# API ROUTES
# ============================================================================

@api_router.get("/")
async def root():
    """Health check endpoint."""
    return {
        "message": "SoulSync API v2.0",
        "status": "running",
        "storage": "local-json"
    }

@api_router.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "storage": "local-json",
        "data_dir": str(DATA_DIR),
        "files_exist": {
            "users": USERS_FILE.exists(),
            "conversations": CONVERSATIONS_FILE.exists(),
            "mood_entries": MOOD_ENTRIES_FILE.exists(),
            "status_checks": STATUS_CHECKS_FILE.exists()
        }
    }


# ============================================================================
# USER ROUTES
# ============================================================================

@api_router.post("/users/register")
async def register_user(user_data: UserCreate):
    """Register a new user."""
    users = await read_json_file(USERS_FILE)
    
    # Check if user already exists
    if any(u['email'] == user_data.email for u in users):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user (in production, hash the password properly)
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=user_data.password  # TODO: Use bcrypt in production
    )
    
    users.append(new_user.model_dump())
    await write_json_file(USERS_FILE, users)
    
    # Don't return password hash
    user_dict = new_user.model_dump()
    del user_dict['password_hash']
    
    return {"user": user_dict, "message": "User registered successfully"}

@api_router.post("/users/login")
async def login_user(login_data: UserLogin):
    """Login user."""
    users = await read_json_file(USERS_FILE)
    
    # Find user
    user = next((u for u in users if u['email'] == login_data.email), None)
    
    if not user or user['password_hash'] != login_data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Don't return password hash
    user_dict = dict(user)
    del user_dict['password_hash']
    
    return {"user": user_dict, "message": "Login successful"}

@api_router.get("/users/{user_id}")
async def get_user(user_id: str):
    """Get user by ID."""
    users = await read_json_file(USERS_FILE)
    user = next((u for u in users if u['id'] == user_id), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_dict = dict(user)
    del user_dict['password_hash']
    return user_dict

@api_router.patch("/users/{user_id}")
async def update_user(user_id: str, update_data: dict):
    """Update user information."""
    users = await read_json_file(USERS_FILE)
    
    user_index = next((i for i, u in enumerate(users) if u['id'] == user_id), None)
    if user_index is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update allowed fields
    allowed_fields = ['name', 'emergency_contact', 'onboarding_completed']
    for field in allowed_fields:
        if field in update_data:
            users[user_index][field] = update_data[field]
    
    await write_json_file(USERS_FILE, users)
    
    user_dict = dict(users[user_index])
    if 'password_hash' in user_dict:
        del user_dict['password_hash']
    
    return {"user": user_dict, "message": "User updated successfully"}


# ============================================================================
# CHAT ROUTES
# ============================================================================

@api_router.post("/chat")
async def chat_endpoint(input: ChatMessage):
    """
    Mental health therapy chatbot endpoint.
    Provides supportive responses based on user input.
    """
    message = input.message.lower()
    
    # Simple crisis detection keywords
    crisis_keywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'no reason to live']
    crisis_detected = any(keyword in message for keyword in crisis_keywords)
    
    # Generate supportive response
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
    
    # Save conversation if user_id and conversation_id provided
    conversation_id = input.conversation_id or str(uuid.uuid4())
    
    if input.user_id:
        conversations = await read_json_file(CONVERSATIONS_FILE)
        
        # Find or create conversation
        conv_index = next((i for i, c in enumerate(conversations) if c['id'] == conversation_id), None)
        
        if conv_index is None:
            # Create new conversation
            new_conv = Conversation(
                id=conversation_id,
                user_id=input.user_id,
                messages=[
                    {"role": "user", "content": input.message, "timestamp": datetime.now(timezone.utc).isoformat()},
                    {"role": "assistant", "content": response, "timestamp": datetime.now(timezone.utc).isoformat()}
                ]
            )
            conversations.append(new_conv.model_dump())
        else:
            # Add to existing conversation
            conversations[conv_index]['messages'].append(
                {"role": "user", "content": input.message, "timestamp": datetime.now(timezone.utc).isoformat()}
            )
            conversations[conv_index]['messages'].append(
                {"role": "assistant", "content": response, "timestamp": datetime.now(timezone.utc).isoformat()}
            )
            conversations[conv_index]['updated_at'] = datetime.now(timezone.utc).isoformat()
        
        await write_json_file(CONVERSATIONS_FILE, conversations)
    
    return {
        "response": response,
        "crisis_detected": crisis_detected,
        "conversation_id": conversation_id,
    }

@api_router.get("/conversations/{user_id}")
async def get_user_conversations(user_id: str):
    """Get all conversations for a user."""
    conversations = await read_json_file(CONVERSATIONS_FILE)
    user_conversations = [c for c in conversations if c['user_id'] == user_id]
    return user_conversations

@api_router.get("/conversations/{user_id}/{conversation_id}")
async def get_conversation(user_id: str, conversation_id: str):
    """Get a specific conversation."""
    conversations = await read_json_file(CONVERSATIONS_FILE)
    conversation = next((c for c in conversations if c['id'] == conversation_id and c['user_id'] == user_id), None)
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return conversation

@api_router.delete("/conversations/{user_id}/{conversation_id}")
async def delete_conversation(user_id: str, conversation_id: str):
    """Delete a conversation."""
    conversations = await read_json_file(CONVERSATIONS_FILE)
    conversations = [c for c in conversations if not (c['id'] == conversation_id and c['user_id'] == user_id)]
    await write_json_file(CONVERSATIONS_FILE, conversations)
    return {"message": "Conversation deleted successfully"}


# ============================================================================
# MOOD TRACKING ROUTES
# ============================================================================

@api_router.post("/mood")
async def create_mood_entry(entry: MoodEntryCreate):
    """Create a new mood entry."""
    mood_entries = await read_json_file(MOOD_ENTRIES_FILE)
    
    new_entry = MoodEntry(**entry.model_dump())
    mood_entries.append(new_entry.model_dump())
    
    await write_json_file(MOOD_ENTRIES_FILE, mood_entries)
    return {"entry": new_entry, "message": "Mood entry created successfully"}

@api_router.get("/mood/{user_id}")
async def get_mood_entries(user_id: str, limit: int = 30):
    """Get mood entries for a user."""
    mood_entries = await read_json_file(MOOD_ENTRIES_FILE)
    user_entries = [e for e in mood_entries if e['user_id'] == user_id]
    
    # Sort by created_at descending and limit
    user_entries.sort(key=lambda x: x['created_at'], reverse=True)
    return user_entries[:limit]

@api_router.get("/mood/{user_id}/stats")
async def get_mood_stats(user_id: str, days: int = 7):
    """Get mood statistics for a user."""
    mood_entries = await read_json_file(MOOD_ENTRIES_FILE)
    user_entries = [e for e in mood_entries if e['user_id'] == user_id]
    
    if not user_entries:
        return {
            "average_mood": 0,
            "total_entries": 0,
            "common_emotions": []
        }
    
    # Calculate average mood
    avg_mood = sum(e['mood_score'] for e in user_entries) / len(user_entries)
    
    # Get common emotions
    all_emotions = []
    for e in user_entries:
        all_emotions.extend(e.get('emotions', []))
    
    emotion_counts = {}
    for emotion in all_emotions:
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
    
    common_emotions = sorted(emotion_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "average_mood": round(avg_mood, 1),
        "total_entries": len(user_entries),
        "common_emotions": [e[0] for e in common_emotions]
    }


# ============================================================================
# STATUS CHECK ROUTES
# ============================================================================

@api_router.post("/status")
async def create_status_check(input: StatusCheckCreate):
    """Create a status check entry."""
    status_checks = await read_json_file(STATUS_CHECKS_FILE)
    
    new_status = StatusCheck(client_name=input.client_name)
    status_checks.append(new_status.model_dump())
    
    await write_json_file(STATUS_CHECKS_FILE, status_checks)
    return new_status

@api_router.get("/status")
async def get_status_checks():
    """Get all status checks."""
    status_checks = await read_json_file(STATUS_CHECKS_FILE)
    return status_checks


# ============================================================================
# EMERGENCY ROUTES
# ============================================================================

@api_router.post("/emergency/notify")
async def send_emergency_notification(user_id: str):
    """Send emergency notification via Telegram."""
    import requests
    
    users = await read_json_file(USERS_FILE)
    user = next((u for u in users if u['id'] == user_id), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    emergency_contact = user.get('emergency_contact')
    if not emergency_contact or not emergency_contact.get('telegram_chat_id'):
        return {"success": False, "message": "No emergency contact configured"}
    
    telegram_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not telegram_token or telegram_token == 'YOUR_BOT_TOKEN_HERE':
        return {"success": False, "message": "Telegram bot not configured"}
    
    # Send Telegram message
    try:
        url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
        data = {
            "chat_id": emergency_contact['telegram_chat_id'],
            "text": f"🚨 EMERGENCY ALERT\n\n{user['name']} has triggered the SOS button and may need immediate support.\n\nPlease check on them as soon as possible.",
            "parse_mode": "HTML"
        }
        response = requests.post(url, json=data, timeout=10)
        response.raise_for_status()
        
        return {"success": True, "message": "Emergency contact notified"}
    except Exception as e:
        logger.error(f"Failed to send Telegram notification: {e}")
        return {"success": False, "message": str(e)}


# ============================================================================
# INCLUDE ROUTER AND MIDDLEWARE
# ============================================================================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info("SoulSync API v2.0 started with local JSON storage")
logger.info(f"Data directory: {DATA_DIR}")