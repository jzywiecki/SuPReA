from fastapi import APIRouter, HTTPException
from bson import ObjectId
from server.models import ActorsModel
from server.database import project_collection
from server.modules.actors.routes import ActorsModule
from server.utils.openaiUtils import Model
from bson.json_util import dumps
from pymongo import ReturnDocument
import json

router = APIRouter(
    tags=["actors"],
    prefix="/actors",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_actors(project_id: str):
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        actors = project["actors"]
        return actors
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@router.post("/generate/{project_id}")
async def generate_actors(project_id: str):
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        actors = ActorsModule(Model.GPT3)
        forWho = project["for_who"]
        doingWhat = project["doing_what"]
        content = actors.get_content(forWho, doingWhat, False)
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
