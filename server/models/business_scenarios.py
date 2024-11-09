from pydantic import BaseModel, Field
from typing import List, Optional


class Feature(BaseModel):
    feature_name: str
    description: str


class BusinessScenario(BaseModel):
    title: str
    description: str
    features: List[Feature]


class BusinessScenarios(BaseModel):
    business_scenario: Optional[BusinessScenario] = None
