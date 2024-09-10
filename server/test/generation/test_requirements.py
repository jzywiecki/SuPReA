import unittest
import json
from models import FunctionalRequirement, NonFunctionalRequirement, Requirements
from generation.requirements import RequirementsGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {
    "functional_requirements": [
        {"name": "example", "description": "example", "priority": "example"}
    ],
    "non_functional_requirements": [
        {"name": "example", "description": "example", "priority": "example"}
    ],
}

invalid_data = {
    "functional": [
        {"name": "example", "description": "example", "priority": "example"}
    ],
    "non_functional": [{"name": "example", "description": "example"}],
}

invalid_format = "functional_requirements: name: example, description: example, priority: example, non_functional_requirements: name: example, description: example, priority: example"

functional_requirement_one = FunctionalRequirement(
    name="example", description="example", priority="example"
)
non_functional_requirement_one = NonFunctionalRequirement(
    name="example", description="example", priority="example"
)
requirements_one = Requirements(
    functional_requirements=[functional_requirement_one],
    non_functional_requirements=[non_functional_requirement_one],
)

functional_requirement_two = FunctionalRequirement(
    name="example 2", description="example 2", priority="example 2"
)
non_functional_requirement_two = NonFunctionalRequirement(
    name="example 2", description="example 2", priority="example 2"
)
requirements_two = Requirements(
    functional_requirements=[functional_requirement_two],
    non_functional_requirements=[non_functional_requirement_two],
)
# ============================================================


class TestFetchRequirementsFromDatabase(
    BaseTestFetchValueFromDatabase, unittest.TestCase
):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = RequirementsGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = requirements_one


class TestUpdateRequirements(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = RequirementsGenerate
        self.expected_value = requirements_one


class TestGenerateRequirementsByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = RequirementsGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = requirements_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateRequirementsByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = RequirementsGenerate
        self.prev_expected_value = requirements_two
        self.expected_value = requirements_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
