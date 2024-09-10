import unittest
import json
from models import Title
from generation.title import TitleGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {"names": ["example", "example two"]}

invalid_data = {"titles": ["example three"]}

invalid_format = "title: example"

title_one = Title(names=["example", "example two"])

title_two = Title(names=["example", "example three"])
# ============================================================


class TestFetchTitlesFromDatabase(BaseTestFetchValueFromDatabase, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = TitleGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = title_one


class TestUpdateTitles(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = TitleGenerate
        self.expected_value = title_one


class TestGenerateTitlesByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = TitleGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = title_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateTitlesByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = TitleGenerate
        self.prev_expected_value = title_two
        self.expected_value = title_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
