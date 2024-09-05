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
    def __init__(self):
        super().__init__(
            Specifications,
            "specifications",
            expected_format,
            ComponentIdentify.SPECIFICATIONS,
        )
