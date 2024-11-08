"""
This module defines the API routes for interacting with project components, specifically requirements.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from services import update_component_by_ai
from services import regenerate_component_by_ai
from services import update_component
from models import ComponentIdentify, Requirements
from .common import RegenerateComponentByAIRequest
from generation.requirements import RequirementsGenerate
from pydantic import BaseModel


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/requirements/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_requirements(project_id: str):
    """
    Retrieves the requirements component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.REQUIREMENTS.value)


class UpdateRequiremenetsByAIRequest(BaseModel):
    """
    The request object for updating a component using AI-based generation.
    """

    component_val: Requirements
    query: str
    ai_model: str
    callback: str


@router.post(
    "/requirements/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_requirements_by_ai(request: UpdateRequiremenetsByAIRequest):
    """
    Updates the requirements component for the specified project using AI-based generation.
    """
    update_component_by_ai(request, RequirementsGenerate)
    return Response(status_code=status.HTTP_200_OK)


@router.post(
    "/requirements/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_requirements_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the requirements component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    regenerate_component_by_ai(request, RequirementsGenerate)
    return Response(status_code=status.HTTP_200_OK)


class UpdateRequirementsRequest(BaseModel):
    """
    The request object for updating the requirements component by value provided by user.
    """

    project_id: str
    new_val: Requirements


@router.put(
    "/requirements/update",
    status_code=status.HTTP_200_OK,
)
def update_requirements(request: UpdateRequirementsRequest):
    """
    Updates the requirements component for the specified project using value provided by user.

    :param UpdateRequirementsRequest request: The request object containing project ID and new value.
    """
    update_component(request, RequirementsGenerate)
    return Response(status_code=status.HTTP_200_OK)
