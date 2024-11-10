from pydantic import BaseModel, Field
from typing import List


class Technology(BaseModel):
    name: str
    description: str


class SuggestedTechnologies(BaseModel):
    suggested_technologies: List[Technology] = Field(default_factory=list)

    class Config:
        extra = "forbid"
