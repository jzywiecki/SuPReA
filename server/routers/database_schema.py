from fastapi import APIRouter, status, Response
from services import get_component
from models import ComponentIdentify
from .common import UpdateComponentByAIRequest
from services.component import update_component
from generation.database_schema import DatabaseSchemaGenerate


router = APIRouter(
    tags=["model"],
    prefix="/model",
)


@router.get(
    "/database_schema/{project_id}",
    status_code=status.HTTP_200_OK,
)
def get_database_schema(project_id: str):
    return get_component(project_id, ComponentIdentify.DATABASE_SCHEMA.value)


@router.post(
    "/database_schema/ai-update",
    status_code=status.HTTP_200_OK,
)
def update_database_schema_by_ai(request: UpdateComponentByAIRequest):
    update_component(request, DatabaseSchemaGenerate)
    return Response(status_code=status.HTTP_200_OK)
