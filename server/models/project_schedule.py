import ray

from typing import List
from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.project_schedule import ScheduleModule
from ai.ai import AI


class Milestone(BaseModel):
    name: str
    description: str
    duration: str


class ProjectSchedule(BaseModel):
    milestones: List[Milestone]


@ray.remote
def generate_project_schedule(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    project_schedule_module = ScheduleModule(model=model_ai())
    project_schedule = generate_model(
        project_schedule_module, for_who, doing_what, additional_info, ProjectSchedule,
    )
    save_model_to_database(project_id, "project_schedule", project_schedule)
