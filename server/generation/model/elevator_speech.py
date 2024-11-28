"""
This module is responsible for generating elevator speech content.
"""

from generation.generate import Generate
from models import ElevatorSpeeches
from models import ComponentIdentify


expected_format = """
    "elevator_speeches": [
        "generated elevator speech1",
        "generated elevator speech2",
        "generated elevator speech3"
    ]
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
            ElevatorSpeeches,
            "elevator speeches",
            expected_format,
            ComponentIdentify.ELEVATOR_SPEECH,
        )
