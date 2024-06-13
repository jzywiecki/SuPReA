from fastapi import APIRouter, HTTPException
from bson import ObjectId
from server.models import RisksModel
from server.database import project_collection
from server.modules.risk_module.routes import RiskModule
from server.utils.openaiUtils import Model
from bson.json_util import dumps
from pymongo import ReturnDocument
import json

router = APIRouter(
    tags=["risks"],
    prefix="/risks",
    responses={404: {"description": "Not found"}},
)

@router.get(
    "/{project_id}",
)
async def get_risks(project_id: str):
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        risks = project["risks"]
        return risks
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")

@router.post("/generate/{project_id}")
async def generate_risks(project_id: str):
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        risks = RiskModule(Model.GPT3)
        forWho = project["for_who"]
        doingWhat = project["doing_what"]
        content = risks.get_content(forWho, doingWhat, False)
        data = json.loads(content.choices[0].message.content)
        risks_model = RisksModel(**data)
        project["risks"] = risks_model.dict()
        await project_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project},
            return_document=ReturnDocument.AFTER,
        )
        return risks_model
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
