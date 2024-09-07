"""
This module provides functionality for updating and retrieving project components.
"""

import database.projects as projects_dao

from ai import gpt_35_turbo
from generation.component import update_component_task
from generation.generate import Generate
from utils import InvalidParameter
from utils import ComponentNotFound, ProjectNotFound


def update_component(request, generate_component_class: type(Generate)):
    """
    Updates a project component using AI-based generation.

    :param request: The request object containing project ID and query for component update.
    :type request: object with attributes `project_id` (str) and `query` (str)

    :param generate_component_class: The class used for generating the component update.
    :type generate_component_class: type of `Generate`

    :raises InvalidParameter: If the project ID or query is missing or invalid.
    :raises ProjectNotFound: If the project with the specified ID does not exist.
    """
    if not request.project_id:
        raise InvalidParameter("Project name cannot be empty")

    if not request.query:
        raise InvalidParameter("Invalid request arguments for AI")

    if not projects_dao.is_project_exist(request.project_id):
        raise ProjectNotFound(request.project_id)

    update_component_task.remote(
        request.project_id, request.query, gpt_35_turbo, generate_component_class
    )


def get_component(project_id: str, model_name: str):
    """
    Retrieves a project component by its ID and model name.

    :param project_id: The unique identifier of the project.
    :type project_id: str

    :param model_name: The name of the model associated with the component.
    :type model_name: str

    :raises ProjectNotFound: If the project with the specified ID does not exist.
    :raises ComponentNotFound: If the component with the specified model name does not exist within the project.

    :return: The project component details.
    :rtype: dict
    """
    if not projects_dao.is_project_exist(project_id):
        raise ProjectNotFound(project_id)

    result = projects_dao.get_project_component(project_id, model_name)
    if result is None:
        raise ComponentNotFound(project_id, model_name)

    return result
