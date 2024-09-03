from fastapi import APIRouter
from .common import get_module
from models import ComponentIdentify

router = APIRouter(
    tags=["modules"],
    prefix="/modules",
)


@router.get("/risks/{project_id}")
def get_risks(project_id: str):
    return get_module(project_id, ComponentIdentify.RISKS.value)
