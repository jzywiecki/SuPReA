"""
This module defines the API routes for interacting with project components, specifically mockups.
"""

from fastapi import APIRouter, status, Response
from generation.model.mockups import MockupsGenerate
from services import get_component
from services import regenerate_component_by_ai
from .common import RegenerateComponentByAIRequest
from models import ComponentIdentify


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/mockups/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_mockups(project_id: str):
    """
    Retrieves the mockups component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.MOCKUPS.value)


@router.post(
    "/mockups/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_mockups_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the mockups component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    return regenerate_component_by_ai(request, MockupsGenerate)
