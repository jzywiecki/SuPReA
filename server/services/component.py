"""
This module provides functionality for updating and retrieving project components.
"""

import ray

from typing import Dict

from database import project_dao, get_project_dao_ref

from ai import get_model_remote_ref_enum
from generation.generate import Generate
from generation.generate import GenerateWithMonitor
from generation.component import regenerate_component_by_ai_task
from generation.component import update_component_by_ai_task
from utils import InvalidParameter
from utils import ComponentNotFound, ProjectNotFound


def update_component_by_ai(request, generate_component_class: type(Generate)) -> None:
    """
    Updates a project component using AI-based generation.

    :param request: The request object containing project ID and query for component update.
    :type request: object with attributes `project_id` (str),`query` (str) and `ai_model` (str)

    :param generate_component_class: The class used for generating the component update.
    :type generate_component_class: type of `Generate`

    :raises InvalidParameter: If the project ID or query is missing.
    :raises ProjectNotFound: If the project with the specified ID does not exist.
    """
    if not request.ai_model:
        raise InvalidParameter("AI model cannot be empty")

    if not request.query:
        raise InvalidParameter("Invalid request arguments for AI")

    ai_model = get_model_remote_ref_enum(request.ai_model)
    update_component_by_ai_remote_task = update_component_by_ai_task.remote(
        request.component_val,
        request.query,
        ai_model,
        generate_component_class,
    )
    result = ray.get(update_component_by_ai_remote_task)
    return result


def regenerate_component_by_ai(
    request, generate_component_class: type(Generate)
) -> None:
    """
    Regenerate a project component using AI-based generation.

    :param request: The request object containing project ID and query for component update.
    :type request: object with attributes `project_id` (str) and `details` (str) and `ai_model` (str)

    :param generate_component_class: The class used for generating the component update.
    :type generate_component_class: type of `Generate`

    :raises InvalidParameter: If the project ID or query is missing or invalid.
    :raises ProjectNotFound: If the project with the specified ID does not exist.
    """
    if not request.ai_model:
        raise InvalidParameter("AI model cannot be empty")

    if not request.details:
        raise InvalidParameter("Invalid details arguments for AI")

    ai_model = get_model_remote_ref_enum(request.ai_model)

    regenerate_component_by_ai_remote_task = regenerate_component_by_ai_task.remote(
        request.details, ai_model, generate_component_class
    )
    result = ray.get(regenerate_component_by_ai_remote_task)
    return result


def update_component(request, generate_component_class: type(Generate)) -> None:
    """
    Updates a project component using value provided by user.

    :param request: The request object containing project ID and value for component update.
    :type request: object with attributes `project_id` (str) and `new_value` (component class)

    :param generate_component_class: The class used for generating the component update.
    :type generate_component_class: type of `Generate`

    :raises InvalidParameter: If the project ID or query is missing or invalid.
    :raises ProjectNotFound: If the project with the specified ID does not exist.
    :raises Exception: ray can throw some exception during generate.
    """
    if not request.project_id:
        raise InvalidParameter("Project id cannot be empty")

    if not request.new_val:
        raise InvalidParameter("Invalid new_val value")

    if not project_dao.check_project_exist(request.project_id):
        raise ProjectNotFound(request.project_id)

    generate_component = GenerateWithMonitor(generate_component_class())
    generate_component.update(request.new_val)
    generate_component.save_to_database(project_dao, request.project_id)


def get_component(project_id: str, model_name: str) -> Dict:
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
    if not project_dao.check_project_exist(project_id):
        raise ProjectNotFound(project_id)

    result = project_dao.get_project_component(project_id, model_name)
    if result is None:
        raise ComponentNotFound(project_id, model_name)

    return result
