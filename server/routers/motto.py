from fastapi import APIRouter, HTTPException
from bson import ObjectId
from server.models import MottoModel
from server.database import project_collection
from server.modules.motto_module.routes import MottoModule
from server.utils.openaiUtils import Model
from bson.json_util import dumps
from pymongo import ReturnDocument
import json

router = APIRouter(
    tags=["motto"],
    prefix="/motto",
    responses={404: {"description": "Not found"}},
)

@router.get(
    "/{project_id}",
)
async def get_motto(project_id: str):
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        motto = project["motto"]
        return motto
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

@router.post("/generate/{project_id}")
async def generate_motto(project_id: str):
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        motto = MottoModule(Model.GPT3)
        forWho = project["for_who"]
        doingWhat = project["doing_what"]
        content = motto.get_content(forWho, doingWhat, False)
        data = json.loads(content.choices[0].message.content)
        motto_model = MottoModel(**data)
        project["motto"] = motto_model.dict()
        await project_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project},
            return_document=ReturnDocument.AFTER,
        )
        return motto_model
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    