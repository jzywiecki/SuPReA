from .generate import Generate
from models import ProjectSchedule
from models import ComponentIdentify


expected_format = """
    "milestones": [
        {
            "name": "string",
            "description": "string",
            "duration": "string"
        }
    ]
"""


class ProjectScheduleGenerate(Generate):
    def __init__(self):
        super().__init__(
            ProjectSchedule,
            "project schedule",
            expected_format,
            ComponentIdentify.PROJECT_SCHEDULE,
        )
