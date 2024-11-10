"""
This module defines the API routes for interacting with project components, specifically suggested technologies.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from services import update_component_by_ai
from services import regenerate_component_by_ai
from services import update_component
from models import ComponentIdentify, SuggestedTechnologies
from .common import RegenerateComponentByAIRequest
from generation.model.suggested_technologies import SuggestedTechnologiesGenerate
from pydantic import BaseModel


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/suggested_technologies/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_suggested_technologies(project_id: str):
    """
    Retrieves the suggested technologies component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.SUGGESTED_TECHNOLOGIES.value)


class UpdateSuggestedTechnologiesByAIRequest(BaseModel):
    """
    The request object for updating a component using AI-based generation.
    """

    component_val: SuggestedTechnologies
    query: str
    ai_model: str
    callback: str


@router.post(
    "/suggested_technologies/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_suggested_technologies_by_ai(request: UpdateSuggestedTechnologiesByAIRequest):
    """
    Updates the suggested technologies component for the specified project using AI-based generation.
    """
    update_component_by_ai(request, SuggestedTechnologiesGenerate)
    return Response(status_code=status.HTTP_200_OK)


@router.post(
    "/suggested_technologies/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_suggested_technologies_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the suggested technologies component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    regenerate_component_by_ai(request, SuggestedTechnologiesGenerate)
    return Response(status_code=status.HTTP_200_OK)


class UpdateSuggestedTechnologiesRequest(BaseModel):
    """
    The request object for updating the suggested technologies component by value provided by user.
    """

    project_id: str
    new_val: SuggestedTechnologies


@router.put(
    "/suggested_technologies/update",
    status_code=status.HTTP_200_OK,
)
def update_suggested_technologies(request: SuggestedTechnologies):
    """
    Updates the suggested technologies component for the specified project using value provided by user.

    :param UpdateSuggestedTechnologiesRequest request: The request object containing project ID and new value.
    """
    update_component(request, SuggestedTechnologiesGenerate)
    return Response(status_code=status.HTTP_200_OK)
