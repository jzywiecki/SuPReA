"""
This module contains the routers for the projects.
"""

from ctypes import Array
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
from fastapi import APIRouter, status, Response, Depends
from pydantic import BaseModel, Field
from typing import Optional
from models import Project, Motto, ElevatorSpeech
from services import (
    create_empty_project,
    create_project_by_ai,
    get_project_by_id,
    delete_project_by_id,
    get_project_list_by_user_id,
    invite_member_by_id,
    remove_member_by_id,
    assign_manager_role_to_user_by_id,
    unassign_member_role_from_user_by_id,
    assign_owner_role_for_user_by_id,
    update_project_info,
)
from models import ProjectPatchRequest
from utils import verify_project_membership


router = APIRouter(tags=["projects"], prefix="/projects")


class EmptyProjectCreateRequest(BaseModel):
    """
    Request object for creating an empty project.
    """

    name: str
    owner_id: str


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


class ProjectAddMemberRequest(BaseModel):
    """
    Request object for adding a member to a project.
    """

    sender_id: str
    member_id: str


class MemberAction(BaseModel):
    sender_id: str
    member_id: str


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
    dependencies=[Depends(verify_project_membership)],
)
def get_project(project_id: str):
    """
    Retrieves the project with the specified ID.

    :param str project_id: The unique identifier of the project.
    """
    return get_project_by_id(project_id)


@router.patch(
    "/{project_id}",
    response_model=Project,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
    dependencies=[Depends(verify_project_membership)],
)
def patch_project(project_id: str, body: ProjectPatchRequest):
    """
    Patches the project with specified id.

     :param str project_id: The unique identifier of the project.
     :param ProjectPatchRequest: The project patch fields request

    """
    return update_project_info(project_id, body)


@router.delete(
    "/{project_id}",
    dependencies=[Depends(verify_project_membership)],
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
        for_who: str
        doing_what: str
        additional_info: str
        members: List[ObjectId]
        created_at: datetime
        motto: Optional[Motto] = None
        elevator_speech: Optional[ElevatorSpeech] = None

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


@router.post(
    "/{project_id}/members/add",
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
    dependencies=[Depends(verify_project_membership)],
)
def invite_member(project_id: str, invite: MemberAction):
    """
    Adds a member to the project with the specified ID.

    :param str project_id: The unique identifier of the project.
    :param MemberInvite invite: The data containing sender_id and member_id.
    """
    return invite_member_by_id(invite.sender_id, project_id, invite.member_id)


@router.post(
    "/{project_id}/members/remove",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(verify_project_membership)],
)
def remove_member(project_id: str, removal: MemberAction):
    """
    Removes a member from the project with the specified ID.

    :param str project_id: The unique identifier of the project.
    :param str member_id: The unique identifier of the member.
    """
    return remove_member_by_id(removal.sender_id, project_id, removal.member_id)


@router.post(
    "/{project_id}/managers/assign",
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
    dependencies=[Depends(verify_project_membership)],
)
def assign_manager(project_id: str, assignment: MemberAction):
    """
    Assigns a manager to the project with the specified ID.

    :param str project_id: The unique identifier of the project.
    :param MemberAction assignment: The unique identifier of the manager and sender.
    """
    return assign_manager_role_to_user_by_id(
        assignment.sender_id, project_id, assignment.member_id
    )


@router.post(
    "/{project_id}/managers/unassign",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(verify_project_membership)],
)
def unassign_manager(project_id: str, assignment: MemberAction):
    """
    Unassigns a manager from the project with the specified ID.

    :param str project_id: The unique identifier of the project.
    :param MemberAction assignment: The unique identifier of the manager and sender.
    """
    return unassign_member_role_from_user_by_id(
        assignment.sender_id, project_id, assignment.member_id
    )


@router.post(
    "/{project_id}/owner/assign",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(verify_project_membership)],
)
def assign_owner(project_id: str, assignment: MemberAction):
    """
    Transfers a role of a project owner.

    Args:
        project_id (str):
        :param MemberAction assignment: The unique identifier of the new owner and sender.
    """
    return assign_owner_role_for_user_by_id(
        assignment.sender_id, project_id, assignment.member_id
    )
