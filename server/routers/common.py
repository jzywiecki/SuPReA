from fastapi import HTTPException
from bson.errors import InvalidId
from database import projects_dao


def get_module(project_id: str, module_name):
    try:
        result = projects_dao.get_project_component(project_id, module_name)
        if result is None:
            raise HTTPException(status_code=404, detail="Resource not found")
        return result
    except HTTPException as ex:
        raise ex
    except InvalidId as ex:
        raise HTTPException(status_code=400, detail="Invalid project ID")
    except Exception as ex:
        raise HTTPException(status_code=500, detail="Internal Server Error")
