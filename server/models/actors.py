from typing import List
from pydantic import BaseModel


class Actor(BaseModel):
    name: str
    description: str


class Actors(BaseModel):
    actors: List[Actor]
