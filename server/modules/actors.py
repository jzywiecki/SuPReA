import ray

import modules.module as modules
from models import Actors
from models import ProjectFields

expected_format = """
"actors": [
        {
            "name": "string",
            "description": "string"
        }
    ]
"""


@ray.remote
class ActorsModule(modules.Module):
    def __init__(self):
        super().__init__(Actors, "actors", expected_format, ProjectFields.ACTORS.value)
