from fastapi import HTTPException, Request
from jwt import decode, ExpiredSignatureError, InvalidTokenError
from database import project_dao
from .exceptions import ProjectNotFound
from .loggers import logger
from database import project_dao

def get_token_from_headers(request: Request):
    """
    Extracts the raw JWT token directly from the Authorization header in the request.

    :param request: FastAPI Request object.
    :raises HTTPException: If the Authorization header is missing or improperly formatted.
    :return: JWT token as a string.
    """
    auth_header = request.headers.get("authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    return auth_header

def verify_project_membership(
    project_id: str,
    request: Request,
):
    """
    Verifies if the user is a member of the project. Supports raw JWT tokens from headers.

    :param project_id: The unique identifier of the project.
    :param request: FastAPI Request object.
    :raises HTTPException: If the user is not authorized or not a member.
    """
    token = get_token_from_headers(request)
    
    try:
        # Decode the token (replace 'secret' with your actual secret key)
        payload = decode(token, "secret", algorithms=["HS256"])
        logger.info(f"Decoded Payload: {payload}")
        
        user_email = payload.get("email")
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        members = project_dao.get_project_members(project_id)
        if user_email not in [member.get("email") for member in members]:
            raise HTTPException(status_code=404, detail="Project not found")

    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")

    return True
