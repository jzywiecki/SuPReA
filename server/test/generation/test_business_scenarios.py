import unittest
import json
from models import BusinessScenario, BusinessScenarios, Feature
from generation.model.business_scenarios import BusinessScenariosGenerate

from .base import BaseTestFetchValueFromDatabase
from .base import BaseTestUpdate
from .base import BaseTestGenerateByAI
from .base import BaseTestUpdateByAI


# Test data ===================================================
correct_data = {
    "business_scenario": {
        "title": "business_scenario_one",
        "description": "example",
        "features": [
            {"feature_name": "feature_one", "description": "example"},
            {"feature_name": "feature_two", "description": "example"},
        ],
    }
}

invalid_data = {
    "business_scenario INVALID": {
        "title": "business_scenario_one",
        "description": "example",
        "features": [
            {"feature_name": "feature_one", "description": "example"},
            {"feature_name": "feature_two", "description": "example"},
        ],
    }
}

invalid_format = "business_scenario: - title: business_scenario_one - description: example - features: - feature_name: feature_one - description: example - feature_name: feature_two - description: example"

feature_one = Feature(feature_name="feature_one", description="example")
feature_two = Feature(feature_name="feature_two", description="example")
feature_three = Feature(feature_name="feature_three", description="example")
feature_four = Feature(feature_name="feature_four", description="example")

business_scenario_one = BusinessScenarios(
    business_scenario=BusinessScenario(
        title="business_scenario_one",
        description="example",
        features=[feature_one, feature_two],
    )
)
business_scenario_two = BusinessScenarios(
    business_scenario=BusinessScenario(
        title="business_scenario_two",
        description="example",
        features=[feature_three, feature_four],
    )
)
# ============================================================


class TestFetchBusinessScenariosFromDatabase(
    BaseTestFetchValueFromDatabase, unittest.TestCase
):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = BusinessScenariosGenerate
        self.correct_data_from_db = correct_data
        self.invalid_data_from_db = invalid_data
        self.expected_value = business_scenario_one


class TestUpdateBusinessScenarios(BaseTestUpdate, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = BusinessScenariosGenerate
        self.expected_value = business_scenario_one


class TestGenerateBusinessScenariosByAI(BaseTestGenerateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = BusinessScenariosGenerate
        self.correct_generated_data = json.dumps(correct_data)
        self.expected_value = business_scenario_one
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


class TestUpdateBusinessScenariosByAI(BaseTestUpdateByAI, unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.generate_class = BusinessScenariosGenerate
        self.prev_expected_value = business_scenario_two
        self.expected_value = business_scenario_one
        self.correct_generated_data = json.dumps(correct_data)
        self.invalid_generated_data_format = invalid_format
        self.invalid_generated_json = json.dumps(invalid_data)


if __name__ == "__main__":
    unittest.main()
