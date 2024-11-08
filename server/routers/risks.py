"""
This module defines the API routes for interacting with project components, specifically risks.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from services import update_component_by_ai
from services import regenerate_component_by_ai
from services import update_component
from models import ComponentIdentify, Risks
from .common import RegenerateComponentByAIRequest
from generation.risks import RiskGenerate
from pydantic import BaseModel


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/risks/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_risks(project_id: str):
    """
    Retrieves the risks component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.RISKS.value)


class UpdateRisksByAIRequest(BaseModel):
    """
    The request object for updating a component using AI-based generation.
    """

    component_val: Risks
    query: str
    ai_model: str
    callback: str


@router.post(
    "/risks/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_risks_by_ai(request: UpdateRisksByAIRequest):
    """
    Updates the risks component for the specified project using AI-based generation.
    """
    update_component_by_ai(request, RiskGenerate)
    return Response(status_code=status.HTTP_200_OK)


@router.post(
    "/risks/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_risks_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the risks component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    regenerate_component_by_ai(request, RiskGenerate)
    return Response(status_code=status.HTTP_200_OK)


class UpdateRisksRequest(BaseModel):
    """
    The request object for updating the risks component by value provided by user.
    """

    project_id: str
    new_val: Risks


@router.put(
    "/risks/update",
    status_code=status.HTTP_200_OK,
)
def update_risks(request: UpdateRisksRequest):
    """
    Updates the risks component for the specified project using value provided by user.

    :param UpdateRisksRequest request: The request object containing project ID and new value.
    """
    update_component(request, RiskGenerate)
    return Response(status_code=status.HTTP_200_OK)
