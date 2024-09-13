"""
This module contains the routers for the projects.
"""

from bson import ObjectId
from typing import List
from fastapi import APIRouter, status, Response
from pydantic import BaseModel, Field
from models import Project
from services import (
    create_empty_project,
    create_project_by_ai,
    get_project_by_id,
    delete_project_by_id,
    get_project_list_by_user_id,
)

router = APIRouter(tags=["projects"], prefix="/projects")


class EmptyProjectCreateRequest(BaseModel):
    """
    Request object for creating an empty project.
    """

    name: str
    owner_id: str


@router.post(
    "/create-empty",
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
def create_empty(request: EmptyProjectCreateRequest):
    """
    Creates an empty project with the specified name and owner ID.

    :param EmptyProjectCreateRequest request: The request object containing the name and owner ID.
    """
    new_project_id = create_empty_project(request)
    return new_project_id


class ProjectCreateByAIRequest(BaseModel):
    """
    Request object for creating a project using AI-based generation.
    """

    name: str
    for_who: str
    doing_what: str
    additional_info: str
    owner_id: str
    text_ai_model: str
    image_ai_model: str


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
def create(request: ProjectCreateByAIRequest):
    """
    Creates a project with the specified name and owner ID using AI-based generation.

    :param ProjectCreateByAIRequest request: The request object containing the name and owner ID.
    """
    new_project_id = create_project_by_ai(request)
    return new_project_id


@router.get(
    "/{project_id}",
    response_model=Project,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
def get_project(project_id: str):
    """
    Retrieves the project with the specified ID.

    :param str project_id: The unique identifier of the project.
    """
    return get_project_by_id(project_id)


@router.delete(
    "/{project_id}",
)
def delete_project(project_id: str):
    """
    Deletes the project with the specified ID.

    :param str project_id: The unique identifier of the project.
    """
    delete_project_by_id(project_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


class ProjectsListResponse(BaseModel):
    """
    Response object for retrieving the list of projects where the specified user is the owner or a member.
    """

    class ProjectListElement(BaseModel):
        id: ObjectId = Field(alias="_id", default=None)
        name: str
        description: str
        owner: ObjectId

        class Config:
            arbitrary_types_allowed = True
            json_encoders = {ObjectId: str}

    owner: List[ProjectListElement]
    member: List[ProjectListElement]


@router.get(
    "/list/{user_id}",
    response_model=ProjectsListResponse,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
def get_project_list(user_id: str):
    """
    Retrieves the list of projects where the specified user is the owner or a member.

    :param str user_id: The unique identifier of the user.
    """
    return get_project_list_by_user_id(user_id)
