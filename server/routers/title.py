from fastapi import APIRouter
from .common import get_module
from models import ComponentIdentify

router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get("/title/{project_id}")
def get_title(project_id: str):
    return get_module(project_id, ComponentIdentify.TITLE.value)
