import ray
from typing import List
from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.uml.routes import UmlModule


class Uml(BaseModel):
    code: str
    title: str


class Umls(BaseModel):
    umls: List[Uml]


@ray.remote
def generate_umls(for_who: str, doing_what: str, additional_info: str, project_id: str):
    umls = generate_model(UmlModule, for_who, doing_what, additional_info, Umls)
    save_model_to_database(project_id, "umls", umls)
