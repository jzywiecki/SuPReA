import ray

from typing import List
from pydantic import BaseModel

from server.models.models import generate_model, save_model_to_database
from server.modules.specifications_module import SpecificationModule


class SpecificationModel(BaseModel):
    name: str
    description: str


class SpecificationsModel(BaseModel):
    specifications: List[SpecificationModel]


@ray.remote
def generate_specifications(for_who: str, doing_what: str, additional_info: str, project_id: str, collection):
    specifications = generate_model(SpecificationModule, for_who, doing_what, additional_info, SpecificationsModel)
    save_model_to_database(project_id, collection, "specifications", specifications)