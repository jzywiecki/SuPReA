from fastapi import APIRouter, status, Response
from pydantic import BaseModel
from models import Project
from services import create_empty_project, create_project_by_ai, get_project_by_id, delete_project_by_id

router = APIRouter(tags=["projects"], prefix="/projects")


class EmptyProjectCreateRequest(BaseModel):
    name: str
    owner_id: str


@router.post(
    "/create-empty",
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
def create_empty(request: EmptyProjectCreateRequest):
    new_project_id = create_empty_project(request)
    return new_project_id


class ProjectCreateByAIRequest(BaseModel):
    name: str
    for_who: str
    doing_what: str
    additional_info: str
    owner_id: str


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
def create(request: ProjectCreateByAIRequest):
    new_project_id = create_project_by_ai(request)
    return new_project_id


@router.get(
    "/{project_id}",
    response_model=Project,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
def get_project(project_id: str):
    return get_project_by_id(project_id)


@router.delete(
    "/{project_id}",
)
def delete_project(project_id: str):
    delete_project_by_id(project_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
