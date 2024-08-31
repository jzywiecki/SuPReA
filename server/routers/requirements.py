from fastapi import APIRouter
from database import get_model


router = APIRouter(
    tags=["requirements"],
    prefix="/requirements",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_requirements(project_id: str):
    return await get_model(project_id, "requirements")
