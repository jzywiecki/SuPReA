from fastapi import APIRouter, HTTPException
from bson import ObjectId
from server.models import StrategyModel
from server.database import project_collection
from server.modules.strategy_module.routes import StrategyModule
from server.utils.openaiUtils import Model
from pymongo import ReturnDocument
import json

router = APIRouter(
    tags=["strategy"],
    prefix="/strategy",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_strategy(project_id: str):
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        strategy = project["strategy"]
        return strategy
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@router.post("/generate/{project_id}")
async def generate_strategy(project_id: str):
    print(f"Generating strategy for project {project_id}")
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        try:
            strategy = StrategyModule(Model.GPT3)
            for_who = project["for_who"]
            doing_what = project["doing_what"]
            additional_info = project["additional_info"]
            content = strategy.get_content(for_who, doing_what, additional_info, False)
            data = json.loads(content.choices[0].message.content)
            strategy_model = StrategyModel(**data)
            project["strategy"] = strategy_model.dict()
            await project_collection.find_one_and_update(
                {"_id": ObjectId(project_id)},
                {"$set": project},
                return_document=ReturnDocument.AFTER,
            )
            return strategy_model
        except Exception as e:
            print("Error in generating strategy!")
            return
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
