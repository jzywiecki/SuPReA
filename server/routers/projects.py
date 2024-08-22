from fastapi import APIRouter, Body, HTTPException, status, Response
from bson import ObjectId
from pydantic import BaseModel, Field
from pymongo import ReturnDocument

from models.projects import ProjectModel, ProjectCollection
from database import project_collection
from models.projects import generate_models_by_ai
from models.projects import create_project

from ai.open_ai import GPT35Turbo, DallE3

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
async def create_empty(request: EmptyProjectCreateRequest):
    try:
        new_project_id = await create_project(request.name, request.owner_id, "", "", "")
    except Exception as e:
        raise HTTPException(status_code=400, detail="INTERNAL SERVER ERROR")

    return new_project_id


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
async def create(request: ProjectCreateRequest):
    try:
        new_project_id = await create_project(request.name, request.owner_id, request.for_who, request.doing_what,
                                              request.additional_info)
    except Exception as e:
        print("ERROR IN CREATE PROJECT. DETAILS:")
        print(e)
        raise HTTPException(status_code=400, detail="INTERNAL SERVER ERROR")

    generate_models_by_ai.remote(new_project_id, request.for_who, request.doing_what, request.additional_info, DallE3, GPT35Turbo)

    return new_project_id


@router.get(
    "/",
    response_model=ProjectCollection,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
async def get_projects():
    projects = await project_collection.find().to_list(length=None)
    projects_collection = ProjectCollection(projects=projects)
    return projects_collection


@router.get(
    "/{project_id}",
    response_model=ProjectModel,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
async def get_project(project_id: str):
    project = await project_collection.find_one({"_id": ObjectId(project_id)})

    if project:
        return project
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@router.put(
    "/{project_id}",
    response_model=ProjectModel,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
async def update_project(project_id: str, project: ProjectModel = Body(...)):
    project = {
        k: v for k, v in project.model_dump(by_alias=True).items() if v is not None
    }
    if len(project) >= 1:
        update_result = await project_collection.find_one_and_update(
            {"_id": ObjectId(project_id)},
            {"$set": project},
            return_document=ReturnDocument.AFTER,
        )
        if update_result is not None:
            return update_result
        else:
            raise HTTPException(
                status_code=404, detail=f"Project {project_id} not found"
            )
    if (
            project := await project_collection.find_one({"_id": ObjectId(project_id)})
                       is not None
    ):
        return project
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


@router.delete(
    "/{project_id}",
)
async def delete_project(project_id: str):
    delete_result = await project_collection.delete_one({"_id": ObjectId(project_id)})
    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    raise HTTPException(status_code=404, detail=f"Project {project_id} not found")


async def get_module(project_id: str, module_name: str):
    project = await project_collection.find_one({"_id": ObjectId(project_id)}, {module_name: 1})

    if project and module_name in project:
        return project[module_name]
    else:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
