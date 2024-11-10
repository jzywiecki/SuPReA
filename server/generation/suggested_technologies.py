"""
This module is responsible for generating the suggested technologies data.
"""

from .generate import Generate
from models import ComponentIdentify, SuggestedTechnologies


expected_format = """
    "suggested_technologies": [
        {
            "name": "string",
            "description": "string"
        }
    ]
"""


class SuggestedTechnologiesGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating suggested technologies models
    """

    def __init__(self):
        """
        Initializes the `SuggestedTechnologies` instance
        """
        super().__init__(
            SuggestedTechnologies,
            "suggested technologies",
            expected_format,
            ComponentIdentify.SUGGESTED_TECHNOLOGIES,
        )
