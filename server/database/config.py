"""
This module is responsible for configuring the connection to a MongoDB database and providing
access to the collections.
"""

import pymongo
import os
import certifi

from .chats import ChatDAO
from .projects import ProjectDAO
from .pictures import PictureDAO


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

picture_dao = PictureDAO(db, "pictures")


def get_chat_dao_ref() -> ChatDAO:
    """
    Returns a reference to the global chat DAO.
    Solves serialization problem with Ray remote functions.
    """
    return chat_dao


def get_project_dao_ref() -> ProjectDAO:
    """
    Returns a reference to the global project DAO.
    Solves serialization problem with Ray remote functions.
    """
    return project_dao


def get_picture_dao_ref() -> PictureDAO:
    """
    Returns a reference to the global picture DAO.
    Solves serialization problem with Ray remote functions.
    """
    return picture_dao
