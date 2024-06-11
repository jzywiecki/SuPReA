from fastapi import FastAPI
from fastapi import BackgroundTasks
from server.modules.actors.routes import ActorsModule
from server.modules.business_scenarios.routes import BusinessModule
from server.modules.database_schema.routes import DatabaseSchemaModule
from server.modules.elevator_speech.routes import ElevatorSpeechModule
from server.modules.project_schedule.routes import ScheduleModule
from server.modules.title.routes import TitleModule
from server.modules.uml.routes import UmlModule
from server.utils.openaiUtils import Model

import motor.motor_asyncio
import os
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from fastapi import Body, status

app = FastAPI()
client = motor.motor_asyncio.AsyncIOMotorClient(os.environ["MONGODB_URL"])
db = client.get_database("Projects")
project_collection = db.get_collection("projects")

PyObjectId = Annotated[str, BeforeValidator(str)]

class ActorModel(BaseModel):
    """
    Container for an actor
    """
    name: str
    description: str

class ActorsModel(BaseModel):
    """
    Container for a collection of actors
    """
    actors: List[ActorModel]

class ProjectModel(BaseModel):
    """
    Container for a project
    """
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    description: str
    owner: EmailStr
    members: List[EmailStr]
    created_at: datetime = Field(default=datetime.now())
    actors: Optional[List[ActorsModel]] = None

    class Config:
        arbitrary_types_allowed = True

class ProjectCollection(BaseModel):
    """
    Container for a collection of projects
    """
    projects: List[ProjectModel]


@app.post(
    "/projects",
    response_model=ProjectModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False
)
async def create_project(project: ProjectModel = Body(...)):
    """
    Insert a new project into the database
    """
    new_project = await project_collection.insert_one(
        project.model_dump(by_alias=True, exclude=["id"])
    )

    created_project = await project_collection.find_one(
        {"_id": new_project.inserted_id}
    )

    return created_project

@app.get(
    "/projects",
    response_model=ProjectCollection,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False
)
async def get_projects():
    """
    Retrieve all projects from the database
    """
    projects = await project_collection.find().to_list(length=None)
    return {"projects": projects}


@app.get(
    "/projects/{project_id}",
    response_model=ProjectModel,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False
)
async def get_project(project_id: PyObjectId):
    """
    Retrieve a project from the database
    """
    project = await project_collection.find_one({"_id": project_id})
    return project

@app.get(
    "/projects/{project_id}/actors/{actors_id}",
)
async def get_actors(project_id: PyObjectId, actors_id: PyObjectId):
    """
    Retrieve actors from a project
    """
    project = await project_collection.find_one({"_id": project_id})
    actors = project["actors"]
    actor = actors[actors_id]
    return actor

@app.post("/generate-app")
async def generate_app(forWho: str, doingWhat: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(generator, forWho, doingWhat)
    return 

def generator(forWho: str, doingWhat: str):
    for module in declare_text_modules(Model.GPT3):
        returned_value = module.get_content(forWho, doingWhat)
        if returned_value is not None:



            print(returned_value)

def declare_text_modules(llm_model: Model):
    actors = ActorsModule(llm_model)
    # uml_generator = UmlModule(llm_model)
    # business_generator = BusinessModule(llm_model)
    speech_generator = ElevatorSpeechModule(llm_model)
    # title_generator = TitleModule(llm_model)
    # schedule_generator = ScheduleModule(llm_model)
    # database_schema_generator = DatabaseSchemaModule(llm_model)
    # logo_generator = LogoModule(llm_model)

    # return [actors, uml_generator, business_generator, speech_generator, title_generator, schedule_generator, database_schema_generator]
    return [actors, speech_generator]
