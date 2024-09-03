from fastapi import APIRouter
from .common import get_module
from models import ComponentIdentify

router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get("/database_schema/{project_id}")
def get_database_schema(project_id: str):
    return get_module(project_id, ComponentIdentify.DATABASE_SCHEMA.value)
