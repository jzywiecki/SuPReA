from pydantic import BaseModel
from typing import List


class Feature(BaseModel):
    feature_name: str
    description: str


class BusinessScenario(BaseModel):
    title: str
    description: str
    features: List[Feature]


class BusinessScenarios(BaseModel):
    business_scenario: BusinessScenario
