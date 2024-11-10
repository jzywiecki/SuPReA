"""
This module is responsible for generating project schedule data.
"""

from generation.generate import Generate
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
    """
    A concrete implementation of the Generate class for generating and updating project schedule models.
    """

    def __init__(self):
        """
        Initializes the `ProjectScheduleGenerate` instance.
        """
        super().__init__(
            ProjectSchedule,
            "project schedule",
            expected_format,
            ComponentIdentify.PROJECT_SCHEDULE,
        )
