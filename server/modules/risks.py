import ray

import modules.module as modules
from models import Risks
from models import ProjectFields


expected_format = """
    "risks": [
        {
            "risk": "string",
            "description": "string",
            "prevention": "string"
        }
    ]
"""


@ray.remote
class RiskModule(modules.Module):
    def __init__(self):
        super().__init__(Risks, "risks", expected_format, ProjectFields.RISKS.value)
