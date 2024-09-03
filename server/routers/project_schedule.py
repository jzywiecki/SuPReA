from fastapi import APIRouter
from .common import get_module
from models import ComponentIdentify

router = APIRouter(
    tags=["modules"],
    prefix="/modules",
)


@router.get("/project_schedule/{project_id}")
def get_project_schedule(project_id: str):
    return get_module(project_id, ComponentIdentify.PROJECT_SCHEDULE.value)