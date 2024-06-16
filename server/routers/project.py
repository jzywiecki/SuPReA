from fastapi import APIRouter, Body, HTTPException, status, Response
from bson import ObjectId
from server.models import ProjectModel, ProjectCollection
from server.database import project_collection
from datetime import datetime
from server.routers.actors import generate_actors
from server.routers.business_scenarios import generate_business_scenarios
from server.routers.elevator_speech import generate_elevator_speech
from server.routers.motto import generate_motto
from server.routers.project_schedule import generate_project_schedule
from server.routers.requirement import generate_requirements
from server.routers.risk import generate_risks
from server.routers.specifications import generate_specifications
from server.routers.strategy import generate_strategy
from server.routers.title import generate_title
from fastapi import BackgroundTasks

router = APIRouter(
    tags=["projects"],
    prefix="/projects",
    responses={404: {"description": "Not found"}},
)


@router.post(
    "/",
    response_model=ProjectModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_project(project: ProjectModel = Body(...)):
    new_project = await project_collection.insert_one(
        project.model_dump(by_alias=True, exclude=["id"])
    )
    created_project = await project_collection.find_one(
        {"_id": new_project.inserted_id}
    )
    return created_project


@router.post(
    "/create",
    response_model=ProjectModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_project(
    name: str,
    for_who: str,
    doing_what: str,
    additional_info: str,
    background_tasks: BackgroundTasks,
):
    new_project = ProjectModel(
        name=name,
        for_who=for_who,
        doing_what=doing_what,
        additional_info=additional_info,
        owner="test@devx.com",
        members=[],
        description="",
        created_at=datetime.now(),
        actors=None,
        business_scenarios=None,
        elevator_speech=None,
        motto=None,
        project_schedule=None,
        requirements=None,
        risks=None,
        specifications=None,
        strategy=None,
        title=None,
    )

    new_project = await project_collection.insert_one(
        new_project.model_dump(by_alias=True, exclude=["id"])
    )

    created_project = await project_collection.find_one(
        {"_id": new_project.inserted_id}
    )

    # run generation in the background
    background_tasks.add_task(generate_actors, str(created_project["_id"]))
    background_tasks.add_task(generate_business_scenarios, str(created_project["_id"]))
    background_tasks.add_task(generate_elevator_speech, str(created_project["_id"]))
    background_tasks.add_task(generate_motto, str(created_project["_id"]))
    background_tasks.add_task(generate_project_schedule, str(created_project["_id"]))
    background_tasks.add_task(generate_requirements, str(created_project["_id"]))
    background_tasks.add_task(generate_risks, str(created_project["_id"]))
    background_tasks.add_task(generate_specifications, str(created_project["_id"]))
    background_tasks.add_task(generate_strategy, str(created_project["_id"]))
    background_tasks.add_task(generate_title, str(created_project["_id"]))

    return created_project


@router.get(
    "/",
    response_model=ProjectCollection,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
async def get_projects():
    projects = await project_collection.find().to_list(length=None)
    return ProjectCollection(projects=projects)


@router.get(
    "/{project_id}",
    response_model=ProjectModel,
    status_code=status.HTTP_200_OK,
    response_model_by_alias=False,
)
async def get_project(project_id: str):
    if (
        project := await project_collection.find_one({"_id": ObjectId(project_id)})
    ) is not None:
        return project
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
