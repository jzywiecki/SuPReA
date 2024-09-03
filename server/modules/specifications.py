import ray

import modules.module as modules
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


@ray.remote
class SpecificationsModule(modules.Module):
    def __init__(self):
        super().__init__(
            Specifications,
            "specifications",
            expected_format,
            ComponentIdentify.SPECIFICATIONS,
        )
