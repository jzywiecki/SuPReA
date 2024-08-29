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


async def get_module(project_id: str, module_name: str):
    project = await project_collection.find_one(
        {"_id": ObjectId(project_id)}, {module_name: 1}
    )

    if project and module_name in project:
        return project[module_name]
    else:
        raise Exception(f"Module {module_name} not found for project {project_id}")
