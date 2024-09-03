import ray

import modules.module as modules
from models import ElevatorSpeech
from models import ComponentIdentify


expected_format = """
    "content": "string"
"""


@ray.remote
class ElevatorSpeechModule(modules.Module):
    def __init__(self):
        super().__init__(
            ElevatorSpeech,
            "elevator speech",
            expected_format,
            ComponentIdentify.ELEVATOR_SPEECH,
        )
