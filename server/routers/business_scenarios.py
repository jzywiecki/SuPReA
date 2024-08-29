from fastapi import APIRouter
from database import get_module


router = APIRouter(
    tags=["business_scenarios"],
    prefix="/business_scenarios",
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/{project_id}",
)
async def get_business_scenarios(project_id: str):
    return await get_module(project_id, "business_scenarios")
