"""
This module defines the API routes for interacting with project components, specifically business scenarios.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.business_scenarios import BusinessScenariosGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/business_scenarios/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_business_scenarios(project_id: str):
    """
    Retrieves the business scenarios component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.BUSINESS_SCENARIOS.value)


@router.post(
    "/business_scenarios/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_business_scenarios_by_ai(request: UpdateComponentByAIRequest):
    """
    Updates the business scenarios component for the specified project using AI-based generation.

    :param UpdateComponentByAIRequest request: The request object containing project ID and query for component update.
    """
    update_component(request, BusinessScenariosGenerate)
    return Response(status_code=status.HTTP_200_OK)
