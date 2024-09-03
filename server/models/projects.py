from bson import ObjectId
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

from .actors import Actors
from .business_scenarios import BusinessScenarios
from .elevator_speech import ElevatorSpeech
from .motto import Motto
from .project_schedule import ProjectSchedule
from .requirements import Requirements
from .risks import Risks
from .specifications import Specifications
from .strategy import Strategy
from .title import Title
from .database_schema import DatabaseSchema
from .logo import Logo


class Project(BaseModel):
    """Represents the project the client is working with.
    includes configuration information and
    the project's current state."""

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
        json_encoders = {ObjectId: str}


class Projects(BaseModel):
    projects: List[Project]


class ComponentIdentify(Enum):
    """Field names to identify components
    (e.g. These are used to access the fields in the MongoDB documents.)
    Should be consistent with the field names in the Project model."""

    ACTORS = "actors"
    BUSINESS_SCENARIOS = "business_scenarios"
    ELEVATOR_SPEECH = "elevator_speech"
    MOTTO = "motto"
    PROJECT_SCHEDULE = "project_schedule"
    REQUIREMENTS = "requirements"
    RISKS = "risks"
    SPECIFICATIONS = "specifications"
    STRATEGY = "strategy"
    TITLE = "title"
    DATABASE_SCHEMA = "database_schema"
    LOGO = "logo"
