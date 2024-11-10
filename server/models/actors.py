from typing import List
from pydantic import BaseModel, Field


class Actor(BaseModel):
    name: str
    description: str


class Actors(BaseModel):
    actors: List[Actor] = Field(default_factory=list)

    class Config:
        extra = "forbid"
