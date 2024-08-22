from typing import List
from pydantic import BaseModel, Field
from bson import ObjectId

class Message(BaseModel):
    author: ObjectId
    text: str
    date: str
    message_id: int

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }


class Chat(BaseModel):
    id: ObjectId = Field(alias="_id", default=None)
    last_message_id: int
    messages: List[Message]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }
