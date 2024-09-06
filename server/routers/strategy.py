from fastapi import APIRouter, status, Response
from services import get_model
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.strategy import StrategyGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/strategy/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_strategy(project_id: str):
    return get_model(project_id, ComponentIdentify.STRATEGY.value)


@router.post(
    "/strategy/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_strategy_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, StrategyGenerate)
    return Response(status_code=status.HTTP_200_OK)
