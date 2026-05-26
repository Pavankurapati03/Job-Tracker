from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", os.getenv("MONGODB_URL", "mongodb://localhost:27017"))

# Initialize Motor Client
client = AsyncIOMotorClient(MONGO_URI)
db = client.job_tracker

# Collections
users_collection = db.users
jobs_collection = db.jobs


import datetime

def serialize_doc(doc: dict) -> dict:
    """Helper to convert MongoDB BSON _id to standard string id."""
    if not doc:
        return {}
    # Convert _id to id
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc


def prepare_for_mongodb(data):
    """Recursively convert datetime.date to string (YYYY-MM-DD) for MongoDB compliance."""
    if isinstance(data, dict):
        return {k: prepare_for_mongodb(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [prepare_for_mongodb(v) for v in data]
    elif isinstance(data, datetime.date) and not isinstance(data, datetime.datetime):
        return data.isoformat()
    return data
