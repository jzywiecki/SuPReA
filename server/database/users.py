# This file contains the PictureDAO class which provides a DAO for pictures in the MongoDB database.

from bson import ObjectId


class UsersDAO:
    """
    This class provides a DAO for pictures in the MongoDB database.
    """
    def __init__(self, mongo_db, collection_name):
        self.collection = mongo_db.get_collection(collection_name)

    def set_new_avatar(self, user_id: str, picture_id: str, picture_url) -> str:
        """
        Save a picture to the database.

        :param user_id: id of user.
        :param picture_id: id of picture.
        :param picture_url: url of picture
        """
        return self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"avatar_id": picture_id, "avatarurl": picture_url}}
        )

    def is_user_exist(self, user_id: str) -> bool:
        """
        Check if user exist in database.

        :param user_id: id of user.
        """
        return self.collection.find_one({"_id": ObjectId(user_id)}) is not None

    def get_avatar_id(self, user_id: str) -> str:
        """
        Get avatar id of user.

        :param user_id: id of user.
        """
        user = self.collection.find_one({"_id": ObjectId(user_id)})
        return user.get("avatar_id") if user else None
