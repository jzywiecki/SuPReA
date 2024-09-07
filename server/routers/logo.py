from fastapi import APIRouter, status
from services import get_component
from models import ComponentIdentify


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/logo/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_logo(project_id: str):
    return get_component(project_id, ComponentIdentify.LOGO.value)
