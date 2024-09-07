"""
This module defines the API routes for interacting with project components, specifically risks.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.risks import RiskGenerate


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


@router.post(
    "/risks/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_risks_by_ai(request: UpdateComponentByAIRequest):
    """
    Updates the risks component for the specified project using AI-based generation.

    :param UpdateComponentByAIRequest request: The request object containing project ID and query for component update.
    """
    update_component(request, RiskGenerate)
    return Response(status_code=status.HTTP_200_OK)
