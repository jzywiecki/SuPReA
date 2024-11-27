"""
This module is responsible for generating motto data.
"""

from generation.generate import Generate
from models import Mottos
from models import ComponentIdentify


expected_format = """
    "mottos": [
        "generated motto1",
        "generated motto2",
        "generated motto3"
    ]
"""


class MottoGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating motto models
    """

    def __init__(self):
        """
        Initializes the `MottoGenerate` instance
        """
        super().__init__(Mottos, "mottos", expected_format, ComponentIdentify.MOTTO)
