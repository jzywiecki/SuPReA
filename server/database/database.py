import pymongo
import os
import certifi

mongo_client = pymongo.MongoClient(
    os.environ["MONGODB_URL"], tls=True, tlsCAFile=certifi.where()
)

db_name = "Projects"

db_name_env = os.getenv("VISIO_MONGODB_NAME")
if db_name_env is not None:
    db_name = db_name_env


db = mongo_client.get_database(db_name)

chats_collection = db.get_collection("chats")
projects_collection = db.get_collection("projects")
