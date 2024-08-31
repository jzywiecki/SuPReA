from fastapi import APIRouter
from .common import get_module
from models import ProjectFields

router = APIRouter(
    tags=["modules"],
    prefix="/modules",
)


@router.get("/elevator_speech/{project_id}")
def get_elevator_speech(project_id: str):
    return get_module(project_id, ProjectFields.ELEVATOR_SPEECH.value)
