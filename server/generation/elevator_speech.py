"""
This module is responsible for generating elevator speech content.
"""

from .generate import Generate
from models import ElevatorSpeech
from models import ComponentIdentify


expected_format = """
    "content": "string"
"""


class ElevatorSpeechGenerate(Generate):
    """
    A concrete implementation of the Generate class for generating and updating elevator speech content.
    """

    def __init__(self):
        """
        Initializes the `ElevatorSpeechGenerate` instance.
        """
        super().__init__(
            ElevatorSpeech,
            "elevator speech",
            expected_format,
            ComponentIdentify.ELEVATOR_SPEECH,
        )
