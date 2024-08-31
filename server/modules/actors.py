import ray

import modules.module as modules
from models.actors import Actors

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
        super().__init__(Actors, "actors", expected_format)
