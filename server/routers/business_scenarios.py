from fastapi import APIRouter, status, Response
from services import get_model
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.business_scenarios import BusinessScenariosGenerate


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


@router.post(
    "/business_scenarios/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_business_scenarios_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, BusinessScenariosGenerate)
    return Response(status_code=status.HTTP_200_OK)
