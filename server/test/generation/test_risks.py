import unittest
import json
from models import Risk, Risks
from generation.model.risks import RiskGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {
    "risks": [{"risk": "example", "description": "example", "prevention": "example"}]
}

invalid_data = {
    "risks": [{"name": "example", "description": "example", "prevention": "example"}]
}

invalid_format = "risk: example"

risk_one = Risk(risk="example", description="example", prevention="example")
risks_one = Risks(risks=[risk_one])

risk_two = Risk(risk="example two", description="example two", prevention="example two")
risks_two = Risks(risks=[risk_two])
# ============================================================


class TestFetchRisksFromDatabase(BaseTestFetchValueFromDatabase, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = RiskGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = risks_one


class TestUpdateRisks(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = RiskGenerate
        self.expected_value = risks_one


class TestGenerateRisksByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = RiskGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = risks_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateRisksByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = RiskGenerate
        self.prev_expected_value = risks_two
        self.expected_value = risks_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
