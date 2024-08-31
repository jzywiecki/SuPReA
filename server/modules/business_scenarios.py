import ray

import modules.module as modules
from models.business_scenarios import BusinessScenarios

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
        super().__init__(BusinessScenarios, "business_scenario", expected_format)
