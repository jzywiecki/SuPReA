"""
This module defines the API routes for interacting with project components, specifically elevator speech.
"""

from fastapi import APIRouter, status, Response
from services import get_component
from services import update_component_by_ai
from services import regenerate_component_by_ai
from services import update_component
from models import ComponentIdentify, ElevatorSpeech
from .common import UpdateComponentByAIRequest
from .common import RegenerateComponentByAIRequest
from generation.elevator_speech import ElevatorSpeechGenerate
from pydantic import BaseModel


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/elevator_speech/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_elevator_speech(project_id: str):
    """
    Retrieves the elevator speech component for the specified project.

    :param str project_id: The unique identifier of the project.
    """
    return get_component(project_id, ComponentIdentify.ELEVATOR_SPEECH.value)


@router.post(
    "/elevator_speech/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_elevator_speech_by_ai(request: UpdateComponentByAIRequest):
    """
    Updates the elevator speech component for the specified project using AI-based generation.

    :param UpdateComponentByAIRequest request: The request object containing project ID and query for component update.
    """
    update_component_by_ai(request, ElevatorSpeechGenerate)
    return Response(status_code=status.HTTP_200_OK)


@router.post(
    "/elevator_speech/ai-regenerate",
    status_code=status.HTTP_200_OK,
)
def regenerate_elevator_speech_by_ai(request: RegenerateComponentByAIRequest):
    """
    Regenerates the elevator speech component for the specified project using AI-based generation.

    :param RegenerateComponentByAIRequest request: The request object containing project ID and query for component regeneration.
    """
    regenerate_component_by_ai(request, ElevatorSpeechGenerate)
    return Response(status_code=status.HTTP_200_OK)


class UpdateElevatorSpeechRequest(BaseModel):
    """
    The request object for updating the elevator speech component by value provided by user.
    """

    project_id: str
    new_val: ElevatorSpeech


@router.put(
    "/elevator_speech/update",
    status_code=status.HTTP_200_OK,
)
def update_elevator_speech(request: UpdateElevatorSpeechRequest):
    """
    Updates the elevator speech component for the specified project using value provided by user.

    :param UpdateElevatorSpeechRequest request: The request object containing project ID and new value.
    """
    update_component(request, ElevatorSpeechGenerate)
    return Response(status_code=status.HTTP_200_OK)
