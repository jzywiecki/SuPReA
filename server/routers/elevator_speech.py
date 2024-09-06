from fastapi import APIRouter, status, Response
from services import get_model
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.elevator_speech import ElevatorSpeechGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/elevator_speech/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_elevator_speech(project_id: str):
    return get_model(project_id, ComponentIdentify.ELEVATOR_SPEECH.value)


@router.post(
    "/elevator_speech/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_elevator_speech_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, ElevatorSpeechGenerate)
    return Response(status_code=status.HTTP_200_OK)
