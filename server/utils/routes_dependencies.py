from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt import decode, ExpiredSignatureError, InvalidTokenError
from models import ProjectNotFound
from database import project_dao

security = HTTPBearer()

def verify_project_membership(
    project_id: str,
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """
    Verifies if the user (extracted from JWT in Authorization header) is a member of the project.

    :param project_id: The unique identifier of the project.
    :param credentials: JWT token credentials from the Authorization header.

    :raises HTTPException: If the user is not authorized or not a member.
    """
    try:
        # Extract JWT token from the Authorization header
        token = credentials.credentials
        
        # Decode the token, replace 'your_secret_key' with your actual key
        payload = decode(token, "your_secret_key", algorithms=["HS256"])
        
        # Extract user email from the decoded token payload
        user_email = payload.get("email")
        if not user_email:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        
        # Fetch project by ID using DAO
        project = project_dao.get_project(project_id)
        if not project:
            raise ProjectNotFound(project_id)
        
        # Check if the user is in the project's members list
        members = project.get("members", [])
        if user_email not in [member.get("email") for member in members]:
            raise HTTPException(
                status_code=403, detail="User is not a member of the project"
            )
    
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except ProjectNotFound:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return True
