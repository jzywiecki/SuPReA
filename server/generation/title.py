"""
This module is responsible for generating titles.
"""

from .generate import Generate
from models import Title
from models import ComponentIdentify


expected_format = """
    "names": [
        "generated name1",
        "generated name2",
        "generated name3"
    ]
"""


class TitleGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating title models.
    """
    def __init__(self):
        """
        Initializes the `TitleGenerate` instance.
        """
        super().__init__(Title, "title", expected_format, ComponentIdentify.TITLE)
