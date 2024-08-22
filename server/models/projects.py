import ray
from bson import ObjectId

from pydantic import BaseModel, Field
from typing import List, Optional

from datetime import datetime
from database import project_collection, chats_collection
from ai.ai import AI

from models.chat import Chat
from models.actors import Actors, generate_actors
from models.business_scenarios import BusinessScenarios, generate_business_scenarios
from models.elevator_speech import ElevatorSpeech, generate_elevator_speech
from models.motto import Motto, generate_motto
from models.project_schedule import ProjectSchedule, generate_project_schedule
from models.requirements import Requirements, generate_requirements
from models.risks import Risks, generate_risks
from models.specifications import Specifications, generate_specifications
from models.strategy import Strategy, generate_strategy
from models.title import Title, generate_title
from models.umls import Umls, generate_umls
from models.database_schema import DatabaseSchema, generate_database_schema
from models.logo import Logo, generate_logo


class ProjectModel(BaseModel):
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
    umls: Optional[Umls] = None
    database_schema: Optional[DatabaseSchema] = None
    logo: Optional[Logo] = None
    chat_id: Optional[ObjectId] = None
    ai_chat_id: Optional[ObjectId] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str,
        }


class ProjectCollection(BaseModel):
    projects: List[ProjectModel]


async def create_project(
    project_name, owner_id, for_who: str, doing_what: str, additional_info: str
):
    discussion_chat = Chat(last_message_id=0, messages=[])

    ai_chat = Chat(last_message_id=0, messages=[])

    discussion_chat_id = await chats_collection.insert_one(
        discussion_chat.model_dump(by_alias=True, exclude=["id"])
    )

    ai_chat = await chats_collection.insert_one(
        ai_chat.model_dump(by_alias=True, exclude=["id"])
    )

    new_project = ProjectModel(
        name=project_name,
        for_who=for_who,
        doing_what=doing_what,
        additional_info=additional_info,
        owner=ObjectId(owner_id),
        members=[ObjectId(owner_id)],
        description="",
        created_at=datetime.now(),
        chat_id=ObjectId(discussion_chat_id.inserted_id),
        ai_chat_id=ObjectId(ai_chat.inserted_id),
    )

    result = await project_collection.insert_one(
        new_project.model_dump(by_alias=True, exclude=["id"])
    )

    return str(result.inserted_id)


@ray.remote
def generate_models_by_ai(
    project_id: str,
    for_who: str,
    doing_what: str,
    additional_info: str,
    image_model_ai: type[AI],
    text_model_ai: type[AI],
):
    try:
        ref_list = [
            generate_actors.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_business_scenarios.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_database_schema.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_elevator_speech.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            # generate_logo.remote(for_who, doing_what, additional_info, project_id, image_model_ai),
            generate_motto.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_project_schedule.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_requirements.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_risks.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_specifications.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_strategy.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_title.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
            generate_umls.remote(
                for_who, doing_what, additional_info, project_id, text_model_ai
            ),
        ]
    except Exception as e:
        print(f"[ERROR]: Failed to init generate module task for project: {project_id}")
        print(e)

    for ref in ref_list:
        try:
            ray.get(ref)
        except Exception as e:
            print(f"[ERROR]: Failed to generate {ref}")
            print(e)
            return
