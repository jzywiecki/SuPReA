from utils import InvalidParameter, ProjectNotFound
from generation.project import generate_components_remote_wrapper
from ai import GPT35TurboInstance, DallE3Instance

import database.projects as projects_dao


def create_empty_project(request):
    if not request.name:
        raise InvalidParameter("Project name cannot be empty")

    new_project_id = projects_dao.create_project(
        request.name, request.owner_id, "", "", "", ""
    )

    return new_project_id


def create_project_by_ai(request):
    if not request.name:
        raise InvalidParameter("Project name cannot be empty")

    if not request.doing_what or not request.for_who:
        raise InvalidParameter("Invalid request arguments for AI")

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


def get_project_by_id(project_id: str):
    project = projects_dao.get_project(project_id)
    if project is None:
        raise ProjectNotFound(project_id)

    return project


def delete_project_by_id(project_id: str):
    if not projects_dao.is_project_exist(project_id):
        raise ProjectNotFound(project_id)

    return projects_dao.delete_project(project_id)


def get_project_list_by_user_id(user_id: str):
    # TODO: check if user exists

    project_list_member = projects_dao.get_projects_by_member(user_id)
    project_list_owner = projects_dao.get_projects_by_owner(user_id)
    result = {
        "owner": project_list_owner,
        "member": project_list_member,
    }
    return result
