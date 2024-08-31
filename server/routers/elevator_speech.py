from fastapi import APIRouter
from database import get_model


router = APIRouter(
    tags=["elevator_speech"],
    prefix="/elevator_speech",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_elevator_speeches(project_id: str):
    return await get_model(project_id, "elevator_speech")
