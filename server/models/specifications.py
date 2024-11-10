from typing import List
from pydantic import BaseModel, Field


class Specification(BaseModel):
    specification: str
    description: str


class Specifications(BaseModel):
    specifications: List[Specification] = Field(default_factory=list)

    class Config:
        extra = "forbid"
