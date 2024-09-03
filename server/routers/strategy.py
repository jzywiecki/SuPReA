from fastapi import APIRouter
from .common import get_module
from models import ComponentIdentify

router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get("/strategy/{project_id}")
def get_strategy(project_id: str):
    return get_module(project_id, ComponentIdentify.STRATEGY.value)
