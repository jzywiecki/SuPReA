from .generate import Generate
from models import Strategy
from models import ComponentIdentify


expected_format = """
{
    "strategy": "string"
}
"""


class StrategyGenerate(Generate):
    def __init__(self):
        super().__init__(
            Strategy, "strategy", expected_format, ComponentIdentify.STRATEGY
        )
