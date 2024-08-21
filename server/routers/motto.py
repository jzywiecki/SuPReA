from fastapi import APIRouter
from routers.projects import get_module


router = APIRouter(
    tags=["motto"],
    prefix="/motto",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_motto(project_id: str):
    return await get_module(project_id, "motto")
