from fastapi import APIRouter
from .common import get_module
from models import ComponentIdentify

router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get("/business_scenarios/{project_id}")
def get_business_scenarios(project_id: str):
    return get_module(project_id, ComponentIdentify.BUSINESS_SCENARIOS.value)
