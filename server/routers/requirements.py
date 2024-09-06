from fastapi import APIRouter, status, Response
from services import get_model
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.requirements import RequirementsGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/requirements/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_requirements(project_id: str):
    return get_model(project_id, ComponentIdentify.REQUIREMENTS.value)


@router.post(
    "/requirements/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_requirements_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, RequirementsGenerate)
    return Response(status_code=status.HTTP_200_OK)
