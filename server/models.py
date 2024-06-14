from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]


class ActorModel(BaseModel):
    name: str
    description: str


class ActorsModel(BaseModel):
    actors: List[ActorModel]


class FeatureModel(BaseModel):
    feature_name: str
    description: str


class BusinessScenarioModel(BaseModel):
    title: str
    description: str
    features: List[FeatureModel]


class BusinessScenariosModel(BaseModel):
    business_scenario: BusinessScenarioModel


class ElevatorSpeechModel(BaseModel):
    content: str


class MottoModel(BaseModel):
    motto: str


class MilestoneModel(BaseModel):
    name: str
    description: str
    duration: str


class ProjectScheduleModel(BaseModel):
    milestones: List[MilestoneModel]


class FunctionalRequirementModel(BaseModel):
    name: str
    description: str
    priority: str


class NonFunctionalRequirementModel(BaseModel):
    name: str
    description: str
    priority: str


class RequirementsModel(BaseModel):
    functional_requirements: List[FunctionalRequirementModel]
    non_functional_requirements: List[NonFunctionalRequirementModel]


class RiskModel(BaseModel):
    risk: str
    description: str
    prevention: str


class RisksModel(BaseModel):
    risks: List[RiskModel]


class SpecificationModel(BaseModel):
    name: str
    description: str


class SpecificationsModel(BaseModel):
    specifications: List[SpecificationModel]


class StrategyModel(BaseModel):
    strategy: str


class TitleModel(BaseModel):
    names: List[str]


class ProjectModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    description: str
    owner: EmailStr
    for_who: str
    doing_what: str
    additional_info: str
    members: List[EmailStr]
    created_at: datetime = Field(default=datetime.now())
    actors: Optional[ActorsModel] = None
    business_scenarios: Optional[BusinessScenariosModel] = None
    elevator_speech: Optional[ElevatorSpeechModel] = None
    motto: Optional[MottoModel] = None
    project_schedule: Optional[ProjectScheduleModel] = None
    requirements: Optional[RequirementsModel] = None
    risks: Optional[RisksModel] = None
    specifications: Optional[SpecificationsModel] = None
    strategy: Optional[StrategyModel] = None
    title: Optional[TitleModel] = None

    class Config:
        arbitrary_types_allowed = True


class ProjectCollection(BaseModel):
    projects: List[ProjectModel]
