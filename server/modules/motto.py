import ray

import modules.module as modules
from models import Motto
from models import ComponentIdentify


expected_format = """
 "motto": "string"
"""


@ray.remote
class MottoModule(modules.Module):
    def __init__(self):
        super().__init__(Motto, "motto", expected_format, ComponentIdentify.MOTTO)
