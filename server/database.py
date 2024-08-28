import motor.motor_asyncio
import os
import certifi
from bson import ObjectId

client = motor.motor_asyncio.AsyncIOMotorClient(
    os.environ["MONGODB_URL"], tls=True, tlsCAFile=certifi.where()
)
db = client.get_database("Projects")
project_collection = db.get_collection("projects")
chats_collection = db.get_collection("chats")


async def get_project(project_id: str):
    return await project_collection.find_one({"_id": ObjectId(project_id)})
