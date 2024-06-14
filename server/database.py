import motor.motor_asyncio
import os

client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.get_database("Projects")
project_collection = db.get_collection("projects")
