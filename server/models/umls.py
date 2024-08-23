import ray
from typing import List
from pydantic import BaseModel

from models.model import generate_model, save_model_to_database
from modules.umls import UmlModule
from ai.ai import AI


class Uml(BaseModel):
    code: str
    title: str


class Umls(BaseModel):
    umls: List[Uml]


@ray.remote
def generate_umls(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    umls = generate_model(
        UmlModule, for_who, doing_what, additional_info, Umls, model_ai
    )
    save_model_to_database(project_id, "umls", umls)
