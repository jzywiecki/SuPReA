import ray

import modules.module as modules
from models import Motto

expected_format = """
 "motto": "string"
"""


@ray.remote
class MottoModule(modules.Module):
    def __init__(self):
        super().__init__(Motto, "motto", expected_format)
