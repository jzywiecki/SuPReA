"""
This module is responsible for generating requirements data.
"""

from .generate import Generate
from models import Requirements
from models import ComponentIdentify


expected_format = """
    "functional_requirements": [
        {
            "name": "string",
            "description": "string",
            "priority": "string"
        }
    ], 
    "non_functional_requirements": [
        {
            "name": "string",
            "description": "string",
            "priority": "string"
        }
    ]
"""


class RequirementsGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating requirements models.
    """

    def __init__(self):
        """
        Initializes the `RequirementsGenerate` instance.
        """
        super().__init__(
            Requirements,
            "requirements",
            expected_format,
            ComponentIdentify.REQUIREMENTS,
        )
