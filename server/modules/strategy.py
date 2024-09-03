import ray

import modules.module as modules
from models import Strategy
from models import ComponentIdentify


expected_format = """
{
    "strategy": "string"
}
"""


@ray.remote
class StrategyModule(modules.Module):
    def __init__(self):
        super().__init__(Strategy, "strategy", expected_format, ComponentIdentify.STRATEGY)
