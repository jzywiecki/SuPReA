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
async def create_empty_project(collection, project_name, ownerId):
    new_project = ProjectModel(
        name=project_name,
        for_who="",
        doing_what="",
        additional_info="",
        owner=ownerId,
        members=[ownerId],
        description="",
        created_at=datetime.now(),
        actors=None,
        business_scenarios=None,
        elevator_speech=None,
        motto=None,
        project_schedule=None,
        requirements=None,
        risks=None,
        specifications=None,
        strategy=None,
        title=None,
    )

    result = await collection.insert_one(
        new_project.model_dump(by_alias=True, exclude=["id"])
    )

    return result.inserted_id



@ray.remote
class ProjectGenerator():
    def __init__(self, project_name : str, owner_id : str, for_who: str, doing_what: str, additional_info: str, collection):
        self.project_id = None
        self.project_name = project_name
        self.owner_id = owner_id
        self.for_who = for_who
        self.doing_what = doing_what
        self.additional_info = additional_info
        self.collection = collection


    def generate_project_by_ai(self):
        try:
            self.project_id = create_empty_project.remote(self.collection, self.project_name, self.owner_id)
        except Exception as e:
            print(f"[ERROR]: Failed to init project {self.project_name}")
            print(e)
            return

        ref_list = [
            generate_actors.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_business_scenarios.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_elevator_speech.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_motto.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_project_schedule.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_requirements.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_risks.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_specification.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_strategy.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_title.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_umls.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection),
            generate_database_schema.remote(self.for_who, self.doing_what, self.additional_info, self.project_id, self.collection)
        ]

        for ref in ref_list:
            try:
                ray.get(ref)
            except Exception as e:
                print(f"[ERROR]: Failed to generate {ref}")
                print(e)
                return
