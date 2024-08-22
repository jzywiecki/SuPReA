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
def generate_risks(for_who: str, doing_what: str, additional_info: str, project_id: str, model_ai: type[AI]):
    risks = generate_model(RiskModule, for_who, doing_what, additional_info, Risks, model_ai)
    save_model_to_database(project_id, "risks", risks)