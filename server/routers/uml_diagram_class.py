"""
This module defines the API routes for interacting with project components, specifically uml diagram class.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from services import update_component_by_ai
from services import regenerate_component_by_ai
from services import update_component
from models import ComponentIdentify, UMLDiagramClasses
from .common import RegenerateComponentByAIRequest
from generation.model.uml_diagram_class import UMLDiagramClassesGenerate
from pydantic import BaseModel


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/uml_diagram_class/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_uml_diagram_class(project_id: str):
    """
    Retrieves the uml diagram class component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.UML_DIAGRAM_CLASS.value)


class UpdateUMLDiagramClassByAIRequest(BaseModel):
    """
    The request object for updating a component using AI-based generation.
    """

    component_val: UMLDiagramClasses
    query: str
    ai_model: str
    callback: str


@router.post(
    "/uml_diagram_class/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_uml_class_diagram_by_ai(request: UpdateUMLDiagramClassByAIRequest):
    """
    Updates the uml diagram class component for the specified project using AI-based generation.
    """
    update_component_by_ai(request, UMLDiagramClassesGenerate)
    return Response(status_code=status.HTTP_200_OK)


@router.post(
    "/uml_diagram_class/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_uml_class_diagram_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the uml diagram class component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    regenerate_component_by_ai(request, UMLDiagramClassesGenerate)
    return Response(status_code=status.HTTP_200_OK)


class UpdateUMLDiagramClassRequest(BaseModel):
    """
    The request object for updating the uml diagram class component by value provided by user.
    """

    project_id: str
    new_val: UMLDiagramClasses


@router.put(
    "/uml_diagram_class/update",
    status_code=status.HTTP_200_OK,
)
def update_uml_diagram_class(request: UpdateUMLDiagramClassRequest):
    """
    Updates the uml diagram class component for the specified project using value provided by user.
    """
    update_component(request, UMLDiagramClassesGenerate)
    return Response(status_code=status.HTTP_200_OK)
