import unittest
import json
from models import Specification, Specifications
from generation.model.specifications import SpecificationsGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {
    "specifications": [{"specification": "example", "description": "example"}]
}

invalid_data = {"specification": [{"name": "example", "description": "example"}]}

invalid_format = "specification: example"

specification_one = Specification(specification="example", description="example")
specifications_one = Specifications(specifications=[specification_one])

specification_two = Specification(
    specification="example two", description="example two"
)
specifications_two = Specifications(specifications=[specification_two])
# ============================================================


class TestFetchSpecificationsFromDatabase(
    BaseTestFetchValueFromDatabase, unittest.TestCase
):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = SpecificationsGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = specifications_one


class TestUpdateSpecifications(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = SpecificationsGenerate
        self.expected_value = specifications_one


class TestGenerateSpecificationsByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = SpecificationsGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = specifications_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateSpecificationsByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = SpecificationsGenerate
        self.prev_expected_value = specifications_two
        self.expected_value = specifications_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
