"""
This module defines the API routes for interacting with project components, specifically project schedule.
"""

from fastapi import APIRouter, status, Response
from services import get_component
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
    """
    Retrieves the project schedule component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.PROJECT_SCHEDULE.value)


@router.post(
    "/project_schedule/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_project_schedule_by_ai(request: UpdateComponentByAIRequest):
    """
    Updates the project schedule component for the specified project using AI-based generation.

    :param UpdateComponentByAIRequest request: The request object containing project ID and query for component update.
    """
    update_component(request, ProjectScheduleGenerate)
    return Response(status_code=status.HTTP_200_OK)
