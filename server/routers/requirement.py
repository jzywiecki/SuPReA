from fastapi import APIRouter, HTTPException
from bson import ObjectId
from server.models import RequirementsModel
from server.database import project_collection
from server.modules.requirements_module.routes import RequirementsModule
from server.utils.openaiUtils import Model
from pymongo import ReturnDocument

import json

router = APIRouter(
    tags=["requirements"],
    prefix="/requirements",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_requirements(project_id: str):
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        requirements = project["requirements"]
        return requirements
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@router.post("/generate/{project_id}")
async def generate_requirements(project_id: str):
    print(f"Generating requirements for project {project_id}")
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        try:
            requirements = RequirementsModule(Model.GPT3)
            for_who = project["for_who"]
            doing_what = project["doing_what"]
            additional_info = project["additional_info"]
            content = requirements.get_content(
                for_who, doing_what, additional_info, False
            )
            data = json.loads(content.choices[0].message.content)
            requirements_model = RequirementsModel(**data)
            project["requirements"] = requirements_model.dict()
            await project_collection.find_one_and_update(
                {"_id": ObjectId(project_id)},
                {"$set": project},
                return_document=ReturnDocument.AFTER,
            )
            return requirements_model
        except Exception as e:
            print("Error in generating requirements!")
            return
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
