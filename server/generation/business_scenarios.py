from .generate import Generate
from models import BusinessScenarios
from models import ComponentIdentify

expected_format = """
    "business_scenario": {
        "title": "string",
        "description": "string",
        "features": [
            {"feature_name": "string", "description": "string"}
        ]
    }
"""


class BusinessScenariosGenerate(Generate):
    def __init__(self):
        super().__init__(
            BusinessScenarios,
            "business scenario",
            expected_format,
            ComponentIdentify.BUSINESS_SCENARIOS,
        )
