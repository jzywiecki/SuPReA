from fastapi import APIRouter, HTTPException, status, Response
from pydantic import BaseModel
from models import Project
import database.projects as projects_dao
from generation.project import generate_components_remote_wrapper
from bson.errors import InvalidId
from utils import logger

from ai.open_ai import GPT35TurboInstance, DallE3Instance

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
    if not request.name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project name"
        )

    new_project_id = projects_dao.create_project(
        request.name, request.owner_id, "", "", "", ""
    )
    return new_project_id


class ProjectCreateRequest(BaseModel):
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
def create(request: ProjectCreateRequest):
    if not request.name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project name"
        )
    if not request.doing_what or not request.for_who:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid project description",
        )

    new_project_id = projects_dao.create_project(
        request.name,
        request.owner_id,
        "",
        request.for_who,
        request.doing_what,
        request.additional_info,
    )

    generate_components_remote_wrapper.remote(
        new_project_id,
        request.for_who,
        request.doing_what,
        request.additional_info,
        GPT35TurboInstance,
        DallE3Instance,
    )

    return new_project_id


@router.get(
    "/{project_id}",
    response_model=Project,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
def get_project(project_id: str):
    project = projects_dao.get_project(project_id)
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    return project


@router.delete(
    "/{project_id}",
)
def delete_project(project_id: str):
    delete_result = projects_dao.delete_project(project_id)
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)

    return Response(status_code=status.HTTP_204_NO_CONTENT)
