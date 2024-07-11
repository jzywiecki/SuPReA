import ray

from pydantic import BaseModel
from typing import List

from server.models.models import generate_model, save_model_to_database
from server.modules.requirements_module.routes import RequirementsModule


class FunctionalRequirementModel(BaseModel):
    name: str
    description: str
    priority: str


class NonFunctionalRequirementModel(BaseModel):
    name: str
    description: str
    priority: str


class RequirementsModel(BaseModel):
    functional_requirements: List[FunctionalRequirementModel]
    non_functional_requirements: List[NonFunctionalRequirementModel]


@ray.remote
def generate_requirements(for_who: str, doing_what: str, additional_info: str, project_id: str, collection):
    requirements = generate_model(RequirementsModule, for_who, doing_what, additional_info, RequirementsModel)
    save_model_to_database(project_id, collection, "requirements", requirements)