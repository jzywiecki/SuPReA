from .generate import Generate
from models import ElevatorSpeech
from models import ComponentIdentify


expected_format = """
    "content": "string"
"""


class ElevatorSpeechGenerate(Generate):
    def __init__(self):
        super().__init__(
            ElevatorSpeech,
            "elevator speech",
            expected_format,
            ComponentIdentify.ELEVATOR_SPEECH,
        )
