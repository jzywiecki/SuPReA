from fastapi import APIRouter, status, Response
from services import get_model
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.motto import MottoGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/motto/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_motto(project_id: str):
    return get_model(project_id, ComponentIdentify.MOTTO.value)


@router.post(
    "/motto/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_motto_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, MottoGenerate)
    return Response(status_code=status.HTTP_200_OK)
