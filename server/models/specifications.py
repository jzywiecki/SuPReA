import ray

from typing import List
from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.specifications import SpecificationsModule
from ai.ai import AI


class Specification(BaseModel):
    name: str
    description: str


class Specifications(BaseModel):
    specifications: List[Specification]


@ray.remote
def generate_specifications(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    specifications_module = SpecificationsModule(model=model_ai())
    specifications = generate_model(
        specifications_module,
        for_who,
        doing_what,
        additional_info,
        Specifications,
    )
    save_model_to_database(project_id, "specifications", specifications)
