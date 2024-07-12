import motor.motor_asyncio
import os
import certifi

client = motor.motor_asyncio.AsyncIOMotorClient(
    os.environ["MONGODB_URL"], tls=True, tlsCAFile=certifi.where()
)
db = client.get_database("Projects")
project_collection = db.get_collection("projects")
chats_collection = db.get_collection("chats")
