from typing import List
from pydantic import BaseModel, Field


class Milestone(BaseModel):
    name: str
    description: str
    duration: str


class ProjectSchedule(BaseModel):
    milestones: List[Milestone] = Field(default_factory=list)
