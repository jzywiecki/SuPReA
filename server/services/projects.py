"""
This module provides functionality for managing projects, including creating, retrieving, and deleting projects.
It also integrates with AI models to generate project components.
"""

from utils import InvalidParameter, ProjectNotFound
from generation.project import generate_project_components_task
from ai import GPT35Turbo, DallE3
from database import project_dao, chat_dao, get_project_dao_ref


def create_empty_project(request):
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


def create_project_by_ai(request):
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
        GPT35Turbo(),
        DallE3(),
        get_project_dao_ref
    )

    return new_project_id


def get_project_by_id(project_id: str):
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


def delete_project_by_id(project_id: str):
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

    return project_dao.delete_project(project_id)


def get_project_list_by_user_id(user_id: str):
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
