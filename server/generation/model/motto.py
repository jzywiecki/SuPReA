"""
This module is responsible for generating motto data.
"""

from generation.generate import Generate
from models import Motto
from models import ComponentIdentify


expected_format = """
 "motto": "string"
"""


class MottoGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating motto models
    """

    def __init__(self):
        """
        Initializes the `MottoGenerate` instance
        """
        super().__init__(Motto, "motto", expected_format, ComponentIdentify.MOTTO)
