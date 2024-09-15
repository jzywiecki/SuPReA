"""
This module defines the API routes for interacting with project components, specifically actors.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from services import update_component_by_ai
from services import update_component
from models import ComponentIdentify, Actors
from .common import UpdateComponentByAIRequest
from generation.actors import ActorsGenerate
from pydantic import BaseModel


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/actors/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_actors(project_id: str):
    """
    Retrieves the actors component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.ACTORS.value)


@router.post(
    "/actors/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_actors_by_ai(request: UpdateComponentByAIRequest):
    """
    Updates the actors component for the specified project using AI-based generation.

    :param UpdateComponentByAIRequest request: The request object containing project ID and query for component update.
    """
    update_component_by_ai(request, ActorsGenerate)
    return Response(status_code=status.HTTP_200_OK)


class UpdateActorsRequest(BaseModel):
    """
    The request object for updating the actors component by value provided by user.
    """

    project_id: str
    new_val: Actors


@router.put(
    "/actors/update",
    status_code=status.HTTP_200_OK,
)
def update_actors(request: UpdateActorsRequest):
    """
    Updates the actors component for the specified project using value provided by user.

    :param UpdateActorsRequest request: The request object containing project ID and new value.
    """
    update_component(request, ActorsGenerate)
    return Response(status_code=status.HTTP_200_OK)
