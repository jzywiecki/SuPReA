from fastapi import APIRouter, status
from services import get_model
from models import ComponentIdentify

router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/business_scenarios/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_business_scenarios(project_id: str):
    return get_model(project_id, ComponentIdentify.BUSINESS_SCENARIOS.value)
