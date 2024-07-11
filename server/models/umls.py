import ray
from typing import List
from pydantic import BaseModel

from server.models.models import generate_model, save_model_to_database
from server.modules.uml.routes import UmlModule


class UmlModel(BaseModel):
    code: str
    title: str


class UmlsModel(BaseModel):
    umls: List[UmlModel]


@ray.remote
def generate_umls(for_who: str, doing_what: str, additional_info: str) -> UmlsModel:
    return generate_model(UmlModule, for_who, doing_what, additional_info, UmlsModel)


@ray.remote
def save_umls_to_database(project_id: str, collection, model: UmlsModel):
    save_model_to_database(project_id, collection, "umls", model)