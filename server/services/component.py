import database.projects as projects_dao

from ai import GPT35TurboInstance
from generation.component import update_component_task
from generation.generate import Generate
from utils import ProjectNotFound
from utils import InvalidParameter


def update_component(request, generate_component_class: type(Generate)):
    if not request.project_id:
        raise InvalidParameter("Project name cannot be empty")

    if not request.query:
        raise InvalidParameter("Invalid request arguments for AI")

    if not projects_dao.is_project_exist(request.project_id):
        raise ProjectNotFound(request.project_id)

    update_component_task.remote(request.project_id, request.query, GPT35TurboInstance, generate_component_class)
