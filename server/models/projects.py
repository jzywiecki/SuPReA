import ray

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator

from server.models.actors import ActorsModel, generate_actors, save_actors_to_database
from server.models.business_scenarios import BusinessScenariosModel, generate_business_scenarios, save_business_scenarios_to_database
from server.models.elevator_speech import ElevatorSpeechModel, generate_elevator_speech, save_elevator_speech_to_database
from server.models.motto import MottoModel, generate_motto, save_motto_to_database
from server.models.project_schedule import ProjectScheduleModel, generate_project_schedule, save_project_schedule_to_database
from server.models.requirements import RequirementsModel, generate_requirements, save_requirements_to_database
from server.models.risks import RisksModel, generate_risks, save_risks_to_database
from server.models.specifications import SpecificationsModel, generate_specification, save_specifications_to_database
from server.models.strategy import StrategyModel, generate_strategy, save_strategy_to_database
from server.models.title import TitleModel, generate_title, save_title_to_database
from server.models.umls import UmlsModel, generate_umls, save_umls_to_database
from server.models.database_schema import DatabaseSchemaModel, generate_database_schema, save_database_schema_to_database


PyObjectId = Annotated[str, BeforeValidator(str)]


class ProjectModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    description: str
    owner: PyObjectId
    for_who: str
    doing_what: str
    additional_info: str
    members: List[PyObjectId]
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
    umls: Optional[UmlsModel] = None
    database_schema: Optional[DatabaseSchemaModel] = None
    chat: Optional[PyObjectId] = None
    ai_chat: Optional[PyObjectId] = None

    class Config:
        arbitrary_types_allowed = True


class ProjectCollection(BaseModel):
    projects: List[ProjectModel]


@ray.remote
class SimpleProjectGenerator():
    def __init__(self, project_id: str, for_who: str, doing_what: str, additional_info: str, collection):
        self.project_id = project_id
        self.for_who = for_who
        self.doing_what = doing_what
        self.additional_info = additional_info
        self.collection = collection

        self.actors = None
        self.business_scenarios = None
        self.elevator_speech = None
        self.motto : MottoModel = None
        self.project_schedule = None
        self.requirements = None
        self.risks : RisksModel = None
        self.specifications  = None
        self.strategy = None
        self.title = None
        self.umls = None
        self.database_schema = None


    def generate_project(self):
        self.actors = generate_actors(self.for_who, self.doing_what, self.additional_info)
        self.business_scenarios = generate_business_scenarios(self.for_who, self.doing_what, self.additional_info)
        self.elevator_speech = generate_elevator_speech(self.for_who, self.doing_what, self.additional_info)
        self.motto = generate_motto(self.for_who, self.doing_what, self.additional_info)
        self.project_schedule = generate_project_schedule(self.for_who, self.doing_what, self.additional_info)
        self.requirements = generate_requirements(self.for_who, self.doing_what, self.additional_info)
        self.risks = generate_risks(self.for_who, self.doing_what, self.additional_info)
        self.specifications = generate_specification(self.for_who, self.doing_what, self.additional_info)
        self.strategy = generate_strategy(self.for_who, self.doing_what, self.additional_info)
        self.title = generate_title(self.for_who, self.doing_what, self.additional_info)
        self.umls = generate_umls(self.for_who, self.doing_what, self.additional_info)
        self.database_schema = generate_database_schema(self.for_who, self.doing_what, self.additional_info)

        ray.wait([
            self.actors,
            self.business_scenarios,
            self.elevator_speech,
            self.motto,
            self.project_schedule,
            self.requirements,
            self.risks,
            self.specifications,
            self.strategy,
            self.title,
            self.umls,
            self.database_schema
        ])
        

    def save_project_to_database(self):
        save_actors_to_database(self.project_id, self.collection, self.actors)
        save_business_scenarios_to_database(self.project_id, self.collection, self.business_scenarios)
        save_elevator_speech_to_database(self.project_id, self.collection, self.elevator_speech)
        save_motto_to_database(self.project_id, self.collection, self.motto)
        save_project_schedule_to_database(self.project_id, self.collection, self.project_schedule)
        save_requirements_to_database(self.project_id, self.collection, self.requirements)
        save_risks_to_database(self.project_id, self.collection, self.risks)
        save_specifications_to_database(self.project_id, self.collection, self.specifications)
        save_strategy_to_database(self.project_id, self.collection, self.strategy)
        save_title_to_database(self.project_id, self.collection, self.title)
        save_umls_to_database(self.project_id, self.collection, self.umls)
        save_database_schema_to_database(self.project_id, self.collection, self.database_schema)
        