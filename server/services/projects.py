"""
This module provides functionality for managing projects, including creating, retrieving, and deleting projects.
It also integrates with AI models to generate project components.
"""

from typing import Dict

from pymongo.results import DeleteResult

from utils import InvalidParameter, ProjectNotFound
from generation.project import generate_project_components_task
from ai import get_text_model_remote_ref_enum, get_image_model_remote_ref_enum
from database import project_dao, chat_dao, get_project_dao_ref


def create_empty_project(request) -> str:
    """
    Creates a new project with basic details.

    :param request: The request object containing project details.
    :type request: object with attributes `name` (str), `owner_id` (str), etc.

    :raises InvalidParameter: If the project name is empty.

    :return: The unique identifier of the newly created project.
    :rtype: str
    """
    if not request.name:
        raise InvalidParameter("Project name cannot be empty")

    new_project_id = project_dao.create_project(
        request.name, request.owner_id, "", "", "", "", chat_dao
    )

    return new_project_id


def create_project_by_ai(request) -> str:
    """
    Creates a new project and triggers AI-based component generation.

    :param request: The request object containing project details and AI parameters.
    :type request: object with attributes `name` (str), `owner_id` (str), `for_who` (str), `doing_what` (str), `additional_info` (str)

    :raises InvalidParameter: If the project name is empty or AI parameters are missing.

    :return: The unique identifier of the newly created project.
    :rtype: str
    """
    if not request.name:
        raise InvalidParameter("Project name cannot be empty")

    if not request.doing_what or not request.for_who:
        raise InvalidParameter("Invalid request arguments for AI")

    if not request.text_ai_model or not request.image_ai_model:
        raise InvalidParameter("AI model cannot be empty")

    ai_text_model = get_text_model_remote_ref_enum(request.text_ai_model)
    ai_image_model = get_image_model_remote_ref_enum(request.image_ai_model)

    new_project_id = project_dao.create_project(
        request.name,
        request.owner_id,
        "",
        request.for_who,
        request.doing_what,
        request.additional_info,
        chat_dao,
    )

    generate_project_components_task.remote(
        new_project_id,
        request.for_who,
        request.doing_what,
        request.additional_info,
        ai_text_model,
        ai_image_model,
        get_project_dao_ref,
        new_project_id,
    )

    return new_project_id


def get_project_by_id(project_id: str) -> Dict:
    """
    Retrieves a project by its ID.

    :param project_id: The unique identifier of the project.
    :type project_id: str

    :raises ProjectNotFound: If no project is found with the provided ID.

    :return: The project details.
    :rtype: dict
    """
    project = project_dao.get_project(project_id)
    if project is None:
        raise ProjectNotFound(project_id)

    return project


def delete_project_by_id(project_id: str) -> DeleteResult | None:
    """
    Deletes a project by its ID.

    :param project_id: The unique identifier of the project.
    :type project_id: str

    :raises ProjectNotFound: If no project is found with the provided ID.

    :return: Confirmation of deletion.
    :rtype: bool
    """
    if not project_dao.is_project_exist(project_id):
        raise ProjectNotFound(project_id)

    return project_dao.delete_project(project_id, chat_dao)


def get_project_list_by_user_id(user_id: str) -> Dict:
    """
    Retrieves a list of projects associated with a specific user ID.

    :param user_id: The unique identifier of the user.
    :type user_id: str

    :return: A dictionary containing lists of projects where the user is an owner or a member.
    :rtype: dict
    :key str "owner": List of projects owned by the user.
    :key str "member": List of projects where the user is a member.
    """
    # TODO: check if user exists

    project_list_member = project_dao.get_projects_by_member(user_id)
    project_list_owner = project_dao.get_projects_by_owner(user_id)
    result = {
        "owner": project_list_owner,
        "member": project_list_member,
    }
    return result


def invite_member_by_id(sender_id: str, project_id: str, member_id: str):
    """
    Invites a user to a project.

    :param sender_id: The unique identifier of the user sending the invitation.
    :type sender_id: str

    :param project_id: The unique identifier of the project.
    :type project_id: str

    :param member_id: The unique identifier of the user being invited.
    :type member_id: str

    :raises ProjectNotFound: If no project is found with the provided ID.
    """
    if not project_dao.is_project_exist(project_id):
        raise ProjectNotFound(project_id)

    project = project_dao.get_project(project_id)
    if project.owner != sender_id:
        raise InvalidParameter("Only the project owner can invite members")

    if member_id in project.members:
        raise InvalidParameter("User is already a member of the project")

    project_dao.add_member_to_project(project_id, member_id)
    return True


def remove_member_by_id(sender_id: str, project_id: str, member_id: str):
    """
    Removes a user from a project.

    :param sender_id: The unique identifier of the user sending the removal request.
    :type sender_id: str

    :param project_id: The unique identifier of the project.
    :type project_id: str

    :param member_id: The unique identifier of the user being removed.
    :type member_id: str

    :raises ProjectNotFound: If no project is found with the provided ID.
    """
    if not project_dao.is_project_exist(project_id):
        raise ProjectNotFound(project_id)

    project = project_dao.get_project(project_id)
    if project.owner != sender_id or sender_id != member_id:
        raise InvalidParameter(
            "Only the project owner can remove members or the user can leave the project"
        )

    if member_id not in project.members:
        raise InvalidParameter("User is not a member of the project")

    if member_id in project.managers:
        result = project_dao.unassign_manager_from_project(project_id, member_id)

    if result.modified_count == 0:
        raise InvalidParameter("Error removing user as manager")

    project_dao.remove_member_from_project(project_id, member_id)
    return True


def assign_manager_role_to_user_by_id(sender_id: str, project_id: str, member_id: str):
    """
    Assigns a user as a manager of a project.

    :param sender_id: The unique identifier of the user assigning the manager role.
    :type sender_id: str

    :param project_id: The unique identifier of the project.
    :type project_id: str

    :param member_id: The unique identifier of the user being assigned as a manager.
    :type member_id: str

    :raises ProjectNotFound: If no project is found with the provided ID.
    """
    if not project_dao.is_project_exist(project_id):
        raise ProjectNotFound(project_id)

    project = project_dao.get_project(project_id)
    if project.owner != sender_id:
        raise InvalidParameter("Only the project owner can assign managers")

    if member_id not in project.members:
        raise InvalidParameter("User is not a member of the project")

    if member_id in project.managers:
        raise InvalidParameter("User is already a manager of the project")

    project_dao.assign_manager_to_project(project_id, member_id)
    return True


def unassign_member_role_from_user_by_id(
    sender_id: str, project_id: str, member_id: str
):
    """
    Unassigns a user from being a manager of a project.

    :param sender_id: The unique identifier of the user unassigning the manager role.
    :type sender_id: str

    :param project_id: The unique identifier of the project.
    :type project_id: str

    :param member_id: The unique identifier of the user being unassigned as a manager.
    :type member_id: str

    :raises ProjectNotFound: If no project is found with the provided ID.
    """
    if not project_dao.is_project_exist(project_id):
        raise ProjectNotFound(project_id)

    project = project_dao.get_project(project_id)
    if project.owner != sender_id:
        raise InvalidParameter("Only the project owner can unassign managers")

    if member_id not in project.members:
        raise InvalidParameter("User is not a member of the project")

    if member_id not in project.managers:
        raise InvalidParameter("User is not a manager of the project")

    project_dao.unassign_manager_from_project(project_id, member_id)
    return True
