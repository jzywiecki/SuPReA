from pydantic import BaseModel, Field
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
    functional_requirements: List[FunctionalRequirement] = Field(default_factory=list)
    non_functional_requirements: List[NonFunctionalRequirement] = Field(
        default_factory=list
    )
