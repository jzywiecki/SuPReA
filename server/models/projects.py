from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List, Optional

from datetime import datetime
from models.actors import Actors
from models.business_scenarios import BusinessScenarios
from models.elevator_speech import ElevatorSpeech
from models.motto import Motto
from models.project_schedule import ProjectSchedule
from models.requirements import Requirements
from models.risks import Risks
from models.specifications import Specifications
from models.strategy import Strategy
from models.title import Title
from models.database_schema import DatabaseSchema
from models.logo import Logo


class Project(BaseModel):
    id: ObjectId = Field(alias="_id", default=None)
    name: str
    description: str
    owner: ObjectId
    for_who: str
    doing_what: str
    additional_info: str
    members: List[ObjectId]
    created_at: datetime = Field(default=datetime.now())

    actors: Optional[Actors] = None
    business_scenarios: Optional[BusinessScenarios] = None
    elevator_speech: Optional[ElevatorSpeech] = None
    motto: Optional[Motto] = None
    project_schedule: Optional[ProjectSchedule] = None
    requirements: Optional[Requirements] = None
    risks: Optional[Risks] = None
    specifications: Optional[Specifications] = None
    strategy: Optional[Strategy] = None
    title: Optional[Title] = None
    database_schema: Optional[DatabaseSchema] = None
    logo: Optional[Logo] = None
    chat_id: Optional[ObjectId] = None
    ai_chat_id: Optional[ObjectId] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }


class Projects(BaseModel):
    projects: List[Project]
