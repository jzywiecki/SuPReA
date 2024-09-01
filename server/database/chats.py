from bson import ObjectId
from models import Chat

from .database import chats_collection as collection


def save_chat(chat):
    return collection.insert_one(chat.dict(exclude={"id"}))


def create_chat():
    new_chat = Chat(last_message_id=0, messages=[])
    return str(save_chat(new_chat).inserted_id)


def delete_chat(chat_id: str):
    return collection.delete_one({"_id": ObjectId(chat_id)})
