import unittest
import json
from models import Milestone, ProjectSchedule
from generation.model.project_schedule import ProjectScheduleGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {
    "milestones": [
        {"name": "example", "description": "example", "duration": "example"},
        {
            "name": "example two",
            "description": "example two",
            "duration": "example two",
        },
    ]
}

invalid_data = {
    "content": [
        {"name": "example", "description": "example", "duration": "example"},
        {
            "name": "example two",
            "description": "example two",
            "duration": "example two",
        },
    ]
}

invalid_format = "milestones: -[name: 'example', description: 'example', duration: 'example'], -[name: 'example two', description: 'example two', duration: 'example two']"

milestone_one = Milestone(name="example", description="example", duration="example")
milestone_two = Milestone(
    name="example two", description="example two", duration="example two"
)
project_schedule_one = ProjectSchedule(milestones=[milestone_one, milestone_two])

milestone_three = Milestone(
    name="example three", description="example three", duration="example three"
)
project_schedule_two = ProjectSchedule(milestones=[milestone_three])
# ============================================================


class TestFetchProjectScheduleFromDatabase(
    BaseTestFetchValueFromDatabase, unittest.TestCase
):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ProjectScheduleGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = project_schedule_one


class TestUpdateProjectSchedule(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ProjectScheduleGenerate
        self.expected_value = project_schedule_one


class TestGenerateProjectScheduleByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ProjectScheduleGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = project_schedule_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateProjectScheduleByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = ProjectScheduleGenerate
        self.prev_expected_value = project_schedule_two
        self.expected_value = project_schedule_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
