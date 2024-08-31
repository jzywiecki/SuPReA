import ray

import modules.module as modules
from models import ProjectSchedule

expected_format = """
    "milestones": [
        {
            "name": "string",
            "description": "string",
            "duration": "string"
        }
    ]
"""


@ray.remote
class ProjectScheduleModule(modules.Module):
    def __init__(self):
        super().__init__(ProjectSchedule, "schedule", expected_format)
