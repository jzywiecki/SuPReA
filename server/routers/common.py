from fastapi import HTTPException, Response, status
from bson.errors import InvalidId
import database.projects as projects_dao
from utils import logger


def get_module(project_id: str, module_name):
    try:
        result = projects_dao.get_project_component(project_id, module_name)
        if result is not None:
            return result

        return Response(status_code=status.HTTP_404_NOT_FOUND)
    except InvalidId:
        logger.exception(f"Invalid project id")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project id")
    except Exception as e:
        logger.error(f"{e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="INTERNAL SERVER ERROR")
