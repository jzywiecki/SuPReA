from fastapi import APIRouter
from .common import get_module
from models import ComponentIdentify

router = APIRouter(
    tags=["modules"],
    prefix="/modules",
)


@router.get("/motto/{project_id}")
def get_motto(project_id: str):
    return get_module(project_id, ComponentIdentify.MOTTO.value)