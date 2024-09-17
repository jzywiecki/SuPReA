"""
This module serves as a Data Access Object (DAO) for performing operations on the chat-related
collections in the MongoDB database. It provides a wrapper around the MongoDB operations for chats.
"""

from bson import ObjectId
from pymongo.results import InsertOneResult, DeleteResult

from models import Chat


class ChatDAO:
    """
    This class provides a DAO for chats in the MongoDB database.
    """

    def __init__(self, mongo_db, collection_name):
        self.collection = mongo_db.get_collection(collection_name)

    def save_chat(self, chat: Chat) -> InsertOneResult:
        """
        Save a chat to the database.

        :param Chat chat: The chat to save.
        :return: The result of the mongodb insert operation.
        """
        return self.collection.insert_one(chat.dict(exclude={"id"}))

    def create_chat(self) -> str:
        """
        Create a new chat and save it to the database.

        :return: The id of the newly created
        :rtype: str
        """
        new_chat = Chat(last_message_id=0, messages=[])
        return str(self.save_chat(new_chat).inserted_id)

    def delete_chat(self, chat_id: str) -> DeleteResult:
        """
        Delete a chat from the database.

        :param str chat_id: The id of the chat to delete.
        :return: The result of the mongodb delete operation.
        """
        return self.collection.delete_one({"_id": ObjectId(chat_id)})
