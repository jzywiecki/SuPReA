"""
This module defines the API routes for interacting with project components, specifically title.
"""

from fastapi import APIRouter, status, Response, Depends
from services import get_component
from services import update_component_by_ai
from services import regenerate_component_by_ai
from services import update_component
from models import ComponentIdentify, Title
from .common import RegenerateComponentByAIRequest
from generation.model.title import TitleGenerate
from pydantic import BaseModel
from utils import verify_project_membership

router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/title/{project_id}",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(verify_project_membership)],
)
def get_title(project_id: str):
    """
    Retrieves the title component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.TITLE.value)


class UpdateTitleByAIRequest(BaseModel):
    """
    The request object for updating a component using AI-based generation.
    """

    component_val: Title
    query: str
    ai_model: str


@router.post(
    "/title/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_title_by_ai(request: UpdateTitleByAIRequest):
    """
    Updates the title component for the specified project using AI-based generation.
    """
    return update_component_by_ai(request, TitleGenerate)


@router.post(
    "/title/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_title_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the title component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    return regenerate_component_by_ai(request, TitleGenerate)


class UpdateTitleRequest(BaseModel):
    """
    The request object for updating the titles component by value provided by user.
    """

    project_id: str
    new_val: Title


@router.put(
    "/title/update",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(verify_project_membership)],
)
def update_title(request: UpdateTitleRequest):
    """
    Updates the title component for the specified project using value provided by user.

    :param UpdateTitleRequest request: The request object containing project ID and new value.
    """
    update_component(request, TitleGenerate)
    return Response(status_code=status.HTTP_200_OK)
