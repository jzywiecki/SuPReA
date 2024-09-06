from fastapi import APIRouter, status, Response
from services import get_model
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.project_schedule import ProjectScheduleGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/project_schedule/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_project_schedule(project_id: str):
    return get_model(project_id, ComponentIdentify.PROJECT_SCHEDULE.value)


@router.post(
    "/project_schedule/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_project_schedule_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, ProjectScheduleGenerate)
    return Response(status_code=status.HTTP_200_OK)
