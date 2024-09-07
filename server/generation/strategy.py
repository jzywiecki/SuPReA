"""
This module is responsible for generating the strategy component.
"""

from .generate import Generate
from models import Strategy
from models import ComponentIdentify


expected_format = """
{
    "strategy": "string"
}
"""


class StrategyGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating strategy models.
    """
    def __init__(self):
        """
        Initializes the `StrategyGenerate` instance.
        """
        super().__init__(
            Strategy, "strategy", expected_format, ComponentIdentify.STRATEGY
        )
