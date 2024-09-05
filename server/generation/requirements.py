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
    def __init__(self):
        super().__init__(
            Requirements,
            "requirements",
            expected_format,
            ComponentIdentify.REQUIREMENTS,
        )
