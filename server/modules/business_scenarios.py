import ray

import modules.module as modules
from models import BusinessScenarios
from models import ProjectFields

expected_format = """
    "business_scenario": {
        "title": "string",
        "description": "string",
        "features": [
            {"feature_name": "string", "description": "string"}
        ]
    }
"""


@ray.remote
class BusinessScenariosModule(modules.Module):
    def __init__(self):
        super().__init__(BusinessScenarios, "business scenario", expected_format, ProjectFields.BUSINESS_SCENARIOS)
