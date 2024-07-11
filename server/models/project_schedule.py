import ray

from typing import List
from pydantic import BaseModel

from server.models.models import generate_model, save_model_to_database
from server.modules.project_schedule.routes import ScheduleModule


class MilestoneModel(BaseModel):
    name: str
    description: str
    duration: str


class ProjectScheduleModel(BaseModel):
    milestones: List[MilestoneModel]


@ray.remote
def generate_project_schedule(for_who: str, doing_what: str, additional_info: str) -> ProjectScheduleModel:
    return generate_model(ScheduleModule, for_who, doing_what, additional_info, ProjectScheduleModel)


@ray.remote
def save_project_schedule_to_database(project_id: str, collection, model: ProjectScheduleModel):
    save_model_to_database(project_id, collection, "project_schedule", model)
