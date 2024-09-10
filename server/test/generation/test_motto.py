import unittest
import json
from models import Motto
from generation.motto import MottoGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {
    "motto": "example"
}

invalid_data = {
    "content": "example"
}

invalid_format = "example"

motto_one = Motto(motto="example")

motto_two = Motto(motto="example two")
# ============================================================


class TestFetchMottoFromDatabase(BaseTestFetchValueFromDatabase, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = MottoGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = motto_one


class TestUpdateMotto(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = MottoGenerate
        self.expected_value = motto_one


class TestGenerateMottoByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = MottoGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = motto_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateMottoByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = MottoGenerate
        self.prev_expected_value = motto_two
        self.expected_value = motto_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
