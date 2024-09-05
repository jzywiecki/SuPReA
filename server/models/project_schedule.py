from typing import List
from pydantic import BaseModel


class Milestone(BaseModel):
    name: str
    description: str
    duration: str


class ProjectSchedule(BaseModel):
    milestones: List[Milestone]
