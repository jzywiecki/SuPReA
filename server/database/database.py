import pymongo
import os
import certifi

from database.projects import ProjectsDAO

mongo_client = pymongo.MongoClient (
    os.environ["MONGODB_URL"],
    tls=True,
    tlsCAFile=certifi.where()
)

db_name = "Projects"

db_name_env = os.getenv("VISIO_MONGODB_NAME")
if db_name_env is not None:
    db_name = db_name_env

projects_dao = ProjectsDAO(mongo_client, db_name)
