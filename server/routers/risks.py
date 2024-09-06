from fastapi import APIRouter, status, Response
from services import get_model
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.risks import RiskGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/risks/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_risks(project_id: str):
    return get_model(project_id, ComponentIdentify.RISKS.value)


@router.post(
    "/risks/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_risks_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, RiskGenerate)
    return Response(status_code=status.HTTP_200_OK)
