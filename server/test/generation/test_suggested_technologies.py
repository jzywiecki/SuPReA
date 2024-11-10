import unittest
import json
from models import SuggestedTechnologies, Technology
from generation.model.suggested_technologies import SuggestedTechnologiesGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {
    "suggested_technologies": [
        {"name": "example", "description": "example description"},
        {"name": "example2", "description": "example description2"},
    ]
}

invalid_data = {"content": "test test"}

invalid_format = "example sugessted technologies"

technology_one = Technology(name="example", description="example description")
technology_two = Technology(name="example2", description="example description2")

suggested_technologies_one = SuggestedTechnologies(
    suggested_technologies=[technology_one, technology_two]
)

technology_three = Technology(name="example3", description="example description3")
suggested_technologies_two = SuggestedTechnologies(
    suggested_technologies=[technology_three]
)
# ============================================================


class TestFetchSuggestedTechnologiesFromDatabase(
    BaseTestFetchValueFromDatabase, unittest.TestCase
):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = SuggestedTechnologiesGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = suggested_technologies_one


class TestUpdateSuggestedTechnologies(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = SuggestedTechnologiesGenerate
        self.expected_value = suggested_technologies_one


class TestGenerateSuggestedTechnologiesByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = SuggestedTechnologiesGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = suggested_technologies_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateSuggestedTechnologiesByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = SuggestedTechnologiesGenerate
        self.prev_expected_value = suggested_technologies_two
        self.expected_value = suggested_technologies_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
