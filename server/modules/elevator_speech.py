import ray

import modules.module as modules
from models import ElevatorSpeech

expected_format = """
    "content": "string"
"""


@ray.remote
class ElevatorSpeechModule(modules.Module):
    def __init__(self):
        super().__init__(ElevatorSpeech, "elevator_speech", expected_format)
