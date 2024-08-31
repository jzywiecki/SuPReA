from fastapi import APIRouter
from .common import get_module
from models import ProjectFields

router = APIRouter(
    tags=["modules"],
    prefix="/modules",
)


@router.get("/business_scenarios/{project_id}")
def get_business_scenarios(project_id: str):
    return get_module(project_id, ProjectFields.BUSINESS_SCENARIOS.value)
