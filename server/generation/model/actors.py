"""
This module is responsible for generating a actors model.

"""

from generation.generate import Generate
from models import Actors
from models import ComponentIdentify

expected_format = """
"actors": [
        {
            "name": "string",
            "description": "string"
        }
    ]
"""


class ActorsGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating actor models.
    """

    def __init__(self):
        """
        Initializes the `ActorsGenerate` instance.
        """
        super().__init__(
            Actors, "few actors", expected_format, ComponentIdentify.ACTORS
        )
