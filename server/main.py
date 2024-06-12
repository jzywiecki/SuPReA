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
import json
from bson import ObjectId
import motor.motor_asyncio
import os
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from fastapi import Body, status, HTTPException
from fastapi.responses import Response
from pymongo import ReturnDocument

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

class FeatureModel(BaseModel):
    """
    Container for a feature in a business scenario
    """
    feature_name: str
    description: str

class BusinessScenarioModel(BaseModel):
    """
    Container for a business scenario
    """
    title: str
    description: str
    features: List[FeatureModel]

class BusinessScenariosModel(BaseModel):
    """
    Container for a collection of business scenarios
    """
    scenarios: List[BusinessScenarioModel]

class ElevatorSpeechModel(BaseModel):
    """
    Container for an elevator speech
    """
    content: str

class ElevatorSpeechesModel(BaseModel):
    """
    Container for a collection of elevator speeches
    """
    speeches: List[ElevatorSpeechModel]

class ProjectModel(BaseModel):
    """
    Container for a project
    """
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    description: str
    owner: EmailStr
    for_who: str
    doing_what: str
    additional_info: Optional[str] = None
    members: List[EmailStr]
    created_at: datetime = Field(default=datetime.now())
    actors: Optional[ActorsModel] = None
    business_scenarios: Optional[BusinessScenariosModel] = None
    elevator_speech: Optional[ElevatorSpeechesModel] = None

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
    return ProjectCollection(projects=projects)


@app.get(
    "/projects/{project_id}",
    response_model=ProjectModel,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False
)
async def get_project(project_id: str):
    """
    Retrieve a project from the database
    """
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        return project

    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@app.put(
    "/projects/{project_id}",
    response_model=ProjectModel,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False
)
async def update_project(project_id: str, project: ProjectModel = Body(...)):
    """
    Update a project in the database
    """
    project = {
        k: v for k, v in project.model_dump(by_alias=True).items() if v is not None
    }

    if len(project) >= 1:
        update_result = await project_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project},
            return_document=ReturnDocument.AFTER,
        )

        if update_result is not None:
            return update_result
        else:
            raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

    if project := await project_collection.find_one({"_id": ObjectId(project_id)}) is not None:
        return project

    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
            
@app.delete(
    "/projects/{project_id}",
)
async def delete_project(project_id: str):
    """
    Delete a project from the database
    """
    delete_result = await project_collection.delete_one({"_id": ObjectId(project_id)})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@app.get(
    "/projects/{project_id}/actors",
)
async def get_actors(project_id: str):
    """
    Retrieve actors from a project
    """
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        actors = project["actors"]
        return actors
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

@app.get(
    "/projects/{project_id}/business_scenarios",
)
async def get_business_scenarios(project_id: PyObjectId, business_scenarios_id: PyObjectId):
    """
    Retrieve business scenarios from a project
    """
    project = await project_collection.find_one({"_id": project_id})
    business_scenarios = project["business_scenarios"]
    business_scenario = business_scenarios[business_scenarios_id]
    return business_scenario

@app.get(
    "/projects/{project_id}/elevator_speeches",
)
async def get_elevator_speeches(project_id: str, elevator_speeches_id: PyObjectId):
    """
    Retrieve elevator speeches from a project
    """
    project = await project_collection.find_one({"_id": project_id})
    elevator_speeches = project["elevator_speeches"]
    elevator_speech = elevator_speeches[elevator_speeches_id]
    return elevator_speech

@app.post("/generate-actors/{project_id}")
async def generate_actors(project_id: str):
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        actors = ActorsModule(Model.GPT3)
        forWho = project["for_who"]
        doingWhat = project["doing_what"]
        content = actors.get_content(forWho, doingWhat)
        data = json.loads(content.choices[0].message.content)
        actors_model = ActorsModel(**data)
        project["actors"] = actors_model.dict()

        await project_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project},
            return_document=ReturnDocument.AFTER,
        )
        return actors_model
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

@app.post("/generate-business-scenarios/{project_id}")
async def generate_business_scenarios(project_id: str):
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        business_scenarios = BusinessModule(Model.GPT3)
        forWho = project["for_who"]
        doingWhat = project["doing_what"]
        content = business_scenarios.get_content(forWho, doingWhat)
        data = json.loads(content.choices[0].message.content)
        business_scenarios_model = BusinessScenariosModel(**data)
        project["business_scenarios"] = business_scenarios_model.dict()

        await project_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project},
            return_document=ReturnDocument.AFTER,
        )
        return business_scenarios_model
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

@app.post("/generate-elevator-speech/{project_id}")
async def generate_elevator_speech(project_id: str):
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        elevator_speech = ElevatorSpeechModule(Model.GPT3)
        forWho = project["for_who"]
        doingWhat = project["doing_what"]
        content = elevator_speech.get_content(forWho, doingWhat)
        data = json.loads(content.choices[0].message.content)
        elevator_speech_model = ElevatorSpeechesModel(**data)
        project["elevator_speech"] = elevator_speech_model.dict()

        await project_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project},
            return_document=ReturnDocument.AFTER,
        )
        return elevator_speech_model
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
