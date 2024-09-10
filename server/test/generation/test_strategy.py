import unittest
import json
from models import Strategy
from generation.strategy import StrategyGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {"strategy": "example"}

invalid_data = {"content": "example two"}

invalid_format = "example strategy"

strategy_one = Strategy(strategy="example")

strategy_two = Strategy(strategy="example two")
# ============================================================


class TestFetchStrategyFromDatabase(BaseTestFetchValueFromDatabase, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = StrategyGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = strategy_one


class TestUpdateStrategy(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = StrategyGenerate
        self.expected_value = strategy_one


class TestGenerateStrategyByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = StrategyGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = strategy_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateStrategyByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = StrategyGenerate
        self.prev_expected_value = strategy_two
        self.expected_value = strategy_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
