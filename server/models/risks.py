from pydantic import BaseModel
from typing import List


class Risk(BaseModel):
    risk: str
    description: str
    prevention: str


class Risks(BaseModel):
    risks: List[Risk]
