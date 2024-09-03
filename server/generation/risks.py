from .generate import Generate
from models import Risks
from models import ComponentIdentify


expected_format = """
    "risks": [
        {
            "risk": "string",
            "description": "string",
            "prevention": "string"
        }
    ]
"""


class RiskGenerate(Generate):
    def __init__(self):
        super().__init__(Risks, "risks", expected_format, ComponentIdentify.RISKS)
