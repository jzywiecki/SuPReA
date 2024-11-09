from pydantic import BaseModel, Field
from typing import List


class Risk(BaseModel):
    risk: str
    description: str
    prevention: str


class Risks(BaseModel):
    risks: List[Risk] = Field(default_factory=list)
