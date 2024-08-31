from fastapi import APIRouter
from database import get_model


router = APIRouter(
    tags=["risks"],
    prefix="/risks",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_risks(project_id: str):
    return await get_model(project_id, "risks")
