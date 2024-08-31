from fastapi import APIRouter
from .common import get_module
from models import ProjectFields

router = APIRouter(
    tags=["modules"],
    prefix="/modules",
)


@router.get("/actors/{project_id}")
def get_actors(project_id: str):
    return get_module(project_id, ProjectFields.ACTORS.value)
