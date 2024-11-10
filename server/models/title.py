from typing import List
from pydantic import BaseModel, Field


class Title(BaseModel):
    names: List[str] = Field(default_factory=list)

    class Config:
        extra = "forbid"
