from pydantic import BaseModel, Field
from bson import ObjectId


class Picture(BaseModel):
    """
    Represents a picture in the database.
    """

    id: ObjectId = Field(alias="_id", default=None)
    data: bytes

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
