"""
This module serves as a global Data Access Object (DAO) for performing operations on the chat-related
collections in the MongoDB database. It provides a wrapper around the MongoDB operations for chats.
"""

from bson import ObjectId
from models import Chat

from .database import chats_collection as collection


def save_chat(chat: Chat):
    """
    Save a chat to the database.

    :param Chat chat: The chat to save.
    :return: The result of the mongodb insert operation.
    """
    return collection.insert_one(chat.dict(exclude={"id"}))


def create_chat():
    """
    Create a new chat and save it to the database.

    :return: The id of the newly created
    :rtype: str
    """
    new_chat = Chat(last_message_id=0, messages=[])
    return str(save_chat(new_chat).inserted_id)


def delete_chat(chat_id: str):
    """
    Delete a chat from the database.

    :param str chat_id: The id of the chat to delete.
    :return: The result of the mongodb delete operation.
    """
    return collection.delete_one({"_id": ObjectId(chat_id)})
