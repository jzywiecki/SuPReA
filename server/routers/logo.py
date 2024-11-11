"""
This module defines the API routes for interacting with project components, specifically logo.
"""

from fastapi import APIRouter, status, Response
from generation.model.logo import LogoGenerate
from services import get_component
from services import regenerate_component_by_ai
from .common import RegenerateComponentByAIRequest
from models import ComponentIdentify
from utils import verify_project_membership


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/logo/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_logo(project_id: str):
    """
    Retrieves the logo component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.LOGO.value)


@router.post(
    "/logo/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_logo_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the logo component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    return regenerate_component_by_ai(request, LogoGenerate)
