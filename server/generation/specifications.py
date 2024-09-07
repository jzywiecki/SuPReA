"""
This module is responsible for generating the specifications component of the
"""

from .generate import Generate
from models import Specifications
from models import ComponentIdentify


expected_format = """
    "specifications": [
        {
            "specification": "string",
            "description": "string"
        }
    ]
"""


class SpecificationsGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating specifications models.
    """

    def __init__(self):
        """
        Initializes the `SpecificationsGenerate` instance.
        """
        super().__init__(
            Specifications,
            "specifications",
            expected_format,
            ComponentIdentify.SPECIFICATIONS,
        )
