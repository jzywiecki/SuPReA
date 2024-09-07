from fastapi import APIRouter, status, Response
from services import get_component
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.actors import ActorsGenerate

router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/actors/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_actors(project_id: str):
    return get_component(project_id, ComponentIdentify.ACTORS.value)


@router.post(
    "/actors/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_actors_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, ActorsGenerate)
    return Response(status_code=status.HTTP_200_OK)
