import ray

from pydantic import BaseModel
from typing import List

from models.model import generate_model, save_model_to_database
from modules.business_scenarios.routes import BusinessModule


class Feature(BaseModel):
    feature_name: str
    description: str


class BusinessScenario(BaseModel):
    title: str
    description: str
    features: List[Feature]


class BusinessScenarios(BaseModel):
    business_scenario: BusinessScenario


@ray.remote
def generate_business_scenarios(for_who: str, doing_what: str, additional_info: str, project_id: str):
    business_scenarios = generate_model(BusinessModule, for_who, doing_what, additional_info, BusinessScenarios)
    save_model_to_database(project_id, "business_scenarios", business_scenarios)
