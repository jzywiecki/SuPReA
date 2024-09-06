from fastapi import APIRouter, status, Response
from services import get_model
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.title import TitleGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/title/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_title(project_id: str):
    return get_model(project_id, ComponentIdentify.TITLE.value)


@router.post(
    "/title/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_title_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, TitleGenerate)
    return Response(status_code=status.HTTP_200_OK)
