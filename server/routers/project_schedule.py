from fastapi import APIRouter
from database import get_model


router = APIRouter(
    tags=["project_schedule"],
    prefix="/project_schedule",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_project_schedule(project_id: str):
    return await get_model(project_id, "project_schedule")
