from pydantic import BaseModel
from typing import List


class FunctionalRequirement(BaseModel):
    name: str
    description: str
    priority: str


class NonFunctionalRequirement(BaseModel):
    name: str
    description: str
    priority: str


class Requirements(BaseModel):
    functional_requirements: List[FunctionalRequirement]
    non_functional_requirements: List[NonFunctionalRequirement]
