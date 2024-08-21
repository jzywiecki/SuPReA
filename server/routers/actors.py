from fastapi import APIRouter
from routers.projects import get_module


router = APIRouter(
    tags=["actors"],
    prefix="/actors",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_actors(project_id: str):
    return await get_module(project_id, "actors")