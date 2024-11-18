"""
This module defines the API routes for interacting with project components, specifically business scenarios.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from services import update_component_by_ai
from services import regenerate_component_by_ai
from services import update_component
from models import ComponentIdentify, BusinessScenarios
from .common import RegenerateComponentByAIRequest
from generation.model.business_scenarios import BusinessScenariosGenerate
from pydantic import BaseModel


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


class UpdateBusinessScenariosByAIRequest(BaseModel):
    """
    The request object for updating a component using AI-based generation.
    """

    component_val: BusinessScenarios
    query: str
    ai_model: str


@router.post(
    "/business_scenarios/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_business_scenarios_by_ai(request: UpdateBusinessScenariosByAIRequest):
    """
    Updates the business scenarios component for the specified project using AI-based generation.
    """
    return update_component_by_ai(request, BusinessScenariosGenerate)


@router.post(
    "/business_scenarios/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_business_scenarios_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the business scenarios component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    return regenerate_component_by_ai(request, BusinessScenariosGenerate)


class UpdateBusinessScenariosRequest(BaseModel):
    """
    The request object for updating the business scenarios component by value provided by user.
    """

    project_id: str
    new_val: BusinessScenarios


@router.put(
    "/business_scenarios/update",
    status_code=status.HTTP_200_OK,
)
def update_business_scenarios(request: UpdateBusinessScenariosRequest):
    """
    Updates the business scenarios component for the specified project using value provided by user.

    :param UpdateBusinessScenariosRequest request: The request object containing project ID and new value.
    """
    update_component(request, BusinessScenariosGenerate)
    return Response(status_code=status.HTTP_200_OK)
