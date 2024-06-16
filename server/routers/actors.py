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
    print(f"Generating actors for project {project_id}")
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        try:
            actors = ActorsModule(Model.GPT3)
            for_who = project["for_who"]
            doing_what = project["doing_what"]
            additional_info = project["additional_info"]
            content = actors.get_content(for_who, doing_what, additional_info, False)
            data = json.loads(content.choices[0].message.content)
            actors_model = ActorsModel(**data)
            project["actors"] = actors_model.dict()
            await project_collection.find_one_and_update(
                {"_id": ObjectId(project_id)},
                {"$set": project},
                return_document=ReturnDocument.AFTER,
            )
            return actors_model
        except Exception as e:
            print("Error in generating actors!")
            return

    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
