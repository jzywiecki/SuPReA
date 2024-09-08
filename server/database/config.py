"""
This module is responsible for configuring the connection to a MongoDB database and providing
access to the collections.
"""

import pymongo
import os
import certifi

from .chats import ChatDAO
from .projects import ProjectDAO


mongo_client = pymongo.MongoClient(
    os.environ["MONGODB_URL"], tls=True, tlsCAFile=certifi.where()
)

db_name = "Projects"

db_name_env = os.getenv("VISIO_MONGODB_NAME")
if db_name_env is not None:
    db_name = db_name_env

db = mongo_client.get_database(db_name)

chat_dao = ChatDAO(db, "chats")

project_dao = ProjectDAO(db, "projects")


def chat_dao_global_remote_ref():
    """
    Returns a reference to the global chat DAO.
    Solves serialization problem with Ray remote functions.
    """
    return chat_dao


def project_dao_global_remote_ref():
    """
    Returns a reference to the global project DAO.
    Solves serialization problem with Ray remote functions.
    """
    return project_dao
