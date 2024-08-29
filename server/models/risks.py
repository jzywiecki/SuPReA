import ray

from pydantic import BaseModel
from typing import List

from models.model import generate_model, save_model_to_database
from modules.risks import RiskModule
from ai.ai import AI


class Risk(BaseModel):
    risk: str
    description: str
    prevention: str


class Risks(BaseModel):
    risks: List[Risk]


@ray.remote
def generate_risks(
    for_who: str,
    doing_what: str,
    additional_info: str,
    project_id: str,
    model_ai: type[AI],
):
    risk_module = RiskModule(model=model_ai())
    risks = generate_model(
        risk_module, for_who, doing_what, additional_info, Risks,
    )
    save_model_to_database(project_id, "risks", risks)
