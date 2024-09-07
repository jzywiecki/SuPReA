from fastapi import APIRouter, status, Response
from services import get_component
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.specifications import SpecificationsGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/specifications/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_specifications(project_id: str):
    return get_component(project_id, ComponentIdentify.SPECIFICATIONS.value)


@router.post(
    "/specifications/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_specifications_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, SpecificationsGenerate)
    return Response(status_code=status.HTTP_200_OK)
