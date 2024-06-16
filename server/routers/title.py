from fastapi import APIRouter, HTTPException
from bson import ObjectId
from server.models import TitleModel
from server.database import project_collection
from server.modules.title.routes import TitleModule
from server.utils.openaiUtils import Model
from bson.json_util import dumps
from pymongo import ReturnDocument
import json

router = APIRouter(
    tags=["title"],
    prefix="/title",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_title(project_id: str):
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        title = project["title"]
        return title
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@router.post("/generate/{project_id}")
async def generate_title(project_id: str):
    print(f"Generating title for project {project_id}")
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        try:
            title = TitleModule(Model.GPT3)
            for_who = project["for_who"]
            doing_what = project["doing_what"]
            additional_info = project["additional_info"]
            content = title.get_content(for_who, doing_what, additional_info, False)
            data = json.loads(content.choices[0].message.content)
            title_model = TitleModel(**data)
            project["title"] = title_model.dict()
            await project_collection.find_one_and_update(
                {"_id": ObjectId(project_id)},
                {"$set": project},
                return_document=ReturnDocument.AFTER,
            )
            return title_model
        except Exception as e:
            print("Error in generating title!")
            return
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
