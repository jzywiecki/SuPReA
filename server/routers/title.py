from fastapi import APIRouter
from .common import get_module
from models import ProjectFields

router = APIRouter(
    tags=["modules"],
    prefix="/modules",
)


@router.get("/title/{project_id}")
def get_title(project_id: str):
    return get_module(project_id, ProjectFields.TITLE.value)