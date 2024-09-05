from .generate import Generate
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
    def __init__(self):
        super().__init__(
            Actors, "few actors", expected_format, ComponentIdentify.ACTORS
        )
