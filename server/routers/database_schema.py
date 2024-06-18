import json
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from pymongo import ReturnDocument
from server.database import project_collection
from server.modules.database_schema.routes import DatabaseSchemaModule
from server.models import DatabaseSchemaModel
from server.utils.openaiUtils import Model


router = APIRouter(
    tags=["database_schema"],
    prefix="/database_schema",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_database_schema(project_id: str):
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        database_schema = project["database_schema"]
        return database_schema
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@router.post("/generate/{project_id}")
async def generate_database_schema(project_id: str):
    print(f"Generating database schema for project {project_id}")
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        database_schema = DatabaseSchemaModule(Model.GPT3)
        for_who = project["for_who"]
        doing_what = project["doing_what"]
        additional_info = project["additional_info"]
        content = database_schema.get_content(
            for_who, doing_what, additional_info, False
        )
        content = content[content.find("\n") + 1 :]
        content = content[: content.rfind("\n")]

        data = json.loads(content)
        database_schema_model = DatabaseSchemaModel(**data)
        project["database_schema"] = database_schema_model.dict()
        await project_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project},
            return_document=ReturnDocument.AFTER,
        )
        return database_schema_model
        # except Exception as e:
        #     print("Error in generating database schema!")
        #     return
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
