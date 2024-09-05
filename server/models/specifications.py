from typing import List
from pydantic import BaseModel


class Specification(BaseModel):
    specification: str
    description: str


class Specifications(BaseModel):
    specifications: List[Specification]
