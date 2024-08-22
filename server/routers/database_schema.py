from fastapi import APIRouter
from routers.projects import get_module


router = APIRouter(
    tags=["database_schema"],
    prefix="/database_schema",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_database_schema(project_id: str):
    return await get_module(project_id, "database_schema")
