"""
This module defines the API routes for interacting with project components, specifically strategy.
"""

from fastapi import APIRouter, status, Response, Depends
from services import get_component
from services import update_component_by_ai
from services import regenerate_component_by_ai
from services import update_component
from models import ComponentIdentify, Strategy
from .common import RegenerateComponentByAIRequest
from generation.model.strategy import StrategyGenerate
from pydantic import BaseModel
from utils import verify_project_membership

router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/strategy/{project_id}",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(verify_project_membership)],
)
def get_strategy(project_id: str):
    """
    Retrieves the strategy component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.STRATEGY.value)


class UpdateStrategyByAIRequest(BaseModel):
    """
    The request object for updating a component using AI-based generation.
    """

    component_val: Strategy
    query: str
    ai_model: str


@router.post(
    "/strategy/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_strategy_by_ai(request: UpdateStrategyByAIRequest):
    """
    Updates the strategy component for the specified project using AI-based generation.
    """
    return update_component_by_ai(request, StrategyGenerate)


@router.post(
    "/strategy/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_strategy_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the strategy component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    return regenerate_component_by_ai(request, StrategyGenerate)


class UpdateStrategyRequest(BaseModel):
    """
    The request object for updating the strategies component by value provided by user.
    """

    project_id: str
    new_val: Strategy


@router.put(
    "/strategy/update",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(verify_project_membership)],
)
def update_strategy(request: UpdateStrategyRequest):
    """
    Updates the strategy component for the specified project using value provided by user.

    :param UpdateStrategyRequest request: The request object containing project ID and new value.
    """
    update_component(request, StrategyGenerate)
    return Response(status_code=status.HTTP_200_OK)
