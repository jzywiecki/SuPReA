"""
This module is responsible for generating a business scenarios model.
"""

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
    """
    A concrete implementation of the Generate class for generating and updating business scenario models.
    """
    def __init__(self):
        """
        Initializes the `BusinessScenariosGenerate` instance.
        """
        super().__init__(
            BusinessScenarios,
            "business scenario",
            expected_format,
            ComponentIdentify.BUSINESS_SCENARIOS,
        )
