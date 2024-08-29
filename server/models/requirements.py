import ray

from pydantic import BaseModel
from typing import List

from models.model import generate_model, save_model_to_database
from modules.requirements import RequirementsModule
from ai.ai import AI


class FunctionalRequirement(BaseModel):
    name: str
    description: str
    priority: str


class NonFunctionalRequirement(BaseModel):
    name: str
    description: str
    priority: str


class Requirements(BaseModel):
    functional_requirements: List[FunctionalRequirement]
    non_functional_requirements: List[NonFunctionalRequirement]


@ray.remote
def generate_requirements(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    requirements_module = RequirementsModule(model=model_ai())
    requirements = generate_model(
        requirements_module, for_who, doing_what, additional_info, Requirements,
    )
    save_model_to_database(project_id, "requirements", requirements)
