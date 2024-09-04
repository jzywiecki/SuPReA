from fastapi import HTTPException, status
import database.projects as projects_dao


def get_module(project_id: str, module_name):
    result = projects_dao.get_project_component(project_id, module_name)
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{module_name} not found")

    return result
