# This file contains the PictureDAO class which provides a DAO for pictures in the MongoDB database.

from models import Picture
from bson import ObjectId
from pymongo.results import DeleteResult


class PictureDAO:
    """
    This class provides a DAO for pictures in the MongoDB database.
    """

    def __init__(self, mongo_db, collection_name):
        self.collection = mongo_db.get_collection(collection_name)

    def save_picture(self, picture: Picture) -> str:
        """
        Save a picture to the database.

        :param picture: The picture to save.
        :return: id of inserted picture.
        """
        return str(self.collection.insert_one(picture.dict(exclude={"id"})).inserted_id)

    def get_picture(self, project_id: str) -> dict:
        return self.collection.find_one({"_id": ObjectId(project_id)})

    def delete_picture(self, project_id: str) -> DeleteResult:
        return self.collection.delete_one({"_id": ObjectId(project_id)})
