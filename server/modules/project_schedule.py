import ray

import modules.module as modules
from models import ProjectSchedule
from models import ProjectFields


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
        super().__init__(ProjectSchedule, "project schedule", expected_format, ProjectFields.PROJECT_SCHEDULE.value)
