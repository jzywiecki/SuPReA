import ray

from pydantic import BaseModel
from typing import List

from server.models.models import generate_model, save_model_to_database
from server.modules.risk_module import RiskModule


class RiskModel(BaseModel):
    risk: str
    description: str
    prevention: str


class RisksModel(BaseModel):
    risks: List[RiskModel]


@ray.remote
def generate_risks(for_who: str, doing_what: str, additional_info: str) -> RiskModel:
    return generate_model(RiskModule, for_who, doing_what, additional_info, RiskModel)


@ray.remote
def save_risks_to_database(project_id: str, collection, model: RiskModel):
    save_model_to_database(project_id, collection, "risks", model)