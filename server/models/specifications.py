import ray

from typing import List
from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.specifications_module.routes import SpecificationsModule


class Specification(BaseModel):
    name: str
    description: str


class Specifications(BaseModel):
    specifications: List[Specification]


@ray.remote
def generate_specifications(for_who: str, doing_what: str, additional_info: str, project_id: str):
    specifications = generate_model(SpecificationsModule, for_who, doing_what, additional_info, Specifications)
    save_model_to_database(project_id, "specifications", specifications)