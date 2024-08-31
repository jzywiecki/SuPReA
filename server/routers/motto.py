from fastapi import APIRouter
from database import get_model


router = APIRouter(
    tags=["motto"],
    prefix="/motto",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_motto(project_id: str):
    return await get_model(project_id, "motto")
