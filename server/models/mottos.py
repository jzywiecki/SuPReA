from pydantic import BaseModel, Field
from typing import List


class Mottos(BaseModel):
    mottos: List[str] = Field(default_factory=list)

    class Config:
        extra = "forbid"
