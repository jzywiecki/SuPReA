import ray

import modules.module as modules
from models import Requirements

expected_format = """
    "functional_requirements": [
        {
            "name": "string",
            "description": "string",
            "priority": "string"
        }
    ], 
    "non_functional_requirements": [
        {
            "name": "string",
            "description": "string",
            "priority": "string"
        }
    ]
"""


@ray.remote
class RequirementsModule(modules.Module):
    def __init__(self):
        super().__init__(Requirements, "requirements", expected_format)

