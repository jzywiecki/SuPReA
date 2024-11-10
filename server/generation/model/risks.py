"""
This module is responsible for generating the risks data.
"""

from generation.generate import Generate
from models import Risks
from models import ComponentIdentify


expected_format = """
    "risks": [
        {
            "risk": "string",
            "description": "string",
            "prevention": "string"
        }
    ]
"""


class RiskGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating risks models
    """

    def __init__(self):
        """
        Initializes the `RiskGenerate` instance
        """
        super().__init__(Risks, "risks", expected_format, ComponentIdentify.RISKS)
