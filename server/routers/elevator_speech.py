from fastapi import APIRouter, HTTPException
from bson import ObjectId
from server.models import ElevatorSpeechModel
from server.database import project_collection
from server.modules.elevator_speech.routes import ElevatorSpeechModule
from server.utils.openaiUtils import Model
from pymongo import ReturnDocument
import json

router = APIRouter(
    tags=["elevator_speech"],
    prefix="/elevator_speech",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_elevator_speeches(project_id: str):
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        elevator_speeches = project["elevator_speech"]
        return elevator_speeches
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@router.post("/generate/{project_id}")
async def generate_elevator_speech(project_id: str):
    project = await project_collection.find_one({"_id": ObjectId(project_id)})
    if project:
        elevator_speech = ElevatorSpeechModule(Model.GPT3)
        for_who = project["for_who"]
        doing_what = project["doing_what"]
        additional_info = project["additional_info"]
        content = elevator_speech.get_content(
            for_who, doing_what, additional_info, False
        )
        data = json.loads(content.choices[0].message.content)
        elevator_speech_model = ElevatorSpeechModel(**data)
        project["elevator_speech"] = elevator_speech_model.dict()
        await project_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project},
            return_document=ReturnDocument.AFTER,
        )
        return elevator_speech_model
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
