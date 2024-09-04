import database.projects as projects_dao
from utils import ModelNotFound, ProjectNotFound


def get_model(project_id: str, model_name: str):
    if not projects_dao.is_project_exist(project_id):
        raise ProjectNotFound(project_id)

    result = projects_dao.get_project_component(project_id, model_name)
    if result is None:
        raise ModelNotFound(project_id, model_name)

    return result
