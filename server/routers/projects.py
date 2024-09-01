from fastapi import APIRouter, HTTPException, status, Response
from pydantic import BaseModel
from models import Project
import database.projects as projects_dao
from modules.project import ProjectAIGenerationActor
from bson.errors import InvalidId

from ai.open_ai import GPT35TurboInstance, DallE3Instance

router = APIRouter(
    tags=["projects"],
    prefix="/projects",
    responses={404: {"description": "Not found"}},
)


class EmptyProjectCreateRequest(BaseModel):
    name: str
    owner_id: str


@router.post(
    "/create-empty",
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
def create_empty(request: EmptyProjectCreateRequest):
    try:
        new_project_id = projects_dao.create_project(request.name, request.owner_id, "", "", "", "")
        return new_project_id

    except Exception as e:
        raise HTTPException(status_code=500, detail="INTERNAL SERVER ERROR")


class ProjectCreateRequest(BaseModel):
    name: str
    for_who: str
    doing_what: str
    additional_info: str
    owner_id: str


@router.post(
    "/create",
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
def create(request: ProjectCreateRequest):
    try:
        new_project_id = projects_dao.create_project(
            request.name,
            request.owner_id,
            "",
            request.for_who,
            request.doing_what,
            request.additional_info,
        )

        project_ai_generator = ProjectAIGenerationActor.remote()
        project_ai_generator.generate_components_by_ai.remote(GPT35TurboInstance, DallE3Instance, request.for_who,
                                                              request.doing_what, request.additional_info)
        project_ai_generator.save_components_to_database.remote(new_project_id)

        return new_project_id
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="INTERNAL SERVER ERROR")


@router.get(
    "/{project_id}",
    response_model=Project,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
def get_project(project_id: str):
    try:
        project = projects_dao.get_project(project_id)
        if project:
            return project
        else:
            return Response(status_code=status.HTTP_404_NOT_FOUND)
    except InvalidId:
        raise HTTPException(status_code=400, detail="INVALID PROJECT ID")
    except Exception:
        raise HTTPException(status_code=500, detail="INTERNAL SERVER ERROR")


@router.delete(
    "/{project_id}",
)
async def delete_project(project_id: str):
    try:
        delete_result = projects_dao.delete_project(project_id)
        if delete_result.deleted_count == 1:
            return Response(status_code=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status_code=status.HTTP_404_NOT_FOUND)
    except InvalidId:
        raise HTTPException(status_code=400, detail="INVALID PROJECT ID")
    except Exception:
        raise HTTPException(status_code=500, detail="INTERNAL SERVER ERROR")
