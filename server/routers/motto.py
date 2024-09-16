"""
This module defines the API routes for interacting with project components, specifically motto.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from services import update_component_by_ai
from services import regenerate_component_by_ai
from services import update_component
from models import ComponentIdentify, Motto
from .common import UpdateComponentByAIRequest
from .common import RegenerateComponentByAIRequest
from generation.motto import MottoGenerate
from pydantic import BaseModel


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/motto/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_motto(project_id: str):
    """
    Retrieves the motto component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.MOTTO.value)


@router.post(
    "/motto/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_motto_by_ai(request: UpdateComponentByAIRequest):
    """
    Updates the motto component for the specified project using AI-based generation.

    :param UpdateComponentByAIRequest request: The request object containing project ID and query for component update.
    """
    update_component_by_ai(request, MottoGenerate)
    return Response(status_code=status.HTTP_200_OK)


@router.post(
    "/motto/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_motto_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the motto component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    regenerate_component_by_ai(request, MottoGenerate)
    return Response(status_code=status.HTTP_200_OK)


class UpdateMottoRequest(BaseModel):
    """
    The request object for updating the motto component by value provided by user.
    """

    project_id: str
    new_val: Motto


@router.put(
    "/motto/update",
    status_code=status.HTTP_200_OK,
)
def update_motto(request: UpdateMottoRequest):
    """
    Updates the motto component for the specified project using value provided by user.

    :param UpdateMottoRequest request: The request object containing project ID and new value.
    """
    update_component(request, MottoGenerate)
    return Response(status_code=status.HTTP_200_OK)
