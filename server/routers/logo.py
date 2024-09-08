"""
This module defines the API routes for interacting with project components, specifically logo.
"""

from fastapi import APIRouter, status
from services import get_component
from models import ComponentIdentify


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
