from fastapi import APIRouter
from .common import get_module
from models import ProjectFields

router = APIRouter(
    tags=["modules"],
    prefix="/modules",
)


@router.get("/database_schema/{project_id}")
def get_database_schema(project_id: str):
    return get_module(project_id, ProjectFields.DATABASE_SCHEMA.value)
